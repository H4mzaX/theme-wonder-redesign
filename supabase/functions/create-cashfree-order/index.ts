// Creates a Cashfree order + persists a pending order in our DB
// Returns { payment_session_id, cf_order_id, order_number } so the frontend
// can launch the Cashfree Drop checkout.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ItemSchema = z.object({
  variantId: z.string().optional(),
  productId: z.string().optional(),
  name: z.string(),
  subtitle: z.string().optional().default(""),
  image: z.string().optional().default(""),
  color: z.string().optional().default("Default"),
  price: z.number().nonnegative(),
  originalPrice: z.number().nonnegative().optional(),
  quantity: z.number().int().min(1),
});

const BodySchema = z.object({
  customer: z.object({
    name: z.string().min(1).max(120),
    email: z.string().email(),
    phone: z.string().min(8).max(15),
  }),
  shipping: z.object({
    line1: z.string().min(1),
    line2: z.string().optional().default(""),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(4).max(10),
    country: z.string().default("India"),
  }),
  items: z.array(ItemSchema).min(1),
  subtotal: z.number().nonnegative(),
  shipping_fee: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  total: z.number().positive(),
  payment_method: z.enum(["prepaid", "partial_cod"]),
  advance_amount: z.number().nonnegative(),
  cod_amount: z.number().nonnegative(),
  coupon_code: z.string().optional(),
  notes: z.string().optional(),
});

function generateOrderNumber() {
  const ts = Date.now().toString().slice(-8);
  const rnd = Math.floor(Math.random() * 9000 + 1000);
  return `VC${ts}${rnd}`;
}

function getReturnOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && /^https?:\/\//i.test(origin)) return origin;

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      // Ignore malformed referer and use the configured fallback below.
    }
  }

  return Deno.env.get("SITE_URL")?.trim() || "https://theme-replicate-wonder.lovable.app";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const APP_ID = Deno.env.get("CASHFREE_APP_ID")?.trim();
    const SECRET = Deno.env.get("CASHFREE_SECRET_KEY")?.trim();
    if (!APP_ID || !SECRET) throw new Error("Cashfree credentials not configured");

    // Auto-detect environment from App ID prefix.
    // Cashfree convention: TEST* / sandbox* → sandbox, anything else → production.
    const isSandbox = /^(TEST|SANDBOX)/i.test(APP_ID);
    const CF_BASE = isSandbox
      ? "https://sandbox.cashfree.com/pg/orders"
      : "https://api.cashfree.com/pg/orders";

    console.log("Cashfree config:", {
      env: isSandbox ? "SANDBOX" : "PRODUCTION",
      app_id_prefix: APP_ID.substring(0, 6),
      app_id_length: APP_ID.length,
      secret_prefix: SECRET.substring(0, 6),
      secret_length: SECRET.length,
    });

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const body = parsed.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const order_number = generateOrderNumber();
    const returnOrigin = getReturnOrigin(req);

    // Cashfree always charges the "advance_amount" online.
    // For prepaid, advance_amount === total. For partial_cod, advance_amount === 20% of total.
    const cashfreeAmount = Math.round(body.advance_amount * 100) / 100;
    if (cashfreeAmount < 1) {
      throw new Error("Online payable amount must be at least ₹1");
    }

    // Create Cashfree order (auto-detected env)
    const cfRes = await fetch(CF_BASE, {
      method: "POST",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": APP_ID,
        "x-client-secret": SECRET,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: order_number,
        order_amount: cashfreeAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${order_number}`,
          customer_name: body.customer.name,
          customer_email: body.customer.email,
          customer_phone: body.customer.phone,
        },
        order_meta: {
          return_url: `${returnOrigin}/order-confirmation?order_id={order_id}`,
          notify_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/cashfree-webhook`,
        },
        order_note:
          body.payment_method === "partial_cod"
            ? `20% advance | COD balance ₹${body.cod_amount.toFixed(2)}`
            : "Full prepaid order",
      }),
    });

    const cfData = await cfRes.json();
    if (!cfRes.ok) {
      console.error("Cashfree create order failed", cfData);
      return new Response(
        JSON.stringify({ error: cfData.message || "Cashfree order failed", details: cfData }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Persist order
    const { error: dbErr } = await supabase.from("orders").insert({
      order_number,
      cashfree_order_id: cfData.cf_order_id?.toString() ?? order_number,
      customer_email: body.customer.email,
      customer_phone: body.customer.phone,
      customer_name: body.customer.name,
      shipping_address: body.shipping,
      line_items: body.items,
      subtotal: body.subtotal,
      shipping_fee: body.shipping_fee,
      discount: body.discount,
      total: body.total,
      payment_method: body.payment_method,
      advance_amount: body.advance_amount,
      cod_amount: body.cod_amount,
      coupon_code: body.coupon_code,
      notes: body.notes,
    });

    if (dbErr) {
      console.error("Order insert failed", dbErr);
      throw new Error("Failed to save order");
    }

    return new Response(
      JSON.stringify({
        order_number,
        cf_order_id: cfData.cf_order_id,
        payment_session_id: cfData.payment_session_id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("create-cashfree-order error", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
