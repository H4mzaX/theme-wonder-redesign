import { motion } from "framer-motion";

const LoadingDots = () => (
  <div className="flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-current"
        animate={{ scale: [1.6, 0.6, 1.6] }}
        transition={{
          duration: 0.7,
          repeat: Infinity,
          delay: i * 0.175,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default LoadingDots;
