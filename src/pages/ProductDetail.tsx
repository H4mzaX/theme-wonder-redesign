import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight, Minus, Plus, Truck, Shield, RotateCcw, Package } from "lucide-react";
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

const specsData: Record<string, { label: string; value: string }[]> = {
  "MagSafe Cases": [
    { label: "Material", value: "Polycarbonate + TPU" },
    { label: "MagSafe", value: "Built-in magnets" },
    { label: "Drop Protection", value: "6ft / 1.8m" },
    { label: "Weight", value: "38g" },
    { label: "Wireless Charging", value: "Compatible" },
    { label: "Raised Edges", value: "Camera & Screen" },
  ],
  "Silicone Cases": [
    { label: "Material", value: "Liquid Silicone" },
    { label: "Interior", value: "Microfiber lining" },
    { label: "Drop Protection", value: "8ft / 2.4m" },
    { label: "Weight", value: "32g" },
    { label: "Grip", value: "Anti-slip texture" },
    { label: "Raised Edges", value: "Camera & Screen" },
  ],
  "Leather Cases": [
    { label: "Material", value: "Genuine Leather" },
    { label: "Finish", value: "Hand-stitched" },
    { label: "Drop Protection", value: "6ft / 1.8m" },
    { label: "Weight", value: "42g" },
    { label: "MagSafe", value: "Compatible" },
    { label: "Patina", value: "Develops over time" },
  ],
};

const defaultSpecs = [
  { label: "Material", value: "Premium TPU" },
  { label: "Drop Protection", value: "6ft / 1.8m" },
  { label: "Weight", value: "35g" },
  { label: "Wireless Charging", value: "Compatible" },
  { label: "Raised Edges", value: "Camera & Screen" },
  { label: "Warranty", value: "1 Year" },
];

const fakeReviews = [
  { name: "Rahul M.", rating: 5, date: "2 weeks ago", title: "Perfect fit!", body: "Snaps on perfectly with MagSafe. Love the feel and the clear back shows off my phone's color." },
  { name: "Priya S.", rating: 5, date: "1 month ago", title: "Best case I've bought", body: "Super premium quality. The leather develops a beautiful patina. Worth every rupee." },
  { name: "Arjun K.", rating: 4, date: "3 weeks ago", title: "Great protection", body: "Dropped my phone twice already and not a scratch. Only wish it came in more colors." },
  { name: "Sneha D.", rating: 5, date: "1 week ago", title: "Love the texture", body: "The silicone grip is amazing. Phone never slips out of my hand anymore." },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = allProducts.find((p) => p.id === id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [qty, setQty] = useState(1);
  const [currentImg, setCurrentImg] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Get images for gallery based on colors
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

  const specs = specsData[product.category] || defaultSpecs;
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const tabs = ["description", "specs", "reviews"] as const;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="hover:text-foreground transition-colors">{product.category}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      {/* Product section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-8 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Image gallery */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden mb-3">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImg}
                  src={galleryImages[currentImg] || product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 sm:p-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
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

            {/* Thumbnails */}
            <div ref={galleryRef} className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`flex-none w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === currentImg ? "border-foreground" : "border-border"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain bg-muted p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-5">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.brand}</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">{product.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{product.subtitle}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1 border border-border rounded-full px-3 py-1">
                <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">| {product.reviews} Reviews</span>
              </div>
              {product.discount && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  {product.discount}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">{product.price}</span>
              <span className="text-sm text-muted-foreground">MRP</span>
              <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
            </div>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Color: <span className="text-muted-foreground font-normal">{product.colors[selectedColor]}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color, i) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(i)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        i === selectedColor ? "border-foreground scale-110" : "border-border"
                      }`}
                      style={{ backgroundColor: colorHex[color] || "#ccc" }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Device */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Device</p>
              <div className="inline-flex border border-foreground rounded-lg px-4 py-2">
                <span className="text-sm font-medium">{product.device}</span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Quantity</p>
              <div className="inline-flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3">
              <button className="flex-1 bg-foreground text-background font-semibold py-3.5 rounded-xl text-sm tracking-wider hover:bg-foreground/90 transition-colors">
                ADD TO CART
              </button>
              <button className="flex-1 border-2 border-foreground text-foreground font-semibold py-3.5 rounded-xl text-sm tracking-wider hover:bg-foreground hover:text-background transition-colors">
                BUY NOW
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Orders above ₹999" },
                { icon: Shield, label: "1 Year Warranty", sub: "Full coverage" },
                { icon: RotateCcw, label: "Easy Returns", sub: "7-day return policy" },
                { icon: Package, label: "COD Available", sub: "Cash on delivery" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50">
                  <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">{label}</p>
                    <p className="text-[10px] text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-10 lg:mt-16">
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-3 text-sm font-medium capitalize transition-colors relative ${
                  activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="py-6"
            >
              {activeTab === "description" && (
                <div className="max-w-2xl space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    The {product.name} for {product.device} is crafted with premium materials to deliver
                    the perfect balance of style and protection. Precision-engineered for a snug fit with
                    easy access to all ports and buttons.
                  </p>
                  <p>
                    Featuring raised edges for camera and screen protection, this case guards your device
                    from everyday drops and scratches while maintaining a slim profile that fits comfortably
                    in your pocket.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Precision-cut for perfect fit</li>
                    <li>Raised bezels protect camera and screen</li>
                    <li>Compatible with wireless charging</li>
                    <li>Anti-yellowing technology</li>
                    <li>Slim profile, easy grip</li>
                  </ul>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="max-w-lg">
                  <div className="divide-y divide-border">
                    {specs.map((spec) => (
                      <div key={spec.label} className="flex justify-between py-3">
                        <span className="text-sm text-muted-foreground">{spec.label}</span>
                        <span className="text-sm font-medium text-foreground">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6 max-w-2xl">
                  {fakeReviews.map((review, i) => (
                    <div key={i} className="border-b border-border pb-5 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s < review.rating ? "fill-amber-400 text-amber-400" : "text-border"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground mb-1">{review.title}</p>
                      <p className="text-sm text-muted-foreground">{review.body}</p>
                      <p className="text-xs text-muted-foreground mt-2">— {review.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 lg:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-5">You May Also Like</h2>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
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
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Sticky mobile add-to-cart bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 flex items-center gap-3 z-50 lg:hidden">
        <div className="flex-1">
          <p className="text-lg font-bold text-foreground">{product.price}</p>
          <p className="text-[10px] text-muted-foreground line-through">{product.originalPrice}</p>
        </div>
        <button className="flex-1 bg-foreground text-background font-semibold py-3 rounded-xl text-sm tracking-wider">
          ADD TO CART
        </button>
      </div>

      <div className="lg:hidden h-16" /> {/* spacer for sticky bar */}
      <Footer />
    </div>
  );
};

export default ProductDetail;
