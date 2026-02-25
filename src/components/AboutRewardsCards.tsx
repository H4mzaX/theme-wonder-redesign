import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { motion } from "framer-motion";
import { ArrowRight, Gift } from "lucide-react";
import lookbookImg from "@/assets/lookbook.jpg";

const AboutRewardsCards = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScrollReveal direction="left" duration={0.6}>
          <a href="#" className="group block relative rounded-2xl overflow-hidden h-[260px] sm:h-[320px]">
            <img src={lookbookImg} alt="About VCASE" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/50 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col justify-end p-7">
              <p className="text-white/70 text-xs tracking-widest uppercase mb-2">About Us</p>
              <h3 className="text-2xl font-bold text-white mb-2">
                Where passion meets innovation.
              </h3>
              <span className="inline-flex items-center gap-2 text-white/80 text-sm font-medium">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </a>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.1} duration={0.6}>
          <a href="#" className="group block relative rounded-2xl overflow-hidden h-[260px] sm:h-[320px] bg-foreground">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <motion.div
                className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Gift className="w-7 h-7 text-white" />
              </motion.div>
              <p className="text-white/60 text-xs tracking-widest uppercase mb-2">Rewards</p>
              <h3 className="text-2xl font-bold text-white mb-2">
                Get exclusive perks.
              </h3>
              <span className="inline-flex items-center gap-2 text-white/70 text-sm font-medium">
                Join Now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutRewardsCards;
