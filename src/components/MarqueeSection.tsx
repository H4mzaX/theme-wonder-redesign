const MarqueeSection = () => {
  const items = ["Play anything", "Day-long comfort", "Play anything", "Day-long comfort"];
  const doubled = [...items, ...items, ...items, ...items];

  return (
    <section className="py-10 overflow-hidden border-y border-border">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-lg sm:text-xl font-display italic font-semibold whitespace-nowrap px-8 text-foreground/80"
          >
            {item} <span className="text-accent mx-4">•</span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeSection;
