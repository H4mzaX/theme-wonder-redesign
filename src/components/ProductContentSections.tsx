import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Magnet, Droplets, Zap, Layers, Ruler, Eye, ScanLine, CircleDot, ShieldCheck, Waves, BadgeCheck } from "lucide-react";
import type { Product } from "@/data/products";
import { seriesData, type SeriesSlug } from "@/data/products";
import AnimateElement from "@/components/AnimateElement";

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Series-specific detailed content ── */
interface SeriesContent {
  headline: string;
  subheadline: string;
  marqueeText: string;
  featureBlocks: { title: string; description: string; icon: typeof Shield }[];
  stats: { value: string; label: string }[];
}

const seriesContentMap: Record<string, SeriesContent> = {
  clearmag: {
    headline: "Crystal Clear.\nMagnetically Perfect.",
    subheadline: "Anti-yellow nano coating meets 38 precision-aligned MagSafe magnets. Protection that disappears.",
    marqueeText: "ClearMag ✦ Anti-Yellow ✦ MagSafe Ready ✦ 14.8ft Drop Tested ✦ Crystal Clear ✦ Nano Coated ✦",
    featureBlocks: [
      { title: "Anti-Yellow Technology", description: "Nano oleophobic coating resists UV-induced yellowing. Your case stays crystal clear for months, not days.", icon: Eye },
      { title: "38 MagSafe Magnets", description: "Precision-aligned N52 magnets deliver 38T of magnetic force for instant snap-on charging and accessory compatibility.", icon: Magnet },
      { title: "Shock-Absorbing Corners", description: "Military-grade TPU airbag corners distribute impact force across 4 reinforced zones. SGS tested at 14.8 feet.", icon: ShieldCheck },
      { title: "Slim Profile Design", description: "Just 1.2mm thick polycarbonate back with raised bezels. Full protection without the bulk.", icon: Ruler },
    ],
    stats: [
      { value: "14.8ft", label: "Drop Protection" },
      { value: "38T", label: "Magnetic Force" },
      { value: "1.2mm", label: "Ultra Thin" },
      { value: "32g", label: "Featherlight" },
    ],
  },
  "clearmag-edge": {
    headline: "Frosted Edges.\nCrystal Core.",
    subheadline: "Matte-frosted side rails meet a crystal-clear back panel. The edge that defines premium.",
    marqueeText: "ClearMag Edge ✦ Frosted Rails ✦ MagSafe ✦ 14.8ft Drop Tested ✦ Enhanced Grip ✦ Premium Feel ✦",
    featureBlocks: [
      { title: "Frosted Side Rails", description: "Matte-textured polycarbonate edges provide an enhanced grip while adding a sophisticated aesthetic contrast.", icon: Layers },
      { title: "Clear Back Panel", description: "Transparent back with anti-yellow nano coating showcases your device's original design while staying crystal clear.", icon: Eye },
      { title: "Enhanced Drop Protection", description: "Dual-layer construction with TPU inner shell and PC outer frame. SGS certified at 14.8 feet drop protection.", icon: ShieldCheck },
      { title: "MagSafe Precision", description: "38 built-in N52 magnets ensure perfect alignment every time. Snap-on charging at full speed.", icon: Magnet },
    ],
    stats: [
      { value: "14.8ft", label: "Drop Protection" },
      { value: "38T", label: "MagSafe Force" },
      { value: "1.3mm", label: "Slim Profile" },
      { value: "34g", label: "Lightweight" },
    ],
  },
  softmag: {
    headline: "Soft Touch.\nBold Statement.",
    subheadline: "Liquid silicone exterior with microfiber interior. Colors that express, protection that impresses.",
    marqueeText: "SoftMag ✦ Liquid Silicone ✦ MagSafe ✦ Microfiber Lined ✦ Stain Resistant ✦ Washable ✦",
    featureBlocks: [
      { title: "Liquid Silicone Exterior", description: "Premium liquid silicone rubber provides a buttery-soft touch that resists stains, oils, and everyday grime.", icon: Droplets },
      { title: "Microfiber Interior", description: "Soft microfiber lining cushions your device and prevents micro-scratches from daily insertion and removal.", icon: Layers },
      { title: "Vibrant Color Range", description: "Four bold colorways — Black, Stone, Navy, Orange — crafted with fade-resistant pigments that stay vivid.", icon: CircleDot },
      { title: "MagSafe Compatible", description: "Integrated magnets beneath the silicone shell ensure reliable wireless charging and accessory attachment.", icon: Magnet },
    ],
    stats: [
      { value: "4", label: "Bold Colors" },
      { value: "38T", label: "MagSafe Force" },
      { value: "10ft", label: "Drop Tested" },
      { value: "36g", label: "Comfortable" },
    ],
  },
  "armor-edge": {
    headline: "Stand Bold.\nStay Protected.",
    subheadline: "Sliding camera cover, integrated ring stand, and military-grade shock absorption. For those who demand everything.",
    marqueeText: "Armor Edge ✦ Camera Slider ✦ Ring Stand ✦ 16ft Drop Tested ✦ MagSafe ✦ 360° Protection ✦",
    featureBlocks: [
      { title: "Sliding Camera Cover", description: "Precision-engineered sliding lens cover protects your camera from scratches, dust, and pocket debris.", icon: ScanLine },
      { title: "Metal Ring Stand", description: "Integrated 360° rotatable metal ring doubles as a kickstand for hands-free viewing and a secure grip.", icon: CircleDot },
      { title: "16ft Military-Grade", description: "Reinforced corners and dual-layer construction absorb and distribute extreme impact forces.", icon: ShieldCheck },
      { title: "360° Raised Bezels", description: "Elevated edges around screen and camera provide all-round protection against flat-surface drops.", icon: Shield },
    ],
    stats: [
      { value: "16ft", label: "Drop Protection" },
      { value: "360°", label: "Ring Stand" },
      { value: "Slider", label: "Camera Cover" },
      { value: "42g", label: "Solid Build" },
    ],
  },
  edgeguard: {
    headline: "Full Coverage.\nZero Compromise.",
    subheadline: "Edge-to-edge 9H tempered glass with oleophobic coating. Your screen's invisible shield.",
    marqueeText: "EdgeGuard ✦ 9H Hardness ✦ Oleophobic ✦ Edge-to-Edge ✦ Bubble Free ✦ Crystal Clear ✦",
    featureBlocks: [
      { title: "9H Tempered Glass", description: "Maximum hardness rating resists keys, coins, and sharp objects. Your screen stays pristine under daily wear.", icon: ShieldCheck },
      { title: "Edge-to-Edge Coverage", description: "Precisely cut to cover every millimeter of your display with seamless adhesion and zero dead zones.", icon: Ruler },
      { title: "Oleophobic Coating", description: "Anti-fingerprint nano coating keeps your screen clean and smudge-free throughout the day.", icon: Waves },
      { title: "Easy-Align Frame", description: "Included installation frame ensures perfect placement every time. Bubble-free application in under 60 seconds.", icon: Eye },
    ],
    stats: [
      { value: "9H", label: "Hardness" },
      { value: "0.33mm", label: "Ultra Thin" },
      { value: "100%", label: "Coverage" },
      { value: "99.9%", label: "Transparency" },
    ],
  },
  lensguard: {
    headline: "Crystal Lens.\nPerfect Shots.",
    subheadline: "Sapphire-grade protection with anti-reflective coating. Your camera's invisible armor.",
    marqueeText: "LensGuard ✦ Sapphire-Grade ✦ Anti-Reflective ✦ 0.3mm Thin ✦ Precision Cut ✦ HD Clarity ✦",
    featureBlocks: [
      { title: "Sapphire-Grade Glass", description: "9H hardness sapphire-grade tempered glass protects each lens module from scratches and impact damage.", icon: ShieldCheck },
      { title: "Anti-Reflective Coating", description: "Multi-layer AR coating eliminates lens flare and ghosting for crisp, natural-looking photos.", icon: Eye },
      { title: "Precision Module Fit", description: "Laser-cut to match each camera module exactly. No interference with autofocus, OIS, or flash.", icon: ScanLine },
      { title: "0.3mm Ultra Thin", description: "Nearly invisible profile that adds protection without affecting photo quality or aesthetic.", icon: Ruler },
    ],
    stats: [
      { value: "9H", label: "Hardness" },
      { value: "0.3mm", label: "Ultra Thin" },
      { value: "AR", label: "Anti-Reflective" },
      { value: "HD", label: "Clarity" },
    ],
  },
};

