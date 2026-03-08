import magsafeClearImg from "@/assets/case-magsafe-clear.jpg";
import magsafeBlackImg from "@/assets/case-magsafe-black.jpg";
import siliconeBluImg from "@/assets/case-silicone-blue.jpg";
import siliconePinkImg from "@/assets/case-silicone-pink.jpg";
import siliconeGreenImg from "@/assets/case-silicone-green.jpg";
import siliconeBlackImg from "@/assets/case-silicone-black.jpg";
import siliconeMintImg from "@/assets/silicone-mint.png";
import siliconeBlackNewImg from "@/assets/silicone-black-new.png";
import siliconeColorsFloatingImg from "@/assets/silicone-colors-floating.jpg";
import siliconeLifestyleGreenImg from "@/assets/silicone-lifestyle-green.jpg";
import siliconeLifestyleNavyImg from "@/assets/silicone-lifestyle-navy.jpg";
import siliconeLifestyleClearImg from "@/assets/silicone-lifestyle-clear.jpg";
import leatherBrownImg from "@/assets/case-leather-brown.jpg";
import leatherBlackImg from "@/assets/case-leather-black.jpg";
import edgeguardImg from "@/assets/edgeguard-screen-protector.jpg";
import edgeguardHoverImg from "@/assets/edgeguard-screen-protector-hover.jpg";
import lensguardImg from "@/assets/lensguard-camera-protector.jpg";
import lensguardHoverImg from "@/assets/lensguard-camera-protector-hover.jpg";
import armoredgeImg from "@/assets/armoredge-protection.webp";
import armoredgeHoverImg from "@/assets/armoredge-features.webp";
import softmagImg from "@/assets/softmag.webp";

import iphone17proMagsafeClearImg from "@/assets/iphone17pro-magsafe-clear.jpg";
import iphone17proSlimImg from "@/assets/iphone17pro-slim-design.jpg";
import iphone17proProtectionImg from "@/assets/iphone17pro-protection.jpg";
import iphone17proStrongImg from "@/assets/iphone17pro-strong.jpg";
import iphone17proMagsafeAttachImg from "@/assets/iphone17pro-magsafe-attach.jpg";
import iphone17proFingerprintsImg from "@/assets/iphone17pro-fingerprints.jpg";

import iphone17MagsafeClearImg from "@/assets/iphone17-magsafe-clear.jpg";
import iphone17SlimImg from "@/assets/iphone17-slim-design.jpg";
import iphone17ProtectionImg from "@/assets/iphone17-protection.jpg";
import iphone17StrongImg from "@/assets/iphone17-strong.jpg";
import iphone17MagsafeAttachImg from "@/assets/iphone17-magsafe-attach.jpg";
import iphone17FingerprintsImg from "@/assets/iphone17-fingerprints.jpg";

import iphone16MagsafeLifestyleImg from "@/assets/iphone16-magsafe-lifestyle.jpg";
import iphone16MagsafeClearImg from "@/assets/iphone16-magsafe-clear.png";
import iphone16MagsafeFeaturesImg from "@/assets/iphone16-magsafe-features.png";
import iphone16MagsafeGridImg from "@/assets/iphone16-magsafe-grid.png";
import iphone16MagsafeDetailsImg from "@/assets/iphone16-magsafe-details.jpg";

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
  reviews: number;
  image: string;
  hoverImage?: string;
  colors: string[];
  tag?: string;
  brand: string;
  category: string;
  device: string;
  series: string;
  seriesSlug: string;
}

// ── Series definitions ──
export type SeriesSlug = "clearmag" | "clearmag-edge" | "softmag" | "armor-edge" | "edgeguard" | "lensguard";

export interface SeriesInfo {
  name: string;
  slug: SeriesSlug;
  category: "cases" | "protection";
  type: "case" | "screen" | "camera";
  description: string;
  tagline: string;
  icon: string; // path to icon in /public/icons/
  features: string[];
  material: string;
  comingSoon?: boolean;
}

