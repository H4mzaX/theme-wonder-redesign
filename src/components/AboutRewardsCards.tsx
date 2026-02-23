import { motion } from "framer-motion";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { ArrowRight, Gift } from "lucide-react";
import lookbookImg from "@/assets/lookbook.jpg";

const AboutRewardsCards = () => {
  return (
    <section className="section-padding py-12 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <ScrollReveal direction="left" duration={0.6}>
          <a href="#" className="group block relative rounded-2xl overflow-hidden h-[280px] sm:h-[340px]">
            <img src={lookbookImg} alt="About VCASE" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/50 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <p className="text-background/70 text-sm tracking-widest uppercase mb-2">About Us</p>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-background mb-2">
                Where passion meets innovation.
              </h3>
              <motion.span className="inline-flex items-center gap-2 text-background/80 text-sm font-medium" whileHover={{ x: 5 }}>
                Learn More <ArrowRight className="w-4 h-4" />
              </motion.span>
            </div>
          </a>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.1} duration={0.6}>
          <a href="#" className="group block relative rounded-2xl overflow-hidden h-[280px] sm:h-[340px] bg-accent">
            <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent to-gold opacity-90" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <motion.div
                className="w-16 h-16 rounded-full bg-background/20 flex items-center justify-center mb-5"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Gift className="w-8 h-8 text-background" />
              </motion.div>
              <p className="text-background/70 text-sm tracking-widest uppercase mb-2">Rewards</p>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-background mb-2">
                Get exclusive perks.
              </h3>
              <motion.span className="inline-flex items-center gap-2 text-background/80 text-sm font-medium" whileHover={{ x: 5 }}>
                Join Now <ArrowRight className="w-4 h-4" />
              </motion.span>
            </div>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutRewardsCards;