/* ── Marquee Strip ── */
const ProductMarquee = ({ text }: { text: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const speed = 0.8;
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
    <div className="overflow-hidden py-6 sm:py-8 border-y border-border/40 bg-secondary/20">
      <div ref={scrollRef} className="flex whitespace-nowrap will-change-transform" style={{ display: "inline-flex" }}>
        {[0, 1, 2].map((set) => (
          <span
            key={set}
            className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground/10 uppercase whitespace-nowrap px-4"
            style={{ fontFamily: "inherit" }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Animated Stat Counter ── */
const StatBlock = ({ value, label, delay }: { value: string; label: string; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: expoOut }}
    >
      <span className="block text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tighter">
        {value}
      </span>
      <span className="block text-[11px] sm:text-sm text-muted-foreground uppercase tracking-widest mt-1 sm:mt-2 font-medium">
        {label}
      </span>
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
      {/* ── Marquee Strip ── */}
      <ProductMarquee text={content.marqueeText} />

      {/* ── Big Headline Section ── */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
        <AnimateElement type="fade-up">
          <h2 className="text-[2rem] sm:text-[3.5rem] lg:text-[4.5rem] font-black text-foreground leading-[1.05] tracking-tighter whitespace-pre-line">
            {content.headline}
          </h2>
        </AnimateElement>
        <AnimateElement type="fade-up" delay={0.15}>
          <p className="text-base sm:text-xl lg:text-2xl text-muted-foreground mt-4 sm:mt-6 max-w-2xl leading-relaxed font-light">
            {content.subheadline}
          </p>
        </AnimateElement>
      </section>

      {/* ── Stats Row ── */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-10 sm:pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 bg-secondary/30 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12">
          {content.stats.map((stat, i) => (
            <StatBlock key={stat.label} value={stat.value} label={stat.label} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ── Feature Detail Blocks ── */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {content.featureBlocks.map((block, i) => (
            <AnimateElement key={block.title} type="fade-up" delay={i * 0.08}>
              <div className="bg-secondary/30 rounded-2xl p-6 sm:p-8 lg:p-10 h-full group hover:bg-secondary/50 transition-colors duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center mb-4 sm:mb-5 group-hover:border-foreground/30 transition-colors">
                  <block.icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tracking-tight mb-2 sm:mb-3">
                  {block.title}
                </h3>
                <p className="text-[13px] sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                  {block.description}
                </p>
              </div>
            </AnimateElement>
          ))}
        </div>
      </section>

      {/* ── Material & Construction ── */}
      {series && (
        <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-10 sm:pb-16">
          <div className="bg-foreground text-background rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14">
            <AnimateElement type="fade-up">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-background/50 font-semibold">
                Material & Construction
              </span>
              <h3 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-2 sm:mt-3 mb-4 sm:mb-6">
                {series.material}
              </h3>
            </AnimateElement>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {series.features.map((feature, i) => (
                <AnimateElement key={i} type="fade-up" delay={i * 0.08}>
                  <div className="flex items-start gap-3 bg-background/5 rounded-xl p-4 sm:p-5">
                    <BadgeCheck className="w-5 h-5 text-background/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span className="text-[13px] sm:text-sm text-background/80 leading-relaxed">{feature}</span>
                  </div>
                </AnimateElement>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Second Marquee ── */}
      <ProductMarquee text={`${product.name} for ${product.device} ✦ Premium Protection ✦ Designed for Perfection ✦`} />
    </div>
  );
};

export default ProductContentSections;