export const seriesData: Record<SeriesSlug, SeriesInfo> = {
  clearmag: {
    name: "ClearMag",
    slug: "clearmag",
    category: "cases",
    type: "case",
    description: "Crystal-clear MagSafe case with anti-yellow technology and shock-absorbing corners.",
    tagline: "See-through protection, magnetically perfect.",
    icon: "/icons/clearmag.webp",
    features: [
      "MagSafe alignment with 38 built-in magnets",
      "Anti-yellow nano-coated polycarbonate",
      "Shock-absorbing TPU corners",
      "Raised bezels for screen & camera protection",
    ],
    material: "Polycarbonate + TPU construction",
  },
  "clearmag-edge": {
    name: "ClearMag Edge",
    slug: "clearmag-edge",
    category: "cases",
    type: "case",
    description: "Premium MagSafe case with frosted edges and enhanced drop protection.",
    tagline: "Frosted edges, crystal clarity.",
    icon: "/icons/clearmag-edge.webp",
    features: [
      "MagSafe alignment with 38 built-in magnets",
      "Frosted polycarbonate back panel",
      "14.8ft drop protection tested",
      "Enhanced grip frosted side rails",
    ],
    material: "Frosted Polycarbonate + TPU construction",
  },
  softmag: {
    name: "SoftMag",
    slug: "softmag",
    category: "cases",
    type: "case",
    description: "Liquid silicone MagSafe case with soft-touch finish in multiple colors.",
    tagline: "Soft touch, bold colors.",
    icon: "/icons/softmag.webp",
    features: [
      "MagSafe compatible magnets",
      "Liquid silicone rubber exterior",
      "Soft microfiber interior lining",
      "Washable and stain-resistant surface",
    ],
    material: "Liquid Silicone + Microfiber construction",
  },
  "armor-edge": {
    name: "Armor Edge",
    slug: "armor-edge",
    category: "cases",
    type: "case",
    description: "Bold MagSafe case with sliding camera cover, integrated ring stand, and all-round shock absorption. Designed for those who demand both style and serious protection.",
    tagline: "Stand bold. Stay protected.",
    icon: "/icons/armoredge.png",
    features: [
      "MagSafe compatible with integrated metal ring stand",
      "Sliding camera lens cover for scratch-free protection",
      "Military-grade 16ft drop-tested shock absorption",
      "360° raised bezels for screen & camera safety",
    ],
    material: "Polycarbonate + TPU + Metal Ring Stand construction",
  },
  edgeguard: {
    name: "EdgeGuard",
    slug: "edgeguard",
    category: "protection",
    type: "screen",
    description: "Edge-to-edge tempered glass screen protector with installation kit.",
    tagline: "Full coverage, zero compromise.",
    icon: "/icons/edgeguard.webp",
    features: [
      "9H hardness tempered glass",
      "Edge-to-edge full coverage",
      "Oleophobic anti-fingerprint coating",
      "Easy-align installation frame included",
    ],
    material: "Tempered Glass + Oleophobic Coating",
  },
  lensguard: {
    name: "LensGuard",
    slug: "lensguard",
    category: "protection",
    type: "camera",
    description: "Precision camera lens protector with sapphire-grade hardness.",
    tagline: "Crystal clear lens protection.",
    icon: "/icons/lensguard.webp",
    features: [
      "Sapphire-grade 9H hardness",
      "Anti-reflective coating",
      "Precision cut for each camera module",
      "Ultra-thin 0.3mm profile",
    ],
    material: "Sapphire-grade Tempered Glass",
  },
};

// ── Device definitions ──
export interface DeviceModel {
  name: string;
  slug: string;
}

export interface DeviceSeries {
  name: string;
  slug: string;
  models: DeviceModel[];
}

export const deviceSeries: DeviceSeries[] = [
  {
    name: "iPhone 16 Series",
    slug: "iphone-16",
    models: [
      { name: "iPhone 16", slug: "iphone-16" },
      { name: "iPhone 16 Pro", slug: "iphone-16-pro" },
      { name: "iPhone 16e", slug: "iphone-16e" },
    ],
  },
  {
    name: "iPhone 17 Series",
    slug: "iphone-17",
    models: [
      { name: "iPhone 17", slug: "iphone-17" },
      { name: "iPhone 17 Pro", slug: "iphone-17-pro" },
      { name: "iPhone 17 Pro Max", slug: "iphone-17-pro-max" },
      { name: "iPhone 17 Air", slug: "iphone-17-air" },
    ],
  },
];

// All device model names for product generation
const allDeviceModels = deviceSeries.flatMap((s) => s.models.map((m) => m.name));

// Series product definitions
interface SeriesProductDef {
  seriesSlug: SeriesSlug;
  image: string;
  hoverImage?: string;
  colors: string[];
  basePrice: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviewBase: number;
}

