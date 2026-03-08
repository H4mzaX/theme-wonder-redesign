import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield, Magnet, Droplets, Zap, Layers, Ruler, Eye, ScanLine,
  CircleDot, ShieldCheck, Waves, BadgeCheck, ChevronRight
} from "lucide-react";
import type { Product } from "@/data/products";
import { seriesData, type SeriesSlug } from "@/data/products";
import AnimateElement from "@/components/AnimateElement";

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ══════════════════════════════════════════
   Series content definitions
   ══════════════════════════════════════════ */
interface FeatureCard {
  title: string;
  description: string;
  icon: typeof Shield;
}

interface EditorialBlock {
  headline: string;
  body: string;
  bullets?: string[];
  imagePosition: "left" | "right";
  imageSrc: string;
  imageAlt: string;
}

interface SeriesContent {
  heroOverlayLine1: string;
  heroOverlayLine2: string;
  heroImage: string;
  marqueeItems: string[];
  editorialHeadline: string;
  editorialBody: string;
  featureCards: { title: string; subtitle: string; icon: typeof Shield }[];
  stats: { value: string; label: string }[];
  editorialBlocks: EditorialBlock[];
  closureImages: { src: string; alt: string; caption: string }[];
}

const seriesContentMap: Record<string, SeriesContent> = {
  clearmag: {
    heroOverlayLine1: "Crystal clear.",
    heroOverlayLine2: "Magnetically perfect.",
    heroImage: "/icons/clearmag.webp",
    marqueeItems: ["Anti-Yellow Technology", "38 MagSafe Magnets", "14.8ft Drop Tested", "1.2mm Ultra Thin", "32g Featherlight"],
    editorialHeadline: "Engineered for Every _Detail_.",
    editorialBody: "Precision-aligned N52 magnets deliver 38T of magnetic force for instant snap-on MagSafe charging. The nano oleophobic coating resists UV-induced yellowing, keeping your case crystal clear for months.",
    featureCards: [
      { title: "Anti-Yellow", subtitle: "Nano oleophobic coating", icon: Eye },
      { title: "38 Magnets", subtitle: "N52 MagSafe alignment", icon: Magnet },
      { title: "14.8ft Drop", subtitle: "Military-grade corners", icon: ShieldCheck },
      { title: "1.2mm Slim", subtitle: "Ultra-thin polycarbonate", icon: Ruler },
    ],
    stats: [
      { value: "14.8ft", label: "Drop Protection" },
      { value: "38T", label: "Magnetic Force" },
      { value: "1.2mm", label: "Ultra Thin" },
      { value: "32g", label: "Featherlight" },
    ],
    editorialBlocks: [
      {
        headline: "Transparent Protection",
        body: "Our anti-yellow nano coating technology ensures your case stays crystal clear, resisting UV-induced yellowing for months of pristine clarity. Show off your device's original design without compromise.",
        bullets: ["Anti-yellow nano coating", "UV-resistant polycarbonate", "Oleophobic surface treatment"],
        imagePosition: "right",
        imageSrc: "/icons/clearmag.webp",
        imageAlt: "ClearMag transparent detail",
      },
      {
        headline: "Magnetic Precision",
        body: "38 precision-aligned N52 magnets deliver powerful magnetic force for instant snap-on MagSafe charging and accessory attachment. Perfect alignment, every time.",
        imagePosition: "left",
        imageSrc: "/icons/clearmag-edge.webp",
        imageAlt: "ClearMag magnet alignment",
      },
    ],
    closureImages: [
      { src: "/icons/clearmag.webp", alt: "ClearMag close-up", caption: "Crystal-clear polycarbonate with nano coating" },
      { src: "/icons/clearmag-edge.webp", alt: "ClearMag magnets", caption: "38 precision-aligned N52 magnets" },
    ],
  },
  "clearmag-edge": {
    heroOverlayLine1: "Frosted edges.",
    heroOverlayLine2: "Crystal core.",
    heroImage: "/icons/clearmag-edge.webp",
    marqueeItems: ["Frosted Side Rails", "Crystal-Clear Back", "14.8ft Drop Tested", "38T MagSafe", "Dual-Layer Build"],
    editorialHeadline: "Where Grip Meets _Clarity_.",
    editorialBody: "Matte-frosted side rails provide enhanced grip with sophisticated aesthetics, while the anti-yellow nano-coated back panel showcases your device's original design.",
    featureCards: [
      { title: "Frosted Rails", subtitle: "Enhanced matte grip", icon: Layers },
      { title: "Clear Back", subtitle: "Anti-yellow coating", icon: Eye },
      { title: "Dual-Layer", subtitle: "TPU + PC construction", icon: ShieldCheck },
      { title: "38 Magnets", subtitle: "MagSafe precision", icon: Magnet },
    ],
    stats: [
      { value: "14.8ft", label: "Drop Protection" },
      { value: "38T", label: "MagSafe Force" },
      { value: "1.3mm", label: "Slim Profile" },
      { value: "34g", label: "Lightweight" },
    ],
    editorialBlocks: [
      {
        headline: "Frosted Sophistication",
        body: "The matte-textured edges provide a premium feel and enhanced grip while the crystal-clear back panel lets your device's design shine through.",
        bullets: ["Frosted polycarbonate edges", "Anti-yellow clear back", "Enhanced grip texture"],
        imagePosition: "right",
        imageSrc: "/icons/clearmag-edge.webp",
        imageAlt: "ClearMag Edge frosted detail",
      },
    ],
    closureImages: [
      { src: "/icons/clearmag-edge.webp", alt: "ClearMag Edge rails", caption: "Frosted matte rails with crystal-clear back" },
    ],
  },
  softmag: {
    heroOverlayLine1: "Soft touch.",
    heroOverlayLine2: "Bold statement.",
    heroImage: "/icons/softmag.webp",
    marqueeItems: ["Liquid Silicone", "Microfiber Interior", "4 Bold Colors", "MagSafe Compatible", "Stain Resistant"],
    editorialHeadline: "Designed for _Comfort_.",
    editorialBody: "Buttery-soft liquid silicone exterior meets a cushioning microfiber interior. Four bold colorways crafted with fade-resistant pigments ensure your case looks as good months from now as it does today.",
    featureCards: [
      { title: "Liquid Silicone", subtitle: "Soft-touch exterior", icon: Droplets },
      { title: "Microfiber", subtitle: "Scratch-free interior", icon: Layers },
      { title: "4 Colors", subtitle: "Fade-resistant pigments", icon: CircleDot },
      { title: "MagSafe", subtitle: "Integrated magnets", icon: Magnet },
    ],
    stats: [
      { value: "4", label: "Bold Colors" },
      { value: "38T", label: "MagSafe Force" },
      { value: "10ft", label: "Drop Tested" },
      { value: "36g", label: "Comfortable" },
    ],
    editorialBlocks: [
      {
        headline: "Silicone Craftsmanship",
        body: "Each SoftMag case is precision-molded from medical-grade liquid silicone rubber, delivering a buttery-soft feel that resists stains, oils, and everyday wear.",
        bullets: ["Stain-resistant surface", "Washable material", "Fade-resistant color"],
        imagePosition: "right",
        imageSrc: "/icons/softmag.webp",
        imageAlt: "SoftMag texture detail",
      },
    ],
    closureImages: [
      { src: "/icons/softmag.webp", alt: "SoftMag texture", caption: "Liquid silicone with microfiber lining" },
    ],
  },
  "armor-edge": {
    heroOverlayLine1: "Stand bold.",
    heroOverlayLine2: "Stay protected.",
    heroImage: "/icons/armoredge.png",
    marqueeItems: ["Camera Slider", "Metal Ring Stand", "16ft Drop Tested", "360° Bezels", "Dual-Layer Armor"],
    editorialHeadline: "Built for the _Fearless_.",
    editorialBody: "Precision-engineered sliding camera cover protects from scratches and dust. The 360° rotatable metal ring doubles as a kickstand for hands-free viewing in any orientation.",
    featureCards: [
      { title: "Camera Slider", subtitle: "Lens scratch protection", icon: ScanLine },
      { title: "Ring Stand", subtitle: "360° rotatable metal", icon: CircleDot },
      { title: "16ft Drop", subtitle: "Military-grade armor", icon: ShieldCheck },
      { title: "360° Bezels", subtitle: "Full edge protection", icon: Shield },
    ],
    stats: [
      { value: "16ft", label: "Drop Protection" },
      { value: "360°", label: "Ring Stand" },
      { value: "Slider", label: "Camera Cover" },
      { value: "42g", label: "Solid Build" },
    ],
    editorialBlocks: [
      {
        headline: "Tactical Engineering",
        body: "Reinforced corners with dual-layer construction absorb and distribute impact forces. The integrated metal ring stand rotates 360° for landscape or portrait hands-free viewing.",
        bullets: ["Sliding camera cover", "360° metal kickstand", "Reinforced impact corners"],
        imagePosition: "right",
        imageSrc: "/icons/armoredge.png",
        imageAlt: "Armor Edge detail",
      },
    ],
    closureImages: [
      { src: "/icons/armoredge.png", alt: "Armor Edge detail", caption: "Sliding camera cover with metal ring stand" },
    ],
  },
  edgeguard: {
    heroOverlayLine1: "Full coverage.",
    heroOverlayLine2: "Zero compromise.",
    heroImage: "/icons/edgeguard.webp",
    marqueeItems: ["9H Tempered Glass", "Edge-to-Edge", "Anti-Fingerprint", "Easy-Align Frame", "0.33mm Thin"],
    editorialHeadline: "Screen Protection _Perfected_.",
    editorialBody: "Edge-to-edge 9H tempered glass with oleophobic coating covers every millimeter of your screen with seamless adhesion. The included easy-align frame ensures bubble-free application in under 60 seconds.",
    featureCards: [
      { title: "9H Glass", subtitle: "Maximum hardness", icon: ShieldCheck },
      { title: "Edge-to-Edge", subtitle: "100% screen coverage", icon: Ruler },
      { title: "Anti-Fingerprint", subtitle: "Oleophobic coating", icon: Waves },
      { title: "Easy-Align", subtitle: "60-second application", icon: Eye },
    ],
    stats: [
      { value: "9H", label: "Hardness" },
      { value: "0.33mm", label: "Ultra Thin" },
      { value: "100%", label: "Coverage" },
      { value: "99.9%", label: "Transparency" },
    ],
    editorialBlocks: [
      {
        headline: "Invisible Shield",
        body: "At just 0.33mm, our tempered glass is virtually invisible while delivering maximum 9H hardness protection. The oleophobic coating repels fingerprints and oils for a consistently clean screen.",
        bullets: ["Bubble-free installation", "Case-friendly design", "Touch sensitivity preserved"],
        imagePosition: "right",
        imageSrc: "/icons/edgeguard.webp",
        imageAlt: "EdgeGuard glass detail",
      },
    ],
    closureImages: [
      { src: "/icons/edgeguard.webp", alt: "EdgeGuard glass", caption: "Edge-to-edge tempered glass protection" },
    ],
  },
  lensguard: {
    heroOverlayLine1: "Crystal lens.",
    heroOverlayLine2: "Perfect shots.",
    heroImage: "/icons/lensguard.webp",
    marqueeItems: ["Sapphire-Grade", "Anti-Reflective", "Precision Cut", "0.3mm Ultra Thin", "HD Clarity"],
    editorialHeadline: "Lens Protection _Reimagined_.",
    editorialBody: "Sapphire-grade 9H hardness protects each lens module while the anti-reflective coating eliminates lens flare for crisp, professional-quality photos every time.",
    featureCards: [
      { title: "Sapphire-Grade", subtitle: "9H lens hardness", icon: ShieldCheck },
      { title: "Anti-Reflective", subtitle: "No lens flare", icon: Eye },
      { title: "Precision Fit", subtitle: "Laser-cut modules", icon: ScanLine },
      { title: "0.3mm Thin", subtitle: "Nearly invisible", icon: Ruler },
    ],
    stats: [
      { value: "9H", label: "Hardness" },
      { value: "0.3mm", label: "Ultra Thin" },
      { value: "AR", label: "Anti-Reflective" },
      { value: "HD", label: "Clarity" },
    ],
    editorialBlocks: [
      {
        headline: "Optical Excellence",
        body: "Each protector is laser-cut for precise camera module fit with zero interference to photo quality. The anti-reflective coating eliminates lens flare for consistently crisp images.",
        bullets: ["Zero camera interference", "Precision module fit", "Professional photo quality"],
        imagePosition: "right",
        imageSrc: "/icons/lensguard.webp",
        imageAlt: "LensGuard detail",
      },
    ],
    closureImages: [
      { src: "/icons/lensguard.webp", alt: "LensGuard detail", caption: "Sapphire-grade camera lens protection" },
    ],
  },
};

