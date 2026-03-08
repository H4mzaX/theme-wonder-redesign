import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "Arjun P.", text: "Best MagSafe case I've used. Crystal clear and zero yellowing after 6 months.", rating: 5, device: "iPhone 17 Pro" },
  { name: "Priya S.", text: "The Armor Edge is insane. Dropped my phone twice and not a scratch.", rating: 5, device: "iPhone 16 Pro Max" },
  { name: "Rahul M.", text: "SoftMag in Navy is gorgeous. Feels premium, great grip.", rating: 5, device: "iPhone 17" },
  { name: "Sneha K.", text: "EdgeGuard screen protector fits perfectly. Bubble-free install.", rating: 5, device: "iPhone 17 Pro" },
  { name: "Vikram D.", text: "Ordered ClearMag Edge — MagSafe snaps perfectly. Worth every rupee.", rating: 5, device: "iPhone 16" },
  { name: "Ananya R.", text: "LensGuard saved my camera from a nasty fall. Highly recommend.", rating: 5, device: "iPhone 17 Pro Max" },
];

const doubled = [...reviews, ...reviews];

const TestimonialStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <section ref={ref} className="py-6 sm:py-8 lg:py-10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-5 sm:mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">4.9 ★ Average Rating</p>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight text-foreground">
            Loved by Thousands
          </h2>
        </motion.div>
      </div>

      <motion.div className="flex gap-3 sm:gap-4 w-max pl-4 sm:pl-6 lg:pl-10" style={{ x }}>
        {doubled.map((review, i) => (
          <div
            key={i}
            className="flex-none w-[260px] sm:w-[300px] border border-border rounded-2xl p-5 sm:p-6 bg-background hover:bg-muted/30 transition-colors"
          >
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-4 line-clamp-3">"{review.text}"</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">{review.name}</span>
              <span className="text-[10px] text-muted-foreground">{review.device}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default TestimonialStrip;
