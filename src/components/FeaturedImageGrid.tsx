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
 * Concept-theme style asymmetric grid:
 * Desktop: 2 stacked landscape cards on left + 1 tall portrait card on right
 * Mobile: stacked vertically
 */
const FeaturedImageGrid = ({ cards }: FeaturedImageGridProps) => {
  if (!cards || cards.length === 0) return null;

  // Take first 2 for left column, 3rd for tall right, 4th as bottom wide
  const leftCards = cards.slice(0, 2);
  const tallCard = cards[2];
  const bottomCard = cards[3];

  return (
    <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
      {/* Main asymmetric grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-3 sm:gap-4">
        {/* Left column: 2 stacked cards */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {leftCards.map((card, i) => (
            <AnimateElement key={i} type="fade-up" delay={i * 0.1}>
              <div className="relative rounded-2xl overflow-hidden bg-secondary/10 aspect-[16/10] group">
                <img
                  src={card.image}
                  alt={card.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <p className="text-[11px] sm:text-xs text-background/60 font-medium">{card.label}</p>
                  <p className="text-base sm:text-lg lg:text-xl font-bold text-background tracking-tight leading-tight mt-0.5">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </AnimateElement>
          ))}
        </div>

        {/* Right column: 1 tall card */}
        {tallCard && (
          <AnimateElement type="fade-up" delay={0.15}>
            <div className="relative rounded-2xl overflow-hidden bg-foreground aspect-[16/10] lg:aspect-auto lg:h-full group">
              <img
                src={tallCard.image}
                alt={tallCard.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/70" />
              <div className="absolute top-0 right-0 p-4 sm:p-6 text-right">
                <p className="text-[11px] sm:text-xs text-background/60 font-medium">{tallCard.label}</p>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-background tracking-tight leading-tight mt-0.5">
                  {tallCard.subtitle}
                </p>
              </div>
            </div>
          </AnimateElement>
        )}
      </div>

      {/* Bottom wide card (optional 4th card) */}
      {bottomCard && (
        <AnimateElement type="fade-up" delay={0.2}>
          <div className="relative rounded-2xl overflow-hidden bg-secondary/10 aspect-[21/9] mt-3 sm:mt-4 group">
            <img
              src={bottomCard.image}
              alt={bottomCard.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 sm:p-6 lg:p-8">
              <p className="text-[11px] sm:text-xs text-background/60 font-medium">{bottomCard.label}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-background tracking-tight leading-tight mt-0.5">
                {bottomCard.subtitle}
              </p>
            </div>
          </div>
        </AnimateElement>
      )}
    </section>
  );
};

export default FeaturedImageGrid;
