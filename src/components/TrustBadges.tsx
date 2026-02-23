import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";

const badges = [
  { icon: Truck, title: "Free Shipping", desc: "Get free shipping on prepaid orders" },
  { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free 7 days returns" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "Easily process payments at checkout" },
  { icon: Headphones, title: "Customer Support", desc: "Quick assistance & dedicated support" },
];

const TrustBadges = () => {
  return (
    <section className="border-y border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" staggerDelay={0.1}>
          {badges.map((badge) => (
            <StaggerItem key={badge.title}>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <badge.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-semibold text-sm">{badge.title}</h3>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default TrustBadges;
