import { useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import heroVideo from "@/assets/hero-video.mp4";
import heroPoster from "@/assets/hero-3-poster.jpg";
import featuredImg from "@/assets/featured-headphones.jpg";
import airbeatsImg from "@/assets/product-airbeats.jpg";
import rhythmiqImg from "@/assets/product-rhythmiq.jpg";
import soundrollImg from "@/assets/product-soundroll.jpg";

const videoProducts = [
  {
    video: heroVideo,
    poster: heroPoster,
    productName: "Clear Pro Lens",
    productImage: featuredImg,
    tagline: "Unmatched Clarity",
    href: "#",
  },
  {
    video: heroVideo,
    poster: heroPoster,
    productName: "Modern Leatherite Case",
    productImage: airbeatsImg,
    tagline: "Premium Texture",
    href: "#",
  },
  {
    video: heroVideo,
    poster: heroPoster,
    productName: "Snap Fit Case",
    productImage: rhythmiqImg,
    tagline: "Smooth Microfiber Inside",
    href: "#",
  },
  {
    video: heroVideo,
    poster: heroPoster,
    productName: "Grip Armour Case",
    productImage: soundrollImg,
    tagline: "12 Feet Protection",
    href: "#",
  },
];

const WatchAndShop = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Watch and Shop</h2>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </ScrollReveal>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videoProducts.map((item, idx) => (
          <div
            key={idx}
            className="flex-none w-[260px] sm:w-[300px] snap-start"
          >
            <a href={item.href} className="group block">
              <div className="relative rounded-2xl overflow-hidden aspect-[9/16] mb-3">
                <video
                  src={item.video}
                  poster={item.poster}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                />
                <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors" />
                
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                  <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.tagline}</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WatchAndShop;
