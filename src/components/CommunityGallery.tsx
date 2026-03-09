import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

// Import lifestyle images
import lifestyleClear from "@/assets/silicone-lifestyle-clear.jpg";
import lifestyleGreen from "@/assets/silicone-lifestyle-green.jpg";
import lifestyleNavy from "@/assets/silicone-lifestyle-navy.jpg";
import armoredgeLife from "@/assets/armoredge-lifestyle.webp";
import softmagLife from "@/assets/softmag-lifestyle.webp";
import lookbook from "@/assets/lookbook.jpg";

const galleryImages = [
  { src: lifestyleClear, alt: "VCASE Clear Case in lifestyle" },
  { src: armoredgeLife, alt: "ArmorEdge protection lifestyle" },
  { src: lifestyleGreen, alt: "Green silicone case" },
  { src: softmagLife, alt: "SoftMag lifestyle shot" },
  { src: lifestyleNavy, alt: "Navy case lifestyle" },
  { src: lookbook, alt: "VCASE lookbook" },
];

/**
 * Instagram UGC-style community gallery - Gymshark/Allbirds style
 * Grid of lifestyle shots with social CTA
 */
const CommunityGallery = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12">
      <ScrollReveal className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Instagram className="w-5 h-5 text-muted-foreground" />
          <p className="text-xs sm:text-sm tracking-widest uppercase text-muted-foreground">
            Join the Community
          </p>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          Share Your Style
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Tag <span className="font-semibold text-foreground">@vcase.in</span> to be featured
        </p>
      </ScrollReveal>

      {/* Grid gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {galleryImages.map((img, idx) => (
          <motion.a
            key={idx}
            href="https://instagram.com/vcase.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg sm:rounded-xl bg-secondary/20"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
            
            {/* Instagram icon overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 flex items-center justify-center">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* CTA Button */}
      <ScrollReveal className="text-center mt-6 sm:mt-8">
        <motion.a
          href="https://instagram.com/vcase.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Instagram className="w-4 h-4" />
          Follow @vcase.in
        </motion.a>
      </ScrollReveal>
    </section>
  );
};

export default CommunityGallery;
