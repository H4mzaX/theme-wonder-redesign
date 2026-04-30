import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown,
  ChevronRight,
  Tag,
  Zap,
  Smartphone,
  Building2,
  Banknote,
  Gift,
  Clock,
  PartyPopper,
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
 * No tax is added on top — GST component is extracted for transparency.
 */
const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING = 0;
const QUICK_SHIPPING = 49;
const PARTIAL_COD_PERCENT = 20;
const COD_HANDLING_FEE = 100;
const GST_RATE = 0.18;
const PREPAID_DISCOUNT_FLAT = 20;

const inr = (n: number) =>
  `₹${Math.round(n).toLocaleString("en-IN")}`;
const inr2 = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const parsePrice = (s?: string) => parseInt((s || "").replace(/[₹,]/g, ""), 10) || 0;
const extractGST = (incl: number) => incl - incl / (1 + GST_RATE);

declare global {
  interface Window { Cashfree?: any; }
}

function loadCashfree(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) return resolve((window as any).Cashfree({ mode: "sandbox" }));
    const s = document.createElement("script");
    s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    s.async = true;
    s.onload = () => {
      try { resolve((window as any).Cashfree({ mode: "sandbox" })); }
      catch (e) { reject(e); }
    };
    s.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.body.appendChild(s);
  });
}

type PayMethodKey =
  | "upi"
  | "card"
  | "wallet"
  | "netbanking"
  | "partial_cod";

