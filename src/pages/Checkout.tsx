import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Lock,
  Loader2,
  CreditCard,
  Wallet,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSEO } from "@/hooks/useSEO";

/* ───────────── Pricing Rules ─────────────
 * Catalog prices are TAX-INCLUSIVE (MRP includes 18% GST as per Indian law).
 * We DO NOT add tax on top — we extract & display the GST component for
 * transparency. Discounted prices also remain tax-inclusive.
 */
const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING = 79;
const PARTIAL_COD_PERCENT = 20;
const GST_RATE = 0.18; // 18% inclusive

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const parsePrice = (s?: string) => parseInt((s || "").replace(/[₹,]/g, ""), 10) || 0;
// Extract GST from a tax-inclusive amount: tax = amount - amount/(1+rate)
const extractGST = (incl: number) => incl - incl / (1 + GST_RATE);

declare global {
  interface Window {
    Cashfree?: any;
  }
}

function loadCashfree(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) return resolve((window as any).Cashfree({ mode: "sandbox" }));
    const s = document.createElement("script");
    s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    s.async = true;
    s.onload = () => {
      try {
        resolve((window as any).Cashfree({ mode: "sandbox" }));
      } catch (e) { reject(e); }
    };
    s.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.body.appendChild(s);
  });
}

const Checkout = () => {
  useSEO({
    title: "Secure Checkout — VCASE",
    description: "Premium checkout with UPI, cards & partial COD. All prices include 18% GST.",
  });
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "partial_cod">("prepaid");
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    line1: "", line2: "", city: "", state: "", pincode: "",
  });

  useEffect(() => {
    if (items.length === 0) navigate("/", { replace: true });
  }, [items.length, navigate]);

  // ── Money math (all tax-inclusive) ──
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + parsePrice(i.price) * i.quantity, 0),
    [items],
  );
  const originalSubtotal = useMemo(
    () => items.reduce((s, i) => s + parsePrice(i.originalPrice ?? i.price) * i.quantity, 0),
    [items],
  );
  const youSave = Math.max(0, originalSubtotal - subtotal);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (subtotal > 0 ? STANDARD_SHIPPING : 0);
  const total = subtotal + shippingFee;
  const gstIncluded = extractGST(total);

  // ── Prepaid bonus: 3% off when paying full amount online ──
  const prepaidDiscount = paymentMethod === "prepaid" ? Math.round(total * 0.03) : 0;
  const finalTotal = total - prepaidDiscount;

  // ── COD math: 20% advance of FINAL total (no prepaid discount applies) ──
  const advanceAmount =
    paymentMethod === "prepaid"
      ? finalTotal
      : Math.max(1, Math.round(total * (PARTIAL_COD_PERCENT / 100)));
  const codAmount = paymentMethod === "partial_cod" ? total - advanceAmount : 0;

  // Per-card display amounts (independent of selected method)
  const prepaidDisplayAmount = total - Math.round(total * 0.03);
  const codDisplayAdvance = Math.max(1, Math.round(total * (PARTIAL_COD_PERCENT / 100)));
  const codDisplayBalance = total - codDisplayAdvance;

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
    if (err) { toast.error(err); return; }
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
        discount: prepaidDiscount,
        total: finalTotal,
        payment_method: paymentMethod,
        advance_amount: advanceAmount,
        cod_amount: codAmount,
      };

      const { data, error } = await supabase.functions.invoke("create-cashfree-order", { body: payload });
      if (error) throw error;
      if (!data?.payment_session_id) throw new Error("Missing payment session");

      const cf = await loadCashfree();
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
    <div className="min-h-screen bg-gradient-to-b from-muted/40 via-background to-muted/20 pb-32 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-display text-xl sm:text-2xl tracking-wider text-foreground">VCASE</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground bg-success/10 text-success px-2.5 py-1 rounded-full">
            <Lock className="w-3 h-3" /> Secure Checkout
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-6 lg:py-10">
        {/* Trust strip — mobile only */}
        <div className="lg:hidden grid grid-cols-3 gap-2 mb-4 text-[10px]">
          <div className="flex items-center gap-1.5 bg-background rounded-lg px-2 py-2 border border-border/60">
            <ShieldCheck className="w-3.5 h-3.5 text-success flex-shrink-0" /> 100% Secure
          </div>
          <div className="flex items-center gap-1.5 bg-background rounded-lg px-2 py-2 border border-border/60">
            <Truck className="w-3.5 h-3.5 text-success flex-shrink-0" /> Fast Ship
          </div>
          <div className="flex items-center gap-1.5 bg-background rounded-lg px-2 py-2 border border-border/60">
            <BadgeCheck className="w-3.5 h-3.5 text-success flex-shrink-0" /> Easy Return
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_440px] gap-4 sm:gap-6 lg:gap-10">
          {/* LEFT — Form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-5"
          >
            {/* Contact */}
            <section className="bg-background rounded-2xl p-4 sm:p-6 shadow-sm border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-foreground text-background text-xs font-semibold flex items-center justify-center">1</span>
                <h2 className="text-sm font-semibold uppercase tracking-wider">Contact Details</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <Label htmlFor="name" className="text-xs">Full name</Label>
                  <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Your name" className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input id="email" type="email" inputMode="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@example.com" className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs">Phone</Label>
                  <Input id="phone" type="tel" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile" className="mt-1.5 h-11" />
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="bg-background rounded-2xl p-4 sm:p-6 shadow-sm border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-foreground text-background text-xs font-semibold flex items-center justify-center">2</span>
                <h2 className="text-sm font-semibold uppercase tracking-wider">Shipping Address</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <Label htmlFor="line1" className="text-xs">Address line 1</Label>
                  <Input id="line1" value={form.line1} onChange={(e) => updateField("line1", e.target.value)} placeholder="House no., street, area" className="mt-1.5 h-11" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="line2" className="text-xs">Landmark (optional)</Label>
                  <Input id="line2" value={form.line2} onChange={(e) => updateField("line2", e.target.value)} placeholder="Near…" className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label htmlFor="city" className="text-xs">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => updateField("city", e.target.value)} className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label htmlFor="state" className="text-xs">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => updateField("state", e.target.value)} className="mt-1.5 h-11" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="pincode" className="text-xs">Pincode</Label>
                  <Input id="pincode" inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))} className="mt-1.5 h-11" />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="bg-background rounded-2xl p-4 sm:p-6 shadow-sm border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-foreground text-background text-xs font-semibold flex items-center justify-center">3</span>
                <h2 className="text-sm font-semibold uppercase tracking-wider">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* Prepaid card — premium gradient */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("prepaid")}
                  className={`relative w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all overflow-hidden ${
                    paymentMethod === "prepaid"
                      ? "border-foreground bg-gradient-to-br from-foreground/[0.04] to-success/[0.06] shadow-md"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  {paymentMethod === "prepaid" && (
                    <span className="absolute top-3 right-3"><CheckCircle2 className="w-5 h-5 text-success" /></span>
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === "prepaid" ? "bg-foreground text-background" : "bg-muted"}`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-sm sm:text-base">Pay Online</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-success text-success-foreground rounded-full">
                          <Sparkles className="w-2.5 h-2.5" /> 3% OFF
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                        UPI · Cards · Netbanking · Wallets
                      </p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg sm:text-xl font-bold">{inr(prepaidDisplayAmount)}</span>
                        <span className="text-xs text-muted-foreground line-through">{inr(total)}</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Partial COD card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("partial_cod")}
                  className={`relative w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all ${
                    paymentMethod === "partial_cod"
                      ? "border-foreground bg-foreground/[0.03] shadow-md"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  {paymentMethod === "partial_cod" && (
                    <span className="absolute top-3 right-3"><CheckCircle2 className="w-5 h-5 text-success" /></span>
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === "partial_cod" ? "bg-foreground text-background" : "bg-muted"}`}>
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="font-semibold text-sm sm:text-base mb-1">
                        Cash on Delivery
                      </div>
                      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                        Pay {PARTIAL_COD_PERCENT}% advance to confirm, rest in cash on delivery
                      </p>
                      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-lg sm:text-xl font-bold">{inr(codDisplayAdvance)}</span>
                        <span className="text-[11px] text-muted-foreground">advance</span>
                        <span className="text-[11px] text-muted-foreground">·</span>
                        <span className="text-xs font-medium">{inr(codDisplayBalance)}</span>
                        <span className="text-[11px] text-muted-foreground">on delivery</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                256-bit encrypted · Powered by Cashfree
              </div>
            </section>
          </motion.div>

          {/* RIGHT — Summary */}
          <aside className="lg:sticky lg:top-24 h-max">
            <div className="bg-background rounded-2xl p-4 sm:p-6 shadow-sm border border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider">Order Summary</h2>
                <span className="text-[11px] text-muted-foreground">{items.length} item{items.length > 1 ? "s" : ""}</span>
              </div>

              {/* Items */}
              <div className="max-h-64 overflow-y-auto space-y-3 -mx-1 px-1">
                {items.map((it) => (
                  <div key={`${it.id}-${it.color}`} className="flex gap-3">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/40">
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                        {it.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium truncate">{it.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{it.color}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Incl. of all taxes</div>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                      {inr(parsePrice(it.price) * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-border/60 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>{inr(subtotal)}</span>
                </div>
                {youSave > 0 && (
                  <div className="flex justify-between text-success">
                    <span>You save</span><span>− {inr(youSave)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping {shippingFee === 0 && <span className="text-[10px] ml-1">(Free over ₹{FREE_SHIPPING_THRESHOLD})</span>}</span>
                  <span>{shippingFee === 0 ? <span className="text-success font-medium">FREE</span> : inr(shippingFee)}</span>
                </div>
                {prepaidDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Prepaid discount (3%)</span>
                    <span>− {inr(prepaidDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-muted-foreground italic pt-1">
                  <span>Includes 18% GST</span><span>{inr(gstIncluded)}</span>
                </div>

                <div className="flex justify-between text-base sm:text-lg font-bold pt-2.5 border-t border-border/60 mt-2">
                  <span>Total</span><span>{inr(finalTotal)}</span>
                </div>

                {paymentMethod === "partial_cod" && (
                  <div className="mt-3 p-3 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl text-xs space-y-1.5 border border-border/50">
                    <div className="flex justify-between font-semibold">
                      <span>Pay now (online)</span>
                      <span className="text-success">{inr(advanceAmount)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Pay on delivery (cash)</span>
                      <span>{inr(codAmount)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop CTA */}
              <Button
                onClick={handlePay}
                disabled={submitting}
                className="hidden lg:flex w-full h-12 text-base font-semibold"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</>
                ) : (
                  <>Pay {inr(advanceAmount)} securely</>
                )}
              </Button>

              <div className="hidden lg:grid grid-cols-3 gap-2 text-[10px] text-muted-foreground pt-1">
                <div className="flex flex-col items-center gap-1"><Truck className="w-4 h-4" /> Fast shipping</div>
                <div className="flex flex-col items-center gap-1"><BadgeCheck className="w-4 h-4" /> Easy returns</div>
                <div className="flex flex-col items-center gap-1"><ShieldCheck className="w-4 h-4" /> Secure pay</div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/98 backdrop-blur-xl border-t border-border/60 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {paymentMethod === "partial_cod" ? "Pay now" : "Total"}
            </div>
            <div className="text-lg font-bold leading-tight">{inr(advanceAmount)}</div>
            {paymentMethod === "partial_cod" && (
              <div className="text-[10px] text-muted-foreground">+ {inr(codAmount)} on delivery</div>
            )}
          </div>
          <Button
            onClick={handlePay}
            disabled={submitting}
            className="flex-1 h-12 text-sm font-semibold max-w-[60%]"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</>
            ) : (
              <><Lock className="w-3.5 h-3.5 mr-1.5" /> Pay Securely</>
            )}
          </Button>
        </div>
        <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
          <ShieldCheck className="w-3 h-3 text-success" /> Incl. 18% GST · 100% Secure
        </div>
      </div>
    </div>
  );
};

export default Checkout;
