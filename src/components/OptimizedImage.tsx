import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  /** Skip lazy loading (for hero / above-fold images) */
  eager?: boolean;
}

const OptimizedImage = ({ src, alt, className, eager = false, ...props }: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={cn(
        "will-change-[opacity]",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ transition: "opacity 300ms cubic-bezier(0.25, 1, 0.5, 1)" }}
      {...props}
    />
  );
};

export default OptimizedImage;
