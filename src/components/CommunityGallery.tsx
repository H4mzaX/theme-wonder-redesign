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
    <section className="py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <ScrollReveal className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram className="w-5 h-5 text-muted-foreground" />
            <p className="text-xs sm:text-sm tracking-widest uppercase text-muted-foreground">
              Join the Community
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            Share Your Style
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Tag <span className="font-semibold text-foreground">@vcase.in</span> to be featured
          </p>
        </ScrollReveal>
      </div>

      {/* Horizontal scrolling gallery */}
      <div className="relative w-full overflow-hidden">
        <style>{`
          @keyframes scroll-gallery {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-gallery {
            animation: scroll-gallery 40s linear infinite;
            display: flex;
            width: max-content;
          }
          .animate-gallery:hover {
            animation-play-state: paused;
          }
        `}</style>
        
        {/* Shadow overlays for smooth edges */}
        <div className="absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="animate-gallery gap-3 sm:gap-4 px-3 sm:px-4">
          {[...galleryImages, ...galleryImages, ...galleryImages].map((img, idx) => (
            <a
              key={idx}
              href="https://instagram.com/vcase.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex-none w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px] overflow-hidden rounded-2xl bg-secondary/20"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
              
              {/* Instagram icon overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-background/90 flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <Instagram className="w-6 h-6 sm:w-8 sm:h-8 text-foreground" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mt-8 sm:mt-12 text-center">
        <ScrollReveal>
          <motion.a
            href="https://instagram.com/vcase.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Instagram className="w-5 h-5" />
            Follow @vcase.in
          </motion.a>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CommunityGallery;
