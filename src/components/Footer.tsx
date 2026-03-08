import { Link } from "react-router-dom";
import logoFull from "@/assets/logo-full.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-10">
          <div className="col-span-2 sm:col-span-1">
            <img src={logoFull} alt="VCASE" className="h-5 w-auto brightness-0 invert mb-3" />
            <p className="text-[11px] text-background/50 leading-relaxed">
              Premium phone protection.<br />veecartretail@gmail.com
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider mb-3">Shop</h4>
            <ul className="space-y-1.5 text-[11px] text-background/50">
              {["iPhone Cases", "Samsung Cases", "Screen Protectors"].map((item) => (
                <li key={item}><a href="#" className="hover:text-background transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider mb-3">Help</h4>
            <ul className="space-y-1.5 text-[11px] text-background/50">
              <li><Link to="/contact" className="hover:text-background transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-background transition-colors">Terms</Link></li>
              <li><Link to="/refund-policy" className="hover:text-background transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider mb-3">Follow</h4>
            <div className="flex gap-4 text-[11px] text-background/50">
              {["Instagram", "YouTube"].map((s) => (
                <a key={s} href="#" className="hover:text-background transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-6 pt-4">
          <p className="text-[10px] text-background/30">© 2026 VCASE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
