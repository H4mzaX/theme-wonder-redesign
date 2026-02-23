import { ScrollReveal } from "@/hooks/useScrollAnimations";

const AboutSection = () => {
  return (
    <section className="section-padding py-20 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <ScrollReveal direction="left" duration={0.8}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display leading-tight">
            We believe in the{" "}
            <em className="italic">power of protection</em>
          </h2>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={0.2} duration={0.8}>
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">CaseVault</strong> is more than just a phone accessories retailer. We represent the perfect blend of style and protection for your most essential device. Our mission is to provide premium cases and screen protectors that don't compromise on aesthetics or durability.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From ultra-slim minimalist cases to military-grade rugged protection, we offer solutions for iPhone, Samsung, OnePlus, and Pixel — ensuring your device stays pristine no matter what life throws at it.
            </p>
            <a
              href="#"
              className="inline-block text-sm font-medium text-foreground relative group"
            >
              Our Story
              <span className="absolute bottom-0 left-0 w-full h-px bg-foreground group-hover:bg-accent transition-colors" />
              <span className="absolute bottom-0 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutSection;
