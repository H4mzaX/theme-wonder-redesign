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

// iPhone 17 Pro specific images (these need to be re-uploaded — currently same as iPhone 17)
import iphone17proMagsafeClearImg from "@/assets/iphone17pro-magsafe-clear.jpg";
import iphone17proSlimImg from "@/assets/iphone17pro-slim-design.jpg";
import iphone17proProtectionImg from "@/assets/iphone17pro-protection.jpg";
import iphone17proStrongImg from "@/assets/iphone17pro-strong.jpg";
import iphone17proMagsafeAttachImg from "@/assets/iphone17pro-magsafe-attach.jpg";
import iphone17proFingerprintsImg from "@/assets/iphone17pro-fingerprints.jpg";

// iPhone 17 specific images
import iphone17MagsafeClearImg from "@/assets/iphone17-magsafe-clear.jpg";
import iphone17SlimImg from "@/assets/iphone17-slim-design.jpg";
import iphone17ProtectionImg from "@/assets/iphone17-protection.jpg";
import iphone17StrongImg from "@/assets/iphone17-strong.jpg";
import iphone17MagsafeAttachImg from "@/assets/iphone17-magsafe-attach.jpg";
import iphone17FingerprintsImg from "@/assets/iphone17-fingerprints.jpg";

// iPhone 16 MagSafe specific images
import iphone16MagsafeLifestyleImg from "@/assets/iphone16-magsafe-lifestyle.jpg";
import iphone16MagsafeClearImg from "@/assets/iphone16-magsafe-clear.png";
import iphone16MagsafeFeaturesImg from "@/assets/iphone16-magsafe-features.png";
import iphone16MagsafeGridImg from "@/assets/iphone16-magsafe-grid.png";
import iphone16MagsafeDetailsImg from "@/assets/iphone16-magsafe-details.jpg";

// Samsung device-specific images
import samsungSiliconeBlueImg from "@/assets/samsung-silicone-blue.jpg";
import samsungClearCaseImg from "@/assets/samsung-clear-case.jpg";
import samsungMatteBlackImg from "@/assets/samsung-matte-black.jpg";
import samsungLeatherBrownImg from "@/assets/samsung-leather-brown.jpg";

// OnePlus device-specific images
import oneplusSiliconeBlueImg from "@/assets/oneplus-silicone-blue.jpg";
import oneplusClearCaseImg from "@/assets/oneplus-clear-case.jpg";
import oneplusMatteBlackImg from "@/assets/oneplus-matte-black.jpg";
import oneplusLeatherBrownImg from "@/assets/oneplus-leather-brown.jpg";

// iQOO device-specific images
import iqooSiliconeBlueImg from "@/assets/iqoo-silicone-blue.jpg";
import iqooClearCaseImg from "@/assets/iqoo-clear-case.jpg";
import iqooMatteBlackImg from "@/assets/iqoo-matte-black.jpg";
import iqooLeatherBrownImg from "@/assets/iqoo-leather-brown.jpg";

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
}

// ── iPhone Products ──

const iphoneDevices = [
  "iPhone 15", "iPhone 15 Pro",
  "iPhone 16", "iPhone 16 Pro",
  "iPhone 17", "iPhone 17 Pro",
];

const samsungDevices = [
  "Samsung S25", "Samsung S25 Ultra",
  "Samsung S26", "Samsung S26 Ultra",
];

const oneplusDevices = [
  "OnePlus 13", "OnePlus 13R",
  "OnePlus 14", "OnePlus 14R",
  "OnePlus 15", "OnePlus 15R",
];

const iqooDevices = ["iQOO 15R"];

function generateProducts(
  devices: string[],
  caseTypes: Array<{
    type: string;
    category: string;
    image: string;
    hoverImage?: string;
    colors: string[];
    basePrice: number;
    originalPrice: number;
    discount: string;
    rating: number;
    reviewBase: number;
  }>
): Product[] {
  const products: Product[] = [];
  for (const device of devices) {
    for (const ct of caseTypes) {
      const id = `${device.replace(/\s+/g, "-").toLowerCase()}-${ct.type.replace(/\s+/g, "-").toLowerCase()}`;
      products.push({
        id,
        name: ct.type,
        subtitle: `For ${device}`,
        price: `₹${ct.basePrice.toLocaleString("en-IN")}`,
        originalPrice: `₹${ct.originalPrice.toLocaleString("en-IN")}`,
        discount: ct.discount,
        rating: ct.rating,
        reviews: ct.reviewBase + Math.floor(Math.random() * 200),
        image: ct.image,
        hoverImage: ct.hoverImage,
        colors: ct.colors,
        brand: "VCASE",
        category: ct.category,
        device,
      });
    }
  }
  return products;
}

