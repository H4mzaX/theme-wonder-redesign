import { Quote } from "lucide-react";

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
    <section className="bg-section-alt">
      <div className="section-padding py-20 lg:py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((t, i) => (
            <div key={i} className="space-y-4">
              <Quote className="w-8 h-8 text-accent" />
              <blockquote className="text-foreground leading-relaxed font-display text-lg italic">
                "{t.quote}"
              </blockquote>
              <p className="text-sm text-muted-foreground">
                — {t.author}, <span className="font-medium">{t.source}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
