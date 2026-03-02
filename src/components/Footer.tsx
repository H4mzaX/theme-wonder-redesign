import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
import { Link } from "react-router-dom";
import logoFull from "@/assets/logo-full.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-14">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12" staggerDelay={0.1}>
          <StaggerItem>
            <div className="space-y-4">
              <img src={logoFull} alt="VCASE" className="h-6 w-auto brightness-0 invert" />
              <p className="text-sm text-background/60 leading-relaxed">
                Premium phone cases and screen protectors for iPhone, Samsung, OnePlus & more. Style meets protection.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2.5 text-sm text-background/60">
                {["All Products", "iPhone Cases", "Samsung Cases", "Screen Protectors", "Accessories"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-background transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-background/60">
                <li><a href="#" className="hover:text-background transition-colors">About Us</a></li>
                <li><Link to="/contact" className="hover:text-background transition-colors">Contact Us</Link></li>
                <li><a href="#" className="hover:text-background transition-colors">FAQ's</a></li>
                <li><Link to="/terms" className="hover:text-background transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/refund-policy" className="hover:text-background transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div>
              <h4 className="font-semibold mb-4">Stay Updated</h4>
              <p className="text-sm text-background/60 mb-4">
                Subscribe to get special offers and first access to new cases.
              </p>
              <div className="flex gap-0">
                <input type="email" placeholder="Enter your email" className="bg-background/10 border border-background/20 text-background placeholder:text-background/40 px-3 sm:px-4 py-2.5 text-sm flex-1 min-w-0 rounded-l-lg focus:outline-none focus:border-background/40 transition-colors" />
                <button className="bg-background text-foreground px-4 py-2.5 text-sm font-medium rounded-r-lg hover:bg-background/90 transition-colors flex-shrink-0">
                  Join
                </button>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
          <p className="text-xs text-background/40">© 2026 VCASE. All rights reserved.</p>
          <div className="flex items-center gap-5 sm:gap-6 flex-wrap justify-center">
            {["Facebook", "X", "Instagram", "YouTube"].map((s) => (
              <a key={s} href="#" className="text-xs text-background/40 hover:text-background transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
