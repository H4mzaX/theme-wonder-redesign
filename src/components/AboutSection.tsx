const AboutSection = () => {
  return (
    <section className="section-padding py-20 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display leading-tight">
          We believe in the{" "}
          <em className="italic">power of sound</em>
        </h2>
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground font-semibold">Harmony Sound</strong> is more than just an audio equipment retailer. We represent the grandeur of sound in its finest manifestations. Our mission is to cater to audiophiles and those who simply appreciate quality sound. We offer audio devices that combine unparalleled sound with elegant design.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We offer everything from the warm sound of vinyl records to the clarity and crispness of modern wireless headphones, ensuring every note sounds impeccable.
          </p>
          <a
            href="#"
            className="inline-block text-sm font-medium text-foreground border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors"
          >
            Our Story
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
