import { X, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { MenuIcon, SearchIcon, UserIcon, CartIcon } from "@/components/icons/PremiumIcons";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollDirection } from "@/hooks/useScrollAnimations";
import { drawerSpring, premiumEase } from "@/lib/motion";
import { useCart } from "@/context/CartContext";
import { seriesData, deviceSeries } from "@/data/products";
import logoFull from "@/assets/logo-full.png";
import BrandName from "@/components/BrandName";

// ── Mega-menu data ──

const casesMenuItems = [
  { name: "ClearMag", slug: "clearmag", icon: "/icons/clearmag.webp", tag: "Popular" },
  { name: "ClearMag Edge", slug: "clearmag-edge", icon: "/icons/clearmag-edge.webp" },
  { name: "SoftMag", slug: "softmag", icon: "/icons/softmag.webp", tag: "Bestseller" },
  { name: "Armor Edge", slug: "armor-edge", icon: "/icons/armoredge.png", tag: "New" },
];

const protectionMenuItems = [
  { name: "EdgeGuard", slug: "edgeguard", icon: "/icons/edgeguard.webp", subtitle: "Screen Protection" },
  { name: "LensGuard", slug: "lensguard", icon: "/icons/lensguard.webp", subtitle: "Camera Protection" },
];

const devicesMenuItems = deviceSeries.map((group) => ({
  name: group.name,
  slug: group.slug,
  models: group.models,
}));

const exploreMenu = [
  { name: "About Us", subtitle: "Our story & mission", href: "#" },
  { name: "Shipping Policy", subtitle: "Fast & free delivery", href: "#" },
  { name: "Return & Refund", subtitle: "Hassle-free returns", href: "#" },
  { name: "Privacy Policy", subtitle: "Your data is safe", href: "#" },
  { name: "Contact Us", subtitle: "Get in touch", href: "/contact" },
];

