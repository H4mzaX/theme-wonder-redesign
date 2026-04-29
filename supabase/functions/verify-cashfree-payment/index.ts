// Verifies a Cashfree order's status, marks our DB order paid (or cancelled),
// and pushes the order into Shopify Admin API on success.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_DOMAIN = "ijbzye-jq.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";

const Body = z.object({ order_number: z.string().min(1) });

async function createShopifyOrder(order: any) {
  const token = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (!token) {
    console.warn("SHOPIFY_ACCESS_TOKEN not set — skipping Shopify push");
    return null;
  }

  const items = (order.line_items as any[]).map((it) => {
    const base: any = {
      title: it.name,
      quantity: it.quantity,
      price: it.price.toFixed(2),
      requires_shipping: true,
      taxable: false,
    };
    if (it.variantId) {
      // Shopify variant IDs come in as gid://shopify/ProductVariant/123 — extract numeric
      const numeric = String(it.variantId).split("/").pop();
      if (numeric && /^\d+$/.test(numeric)) base.variant_id = Number(numeric);
    }
    return base;
  });

  const isPartialCod = order.payment_method === "partial_cod";
  const addr = order.shipping_address;
  const [first_name, ...rest] = (order.customer_name as string).split(" ");
  const last_name = rest.join(" ") || "-";

  const payload = {
    order: {
      email: order.customer_email,
      phone: order.customer_phone,
      financial_status: isPartialCod ? "partially_paid" : "paid",
      send_receipt: true,
      send_fulfillment_receipt: false,
      tags: isPartialCod ? "Partial COD, Cashfree" : "Prepaid, Cashfree",
      note: isPartialCod
        ? `Advance ₹${order.advance_amount} paid via Cashfree. COD balance ₹${order.cod_amount} on delivery.`
        : `Fully paid via Cashfree. Cashfree order: ${order.cashfree_order_id}`,
      line_items: items,
      shipping_address: {
        first_name,
        last_name,
        address1: addr.line1,
        address2: addr.line2 || "",
        city: addr.city,
        province: addr.state,
        zip: addr.pincode,
        country: addr.country || "India",
        phone: order.customer_phone,
      },
      billing_address: {
        first_name,
        last_name,
        address1: addr.line1,
        address2: addr.line2 || "",
        city: addr.city,
        province: addr.state,
        zip: addr.pincode,
        country: addr.country || "India",
        phone: order.customer_phone,
      },
      shipping_lines: [
        {
          title: "Standard Shipping",
          price: Number(order.shipping_fee).toFixed(2),
          code: "STANDARD",
        },
      ],
      transactions: [
        {
          kind: "sale",
          status: "success",
          amount: Number(order.advance_amount).toFixed(2),
          gateway: "Cashfree",
        },
      ],
    },
  };

  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/orders.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json();
  if (!res.ok) {
    console.error("Shopify order create failed", data);
    return null;
  }
  return data.order;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const APP_ID = Deno.env.get("CASHFREE_APP_ID");
    const SECRET = Deno.env.get("CASHFREE_SECRET_KEY");
    if (!APP_ID || !SECRET) throw new Error("Cashfree credentials not configured");

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { order_number } = parsed.data;

    // Fetch payment status from Cashfree
    const cfRes = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${order_number}`,
      {
        headers: {
          "x-api-version": "2023-08-01",
          "x-client-id": APP_ID,
          "x-client-secret": SECRET,
        },
      },
    );
    const cf = await cfRes.json();
    if (!cfRes.ok) {
      return new Response(JSON.stringify({ error: cf.message ?? "Cashfree lookup failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: order, error: getErr } = await supabase
      .from("orders").select("*").eq("order_number", order_number).maybeSingle();
    if (getErr || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const status = cf.order_status; // PAID, ACTIVE, EXPIRED, etc.

    if (status === "PAID" && order.payment_status !== "paid") {
      // Push to Shopify
      const shopifyOrder = await createShopifyOrder(order);

      await supabase.from("orders").update({
        payment_status: "paid",
        status: "confirmed",
        shopify_order_id: shopifyOrder?.id?.toString() ?? null,
        shopify_order_name: shopifyOrder?.name ?? null,
      }).eq("order_number", order_number);
    } else if (status === "EXPIRED" || status === "CANCELLED" || status === "TERMINATED") {
      await supabase.from("orders").update({ payment_status: "failed" }).eq("order_number", order_number);
    }

    return new Response(
      JSON.stringify({
        status,
        order_number,
        payment_status: status === "PAID" ? "paid" : (status === "ACTIVE" ? "pending" : "failed"),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("verify-cashfree-payment error", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
