import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LazyVideo from "@/components/LazyVideo";

interface VideoTextOverlayProps {
  videoSrc: string;
  title: string;
  subtitle?: string;
  description?: string;
  poster?: string;
}

const VideoTextOverlay = ({ videoSrc, title, subtitle, description, poster }: VideoTextOverlayProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["30px", "-30px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const textY = useTransform(scrollYProgress, [0.1, 0.5], ["40px", "0px"]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Full-bleed video with parallax */}
      <motion.div
        className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden"
        style={{ scale, opacity }}
      >
        <motion.div className="absolute inset-0" style={{ y }}>
          <LazyVideo
            src={videoSrc}
            poster={poster}
            className="w-full h-[120%] object-cover"
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 to-transparent" />

        {/* Text content */}
        <motion.div
          className="absolute inset-0 flex flex-col items-start justify-end p-6 sm:p-10 lg:p-16"
          style={{ y: textY, opacity: textOpacity }}
        >
          {subtitle && (
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-background/70 font-medium mb-2 sm:mb-3">
              {subtitle}
            </span>
          )}
          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-display font-bold text-background leading-[1.05] tracking-tight whitespace-pre-line">
            {title}
          </h2>
          {description && (
            <p className="text-background/70 text-sm sm:text-base mt-3 sm:mt-4 max-w-lg leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default VideoTextOverlay;
