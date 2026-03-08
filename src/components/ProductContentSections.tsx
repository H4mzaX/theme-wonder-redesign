import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Magnet, Droplets, Zap, Layers, Ruler, Eye, ScanLine, CircleDot, ShieldCheck, Waves, BadgeCheck } from "lucide-react";
import type { Product } from "@/data/products";
import { seriesData, type SeriesSlug } from "@/data/products";
import AnimateElement from "@/components/AnimateElement";

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Series content map ── */
interface SeriesContent {
  headline: string;
  subheadline: string;
  featureBlocks: { title: string; description: string; icon: typeof Shield }[];
  stats: { value: string; label: string }[];
  closureImages: { src: string; alt: string; caption: string }[];
}

const seriesContentMap: Record<string, SeriesContent> = {
  clearmag: {
    headline: "Crystal Clear.\nMagnetically Perfect.",
    subheadline: "Anti-yellow nano coating meets 38 precision-aligned MagSafe magnets.",
    featureBlocks: [
      { title: "Anti-Yellow Technology", description: "Nano oleophobic coating resists UV-induced yellowing for months.", icon: Eye },
      { title: "38 MagSafe Magnets", description: "N52 magnets deliver 38T of magnetic force for instant snap-on charging.", icon: Magnet },
      { title: "Shock-Absorbing Corners", description: "Military-grade TPU airbag corners. SGS tested at 14.8 feet.", icon: ShieldCheck },
      { title: "Slim Profile", description: "Just 1.2mm thick polycarbonate back with raised bezels.", icon: Ruler },
    ],
    stats: [
      { value: "14.8ft", label: "Drop Protection" },
      { value: "38T", label: "Magnetic Force" },
      { value: "1.2mm", label: "Ultra Thin" },
      { value: "32g", label: "Featherlight" },
    ],
    closureImages: [
      { src: "/icons/clearmag.webp", alt: "ClearMag close-up", caption: "Crystal-clear polycarbonate with nano coating" },
      { src: "/icons/clearmag-edge.webp", alt: "ClearMag magnets", caption: "38 precision-aligned N52 magnets" },
    ],
  },
  "clearmag-edge": {
    headline: "Frosted Edges.\nCrystal Core.",
    subheadline: "Matte-frosted side rails meet a crystal-clear back panel.",
    featureBlocks: [
      { title: "Frosted Side Rails", description: "Matte-textured edges provide enhanced grip with sophisticated aesthetics.", icon: Layers },
      { title: "Clear Back Panel", description: "Anti-yellow nano coating showcases your device's original design.", icon: Eye },
      { title: "Dual-Layer Construction", description: "TPU inner shell + PC outer frame. SGS certified at 14.8 feet.", icon: ShieldCheck },
      { title: "MagSafe Precision", description: "38 built-in N52 magnets ensure perfect alignment every time.", icon: Magnet },
    ],
    stats: [
      { value: "14.8ft", label: "Drop Protection" },
      { value: "38T", label: "MagSafe Force" },
      { value: "1.3mm", label: "Slim Profile" },
      { value: "34g", label: "Lightweight" },
    ],
    closureImages: [
      { src: "/icons/clearmag-edge.webp", alt: "ClearMag Edge rails", caption: "Frosted matte rails with crystal-clear back" },
    ],
  },
  softmag: {
    headline: "Soft Touch.\nBold Statement.",
    subheadline: "Liquid silicone exterior with microfiber interior.",
    featureBlocks: [
      { title: "Liquid Silicone", description: "Buttery-soft touch that resists stains, oils, and everyday grime.", icon: Droplets },
      { title: "Microfiber Interior", description: "Soft lining cushions your device and prevents micro-scratches.", icon: Layers },
      { title: "Vibrant Colors", description: "Four bold colorways crafted with fade-resistant pigments.", icon: CircleDot },
      { title: "MagSafe Compatible", description: "Integrated magnets for reliable wireless charging.", icon: Magnet },
    ],
    stats: [
      { value: "4", label: "Bold Colors" },
      { value: "38T", label: "MagSafe Force" },
      { value: "10ft", label: "Drop Tested" },
      { value: "36g", label: "Comfortable" },
    ],
    closureImages: [
      { src: "/icons/softmag.webp", alt: "SoftMag texture", caption: "Liquid silicone with microfiber lining" },
    ],
  },
  "armor-edge": {
    headline: "Stand Bold.\nStay Protected.",
    subheadline: "Sliding camera cover, integrated ring stand, and military-grade shock absorption.",
    featureBlocks: [
      { title: "Sliding Camera Cover", description: "Precision-engineered lens cover protects from scratches and dust.", icon: ScanLine },
      { title: "Metal Ring Stand", description: "360° rotatable metal ring doubles as a kickstand.", icon: CircleDot },
      { title: "16ft Military-Grade", description: "Reinforced corners and dual-layer construction.", icon: ShieldCheck },
      { title: "360° Raised Bezels", description: "Elevated edges around screen and camera.", icon: Shield },
    ],
    stats: [
      { value: "16ft", label: "Drop Protection" },
      { value: "360°", label: "Ring Stand" },
      { value: "Slider", label: "Camera Cover" },
      { value: "42g", label: "Solid Build" },
    ],
    closureImages: [
      { src: "/icons/armoredge.png", alt: "Armor Edge detail", caption: "Sliding camera cover with metal ring stand" },
    ],
  },
  edgeguard: {
    headline: "Full Coverage.\nZero Compromise.",
    subheadline: "Edge-to-edge 9H tempered glass with oleophobic coating.",
    featureBlocks: [
      { title: "9H Tempered Glass", description: "Maximum hardness resists keys, coins, and sharp objects.", icon: ShieldCheck },
      { title: "Edge-to-Edge", description: "Covers every millimeter with seamless adhesion.", icon: Ruler },
      { title: "Oleophobic Coating", description: "Anti-fingerprint nano coating keeps screen clean.", icon: Waves },
      { title: "Easy-Align Frame", description: "Bubble-free application in under 60 seconds.", icon: Eye },
    ],
    stats: [
      { value: "9H", label: "Hardness" },
      { value: "0.33mm", label: "Ultra Thin" },
      { value: "100%", label: "Coverage" },
      { value: "99.9%", label: "Transparency" },
    ],
    closureImages: [
      { src: "/icons/edgeguard.webp", alt: "EdgeGuard glass", caption: "Edge-to-edge tempered glass protection" },
    ],
  },
  lensguard: {
    headline: "Crystal Lens.\nPerfect Shots.",
    subheadline: "Sapphire-grade protection with anti-reflective coating.",
    featureBlocks: [
      { title: "Sapphire-Grade Glass", description: "9H hardness protects each lens module.", icon: ShieldCheck },
      { title: "Anti-Reflective Coating", description: "Eliminates lens flare for crisp photos.", icon: Eye },
      { title: "Precision Module Fit", description: "Laser-cut for each camera. No interference.", icon: ScanLine },
      { title: "0.3mm Ultra Thin", description: "Nearly invisible protection.", icon: Ruler },
    ],
    stats: [
      { value: "9H", label: "Hardness" },
      { value: "0.3mm", label: "Ultra Thin" },
      { value: "AR", label: "Anti-Reflective" },
      { value: "HD", label: "Clarity" },
    ],
    closureImages: [
      { src: "/icons/lensguard.webp", alt: "LensGuard detail", caption: "Sapphire-grade camera lens protection" },
    ],
  },
};

