import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield, Magnet, Droplets, Zap, Layers, Ruler, Eye, ScanLine,
  CircleDot, ShieldCheck, Waves, BadgeCheck, Zap as ZapIcon
} from "lucide-react";
import type { Product } from "@/data/products";
import { seriesData, type SeriesSlug } from "@/data/products";
import AnimateElement from "@/components/AnimateElement";
import ScrollVideoReveal from "@/components/ScrollVideoReveal";
import FeaturedImageGrid from "@/components/FeaturedImageGrid";
import ImageTextBlock from "@/components/ImageTextBlock";
import heroVideo from "@/assets/hero-video.mp4";

import softmagCloseup from "@/assets/softmag-closeup.webp";
import softmagLifestyle from "@/assets/softmag-lifestyle.webp";
import softmagFloating from "@/assets/softmag-floating.webp";
import softmagCamera from "@/assets/softmag-camera.webp";
import softmagVideo from "@/assets/softmag-showcase.mp4";

// ClearMag product images
import iphone17proMagsafeClear from "@/assets/iphone17pro-magsafe-clear.jpg";
import iphone17proMagsafeAttach from "@/assets/iphone17pro-magsafe-attach.jpg";
import iphone17proSlimDesign from "@/assets/iphone17pro-slim-design.jpg";
import iphone17proProtection from "@/assets/iphone17pro-protection.jpg";
import iphone17proStrong from "@/assets/iphone17pro-strong.jpg";
import iphone17proFingerprints from "@/assets/iphone17pro-fingerprints.jpg";

// ClearMag Edge product images
import iphone16MagsafeClear from "@/assets/iphone16-magsafe-clear.png";
import iphone16MagsafeFeatures from "@/assets/iphone16-magsafe-features.png";
import iphone16MagsafeLifestyle from "@/assets/iphone16-magsafe-lifestyle.jpg";
import iphone16MagsafeDetails from "@/assets/iphone16-magsafe-details.jpg";

// Protection product images
import edgeguardImg from "@/assets/edgeguard-screen-protector.jpg";
import edgeguardHoverImg from "@/assets/edgeguard-screen-protector-hover.jpg";
import lensguardImg from "@/assets/lensguard-camera-protector.jpg";
import lensguardHoverImg from "@/assets/lensguard-camera-protector-hover.jpg";