const Checkout = () => {
  useSEO({
    title: "Secure Checkout — VCASE",
    description: "Premium checkout with UPI, cards & partial COD. All prices include 18% GST.",
  });
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [activeMethod, setActiveMethod] = useState<PayMethodKey>("upi");
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "quick">("standard");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; amount: number } | null>(null);
  const [showAddress, setShowAddress] = useState(true);

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
  const productSavings = Math.max(0, originalSubtotal - subtotal);

  const baseShippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (subtotal > 0 ? 49 : 0);
  const shippingFee = deliverySpeed === "quick" ? baseShippingFee + QUICK_SHIPPING : baseShippingFee;

  const couponDiscount = couponApplied?.amount ?? 0;
  const totalBeforePayment = Math.max(0, subtotal + shippingFee - couponDiscount);

  // Per-method amounts
  const isOnlinePay = activeMethod !== "partial_cod";
  const onlineDiscount = isOnlinePay ? PREPAID_DISCOUNT_FLAT : 0;

  const codTotal = totalBeforePayment + COD_HANDLING_FEE;
  const codAdvance = Math.max(1, Math.round(codTotal * (PARTIAL_COD_PERCENT / 100)));
  const codBalance = codTotal - codAdvance;

  const finalTotal = activeMethod === "partial_cod"
    ? codTotal
    : totalBeforePayment - onlineDiscount;

  const advanceAmount = activeMethod === "partial_cod" ? codAdvance : finalTotal;
  const codAmount = activeMethod === "partial_cod" ? codBalance : 0;

  const totalSavings = productSavings + couponDiscount + onlineDiscount;
  const gstIncluded = extractGST(finalTotal);

  const updateField = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    if (code === "FLAT5") {
      const amt = Math.round(subtotal * 0.05);
      setCouponApplied({ code, amount: amt });
      toast.success(`FLAT5 applied! You saved ${inr(amt)}`);
    } else if (code === "FIRST100") {
      setCouponApplied({ code, amount: 100 });
      toast.success(`FIRST100 applied! ₹100 off`);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setCouponApplied(null);
    setCouponCode("");
  };

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
    if (err) { toast.error(err); setShowAddress(true); return; }
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
        discount: couponDiscount + onlineDiscount,
        total: finalTotal,
        payment_method: activeMethod === "partial_cod" ? "partial_cod" : "prepaid",
        advance_amount: advanceAmount,
        cod_amount: codAmount,
        coupon_code: couponApplied?.code,
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

  /* ── Method definitions ── */
  const onlineMethods: { key: PayMethodKey; label: string; sub?: string; icon: any; logos?: string[] }[] = [
    { key: "upi", label: "UPI Payment", sub: "Google Pay · PhonePe · Paytm + 10 more", icon: Smartphone },
    { key: "card", label: "Credit / Debit Card", sub: "Visa · Mastercard · Rupay · Amex", icon: CreditCard },
    { key: "wallet", label: "Wallets", sub: "Paytm · Mobikwik · Freecharge + more", icon: Wallet },
    { key: "netbanking", label: "Net Banking", sub: "All major banks supported", icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-32 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-display text-xl sm:text-2xl tracking-wider text-foreground">VCASE</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium bg-success/10 text-success px-2.5 py-1 rounded-full">
            <Lock className="w-3 h-3" /> Secure
          </div>
        </div>
        {/* Promo strip */}
        <div className="bg-foreground text-background text-[11px] sm:text-xs text-center py-2 px-4 font-medium tracking-wide">
          PREPAID ORDERS ARE DELIVERED FASTER <Zap className="inline w-3.5 h-3.5 -mt-0.5 fill-yellow-300 text-yellow-300" />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4 lg:py-8">
        <div className="grid lg:grid-cols-[1fr_440px] gap-4 lg:gap-8">
          {/* LEFT — main flow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 sm:space-y-4"
          >
            {/* Compact Order Summary (collapsible) */}
            <section className="bg-background rounded-2xl shadow-sm border border-border/50 overflow-hidden">
              <button
                onClick={() => setSummaryOpen(!summaryOpen)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold">Order summary</h2>
                    <span className="text-xs text-muted-foreground">
                      ({items.length} {items.length === 1 ? "Item" : "Items"})
                    </span>
                  </div>
                  {productSavings > 0 && (
                    <div className="mt-1 text-[11px] sm:text-xs text-success font-medium flex items-center gap-1">
                      <PartyPopper className="w-3 h-3" />
                      You save {inr(productSavings)} on MRP
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <div className="text-right">
                    {originalSubtotal > subtotal && (
                      <div className="text-xs text-muted-foreground line-through leading-none">
                        {inr2(originalSubtotal)}
                      </div>
                    )}
                    <div className="text-base sm:text-lg font-bold leading-tight mt-0.5">
                      {inr2(finalTotal)}
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${summaryOpen ? "rotate-180" : ""}`} />
                </div>
              </button>

              <AnimatePresence>
                {summaryOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-border/50 pt-4">
                      {items.map((it) => (
                        <div key={`${it.id}-${it.color}`} className="flex gap-3">
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/40">
                            <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                            <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                              {it.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-medium truncate">{it.name}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{it.color}</div>
                            <div className="text-[10px] text-muted-foreground">Incl. of all taxes</div>
                          </div>
                          <div className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                            {inr(parsePrice(it.price) * it.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {totalSavings > 0 && (
                <div className="mx-4 sm:mx-5 mb-4 sm:mb-5 bg-success/10 text-success rounded-xl px-3 py-2.5 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5">
                  <PartyPopper className="w-4 h-4" />
                  Yay! You're saving {inr(totalSavings)} on this order
                </div>
              )}
            </section>

            {/* Coupon */}
            <section className="bg-background rounded-2xl shadow-sm border border-border/50 p-3 sm:p-4">
              {couponApplied ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
                      <BadgeCheck className="w-4 h-4 text-success" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{couponApplied.code} applied</div>
                      <div className="text-[11px] text-success">You saved {inr(couponApplied.amount)}</div>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 h-11 rounded-lg bg-muted/40 border border-border/50">
                    <Tag className="w-4 h-4 text-success flex-shrink-0" />
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/70"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    disabled={!couponCode.trim()}
                    className="text-sm font-semibold text-primary disabled:text-muted-foreground/50 px-3 h-11"
                  >
                    Apply
                  </button>
                </div>
              )}
            </section>

            {/* Delivery details */}
            <section className="bg-background rounded-2xl shadow-sm border border-border/50 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold">Delivery details</h2>
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="text-xs font-semibold text-primary"
                >
                  {showAddress ? "Hide" : "Edit"}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {showAddress && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-2 gap-3 pt-1">
                      <div className="sm:col-span-2">
                        <Label htmlFor="name" className="text-[11px] uppercase tracking-wider text-muted-foreground">Full name</Label>
                        <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Your name" className="mt-1.5 h-11 text-base" style={{ fontSize: "16px" }} />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-[11px] uppercase tracking-wider text-muted-foreground">Email</Label>
                        <Input id="email" type="email" inputMode="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@example.com" className="mt-1.5 h-11" style={{ fontSize: "16px" }} />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-[11px] uppercase tracking-wider text-muted-foreground">Phone</Label>
                        <Input id="phone" type="tel" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile" className="mt-1.5 h-11" style={{ fontSize: "16px" }} />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="line1" className="text-[11px] uppercase tracking-wider text-muted-foreground">Address line 1</Label>
                        <Input id="line1" value={form.line1} onChange={(e) => updateField("line1", e.target.value)} placeholder="House no., street, area" className="mt-1.5 h-11" style={{ fontSize: "16px" }} />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="line2" className="text-[11px] uppercase tracking-wider text-muted-foreground">Landmark (optional)</Label>
                        <Input id="line2" value={form.line2} onChange={(e) => updateField("line2", e.target.value)} placeholder="Near…" className="mt-1.5 h-11" style={{ fontSize: "16px" }} />
                      </div>
                      <div>
                        <Label htmlFor="city" className="text-[11px] uppercase tracking-wider text-muted-foreground">City</Label>
                        <Input id="city" value={form.city} onChange={(e) => updateField("city", e.target.value)} className="mt-1.5 h-11" style={{ fontSize: "16px" }} />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-[11px] uppercase tracking-wider text-muted-foreground">State</Label>
                        <Input id="state" value={form.state} onChange={(e) => updateField("state", e.target.value)} className="mt-1.5 h-11" style={{ fontSize: "16px" }} />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="pincode" className="text-[11px] uppercase tracking-wider text-muted-foreground">Pincode</Label>
                        <Input id="pincode" inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))} className="mt-1.5 h-11" style={{ fontSize: "16px" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Delivery options */}
            <section className="bg-background rounded-2xl shadow-sm border border-border/50 p-4 sm:p-5">
              <h2 className="text-base font-bold mb-3">Delivery options</h2>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setDeliverySpeed("standard")}
                  className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                    deliverySpeed === "standard" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="text-xs font-semibold mb-0.5">Standard</div>
                  <div className={`text-[11px] font-medium ${deliverySpeed === "standard" ? "text-primary" : "text-foreground"}`}>
                    {new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
                  </div>
                  <div className="text-[10px] text-success font-semibold mt-1">Free</div>
                </button>
                <button
                  onClick={() => setDeliverySpeed("quick")}
                  className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                    deliverySpeed === "quick" ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="text-xs font-semibold mb-0.5 flex items-center gap-1">
                    Quick <Zap className="w-3 h-3 fill-yellow-400 text-yellow-500" />
                  </div>
                  <div className="text-[11px]">Delivery in 2 Days</div>
                  <div className="text-[10px] text-muted-foreground mt-1">+ ₹{QUICK_SHIPPING}</div>
                </button>
              </div>
            </section>

            {/* Pay via — accordion list */}
            <section className="bg-background rounded-2xl shadow-sm border border-border/50 overflow-hidden">
              <div className="p-4 sm:p-5 pb-3">
                <h2 className="text-base font-bold">Pay via</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-yellow-400 text-yellow-500" />
                  Enjoy fast delivery on all prepaid orders.
                </p>
              </div>

              <div className="divide-y divide-border/50">
                {onlineMethods.map((m) => {
                  const Icon = m.icon;
                  const isActive = activeMethod === m.key;
                  return (
                    <div key={m.key}>
                      <button
                        onClick={() => setActiveMethod(m.key)}
                        className="w-full px-4 sm:px-5 py-4 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors"
                      >
                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${isActive ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{m.label}</div>
                          {!isActive && (
                            <div className="text-[10px] text-success font-semibold mt-0.5 flex items-center gap-1">
                              <BadgeCheck className="w-3 h-3" /> Save ₹{PREPAID_DISCOUNT_FLAT}
                            </div>
                          )}
                        </div>
                        <div className="text-right flex items-center gap-2 flex-shrink-0">
                          <div>
                            <div className="text-xs text-muted-foreground line-through leading-none">
                              {inr(totalBeforePayment)}
                            </div>
                            <div className="text-sm font-bold leading-tight mt-0.5">
                              {inr(totalBeforePayment - PREPAID_DISCOUNT_FLAT)}
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isActive ? "rotate-90" : ""}`} />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-muted/20"
                          >
                            <div className="px-4 sm:px-5 py-4 space-y-3">
                              <div className="bg-success/10 text-success text-center text-xs font-semibold rounded-lg py-2">
                                Pay online and save ₹{PREPAID_DISCOUNT_FLAT}.00
                              </div>
                              <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                              {m.key === "upi" && (
                                <div className="grid grid-cols-4 gap-2 pt-1">
                                  {["Google Pay", "PhonePe", "Paytm", "+10"].map((w) => (
                                    <div key={w} className="border border-border/60 rounded-lg p-2.5 flex flex-col items-center gap-1.5 bg-background">
                                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                        {w === "+10" ? "+10" : w[0]}
                                      </div>
                                      <span className="text-[9px] text-center leading-tight truncate w-full">{w === "+10" ? "Others" : w}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Cash on Delivery (Partial) */}
                <div>
                  <button
                    onClick={() => setActiveMethod("partial_cod")}
                    className="w-full px-4 sm:px-5 py-4 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${activeMethod === "partial_cod" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">Cash on Delivery</div>
                      <div className="inline-block text-[10px] font-semibold mt-0.5 px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                        Inc. ₹{COD_HANDLING_FEE}.00 COD charges
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2 flex-shrink-0">
                      <div className="text-sm font-bold">{inr(codTotal)}</div>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeMethod === "partial_cod" ? "rotate-90" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {activeMethod === "partial_cod" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-muted/20"
                      >
                        <div className="px-4 sm:px-5 py-4 space-y-2.5 text-xs">
                          <p className="text-muted-foreground">
                            Pay {PARTIAL_COD_PERCENT}% advance to confirm your order. Balance collected in cash on delivery.
                          </p>
                          <div className="bg-background border border-border/60 rounded-lg p-3 space-y-1.5">
                            <div className="flex justify-between font-semibold">
                              <span>Pay now (online)</span>
                              <span className="text-success">{inr(codAdvance)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Pay on delivery (cash)</span>
                              <span>{inr(codBalance)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-4 sm:p-5 pt-3 flex items-center gap-2 text-[11px] text-muted-foreground border-t border-border/50">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                256-bit encrypted · Powered by Cashfree
              </div>
            </section>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs">
              <div className="flex items-center gap-1.5 bg-background rounded-lg px-2.5 py-2.5 border border-border/50">
                <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" /> 100% Secure
              </div>
              <div className="flex items-center gap-1.5 bg-background rounded-lg px-2.5 py-2.5 border border-border/50">
                <Truck className="w-4 h-4 text-success flex-shrink-0" /> Fast Ship
              </div>
              <div className="flex items-center gap-1.5 bg-background rounded-lg px-2.5 py-2.5 border border-border/50">
                <BadgeCheck className="w-4 h-4 text-success flex-shrink-0" /> Easy Return
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Sticky summary (desktop) */}
          <aside className="hidden lg:block lg:sticky lg:top-32 h-max">
            <div className="bg-background rounded-2xl p-6 shadow-sm border border-border/50 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider">Bill Details</h2>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Item total ({items.length})</span>
                  <span>{inr2(originalSubtotal)}</span>
                </div>
                {productSavings > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Product discount</span>
                    <span>− {inr2(productSavings)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Coupon ({couponApplied?.code})</span>
                    <span>− {inr2(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping {shippingFee === 0 && <span className="text-[10px] text-success">FREE</span>}</span>
                  <span>{shippingFee === 0 ? "—" : inr2(shippingFee)}</span>
                </div>
                {onlineDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Prepaid offer</span>
                    <span>− {inr2(onlineDiscount)}</span>
                  </div>
                )}
                {activeMethod === "partial_cod" && (
                  <div className="flex justify-between text-orange-600">
                    <span>COD handling fee</span>
                    <span>+ {inr2(COD_HANDLING_FEE)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-muted-foreground italic pt-1">
                  <span>Includes 18% GST</span><span>{inr2(gstIncluded)}</span>
                </div>

                <div className="flex justify-between text-base font-bold pt-3 border-t border-border/60 mt-2">
                  <span>Total</span><span>{inr2(finalTotal)}</span>
                </div>

                {activeMethod === "partial_cod" && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-xl text-xs space-y-1.5 border border-border/50">
                    <div className="flex justify-between font-semibold">
                      <span>Pay now (online)</span>
                      <span className="text-success">{inr2(codAdvance)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Pay on delivery</span>
                      <span>{inr2(codBalance)}</span>
                    </div>
                  </div>
                )}
              </div>

              {totalSavings > 0 && (
                <div className="bg-success/10 text-success rounded-xl px-3 py-2 text-center text-xs font-semibold">
                  🎉 You saved {inr(totalSavings)} on this order
                </div>
              )}

              <Button
                onClick={handlePay}
                disabled={submitting}
                className="w-full h-12 text-base font-semibold"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" /> Pay {inr(advanceAmount)}</>
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

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/98 backdrop-blur-xl border-t border-border/60 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="min-w-0">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {activeMethod === "partial_cod" ? "Pay now" : "Total"}
            </div>
            <div className="text-lg font-bold leading-tight">{inr(advanceAmount)}</div>
            {activeMethod === "partial_cod" && (
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
