import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star, ChevronLeft, ChevronRight, Shield, Zap, Magnet, CheckCircle,
  Phone, Video, Package, Truck, CreditCard, Percent, Minus, Plus,
  Share2, ChevronDown, MessageSquare, HelpCircle, Send, Droplets, Smartphone, Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { allProducts, colorImages, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";

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

const categoryHighlights: Record<string, { icon: typeof Shield; value: string; label: string }[]> = {
  "MagSafe Cases": [
    { icon: Magnet, value: "MagSafe", label: "Compatible" },
    { icon: Shield, value: "10.4ft", label: "Drop protection" },
    { icon: Droplets, value: "Anti-Yellow", label: "Technology" },
    { icon: Smartphone, value: "Slim Fit", label: "Profile" },
    { icon: Fingerprint, value: "Anti-Slip", label: "Grip texture" },
    { icon: Zap, value: "Wireless", label: "Charging" },
  ],
  "Silicone Cases": [
    { icon: Shield, value: "8ft", label: "Drop protection" },
    { icon: Fingerprint, value: "Anti-Slip", label: "Grip texture" },
    { icon: Smartphone, value: "Microfiber", label: "Interior" },
    { icon: Zap, value: "Wireless", label: "Charging" },
    { icon: Droplets, value: "Washable", label: "Surface" },
    { icon: CheckCircle, value: "1 Year", label: "Warranty" },
  ],
  "Leather Cases": [
    { icon: Zap, value: "Genuine", label: "Leather" },
    { icon: Shield, value: "6ft", label: "Drop protection" },
    { icon: Magnet, value: "MagSafe", label: "Compatible" },
    { icon: CheckCircle, value: "Patina", label: "Natural aging" },
    { icon: Smartphone, value: "Slim", label: "Profile" },
    { icon: Fingerprint, value: "Premium", label: "Hand feel" },
  ],
};

const defaultHighlights = [
  { icon: Shield, value: "6ft", label: "Drop protection" },
  { icon: Zap, value: "Premium", label: "Material" },
  { icon: Magnet, value: "Wireless", label: "Charging" },
  { icon: CheckCircle, value: "1 Year", label: "Warranty" },
  { icon: Smartphone, value: "Slim", label: "Profile" },
  { icon: Fingerprint, value: "Anti-Slip", label: "Grip" },
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

const techSpecs: Record<string, { section: string; items: { label: string; value: string }[] }[]> = {
  "MagSafe Cases": [
    {
      section: "Protection",
      items: [
        { label: "Drop Protection", value: "10.4 feet (military grade)" },
        { label: "Corner Protection", value: "Air-cushion technology" },
        { label: "Screen Protection", value: "Raised bezels, 1.2mm lip" },
        { label: "Camera Protection", value: "Raised camera ring" },
      ],
    },
    {
      section: "Design",
      items: [
        { label: "Material", value: "Polycarbonate + TPU hybrid" },
        { label: "Profile", value: "Slim fit, 1.2mm" },
        { label: "Weight", value: "32g" },
        { label: "Finish", value: "Anti-yellowing coating" },
      ],
    },
    {
      section: "Compatibility",
      items: [
        { label: "MagSafe", value: "Built-in magnets (38 N+)" },
        { label: "Wireless Charging", value: "Qi & Qi2 compatible" },
        { label: "Screen Protector", value: "Compatible with all" },
      ],
    },
  ],
  "Leather Cases": [
    {
      section: "Material",
      items: [
        { label: "Leather Type", value: "Genuine Italian full-grain" },
        { label: "Tanning", value: "Vegetable-tanned" },
        { label: "Interior", value: "Soft microfiber lining" },
        { label: "Weight", value: "42g" },
      ],
    },
    {
      section: "Protection",
      items: [
        { label: "Drop Protection", value: "6 feet" },
        { label: "Screen Protection", value: "Raised bezels" },
        { label: "Camera Protection", value: "Raised camera ring" },
      ],
    },
    {
      section: "Features",
      items: [
        { label: "MagSafe", value: "Built-in magnets" },
        { label: "Patina", value: "Develops natural patina over time" },
        { label: "Wireless Charging", value: "Compatible" },
      ],
    },
  ],
  "Silicone Cases": [
    {
      section: "Material",
      items: [
        { label: "Exterior", value: "Liquid silicone rubber" },
        { label: "Interior", value: "Soft microfiber lining" },
        { label: "Weight", value: "28g" },
        { label: "Finish", value: "Soft-touch matte" },
      ],
    },
    {
      section: "Protection",
      items: [
        { label: "Drop Protection", value: "8 feet" },
        { label: "Screen Protection", value: "Raised bezels, 1.5mm" },
        { label: "Camera Protection", value: "Raised camera ring" },
      ],
    },
    {
      section: "Compatibility",
      items: [
        { label: "Wireless Charging", value: "Qi compatible" },
        { label: "Screen Protector", value: "Compatible with all" },
      ],
    },
  ],
};

const defaultSpecs = techSpecs["MagSafe Cases"];

const faqItems = [
  { q: "Will this case make my phone bulky?", a: "No! Our cases are designed with a slim profile (1.2mm) that adds minimal bulk while providing maximum protection. You'll barely notice it's there." },
  { q: "Is the case compatible with wireless charging?", a: "Yes, all our cases are fully compatible with Qi and Qi2 wireless charging. MagSafe cases have built-in magnets for perfect alignment." },
  { q: "What if my case turns yellow?", a: "We offer a free replacement guarantee if your clear case turns yellow within the warranty period. Simply contact us with photos and we'll ship a new one." },
  { q: "How do I clean my case?", a: "For silicone and clear cases, wipe with a damp cloth and mild soap. For leather cases, use a dry microfiber cloth. Avoid harsh chemicals or submerging in water." },
  { q: "Do you offer international shipping?", a: "Currently we ship across India with free shipping on all prepaid orders. International shipping is coming soon." },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = allProducts.find((p) => p.id === id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const thumbRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const galleryImages = product
    ? product.colors.map((c) => colorImages[c] || product.image)
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setCurrentImg(selectedColor);
  }, [selectedColor]);

  // Show sticky bar when CTA is out of view
  useEffect(() => {
    if (!ctaRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, [product]);

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

  const highlights = categoryHighlights[product.category] || defaultHighlights;
  const specs = techSpecs[product.category] || defaultSpecs;
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const pairsWellWith = allProducts
    .filter((p) => p.category !== product.category && p.device === product.device)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        price: product.price,
        image: galleryImages[selectedColor] || product.image,
        color: product.colors[selectedColor] || "Default",
      });
    }
    toast({ title: "Added to cart!", description: `${product.name} × ${quantity}` });
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ═══════ MAIN PRODUCT SECTION ═══════ */}
      <section className="max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* ── LEFT: Gallery (scrollable images stacked vertically on desktop) ── */}
          <div className="lg:sticky lg:top-0 lg:self-start">
            {/* Main image */}
            <div className="relative aspect-square bg-[#f5f5f5]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImg}
                  src={galleryImages[currentImg] || product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 sm:p-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>

              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImg((p) => (p - 1 + galleryImages.length) % galleryImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImg((p) => (p + 1) % galleryImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div
              ref={thumbRef}
              className="flex gap-2 px-4 py-3 overflow-x-auto bg-background"
              style={{ scrollbarWidth: "none" }}
            >
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`flex-none w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentImg ? "border-foreground" : "border-transparent hover:border-border"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain bg-[#f5f5f5] p-1" />
                </button>
              ))}
            </div>

            {/* Product Highlights bar (below gallery like reference) */}
            <div className="hidden lg:block border-t border-border">
              <div className="px-6 py-5">
                <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4">Product highlights</p>
                <div className="grid grid-cols-3 gap-4">
                  {highlights.map(({ icon: Icon, value, label }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground leading-tight">{value}</p>
                        <p className="text-[10px] text-muted-foreground">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="px-5 sm:px-8 lg:px-10 py-6 lg:py-10">
            {/* Vendor / Brand */}
            <Link to="/collection/all" className="text-xs text-muted-foreground tracking-wider uppercase hover:text-foreground transition-colors">
              {product.brand}
            </Link>

            {/* Title + Price row */}
            <div className="flex items-start justify-between gap-4 mt-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-foreground whitespace-nowrap pt-1">
                {product.price}
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-sm text-muted-foreground mt-1">{product.subtitle}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-foreground text-foreground" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">{product.reviews} reviews</span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              Crafted for perfect fit and everyday protection. Premium materials meet precise engineering to keep your {product.device} safe without adding bulk.
            </p>

            {/* Divider */}
            <div className="h-px bg-border my-6" />

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-foreground mb-3">
                  Color: <span className="font-semibold">{product.colors[selectedColor]}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color, i) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(i)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        i === selectedColor ? "border-foreground scale-110 ring-2 ring-foreground/10" : "border-border hover:border-foreground/50"
                      }`}
                      style={{ backgroundColor: colorHex[color] || "#ccc" }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Product Highlights (mobile only) */}
            <div className="lg:hidden mb-6">
              <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">Product highlights</p>
              <div className="grid grid-cols-3 gap-3">
                {highlights.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-foreground leading-tight">{value}</p>
                      <p className="text-[9px] text-muted-foreground">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock urgency */}
            <p className="text-sm font-medium text-foreground mb-4">
              Hurry, only <span className="font-bold text-red-600">5</span> items left in stock!
            </p>

            {/* Quantity + Add to Cart */}
            <div ref={ctaRef} className="flex items-stretch gap-3 mb-3">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-3 hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-medium min-w-[2rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-3 hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-foreground text-background font-semibold py-3.5 rounded-lg text-sm tracking-wide hover:bg-foreground/90 transition-colors"
              >
                Add to cart — {product.price}
              </button>
            </div>

            {/* Buy Now */}
            <button
              onClick={() => {
                handleAddToCart();
                toast({ title: "Proceeding to checkout", description: "Redirecting..." });
              }}
              className="w-full border-2 border-foreground text-foreground font-semibold py-3.5 rounded-lg text-sm tracking-wide hover:bg-foreground hover:text-background transition-colors mb-6"
            >
              Buy it now
            </button>

            {/* Pickup info */}
            <div className="flex items-start gap-3 mb-4">
              <Package className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Ships within 1-2 business days</p>
                <p className="text-xs text-muted-foreground">Usually ready in 24 hours</p>
              </div>
            </div>

            {/* Share */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-muted-foreground">Share:</span>
              <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-border mb-6" />

            {/* Pairs well with */}
            {pairsWellWith.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-bold text-foreground mb-4">Pairs well with</h3>
                <div className="space-y-3">
                  {pairsWellWith.slice(0, 3).map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="flex items-center gap-3 border border-border rounded-xl p-3 hover:border-foreground/30 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-lg bg-[#f5f5f5] overflow-hidden flex-shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.subtitle}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-foreground">{p.price}</p>
                        <span className="text-[10px] text-muted-foreground underline">View</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Trust badges row */}
            <div className="grid grid-cols-4 gap-3 py-5 border-y border-border mb-6">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: Shield, label: "90-Day Trial" },
                { icon: CheckCircle, label: "1-Year Warranty" },
                { icon: CreditCard, label: "COD Available" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-tight">{label}</span>
                </div>
              ))}
            </div>

            {/* Need help? Accordion */}
            <div className="mb-6">
              <h3 className="text-base font-bold text-foreground mb-3">Need help?</h3>
              <p className="text-xs text-muted-foreground mb-4">
                If you have any questions, you are always welcome to contact us. We'll get back to you within 24 hours.
              </p>
              <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                {[
                  { key: "shipping", title: "Shipping Information", icon: Truck, content: "Ships within 1-2 business days. Free shipping on all prepaid orders. Cash on delivery available across India." },
                  { key: "support", title: "Customer Support", icon: Phone, content: "Available Monday to Saturday (9am-9pm IST). Connect via phone, WhatsApp, email, or live chat." },
                  { key: "faq", title: "FAQ's", icon: HelpCircle, content: "Visit our FAQ section below for answers to common questions about our products." },
                  { key: "contact", title: "Contact Us", icon: MessageSquare, content: "We'd love to hear from you. Drop us a message and our team will get back to you within 24 hours." },
                ].map(({ key, title, icon: Icon, content }) => (
                  <div key={key}>
                    <button
                      onClick={() => setOpenAccordion(openAccordion === key ? null : key)}
                      className="flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-muted/50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground flex-1">{title}</span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openAccordion === key ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openAccordion === key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed pl-11">{content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ BELOW-FOLD SECTIONS ═══════ */}

      {/* Available Offers */}
      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-10 py-8 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Available Offers</h2>
          <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">View All</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {offers.map((offer) => (
            <div key={offer.title} className="flex items-center gap-3 border border-border rounded-xl p-4 hover:border-foreground/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <offer.icon className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{offer.title}</p>
                <p className="text-xs text-muted-foreground">{offer.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Specs Section */}
      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-10 py-10 border-t border-border">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">Tech Specs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specs.map(({ section, items }) => (
            <div key={section}>
              <h3 className="text-sm font-bold text-foreground tracking-wide uppercase mb-4 pb-2 border-b border-border">{section}</h3>
              <div className="space-y-3">
                {items.map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-10 py-10 border-t border-border">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Customer Reviews</h2>

        {/* Review summary */}
        <div className="flex items-center gap-6 mb-8">
          <div className="text-center">
            <p className="text-5xl font-bold text-foreground">{product.rating.toFixed(1)}</p>
            <div className="flex gap-0.5 mt-2 justify-center">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className={`w-4 h-4 ${s < Math.round(product.rating) ? "fill-foreground text-foreground" : "text-border"}`} />
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
                  <Star className="w-3 h-3 fill-foreground text-foreground" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-foreground rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-7 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fakeReviews.map((review, i) => (
            <div key={i} className="border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.name}</p>
                    {review.verified && <p className="text-[10px] text-green-600 font-medium">✓ Verified Purchase</p>}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s < review.rating ? "fill-foreground text-foreground" : "text-border"}`} />
                ))}
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">{review.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{review.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-10 py-10 border-t border-border">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">FAQs</h2>
        <p className="text-sm text-muted-foreground mb-6">Frequently asked questions about our products.</p>
        <div className="border border-border rounded-xl overflow-hidden divide-y divide-border max-w-3xl">
          {faqItems.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium text-foreground pr-4">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* You may also like */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-10 py-10 border-t border-border">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">You may also like</h2>
          <div
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {relatedProducts.map((p) => (
              <div key={p.id} className="flex-none w-[44vw] sm:w-[260px] lg:w-[280px] snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════ STICKY BOTTOM BAR ═══════ */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50"
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
              {/* Product info */}
              <div className="hidden sm:flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#f5f5f5] overflow-hidden flex-shrink-0">
                  <img src={galleryImages[selectedColor] || product.image} alt="" className="w-full h-full object-contain p-0.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.subtitle}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex-1 sm:flex-none">
                <p className="text-lg font-bold text-foreground">{product.price}</p>
                <p className="text-[10px] text-muted-foreground line-through sm:hidden">{product.originalPrice}</p>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 sm:flex-none sm:px-8 bg-foreground text-background font-semibold py-3 rounded-lg text-sm tracking-wide hover:bg-foreground/90 transition-colors"
              >
                Add to cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={showStickyBar ? "h-16" : ""} />
      <Footer />
    </div>
  );
};

export default ProductDetail;
