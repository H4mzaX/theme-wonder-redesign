import AnimateElement from "@/components/AnimateElement";
import { Shield } from "lucide-react";

interface ImageTextBlockProps {
  image: string;
  headline: string;
  body: string;
  highlights?: string[];
  reverse?: boolean;
  icon?: typeof Shield;
}

/**
 * Concept-theme style "Compact Power Unleashed" section:
 * Full-width split with lifestyle image on one side,
 * card-style editorial content with icon on the other.
 */
const ImageTextBlock = ({ image, headline, body, highlights, reverse, icon: Icon }: ImageTextBlockProps) => {
  return (
    <section className="w-full bg-secondary/10">
      <div className={`grid grid-cols-1 lg:grid-cols-2 min-h-[400px] lg:min-h-[500px] ${reverse ? "lg:[direction:rtl]" : ""}`}>
        {/* Image */}
        <div className={reverse ? "lg:[direction:ltr]" : ""}>
          <div className="h-full min-h-[300px] lg:min-h-0 overflow-hidden">
            <img
              src={image}
              alt={headline}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Text content */}
        <div className={`flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-10 sm:py-14 lg:py-20 ${reverse ? "lg:[direction:ltr]" : ""}`}>
          {Icon && (
            <AnimateElement type="fade-up">
              <div className="w-12 h-12 rounded-2xl bg-secondary/40 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
            </AnimateElement>
          )}
          <AnimateElement type="fade-up">
            <h3 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-black text-foreground tracking-tighter leading-[1.05]">
              {headline}
            </h3>
          </AnimateElement>
          <AnimateElement type="fade-up" delay={0.1}>
            <p className="text-sm sm:text-[15px] text-muted-foreground mt-4 sm:mt-6 leading-[1.7] max-w-lg">
              {body}
            </p>
          </AnimateElement>
          {highlights && highlights.length > 0 && (
            <AnimateElement type="fade-up" delay={0.2}>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 sm:mt-8">
                {highlights.map((h) => (
                  <span
                    key={h}
                    className="text-[12px] sm:text-[13px] font-semibold text-foreground italic"
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
