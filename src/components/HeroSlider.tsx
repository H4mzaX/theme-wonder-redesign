import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const slides = [
  {
    image: hero1,
    title: "EXPERIENCE\nUNPARALLELED\nAUDIO ELEGANCE",
    cta: "Shop Headphones",
  },
  {
    image: hero2,
    title: "DISCOVER\nTHE SOUND\nOF TOMORROW",
    cta: "Shop Speakers",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative mx-4 sm:mx-8 lg:mx-12 xl:mx-16 rounded-lg overflow-hidden">
      <div className="relative h-[500px] sm:h-[600px] lg:h-[700px]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/20" />
            <div className="absolute inset-0 flex items-end justify-between p-8 sm:p-12 lg:p-16 pb-16">
              <h1
                className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-background leading-tight whitespace-pre-line tracking-tight"
                style={{ animationDelay: "0.2s" }}
              >
                {slide.title}
              </h1>
              <a
                href="#"
                className="hidden sm:inline-flex self-end bg-background text-foreground px-8 py-3.5 rounded-full font-medium text-sm hover:bg-background/90 transition-colors tracking-wide"
              >
                {slide.cta}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-background hover:opacity-70 transition-opacity"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-background hover:opacity-70 transition-opacity"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-background w-6" : "bg-background/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
