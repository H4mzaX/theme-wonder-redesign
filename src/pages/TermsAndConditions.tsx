import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AnnouncementBar from "@/components/AnnouncementBar";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { useSEO } from "@/hooks/useSEO";

const TermsAndConditions = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useSEO({
    title: "Terms & Conditions | VCASE",
    description: "Read the terms and conditions for using VCASE products and services. Shipping, warranty, and usage policies.",
    canonical: "https://vcase.in/terms",
  });

  return (
    <div className="min-h-screen bg-announcement text-foreground">
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-24 pb-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms and Conditions</h1>
            <p className="text-muted-foreground mb-10">Last updated: March 2026</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="prose prose-sm max-w-none space-y-8 text-foreground/80">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">1. Introduction</h2>
                <p>Welcome to VCASE ("we", "our", "us"). By accessing or using our website www.vcase.in, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">2. Use of Website</h2>
                <p>You agree to use this website only for lawful purposes and in a manner that does not infringe on the rights of others. You must not misuse our website by knowingly introducing viruses or other malicious material.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">3. Products and Pricing</h2>
                <p>All products listed on our website are subject to availability. We reserve the right to modify prices without prior notice. Product images are for illustration purposes and may differ slightly from the actual product.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">4. Orders and Payment</h2>
                <p>By placing an order, you confirm that the information you provide is accurate. We reserve the right to cancel any order at our sole discretion. Payment must be made in full before order dispatch.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">5. Shipping and Delivery</h2>
                <p>We aim to dispatch orders within 1–3 business days. Delivery timelines depend on your location and the shipping method selected. We are not responsible for delays caused by courier services or unforeseen circumstances.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">6. Intellectual Property</h2>
                <p>All content on this website, including images, text, logos, and designs, is the property of VCASE and is protected by intellectual property laws. You may not reproduce, distribute, or use any content without written permission.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
                <p>VCASE shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid for the product in question.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">8. Changes to Terms</h2>
                <p>We reserve the right to update these Terms and Conditions at any time. Continued use of the website after changes constitutes acceptance of the updated terms.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">9. Contact</h2>
                <p>If you have questions about these terms, please contact us at support@vcase.in.</p>
              </section>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default TermsAndConditions;