/* ══════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════ */

/* ── Horizontal Scroll Marquee ── */
const HorizontalMarquee = ({ items }: { items: string[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const speed = 0.4;
    const step = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const repeated = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden border-y border-border/40 py-4 sm:py-5 my-6 sm:my-10">
      <div ref={scrollRef} className="flex whitespace-nowrap will-change-transform" style={{ display: "inline-flex" }}>
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-semibold">{item}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Stat Block ── */
const StatBlock = ({ value, label, delay }: { value: string; label: string; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: expoOut }}
    >
      <span className="block text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tighter">{value}</span>
      <span className="block text-[9px] sm:text-[11px] text-muted-foreground uppercase tracking-[0.2em] mt-1 font-medium">{label}</span>
    </motion.div>
  );
};

/* ── Hero Overlay Section ── */
const HeroOverlay = ({ line1, line2, image }: { line1: string; line2: string; image: string }) => (
  <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-foreground overflow-hidden">
    <img
      src={image}
      alt=""
      className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
      <AnimateElement type="fade-up">
        <h2 className="text-background text-[2rem] sm:text-[3rem] lg:text-[4.5rem] font-black leading-[1] tracking-tighter">
          {line1}
        </h2>
      </AnimateElement>
      <AnimateElement type="fade-up" delay={0.1}>
        <p className="text-background/60 text-sm sm:text-xl lg:text-2xl font-medium tracking-tight mt-1 sm:mt-2">
          {line2}
        </p>
      </AnimateElement>
    </div>
  </section>
);

/* ── Feature Card Grid (2x2) ── */
const FeatureGrid = ({ cards }: { cards: SeriesContent["featureCards"] }) => (
  <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, i) => (
        <AnimateElement key={card.title} type="fade-up" delay={i * 0.06}>
          <div className="bg-secondary/30 rounded-xl p-4 sm:p-6 h-full flex flex-col">
            <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground mb-3 sm:mb-4" strokeWidth={1.5} />
            <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">{card.title}</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed">{card.subtitle}</p>
          </div>
        </AnimateElement>
      ))}
    </div>
  </section>
);

