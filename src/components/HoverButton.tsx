import { type ReactNode } from "react";
import { motion, useAnimation } from "framer-motion";

interface HoverButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

const HoverButton = ({ children, className = "", onClick, href }: HoverButtonProps) => {
  const fillControls = useAnimation();

  const Tag = href ? "a" : "button";

  return (
    <Tag
      className={`relative overflow-hidden inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => fillControls.start({ y: "0%", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } })}
      onMouseLeave={() => fillControls.start({ y: "100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } })}
      onClick={onClick}
      {...(href ? { href } : {})}
    >
      <motion.span
        className="absolute inset-0 bg-foreground z-0"
        initial={{ y: "100%" }}
        animate={fillControls}
      />
      <span className="relative z-10 transition-colors duration-300">{children}</span>
    </Tag>
  );
};

export default HoverButton;
