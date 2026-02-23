import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";

const FloatingSidebar = () => {
  return (
    <motion.div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <div className="flex flex-col gap-3 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2.5 shadow-lg">
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <Facebook className="w-4 h-4" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <Twitter className="w-4 h-4" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <Instagram className="w-4 h-4" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <Youtube className="w-4 h-4" />
        </a>
      </div>
      <a
        href="#"
        className="mt-3 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 shadow-lg"
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-medium">
          Get 20% Off
        </span>
      </a>
    </motion.div>
  );
};

export default FloatingSidebar;
