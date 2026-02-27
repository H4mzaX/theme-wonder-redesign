import { Search, User, ShoppingBag, Menu, X, ChevronRight, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollDirection } from "@/hooks/useScrollAnimations";
import { drawerSpring, premiumEase } from "@/lib/motion";
import { useCart } from "@/context/CartContext";
import collectionCases from "@/assets/collection-headphones.jpg";
import collectionProtectors from "@/assets/collection-earphones.jpg";
import collectionRugged from "@/assets/collection-speakers.jpg";
import collectionAccessories from "@/assets/collection-accessories.jpg";

const megaMenuData = {
  Shop: {
    collections: [
      { name: "iPhone Cases", subtitle: "Premium protection for iPhone", count: 24, image: collectionCases, href: "/collections/iphone-cases" },
      { name: "Samsung Cases", subtitle: "Galaxy protection", count: 18, image: collectionProtectors, href: "/collections/samsung-cases" },
      { name: "OnePlus Cases", subtitle: "Never settle on protection", count: 12, image: collectionRugged, href: "/collections/oneplus-cases" },
      { name: "All Products", subtitle: "Browse everything", count: 84, image: collectionAccessories, href: "/collections/all" },
    ],
    featured: {
      title: "New Arrivals",
      description: "Check out our latest cases for iPhone 16 and Samsung Galaxy S25 series.",
      cta: "Shop New",
      href: "/collections/all",
    },
  },
  Collections: {
    collections: [
      { name: "MagSafe Cases", subtitle: "Snap-on perfection", count: 20, image: collectionCases, href: "/collections/magsafe-cases" },
      { name: "Leather Cases", subtitle: "Handcrafted premium", count: 20, image: collectionProtectors, href: "/collections/leather-cases" },
      { name: "All Products", subtitle: "Browse everything", count: 84, image: collectionRugged, href: "/collections/all" },
      { name: "iPhone Cases", subtitle: "Premium protection", count: 24, image: collectionAccessories, href: "/collections/iphone-cases" },
    ],
    featured: {
      title: "Best Sellers",
      description: "Our most popular cases chosen by thousands of customers worldwide.",
      cta: "View All",
      href: "/collections/all",
    },
  },
  Explore: {
    collections: [
      { name: "About Us", subtitle: "Our story & mission", count: 0, image: collectionCases, href: "#" },
      { name: "Shipping Policy", subtitle: "Fast & free delivery", count: 0, image: collectionProtectors, href: "#" },
      { name: "Return & Refund", subtitle: "Hassle-free returns", count: 0, image: collectionRugged, href: "#" },
      { name: "Privacy Policy", subtitle: "Your data is safe", count: 0, image: collectionAccessories, href: "#" },
    ],
    featured: {
      title: "Need Help?",
      description: "Contact our support team for any questions about orders, shipping or products.",
      cta: "Contact Us",
      href: "#",
    },
  },
};

type MegaMenuKey = keyof typeof megaMenuData;

interface NavbarProps {
  onSearchOpen: () => void;
  onCartOpen: () => void;
  transparent?: boolean;
}

