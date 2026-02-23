import { Search, User, ShoppingBag, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollDirection } from "@/hooks/useScrollAnimations";
import collectionCases from "@/assets/collection-headphones.jpg";
import collectionProtectors from "@/assets/collection-earphones.jpg";
import collectionRugged from "@/assets/collection-speakers.jpg";
import collectionAccessories from "@/assets/collection-accessories.jpg";

const megaMenuData = {
  Devices: {
    collections: [
      { name: "iPhone Cases", subtitle: "iPhone 15 – 17 Pro Max", count: 24, image: collectionCases },
      { name: "Samsung Cases", subtitle: "Galaxy S25 – S26 Ultra", count: 20, image: collectionProtectors },
      { name: "OnePlus Cases", subtitle: "OnePlus 13 – 15R", count: 10, image: collectionRugged },
      { name: "iQOO Cases", subtitle: "iQOO 15R", count: 4, image: collectionAccessories },
    ],
    featured: {
      title: "New Arrivals",
      description: "Check out our latest cases for iPhone 17 and Samsung Galaxy S26 series.",
      cta: "Shop New",
    },
  },
  Products: {
    collections: [
      { name: "MagSafe Cases", subtitle: "Magnetic perfection", count: 18, image: collectionCases },
      { name: "Screen Protectors", subtitle: "Crystal clear defense", count: 18, image: collectionProtectors },
      { name: "Silicone Cases", subtitle: "Soft-touch comfort", count: 20, image: collectionRugged },
      { name: "Leather Cases", subtitle: "Premium craftsmanship", count: 12, image: collectionAccessories },
    ],
    featured: {
      title: "Best Sellers",
      description: "Our most popular cases chosen by thousands of customers worldwide.",
      cta: "View All",
    },
  },
  Support: {
    collections: [
      { name: "FAQ's", subtitle: "Common questions answered", count: 0, image: collectionCases },
      { name: "Shipping & Returns", subtitle: "Delivery and return policies", count: 0, image: collectionProtectors },
      { name: "Warranty", subtitle: "Product warranty details", count: 0, image: collectionRugged },
      { name: "Contact Us", subtitle: "Get in touch", count: 0, image: collectionAccessories },
    ],
    featured: {
      title: "Need Help?",
      description: "Our support team is available 24/7 to help with any questions.",
      cta: "Contact Us",
    },
  },
};

type MegaMenuKey = keyof typeof megaMenuData;

interface NavbarProps {
  onSearchOpen: () => void;
  onCartOpen: () => void;
}

const Navbar = ({ onSearchOpen, onCartOpen }: NavbarProps) => {
  const { scrolled, hidden } = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaMenuKey | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems = ["Devices", "Products", "Support", "Rewards"];

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
        className={`bg-background sticky top-0 z-50 transition-shadow duration-300 ${
          scrolled ? "shadow-sm border-b border-border" : "border-b border-border"
        }`}
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <a href="/" className="flex-shrink-0">
            <span className="font-bold text-xl tracking-tight">
              VCASE
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const hasMega = item in megaMenuData;
              const isActive = activeMega === item;
              return (
                <div
                  key={item}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href="#"
                    className={`text-sm font-medium flex items-center gap-1 px-4 py-2 transition-colors ${
                      isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {item}
                    {hasMega && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`} />
                    )}
                  </a>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            <button className="hover:text-muted-foreground transition-colors" onClick={onSearchOpen}>
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden sm:block hover:text-muted-foreground transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="hover:text-muted-foreground transition-colors relative" onClick={onCartOpen}>
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">0</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {activeMega && (
            <motion.div
              className="absolute left-0 top-full w-full bg-background border-t border-border shadow-lg z-50"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-9">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5 font-medium">Collections</p>
                    <div className="grid grid-cols-4 gap-5">
                      {megaMenuData[activeMega].collections.map((col, idx) => (
                        <motion.a key={col.name} href="#" className="group block" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04, duration: 0.25 }}>
                          <div className="aspect-square rounded-lg overflow-hidden mb-3 relative bg-muted">
                            <img src={col.image} alt={col.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-semibold group-hover:text-accent transition-colors">
                                {col.name}
                              </span>
                              <p className="text-xs text-muted-foreground mt-0.5">{col.subtitle}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" />
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5 font-medium">Featured</p>
                    <div className="bg-muted rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-2">{megaMenuData[activeMega].featured.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{megaMenuData[activeMega].featured.description}</p>
                      <a href="#" className="inline-flex items-center gap-2 text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-full hover:bg-foreground/90 transition-colors">
                        {megaMenuData[activeMega].featured.cta}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 bg-foreground/40 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.div className="fixed inset-y-0 left-0 w-80 bg-background z-50 lg:hidden px-6 py-6 overflow-y-auto" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-lg">VCASE</span>
                <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-col gap-4">
                {navItems.map((item) => {
                  const hasMega = item in megaMenuData;
                  return (
                    <div key={item}>
                      <button
                        className="flex items-center justify-between w-full text-lg font-semibold hover:text-muted-foreground transition-colors"
                        onClick={() => { if (hasMega) setMobileSubmenu(mobileSubmenu === item ? null : item); }}
                      >
                        {item}
                        {hasMega && <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSubmenu === item ? "rotate-180" : ""}`} />}
                      </button>
                      <AnimatePresence>
                        {hasMega && mobileSubmenu === item && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
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
