import { useEffect } from "react";

/**
 * Prefetches route chunks after initial paint using requestIdleCallback.
 * This makes subsequent navigation near-instant.
 */
const routeImports = [
  () => import("@/pages/Collection"),
  () => import("@/pages/ProductDetail"),
  () => import("@/pages/SeriesLanding"),
  () => import("@/pages/SeriesProduct"),
  () => import("@/pages/DeviceCollection"),
];

let prefetched = false;

export function usePrefetchRoutes() {
  useEffect(() => {
    if (prefetched) return;
    prefetched = true;

    const prefetch = () => {
      // Stagger prefetches to avoid blocking main thread
      routeImports.forEach((load, i) => {
        setTimeout(() => {
          load().catch(() => {/* swallow — just a prefetch */});
        }, 2000 + i * 500);
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 5000 });
    } else {
      setTimeout(prefetch, 3000);
    }
  }, []);
}
