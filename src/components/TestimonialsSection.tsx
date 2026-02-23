import { Quote } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
import lookbookImg from "@/assets/lookbook.jpg";

const testimonials = [
  {
    quote: "Best case I've ever owned. The leather develops a gorgeous patina and the MagSafe alignment is perfect. Worth every penny.",
    author: "Nathan Wright",
    source: "Verified Buyer",
  },
  {
    quote: "I've dropped my phone countless times and not a scratch. CaseVault's rugged case is the only one I trust for real protection.",
    author: "Clara Jefferson",
    source: "Tech Reviewer",
  },
  {
    quote: "The screen protector installation was flawless — zero bubbles, perfect clarity. It feels like the phone has no protector at all.",
    author: "Rebecca Landon",
    source: "Verified Buyer",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={lookbookImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/80" />
      </div>
      <div className="relative section-padding py-20 lg:py-28">
        <StaggerContainer className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12" staggerDelay={0.15}>
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-accent" />
                <blockquote className="text-background/90 leading-relaxed font-display text-lg italic">
                  "{t.quote}"
                </blockquote>
                <p className="text-sm text-background/60">
                  — {t.author}, <span className="font-medium text-background/80">{t.source}</span>
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default TestimonialsSection;
