import { useRef } from "react";
import { motion } from "framer-motion";

const messages = [
  "BUY ON EMI 🔥 | COD AVAILABLE ✅",
  "GET EXTRA DISCOUNT ON PREPAID ORDERS!",
  "BUY ON EMI 🔥 | COD AVAILABLE ✅",
  "GET EXTRA DISCOUNT ON PREPAID ORDERS!",
];

const doubled = [...messages, ...messages, ...messages];

const AnnouncementBar = () => {
  return (
    <div className="bg-announcement text-announcement-foreground py-2.5 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((msg, i) => (
          <span key={i} className="text-xs sm:text-sm font-medium tracking-wide px-8 flex items-center gap-3">
            {msg}
            <span className="text-background/40">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default AnnouncementBar;
