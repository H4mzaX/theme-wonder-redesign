import AnimateElement from "@/components/AnimateElement";

interface ImageTextBlockProps {
  image: string;
  headline: string;
  body: string;
  highlights?: string[];
  reverse?: boolean;
}

/**
 * Concept-theme style: Full-width split section with large lifestyle image
 * and editorial text content. Like the "Compact Power Unleashed" section.
 */
const ImageTextBlock = ({ image, headline, body, highlights, reverse }: ImageTextBlockProps) => {
  return (
    <section className="w-full">
      <div className={`grid grid-cols-1 lg:grid-cols-2 ${reverse ? "lg:[direction:rtl]" : ""}`}>
        {/* Image */}
        <div className={reverse ? "lg:[direction:ltr]" : ""}>
          <div className="aspect-square sm:aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={headline}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Text */}
        <div className={`flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-20 bg-secondary/20 ${reverse ? "lg:[direction:ltr]" : ""}`}>
          <AnimateElement type="fade-up">
            <h3 className="text-2xl sm:text-3xl lg:text-[2.8rem] font-black text-foreground tracking-tighter leading-[1.05]">
              {headline}
            </h3>
          </AnimateElement>
          <AnimateElement type="fade-up" delay={0.1}>
            <p className="text-sm sm:text-base text-muted-foreground mt-4 sm:mt-6 leading-relaxed max-w-xl">
              {body}
            </p>
          </AnimateElement>
          {highlights && highlights.length > 0 && (
            <AnimateElement type="fade-up" delay={0.2}>
              <div className="flex flex-wrap gap-3 mt-5 sm:mt-7">
                {highlights.map((h) => (
                  <span
                    key={h}
                    className="text-[11px] sm:text-xs font-semibold text-foreground/80 italic border-b border-foreground/20 pb-0.5"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </AnimateElement>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageTextBlock;
