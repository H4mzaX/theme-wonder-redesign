import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Truck, BadgeCheck, Lock, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useSEO } from "@/hooks/useSEO";

const FREE_SHIPPING_THRESHOLD = 1000;
const STANDARD_SHIPPING = 79;
const PARTIAL_COD_PERCENT = 20;

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const parsePrice = (s?: string) => parseInt((s || "").replace(/[₹,]/g, ""), 10) || 0;

declare global {
  interface Window {
    Cashfree?: any;
  }
}

// Lazily load Cashfree Drop SDK (sandbox)
function loadCashfree(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) return resolve(window.Cashfree);
    const s = document.createElement("script");
    s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    s.async = true;
    s.onload = () => {
      try {
        const cf = (window as any).Cashfree({ mode: "sandbox" });
        resolve(cf);
      } catch (e) {
        reject(e);
      }
    };
    s.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.body.appendChild(s);
  });
}

const Checkout = () => {
  useSEO({
    title: "Checkout — VCASE",
    description: "Secure checkout with prepaid or partial COD options.",
  });
  const navigate = useNavigate();
  const { items, subtotal: rawSubtotal, clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "partial_cod">("prepaid");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Redirect to home if cart empty (after first render to avoid flash)
  useEffect(() => {
    if (items.length === 0) navigate("/", { replace: true });
  }, [items.length, navigate]);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + parsePrice(i.price) * i.quantity, 0),
    [items],
  );
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (subtotal > 0 ? STANDARD_SHIPPING : 0);
  const total = subtotal + shippingFee;
  const advanceAmount =
    paymentMethod === "prepaid" ? total : Math.max(1, Math.round((total * PARTIAL_COD_PERCENT) / 100));
  const codAmount = paymentMethod === "partial_cod" ? total - advanceAmount : 0;

  const updateField = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const validate = (): string | null => {
    if (!form.name.trim()) return "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email required";
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) return "10-digit phone required";
    if (!form.line1.trim()) return "Address is required";
    if (!form.city.trim()) return "City required";
    if (!form.state.trim()) return "State required";
    if (!/^\d{6}$/.test(form.pincode)) return "6-digit pincode required";
    return null;
  };

  const handlePay = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.replace(/\D/g, ""),
        },
        shipping: {
          line1: form.line1.trim(),
          line2: form.line2.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          country: "India",
        },
        items: items.map((i) => ({
          variantId: i.variantId,
          productId: i.id,
          name: i.name,
          subtitle: i.subtitle,
          image: i.image,
          color: i.color,
          price: parsePrice(i.price),
          originalPrice: parsePrice(i.originalPrice ?? i.price),
          quantity: i.quantity,
        })),
        subtotal,
        shipping_fee: shippingFee,
        discount: 0,
        total,
        payment_method: paymentMethod,
        advance_amount: advanceAmount,
        cod_amount: codAmount,
      };

      const { data, error } = await supabase.functions.invoke("create-cashfree-order", {
        body: payload,
      });
      if (error) throw error;
      if (!data?.payment_session_id) throw new Error("Missing payment session");

      const cf = await loadCashfree();
      // Persist order_number so confirmation page can poll
      sessionStorage.setItem("vcase-pending-order", data.order_number);

      const result = await cf.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_modal",
      });

      if (result?.error) {
        toast.error(result.error.message || "Payment failed");
        setSubmitting(false);
        return;
      }
      if (result?.paymentDetails || result?.redirect === false) {
        // Verify on server before clearing cart
        navigate(`/order-confirmation?order_number=${data.order_number}`);
        clearCart();
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Could not start payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-xl sm:text-2xl tracking-wide">VCASE</h1>
          <span className="hidden sm:inline ml-3 text-xs text-muted-foreground">Secure Checkout</span>
          <Lock className="hidden sm:inline w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <div className="grid lg:grid-cols-[1fr_420px] gap-6 lg:gap-10">
          {/* LEFT — Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Contact */}
            <section className="bg-background rounded-xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Your name" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" inputMode="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@example.com" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile" className="mt-1.5" />
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="bg-background rounded-xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Shipping address</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <Label htmlFor="line1">Address line 1</Label>
                  <Input id="line1" value={form.line1} onChange={(e) => updateField("line1", e.target.value)} placeholder="House no., street, area" className="mt-1.5" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="line2">Address line 2 (optional)</Label>
                  <Input id="line2" value={form.line2} onChange={(e) => updateField("line2", e.target.value)} placeholder="Landmark" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => updateField("city", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => updateField("state", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))} className="mt-1.5" />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="bg-background rounded-xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Payment method</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as any)}
                className="space-y-3"
              >
                <label
                  htmlFor="pm-prepaid"
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "prepaid" ? "border-foreground bg-muted/40" : "border-border"}`}
                >
                  <RadioGroupItem value="prepaid" id="pm-prepaid" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">Pay full amount online</div>
                      <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">Recommended</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">UPI · Cards · Netbanking · Wallets via Cashfree</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{inr(total)}</div>
                  </div>
                </label>

                <label
                  htmlFor="pm-partial"
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "partial_cod" ? "border-foreground bg-muted/40" : "border-border"}`}
                >
                  <RadioGroupItem value="partial_cod" id="pm-partial" className="mt-1" />
                  <div className="flex-1">
                    <div className="font-medium">Partial COD — Pay {PARTIAL_COD_PERCENT}% now, rest on delivery</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pay {inr(advanceAmount)} now to confirm. Pay {inr(codAmount)} in cash on delivery.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{inr(advanceAmount)}</div>
                    <div className="text-[10px] text-muted-foreground">+ {inr(codAmount)} COD</div>
                  </div>
                </label>
              </RadioGroup>

              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% secure payment processed by Cashfree
              </div>
            </section>
          </motion.div>

          {/* RIGHT — Summary */}
          <aside className="lg:sticky lg:top-6 h-max">
            <div className="bg-background rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider">Order summary</h2>

              <div className="max-h-72 overflow-y-auto space-y-3 -mx-1 px-1">
                {items.map((it) => (
                  <div key={`${it.id}-${it.color}`} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                        {it.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{it.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{it.color}{it.subtitle ? ` · ${it.subtitle}` : ""}</div>
                    </div>
                    <div className="text-sm font-medium">{inr(parsePrice(it.price) * it.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>{inr(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <span className="text-success font-medium">FREE</span> : inr(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t mt-2">
                  <span>Total</span><span>{inr(total)}</span>
                </div>
                {paymentMethod === "partial_cod" && (
                  <div className="mt-3 p-3 bg-muted/60 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between"><span>Pay now (online)</span><span className="font-semibold">{inr(advanceAmount)}</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>Pay on delivery</span><span>{inr(codAmount)}</span></div>
                  </div>
                )}
              </div>

              <Button
                onClick={handlePay}
                disabled={submitting}
                className="w-full h-12 text-base"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</>
                ) : (
                  <>Pay {inr(advanceAmount)} securely</>
                )}
              </Button>

              <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground pt-1">
                <div className="flex flex-col items-center gap-1"><Truck className="w-4 h-4" /> Fast shipping</div>
                <div className="flex flex-col items-center gap-1"><BadgeCheck className="w-4 h-4" /> Easy returns</div>
                <div className="flex flex-col items-center gap-1"><ShieldCheck className="w-4 h-4" /> Secure pay</div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
