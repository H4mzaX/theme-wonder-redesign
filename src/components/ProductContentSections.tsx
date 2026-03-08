import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield, Magnet, Droplets, Zap, Layers, Ruler, Eye, ScanLine,
  CircleDot, ShieldCheck, Waves, BadgeCheck
} from "lucide-react";
import type { Product } from "@/data/products";
import { seriesData, type SeriesSlug } from "@/data/products";
import AnimateElement from "@/components/AnimateElement";
import ScrollVideoReveal from "@/components/ScrollVideoReveal";
import FeaturedImageGrid from "@/components/FeaturedImageGrid";
import ImageTextBlock from "@/components/ImageTextBlock";

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ══════════════════════════════════════════
   Series content definitions
   ══════════════════════════════════════════ */
interface SeriesContent {
  // Scroll-linked video section
  scrollVideoSrc: string;
  scrollVideoPoster?: string;
  scrollVideoTexts: string[];
  // Editorial headline below video
  editorialHeadline: string;
  editorialBody: string;
  // Featured image grid (2x2 lifestyle cards)
  featuredCards: { image: string; label: string; subtitle: string }[];
  // Image + text editorial blocks
  imageTextBlocks: {
    image: string;
    headline: string;
    body: string;
    highlights?: string[];
    reverse?: boolean;
  }[];
  // Marquee items
  marqueeItems: string[];
  // Stats
  stats: { value: string; label: string }[];
  // Feature cards (icon grid)
  featureCards: { title: string; subtitle: string; icon: typeof Shield }[];
}

