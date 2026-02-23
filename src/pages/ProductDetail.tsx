import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight, Shield, Zap, Magnet, CheckCircle, Phone, Video, Package, Truck, CreditCard, Percent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { allProducts, colorImages, type Product } from "@/data/products";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";

const colorHex: Record<string, string> = {
  Clear: "#e5e5e5",
  "Jet Black": "#1a1a1a",
  Black: "#1a1a1a",
  Blue: "#2563eb",
  Pink: "#ec4899",
  Green: "#16a34a",
  "Saddle Brown": "#92400e",
  "Matte Black": "#333333",
};

const featureIcons: Record<string, { icon: typeof Shield; features: { icon: typeof Shield; label: string; sub: string }[] }> = {
  "MagSafe Cases": {
    icon: Shield,
    features: [
      { icon: Zap, label: "ClearFlow™", sub: "Technology" },
      { icon: Shield, label: "10.4 Feet Drop", sub: "Protection" },
      { icon: Magnet, label: "MagSafe", sub: "Compatible" },
      { icon: CheckCircle, label: "Lifetime", sub: "Warranty" },
    ],
  },
  "Silicone Cases": {
    icon: Shield,
    features: [
      { icon: Shield, label: "8ft Drop", sub: "Protection" },
      { icon: Zap, label: "Anti-Slip", sub: "Grip Texture" },
      { icon: CheckCircle, label: "Microfiber", sub: "Interior" },
      { icon: Magnet, label: "Wireless", sub: "Charging" },
    ],
  },
  "Leather Cases": {
    icon: Shield,
    features: [
      { icon: Zap, label: "Genuine", sub: "Leather" },
      { icon: Shield, label: "6ft Drop", sub: "Protection" },
      { icon: Magnet, label: "MagSafe", sub: "Compatible" },
      { icon: CheckCircle, label: "Natural", sub: "Patina" },
    ],
  },
};

const defaultFeatures = [
  { icon: Shield, label: "6ft Drop", sub: "Protection" },
  { icon: Zap, label: "Premium", sub: "Material" },
  { icon: Magnet, label: "Wireless", sub: "Charging" },
  { icon: CheckCircle, label: "1 Year", sub: "Warranty" },
];

const fakeReviews = [
  { name: "Rahul M.", rating: 5, date: "2 weeks ago", title: "Perfect fit!", body: "Snaps on perfectly with MagSafe. Love the feel and the clear back shows off my phone's color.", verified: true },
  { name: "Priya S.", rating: 5, date: "1 month ago", title: "Best case I've bought", body: "Super premium quality. The leather develops a beautiful patina. Worth every rupee.", verified: true },
  { name: "Arjun K.", rating: 4, date: "3 weeks ago", title: "Great protection", body: "Dropped my phone twice already and not a scratch. Only wish it came in more colors.", verified: true },
  { name: "Sneha D.", rating: 5, date: "1 week ago", title: "Love the texture", body: "The silicone grip is amazing. Phone never slips out of my hand anymore.", verified: false },
];

