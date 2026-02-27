import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { allProducts, Product } from "@/data/products";
import { useNavigate } from "react-router-dom";
import { drawerSpring, premiumEase } from "@/lib/motion";

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
}

const popularCategories = [
  { name: "iPhone Cases", href: "/collections/iphone-cases" },
  { name: "Samsung Cases", href: "/collections/samsung-cases" },
  { name: "Screen Protectors", href: "/collections/screen-protectors" },
  { name: "OnePlus Cases", href: "/collections/oneplus-cases" },
];

const infoLinks = [
  { name: "About", href: "#" },
  { name: "Contact", href: "#" },
  { name: "FAQ's", href: "#" },
];

const SearchDrawer = ({ open, onClose }: SearchDrawerProps) => {
  const [query, setQuery] = useState("");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const seen = new Set<string>();
    return allProducts.filter((p) => {
      const key = `${p.name}-${p.device}`;
      if (seen.has(key)) return false;
      const match =
        p.name.toLowerCase().includes(q) ||
        p.device.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q);
      if (match) seen.add(key);
      return match;
    }).slice(0, 8);
  }, [query]);

  const handleProductClick = (product: Product) => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  const renderResults = () => (
    <AnimatePresence mode="popLayout">
      {results.length > 0 ? (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: premiumEase }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 pb-2 border-b border-border">
            {results.length} Result{results.length > 1 ? "s" : ""}
          </p>
          <div className="space-y-1">
            {results.map((product, i) => (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, delay: i * 0.03, ease: premiumEase }}
                onClick={() => handleProductClick(product)}
                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/60 transition-colors text-left group"
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg bg-secondary/50 overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base sm:text-lg text-foreground truncate leading-tight">
                    {product.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">{product.subtitle}</p>
                  <p className="text-sm font-bold text-foreground mt-1">
                    {product.price}{" "}
                    <span className="text-xs font-normal text-muted-foreground line-through ml-1">
                      {product.originalPrice}
                    </span>
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ) : query.trim() ? (
        <motion.p
          key="no-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground py-8 text-base"
        >
          No products found for "{query}"
        </motion.p>
      ) : null}
    </AnimatePresence>
  );

  const renderDefault = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08, duration: 0.24, ease: premiumEase }}>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 pb-2 border-b border-border">
          Popular categories
        </p>
        <ul className="space-y-4">
          {popularCategories.map((cat) => (
            <li key={cat.name}>
              <a href={cat.href} onClick={onClose} className="text-lg font-semibold hover:text-accent transition-colors">
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 pb-2 border-b border-border">Info</p>
        <ul className="space-y-4">
          {infoLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="text-lg font-semibold hover:text-accent transition-colors">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );

  const searchInput = (
    <motion.div
      className="relative mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3, ease: premiumEase }}
    >
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for cases, protectors..."
        className="w-full bg-card rounded-xl pl-12 pr-16 py-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 transition-shadow"
        autoFocus
      />
      {query && (
        <motion.button
          onClick={() => setQuery("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-muted px-2 py-1 rounded-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          Clear
        </motion.button>
      )}
    </motion.div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <motion.div key="search-mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60]">
            <motion.div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
            <motion.div
              className="fixed inset-x-0 bottom-0 bg-background rounded-t-2xl h-[min(85dvh,720px)] flex flex-col will-change-transform"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={drawerSpring}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-2xl font-display font-bold">Search</h2>
                <button onClick={onClose} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {searchInput}
                {query.trim() ? renderResults() : renderDefault()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="search-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="fixed inset-0 bg-foreground/40 z-50" onClick={onClose} />
          <motion.div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-background z-50 flex flex-col will-change-transform" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={drawerSpring}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-display font-bold">Search</h2>
              <button onClick={onClose} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {searchInput}
              {query.trim() ? renderResults() : renderDefault()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchDrawer;

