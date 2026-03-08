import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AnnouncementBar from "@/components/AnnouncementBar";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { useSEO } from "@/hooks/useSEO";

const RefundPolicy = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useSEO({
    title: "Refund & Return Policy | VCASE",
    description: "VCASE refund and return policy. Learn about our hassle-free returns, replacement guarantee, and refund process for phone cases and protection.",
    canonical: "https://vcase.in/refund-policy",
  });

  return (
    <div className="min-h-screen bg-announcement text-foreground">
      <AnnouncementBar />
      <div className="bg-background rounded-t-[1.75rem] sm:rounded-t-[1.25rem] lg:rounded-t-[0.625rem] overflow-x-clip">
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-24 pb-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Refund Policy</h1>
            <p className="text-muted-foreground mb-10">Last updated: March 2026</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="prose prose-sm max-w-none space-y-8 text-foreground/80">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">1. Returns</h2>
                <p>We accept returns within 7 days of delivery. To be eligible for a return, the item must be unused, in its original packaging, and in the same condition as received.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">2. Refund Process</h2>
                <p>Once we receive and inspect your return, we will notify you via email. If approved, your refund will be processed within 5–7 business days to the original payment method.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">3. Non-Refundable Items</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Products purchased during flash sales or clearance</li>
                  <li>Customized or personalized items</li>
                  <li>Items damaged due to misuse by the buyer</li>
                  <li>Screen protectors once opened</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">4. Exchanges</h2>
                <p>We offer exchanges for defective or damaged products. Contact us within 48 hours of delivery with photos of the damage. We will arrange a replacement at no extra cost.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">5. Cancellations</h2>
                <p>Orders can be cancelled within 12 hours of placement. Once the order has been dispatched, it cannot be cancelled and will be subject to the return policy.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">6. Shipping Costs</h2>
                <p>Return shipping costs are borne by the customer unless the return is due to a defective or incorrect product. In such cases, VCASE will cover the return shipping.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">7. Contact Us</h2>
                <p>For any refund or return queries, reach out to us at support@vcase.in or through our Contact Us page.</p>
              </section>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default RefundPolicy;