/* ── Editorial Headline ── */
const renderEditorialHeadline = (text: string) => {
  // Convert _text_ to italic spans
  const parts = text.split(/(_[^_]+_)/);
  return parts.map((part, i) => {
    if (part.startsWith("_") && part.endsWith("_")) {
      return <em key={i} className="not-italic text-muted-foreground">{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
};

/* ── Editorial Split Section ── */
const EditorialSplit = ({ block, index }: { block: EditorialBlock; index: number }) => {
  const isRight = block.imagePosition === "right";

  return (
    <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-14">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center ${isRight ? "" : "lg:[direction:rtl]"}`}>
        {/* Text */}
        <div className={isRight ? "" : "lg:[direction:ltr]"}>
          <AnimateElement type="fade-up">
            <h3 className="text-xl sm:text-2xl lg:text-[2.5rem] font-black text-foreground tracking-tighter leading-[1.1]">
              {renderEditorialHeadline(block.headline)}
            </h3>
          </AnimateElement>
          <AnimateElement type="fade-up" delay={0.1}>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 sm:mt-5 leading-relaxed max-w-lg">
              {block.body}
            </p>
          </AnimateElement>
          {block.bullets && (
            <AnimateElement type="fade-up" delay={0.2}>
              <ul className="mt-4 sm:mt-6 space-y-2">
                {block.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2.5 text-[12px] sm:text-sm text-foreground font-medium">
                    <BadgeCheck className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                    {bullet}
                  </li>
                ))}
              </ul>
            </AnimateElement>
          )}
        </div>

        {/* Image */}
        <div className={isRight ? "" : "lg:[direction:ltr]"}>
          <AnimateElement type="fade-up" delay={0.15}>
            <div className="relative rounded-2xl overflow-hidden bg-secondary/20 aspect-[4/3]">
              <img
                src={block.imageSrc}
                alt={block.imageAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </AnimateElement>
        </div>
      </div>
    </section>
  );
};

/* ── Close-up Gallery ── */
const CloseUpGallery = ({ images }: { images: SeriesContent["closureImages"] }) => {
  if (images.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-8">
      <div className={`grid grid-cols-1 ${images.length > 1 ? "sm:grid-cols-2" : ""} gap-3 sm:gap-4`}>
        {images.map((img, i) => (
          <AnimateElement key={i} type="fade-up" delay={i * 0.1}>
            <div className="relative rounded-2xl overflow-hidden bg-secondary/20 aspect-[16/10]">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-4 sm:p-6">
                <p className="text-[11px] sm:text-sm text-background font-medium">{img.caption}</p>
              </div>
            </div>
          </AnimateElement>
        ))}
      </div>
    </section>
  );
};

/* ── Material Card ── */
const MaterialCard = ({ series }: { series: { material: string; features: string[] } }) => (
  <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-8">
    <div className="bg-foreground text-background rounded-2xl p-5 sm:p-8 lg:p-10">
      <AnimateElement type="fade-up">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-background/40 font-semibold">
          Material & Construction
        </span>
        <h3 className="text-lg sm:text-2xl font-black tracking-tight mt-1.5 mb-4">
          {series.material}
        </h3>
      </AnimateElement>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {series.features.map((feature, i) => (
          <AnimateElement key={i} type="fade-up" delay={i * 0.06}>
            <div className="flex items-start gap-2.5 bg-background/5 rounded-lg p-3 sm:p-4">
              <BadgeCheck className="w-4 h-4 text-background/50 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-[11px] sm:text-sm text-background/70 leading-relaxed">{feature}</span>
            </div>
          </AnimateElement>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════ */
const ProductContentSections = ({ product }: { product: Product }) => {
  const seriesSlug = product.seriesSlug as string;
  const content = seriesContentMap[seriesSlug];

  if (!content) return null;

  const series = seriesData[seriesSlug as SeriesSlug];

  return (
    <div className="w-full">
      {/* 1. Full-width hero with text overlay */}
      <HeroOverlay
        line1={content.heroOverlayLine1}
        line2={content.heroOverlayLine2}
        image={content.heroImage}
      />

      {/* 2. Horizontal feature marquee */}
      <HorizontalMarquee items={content.marqueeItems} />

      {/* 3. Editorial headline + description */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <AnimateElement type="fade-up">
          <h2 className="text-[1.75rem] sm:text-[2.5rem] lg:text-[3.5rem] font-black text-foreground leading-[1.05] tracking-tighter">
            {renderEditorialHeadline(content.editorialHeadline)}
          </h2>
        </AnimateElement>
        <AnimateElement type="fade-up" delay={0.1}>
          <p className="text-sm sm:text-lg text-muted-foreground mt-3 sm:mt-4 max-w-2xl leading-relaxed">
            {content.editorialBody}
          </p>
        </AnimateElement>
      </section>

      {/* 4. Stats bar */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-6 sm:pb-10">
        <div className="grid grid-cols-4 gap-4 sm:gap-6 bg-secondary/30 rounded-2xl p-5 sm:p-8">
          {content.stats.map((stat, i) => (
            <StatBlock key={stat.label} value={stat.value} label={stat.label} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* 5. Feature card grid */}
      <FeatureGrid cards={content.featureCards} />

      {/* 6. Editorial split sections (image + text) */}
      {content.editorialBlocks.map((block, i) => (
        <EditorialSplit key={i} block={block} index={i} />
      ))}

      {/* 7. Close-up gallery */}
      <CloseUpGallery images={content.closureImages} />

      {/* 8. Material card */}
      {series && <MaterialCard series={series} />}
    </div>
  );
};

export default ProductContentSections;
