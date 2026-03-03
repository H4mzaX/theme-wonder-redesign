import { useRef, type ReactNode } from "react";
import { motion, useAnimation } from "framer-motion";

const springConfig = { type: "spring" as const, stiffness: 150, damping: 15, mass: 0.1 };

interface MagnetButtonProps {
  children: ReactNode;
  magnetStrength?: number;
  className?: string;
  onClick?: () => void;
}

const MagnetButton = ({ children, magnetStrength = 10, className = "", onClick }: MagnetButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const textControls = useAnimation();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width - 0.5) * magnetStrength;
    const y = ((e.clientY - bounds.top) / bounds.height - 0.5) * magnetStrength;
    textControls.start({ x, y, transition: springConfig });
  };

  const handleMouseLeave = () => {
    textControls.start({ x: 0, y: 0, transition: springConfig });
  };

  return (
    <button
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.span animate={textControls} className="inline-block">
        {children}
      </motion.span>
    </button>
  );
};

export default MagnetButton;
