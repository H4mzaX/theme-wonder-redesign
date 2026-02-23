import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollDirection } from "@/hooks/useScrollAnimations";

const Navbar = () => {
  const { scrolled, hidden } = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);

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
            {["Shop", "Collections", "Explore", "Compare", "Contact"].map((item, i) => (
              <motion.a
                key={item}
                href="#"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors tracking-wide relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </motion.a>
            ))}
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
              className="fixed inset-y-0 left-0 w-80 bg-background z-50 lg:hidden section-padding py-6"
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
              <div className="flex flex-col gap-6">
                {["Shop", "Collections", "Explore", "Compare", "Contact"].map((item, i) => (
                  <motion.a
                    key={item}
                    href="#"
                    className="text-lg font-display font-semibold text-foreground hover:text-accent transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
