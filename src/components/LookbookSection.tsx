import lookbookImg from "@/assets/lookbook.jpg";
import { ScrollReveal, ScaleOnScroll, ParallaxImage } from "@/hooks/useScrollAnimations";

const LookbookSection = () => {
  return (
    <section className="section-padding py-20">
      <ScrollReveal className="text-center mb-12">
        <p className="text-sm tracking-widest text-muted-foreground uppercase mb-3">Premium Protection</p>
        <h2 className="text-3xl sm:text-4xl font-display">
          Complete Protection for <em className="italic">Every Device</em>
        </h2>
      </ScrollReveal>
      <ScaleOnScroll>
        <div className="rounded-lg overflow-hidden">
          <ParallaxImage src={lookbookImg} alt="Phone cases and screen protectors collection" className="h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg" speed={0.12} />
        </div>
      </ScaleOnScroll>
    </section>
  );
};

export default LookbookSection;
