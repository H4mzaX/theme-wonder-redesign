import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
}

const popularCategories = [
  { name: "iPhone Cases", href: "#" },
  { name: "Samsung Cases", href: "#" },
  { name: "Screen Protectors", href: "#" },
  { name: "OnePlus Cases", href: "#" },
];

const infoLinks = [
  { name: "About", href: "#" },
  { name: "Contact", href: "#" },
  { name: "FAQ's", href: "#" },
];

const SearchDrawer = ({ open, onClose }: SearchDrawerProps) => {
  const [query, setQuery] = useState("");
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 bg-foreground/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <motion.div
              className="fixed inset-x-0 bottom-0 bg-background z-50 rounded-t-2xl max-h-[85vh] flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Drag handle */}
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
                <div className="relative mb-8">
                  <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for ..." className="w-full bg-card rounded-lg px-5 py-4 text-base font-medium focus:outline-none placeholder:text-muted-foreground/50" autoFocus />
                  {query && <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors">Clear</button>}
                </div>
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 pb-2 border-b border-border">Popular categories</p>
                  <ul className="space-y-4">
                    {popularCategories.map((cat) => (
                      <li key={cat.name}><a href={cat.href} className="text-lg font-semibold hover:text-accent transition-colors">{cat.name}</a></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 pb-2 border-b border-border">Info</p>
                  <ul className="space-y-4">
                    {infoLinks.map((link) => (
                      <li key={link.name}><a href={link.href} className="text-lg font-semibold hover:text-accent transition-colors">{link.name}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-foreground/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-background z-50 flex flex-col" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-display font-semibold">Search</h2>
              <button onClick={onClose} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="relative mb-8">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cases, Protectors, anything..." className="w-full bg-transparent border-b-2 border-foreground pb-3 text-lg font-medium focus:outline-none placeholder:text-muted-foreground/50" autoFocus />
                {query && <button onClick={() => setQuery("")} className="absolute right-0 top-0 text-xs text-muted-foreground hover:text-foreground transition-colors">Clear</button>}
              </div>
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Popular categories</p>
                <ul className="space-y-3">
                  {popularCategories.map((cat) => (
                    <li key={cat.name}><a href={cat.href} className="text-lg font-medium hover:text-accent transition-colors">{cat.name}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Info</p>
                <ul className="space-y-3">
                  {infoLinks.map((link) => (
                    <li key={link.name}><a href={link.href} className="text-lg font-medium hover:text-accent transition-colors">{link.name}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchDrawer;
