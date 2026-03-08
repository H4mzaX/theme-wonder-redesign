import { Search, User, ShoppingBag, Menu, X, ChevronRight, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollDirection } from "@/hooks/useScrollAnimations";
import { drawerSpring, premiumEase } from "@/lib/motion";
import { useCart } from "@/context/CartContext";
import logoFull from "@/assets/logo-full.png";

// ── Mega-menu data ──

const casesMenu = {
  title: "Shop by Type",
  items: [
  { name: "MagSafe Clear Case", href: "/collections/magsafe-cases", tag: "Popular" },
  { name: "MagSafe Pro Case", href: "/collections/magsafe-cases" },
  { name: "Silicone Case", href: "/collections/silicone-cases", tag: "Bestseller" },
  { name: "Leather Case", href: "/collections/leather-cases" },
  { name: "Clear Case", href: "/collections/all" },
  { name: "Matte Black Case", href: "/collections/all" }],

  collections: [
  { name: "All Cases", href: "/collections/all" },
  { name: "MagSafe Cases", href: "/collections/magsafe-cases" },
  { name: "Silicone Cases", href: "/collections/silicone-cases" },
  { name: "Leather Cases", href: "/collections/leather-cases" }]

};

const devicesMenu = {
  brands: [
  {
    name: "iPhone",
    models: [
    { name: "iPhone 17 Pro", href: "/collections/iphone-cases", tag: "New" },
    { name: "iPhone 17", href: "/collections/iphone-cases" },
    { name: "iPhone 16 Pro", href: "/collections/iphone-cases" },
    { name: "iPhone 16", href: "/collections/iphone-cases" },
    { name: "iPhone 15 Series", href: "/collections/iphone-cases" }]

  },
  {
    name: "Samsung",
    models: [
    { name: "Galaxy S26 Ultra", href: "/collections/samsung-cases", tag: "New" },
    { name: "Galaxy S26", href: "/collections/samsung-cases" },
    { name: "Galaxy S25 Ultra", href: "/collections/samsung-cases" },
    { name: "Galaxy S25", href: "/collections/samsung-cases" }]

  },
  {
    name: "OnePlus",
    models: [
    { name: "OnePlus 15", href: "/collections/oneplus-cases", tag: "New" },
    { name: "OnePlus 15R", href: "/collections/oneplus-cases" },
    { name: "OnePlus 14", href: "/collections/oneplus-cases" },
    { name: "OnePlus 13 Series", href: "/collections/oneplus-cases" }]

  },
  {
    name: "iQOO",
    models: [
    { name: "iQOO 15R", href: "/collections/all" }]

  }]

};

const exploreMenu = [
{ name: "About Us", subtitle: "Our story & mission", href: "#" },
{ name: "Shipping Policy", subtitle: "Fast & free delivery", href: "#" },
{ name: "Return & Refund", subtitle: "Hassle-free returns", href: "#" },
{ name: "Privacy Policy", subtitle: "Your data is safe", href: "#" },
{ name: "Contact Us", subtitle: "Get in touch", href: "#" }];


type MegaKey = "Cases" | "Devices" | "Explore";

interface NavbarProps {
  onSearchOpen: () => void;
  onCartOpen: () => void;
  transparent?: boolean;
}

