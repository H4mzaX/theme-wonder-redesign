import { Search, User, ShoppingBag } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-background section-padding py-5 sticky top-0 z-50 border-b border-border/50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="6" height="24" rx="3" fill="currentColor" />
            <rect x="14" y="2" width="6" height="36" rx="3" fill="currentColor" />
            <rect x="24" y="6" width="6" height="28" rx="3" fill="currentColor" />
            <rect x="34" y="12" width="6" height="16" rx="3" fill="currentColor" />
            <rect x="44" y="10" width="4" height="20" rx="2" fill="currentColor" />
            <rect x="0" y="14" width="4" height="12" rx="2" fill="currentColor" />
          </svg>
        </a>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {["Shop", "Collections", "Explore", "Compare", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors tracking-wide"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <button className="hover:text-accent transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="hover:text-accent transition-colors">
            <User className="w-5 h-5" />
          </button>
          <button className="hover:text-accent transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
              0
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