const seriesProductDefs: SeriesProductDef[] = [
  { seriesSlug: "clearmag", image: magsafeClearImg, hoverImage: magsafeBlackImg, colors: ["Clear"], basePrice: 1499, originalPrice: 2499, discount: "Save 40%", rating: 5, reviewBase: 120 },
  { seriesSlug: "clearmag-edge", image: magsafeBlackImg, hoverImage: magsafeClearImg, colors: ["Jet Black"], basePrice: 1699, originalPrice: 2999, discount: "Save 43%", rating: 5, reviewBase: 95 },
  { seriesSlug: "softmag", image: softmagImg, hoverImage: softmagImg, colors: ["Black", "Stone", "Navy", "Orange"], basePrice: 1299, originalPrice: 1999, discount: "Save 35%", rating: 5, reviewBase: 200 },
  { seriesSlug: "armor-edge", image: armoredgeImg, hoverImage: armoredgeHoverImg, colors: ["Orange", "Black"], basePrice: 1899, originalPrice: 2999, discount: "Save 37%", rating: 5, reviewBase: 85 },
  { seriesSlug: "edgeguard", image: edgeguardImg, hoverImage: edgeguardHoverImg, colors: ["Clear"], basePrice: 699, originalPrice: 1299, discount: "Save 46%", rating: 5, reviewBase: 180 },
  { seriesSlug: "lensguard", image: lensguardImg, hoverImage: lensguardHoverImg, colors: ["Clear"], basePrice: 499, originalPrice: 999, discount: "Save 50%", rating: 5, reviewBase: 150 },
];

function generateProducts(devices: string[], defs: SeriesProductDef[]): Product[] {
  const products: Product[] = [];
  for (const device of devices) {
    for (const def of defs) {
      const series = seriesData[def.seriesSlug];
      const id = `${device.replace(/\s+/g, "-").toLowerCase()}-${def.seriesSlug}`;
      products.push({
        id,
        name: series.name,
        subtitle: `For ${device}`,
        price: `₹${def.basePrice.toLocaleString("en-IN")}`,
        originalPrice: `₹${def.originalPrice.toLocaleString("en-IN")}`,
        discount: def.discount,
        rating: def.rating,
        reviews: def.reviewBase + Math.floor(Math.random() * 200),
        image: def.image,
        hoverImage: def.hoverImage,
        colors: def.colors,
        brand: "VCASE",
        category: series.category === "cases" ? "Cases" : series.type === "screen" ? "Screen Protection" : "Camera Protection",
        device,
        series: series.name,
        seriesSlug: def.seriesSlug,
      });
    }
  }
  return products;
}

export const allProducts = generateProducts(allDeviceModels, seriesProductDefs);

// Override images for specific devices
allProducts.forEach((p) => {
  if (p.device === "iPhone 17 Pro") {
    if (p.seriesSlug === "clearmag") {
      p.image = iphone17proMagsafeClearImg;
      p.hoverImage = iphone17proMagsafeAttachImg;
    } else if (p.seriesSlug === "clearmag-edge") {
      p.image = iphone17proStrongImg;
      p.hoverImage = iphone17proMagsafeClearImg;
    } else if (p.seriesSlug === "softmag") {
      p.image = iphone17proProtectionImg;
      p.hoverImage = iphone17proFingerprintsImg;
    }
  }
  if (p.device === "iPhone 17") {
    if (p.seriesSlug === "clearmag") {
      p.image = iphone17MagsafeClearImg;
      p.hoverImage = iphone17MagsafeAttachImg;
    } else if (p.seriesSlug === "clearmag-edge") {
      p.image = iphone17StrongImg;
      p.hoverImage = iphone17MagsafeClearImg;
    } else if (p.seriesSlug === "softmag") {
      p.image = iphone17ProtectionImg;
      p.hoverImage = iphone17FingerprintsImg;
    }
  }
  if (p.device === "iPhone 16" || p.device === "iPhone 16 Pro") {
    if (p.seriesSlug === "clearmag") {
      p.image = iphone16MagsafeClearImg;
      p.hoverImage = iphone16MagsafeLifestyleImg;
    } else if (p.seriesSlug === "clearmag-edge") {
      p.image = iphone16MagsafeFeaturesImg;
      p.hoverImage = iphone16MagsafeClearImg;
    }
  }
});

// Tags
allProducts.filter((p) => p.device === "iPhone 17 Pro" && p.seriesSlug === "clearmag").forEach((p) => { p.tag = "New"; });
allProducts.filter((p) => p.device === "iPhone 16 Pro" && p.seriesSlug === "softmag").forEach((p) => { p.tag = "Bestseller"; });
allProducts.filter((p) => p.device === "iPhone 16" && p.seriesSlug === "edgeguard").forEach((p) => { p.tag = "Hot"; });

