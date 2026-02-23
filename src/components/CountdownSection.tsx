import { useState, useEffect } from "react";
import countdownBg from "@/assets/countdown-bg.jpg";

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
      <img src={countdownBg} alt="Sale" className="w-full h-[400px] sm:h-[500px] object-cover" />
      <div className="absolute inset-0 bg-foreground/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-background/80 text-sm tracking-widest uppercase mb-2">Get up to 50% off</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-background mb-8">
          on waterproof speakers
        </h2>
        <div className="flex gap-6 sm:gap-10 mb-8">
          {[
            { val: timeLeft.days, label: "Days" },
            { val: timeLeft.hours, label: "Hours" },
            { val: timeLeft.mins, label: "Mins" },
            { val: timeLeft.secs, label: "Sec" },
          ].map((t) => (
            <div key={t.label} className="text-center">
              <span className="text-4xl sm:text-5xl font-display font-bold text-background">{t.val}</span>
              <p className="text-background/70 text-xs mt-1">{t.label}</p>
            </div>
          ))}
        </div>
        <a
          href="#"
          className="bg-background text-foreground px-8 py-3 rounded-full text-sm font-medium hover:bg-background/90 transition-colors"
        >
          Discover sales
        </a>
      </div>
    </section>
  );
};

export default CountdownSection;
