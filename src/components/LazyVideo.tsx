import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LazyVideoProps {
  src: string;
  className?: string;
  poster?: string;
}

const LazyVideo = ({ src, className, poster }: LazyVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.src = src;
      videoRef.current.load();
    }
  }, [isVisible, src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      onCanPlay={() => setLoaded(true)}
      className={cn(
        "transition-opacity duration-500 ease-out",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
    />
  );
};

export default LazyVideo;
