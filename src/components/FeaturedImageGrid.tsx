import AnimateElement from "@/components/AnimateElement";

interface FeaturedCard {
  image: string;
  label: string;
  subtitle: string;
}

interface FeaturedImageGridProps {
  cards: FeaturedCard[];
}

/**
 * Concept-theme style: 2x2 or responsive grid of lifestyle images
 * with small overlay labels (e.g. "Pure Silence", "Active Noise Cancellation").
 */
const FeaturedImageGrid = ({ cards }: FeaturedImageGridProps) => {
  if (!cards || cards.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {cards.map((card, i) => (
          <AnimateElement key={i} type="fade-up" delay={i * 0.08}>
            <div className="relative rounded-2xl overflow-hidden bg-secondary/20 aspect-[4/5] sm:aspect-[3/4] group">
              <img
                src={card.image}
                alt={card.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <p className="text-[11px] sm:text-xs text-background/60 italic font-medium">{card.label}</p>
                <p className="text-sm sm:text-base lg:text-lg font-bold text-background tracking-tight leading-tight mt-0.5">
                  {card.subtitle}
                </p>
              </div>
            </div>
          </AnimateElement>
        ))}
      </div>
    </section>
  );
};

export default FeaturedImageGrid;