const caseTypes = [
  { type: "MagSafe Clear Case", category: "MagSafe Cases", image: magsafeClearImg, hoverImage: magsafeBlackImg, colors: ["Clear"], basePrice: 1499, originalPrice: 2499, discount: "Save 40%", rating: 5, reviewBase: 120 },
  { type: "MagSafe Pro Case", category: "MagSafe Cases", image: magsafeBlackImg, hoverImage: magsafeClearImg, colors: ["Jet Black"], basePrice: 1699, originalPrice: 2999, discount: "Save 43%", rating: 5, reviewBase: 95 },
  { type: "Silicone Case", category: "Silicone Cases", image: siliconeBlackNewImg, hoverImage: siliconeMintImg, colors: ["Black", "Blue", "Pink", "Green"], basePrice: 1299, originalPrice: 1999, discount: "Save 35%", rating: 5, reviewBase: 200 },
  { type: "Leather Case", category: "Leather Cases", image: leatherBrownImg, hoverImage: leatherBlackImg, colors: ["Saddle Brown", "Black"], basePrice: 1999, originalPrice: 3499, discount: "Save 43%", rating: 5, reviewBase: 80 },
];

// Samsung-specific case types
const samsungCaseTypes = [
  { type: "Silicone Case", category: "Silicone Cases", image: samsungSiliconeBlueImg, hoverImage: samsungMatteBlackImg, colors: ["Black", "Blue", "Pink", "Green"], basePrice: 1299, originalPrice: 1999, discount: "Save 35%", rating: 5, reviewBase: 150 },
  { type: "Leather Case", category: "Leather Cases", image: samsungLeatherBrownImg, hoverImage: samsungMatteBlackImg, colors: ["Saddle Brown", "Black"], basePrice: 1999, originalPrice: 3499, discount: "Save 43%", rating: 5, reviewBase: 60 },
  { type: "Clear Case", category: "Clear Cases", image: samsungClearCaseImg, hoverImage: samsungSiliconeBlueImg, colors: ["Clear"], basePrice: 1199, originalPrice: 1999, discount: "Save 40%", rating: 5, reviewBase: 100 },
  { type: "Matte Black Case", category: "Black Cases", image: samsungMatteBlackImg, hoverImage: samsungClearCaseImg, colors: ["Matte Black"], basePrice: 1399, originalPrice: 2499, discount: "Save 44%", rating: 5, reviewBase: 110 },
];

// OnePlus-specific case types
const oneplusCaseTypes = [
  { type: "Silicone Case", category: "Silicone Cases", image: oneplusSiliconeBlueImg, hoverImage: oneplusMatteBlackImg, colors: ["Black", "Blue", "Pink", "Green"], basePrice: 1299, originalPrice: 1999, discount: "Save 35%", rating: 5, reviewBase: 150 },
  { type: "Leather Case", category: "Leather Cases", image: oneplusLeatherBrownImg, hoverImage: oneplusMatteBlackImg, colors: ["Saddle Brown", "Black"], basePrice: 1999, originalPrice: 3499, discount: "Save 43%", rating: 5, reviewBase: 60 },
  { type: "Clear Case", category: "Clear Cases", image: oneplusClearCaseImg, hoverImage: oneplusSiliconeBlueImg, colors: ["Clear"], basePrice: 1199, originalPrice: 1999, discount: "Save 40%", rating: 5, reviewBase: 100 },
  { type: "Matte Black Case", category: "Black Cases", image: oneplusMatteBlackImg, hoverImage: oneplusClearCaseImg, colors: ["Matte Black"], basePrice: 1399, originalPrice: 2499, discount: "Save 44%", rating: 5, reviewBase: 110 },
];