type MegaKey = "Cases" | "Protection" | "Devices" | "Explore";

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
  const [mobileDrilldown, setMobileDrilldown] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { totalItems } = useCart();

  const isTransparent = transparent && !scrolled && !activeMega;
  const navItems: MegaKey[] = ["Cases", "Protection", "Devices", "Explore"];

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
        className={`section-padding w-full py-5 sm:py-5 lg:py-6 sticky top-0 z-50 overflow-visible transition-all duration-300 will-change-transform rounded-t-[1.25rem] sm:rounded-t-[1rem] lg:rounded-t-[0.625rem] ${
          isTransparent ? "bg-transparent text-background" : "bg-background"
        }`}
        initial={{ y: 0 }}
        animate={{ y: hidden && !activeMega ? "-100%" : 0 }}
        transition={{ duration: 0.5, ease: [0.6, 0, 0.4, 1] }}
      >
        <div className="flex items-center justify-between">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden w-11 h-11 flex items-center justify-center -ml-2 rounded-full hover:bg-muted active:scale-95 transition-all"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <motion.img
              src={logoFull}
              alt="VCASE"
              className="h-8 sm:h-9 lg:h-10 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </Link>

          {/* Desktop nav */}
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
                  <motion.button
                    className={`relative z-10 text-[15px] font-medium flex items-center gap-1 px-5 py-2 transition-colors duration-200 ${
                      isActive ? "text-foreground" : isTransparent ? "text-background/90 hover:text-background" : "text-muted-foreground hover:text-foreground"
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                  >
                    {item}
                  </motion.button>
                  {isActive && (
                    <motion.div
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full ${isTransparent ? "bg-background" : "bg-foreground"}`}
                      layoutId="navUnderline"
                      style={{ width: "60%" }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}

            {/* Sale link */}
            <Link
              to="/collections/all"
              className={`text-[15px] font-medium px-5 py-2 transition-colors duration-200 ${
                isTransparent ? "text-background/90 hover:text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sale
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-7">
            <motion.button className="hover:text-accent transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={onSearchOpen}>
              <SearchIcon className="w-6 h-6" />
            </motion.button>
            <motion.button className="hidden sm:block hover:text-accent transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <UserIcon className="w-6 h-6" />
            </motion.button>
            <motion.button className="hover:text-accent transition-colors relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={onCartOpen}>
              <CartIcon className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* ── Desktop Mega Menu — Concept Theme Style ── */}
        <AnimatePresence>
          {activeMega && (
            <motion.div
              key={activeMega}
              className="absolute left-0 right-0 top-full z-50 bg-background shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transform-gpu will-change-transform overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Top border line */}
              <motion.div
                className="h-px bg-border/40"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.div
                className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >

                {/* ── CASES MEGA ── */}
                {activeMega === "Cases" && (
                  <div>
                    <div className="grid grid-cols-4 gap-5">
                      {casesMenuItems.map((item, idx) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Link
                            to={`/${item.slug}/iphone-17?model=iphone-17-pro`}
                            onClick={closeMega}
                            className="group block"
                          >
                            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[4/3] mb-3.5">
                              <img
                                src={item.icon}
                                alt={item.name}
                                className="w-20 h-20 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500 ease-out"
                              />
                              {item.tag && (
                                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider font-bold bg-foreground text-background px-2.5 py-1 rounded-full">
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <BrandName name={item.name} className="text-[15px] font-semibold text-foreground group-hover:text-accent transition-colors duration-200" />
                          </Link>

                          {/* Device links under each series */}
                          <div className="mt-2 flex flex-col gap-0.5">
                            {deviceSeries.flatMap((group) =>
                              group.models.map((model) => (
                                <Link
                                  key={model.slug}
                                  to={`/${item.slug}/${group.slug}?model=${model.slug}`}
                                  onClick={closeMega}
                                  className="text-[12.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 py-0.5"
                                >
                                  {model.name}
                                </Link>
                              ))
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── PROTECTION MEGA ── */}
                {activeMega === "Protection" && (
                  <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-5">
                      <div className="grid grid-cols-2 gap-5">
                        {protectionMenuItems.map((item, idx) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <Link
                              to={`/${item.slug}/iphone-17?model=iphone-17-pro`}
                              onClick={closeMega}
                              className="group block"
                            >
                              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square mb-3.5">
                                <img
                                  src={item.icon}
                                  alt={item.name}
                                  className="w-16 h-16 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500 ease-out"
                                />
                              </div>
                              <BrandName name={item.name} className="text-[15px] font-semibold text-foreground group-hover:text-accent transition-colors duration-200" />
                              <p className="text-[12px] text-muted-foreground mt-0.5">{item.subtitle}</p>
                            </Link>

                            <div className="mt-2 flex flex-col gap-0.5">
                              {deviceSeries.flatMap((group) =>
                                group.models.map((model) => (
                                  <Link
                                    key={model.slug}
                                    to={`/${item.slug}/${group.slug}?model=${model.slug}`}
                                    onClick={closeMega}
                                    className="text-[12.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 py-0.5"
                                  >
                                    {model.name}
                                  </Link>
                                ))
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-7">
                      <motion.div
                        className="rounded-2xl bg-muted/60 p-8 h-full flex flex-col justify-center"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.12, duration: 0.35 }}
                      >
                        <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2">Complete Protection</span>
                        <h3 className="text-2xl font-bold tracking-tight mb-2">Screen + Camera Bundle</h3>
                        <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-md">
                          Get complete protection with EdgeGuard screen protectors and LensGuard camera shields. Save when you bundle.
                        </p>
                        <Link
                          to="/edgeguard/iphone-17?model=iphone-17-pro"
                          onClick={closeMega}
                          className="inline-flex items-center gap-2 text-[13px] font-semibold bg-foreground text-background px-6 py-3 rounded-full hover:bg-foreground/90 transition-colors w-fit"
                        >
                          Shop Protection <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* ── DEVICES MEGA ── */}
                {activeMega === "Devices" && (
                  <div className="grid grid-cols-12 gap-10">
                    {devicesMenuItems.map((group, bi) => (
                      <div key={group.name} className="col-span-4">
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: bi * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-4 pb-2 border-b border-border/30">
                            {group.name}
                          </p>
                          <div className="flex flex-col">
                            {group.models.map((model) => (
                              <Link
                                key={model.slug}
                                to={`/clearmag/${group.slug}?model=${model.slug}`}
                                onClick={closeMega}
                                className="group flex items-center justify-between py-2.5 hover:pl-1 transition-all duration-200"
                              >
                                <span className="text-[14px] font-medium text-foreground group-hover:text-accent transition-colors duration-200">
                                  {model.name}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-accent transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground/100" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── EXPLORE MEGA ── */}
                {activeMega === "Explore" && (
                  <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-5">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-4 pb-2 border-b border-border/30">
                        Info
                      </p>
                      <div className="flex flex-col">
                        {exploreMenu.map((item, idx) => (
                          <Link key={item.name} to={item.href} onClick={closeMega} className="group">
                            <motion.div
                              className="flex items-center justify-between py-3"
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03, duration: 0.25 }}
                            >
                              <div>
                                <span className="text-[14px] font-medium text-foreground group-hover:text-accent transition-colors duration-200">
                                  {item.name}
                                </span>
                                <p className="text-[12px] text-muted-foreground mt-0.5">{item.subtitle}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200 group-hover:text-muted-foreground/100" />
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-7">
                      <motion.div
                        className="rounded-2xl bg-muted/60 p-8 h-full flex flex-col justify-center"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2">Need Help?</span>
                        <h3 className="text-2xl font-bold tracking-tight mb-2">We're here for you</h3>
                        <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-md">
                          Contact our support team for any questions about orders, shipping or products.
                        </p>
                        <Link
                          to="/contact"
                          onClick={closeMega}
                          className="inline-flex items-center gap-2 text-[13px] font-semibold bg-foreground text-background px-6 py-3 rounded-full hover:bg-foreground/90 transition-colors w-fit"
                        >
                          Contact Us <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                )}

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div key="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60]">
            <motion.div className="absolute inset-0 bg-foreground/40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div
              className="fixed inset-x-0 bottom-0 w-full bg-background lg:hidden rounded-t-2xl h-[min(85dvh,720px)] flex flex-col will-change-transform"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={drawerSpring}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="flex justify-center py-3">
                <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-8">
                <div className="flex flex-col gap-1">

                  {/* ── Cases ── */}
                  <div>
                    <motion.button
                      className="flex items-center justify-between w-full text-2xl font-display font-bold text-foreground hover:text-accent transition-colors py-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      onClick={() => {
                        setMobileSubmenu(mobileSubmenu === "Cases" ? null : "Cases");
                        setMobileDrilldown(null);
                      }}
                    >
                      Cases
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${mobileSubmenu === "Cases" ? "rotate-90" : ""}`} />
                    </motion.button>
                    <AnimatePresence>
                      {mobileSubmenu === "Cases" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="pl-3 pb-3 flex flex-col gap-0.5">
                            {!mobileDrilldown ? (
                              <>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-1 mb-2">
                                  <button onClick={() => setMobileSubmenu(null)} className="flex items-center gap-1">
                                    <ChevronLeft className="w-3 h-3" /> Cases
                                  </button>
                                </p>
                                {casesMenuItems.map((item) => (
                                    <button
                                      key={item.name}
                                      onClick={() => setMobileDrilldown(item.slug)}
                                      className="flex items-center justify-between py-2 group"
                                    >
                                      <div className="flex items-center gap-3">
                                        <img src={item.icon} alt={item.name} className="w-9 h-9 rounded-lg" />
                                        <BrandName name={item.name} className="text-[15px] font-medium text-foreground group-hover:text-accent transition-colors" />
                                        {item.tag && <span className="text-[8px] uppercase tracking-wider font-bold bg-accent/10 text-accent px-1.5 py-0.5 rounded">{item.tag}</span>}
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                ))}
                              </>
                            ) : (
                              <>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-1 mb-2">
                                  <button onClick={() => setMobileDrilldown(null)} className="flex items-center gap-1">
                                    <ChevronLeft className="w-3 h-3" /> <BrandName name={casesMenuItems.find(i => i.slug === mobileDrilldown)?.name || ""} />
                                  </button>
                                </p>
                                {deviceSeries.flatMap((group) =>
                                  group.models.map((model) => (
                                    <Link
                                      key={model.slug}
                                      to={`/${mobileDrilldown}/${group.slug}?model=${model.slug}`}
                                      onClick={() => setMobileOpen(false)}
                                      className="flex items-center gap-2 py-2 group"
                                    >
                                      <span className="text-[14px] font-medium text-foreground group-hover:text-accent transition-colors">{model.name}</span>
                                    </Link>
                                  ))
                                )}
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Protection ── */}
                  <div>
                    <motion.button
                      className="flex items-center justify-between w-full text-2xl font-display font-bold text-foreground hover:text-accent transition-colors py-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 }}
                      onClick={() => {
                        setMobileSubmenu(mobileSubmenu === "Protection" ? null : "Protection");
                        setMobileDrilldown(null);
                      }}
                    >
                      Protection
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${mobileSubmenu === "Protection" ? "rotate-90" : ""}`} />
                    </motion.button>
                    <AnimatePresence>
                      {mobileSubmenu === "Protection" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="pl-3 pb-3 flex flex-col gap-0.5">
                            {!mobileDrilldown ? (
                              protectionMenuItems.map((item) => (
                                <button
                                  key={item.name}
                                  onClick={() => setMobileDrilldown(item.slug)}
                                  className="flex items-center justify-between py-2 group"
                                >
                                  <div className="flex items-center gap-3">
                                    <img src={item.icon} alt={item.name} className="w-9 h-9 rounded-lg" />
                                    <div className="text-left">
                                      <BrandName name={item.name} className="text-[15px] font-medium text-foreground group-hover:text-accent transition-colors" />
                                      <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </button>
                              ))
                            ) : (
                              <>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-1 mb-2">
                                  <button onClick={() => setMobileDrilldown(null)} className="flex items-center gap-1">
                                    <ChevronLeft className="w-3 h-3" /> <BrandName name={protectionMenuItems.find(i => i.slug === mobileDrilldown)?.name || ""} />
                                  </button>
                                </p>
                                {deviceSeries.flatMap((group) =>
                                  group.models.map((model) => (
                                    <Link
                                      key={model.slug}
                                      to={`/${mobileDrilldown}/${group.slug}?model=${model.slug}`}
                                      onClick={() => setMobileOpen(false)}
                                      className="flex items-center gap-2 py-2 group"
                                    >
                                      <span className="text-[14px] font-medium text-foreground group-hover:text-accent transition-colors">{model.name}</span>
                                    </Link>
                                  ))
                                )}
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Devices ── */}
                  <div>
                    <motion.button
                      className="flex items-center justify-between w-full text-2xl font-display font-bold text-foreground hover:text-accent transition-colors py-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      onClick={() => {
                        setMobileSubmenu(mobileSubmenu === "Devices" ? null : "Devices");
                        setMobileDrilldown(null);
                      }}
                    >
                      Devices
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${mobileSubmenu === "Devices" ? "rotate-90" : ""}`} />
                    </motion.button>
                    <AnimatePresence>
                      {mobileSubmenu === "Devices" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="pl-3 pb-3 flex flex-col gap-0.5">
                            {deviceSeries.flatMap((group) =>
                              group.models.map((model) => (
                                <Link
                                  key={model.slug}
                                  to={`/clearmag/${group.slug}?model=${model.slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="py-2 group"
                                >
                                  <span className="text-[15px] font-medium text-foreground group-hover:text-accent transition-colors">{model.name}</span>
                                </Link>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Explore ── */}
                  <div>
                    <motion.button
                      className="flex items-center justify-between w-full text-2xl font-display font-bold text-foreground hover:text-accent transition-colors py-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      onClick={() => {
                        setMobileSubmenu(mobileSubmenu === "Explore" ? null : "Explore");
                        setMobileDrilldown(null);
                      }}
                    >
                      Explore
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${mobileSubmenu === "Explore" ? "rotate-90" : ""}`} />
                    </motion.button>
                    <AnimatePresence>
                      {mobileSubmenu === "Explore" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="pl-3 pb-3 flex flex-col gap-0.5">
                            {exploreMenu.map((item) => (
                              <Link key={item.name} to={item.href} onClick={() => setMobileOpen(false)} className="py-2 group">
                                <span className="text-[15px] font-medium text-foreground group-hover:text-accent transition-colors">{item.name}</span>
                                <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Sale link */}
                  <Link
                    to="/collections/all"
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-display font-bold text-accent py-3"
                  >
                    Sale
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