// ── Helper: get products for a series + device group ──
export function getSeriesProducts(seriesSlug: string, deviceGroupSlug: string): Product[] {
  const group = deviceSeries.find((g) => g.slug === deviceGroupSlug);
  if (!group) return [];
  const modelNames = group.models.map((m) => m.name);
  return allProducts.filter((p) => p.seriesSlug === seriesSlug && modelNames.includes(p.device));
}

// ── Helper: get products for a device group ──
export function getDeviceProducts(deviceGroupSlug: string): Product[] {
  const group = deviceSeries.find((g) => g.slug === deviceGroupSlug);
  if (!group) return [];
  const modelNames = group.models.map((m) => m.name);
  return allProducts.filter((p) => modelNames.includes(p.device));
}

// ── Grouped for homepage tabs ──
export const exploreLineupTabs: Record<string, Product[]> = {
  ClearMag: allProducts.filter((p) => p.seriesSlug === "clearmag").slice(0, 4),
  "ClearMag Edge": allProducts.filter((p) => p.seriesSlug === "clearmag-edge").slice(0, 4),
  SoftMag: allProducts.filter((p) => p.seriesSlug === "softmag").slice(0, 4),
};

export const bestSellerTabs: Record<string, Product[]> = {
  "iPhone 16": allProducts.filter((p) => p.device.includes("iPhone 16")).slice(0, 4),
  "iPhone 17": allProducts.filter((p) => p.device.includes("iPhone 17")).slice(0, 4),
};

export const newArrivalProducts = allProducts.filter((p) => p.device.includes("17")).slice(0, 6);

export const featuredProduct = {
  name: "ClearMag",
  subtitle: "For iPhone 17 Pro",
  price: "₹1,499",
  originalPrice: "₹2,499",
  rating: 5,
  reviews: 148,
  image: iphone17proMagsafeClearImg,
  colors: [
    { name: "Clear", class: "bg-gray-200", active: true },
    { name: "Jet Black", class: "bg-foreground", active: false },
  ],
  specs: [
    { label: "Material", value: "Polycarbonate + TPU" },
    { label: "Weight", value: "32g" },
    { label: "Drop Protection", value: "14.8ft" },
    { label: "MagSafe", value: "Yes" },
    { label: "Wireless Charging", value: "Compatible" },
    { label: "Compatibility", value: "iPhone 17 Pro & more" },
  ],
};

export const colorImages: Record<string, string> = {
  Black: siliconeBlackNewImg,
  Blue: siliconeBluImg,
  Pink: siliconePinkImg,
  Green: siliconeMintImg,
  Stone: leatherBrownImg,
  Navy: siliconeLifestyleNavyImg,
  Orange: siliconePinkImg,
  Clear: magsafeClearImg,
  "Jet Black": magsafeBlackImg,
  "Matte Black": magsafeBlackImg,
  "Saddle Brown": leatherBrownImg,
  "Leather Black": leatherBlackImg,
};

export const iphone17ProGalleryImages = [
  iphone17proMagsafeClearImg,
  iphone17proMagsafeAttachImg,
  iphone17proSlimImg,
  iphone17proProtectionImg,
  iphone17proStrongImg,
  iphone17proFingerprintsImg,
];

export const iphone17GalleryImages = [
  iphone17MagsafeClearImg,
  iphone17MagsafeAttachImg,
  iphone17SlimImg,
  iphone17ProtectionImg,
  iphone17StrongImg,
  iphone17FingerprintsImg,
];

export const iphone16MagsafeGalleryImages = [
  iphone16MagsafeClearImg,
  iphone16MagsafeLifestyleImg,
  iphone16MagsafeFeaturesImg,
  iphone16MagsafeGridImg,
  iphone16MagsafeDetailsImg,
];

export const siliconeGalleryImages = [
  siliconeBlackNewImg,
  siliconeMintImg,
  siliconeColorsFloatingImg,
  siliconeLifestyleGreenImg,
  siliconeLifestyleNavyImg,
  siliconeLifestyleClearImg,
];

// SoftMag color options
export const softmagColors = [
  { name: "Black", hex: "#1a1a1a", image: softmagImg },
  { name: "Stone", hex: "#a39382", image: softmagImg },
  { name: "Navy", hex: "#1e3a5f", image: softmagImg },
  { name: "Orange", hex: "#e8632b", image: softmagImg },
];