// iQOO-specific case types
const iqooCaseTypes = [
  { type: "Silicone Case", category: "Silicone Cases", image: iqooSiliconeBlueImg, hoverImage: iqooMatteBlackImg, colors: ["Black", "Blue", "Pink", "Green"], basePrice: 1299, originalPrice: 1999, discount: "Save 35%", rating: 5, reviewBase: 150 },
  { type: "Leather Case", category: "Leather Cases", image: iqooLeatherBrownImg, hoverImage: iqooMatteBlackImg, colors: ["Saddle Brown", "Black"], basePrice: 1999, originalPrice: 3499, discount: "Save 43%", rating: 5, reviewBase: 60 },
  { type: "Clear Case", category: "Clear Cases", image: iqooClearCaseImg, hoverImage: iqooSiliconeBlueImg, colors: ["Clear"], basePrice: 1199, originalPrice: 1999, discount: "Save 40%", rating: 5, reviewBase: 100 },
  { type: "Matte Black Case", category: "Black Cases", image: iqooMatteBlackImg, hoverImage: iqooClearCaseImg, colors: ["Matte Black"], basePrice: 1399, originalPrice: 2499, discount: "Save 44%", rating: 5, reviewBase: 110 },
];

export const iphoneProducts = generateProducts(iphoneDevices, caseTypes);

// Override ALL iPhone 17 Pro product images with real product shots
iphoneProducts.forEach(p => {
  if (p.device === "iPhone 17 Pro") {
    if (p.category === "MagSafe Cases" && p.name.includes("Clear")) {
      p.image = iphone17proMagsafeClearImg;
      p.hoverImage = iphone17proMagsafeAttachImg;
    } else if (p.category === "MagSafe Cases" && p.name.includes("Pro")) {
      p.image = iphone17proStrongImg;
      p.hoverImage = iphone17proMagsafeClearImg;
    } else if (p.category === "Silicone Cases") {
      p.image = iphone17proProtectionImg;
      p.hoverImage = iphone17proFingerprintsImg;
    } else if (p.category === "Leather Cases") {
      p.image = iphone17proSlimImg;
      p.hoverImage = iphone17proMagsafeAttachImg;
    }
  }
});

// Override iPhone 17 product images with new clear case shots
iphoneProducts.forEach(p => {
  if (p.device === "iPhone 17") {
    if (p.category === "MagSafe Cases" && p.name.includes("Clear")) {
      p.image = iphone17MagsafeClearImg;
      p.hoverImage = iphone17MagsafeAttachImg;
    } else if (p.category === "MagSafe Cases" && p.name.includes("Pro")) {
      p.image = iphone17StrongImg;
      p.hoverImage = iphone17MagsafeClearImg;
    } else if (p.category === "Silicone Cases") {
      p.image = iphone17ProtectionImg;
      p.hoverImage = iphone17FingerprintsImg;
    } else if (p.category === "Leather Cases") {
      p.image = iphone17SlimImg;
      p.hoverImage = iphone17MagsafeAttachImg;
    }
  }
});

// Override iPhone 16 MagSafe product images
iphoneProducts.forEach(p => {
  if (p.device === "iPhone 16" || p.device === "iPhone 16 Pro") {
    if (p.category === "MagSafe Cases" && p.name.includes("Clear")) {
      p.image = iphone16MagsafeClearImg;
      p.hoverImage = iphone16MagsafeLifestyleImg;
    } else if (p.category === "MagSafe Cases" && p.name.includes("Pro")) {
      p.image = iphone16MagsafeFeaturesImg;
      p.hoverImage = iphone16MagsafeClearImg;
    }
  }
});

// Deduplicate products — keep only unique id entries
const deduplicateProducts = (products: Product[]): Product[] => {
  const seen = new Set<string>();
  return products.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
};
export const samsungProducts = generateProducts(samsungDevices, samsungCaseTypes);
export const oneplusProducts = generateProducts(oneplusDevices, oneplusCaseTypes);
export const iqooProducts = generateProducts(iqooDevices, iqooCaseTypes);

