import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Package, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const inr = (n: number) => `₹${Math.round(Number(n)).toLocaleString("en-IN")}`;

interface OrderData {
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  advance_amount: number;
  cod_amount: number;
  payment_method: "prepaid" | "partial_cod";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  status: string;
  shopify_order_name?: string | null;
  line_items: any[];
  shipping_address: any;
}

const OrderConfirmation = () => {
  useSEO({ title: "Order confirmed — VCASE", description: "Thank you for your order." });
  const [params] = useSearchParams();
  const orderNumber = params.get("order_number") || params.get("order_id");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      setFailed(true);
      return;
    }

    let attempts = 0;
    let stop = false;

    const tick = async () => {
      attempts++;
      try {
        // First, ask backend to verify with Cashfree (also pushes to Shopify if paid)
        await supabase.functions.invoke("verify-cashfree-payment", {
          body: { order_number: orderNumber },
        });
        const { data } = await supabase.functions.invoke("get-order-status", {
          body: null,
          method: "GET",
        } as any);

        // The above invoke shape doesn't include query params; call via fetch
      } catch {/* ignore */}

      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-order-status?order_number=${encodeURIComponent(orderNumber)}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        });
        const json = await res.json();
        if (!stop && json && !json.error) {
          setOrder(json);
          setLoading(false);
          if (json.payment_status === "paid" || json.payment_status === "failed") {
            return; // stop polling
          }
        }
      } catch {/* ignore */}

      if (!stop && attempts < 8) {
        setTimeout(tick, 2000);
      } else if (!stop) {
        setLoading(false);
      }
    };

    tick();
    return () => { stop = true; };
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Confirming your payment…</p>
      </div>
    );
  }

  if (failed || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <XCircle className="w-12 h-12 text-destructive" />
        <h1 className="text-xl font-semibold">We couldn't find your order</h1>
        <p className="text-sm text-muted-foreground max-w-sm">If money was deducted, please contact our support — your order will be reflected within a few minutes.</p>
        <Link to="/"><Button variant="outline">Back to home</Button></Link>
      </div>
    );
  }

  const isPaid = order.payment_status === "paid";

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-2xl p-6 sm:p-10 shadow-sm text-center"
        >
          {isPaid ? (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-success" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-display tracking-wide mt-5">Order confirmed</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Thanks {order.customer_name.split(" ")[0]}, we've received your order.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
                <Loader2 className="w-9 h-9 text-amber-600 animate-spin" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-display tracking-wide mt-5">Awaiting payment</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Your order is reserved. Refresh in a moment if your payment was just completed.
              </p>
            </>
          )}

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
            <Package className="w-4 h-4" /> Order #{order.shopify_order_name ?? order.order_number}
          </div>

          <div className="mt-8 text-left bg-muted/40 rounded-xl p-5 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Total order value</span><span className="font-medium">{inr(order.total)}</span></div>
            {order.payment_method === "partial_cod" ? (
              <>
                <div className="flex justify-between"><span className="text-muted-foreground">Paid online</span><span className="font-medium text-success">{inr(order.advance_amount)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Pay on delivery</span><span className="font-medium">{inr(order.cod_amount)}</span></div>
              </>
            ) : (
              <div className="flex justify-between"><span className="text-muted-foreground">Paid online</span><span className="font-medium text-success">{inr(order.advance_amount)}</span></div>
            )}
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            A confirmation has been sent to <span className="font-medium text-foreground">{order.customer_email}</span>.
          </div>

          <Link to="/" className="block mt-8">
            <Button className="w-full h-12">Continue shopping</Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
