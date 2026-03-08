import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LazyVideo from "@/components/LazyVideo";

interface ScrollVideoRevealProps {
  videoSrc: string;
  poster?: string;
  textItems: string[];
}

/**
 * Concept-theme style: A video stays pinned while the user scrolls,
 * and text headings reveal/fade one-by-one as scroll progresses.
 * Each text item occupies ~1 viewport of scroll distance.
 */
const ScrollVideoReveal = ({ videoSrc, poster, textItems }: ScrollVideoRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemCount = textItems.length;

  // Container height = (itemCount + 1) * 100vh so video stays pinned
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${(itemCount + 1) * 100}vh` }}
    >
      {/* Sticky video + overlay wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Video background */}
        <div className="absolute inset-0">
          <LazyVideo
            src={videoSrc}
            poster={poster}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-foreground/50" />
        </div>

        {/* Text items — each fades in/out based on scroll position */}
        <div className="absolute inset-0 flex items-center justify-center">
          {textItems.map((text, i) => (
            <ScrollTextItem
              key={i}
              text={text}
              index={i}
              total={itemCount}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ScrollTextItem = ({
  text,
  index,
  total,
  scrollYProgress,
}: {
  text: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  // Each item gets a segment of the scroll range
  const segmentSize = 1 / (total + 1);
  const start = index * segmentSize;
  const peak = start + segmentSize * 0.5;
  const end = start + segmentSize;

  const opacity = useTransform(scrollYProgress, [start, peak - 0.02, peak, end - 0.02, end], [0, 1, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [start, peak, end], [40, 0, -30]);
  const scale = useTransform(scrollYProgress, [start, peak, end], [0.92, 1, 0.96]);

  return (
    <motion.h2
      className="absolute text-center text-background font-black text-3xl sm:text-5xl lg:text-7xl xl:text-8xl tracking-tighter leading-[0.95] px-6 max-w-5xl select-none"
      style={{ opacity, y, scale }}
    >
      {text}
    </motion.h2>
  );
};

export default ScrollVideoReveal;