// Selective tags — only a few standout products, not all
// New — only iPhone 17 Pro Max MagSafe
iphoneProducts.filter(p => p.device === "iPhone 17 Pro" && p.category === "MagSafe Cases").forEach(p => { p.tag = "New"; });
// Bestseller — one top iPhone, one Samsung
iphoneProducts.filter(p => p.device === "iPhone 16 Pro" && p.category === "Silicone Cases").forEach(p => { p.tag = "Bestseller"; });
samsungProducts.filter(p => p.device === "Samsung S26 Ultra" && p.category === "Silicone Cases").forEach(p => { p.tag = "Bestseller"; });
// Hot — one OnePlus
oneplusProducts.filter(p => p.device === "OnePlus 15" && p.category === "Clear Cases").forEach(p => { p.tag = "Hot"; });
// Sale — one leather
iphoneProducts.filter(p => p.device === "iPhone 16 Pro" && p.category === "Leather Cases").forEach(p => { p.tag = "Sale"; });

export const allProducts = deduplicateProducts([...iphoneProducts, ...samsungProducts, ...oneplusProducts, ...iqooProducts]);

// ── Grouped for tabs ──

export const exploreLineupTabs: Record<string, Product[]> = {
  "MagSafe Cases": allProducts.filter(p => p.category === "MagSafe Cases").slice(0, 4),
  "Silicone Cases": allProducts.filter(p => p.category === "Silicone Cases").slice(0, 4),
  "Leather Cases": allProducts.filter(p => p.category === "Leather Cases").slice(0, 4),
};

export const bestSellerTabs: Record<string, Product[]> = {
  "iPhone Cases": iphoneProducts.slice(0, 4),
  "Samsung Cases": samsungProducts.slice(0, 4),
  "OnePlus Cases": oneplusProducts.slice(0, 4),
  "iQOO Cases": iqooProducts.slice(0, 4),
};

// New arrivals — latest iPhone 17 models
export const newArrivalProducts = iphoneProducts
  .filter(p => p.device.includes("17"))
  .slice(0, 6);

// Featured product
export const featuredProduct = {
  name: "Leather Case",
  subtitle: "For iPhone 17 Pro",
  price: "₹1,999",
  originalPrice: "₹3,499",
  rating: 5,
  reviews: 148,
  image: leatherBrownImg,
  colors: [
    { name: "Saddle Brown", class: "bg-amber-700", active: true },
    { name: "Black", class: "bg-foreground", active: false },
    { name: "Forest Green", class: "bg-green-900", active: false },
    { name: "Navy", class: "bg-blue-900", active: false },
  ],
  specs: [
    { label: "Material", value: "Leather" },
    { label: "Weight", value: "42g" },
    { label: "Drop Protection", value: "6ft" },
    { label: "MagSafe", value: "Yes" },
    { label: "Wireless Charging", value: "Compatible" },
    { label: "Compatibility", value: "iPhone 17 Pro & more" },
  ],
};

// Color variant images for reference
export const colorImages: Record<string, string> = {
  "Black": siliconeBlackNewImg,
  "Blue": siliconeBluImg,
  "Pink": siliconePinkImg,
  "Green": siliconeMintImg,
  "Saddle Brown": leatherBrownImg,
  "Leather Black": leatherBlackImg,
  "Clear": magsafeClearImg,
  "Jet Black": magsafeBlackImg,
  "Matte Black": magsafeBlackImg,
};

// iPhone 17 Pro gallery images for product detail page
export const iphone17ProGalleryImages = [
  iphone17proMagsafeClearImg,
  iphone17proMagsafeAttachImg,
  iphone17proSlimImg,
  iphone17proProtectionImg,
  iphone17proStrongImg,
  iphone17proFingerprintsImg,
];

// iPhone 17 gallery images for product detail page
export const iphone17GalleryImages = [
  iphone17MagsafeClearImg,
  iphone17MagsafeAttachImg,
  iphone17SlimImg,
  iphone17ProtectionImg,
  iphone17StrongImg,
  iphone17FingerprintsImg,
];

// Silicone gallery images for product detail
export const siliconeGalleryImages = [
  siliconeBlackNewImg,
  siliconeMintImg,
  siliconeColorsFloatingImg,
  siliconeLifestyleGreenImg,
  siliconeLifestyleNavyImg,
  siliconeLifestyleClearImg,
];
