import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-14">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12" staggerDelay={0.1}>
          <StaggerItem>
            <div className="space-y-4">
              <span className="font-bold text-xl">VCASE</span>
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
                {["About Us", "Contact", "FAQ's", "Shipping & Returns", "Warranty"].map((item) => (
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
              <h4 className="font-semibold mb-4">Stay Updated</h4>
              <p className="text-sm text-background/60 mb-4">
                Subscribe to get special offers and first access to new cases.
              </p>
              <div className="flex">
                <input type="email" placeholder="Enter your email" className="bg-background/10 border border-background/20 text-background placeholder:text-background/40 px-4 py-2.5 text-sm flex-1 rounded-l-lg focus:outline-none focus:border-background/40 transition-colors" />
                <button className="bg-background text-foreground px-5 py-2.5 text-sm font-medium rounded-r-lg hover:bg-background/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">© 2026 VCASE. All rights reserved.</p>
          <div className="flex items-center gap-6">
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
