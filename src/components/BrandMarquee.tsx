const brands = ["SonicPulse", "Vibrance", "Resonance", "Aureal", "SoundSphere", "HarmonyTech", "AudioCore"];
const doubled = [...brands, ...brands, ...brands, ...brands];

const BrandMarquee = () => {
  return (
    <section className="py-12 overflow-hidden border-y border-border">
      <div className="marquee-track">
        {doubled.map((brand, i) => (
          <span
            key={i}
            className="text-xl sm:text-2xl font-display text-muted-foreground/40 whitespace-nowrap px-10 sm:px-14 font-semibold tracking-wide"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
};

export default BrandMarquee;