// Armor Edge images
import armoredgeMagnetic from "@/assets/armoredge-magnetic.webp";
import armoredgeCamera from "@/assets/armoredge-camera.webp";
import armoredgeProtection from "@/assets/armoredge-protection.webp";
import armoredgeImpact from "@/assets/armoredge-impact.webp";
import armoredgeFeatures from "@/assets/armoredge-features.webp";
import armoredgeLifestyle from "@/assets/armoredge-lifestyle.webp";

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
  // Featured image grid cards — each has a text position to vary layout
  featuredCards: { image: string; label: string; subtitle: string; textPosition?: "bottom-center" | "top-left" | "top-right" | "center" }[];
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
    scrollVideoSrc: heroVideo,
    scrollVideoTexts: ["Crystal Clear.", "Anti-Yellow.", "MagSafe Ready.", "Drop Proof."],
    editorialHeadline: "Engineered for Every Detail.",
    editorialBody: "Precision-aligned N52 magnets deliver 38T of magnetic force for instant snap-on MagSafe charging. The nano oleophobic coating resists UV-induced yellowing, keeping your case crystal clear for months.",
    featuredCards: [
      { image: iphone17proMagsafeClear, label: "Transparent Protection", subtitle: "Anti-Yellow Nano Coating", textPosition: "bottom-center" },
      { image: iphone17proMagsafeAttach, label: "Magnetic Precision", subtitle: "38 N52 MagSafe Magnets", textPosition: "top-left" },
      { image: iphone17proSlimDesign, label: "Ultra Slim", subtitle: "1.2mm Polycarbonate Shell", textPosition: "top-right" },
      { image: iphone17proStrong, label: "Military Grade", subtitle: "14.8ft Drop Protection", textPosition: "center" },
    ],
    imageTextBlocks: [
      {
        image: iphone17proProtection,
        headline: "Transparent Protection Perfected.",
        body: "Our anti-yellow nano coating technology ensures your case stays crystal clear, resisting UV-induced yellowing for months of pristine clarity. Show off your device's original design without compromise.",
        highlights: ["Anti-yellow nano coating", "UV-resistant polycarbonate", "Oleophobic surface"],
      },
      {
        image: iphone17proFingerprints,
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
    scrollVideoSrc: heroVideo,
    scrollVideoTexts: ["Frosted Edges.", "Crystal Core.", "Grip Enhanced.", "Drop Proof."],
    editorialHeadline: "Where Grip Meets Clarity.",
    editorialBody: "Matte-frosted side rails provide enhanced grip with sophisticated aesthetics, while the anti-yellow nano-coated back panel showcases your device's original design.",
    featuredCards: [
      { image: magsafeClearImg, label: "Frosted Sophistication", subtitle: "Matte-Textured Side Rails", textPosition: "bottom-center" },
      { image: magsafeBlackImg, label: "Crystal Back", subtitle: "Anti-Yellow Clear Panel", textPosition: "top-left" },
      { image: magsafeClearImg, label: "Dual-Layer", subtitle: "TPU + PC Construction", textPosition: "top-right" },
      { image: magsafeBlackImg, label: "MagSafe", subtitle: "38T Magnetic Precision", textPosition: "center" },
    ],
    imageTextBlocks: [
      {
        image: magsafeClearImg,
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
    scrollVideoSrc: softmagVideo,
    scrollVideoTexts: ["Soft Touch.", "Bold Colors.", "MagSafe Ready.", "Stain Proof."],
    editorialHeadline: "Designed for Comfort.",
    editorialBody: "Buttery-soft liquid silicone exterior meets a cushioning microfiber interior. Four bold colorways crafted with fade-resistant pigments ensure your case looks as good months from now as it does today.",
    featuredCards: [
      { image: softmagFloating, label: "Liquid Silicone", subtitle: "Buttery-Soft Exterior", textPosition: "bottom-center" },
      { image: softmagCloseup, label: "Precision Detail", subtitle: "MagSafe Ring & Button Cutouts", textPosition: "top-left" },
      { image: softmagCamera, label: "Camera Guard", subtitle: "Raised Lens Protection", textPosition: "top-right" },
      { image: softmagLifestyle, label: "Adventure Ready", subtitle: "Built for Every Journey", textPosition: "center" },
    ],
    imageTextBlocks: [
      {
        image: softmagCloseup,
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
    scrollVideoSrc: heroVideo,
    scrollVideoTexts: ["Stand Bold.", "Camera Slider.", "Ring Stand.", "16ft Drop Proof."],
    editorialHeadline: "Built for the Fearless.",
    editorialBody: "Precision-engineered sliding camera cover protects from scratches and dust. The 360° rotatable metal ring doubles as a kickstand for hands-free viewing in any orientation.",
    featuredCards: [
      { image: armoredgeCamera, label: "Camera Slider", subtitle: "Lens Scratch Protection", textPosition: "bottom-center" },
      { image: armoredgeMagnetic, label: "Magnetic Lock", subtitle: "MagSafe Compatible Ring", textPosition: "top-left" },
      { image: armoredgeImpact, label: "Military Grade", subtitle: "16ft Drop Protection", textPosition: "top-right" },
      { image: armoredgeProtection, label: "Hybrid Build", subtitle: "Full Edge Protection", textPosition: "center" },
    ],
    imageTextBlocks: [
      {
        image: armoredgeFeatures,
        headline: "Tactical Engineering.",
        body: "Reinforced corners with dual-layer construction absorb and distribute impact forces. The integrated metal ring stand rotates 360° for landscape or portrait hands-free viewing.",
        highlights: ["Sliding camera cover", "360° metal kickstand", "Reinforced corners"],
      },
      {
        image: armoredgeLifestyle,
        headline: "Built to Survive.",
        body: "Military-grade shock absorption meets cinematic design. Tested at 16ft drops with reinforced corners and a shock-absorbing TPU frame that keeps your phone intact.",
        highlights: ["16ft drop tested", "Shock-absorbing frame", "Reinforced corners"],
        reverse: true,
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
    scrollVideoSrc: heroVideo,
    scrollVideoTexts: ["Full Coverage.", "9H Hardness.", "Anti-Fingerprint.", "Zero Bubbles."],
    editorialHeadline: "Screen Protection Perfected.",
    editorialBody: "Edge-to-edge 9H tempered glass with oleophobic coating covers every millimeter of your screen. The included easy-align frame ensures bubble-free application in under 60 seconds.",
    featuredCards: [
      { image: edgeguardImg, label: "9H Glass", subtitle: "Maximum Hardness Rating", textPosition: "bottom-center" },
      { image: edgeguardHoverImg, label: "Edge-to-Edge", subtitle: "100% Screen Coverage", textPosition: "top-left" },
      { image: edgeguardImg, label: "Anti-Fingerprint", subtitle: "Oleophobic Coating", textPosition: "top-right" },
      { image: edgeguardHoverImg, label: "Easy-Align", subtitle: "60-Second Application", textPosition: "center" },
    ],
    imageTextBlocks: [
      {
        image: edgeguardImg,
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
    scrollVideoSrc: heroVideo,
    scrollVideoTexts: ["Crystal Lens.", "Sapphire Grade.", "Anti-Reflective.", "Perfect Shots."],
    editorialHeadline: "Lens Protection Reimagined.",
    editorialBody: "Sapphire-grade 9H hardness protects each lens module while the anti-reflective coating eliminates lens flare for crisp, professional-quality photos every time.",
    featuredCards: [
      { image: lensguardImg, label: "Sapphire-Grade", subtitle: "9H Lens Hardness", textPosition: "bottom-center" },
      { image: lensguardHoverImg, label: "Anti-Reflective", subtitle: "No Lens Flare", textPosition: "top-left" },
      { image: lensguardImg, label: "Precision Fit", subtitle: "Laser-Cut Modules", textPosition: "top-right" },
      { image: lensguardHoverImg, label: "Ultra Thin", subtitle: "0.3mm Nearly Invisible", textPosition: "center" },
    ],
    imageTextBlocks: [
      {
        image: lensguardImg,
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

/* ── Small caps marquee ── */
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

/* ── Large outlined-text marquee (Concept Theme signature) ── */
const OutlinedMarquee = ({ items }: { items: string[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const speed = 0.6;
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
    <div className="overflow-hidden py-8 sm:py-12 lg:py-16">
      <div ref={scrollRef} className="flex whitespace-nowrap will-change-transform" style={{ display: "inline-flex" }}>
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-6 sm:gap-8 px-6 sm:px-8">
            <span
              className="text-[3rem] sm:text-[5rem] lg:text-[7rem] xl:text-[8rem] font-black tracking-tighter leading-none select-none"
              style={{
                WebkitTextStroke: "1.5px hsl(var(--foreground) / 0.15)",
                WebkitTextFillColor: "transparent",
              }}
            >
              {item}
            </span>
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-foreground/15 flex-shrink-0" />
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

/* ── Featured Card — Concept Theme varied text positions ── */
const FeaturedCard = ({ card, aspectClass, isDark }: {
  card: SeriesContent["featuredCards"][0];
  aspectClass: string;
  isDark: boolean;
}) => {
  const pos = card.textPosition || "bottom-center";

  const textPositionClass = {
    "bottom-center": "absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-center",
    "top-left": "absolute top-0 left-0 p-4 sm:p-5 text-left",
    "top-right": "absolute top-0 right-0 p-4 sm:p-6 text-right max-w-[85%]",
    "center": "absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center",
  }[pos];

  const textColor = isDark
    ? "text-white"
    : "text-foreground";

  const labelColor = isDark
    ? "text-white/60"
    : "text-muted-foreground";

  return (
    <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden group ${aspectClass} bg-white`}>
      <img
        src={card.image}
        alt={card.label}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      {isDark && <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />}
      <div className={textPositionClass}>
        <p className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] ${labelColor}`}>{card.label}</p>
        <p className={`text-sm sm:text-base lg:text-lg font-bold tracking-tight leading-tight mt-0.5 ${textColor}`}>
          {card.subtitle}
        </p>
      </div>
    </div>
  );
};

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
      {/* 1. Scroll-linked video with changing text */}
      <div id="pdp-highlights">
        <ScrollVideoReveal
          videoSrc={content.scrollVideoSrc}
          textItems={content.scrollVideoTexts}
        />
      </div>

      {/* 2. Large outlined-text marquee */}
      <OutlinedMarquee items={content.scrollVideoTexts.map(t => t.replace('.', ''))} />

      {/* 3. Editorial text + Featured gallery — Concept Theme exact layout */}
      <div id="pdp-features">
        {/* Editorial text — full width on mobile, left column on desktop */}
        <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pt-10 sm:pt-16 lg:pt-20 pb-6 sm:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-6 lg:gap-12 items-start">
            <div className="lg:sticky lg:top-[100px]">
              <AnimateElement type="fade-up">
                <h2 className="text-[1.6rem] sm:text-[2.2rem] lg:text-[2.6rem] xl:text-[3rem] font-black text-foreground leading-[1.08] tracking-tighter">
                  {content.editorialHeadline}
                </h2>
              </AnimateElement>
              <AnimateElement type="fade-up" delay={0.1}>
                <p className="text-[13px] sm:text-[14px] text-muted-foreground mt-4 sm:mt-5 leading-[1.7]">
                  {content.editorialBody}
                </p>
              </AnimateElement>
            </div>

            {/* Desktop: 2-col asymmetric grid */}
            <div className="hidden lg:grid grid-cols-[5fr_4fr] gap-4">
              {/* Left: 2 stacked cards */}
              <div className="flex flex-col gap-4">
                {content.featuredCards.slice(0, 2).map((card, i) => (
                  <AnimateElement key={i} type="fade-up" delay={i * 0.1}>
                    <FeaturedCard card={card} aspectClass="aspect-[4/3]" isDark={false} />
                  </AnimateElement>
                ))}
              </div>
              {/* Right: 1 tall card */}
              {content.featuredCards[2] && (
                <AnimateElement type="fade-up" delay={0.15}>
                  <FeaturedCard card={content.featuredCards[2]} aspectClass="h-full min-h-[500px]" isDark={true} />
                </AnimateElement>
              )}
            </div>
          </div>
        </section>

        {/* Mobile: Full-width stacked cards */}
        <div className="lg:hidden px-4 sm:px-6 pb-6 flex flex-col gap-4">
          {content.featuredCards.slice(0, 3).map((card, i) => (
            <AnimateElement key={i} type="fade-up" delay={i * 0.08}>
              <FeaturedCard card={card} aspectClass="aspect-[4/3]" isDark={i === 2} />
            </AnimateElement>
          ))}
        </div>

        {/* Bottom wide card (4th) — both mobile + desktop */}
        {content.featuredCards[3] && (
          <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-8 sm:pb-10">
            <AnimateElement type="fade-up" delay={0.2}>
              <FeaturedCard card={content.featuredCards[3]} aspectClass="aspect-[16/9] sm:aspect-[21/9]" isDark={true} />
            </AnimateElement>
          </div>
        )}
      </div>

      {/* 4. Small caps marquee */}
      <HorizontalMarquee items={content.marqueeItems} />

      {/* 5. Stats bar */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="grid grid-cols-4 gap-4 sm:gap-6 bg-secondary/30 rounded-2xl p-5 sm:p-8">
          {content.stats.map((stat, i) => (
            <StatBlock key={stat.label} value={stat.value} label={stat.label} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* 6. Feature icon grid */}
      <FeatureGrid cards={content.featureCards} />

      {/* 7. Image + text editorial blocks */}
      {content.imageTextBlocks.map((block, i) => (
        <ImageTextBlock key={i} {...block} />
      ))}

      {/* 8. Material card */}
      <div id="pdp-faqs">
        {series && <MaterialCard series={series} />}
      </div>
    </div>
  );
};

export default ProductContentSections;