const Navbar = ({ onSearchOpen, onCartOpen, transparent = false }: NavbarProps) => {
  const { scrolled, hidden } = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaKey | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { totalItems } = useCart();

  const isTransparent = transparent && !scrolled && !activeMega;
  const navItems: MegaKey[] = ["Cases", "Devices", "Explore"];

  const handleMouseEnter = (item: MegaKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMega(item);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMega(null), 180);
  };

  const handleMegaEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const closeMega = () => setActiveMega(null);

  return (
    <>
      <motion.nav
        className={`section-padding w-full py-2.5 sticky top-0 z-50 overflow-visible transition-all duration-300 will-change-transform ${
        isTransparent ?
        "bg-transparent text-background" :
        "bg-background"}`
        }
        initial={{ y: 0 }}
        animate={{ y: hidden && !activeMega ? "-100%" : 0 }}
        transition={{ duration: 0.5, ease: [0.6, 0, 0.4, 1] }}>
        
        <div className="flex items-center justify-between">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-muted active:scale-95 transition-all"
            onClick={() => setMobileOpen(true)}>
            
            <Menu className="w-6 h-6" strokeWidth={1.8} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <motion.img
              src={logoFull}
              alt="VCASE"
              className="h-6 sm:h-7 lg:h-8 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }} />
            
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5 relative">
            {navItems.map((item, i) => {
              const isActive = activeMega === item;
              return (
                <div
                  key={item}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}>
                  
                  <motion.button
                    className={`relative z-10 text-[13px] font-semibold uppercase tracking-[0.08em] flex items-center gap-1 px-4 py-2 rounded-full transition-colors duration-200 ${
                    isActive ? "text-background" : isTransparent ? "text-background/90 hover:text-background" : "text-foreground hover:text-foreground"}`
                    }
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}>
                    
                    {item}
                    
                  </motion.button>
                  {isActive &&
                  <motion.div
                    className={`absolute inset-0 rounded-full ${isTransparent ? "bg-background/20" : "bg-foreground"}`}
                    layoutId="navPill"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }} />

                  }
                </div>);

            })}

            {/* Static links */}
            <Link
              to="/collections/all"
              className={`text-[13px] font-semibold uppercase tracking-[0.08em] px-4 py-2 transition-colors duration-200 ${
              isTransparent ? "text-background/90 hover:text-background" : "text-foreground hover:text-accent"}`
              }>
              
              Sale
            </Link>
          </div>

          {/* Right icons */}
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

        {/* ── Desktop Mega Menu ── */}
        <AnimatePresence mode="wait">
          {activeMega &&
          <motion.div
            key={activeMega}
            className="absolute left-0 right-0 top-full z-50 bg-background border-t border-border/20 shadow-2xl transform-gpu will-change-transform"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: premiumEase }}
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMouseLeave}>
            
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
                {/* ── CASES MEGA ── */}
                {activeMega === "Cases" &&
              <div className="grid grid-cols-12 gap-10">
                    {/* Shop by Type */}
                    <div className="col-span-4">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-4">Shop by Type</p>
                      <div className="flex flex-col">
                        {casesMenu.items.map((item, idx) =>
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={closeMega}
                      className="group">
                      
                            <motion.div
                        className="flex items-center justify-between py-2.5 border-b border-border/10 last:border-0"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.2 }}>
                        
                              <div className="flex items-center gap-2.5">
                                <span className="text-[15px] font-medium text-foreground group-hover:text-accent transition-colors duration-200">
                                  {item.name}
                                </span>
                                {item.tag &&
                          <span className="text-[9px] uppercase tracking-wider font-bold bg-accent/10 text-accent px-1.5 py-0.5 rounded">
                                    {item.tag}
                                  </span>
                          }
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
                            </motion.div>
                          </Link>
                    )}
                      </div>
                    </div>

                    {/* Collections */}
                    <div className="col-span-3">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-4">Collections</p>
                      <div className="flex flex-col gap-1">
                        {casesMenu.collections.map((col, idx) =>
                    <Link
                      key={col.name}
                      to={col.href}
                      onClick={closeMega}
                      className="group">
                      
                            <motion.div
                        className="py-2 flex items-center gap-2"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 + 0.05, duration: 0.2 }}>
                        
                              <span className="text-[15px] font-medium text-foreground group-hover:text-accent transition-colors duration-200">
                                {col.name}
                              </span>
                            </motion.div>
                          </Link>
                    )}
                      </div>
                    </div>

                    {/* Featured promo */}
                    <div className="col-span-5">
                      <motion.div
                    className="bg-muted/50 rounded-xl p-6 h-full flex flex-col justify-center"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.08, duration: 0.3 }}>
                    
                        <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2">New Arrivals</span>
                        <h3 className="text-2xl font-bold tracking-tight mb-2">iPhone 17 Series</h3>
                        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                          Discover our latest MagSafe, Silicone & Leather cases designed for the all-new iPhone 17 lineup.
                        </p>
                        <Link
                      to="/collections/iphone-cases"
                      onClick={closeMega}
                      className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider bg-foreground text-background px-5 py-2.5 rounded-full hover:bg-foreground/90 transition-colors w-fit">
                      
                          Shop Now <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
              }

                {/* ── DEVICES MEGA ── */}
                {activeMega === "Devices" &&
              <div className="grid grid-cols-12 gap-8">
                    {devicesMenu.brands.map((brand, bi) =>
                <div key={brand.name} className="col-span-3">
                        <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: bi * 0.04, duration: 0.25 }}>
                    
                          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-4">
                            {brand.name}
                          </p>
                          <div className="flex flex-col">
                            {brand.models.map((model) =>
                      <Link
                        key={model.name}
                        to={model.href}
                        onClick={closeMega}
                        className="group">
                        
                                <div className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-medium text-foreground group-hover:text-accent transition-colors duration-200">
                                      {model.name}
                                    </span>
                                    {model.tag &&
                            <span className="text-[9px] uppercase tracking-wider font-bold bg-accent/10 text-accent px-1.5 py-0.5 rounded">
                                        {model.tag}
                                      </span>
                            }
                                  </div>
                                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 opacity-0 group-hover:opacity-100" />
                                </div>
                              </Link>
                      )}
                          </div>
                        </motion.div>
                      </div>
                )}
                  </div>
              }

                {/* ── EXPLORE MEGA ── */}
                {activeMega === "Explore" &&
              <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-5">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-4">Pages</p>
                      <div className="flex flex-col">
                        {exploreMenu.map((item, idx) =>
                    <Link key={item.name} to={item.href} onClick={closeMega} className="group">
                            <motion.div
                        className="flex items-center justify-between py-3 border-b border-border/10 last:border-0"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.2 }}>
                        
                              <div>
                                <span className="text-[15px] font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                                  {item.name}
                                </span>
                                <p className="text-[12px] text-muted-foreground mt-0.5">{item.subtitle}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
                            </motion.div>
                          </Link>
                    )}
                      </div>
                    </div>

                    <div className="col-span-7">
                      <motion.div
                    className="bg-muted/50 rounded-xl p-8 h-full flex flex-col justify-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.3 }}>
                    
                        <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2">Need Help?</span>
                        <h3 className="text-2xl font-bold tracking-tight mb-2">We're here for you</h3>
                        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                          Contact our support team for any questions about orders, shipping or products. We respond within 24 hours.
                        </p>
                        <Link
                      to="#"
                      onClick={closeMega}
                      className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider bg-foreground text-background px-5 py-2.5 rounded-full hover:bg-foreground/90 transition-colors w-fit">
                      
                          Contact Us <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
              }
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </motion.nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen &&
        <motion.div key="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60]">
            <motion.div className="absolute inset-0 bg-foreground/40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div
            className="fixed inset-x-0 bottom-0 w-full bg-background lg:hidden rounded-t-2xl h-[min(85dvh,720px)] flex flex-col will-change-transform"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={drawerSpring}>
            
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="flex justify-center py-3">
                <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-8">
                <div className="flex flex-col gap-1">
                  {/* Cases */}
                  <div>
                    <motion.button
                    className="flex items-center justify-between w-full text-2xl font-display font-bold text-foreground hover:text-accent transition-colors py-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    onClick={() => setMobileSubmenu(mobileSubmenu === "Cases" ? null : "Cases")}>
                    
                      Cases
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${mobileSubmenu === "Cases" ? "rotate-90" : ""}`} />
                    </motion.button>
                    <AnimatePresence>
                      {mobileSubmenu === "Cases" &&
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="pl-3 pb-3 flex flex-col gap-0.5">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-1 mb-2">Shop by Type</p>
                            {casesMenu.items.map((item) =>
                        <Link key={item.name} to={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-1.5 group">
                                <span className="text-[15px] font-medium text-foreground group-hover:text-accent transition-colors">{item.name}</span>
                                {item.tag && <span className="text-[8px] uppercase tracking-wider font-bold bg-accent/10 text-accent px-1.5 py-0.5 rounded">{item.tag}</span>}
                              </Link>
                        )}
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-3 mb-2">Collections</p>
                            {casesMenu.collections.map((col) =>
                        <Link key={col.name} to={col.href} onClick={() => setMobileOpen(false)} className="py-1.5 group">
                                <span className="text-[15px] font-medium text-foreground group-hover:text-accent transition-colors">{col.name}</span>
                              </Link>
                        )}
                          </div>
                        </motion.div>
                    }
                    </AnimatePresence>
                  </div>

                  {/* Devices */}
                  <div>
                    <motion.button
                    className="flex items-center justify-between w-full text-2xl font-display font-bold text-foreground hover:text-accent transition-colors py-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => setMobileSubmenu(mobileSubmenu === "Devices" ? null : "Devices")}>
                    
                      Devices
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${mobileSubmenu === "Devices" ? "rotate-90" : ""}`} />
                    </motion.button>
                    <AnimatePresence>
                      {mobileSubmenu === "Devices" &&
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="pl-3 pb-3 flex flex-col gap-0.5">
                            {devicesMenu.brands.map((brand) =>
                        <div key={brand.name}>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-2 mb-2">{brand.name}</p>
                                {brand.models.map((model) =>
                          <Link key={model.name} to={model.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-1.5 group">
                                    <span className="text-[14px] font-medium text-foreground group-hover:text-accent transition-colors">{model.name}</span>
                                    {model.tag && <span className="text-[8px] uppercase tracking-wider font-bold bg-accent/10 text-accent px-1.5 py-0.5 rounded">{model.tag}</span>}
                                  </Link>
                          )}
                              </div>
                        )}
                          </div>
                        </motion.div>
                    }
                    </AnimatePresence>
                  </div>

                  {/* Explore */}
                  <div>
                    <motion.button
                    className="flex items-center justify-between w-full text-2xl font-display font-bold text-foreground hover:text-accent transition-colors py-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    onClick={() => setMobileSubmenu(mobileSubmenu === "Explore" ? null : "Explore")}>
                    
                      Explore
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${mobileSubmenu === "Explore" ? "rotate-90" : ""}`} />
                    </motion.button>
                    <AnimatePresence>
                      {mobileSubmenu === "Explore" &&
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="pl-3 pb-3 flex flex-col gap-0.5">
                            {exploreMenu.map((item) =>
                        <Link key={item.name} to={item.href} onClick={() => setMobileOpen(false)} className="py-2 group">
                                <span className="text-[15px] font-medium text-foreground group-hover:text-accent transition-colors">{item.name}</span>
                                <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
                              </Link>
                        )}
                          </div>
                        </motion.div>
                    }
                    </AnimatePresence>
                  </div>

                  {/* Sale link */}
                  <Link
                  to="/collections/all"
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-display font-bold text-accent py-3">
                  
                    Sale
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

};

export default Navbar;