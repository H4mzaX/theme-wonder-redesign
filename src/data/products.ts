import magsafeClearImg from "@/assets/case-magsafe-clear.jpg";
import magsafeBlackImg from "@/assets/case-magsafe-black.jpg";
import siliconeBluImg from "@/assets/case-silicone-blue.jpg";
import siliconePinkImg from "@/assets/case-silicone-pink.jpg";
import siliconeGreenImg from "@/assets/case-silicone-green.jpg";
import siliconeBlackImg from "@/assets/case-silicone-black.jpg";
import leatherBrownImg from "@/assets/case-leather-brown.jpg";
import leatherBlackImg from "@/assets/case-leather-black.jpg";

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
  colors: string[];
  tag?: string;
  brand: string;
  category: string;
  device: string;
}

// ── iPhone Products ──

const iphoneDevices = [
  "iPhone 15", "iPhone 15 Pro", "iPhone 15 Pro Max",
  "iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max",
  "iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max",
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
  { type: "MagSafe Clear Case", category: "MagSafe Cases", image: magsafeClearImg, colors: ["Clear"], basePrice: 1499, originalPrice: 2499, discount: "Save 40%", rating: 5, reviewBase: 120 },
  { type: "MagSafe Black Case", category: "MagSafe Cases", image: magsafeBlackImg, colors: ["Jet Black"], basePrice: 1699, originalPrice: 2999, discount: "Save 43%", rating: 5, reviewBase: 95 },
  { type: "Silicone Snap Case", category: "Silicone Cases", image: siliconeBlackImg, colors: ["Black", "Blue", "Pink", "Green"], basePrice: 1299, originalPrice: 1999, discount: "Save 35%", rating: 5, reviewBase: 200 },
  { type: "Premium Leather Case", category: "Leather Cases", image: leatherBrownImg, colors: ["Saddle Brown", "Black"], basePrice: 1999, originalPrice: 3499, discount: "Save 43%", rating: 5, reviewBase: 80 },
];

// Samsung-specific case types
const samsungCaseTypes = [
  { type: "Silicone Snap Case", category: "Silicone Cases", image: samsungSiliconeBlueImg, colors: ["Black", "Blue", "Pink", "Green"], basePrice: 1299, originalPrice: 1999, discount: "Save 35%", rating: 5, reviewBase: 150 },
  { type: "Premium Leather Case", category: "Leather Cases", image: samsungLeatherBrownImg, colors: ["Saddle Brown", "Black"], basePrice: 1999, originalPrice: 3499, discount: "Save 43%", rating: 5, reviewBase: 60 },
  { type: "Clear Armor Case", category: "Clear Cases", image: samsungClearCaseImg, colors: ["Clear"], basePrice: 1199, originalPrice: 1999, discount: "Save 40%", rating: 5, reviewBase: 100 },
  { type: "Matte Black Case", category: "Black Cases", image: samsungMatteBlackImg, colors: ["Matte Black"], basePrice: 1399, originalPrice: 2499, discount: "Save 44%", rating: 5, reviewBase: 110 },
];

// OnePlus-specific case types
const oneplusCaseTypes = [
  { type: "Silicone Snap Case", category: "Silicone Cases", image: oneplusSiliconeBlueImg, colors: ["Black", "Blue", "Pink", "Green"], basePrice: 1299, originalPrice: 1999, discount: "Save 35%", rating: 5, reviewBase: 150 },
  { type: "Premium Leather Case", category: "Leather Cases", image: oneplusLeatherBrownImg, colors: ["Saddle Brown", "Black"], basePrice: 1999, originalPrice: 3499, discount: "Save 43%", rating: 5, reviewBase: 60 },
  { type: "Clear Armor Case", category: "Clear Cases", image: oneplusClearCaseImg, colors: ["Clear"], basePrice: 1199, originalPrice: 1999, discount: "Save 40%", rating: 5, reviewBase: 100 },
  { type: "Matte Black Case", category: "Black Cases", image: oneplusMatteBlackImg, colors: ["Matte Black"], basePrice: 1399, originalPrice: 2499, discount: "Save 44%", rating: 5, reviewBase: 110 },
];

// iQOO-specific case types
const iqooCaseTypes = [
  { type: "Silicone Snap Case", category: "Silicone Cases", image: iqooSiliconeBlueImg, colors: ["Black", "Blue", "Pink", "Green"], basePrice: 1299, originalPrice: 1999, discount: "Save 35%", rating: 5, reviewBase: 150 },
  { type: "Premium Leather Case", category: "Leather Cases", image: iqooLeatherBrownImg, colors: ["Saddle Brown", "Black"], basePrice: 1999, originalPrice: 3499, discount: "Save 43%", rating: 5, reviewBase: 60 },
  { type: "Clear Armor Case", category: "Clear Cases", image: iqooClearCaseImg, colors: ["Clear"], basePrice: 1199, originalPrice: 1999, discount: "Save 40%", rating: 5, reviewBase: 100 },
  { type: "Matte Black Case", category: "Black Cases", image: iqooMatteBlackImg, colors: ["Matte Black"], basePrice: 1399, originalPrice: 2499, discount: "Save 44%", rating: 5, reviewBase: 110 },
];

export const iphoneProducts = generateProducts(iphoneDevices, caseTypes);
export const samsungProducts = generateProducts(samsungDevices, samsungCaseTypes);
export const oneplusProducts = generateProducts(oneplusDevices, oneplusCaseTypes);
export const iqooProducts = generateProducts(iqooDevices, iqooCaseTypes);

export const allProducts = [...iphoneProducts, ...samsungProducts, ...oneplusProducts, ...iqooProducts];

// ── Grouped for tabs ──

export const exploreLineupTabs: Record<string, Product[]> = {
  "MagSafe Cases": allProducts.filter(p => p.category === "MagSafe Cases").slice(0, 4),
  "Silicone Cases": allProducts.filter(p => p.category === "Silicone Cases").slice(0, 4),
  "Leather Cases": allProducts.filter(p => p.category === "Leather Cases").slice(0, 4),
};

export const bestSellerTabs: Record<string, Product[]> = {
  "iPhone Cases": iphoneProducts.slice(0, 4).map((p, i) => ({ ...p, tag: i === 0 ? "Best Seller" : undefined })),
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
  name: "Premium Leather Case",
  subtitle: "For iPhone 17 Pro Max",
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
    { label: "Compatibility", value: "iPhone 17 Pro" },
  ],
};

// Color variant images for reference
export const colorImages: Record<string, string> = {
  "Black": siliconeBlackImg,
  "Blue": siliconeBluImg,
  "Pink": siliconePinkImg,
  "Green": siliconeGreenImg,
  "Saddle Brown": leatherBrownImg,
  "Leather Black": leatherBlackImg,
  "Clear": magsafeClearImg,
  "Jet Black": magsafeBlackImg,
  "Matte Black": magsafeBlackImg,
};