/* ── Minimal Marquee ── */
const MinimalMarquee = ({ text }: { text: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const speed = 0.5;
    const step = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="overflow-hidden py-4 sm:py-5">
      <div ref={scrollRef} className="flex whitespace-nowrap will-change-transform" style={{ display: "inline-flex" }}>
        {[0, 1, 2].map((set) => (
          <span key={set} className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground/40 font-semibold whitespace-nowrap px-8">
            {text}
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

/* ── Main Component ── */
const ProductContentSections = ({ product }: { product: Product }) => {
  const seriesSlug = product.seriesSlug as string;
  const content = seriesContentMap[seriesSlug];

  if (!content) return null;

  const series = seriesData[seriesSlug as SeriesSlug];

  return (
    <div className="w-full">
      {/* ── Thin divider marquee ── */}
      <MinimalMarquee text={`${product.name} — ${product.device} — Premium Protection — Engineered for Perfection —`} />

      {/* ── Headline ── */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
        <AnimateElement type="fade-up">
          <h2 className="text-[1.75rem] sm:text-[2.5rem] lg:text-[3.5rem] font-black text-foreground leading-[1.05] tracking-tighter whitespace-pre-line">
            {content.headline}
          </h2>
        </AnimateElement>
        <AnimateElement type="fade-up" delay={0.1}>
          <p className="text-sm sm:text-lg text-muted-foreground mt-3 max-w-xl leading-relaxed">
            {content.subheadline}
          </p>
        </AnimateElement>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-8 sm:pb-12">
        <div className="grid grid-cols-4 gap-4 sm:gap-6 bg-secondary/30 rounded-2xl p-5 sm:p-8">
          {content.stats.map((stat, i) => (
            <StatBlock key={stat.label} value={stat.value} label={stat.label} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* ── Close-up Image + Text ── */}
      {content.closureImages.length > 0 && (
        <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-8 sm:pb-12">
          <div className={`grid grid-cols-1 ${content.closureImages.length > 1 ? "sm:grid-cols-2" : ""} gap-4`}>
            {content.closureImages.map((img, i) => (
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
      )}

      {/* ── Feature Blocks ── */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-8 sm:pb-12">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {content.featureBlocks.map((block, i) => (
            <AnimateElement key={block.title} type="fade-up" delay={i * 0.06}>
              <div className="bg-secondary/30 rounded-xl p-4 sm:p-6 h-full">
                <block.icon className="w-5 h-5 text-foreground mb-3" strokeWidth={1.5} />
                <h3 className="text-[13px] sm:text-base font-bold text-foreground tracking-tight mb-1.5">
                  {block.title}
                </h3>
                <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
                  {block.description}
                </p>
              </div>
            </AnimateElement>
          ))}
        </div>
      </section>

      {/* ── Material Card ── */}
      {series && (
        <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-8 sm:pb-12">
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
      )}
    </div>
  );
};

export default ProductContentSections;
