import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { fetchFeaturedProducts } from "@/lib/shopify/fetchFeaturedProducts";
import ProductCard from "@/components/ProductCard";

const NewArrivals = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Shopify
  useEffect(() => {
    fetchFeaturedProducts(8)
      .then(data => {
        // Transform Shopify data to match ProductCard format
        const transformedProducts = data.map(({ node }: any) => ({
          id: node.id,
          name: node.title,
          subtitle: node.description?.substring(0, 50) || 'Premium Protection',
          device: node.tags.find((tag: string) => tag.startsWith('device:'))?.replace('device:', '') || 'iPhone',
          category: node.tags.find((tag: string) => tag.startsWith('category:'))?.replace('category:', '') || 'Cases',
          price: `₹${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(0)}`,
          originalPrice: node.tags.find((tag: string) => tag.startsWith('original:'))?.replace('original:', '') || undefined,
          image: node.images.edges[0]?.node.url || '',
          hoverImage: node.images.edges[1]?.node.url || node.images.edges[0]?.node.url,
          rating: 4.8,
          colors: node.tags.filter((tag: string) => tag.startsWith('color:')).map((tag: string) => tag.replace('color:', '')) || ['Default'],
          badge: node.tags.includes('new') ? 'New' : undefined,
          availableForSale: node.availableForSale,
          handle: node.handle
        }));
        setProducts(transformedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        setLoading(false);
      });
  }, []);

  const totalCards = products.length;
  const segments = Math.ceil(totalCards / 2);

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      const progress = el.scrollLeft / maxScroll;
      setActiveIndex(Math.min(Math.round(progress * (segments - 1)), segments - 1));
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    el.addEventListener("scroll", updateScroll, { passive: true });
    return () => el.removeEventListener("scroll", updateScroll);
  }, [segments]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.7 : el.clientWidth * 0.7, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="py-5 sm:py-6 lg:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight italic text-foreground text-center mb-6">
            New Arrivals
          </h2>
          <div className="text-center text-muted-foreground">Loading products...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-5 sm:py-6 lg:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <ScrollReveal className="mb-3 sm:mb-4 lg:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight italic text-foreground text-center">
            New Arrivals
          </h2>
        </ScrollReveal>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-none w-[calc(50vw-22px)] sm:w-[calc(50vw-28px)] md:w-[260px] lg:w-[280px] snap-start">
                <ProductCard product={product} />
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
      </div>

      {segments > 0 && (
        <div className="flex gap-1.5 mx-auto mt-3 sm:mt-4 max-w-[260px] sm:max-w-[320px] px-4">
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                i <= activeIndex ? "bg-foreground" : "bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