const seriesContentMap: Record<string, SeriesContent> = {
  clearmag: {
    scrollVideoSrc: "/assets/hero-video.mp4",
    scrollVideoTexts: ["Crystal Clear.", "Anti-Yellow.", "MagSafe Ready.", "Drop Proof."],
    editorialHeadline: "Engineered for Every Detail.",
    editorialBody: "Precision-aligned N52 magnets deliver 38T of magnetic force for instant snap-on MagSafe charging. The nano oleophobic coating resists UV-induced yellowing, keeping your case crystal clear for months.",
    featuredCards: [
      { image: "/icons/clearmag.webp", label: "Transparent Protection", subtitle: "Anti-Yellow Nano Coating" },
      { image: "/icons/clearmag-edge.webp", label: "Magnetic Precision", subtitle: "38 N52 MagSafe Magnets" },
      { image: "/icons/clearmag.webp", label: "Ultra Slim", subtitle: "1.2mm Polycarbonate Shell" },
      { image: "/icons/clearmag-edge.webp", label: "Military Grade", subtitle: "14.8ft Drop Protection" },
    ],
    imageTextBlocks: [
      {
        image: "/icons/clearmag.webp",
        headline: "Transparent Protection Perfected.",
        body: "Our anti-yellow nano coating technology ensures your case stays crystal clear, resisting UV-induced yellowing for months of pristine clarity. Show off your device's original design without compromise.",
        highlights: ["Anti-yellow nano coating", "UV-resistant polycarbonate", "Oleophobic surface"],
      },
      {
        image: "/icons/clearmag-edge.webp",
        headline: "Magnetic Precision Alignment.",
        body: "38 precision-aligned N52 magnets deliver powerful magnetic force for instant snap-on MagSafe charging and accessory attachment. Perfect alignment, every single time.",
        highlights: ["38T magnetic force", "Instant snap-on", "Perfect alignment"],
        reverse: true,
      },
    ],
    marqueeItems: ["Anti-Yellow Technology", "38 MagSafe Magnets", "14.8ft Drop Tested", "1.2mm Ultra Thin", "32g Featherlight"],
    stats: [
      { value: "14.8ft", label: "Drop Protection" },
      { value: "38T", label: "Magnetic Force" },
      { value: "1.2mm", label: "Ultra Thin" },
      { value: "32g", label: "Featherlight" },
    ],
    featureCards: [
      { title: "Anti-Yellow", subtitle: "Nano oleophobic coating", icon: Eye },
      { title: "38 Magnets", subtitle: "N52 MagSafe alignment", icon: Magnet },
      { title: "14.8ft Drop", subtitle: "Military-grade corners", icon: ShieldCheck },
      { title: "1.2mm Slim", subtitle: "Ultra-thin polycarbonate", icon: Ruler },
    ],
  },
  "clearmag-edge": {
    scrollVideoSrc: "/assets/hero-video.mp4",
    scrollVideoTexts: ["Frosted Edges.", "Crystal Core.", "Grip Enhanced.", "Drop Proof."],
    editorialHeadline: "Where Grip Meets Clarity.",
    editorialBody: "Matte-frosted side rails provide enhanced grip with sophisticated aesthetics, while the anti-yellow nano-coated back panel showcases your device's original design.",
    featuredCards: [
      { image: "/icons/clearmag-edge.webp", label: "Frosted Sophistication", subtitle: "Matte-Textured Side Rails" },
      { image: "/icons/clearmag.webp", label: "Crystal Back", subtitle: "Anti-Yellow Clear Panel" },
      { image: "/icons/clearmag-edge.webp", label: "Dual-Layer", subtitle: "TPU + PC Construction" },
      { image: "/icons/clearmag.webp", label: "MagSafe", subtitle: "38T Magnetic Precision" },
    ],
    imageTextBlocks: [
      {
        image: "/icons/clearmag-edge.webp",
        headline: "Frosted Sophistication.",
        body: "The matte-textured edges provide a premium feel and enhanced grip while the crystal-clear back panel lets your device's design shine through.",
        highlights: ["Frosted polycarbonate edges", "Anti-yellow clear back", "Enhanced grip texture"],
      },
    ],
    marqueeItems: ["Frosted Side Rails", "Crystal-Clear Back", "14.8ft Drop Tested", "38T MagSafe", "Dual-Layer Build"],
    stats: [
      { value: "14.8ft", label: "Drop Protection" },
      { value: "38T", label: "MagSafe Force" },
      { value: "1.3mm", label: "Slim Profile" },
      { value: "34g", label: "Lightweight" },
    ],
    featureCards: [
      { title: "Frosted Rails", subtitle: "Enhanced matte grip", icon: Layers },
      { title: "Clear Back", subtitle: "Anti-yellow coating", icon: Eye },
      { title: "Dual-Layer", subtitle: "TPU + PC construction", icon: ShieldCheck },
      { title: "38 Magnets", subtitle: "MagSafe precision", icon: Magnet },
    ],
  },
  softmag: {
    scrollVideoSrc: "/assets/hero-video.mp4",
    scrollVideoTexts: ["Soft Touch.", "Bold Colors.", "MagSafe Ready.", "Stain Proof."],
    editorialHeadline: "Designed for Comfort.",
    editorialBody: "Buttery-soft liquid silicone exterior meets a cushioning microfiber interior. Four bold colorways crafted with fade-resistant pigments ensure your case looks as good months from now as it does today.",
    featuredCards: [
      { image: "/icons/softmag.webp", label: "Liquid Silicone", subtitle: "Buttery-Soft Exterior" },
      { image: "/icons/softmag.webp", label: "Microfiber Lining", subtitle: "Scratch-Free Interior" },
      { image: "/icons/softmag.webp", label: "4 Bold Colors", subtitle: "Fade-Resistant Pigments" },
      { image: "/icons/softmag.webp", label: "MagSafe", subtitle: "Integrated Magnets" },
    ],
    imageTextBlocks: [
      {
        image: "/icons/softmag.webp",
        headline: "Silicone Craftsmanship.",
        body: "Each SoftMag case is precision-molded from medical-grade liquid silicone rubber, delivering a buttery-soft feel that resists stains, oils, and everyday wear.",
        highlights: ["Stain-resistant surface", "Washable material", "Fade-resistant color"],
      },
    ],
    marqueeItems: ["Liquid Silicone", "Microfiber Interior", "4 Bold Colors", "MagSafe Compatible", "Stain Resistant"],
    stats: [
      { value: "4", label: "Bold Colors" },
      { value: "38T", label: "MagSafe Force" },
      { value: "10ft", label: "Drop Tested" },
      { value: "36g", label: "Comfortable" },
    ],
    featureCards: [
      { title: "Liquid Silicone", subtitle: "Soft-touch exterior", icon: Droplets },
      { title: "Microfiber", subtitle: "Scratch-free interior", icon: Layers },
      { title: "4 Colors", subtitle: "Fade-resistant pigments", icon: CircleDot },
      { title: "MagSafe", subtitle: "Integrated magnets", icon: Magnet },
    ],
  },
  "armor-edge": {
    scrollVideoSrc: "/assets/hero-video.mp4",
    scrollVideoTexts: ["Stand Bold.", "Camera Slider.", "Ring Stand.", "16ft Drop Proof."],
    editorialHeadline: "Built for the Fearless.",
    editorialBody: "Precision-engineered sliding camera cover protects from scratches and dust. The 360° rotatable metal ring doubles as a kickstand for hands-free viewing in any orientation.",
    featuredCards: [
      { image: "/icons/armoredge.png", label: "Camera Slider", subtitle: "Lens Scratch Protection" },
      { image: "/icons/armoredge.png", label: "Ring Stand", subtitle: "360° Rotatable Metal" },
      { image: "/icons/armoredge.png", label: "Military Grade", subtitle: "16ft Drop Protection" },
      { image: "/icons/armoredge.png", label: "360° Bezels", subtitle: "Full Edge Protection" },
    ],
    imageTextBlocks: [
      {
        image: "/icons/armoredge.png",
        headline: "Tactical Engineering.",
        body: "Reinforced corners with dual-layer construction absorb and distribute impact forces. The integrated metal ring stand rotates 360° for landscape or portrait hands-free viewing.",
        highlights: ["Sliding camera cover", "360° metal kickstand", "Reinforced corners"],
      },
    ],
    marqueeItems: ["Camera Slider", "Metal Ring Stand", "16ft Drop Tested", "360° Bezels", "Dual-Layer Armor"],
    stats: [
      { value: "16ft", label: "Drop Protection" },
      { value: "360°", label: "Ring Stand" },
      { value: "Slider", label: "Camera Cover" },
      { value: "42g", label: "Solid Build" },
    ],
    featureCards: [
      { title: "Camera Slider", subtitle: "Lens scratch protection", icon: ScanLine },
      { title: "Ring Stand", subtitle: "360° rotatable metal", icon: CircleDot },
      { title: "16ft Drop", subtitle: "Military-grade armor", icon: ShieldCheck },
      { title: "360° Bezels", subtitle: "Full edge protection", icon: Shield },
    ],
  },
  edgeguard: {
    scrollVideoSrc: "/assets/hero-video.mp4",
    scrollVideoTexts: ["Full Coverage.", "9H Hardness.", "Anti-Fingerprint.", "Zero Bubbles."],
    editorialHeadline: "Screen Protection Perfected.",
    editorialBody: "Edge-to-edge 9H tempered glass with oleophobic coating covers every millimeter of your screen. The included easy-align frame ensures bubble-free application in under 60 seconds.",
    featuredCards: [
      { image: "/icons/edgeguard.webp", label: "9H Glass", subtitle: "Maximum Hardness Rating" },
      { image: "/icons/edgeguard.webp", label: "Edge-to-Edge", subtitle: "100% Screen Coverage" },
      { image: "/icons/edgeguard.webp", label: "Anti-Fingerprint", subtitle: "Oleophobic Coating" },
      { image: "/icons/edgeguard.webp", label: "Easy-Align", subtitle: "60-Second Application" },
    ],
    imageTextBlocks: [
      {
        image: "/icons/edgeguard.webp",
        headline: "Invisible Shield.",
        body: "At just 0.33mm, our tempered glass is virtually invisible while delivering maximum 9H hardness protection. The oleophobic coating repels fingerprints for a consistently clean screen.",
        highlights: ["Bubble-free install", "Case-friendly design", "Touch sensitivity preserved"],
      },
    ],
    marqueeItems: ["9H Tempered Glass", "Edge-to-Edge", "Anti-Fingerprint", "Easy-Align Frame", "0.33mm Thin"],
    stats: [
      { value: "9H", label: "Hardness" },
      { value: "0.33mm", label: "Ultra Thin" },
      { value: "100%", label: "Coverage" },
      { value: "99.9%", label: "Transparency" },
    ],
    featureCards: [
      { title: "9H Glass", subtitle: "Maximum hardness", icon: ShieldCheck },
      { title: "Edge-to-Edge", subtitle: "100% screen coverage", icon: Ruler },
      { title: "Anti-Fingerprint", subtitle: "Oleophobic coating", icon: Waves },
      { title: "Easy-Align", subtitle: "60-second application", icon: Eye },
    ],
  },
  lensguard: {
    scrollVideoSrc: "/assets/hero-video.mp4",
    scrollVideoTexts: ["Crystal Lens.", "Sapphire Grade.", "Anti-Reflective.", "Perfect Shots."],
    editorialHeadline: "Lens Protection Reimagined.",
    editorialBody: "Sapphire-grade 9H hardness protects each lens module while the anti-reflective coating eliminates lens flare for crisp, professional-quality photos every time.",
    featuredCards: [
      { image: "/icons/lensguard.webp", label: "Sapphire-Grade", subtitle: "9H Lens Hardness" },
      { image: "/icons/lensguard.webp", label: "Anti-Reflective", subtitle: "No Lens Flare" },
      { image: "/icons/lensguard.webp", label: "Precision Fit", subtitle: "Laser-Cut Modules" },
      { image: "/icons/lensguard.webp", label: "Ultra Thin", subtitle: "0.3mm Nearly Invisible" },
    ],
    imageTextBlocks: [
      {
        image: "/icons/lensguard.webp",
        headline: "Optical Excellence.",
        body: "Each protector is laser-cut for precise camera module fit with zero interference to photo quality. The anti-reflective coating eliminates lens flare for consistently crisp images.",
        highlights: ["Zero camera interference", "Precision module fit", "Professional photo quality"],
      },
    ],
    marqueeItems: ["Sapphire-Grade", "Anti-Reflective", "Precision Cut", "0.3mm Ultra Thin", "HD Clarity"],
    stats: [
      { value: "9H", label: "Hardness" },
      { value: "0.3mm", label: "Ultra Thin" },
      { value: "AR", label: "Anti-Reflective" },
      { value: "HD", label: "Clarity" },
    ],
    featureCards: [
      { title: "Sapphire-Grade", subtitle: "9H lens hardness", icon: ShieldCheck },
      { title: "Anti-Reflective", subtitle: "No lens flare", icon: Eye },
      { title: "Precision Fit", subtitle: "Laser-cut modules", icon: ScanLine },
      { title: "0.3mm Thin", subtitle: "Nearly invisible", icon: Ruler },
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
    <div className="overflow-hidden border-y border-border/30 py-5 sm:py-6">
      <div ref={scrollRef} className="flex whitespace-nowrap will-change-transform" style={{ display: "inline-flex" }}>
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-4 sm:gap-5 px-5 sm:px-7">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground/50 font-semibold">{item}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
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

/* ── Feature Card Grid ── */
const FeatureGrid = ({ cards }: { cards: SeriesContent["featureCards"] }) => (
  <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, i) => (
        <AnimateElement key={card.title} type="fade-up" delay={i * 0.06}>
          <div className="bg-secondary/30 rounded-2xl p-4 sm:p-6 h-full flex flex-col">
            <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground mb-3 sm:mb-4" strokeWidth={1.5} />
            <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">{card.title}</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed">{card.subtitle}</p>
          </div>
        </AnimateElement>
      ))}
    </div>
  </section>
);

