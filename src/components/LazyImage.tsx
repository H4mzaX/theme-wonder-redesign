import { useState } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
}

const LazyImage = ({ src, alt, className = "", imgClassName = "", loading = "lazy" }: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-full object-cover will-change-[opacity,transform]",
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]",
          imgClassName
        )}
        style={{ transition: "opacity 400ms cubic-bezier(0.25, 1, 0.5, 1), transform 500ms cubic-bezier(0.25, 1, 0.5, 1)" }}
      />
    </div>
  );
};

export default LazyImage;
