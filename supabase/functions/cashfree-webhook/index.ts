// Cashfree → server webhook. We just trigger verify-cashfree-payment for the
// referenced order so DB + Shopify stay in sync even if the customer closes the tab.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-signature, x-webhook-timestamp",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const payload = await req.json();
    const orderNumber: string | undefined =
      payload?.data?.order?.order_id ?? payload?.order?.order_id;

    if (!orderNumber) {
      return new Response("ok", { status: 200, headers: corsHeaders });
    }

    // Fire-and-forget verify
    await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/verify-cashfree-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({ order_number: orderNumber }),
      },
    );

    return new Response("ok", { status: 200, headers: corsHeaders });
  } catch (e) {
    console.error("cashfree-webhook error", e);
    return new Response("ok", { status: 200, headers: corsHeaders });
  }
});
