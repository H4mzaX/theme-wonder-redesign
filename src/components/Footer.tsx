const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="section-padding py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="8" width="6" height="24" rx="3" fill="currentColor" />
              <rect x="14" y="2" width="6" height="36" rx="3" fill="currentColor" />
              <rect x="24" y="6" width="6" height="28" rx="3" fill="currentColor" />
              <rect x="34" y="12" width="6" height="16" rx="3" fill="currentColor" />
              <rect x="44" y="10" width="4" height="20" rx="2" fill="currentColor" />
              <rect x="0" y="14" width="4" height="12" rx="2" fill="currentColor" />
            </svg>
            <p className="text-sm text-background/60 leading-relaxed">
              Premium audio equipment for audiophiles and music lovers. Experience sound in its purest form.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-semibold mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm text-background/60">
              {["All Products", "Headphones", "Earphones", "Speakers", "Accessories"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-background transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-background/60">
              {["About Us", "Contact", "FAQ's", "Shipping & Returns", "Warranty"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-background transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-background/60 mb-4">
              Subscribe to get special offers and updates on new products.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-background/10 border border-background/20 text-background placeholder:text-background/40 px-4 py-2.5 text-sm flex-1 rounded-l-lg focus:outline-none focus:border-background/40"
              />
              <button className="bg-background text-foreground px-5 py-2.5 text-sm font-medium rounded-r-lg hover:bg-background/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">© 2024 Harmony Sound. All rights reserved.</p>
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
