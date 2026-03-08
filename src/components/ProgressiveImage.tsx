import { useState, useRef, useEffect, memo } from "react";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  /** Skip lazy loading for above-fold images */
  eager?: boolean;
  /** Root margin for IntersectionObserver (px before viewport) */
  rootMargin?: string;
}

/**
 * High-performance image component:
 * - Uses native IntersectionObserver to defer off-screen images
 * - CSS blur-up placeholder transition (no JS paint)
 * - Uses content-visibility: auto for off-screen rendering skip
 * - Leverages fetchpriority="high" for eager images
 */
const ProgressiveImage = memo(({
  src,
  alt,
  className,
  eager = false,
  rootMargin = "300px",
  ...props
}: ProgressiveImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(eager);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // IntersectionObserver for deferred rendering
  useEffect(() => {
    if (eager) {
      setShouldRender(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [eager, rootMargin]);

  // Check if image is already cached
  useEffect(() => {
    if (shouldRender && imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [shouldRender, src]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{ contentVisibility: eager ? "visible" : "auto" }}
    >
      {/* Placeholder shimmer */}
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {shouldRender && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding={eager ? "sync" : "async"}
          fetchPriority={eager ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-all duration-500 ease-out",
            loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-sm scale-[1.02]",
          )}
          {...props}
        />
      )}
    </div>
  );
});

ProgressiveImage.displayName = "ProgressiveImage";

export default ProgressiveImage;
