import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star, ChevronLeft, ChevronRight, Shield, Zap, Magnet, CheckCircle,
  Package, Truck, Percent, Minus, Plus,
  Share2, ChevronDown, Smartphone, Search as SearchIcon,
  RotateCcw, Lock, Award, Clock,
  ShieldCheck, Waves, CircleDot, ScanLine, BadgeCheck, MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { allProducts, colorImages, iphone17ProGalleryImages, iphone17GalleryImages, iphone16MagsafeGalleryImages, siliconeGalleryImages, type Product } from "@/data/products";
import { useSEO } from "@/hooks/useSEO";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { ProductLightbox } from "@/components/ProductLightbox";
import ProductContentSections from "@/components/ProductContentSections";
import FloatingNavPill from "@/components/FloatingNavPill";

const colorHex: Record<string, string> = {
  Clear: "#e5e5e5",
  "Jet Black": "#1a1a1a",
  Black: "#1a1a1a",
  Blue: "#2563eb",
  Pink: "#ec4899",
  Green: "#16a34a",
  Stone: "#a39382",
  Navy: "#1e3a5f",
  Orange: "#e8632b",
  "Saddle Brown": "#92400e",
  "Matte Black": "#333333",
};

const categoryHighlights: Record<string, { icon: typeof Shield; label: string }[]> = {
  Cases: [
    { icon: Waves, label: "ClearFlow™\nTechnology" },
    { icon: ShieldCheck, label: "14.8 Feet Drop\nProtection" },
    { icon: Magnet, label: "MagSafe\nCompatible" },
    { icon: BadgeCheck, label: "Lifetime\nWarranty" },
  ],
  "Screen Protection": [
    { icon: ShieldCheck, label: "9H Hardness\nGlass" },
    { icon: CircleDot, label: "Edge-to-Edge\nCoverage" },
    { icon: Waves, label: "Anti-Fingerprint\nCoating" },
    { icon: BadgeCheck, label: "Lifetime\nWarranty" },
  ],
  "Camera Protection": [
    { icon: ScanLine, label: "Sapphire-Grade\nHardness" },
    { icon: CircleDot, label: "Anti-Reflective\nCoating" },
    { icon: Waves, label: "0.3mm Ultra\nThin Profile" },
    { icon: BadgeCheck, label: "Lifetime\nWarranty" },
  ],
};

const defaultHighlights = [
  { icon: CircleDot, label: "Anti-skid\nGrip" },
  { icon: ShieldCheck, label: "6 Feet Drop\nProtection" },
  { icon: Zap, label: "Wireless\nCharging" },
  { icon: BadgeCheck, label: "Lifetime\nWarranty" },
];

const verifiedReviews = [
  { name: "Priya Sharma", rating: 5, title: "Best case I've ever bought", body: "Super premium quality. Worth every rupee spent.", verified: true },
  { name: "Amritleen Singh", rating: 5, title: "Premium feel, amazing protection", body: "Dropped my phone twice already and not a scratch.", verified: true },
  { name: "Rahul Menon", rating: 5, title: "Premium quality hai", body: "Premium build quality. Best in this price range.", verified: true },
];

const offers = [
  { title: "FLAT 5% OFF", highlight: "5%", sub: "On Single Product", icon: "percent" as const },
  { title: "FLAT 10% OFF", highlight: "10%", sub: "On 2 or More Products", icon: "percent" as const },
  { title: "FREE SHIPPING", highlight: "FREE", sub: "On All Prepaid Orders", icon: "truck" as const },
];

