import { useEffect, useRef, useCallback } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

interface ProductLightboxProps {
  images: string[];
  startIndex?: number;
  galleryId?: string;
}

const ProductLightbox = ({ images, startIndex = 0, galleryId = "product-gallery" }: ProductLightboxProps) => {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: "a",
      pswpModule: () => import("photoswipe"),
      bgOpacity: 0.92,
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      showHideAnimationType: "zoom",
      zoom: true,
      pinchToClose: true,
      closeOnVerticalDrag: true,
    });

    lightbox.init();
    lightboxRef.current = lightbox;

    return () => {
      lightbox.destroy();
      lightboxRef.current = null;
    };
  }, [galleryId]);

  const openAt = useCallback((index: number) => {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;
    const links = gallery.querySelectorAll("a");
    if (links[index]) {
      (links[index] as HTMLElement).click();
    }
  }, [galleryId]);

  return (
    <div id={galleryId} className="hidden">
      {images.map((src, i) => (
        <a
          key={i}
          href={src}
          data-pswp-width="1200"
          data-pswp-height="1200"
          target="_blank"
          rel="noreferrer"
        >
          <img src={src} alt="" />
        </a>
      ))}
    </div>
  );
};

export { ProductLightbox };
export type { ProductLightboxProps };
