import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import ShopifyProductCard from "@/components/ShopifyProductCard";

const ShopifyProductsSection = () => {
  const { products, loading, error } = useShopifyProducts(26);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    el.addEventListener("scroll", updateScroll, { passive: true });
    return () => el.removeEventListener("scroll", updateScroll);
  }, [products]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.7 : el.clientWidth * 0.7, behavior: "smooth" });
  };

  if (error) return null;

  return (
    <section className="py-5 sm:py-6 lg:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <ScrollReveal className="mb-3 sm:mb-4 lg:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight text-foreground text-center">
            Shop All Products
          </h2>
        </ScrollReveal>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.map((product) => (
                <div key={product.node.id} className="flex-none w-[calc(50vw-22px)] sm:w-[calc(50vw-28px)] md:w-[260px] lg:w-[280px] snap-start">
                  <ShopifyProductCard product={product} />
                </div>
              ))}
            </div>

            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="hidden md:flex absolute left-2 lg:-left-2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-background border border-border shadow-md hover:bg-muted transition-colors z-10"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="hidden md:flex absolute right-2 lg:-right-2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-background border border-border shadow-md hover:bg-muted transition-colors z-10"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopifyProductsSection;
