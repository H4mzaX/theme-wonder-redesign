import { useState, useRef, useEffect, useCallback, TouchEvent as ReactTouchEvent } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star, ChevronLeft, ChevronRight, Shield, Zap, Magnet, CheckCircle,
  Package, Truck, Percent, Minus, Plus,
  Share2, ChevronDown, Smartphone, Search as SearchIcon,
  RotateCcw, Timer, Lock, PlusCircle, MessageCircle, Flame, Clock, Award,
  ShieldCheck, Waves, CircleDot, ScanLine, BadgeCheck, Wallet, IndianRupee, Banknote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { allProducts, colorImages, iphone17ProGalleryImages, iphone17GalleryImages, iphone16MagsafeGalleryImages, siliconeGalleryImages, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { ProductLightbox } from "@/components/ProductLightbox";

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

const categoryHighlights: Record<string, { icon: typeof Shield; label: string }[]> = {
  "MagSafe Cases": [
    { icon: Waves, label: "ClearFlow™\nTechnology" },
    { icon: ShieldCheck, label: "14.8 Feet Drop\nProtection" },
    { icon: Magnet, label: "MagSafe\nCompatible" },
    { icon: BadgeCheck, label: "Lifetime\nWarranty" },
  ],
  "Silicone Cases": [
    { icon: CircleDot, label: "Anti-skid\nGrip" },
    { icon: ShieldCheck, label: "10.4 Feet Drop\nProtection" },
    { icon: Waves, label: "Washable\nSurface" },
    { icon: BadgeCheck, label: "Lifetime\nWarranty" },
  ],
  "Leather Cases": [
    { icon: ScanLine, label: "Premium\nHand Feel" },
    { icon: ShieldCheck, label: "6 Feet Drop\nProtection" },
    { icon: Magnet, label: "MagSafe\nCompatible" },
    { icon: BadgeCheck, label: "Lifetime\nWarranty" },
  ],
};

const defaultHighlights = [
  { icon: CircleDot, label: "Anti-skid\nGrip" },
  { icon: ShieldCheck, label: "6 Feet Drop\nProtection" },
  { icon: Zap, label: "Wireless\nCharging" },
  { icon: BadgeCheck, label: "Lifetime\nWarranty" },
];

const fakeReviews = [
  { name: "Asharam Goyal", rating: 5, date: "2 weeks ago", title: "Superb quality and perfect fit", body: "The case fits perfectly on my phone. Build quality is excellent and the grip is amazing. Highly recommended for anyone looking for premium protection.", verified: true },
  { name: "Hemanth Kumar", rating: 4, date: "1 month ago", title: "Good one and fitting also good", body: "Bold pro case is good one and fitting also good. The durability is impressive with side bumpers. Case weight around 42 grams, feels good in hand.", verified: true },
  { name: "Priya Sharma", rating: 5, date: "3 weeks ago", title: "Best case I've ever bought", body: "Super premium quality. The material develops a beautiful look over time. Worth every rupee spent. Would buy again for sure.", verified: true },
  { name: "Amritleen Singh", rating: 5, date: "1 week ago", title: "Premium feel, amazing protection", body: "Dropped my phone twice already and not a scratch. The anti-slip grip is fantastic. Phone never slips out of my hand anymore.", verified: true },
  { name: "Srikanth T", rating: 4, date: "5 days ago", title: "Value for money product", body: "Good product at reasonable price. Camera protection is excellent. Only wish it came in more color options.", verified: false },
  { name: "Rahul Menon", rating: 5, date: "2 days ago", title: "Bhai kya premium quality hai", body: "Premium build quality. Best case available in this price range. Fast delivery and good packaging too.", verified: true },
];

const offers = [
  { title: "FLAT 5% OFF", highlight: "5%", sub: "On Single Product", icon: "percent" as const },
  { title: "FLAT 10% OFF", highlight: "10%", sub: "On 2 or More Products", icon: "percent" as const },
  { title: "FREE SHIPPING", highlight: "FREE", sub: "On All Prepaid Orders", icon: "truck" as const },
];

const productFeatures: Record<string, string[]> = {
  "MagSafe Cases": [
    "SGS tested for 14.8 feet Drop Protection",
    "Built-in MagSafe magnets for perfect alignment",
    "Soft Bumper Sides & Airbags at corners to enhance grip and shock absorption",
    "Nano Oleophobic Coating resists fingerprints and smudges",
    "See-through design reveals the phone logo while maintaining protection",
  ],
  "Silicone Cases": [
    "SGS tested for 10.4 feet Drop Protection",
    "Liquid silicone rubber exterior with soft microfiber interior",
    "Soft Bumper Sides & Airbags at corners to enhance grip and shock absorption",
    "Washable surface that resists stains and discoloration",
    "Striking Color Design that makes your case truly stand out",
  ],
  "Leather Cases": [
    "SGS tested for 6 feet Drop Protection",
    "Genuine Italian full-grain leather exterior",
    "Develops a beautiful natural patina over time",
    "Soft microfiber lining protects your device from scratches",
    "Slim profile that fits comfortably in your pocket",
  ],
};

const defaultFeatures = [
  "SGS tested for Drop Protection",
  "Premium materials with precision engineering",
  "Raised bezels for screen and camera protection",
  "Compatible with wireless charging",
  "Anti-slip grip texture for secure handling",
];

const productDescriptions: Record<string, { title: string; description: string; specs: { label: string; value: string }[] }> = {
  "MagSafe Cases": {
    title: "MagSafe Clear Case",
    description: "Introducing the MagSafe Clear Case — a precision-engineered MagSafe case crafted to elevate your protection game. With 38T magnetic alignment, 14.8 feet of drop protection, and crystal-clear polycarbonate + TPU hybrid construction, it combines aesthetics with functionality. The soft bumper sides provide a comfortable grip, while innovative airbags at the corners absorb impact, safeguarding your phone from shocks and drops.",
    specs: [
      { label: "Model", value: "" },
      { label: "Material", value: "Built with Polycarbonate + TPU hybrid" },
      { label: "Weight", value: "32g" },
      { label: "Compatibility", value: "Compatible with all MagSafe accessories & Wireless charging" },
    ],
  },
  "Silicone Cases": {
    title: "Silicone Case",
    description: "Introducing the Silicone Case — engineered for those who demand both style and substance. This premium case features liquid silicone rubber exterior with a soft microfiber lining that cradles your phone. With 10.4 feet of drop protection, innovative corner airbags, and a washable surface, it's the perfect blend of durability and elegance. The striking color options let you express your personality while keeping your device safe.",
    specs: [
      { label: "Model", value: "" },
      { label: "Material", value: "Built with Liquid Silicone + Microfiber" },
      { label: "Weight", value: "28g" },
      { label: "Compatibility", value: "Compatible with all VCASE products & Wireless charging" },
    ],
  },
  "Leather Cases": {
    title: "Leather Case",
    description: "Introducing the Leather Case — handcrafted from genuine Italian full-grain leather. This luxurious case develops a beautiful natural patina over time, making it uniquely yours. With 6 feet of drop protection and MagSafe compatibility, it combines timeless elegance with modern functionality. The soft microfiber interior protects your device from scratches, while the slim profile ensures it fits comfortably in your pocket.",
    specs: [
      { label: "Model", value: "" },
      { label: "Material", value: "Genuine Italian Full-grain Leather" },
      { label: "Weight", value: "42g" },
      { label: "Compatibility", value: "Compatible with MagSafe accessories & Wireless charging" },
    ],
  },
};

const defaultDescription = productDescriptions["MagSafe Cases"];

const faqItems = [
  { q: "Will this case make my phone bulky?", a: "No! Our cases are designed with a slim profile that adds minimal bulk while providing maximum protection. You'll barely notice it's there." },
  { q: "Is the case compatible with wireless charging?", a: "Yes, all our cases are fully compatible with Qi and Qi2 wireless charging. MagSafe cases have built-in magnets for perfect alignment." },
  { q: "What if my case turns yellow?", a: "We offer a free replacement guarantee if your clear case turns yellow within the warranty period. Simply contact us with photos and we'll ship a new one." },
  { q: "How do I clean my case?", a: "For silicone and clear cases, wipe with a damp cloth and mild soap. For leather cases, use a dry microfiber cloth. Avoid harsh chemicals." },
  { q: "Do you offer international shipping?", a: "Currently we ship across India with free shipping on all prepaid orders. International shipping is coming soon." },
];

const warrantyContent = "All VCASE products come with a 6-month warranty against manufacturing defects. This covers issues such as peeling, discoloration (non-clear cases), and structural failure under normal use. Warranty does not cover physical damage from drops, scratches from everyday use, or natural patina development on leather cases.";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = allProducts.find((p) => p.id === id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [countdownMinutes, setCountdownMinutes] = useState(4);
  const [countdownSeconds, setCountdownSeconds] = useState(59);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { addToCart, addRecentlyViewed } = useCart();

  // Build gallery: for iPhone 17 Pro use all 6 real shots, otherwise product image + hover + color variants
  const galleryImages = product
    ? (() => {
        if (product.device === "iPhone 17 Pro") {
          return iphone17ProGalleryImages;
        }
        if (product.device === "iPhone 17") {
          return iphone17GalleryImages;
        }
        if ((product.device === "iPhone 16" || product.device === "iPhone 16 Pro") && product.category === "MagSafe Cases") {
          return iphone16MagsafeGalleryImages;
        }
        if (product.category === "Silicone Cases") {
          return siliconeGalleryImages;
        }
        const imgs: string[] = [product.image];
        if (product.hoverImage && product.hoverImage !== product.image) {
          imgs.push(product.hoverImage);
        }
        product.colors.forEach((c) => {
          const ci = colorImages[c];
          if (ci && !imgs.includes(ci)) imgs.push(ci);
        });
        return imgs;
      })()
    : [];

  // Track recently viewed
  useEffect(() => {
    if (product) {
      addRecentlyViewed({
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
      });
    }
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setCurrentImg(selectedColor);
  }, [selectedColor]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev === 0) {
          setCountdownMinutes((m) => (m === 0 ? 4 : m - 1));
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="bg-foreground relative pt-12 sm:pt-14">
          <div className="absolute top-0 left-0 right-0 h-10 bg-background rounded-b-[2.5rem] sm:rounded-b-[3rem] z-10" />
          <Footer />
        </div>
      </div>
    );
  }

  const highlights = categoryHighlights[product.category] || defaultHighlights;
  const features = productFeatures[product.category] || defaultFeatures;
  const descData = productDescriptions[product.category] || defaultDescription;
  const relatedProducts = allProducts
    .filter((p) => p.device === product.device && p.id !== product.id)
    .slice(0, 8);
  const pairsWellWith = allProducts
    .filter((p) => p.category !== product.category && p.device === product.device)
    .slice(0, 4);

  const availableModels = allProducts
    .filter((p) => p.name === product.name)
    .map((p) => p.device)
    .filter((v, i, a) => a.indexOf(v) === i);

  

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        price: product.price,
        originalPrice: product.originalPrice,
        image: galleryImages[selectedColor] || product.image,
        color: product.colors[selectedColor] || "Default",
        device: product.device,
      });
    }
    toast({ title: "Added to cart!", description: `${product.name} × ${quantity}` });
    setCartOpen(true);
  };

  const handleModelChange = (device: string) => {
    const targetProduct = allProducts.find((p) => p.name === product.name && p.device === device);
    if (targetProduct) {
      window.location.href = `/product/${targetProduct.id}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-clip">
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ═══════ MAIN PRODUCT SECTION ═══════ */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 xl:gap-12 pt-2 sm:pt-4 lg:pt-6">

          {/* ── LEFT: Gallery ── */}
          <div className="lg:sticky lg:top-[80px] lg:self-start">
            <div className="flex gap-3">
              {/* Vertical thumbnails - desktop only */}
              <div
                className="hidden lg:flex flex-col gap-2 w-[72px] max-h-[620px] overflow-y-auto overflow-x-hidden flex-shrink-0 pr-1"
                style={{ scrollbarWidth: "thin" }}
              >
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-[68px] h-[68px] rounded-xl overflow-hidden transition-all flex-shrink-0 ${
                      i === currentImg ? "border-[2.5px] border-foreground" : "border border-border hover:border-foreground/40"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain bg-secondary/30 p-1" />
                  </button>
                ))}
              </div>

              {/* Main image — swipeable */}
              <div
                className="relative flex-1 aspect-[4/5] lg:aspect-square bg-secondary/30 rounded-2xl overflow-hidden touch-pan-y"
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  (e.currentTarget as any)._swipeStartX = touch.clientX;
                  (e.currentTarget as any)._swipeStartY = touch.clientY;
                }}
                onTouchEnd={(e) => {
                  const startX = (e.currentTarget as any)._swipeStartX;
                  const startY = (e.currentTarget as any)._swipeStartY;
                  if (startX == null) return;
                  const touch = e.changedTouches[0];
                  const dx = touch.clientX - startX;
                  const dy = touch.clientY - startY;
                  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                    if (dx < 0) setCurrentImg((p) => (p + 1) % galleryImages.length);
                    else setCurrentImg((p) => (p - 1 + galleryImages.length) % galleryImages.length);
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImg}
                    src={galleryImages[currentImg] || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 sm:p-6 lg:p-8 cursor-zoom-in select-none"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    draggable={false}
                    onClick={() => {
                      const gallery = document.getElementById("product-gallery");
                      if (gallery) {
                        const links = gallery.querySelectorAll("a");
                        if (links[currentImg]) (links[currentImg] as HTMLElement).click();
                      }
                    }}
                  />
                </AnimatePresence>

                {/* Dot indicators */}
                {galleryImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
                    {galleryImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImg(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? "bg-foreground w-5" : "bg-foreground/30"}`}
                      />
                    ))}
                  </div>
                )}

                {/* Zoom icon — opens lightbox */}
                <button
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background shadow-md flex items-center justify-center hover:bg-muted transition-colors"
                  onClick={() => {
                    const gallery = document.getElementById("product-gallery");
                    if (gallery) {
                      const links = gallery.querySelectorAll("a");
                      if (links[currentImg]) (links[currentImg] as HTMLElement).click();
                    }
                  }}
                >
                  <SearchIcon className="w-4 h-4 text-foreground" />
                </button>

                {/* PhotoSwipe lightbox (hidden gallery) */}
                <ProductLightbox images={galleryImages} startIndex={currentImg} />

                {/* Desktop arrows */}
                {galleryImages.length > 1 && (
                  <div className="hidden lg:block">
                    <button
                      onClick={() => setCurrentImg((p) => (p - 1 + galleryImages.length) % galleryImages.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentImg((p) => (p + 1) % galleryImages.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-background transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile thumbnails - horizontally scrollable */}
            <div
              className="flex lg:hidden gap-2 py-3 px-0.5 overflow-x-auto"
              style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            >
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`flex-shrink-0 w-[62px] h-[62px] sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden transition-all ${
                    i === currentImg
                      ? "border-[2.5px] border-foreground"
                      : "border border-border/60 hover:border-foreground/40"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain bg-secondary/30 p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="py-1 lg:py-0">
            {/* Product Title */}
            <h1 className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold text-foreground leading-[1.2]">
              {product.name}
            </h1>

            {/* Subtitle */}
            <p className="text-[13px] sm:text-sm text-muted-foreground mt-0.5">{product.subtitle}</p>

            {/* Rating + Social proof */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
              <button
                onClick={() => document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-1.5 border border-border rounded-lg px-2.5 py-1.5 hover:border-foreground/40 transition-colors cursor-pointer"
              >
                <span className="text-[13px] sm:text-sm font-bold text-foreground">{product.rating.toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-muted-foreground text-[11px] sm:text-xs underline">| {product.reviews} Reviews</span>
              </button>
              <div className="inline-flex items-center gap-1.5 border border-border rounded-lg px-2.5 py-1.5">
                <span className="text-[11px] sm:text-xs font-bold text-foreground">800+</span>
                <span className="text-[11px] sm:text-xs text-muted-foreground">Bought in 10 Days.</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="mt-4 sm:mt-5 border border-border rounded-xl p-3.5 sm:p-4">
              <div className="flex items-baseline gap-2.5 sm:gap-3">
                <span className="text-[22px] sm:text-2xl font-bold text-foreground">{product.price}</span>
                <span className="text-[12px] sm:text-sm text-muted-foreground">MRP <span className="line-through">{product.originalPrice}</span></span>
                <span className="text-[10px] sm:text-xs font-semibold text-green-600 border border-green-600 rounded px-1.5 sm:px-2 py-0.5">{product.discount}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                <Truck className="w-3.5 h-3.5 text-green-600" />
                <span className="text-[11px] sm:text-xs text-muted-foreground">Free shipping on prepaid orders</span>
                <span className="ml-auto text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Delivery in 3-5 days
                </span>
              </div>
            </div>

            {/* Urgency strip */}
            <div className="flex items-center gap-2 mt-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg px-3 py-2">
              <Flame className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-amber-700 dark:text-amber-400">
                {countdownMinutes}:{countdownSeconds.toString().padStart(2, "0")} — Offer expires soon! {product.reviews}+ people viewing this
              </span>
            </div>

            {/* Feature Highlights - 2x2 grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5 mt-5 sm:mt-6">
              {highlights.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-foreground/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" strokeWidth={1.5} />
                  </div>
                  <span className="text-[12px] sm:text-sm font-semibold text-foreground leading-tight whitespace-pre-line">{label}</span>
                </div>
              ))}
            </div>

            {/* Step 1: Select Model */}
            <div className="mt-6 sm:mt-7">
              <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                <span className="w-6 h-6 rounded-full bg-foreground text-background text-[11px] sm:text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-[13px] sm:text-sm font-semibold text-foreground">Select Model:</span>
                <span className="text-[13px] sm:text-sm text-muted-foreground">{product.device}</span>
              </div>
              <div className="relative">
                <select
                  value={product.device}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 sm:py-3.5 text-[13px] sm:text-sm font-medium text-foreground bg-background appearance-none cursor-pointer hover:border-foreground/50 transition-colors"
                >
                  {availableModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Step 2: Select Colour */}
            {product.colors.length > 0 && (
              <div className="mt-5 sm:mt-6">
                <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                  <span className="w-6 h-6 rounded-full bg-foreground text-background text-[11px] sm:text-xs font-bold flex items-center justify-center">2</span>
                  <span className="text-[13px] sm:text-sm font-semibold text-foreground">Select Colour:</span>
                  <span className="text-[13px] sm:text-sm text-muted-foreground">{product.colors[selectedColor]}</span>
                </div>
                <div className="flex gap-2.5">
                  {product.colors.map((color, i) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(i)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 transition-all ${
                        i === selectedColor ? "border-foreground ring-2 ring-foreground/20 scale-110" : "border-border hover:border-foreground/50"
                      }`}
                      style={{ backgroundColor: colorHex[color] || "#ccc" }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ADD TO CART + BUY NOW */}
            <div ref={ctaRef} className="flex gap-2.5 sm:gap-3 mt-6 sm:mt-7">
              <motion.button
                onClick={handleAddToCart}
                className="flex-1 bg-foreground text-background font-bold py-3.5 sm:py-4 rounded-full text-[13px] sm:text-sm tracking-widest uppercase relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <motion.span
                    animate={{ opacity: [1, 1, 0.4, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ADD TO CART
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-foreground/80"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--background) / 0.15) 50%, transparent 100%)" }}
                />
              </motion.button>
              <motion.button
                onClick={() => {
                  handleAddToCart();
                  toast({ title: "Proceeding to checkout", description: "Redirecting..." });
                }}
                className="flex-1 bg-foreground text-background font-bold py-3.5 sm:py-4 rounded-full text-[13px] sm:text-sm tracking-wider"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px -5px hsl(var(--foreground) / 0.4)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                BUY NOW →
              </motion.button>
            </div>

            {/* WhatsApp help */}
            <a
              href="https://wa.me/919876543210?text=Hi%20VCASE!%20I%20need%20help%20with%20a%20product."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-3 py-3 rounded-full border border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors text-[13px] sm:text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              Need help? Chat on WhatsApp
            </a>

            {/* Available Offers */}
            <div className="mt-6 sm:mt-7">
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <h3 className="text-[15px] sm:text-base font-bold text-foreground flex items-center gap-2">
                  <Percent className="w-4 h-4 text-green-600" />
                  Available Offers
                </h3>
              </div>
              <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-1 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
                {offers.map((offer) => (
                  <div key={offer.title} className="flex-none flex items-center gap-3 border border-border rounded-2xl p-3.5 sm:p-4 min-w-[200px] sm:min-w-[230px] hover:border-green-500/40 hover:bg-green-50/30 dark:hover:bg-green-950/10 transition-all snap-start">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
                      {offer.icon === "truck" ? (
                        <Truck className="w-5 h-5 text-white" />
                      ) : (
                        <Percent className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-[12px] sm:text-sm font-bold text-foreground">
                        {offer.icon === "truck" ? (
                          <span className="text-green-600">{offer.highlight}</span>
                        ) : (
                          <>FLAT <span className="text-green-600">{offer.highlight}</span> OFF</>
                        )}
                        {offer.icon === "truck" && " SHIPPING"}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{offer.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-5 sm:mt-6 py-5 sm:py-6 border-t border-b border-border">
              {[
                { icon: RotateCcw, label: "7-Day Returns" },
                { icon: Award, label: "6-Month Warranty" },
                { icon: Truck, label: "Free Shipping" },
                { icon: ShieldCheck, label: "100% Genuine" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] sm:text-xs font-semibold text-foreground leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Payment methods */}
            <div className="mt-5 sm:mt-6">
              <p className="text-[11px] sm:text-sm font-bold text-foreground mb-3 uppercase tracking-wider">We Accept</p>
              {/* UPI row */}
              <div className="flex items-center gap-1.5 border border-border rounded-lg px-3 py-2 w-fit mb-2">
                <IndianRupee className="w-4 h-4 text-foreground" strokeWidth={2} />
                <span className="text-[11px] sm:text-xs font-bold text-foreground">UPI</span>
                <span className="text-muted-foreground text-[10px]">·</span>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground">GPay · PhonePe · Paytm</span>
              </div>
              {/* Cards row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex items-center gap-1.5 border border-border rounded-lg px-3 py-2">
                  <Wallet className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                  <span className="text-[11px] sm:text-xs font-semibold text-foreground">Credit / Debit</span>
                </div>
                <div className="flex items-center gap-1.5 border border-border rounded-lg px-3 py-2">
                  <Banknote className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                  <span className="text-[11px] sm:text-xs font-semibold text-foreground">Net Banking</span>
                </div>
                <div className="flex items-center gap-1.5 border border-border rounded-lg px-3 py-2">
                  <Package className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                  <span className="text-[11px] sm:text-xs font-semibold text-foreground">COD</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-[10px] sm:text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Visa · Mastercard · RuPay · 256-bit SSL · 100% secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ BELOW-FOLD SECTIONS ═══════ */}

      {/* Product Description + Specs Card */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <div className="bg-secondary/30 rounded-2xl p-5 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-5">{descData.title}</h2>
              <p className="text-[13px] sm:text-base text-muted-foreground leading-relaxed">{descData.description}</p>
            </div>
            <div className="space-y-0">
              {descData.specs.map(({ label, value }) => (
                <div key={label} className="flex py-3 sm:py-4 border-b border-border last:border-b-0">
                  <span className="text-[12px] sm:text-sm font-bold text-foreground w-28 sm:w-36 flex-shrink-0">{label}</span>
                  <span className="text-[12px] sm:text-sm text-muted-foreground">{value || `For ${product.device}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accordions: Product Features, Warranty, FAQs */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-6 sm:pb-10">
        <div className="bg-secondary/30 rounded-2xl overflow-hidden divide-y divide-border">
          {/* Product Features */}
          <div>
            <button
              onClick={() => setOpenAccordion(openAccordion === "features" ? null : "features")}
              className="flex items-center justify-between w-full px-4 sm:px-10 py-4 sm:py-6 text-left hover:bg-secondary/50 transition-colors"
            >
              <h3 className="text-[15px] sm:text-lg font-bold text-foreground">Product Features</h3>
              <PlusCircle className={`w-5 h-5 sm:w-6 sm:h-6 text-foreground transition-transform ${openAccordion === "features" ? "rotate-45" : ""}`} />
            </button>
            <AnimatePresence>
              {openAccordion === "features" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <ul className="px-4 sm:px-10 pb-4 sm:pb-6 space-y-2.5 sm:space-y-3">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] sm:text-sm text-muted-foreground">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Warranty */}
          <div>
            <button
              onClick={() => setOpenAccordion(openAccordion === "warranty" ? null : "warranty")}
              className="flex items-center justify-between w-full px-4 sm:px-10 py-4 sm:py-6 text-left hover:bg-secondary/50 transition-colors"
            >
              <h3 className="text-[15px] sm:text-lg font-bold text-foreground">Warranty</h3>
              <PlusCircle className={`w-5 h-5 sm:w-6 sm:h-6 text-foreground transition-transform ${openAccordion === "warranty" ? "rotate-45" : ""}`} />
            </button>
            <AnimatePresence>
              {openAccordion === "warranty" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 sm:px-10 pb-4 sm:pb-6 text-[12px] sm:text-sm text-muted-foreground leading-relaxed">{warrantyContent}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FAQs */}
          <div>
            <button
              onClick={() => setOpenAccordion(openAccordion === "faqs" ? null : "faqs")}
              className="flex items-center justify-between w-full px-4 sm:px-10 py-4 sm:py-6 text-left hover:bg-secondary/50 transition-colors"
            >
              <h3 className="text-[15px] sm:text-lg font-bold text-foreground">Frequently Asked Questions</h3>
              <PlusCircle className={`w-5 h-5 sm:w-6 sm:h-6 text-foreground transition-transform ${openAccordion === "faqs" ? "rotate-45" : ""}`} />
            </button>
            <AnimatePresence>
              {openAccordion === "faqs" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-10 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                    {faqItems.map((item, i) => (
                      <div key={i} className="border-b border-border pb-3 sm:pb-4 last:border-b-0">
                        <p className="text-[12px] sm:text-sm font-semibold text-foreground mb-1">{item.q}</p>
                        <p className="text-[12px] sm:text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════ REVIEWS & RATINGS ═══════ */}
      <section id="reviews-section" className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10 scroll-mt-20">
        <div className="bg-secondary/30 rounded-2xl p-4 sm:p-10">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground text-center mb-5 sm:mb-8">Reviews & Ratings</h2>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-5 sm:gap-8 items-center">
            {/* Rating summary */}
            <div className="text-center md:text-left">
              <div className="flex gap-1 justify-center md:justify-start mb-2">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`w-4 h-4 sm:w-5 sm:h-5 ${s < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                ))}
              </div>
              <p className="text-base sm:text-lg font-semibold text-foreground">{product.rating.toFixed(2)} out of 5</p>
              <p className="text-[12px] sm:text-sm text-muted-foreground">Based on {product.reviews} reviews</p>
            </div>

            {/* Rating bars */}
            <div className="space-y-1.5 sm:space-y-2">
              {[
                { stars: 5, count: 234 },
                { stars: 4, count: 49 },
                { stars: 3, count: 17 },
                { stars: 2, count: 1 },
                { stars: 1, count: 0 },
              ].map(({ stars, count }) => {
                const total = 301;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <div className="flex gap-0.5 w-16 sm:w-20 flex-shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < stars ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                      ))}
                    </div>
                    <div className="flex-1 h-2 sm:h-2.5 bg-border/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground w-7 sm:w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Write a review / Ask a question */}
            <div className="flex sm:flex-col gap-2.5 sm:gap-3">
              <button className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 sm:py-3 bg-foreground text-background rounded-full text-[12px] sm:text-sm font-semibold hover:bg-foreground/90 transition-colors">
                Write a review
              </button>
              <button className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-foreground text-foreground rounded-full text-[12px] sm:text-sm font-semibold hover:bg-foreground hover:text-background transition-colors">
                Ask a question
              </button>
            </div>
          </div>
        </div>

        {/* Sort filter */}
        <div className="mt-4 sm:mt-6 border-b border-border pb-2 sm:pb-3">
          <select className="text-[12px] sm:text-sm text-muted-foreground bg-transparent cursor-pointer">
            <option>Pictures First</option>
            <option>Most Recent</option>
            <option>Highest Rated</option>
          </select>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          {fakeReviews.map((review, i) => (
            <div key={i} className="bg-secondary/30 rounded-2xl p-4 sm:p-5">
              <div className="flex gap-0.5 mb-2 sm:mb-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${s < review.rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                ))}
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted flex items-center justify-center text-[10px] sm:text-xs font-bold text-foreground">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <span className="text-[12px] sm:text-sm font-semibold text-foreground">{review.name}</span>
                  {review.verified && (
                    <span className="ml-1.5 sm:ml-2 text-[9px] sm:text-[10px] font-medium bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded">Verified</span>
                  )}
                </div>
              </div>
              <p className="text-[12px] sm:text-sm font-semibold text-foreground mb-1">{review.title}</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{review.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ YOU MAY ALSO LIKE ═══════ */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10 border-t border-border">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-foreground">You may also like</h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
          <div
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {relatedProducts.map((p) => (
              <div key={p.id} className="flex-none w-[42vw] sm:w-[260px] lg:w-[280px] snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════ STICKY FLOATING ADD TO CART + COUNTDOWN PILL ═══════ */}
      <AnimatePresence>
        {showStickyBar && (
          <>
            {/* Animated countdown pill — bottom-left corner */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-50"
            >
              <motion.div
                className="flex items-center gap-2 bg-foreground text-background rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                </motion.div>
                <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">
                  Extra off in <span className="text-amber-400 font-bold">{countdownMinutes}:{countdownSeconds.toString().padStart(2, "0")}</span>
                </span>
              </motion.div>
            </motion.div>

            {/* Floating Add to Cart — bottom-right corner */}
            <motion.button
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={handleAddToCart}
              className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 flex items-center gap-2 bg-foreground text-background font-bold rounded-full px-5 sm:px-6 py-3 sm:py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-[12px] sm:text-sm tracking-wider hover:bg-foreground/90 transition-colors"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
            >
              <Package className="w-4 h-4" />
              ADD TO CART — {product.price}
            </motion.button>
          </>
        )}
      </AnimatePresence>

      <div className={showStickyBar ? "h-8 sm:h-12" : ""} />
      
      {/* Footer with floating rounded overlap */}
      <div className="bg-foreground relative -mt-0 pt-12 sm:pt-14">
        <div className="absolute top-0 left-0 right-0 h-10 bg-background rounded-b-[2.5rem] sm:rounded-b-[3rem] z-10" />
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetail;