/* ── Related Products Carousel ── */
const RelatedProductsCarousel = ({ products }: { products: Product[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tracking-tight">You may also like</h2>
        <div className="flex gap-2">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-3 sm:gap-4">
          {products.map((p) => (
            <div key={p.id} className="flex-none w-[42vw] sm:w-[260px] lg:w-[280px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = allProducts.find((p) => p.id === id);

  useSEO({
    title: product ? `${product.name} for ${product.device} | VCASE` : "Product | VCASE",
    description: product ? `Buy VCASE ${product.name} for ${product.device}. ${product.price} with free shipping.` : "Premium phone protection by VCASE.",
    canonical: `https://vcase.in/product/${id}`,
    type: "product",
    jsonLd: product ? {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${product.name} for ${product.device}`,
      brand: { "@type": "Brand", name: "VCASE" },
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: product.price.replace(/[₹,]/g, ""),
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviews,
      },
    } : undefined,
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { addToCart, addRecentlyViewed } = useCart();

  const galleryImages = product
    ? (() => {
        if (product.device === "iPhone 17 Pro") return iphone17ProGalleryImages;
        if (product.device === "iPhone 17") return iphone17GalleryImages;
        if ((product.device === "iPhone 16" || product.device === "iPhone 16 Pro") && product.category === "MagSafe Cases") return iphone16MagsafeGalleryImages;
        if (product.category === "Silicone Cases") return siliconeGalleryImages;
        const imgs: string[] = [product.image];
        if (product.hoverImage && product.hoverImage !== product.image) imgs.push(product.hoverImage);
        product.colors.forEach((c) => {
          const ci = colorImages[c];
          if (ci && !imgs.includes(ci)) imgs.push(ci);
        });
        return imgs;
      })()
    : [];

  useEffect(() => {
    if (product) {
      addRecentlyViewed({
        id: product.id, name: product.name, subtitle: product.subtitle,
        price: product.price, originalPrice: product.originalPrice, image: product.image,
      });
    }
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => { setCurrentImg(selectedColor); }, [selectedColor]);

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
  const relatedProducts = allProducts
    .filter((p) => p.device === product.device && p.id !== product.id)
    .slice(0, 8);

  const availableModels = allProducts
    .filter((p) => p.name === product.name)
    .map((p) => p.device)
    .filter((v, i, a) => a.indexOf(v) === i);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id, name: product.name, subtitle: product.subtitle,
        price: product.price, originalPrice: product.originalPrice,
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
    if (targetProduct) window.location.href = `/product/${targetProduct.id}`;
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
              {/* Vertical thumbnails - desktop */}
              <div className="hidden lg:flex flex-col gap-2 w-[72px] max-h-[620px] overflow-y-auto overflow-x-hidden flex-shrink-0 pr-1" style={{ scrollbarWidth: "thin" }}>
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-[68px] h-[68px] rounded-xl overflow-hidden transition-all flex-shrink-0 ${i === currentImg ? "border-[2.5px] border-foreground" : "border border-border hover:border-foreground/40"}`}
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

                {galleryImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
                    {galleryImages.map((_, i) => (
                      <button key={i} onClick={() => setCurrentImg(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? "bg-foreground w-5" : "bg-foreground/30"}`} />
                    ))}
                  </div>
                )}

                <button
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-9 h-9 rounded-full bg-background shadow-md flex items-center justify-center hover:bg-muted transition-colors"
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

                <ProductLightbox images={galleryImages} startIndex={currentImg} />

                {galleryImages.length > 1 && (
                  <div className="hidden lg:block">
                    <button onClick={() => setCurrentImg((p) => (p - 1 + galleryImages.length) % galleryImages.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-background transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setCurrentImg((p) => (p + 1) % galleryImages.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-background transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile thumbnails */}
            <div className="flex lg:hidden gap-2 py-3 px-0.5 overflow-x-auto" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`flex-shrink-0 w-[62px] h-[62px] rounded-xl overflow-hidden transition-all ${i === currentImg ? "border-[2.5px] border-foreground" : "border border-border/60 hover:border-foreground/40"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain bg-secondary/30 p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="py-1 lg:py-0">
            <h1 className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold text-foreground leading-[1.2]">
              {product.name}
            </h1>
            <p className="text-[13px] sm:text-sm text-muted-foreground mt-0.5">{product.subtitle}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="inline-flex items-center gap-1.5 border border-border rounded-lg px-2.5 py-1.5">
                <span className="text-[13px] font-bold text-foreground">{product.rating.toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-muted-foreground text-[11px]">| {product.reviews} Reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-4 border border-border rounded-xl p-3.5">
              <div className="flex items-baseline gap-2.5">
                <span className="text-[22px] sm:text-2xl font-bold text-foreground">{product.price}</span>
                <span className="text-[12px] text-muted-foreground">MRP <span className="line-through">{product.originalPrice}</span></span>
                <span className="text-[10px] font-semibold text-green-600 border border-green-600 rounded px-1.5 py-0.5">{product.discount}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                <Truck className="w-3.5 h-3.5 text-green-600" />
                <span className="text-[11px] text-muted-foreground">Free shipping on prepaid orders</span>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4 mt-5">
              {highlights.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full border-2 border-foreground/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] sm:text-[12px] font-semibold text-foreground leading-tight whitespace-pre-line">{label}</span>
                </div>
              ))}
            </div>

            {/* Select Model */}
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">1</span>
                <span className="text-[12px] font-semibold text-foreground">Select Model:</span>
                <span className="text-[12px] text-muted-foreground">{product.device}</span>
              </div>
              <div className="relative">
                <select
                  value={product.device}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-[13px] font-medium text-foreground bg-background appearance-none cursor-pointer hover:border-foreground/50 transition-colors"
                >
                  {availableModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Select Colour */}
            {product.colors.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">2</span>
                  <span className="text-[12px] font-semibold text-foreground">Select Colour:</span>
                  <span className="text-[12px] text-muted-foreground">{product.colors[selectedColor]}</span>
                </div>
                <div className="flex gap-2.5">
                  {product.colors.map((color, i) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(i)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${i === selectedColor ? "border-foreground ring-2 ring-foreground/20 scale-110" : "border-border hover:border-foreground/50"}`}
                      style={{ backgroundColor: colorHex[color] || "#ccc" }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex gap-2.5 mt-6">
              <motion.button
                onClick={handleAddToCart}
                className="flex-1 bg-foreground text-background font-bold py-3.5 rounded-full text-[13px] tracking-widest uppercase"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                ADD TO CART
              </motion.button>
              <motion.button
                onClick={() => { handleAddToCart(); toast({ title: "Proceeding to checkout" }); }}
                className="flex-1 bg-foreground text-background font-bold py-3.5 rounded-full text-[13px] tracking-wider"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                BUY NOW →
              </motion.button>
            </div>

            {/* Offers row */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {offers.map((offer) => (
                <div key={offer.title} className="flex-none flex items-center gap-2 border border-border rounded-xl p-3 min-w-[180px]">
                  <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                    {offer.icon === "truck" ? <Truck className="w-4 h-4 text-white" /> : <Percent className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-foreground">
                      {offer.icon === "truck" ? <span className="text-green-600">{offer.highlight}</span> : <>FLAT <span className="text-green-600">{offer.highlight}</span> OFF</>}
                      {offer.icon === "truck" && " SHIPPING"}
                    </p>
                    <p className="text-[9px] text-muted-foreground">{offer.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges — compact */}
            <div className="grid grid-cols-4 gap-2 mt-4 py-4 border-t border-border">
              {[
                { icon: RotateCcw, label: "7-Day Returns" },
                { icon: Award, label: "Warranty" },
                { icon: Truck, label: "Free Shipping" },
                { icon: ShieldCheck, label: "Genuine" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                  <p className="text-[9px] font-medium text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PREMIUM CONTENT SECTIONS ═══════ */}
      <ProductContentSections product={product} />

      {/* ═══════ REVIEWS — minimal ═══════ */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Customer Reviews</h2>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-foreground">{product.rating.toFixed(1)}</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {verifiedReviews.map((review, i) => (
            <div key={i} className="border border-border rounded-xl p-4">
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`w-3 h-3 ${s < review.rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                ))}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[12px] font-semibold text-foreground">{review.name}</span>
                <span className="text-[9px] font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Verified</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{review.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ YOU MAY ALSO LIKE ═══════ */}
      {relatedProducts.length > 0 && <RelatedProductsCarousel products={relatedProducts} />}

      {/* ═══════ STICKY BOTTOM BAR ═══════ */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-4 py-3 sm:px-6 flex items-center justify-between gap-3 safe-area-pb"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-foreground truncate">{product.name}</span>
              <span className="text-[15px] font-bold text-foreground">{product.price} <span className="text-[11px] text-muted-foreground line-through font-normal">{product.originalPrice}</span></span>
            </div>
            <motion.button
              onClick={handleAddToCart}
              className="bg-foreground text-background font-bold rounded-full px-6 py-2.5 text-[12px] tracking-wider whitespace-nowrap flex-shrink-0"
              whileTap={{ scale: 0.95 }}
            >
              ADD TO CART
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {showStickyBar && <div className="h-[72px]" />}

      {/* Footer */}
      <div className="bg-foreground relative pt-10 sm:pt-12">
        <div className="absolute top-0 left-0 right-0 h-8 bg-background rounded-b-[2rem] sm:rounded-b-[2.5rem] z-10" />
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetail;
