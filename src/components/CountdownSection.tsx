import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import countdownBg from "@/assets/countdown-bg.jpg";
import { ScrollReveal, ParallaxImage } from "@/hooks/useScrollAnimations";

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 13, hours: 12, mins: 7, secs: 1 });

  useEffect(() => {
    const target = Date.now() + (13 * 86400 + 12 * 3600 + 7 * 60 + 1) * 1000;
    const timer = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative mx-4 sm:mx-8 lg:mx-12 xl:mx-16 rounded-lg overflow-hidden my-20">
      <ParallaxImage
        src={countdownBg}
        alt="Sale"
        className="h-[400px] sm:h-[500px] rounded-lg"
        speed={0.15}
      />
      <div className="absolute inset-0 bg-foreground/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <ScrollReveal>
          <p className="text-background/80 text-sm tracking-widest uppercase mb-2">Get up to 50% off</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-background mb-8">
            on waterproof speakers
          </h2>
        </ScrollReveal>
        <div className="flex gap-6 sm:gap-10 mb-8">
          {[
            { val: timeLeft.days, label: "Days" },
            { val: timeLeft.hours, label: "Hours" },
            { val: timeLeft.mins, label: "Mins" },
            { val: timeLeft.secs, label: "Sec" },
          ].map((t, i) => (
            <motion.div
              key={t.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <motion.span
                key={t.val}
                className="text-4xl sm:text-5xl font-display font-bold text-background block"
                initial={{ opacity: 0.7, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {t.val}
              </motion.span>
              <p className="text-background/70 text-xs mt-1">{t.label}</p>
            </motion.div>
          ))}
        </div>
        <motion.a
          href="#"
          className="bg-background text-foreground px-8 py-3 rounded-full text-sm font-medium"
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.9)" }}
          whileTap={{ scale: 0.97 }}
        >
          Discover sales
        </motion.a>
      </div>
    </section>
  );
};

export default CountdownSection;
