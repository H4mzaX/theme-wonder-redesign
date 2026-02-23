import { Quote } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
import lookbookImg from "@/assets/lookbook.jpg";

const testimonials = [
  {
    quote: "Their meticulous curation of premium audio tech truly stands out. Their offerings consistently raise the bar for what we expect from audio equipment.",
    author: "Nathan Wright",
    source: "Rolling Stone",
  },
  {
    quote: "If there's one name synonymous with unparalleled audio experiences, it's Harmony Sound. They've managed to bridge the gap between luxury and functionality effortlessly.",
    author: "Clara Jefferson",
    source: "Billboard",
  },
  {
    quote: "They're curating an experience, not just selling equipment. Their handpicked selections promise — and deliver — unparalleled sound quality.",
    author: "Rebecca Landon",
    source: "Pitchfork",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
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
