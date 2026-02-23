import { Search, User, ShoppingBag, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollDirection } from "@/hooks/useScrollAnimations";
import collectionHeadphones from "@/assets/collection-headphones.jpg";
import collectionEarphones from "@/assets/collection-earphones.jpg";
import collectionSpeakers from "@/assets/collection-speakers.jpg";
import collectionAccessories from "@/assets/collection-accessories.jpg";

const megaMenuData = {
  Shop: {
    collections: [
      { name: "Headphones", subtitle: "Surround yourself in sound", count: 15, image: collectionHeadphones },
      { name: "Earphones", subtitle: "Small design, great sound", count: 8, image: collectionEarphones },
      { name: "Speakers", subtitle: "The world's most immersive sound", count: 11, image: collectionSpeakers },
      { name: "Accessories", subtitle: "Optimal condition for years", count: 24, image: collectionAccessories },
    ],
    featured: {
      title: "New Arrivals",
      description: "Check out our latest collection of premium audio equipment.",
      cta: "Shop New",
    },
  },
  Collections: {
    collections: [
      { name: "All Products", subtitle: "Browse everything", count: 59, image: collectionHeadphones },
      { name: "Wireless", subtitle: "Freedom of movement", count: 15, image: collectionEarphones },
      { name: "Gaming", subtitle: "Dive into the game", count: 3, image: collectionSpeakers },
      { name: "Studio", subtitle: "Professional grade", count: 8, image: collectionAccessories },
    ],
    featured: {
      title: "Best Sellers",
      description: "Our most popular products chosen by customers worldwide.",
      cta: "View All",
    },
  },
};

type MegaMenuKey = keyof typeof megaMenuData;

const Navbar = () => {
  const { scrolled, hidden } = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaMenuKey | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems = ["Shop", "Collections", "Explore", "Compare", "Contact"];

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
        className={`bg-background/95 backdrop-blur-md section-padding py-4 sticky top-0 z-50 transition-shadow duration-300 ${
          scrolled ? "shadow-md border-b border-border/30" : "border-b border-border/50"
        }`}
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden hover:text-accent transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <motion.svg
              width="48"
              height="40"
              viewBox="0 0 48 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <rect x="4" y="8" width="6" height="24" rx="3" fill="currentColor" />
              <rect x="14" y="2" width="6" height="36" rx="3" fill="currentColor" />
              <rect x="24" y="6" width="6" height="28" rx="3" fill="currentColor" />
              <rect x="34" y="12" width="6" height="16" rx="3" fill="currentColor" />
              <rect x="44" y="10" width="4" height="20" rx="2" fill="currentColor" />
              <rect x="0" y="14" width="4" height="12" rx="2" fill="currentColor" />
            </motion.svg>
          </a>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item, i) => {
              const hasMega = item in megaMenuData;
              return (
                <div
                  key={item}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                >
                  <motion.a
                    href="#"
                    className={`text-sm font-medium text-foreground hover:text-accent transition-colors tracking-wide relative group flex items-center gap-1 ${
                      activeMega === item ? "text-accent" : ""
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                  >
                    {item}
                    {hasMega && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMega === item ? "rotate-180" : ""}`} />
                    )}
                    <span className="absolute -bottom-1 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </motion.a>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5">
            <motion.button
              className="hover:text-accent transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="hidden sm:block hover:text-accent transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="hover:text-accent transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                0
              </span>
            </motion.button>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMega && (
            <motion.div
              className="absolute left-0 top-full w-full bg-background border-t border-border/30 shadow-xl z-50"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="section-padding py-8">
                <div className="grid grid-cols-12 gap-8">
                  {/* Collections Grid */}
                  <div className="col-span-9">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5 font-medium">Collections</p>
                    <div className="grid grid-cols-4 gap-5">
                      {megaMenuData[activeMega].collections.map((col, idx) => (
                        <motion.a
                          key={col.name}
                          href="#"
                          className="group block"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.3 }}
                        >
                          <div className="aspect-square rounded-lg overflow-hidden mb-3 relative">
                            <img
                              src={col.image}
                              alt={col.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-display text-lg font-semibold tracking-tight group-hover:text-accent transition-colors relative">
                                {col.name}
                                <sup className="text-[10px] font-body ml-1 text-muted-foreground">{col.count}</sup>
                              </span>
                              <p className="text-xs text-muted-foreground mt-0.5">{col.subtitle}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  {/* Featured Panel */}
                  <div className="col-span-3">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5 font-medium">Featured</p>
                    <motion.div
                      className="bg-card rounded-lg p-6 h-[calc(100%-2rem)]"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                    >
                      <h3 className="font-display text-xl font-semibold mb-2">{megaMenuData[activeMega].featured.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{megaMenuData[activeMega].featured.description}</p>
                      <a
                        href="#"
                        className="inline-flex items-center gap-2 text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-full hover:bg-foreground/90 transition-colors"
                      >
                        {megaMenuData[activeMega].featured.cta}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-foreground/40 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 w-80 bg-background z-50 lg:hidden section-padding py-6 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex justify-between items-center mb-10">
                <svg width="40" height="34" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="8" width="6" height="24" rx="3" fill="currentColor" />
                  <rect x="14" y="2" width="6" height="36" rx="3" fill="currentColor" />
                  <rect x="24" y="6" width="6" height="28" rx="3" fill="currentColor" />
                  <rect x="34" y="12" width="6" height="16" rx="3" fill="currentColor" />
                </svg>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {navItems.map((item, i) => {
                  const hasMega = item in megaMenuData;
                  return (
                    <div key={item}>
                      <motion.button
                        className="flex items-center justify-between w-full text-lg font-display font-semibold text-foreground hover:text-accent transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                        onClick={() => {
                          if (hasMega) {
                            setMobileSubmenu(mobileSubmenu === item ? null : item);
                          }
                        }}
                      >
                        {item}
                        {hasMega && (
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSubmenu === item ? "rotate-180" : ""}`} />
                        )}
                      </motion.button>

                      {/* Mobile Submenu */}
                      <AnimatePresence>
                        {hasMega && mobileSubmenu === item && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pt-3 pb-2 flex flex-col gap-3">
                              {megaMenuData[item as MegaMenuKey].collections.map((col) => (
                                <a key={col.name} href="#" className="flex items-center gap-3 group">
                                  <img src={col.image} alt={col.name} className="w-12 h-12 rounded-md object-cover" />
                                  <div>
                                    <span className="text-sm font-medium group-hover:text-accent transition-colors">{col.name}</span>
                                    <p className="text-xs text-muted-foreground">{col.subtitle}</p>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
