import { ScrollReveal } from "@/hooks/useScrollAnimations";

const AboutSection = () => {
  return (
    <section className="section-padding py-20 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <ScrollReveal direction="left" duration={0.8}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display leading-tight">
            We believe in the{" "}
            <em className="italic">power of sound</em>
          </h2>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={0.2} duration={0.8}>
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">Harmony Sound</strong> is more than just an audio equipment retailer. We represent the grandeur of sound in its finest manifestations. Our mission is to cater to audiophiles and those who simply appreciate quality sound. We offer audio devices that combine unparalleled sound with elegant design.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We offer everything from the warm sound of vinyl records to the clarity and crispness of modern wireless headphones, ensuring every note sounds impeccable.
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
