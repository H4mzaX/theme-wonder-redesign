import { motion } from "framer-motion";
import { ScaleOnScroll, ParallaxImage } from "@/hooks/useScrollAnimations";
import lookbookImg from "@/assets/lookbook.jpg";

const PromoBanner = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 lg:py-6">
      <ScaleOnScroll>
        <a href="#" className="block relative rounded-2xl overflow-hidden group">
          <ParallaxImage
            src={lookbookImg}
            alt="Premium collection showcase"
            className="h-[280px] sm:h-[380px] lg:h-[460px] rounded-2xl"
            speed={0.1}
          />
          <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors duration-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-white/80 text-sm tracking-widest uppercase mb-3">Premium Collection</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                Designed to Protect
              </h2>
              <motion.span
                className="inline-block bg-white text-foreground px-8 py-3 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Shop Now
              </motion.span>
            </motion.div>
          </div>
        </a>
      </ScaleOnScroll>
    </section>
  );
};

export default PromoBanner;