/* ── Material Card ── */
const MaterialCard = ({ series }: { series: { material: string; features: string[] } }) => (
  <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
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
      {/* 1. Scroll-linked video with changing text — Concept Theme signature */}
      <ScrollVideoReveal
        videoSrc={content.scrollVideoSrc}
        textItems={content.scrollVideoTexts}
      />

      {/* 2. Horizontal feature marquee */}
      <HorizontalMarquee items={content.marqueeItems} />

      {/* 3. Editorial headline + description */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        <AnimateElement type="fade-up">
          <h2 className="text-[1.75rem] sm:text-[2.5rem] lg:text-[3.5rem] font-black text-foreground leading-[1.05] tracking-tighter">
            {content.editorialHeadline}
          </h2>
        </AnimateElement>
        <AnimateElement type="fade-up" delay={0.1}>
          <p className="text-sm sm:text-lg text-muted-foreground mt-3 sm:mt-5 max-w-2xl leading-relaxed">
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

      {/* 5. Featured image grid (2x2 lifestyle cards) */}
      <FeaturedImageGrid cards={content.featuredCards} />

      {/* 6. Feature icon grid */}
      <FeatureGrid cards={content.featureCards} />

      {/* 7. Image + text editorial blocks (full-width split) */}
      {content.imageTextBlocks.map((block, i) => (
        <ImageTextBlock key={i} {...block} />
      ))}

      {/* 8. Material card */}
      {series && <MaterialCard series={series} />}
    </div>
  );
};

export default ProductContentSections;
