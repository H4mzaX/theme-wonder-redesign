import casesImg from "@/assets/collection-headphones.jpg";
import protectorsImg from "@/assets/collection-earphones.jpg";
import ruggedImg from "@/assets/collection-speakers.jpg";
import accessoriesImg from "@/assets/collection-accessories.jpg";
import { StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
import { motion } from "framer-motion";

const collections = [
  { name: "All products", count: 84, desc: "Browse our full catalog", image: casesImg },
  { name: "iPhone Cases", count: 24, desc: "Premium protection for iPhone", image: casesImg },
  { name: "Screen Protectors", count: 18, desc: "Crystal clear defense", image: protectorsImg },
  { name: "Samsung Cases", count: 20, desc: "Galaxy protection perfected", image: ruggedImg },
  { name: "OnePlus Cases", count: 10, desc: "Never settle on protection", image: accessoriesImg },
  { name: "Rugged Cases", count: 12, desc: "Military-grade toughness", image: ruggedImg },
  { name: "Clear Cases", count: 15, desc: "Show off your phone's design", image: casesImg },
  { name: "Accessories", count: 30, desc: "Grips, mounts & more", image: accessoriesImg },
];

const CollectionsGrid = () => {
  return (
    <section className="section-padding pb-20">
      <StaggerContainer
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        staggerDelay={0.06}
      >
        {collections.map((col) => (
          <StaggerItem key={col.name}>
            <a href="#" className="group relative rounded-lg overflow-hidden aspect-[3/4] block">
              <motion.img
                src={col.image}
                alt={col.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              />
              <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/45 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <motion.div initial={{ y: 0 }} whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-background font-display text-lg sm:text-xl font-semibold">{col.name}</h3>
                    <span className="text-background/70 text-sm">{col.count}</span>
                  </div>
                  <p className="text-background/80 text-xs sm:text-sm">{col.desc}</p>
                </motion.div>
              </div>
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
};

export default CollectionsGrid;