const offers = [
  { icon: Percent, title: "FLAT 5% OFF", sub: "On Purchase of Single Product." },
  { icon: Percent, title: "FLAT 10% OFF", sub: "On Purchase of 2 or More Products." },
  { icon: Truck, title: "FREE SHIPPING", sub: "On All Prepaid Orders." },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = allProducts.find((p) => p.id === id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);
  const offerRef = useRef<HTMLDivElement>(null);

  const galleryImages = product
    ? product.colors.map((c) => colorImages[c] || product.image)
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setCurrentImg(selectedColor);
  }, [selectedColor]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <Link to="/" className="text-sm text-muted-foreground underline">Back to Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const features = featureIcons[product.category]?.features || defaultFeatures;
  const emiPrice = Math.round(parseInt(product.price.replace(/[₹,]/g, "")) / 3);
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <section className="max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Image gallery */}
          <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            {/* Main image */}
            <div className="relative aspect-square bg-muted">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImg}
                  src={galleryImages[currentImg] || product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 sm:p-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>

              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImg((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentImg((prev) => (prev + 1) % galleryImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails — horizontal scroll */}
            <div
              ref={thumbRef}
              className="flex gap-2 px-4 py-3 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`flex-none w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === currentImg ? "border-foreground" : "border-border"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain bg-muted p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product info — casegear style */}
          <div className="px-4 sm:px-6 lg:px-10 py-5 lg:py-8 space-y-5">
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">{product.name}</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">{product.subtitle}</p>
            </div>

            {/* Rating badge */}
            <div className="inline-flex items-center gap-1.5 border border-border rounded-full px-3 py-1.5">
              <span className="text-sm font-bold">{product.rating.toFixed(1)}</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs text-muted-foreground">| {product.reviews} Reviews</span>
            </div>

            {/* Free replacement banner */}
            <p className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wide">
              FREE REPLACEMENT IF THE CASE TURNS YELLOW
            </p>

            {/* Price card */}
            <div className="border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">{product.price}</span>
                <span className="text-sm text-muted-foreground">MRP</span>
                <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                {product.discount && (
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {product.discount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
                <span className="text-xs sm:text-sm text-foreground">
                  or pay <strong>₹{emiPrice}/month</strong> at 0% EMI via <strong>VCASE</strong>
                </span>
                <button className="ml-auto text-xs font-semibold bg-foreground text-background px-3 py-1 rounded-lg whitespace-nowrap">
                  Buy On EMI
                </button>
              </div>
            </div>

            {/* Feature icons — 2x2 grid like casegear */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {features.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground leading-tight">{label}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div className="flex items-center gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(i)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      i === selectedColor ? "border-foreground ring-2 ring-foreground/20 scale-110" : "border-border"
                    }`}
                    style={{ backgroundColor: colorHex[color] || "#ccc" }}
                    title={color}
                  />
                ))}
              </div>
            )}

            {/* CTA buttons — full width, rounded pill like casegear */}
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-foreground/80 to-foreground text-background font-bold py-4 rounded-full text-sm sm:text-base tracking-wider hover:from-foreground hover:to-foreground/90 transition-all shadow-lg">
                ADD TO CART
              </button>
              <button className="w-full bg-foreground text-background font-bold py-4 rounded-full text-sm sm:text-base tracking-wider hover:bg-foreground/90 transition-colors">
                BUY NOW
              </button>
            </div>

            {/* Available Offers — horizontal scroll like casegear */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-bold text-foreground">Available Offers</h3>
                <span className="text-xs text-muted-foreground">View All</span>
              </div>
              <div
                ref={offerRef}
                className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x"
                style={{ scrollbarWidth: "none" }}
              >
                {offers.map((offer) => (
                  <div
                    key={offer.title}
                    className="flex-none w-[70vw] sm:w-[260px] snap-start flex items-center gap-3 border border-border rounded-2xl p-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <offer.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-foreground">{offer.title}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{offer.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Support cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 border border-border rounded-xl p-3">
                <Phone className="w-5 h-5 text-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">Get Support on Call</p>
                  <p className="text-[10px] text-muted-foreground">Talk to an agent</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border border-border rounded-xl p-3">
                <Video className="w-5 h-5 text-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">Live Product Demo</p>
                  <p className="text-[10px] text-muted-foreground">Shop on video call</p>
                </div>
              </div>
            </div>

            {/* Bottom trust row */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              {[
                { icon: Package, label: "7-Days Returnable" },
                { icon: CreditCard, label: "COD Available" },
                { icon: Shield, label: "Secure Payment" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews section below */}
        <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-12 border-t border-border">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>

          {/* Review summary */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">{product.rating.toFixed(1)}</p>
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{product.reviews} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 2 : 1;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-3">{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-7 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual reviews */}
          <div className="space-y-5">
            {fakeReviews.map((review, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{review.name}</p>
                      {review.verified && <p className="text-[10px] text-green-600">✓ Verified Purchase</p>}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`w-3 h-3 ${s < review.rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                  ))}
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{review.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-12 border-t border-border">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-5">You May Also Like</h2>
            <div
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
            >
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="flex-none w-[44vw] sm:w-[260px] lg:w-[280px] snap-start group block border border-border rounded-xl overflow-hidden bg-card"
                >
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    {p.discount && (
                      <span className="absolute top-2 left-2 bg-foreground text-background text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {p.discount}
                      </span>
                    )}
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-3 space-y-1.5">
                    <h3 className="font-semibold text-xs sm:text-sm truncate">{p.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{p.subtitle}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">{p.price}</span>
                      <span className="text-[10px] text-muted-foreground line-through">{p.originalPrice}</span>
                    </div>
                    <button className="w-full bg-foreground text-background text-[11px] font-semibold py-2 rounded-lg tracking-wider">
                      ADD TO CART
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Sticky mobile add-to-cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 flex items-center gap-3 z-50 lg:hidden">
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-foreground">{product.price}</p>
          <p className="text-[10px] text-muted-foreground line-through">{product.originalPrice}</p>
        </div>
        <button className="flex-1 bg-foreground text-background font-bold py-3 rounded-full text-sm tracking-wider">
          ADD TO CART
        </button>
      </div>

      <div className="lg:hidden h-16" />
      <Footer />
    </div>
  );
};

export default ProductDetail;
