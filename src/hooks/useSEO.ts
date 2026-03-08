import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: "website" | "product";
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = "https://vcase.in";
const DEFAULT_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/075f9c68-ccba-4e4e-afac-74d9b4d95950/id-preview-784fda9e--8d0a63ad-74ba-46ce-b720-bcbf6a617fda.lovable.app-1772057944101.png";

export function useSEO({ title, description, canonical, ogImage, type = "website", jsonLd }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:image", ogImage || DEFAULT_IMAGE);
    setMeta("property", "og:url", canonical || BASE_URL);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage || DEFAULT_IMAGE);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical || BASE_URL);

    // JSON-LD
    let script = document.querySelector('script[data-seo="jsonld"]') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("data-seo", "jsonld");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }

    return () => {
      // Cleanup JSON-LD on unmount
      const s = document.querySelector('script[data-seo="jsonld"]');
      if (s) s.remove();
    };
  }, [title, description, canonical, ogImage, type, jsonLd]);
}
