import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AnnouncementBar from "@/components/AnnouncementBar";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const ContactUs = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useSEO({
    title: "Contact Us | VCASE",
    description: "Get in touch with VCASE for support, orders, or inquiries. Email veecartretail@gmail.com or visit our store in Vijayanagara, Karnataka.",
    canonical: "https://vcase.in/contact",
  });

  return (
    <div className="min-h-screen bg-announcement text-foreground">
      <AnnouncementBar />
      <div className="bg-background rounded-t-[2rem] sm:rounded-t-[2.5rem] lg:rounded-t-[3rem] overflow-x-clip">
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-24 pb-16">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-muted-foreground mb-10">We'd love to hear from you. Reach out anytime.</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            <ScrollReveal>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">veecartretail@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-sm text-muted-foreground">+91 XXXXX XXXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-sm text-muted-foreground">VeeCart Retail<br />Shop No 2, Main Bazar,<br />Vijayanagara, Karnataka</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-sm text-muted-foreground">Mon – Sat: 10 AM – 7 PM IST</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Name</label>
                  <input type="text" placeholder="Your name" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input type="email" placeholder="your@email.com" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Message</label>
                  <textarea rows={5} placeholder="How can we help?" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" />
                </div>
                <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Send Message
                </button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default ContactUs;
