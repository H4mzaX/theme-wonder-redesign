import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/** Official WhatsApp glyph (simplified, single-color) */
const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.345 0 2.106-.43 2.106-1.49 0-.473-.03-.602-.302-.86-.314-.302-.717-.487-1.085-.66z" />
    <path d="M16.045 4C9.466 4 4.114 9.353 4.114 15.93a11.89 11.89 0 0 0 1.587 5.945L4 28l6.27-1.644a11.91 11.91 0 0 0 5.775 1.473h.005c6.578 0 11.93-5.353 11.93-11.93C27.98 9.32 22.626 4 16.045 4zm0 21.82a9.86 9.86 0 0 1-5.038-1.378l-.36-.214-3.722.974.99-3.624-.234-.373a9.91 9.91 0 0 1-1.518-5.276c0-5.464 4.453-9.917 9.92-9.917 2.65 0 5.137 1.032 7.01 2.908a9.85 9.85 0 0 1 2.9 7.01c0 5.464-4.475 9.89-9.95 9.89z" />
  </svg>
);

const WhatsAppButton = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);

  // Auto-hide on scroll down, reveal on scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY && y > 80;
        setVisible(!goingDown);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide entirely on checkout to avoid overlapping the sticky pay CTA
  if (pathname.startsWith("/checkout")) return null;

  return (
    <a
      href="https://wa.me/919876543210?text=Hi%20VCASE!%20I%20need%20help."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed right-4 sm:right-6 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg shadow-black/20 text-white bg-[#25D366] hover:bg-[#1ebe57] hover:shadow-xl hover:scale-110 transition-all duration-300 ease-out bottom-24 sm:bottom-6 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
    </a>
  );
};

export default WhatsAppButton;
