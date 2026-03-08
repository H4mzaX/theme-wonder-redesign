import { Home, LayoutGrid, User } from "lucide-react";
import { MenuIcon, SearchIcon, CartIcon } from "@/components/icons/PremiumIcons";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";

interface MobileBottomNavProps {
  onMenuOpen?: () => void;
  onSearchOpen?: () => void;
  onCartOpen?: () => void;
}

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: "menu" as const, label: "Menu", action: "menu" },
  { icon: "search" as const, label: "Search", action: "search" },
  { icon: LayoutGrid, label: "Shop", path: "/collections/all" },
  { icon: "cart" as const, label: "Cart", action: "cart" },
  { icon: User, label: "Account", path: "#" },
];

const MobileBottomNav = ({ onMenuOpen, onSearchOpen, onCartOpen }: MobileBottomNavProps) => {
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/50 sm:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = item.path ? location.pathname === item.path : false;

          const handleClick = () => {
            if (item.action === "menu") onMenuOpen?.();
            else if (item.action === "search") onSearchOpen?.();
            else if (item.action === "cart") onCartOpen?.();
          };

          const renderIcon = () => {
            const cls = `w-5 h-5 ${isActive ? "text-foreground" : "text-muted-foreground"}`;
            if (item.icon === "menu") return <MenuIcon className={cls} />;
            if (item.icon === "search") return <SearchIcon className={cls} />;
            if (item.icon === "cart") return <CartIcon className={cls} />;
            const Icon = item.icon;
            return <Icon className={cls} strokeWidth={isActive ? 2.5 : 1.8} />;
          };

          const content = (
            <div className="flex flex-col items-center gap-0.5 relative">
              {renderIcon()}
              {item.action === "cart" && totalItems > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-foreground text-background text-[9px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span
                className={`text-[10px] leading-none ${
                  isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </div>
          );

          if (item.path && !item.action) {
            return (
              <Link key={item.label} to={item.path} className="flex-1 flex items-center justify-center py-1">
                {content}
              </Link>
            );
          }

          return (
            <button key={item.label} onClick={handleClick} className="flex-1 flex items-center justify-center py-1">
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