const Navbar = ({ onSearchOpen, onCartOpen, transparent = false }: NavbarProps) => {
  const { scrolled } = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaMenuKey | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { totalItems } = useCart();

  const isTransparent = transparent && !scrolled && !activeMega;

  const navItems = ["Shop", "Collections", "Explore"];

  const handleMouseEnter = (item: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (item in megaMenuData) {
      setActiveMega(item as MegaMenuKey);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 150);
  };

  const handleMegaEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <>
      <motion.nav
        className={`section-padding w-full py-4 sticky top-0 z-50 overflow-visible transition-all duration-300 ${
          isTransparent
            ? "bg-transparent text-background"
            : scrolled
              ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border/30"
              : "bg-background/95 backdrop-blur-md border-b border-border/50"
        }`}
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.26, ease: premiumEase }}
      >
        <div className="flex items-center justify-between">
          <button
            className="lg:hidden hover:text-accent transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <motion.span
              className="font-display font-bold text-xl tracking-tight"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              VCASE
            </motion.span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 relative">
            {navItems.map((item, i) => {
              const isActive = activeMega === item;
              return (
                <div
                  key={item}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                >
                  <motion.a
                    href="#"
                    className={`relative z-10 text-sm font-medium tracking-wide flex items-center gap-1 px-4 py-2 rounded-full transition-colors duration-200 ${
                      isActive ? "text-background" : isTransparent ? "text-background/90 hover:text-background" : "text-foreground hover:text-foreground"
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                  >
                    {item}
                  </motion.a>
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-full ${isTransparent ? "bg-background/20" : "bg-foreground"}`}
                      layoutId="navPill"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            <motion.button className="hover:text-accent transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={onSearchOpen}>
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button className="hidden sm:block hover:text-accent transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <User className="w-5 h-5" />
            </motion.button>
            <motion.button className="hover:text-accent transition-colors relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={onCartOpen}>
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{totalItems}</span>}
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeMega && (
            <motion.div
              key={activeMega}
              className="absolute left-1/2 top-full z-50 w-[min(1240px,calc(100vw-2rem))] -translate-x-1/2 bg-background border border-border/30 shadow-xl rounded-b-2xl transform-gpu will-change-transform"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: premiumEase }}
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-4 sm:px-6 lg:px-8 py-8">
                {activeMega === "Explore" ? (
                  /* Explore: vertical text links + featured card */
                  <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-5">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5 font-medium">Pages</p>
                      <div className="flex flex-col gap-1">
                        {megaMenuData[activeMega].collections.map((col, idx) => (
                          <Link key={col.name} to={col.href} onClick={() => setActiveMega(null)} className="group">
                            <motion.div
                              className="flex items-center justify-between py-2.5 border-b border-border/20 last:border-0"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.04, duration: 0.25 }}
                            >
                              <div>
                                <span className="text-base font-semibold group-hover:text-accent transition-colors duration-200">{col.name}</span>
                                <p className="text-xs text-muted-foreground mt-0.5">{col.subtitle}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-4">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5 font-medium">Featured</p>
                      <motion.div className="bg-card rounded-lg p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
                        <h3 className="font-display text-xl font-semibold mb-2">{megaMenuData[activeMega].featured.title}</h3>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{megaMenuData[activeMega].featured.description}</p>
                        <Link to={megaMenuData[activeMega].featured.href} onClick={() => setActiveMega(null)} className="inline-flex items-center gap-2 text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-full hover:bg-foreground/90 transition-colors">
                          {megaMenuData[activeMega].featured.cta}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    </div>
                    <div className="col-span-3">
                      <motion.div
                        className="rounded-lg overflow-hidden h-full"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.12, duration: 0.35 }}
                      >
                        <img src={collectionCases} alt="Featured" className="w-full h-full object-cover" loading="eager" />
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  /* Shop / Collections: image grid + featured card */
                  <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-9">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5 font-medium">Collections</p>
                      <div className="grid grid-cols-4 gap-5">
                        {megaMenuData[activeMega].collections.map((col, idx) => (
                          <Link key={col.name} to={col.href} onClick={() => setActiveMega(null)} className="group block">
                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04, duration: 0.25, ease: "easeOut" }}>
                              <div className="aspect-square rounded-lg overflow-hidden mb-3 relative">
                                <img src={col.image} alt={col.name} className="w-full h-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-110" loading="eager" decoding="async" />
                                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-display text-lg font-semibold tracking-tight group-hover:text-accent transition-colors duration-200">
                                    {col.name}
                                    {col.count > 0 && <sup className="text-[10px] font-body ml-1 text-muted-foreground">{col.count}</sup>}
                                  </span>
                                  <p className="text-xs text-muted-foreground mt-0.5">{col.subtitle}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5 font-medium">Featured</p>
                      <motion.div className="bg-card rounded-lg p-6 h-[calc(100%-2rem)]" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
                        <h3 className="font-display text-xl font-semibold mb-2">{megaMenuData[activeMega].featured.title}</h3>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{megaMenuData[activeMega].featured.description}</p>
                        <Link to={megaMenuData[activeMega].featured.href} onClick={() => setActiveMega(null)} className="inline-flex items-center gap-2 text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-full hover:bg-foreground/90 transition-colors">
                          {megaMenuData[activeMega].featured.cta}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile menu - bottom sheet style */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 bg-foreground/40 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.div
              className="fixed inset-x-0 bottom-0 w-full bg-background z-50 lg:hidden rounded-t-2xl h-[min(85dvh,720px)] flex flex-col will-change-transform"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={drawerSpring}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Close button */}
              <div className="flex justify-center py-3">
                <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-8">
                <div className="flex flex-col gap-1">
                  {navItems.map((item, i) => {
                    const hasMega = item in megaMenuData;
                    return (
                      <div key={item}>
                        <motion.button
                          className="flex items-center justify-between w-full text-2xl font-display font-bold text-foreground hover:text-accent transition-colors py-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * i }}
                          onClick={() => { if (hasMega) setMobileSubmenu(mobileSubmenu === item ? null : item); }}
                        >
                          {item}
                          {hasMega && <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${mobileSubmenu === item ? "rotate-90" : ""}`} />}
                        </motion.button>
                        <AnimatePresence>
                          {hasMega && mobileSubmenu === item && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                              <div className="pl-2 pt-1 pb-3 flex flex-col gap-3">
                                {megaMenuData[item as MegaMenuKey].collections.map((col) => (
                                  <Link key={col.name} to={col.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 group py-1">
                                    <div>
                                      <span className="text-base font-medium group-hover:text-accent transition-colors">{col.name}</span>
                                      <p className="text-xs text-muted-foreground">{col.subtitle}</p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
