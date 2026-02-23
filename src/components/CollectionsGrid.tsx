import headphonesImg from "@/assets/collection-headphones.jpg";
import earphonesImg from "@/assets/collection-earphones.jpg";
import speakersImg from "@/assets/collection-speakers.jpg";
import accessoriesImg from "@/assets/collection-accessories.jpg";

const collections = [
  { name: "All products", count: 59, desc: "Check out all our products", image: headphonesImg },
  { name: "Headphones", count: 15, desc: "Surround yourself in sound", image: headphonesImg },
  { name: "Earphones", count: 8, desc: "Small design, great sound", image: earphonesImg },
  { name: "Speakers", count: 11, desc: "The world's most immersive sound", image: speakersImg },
  { name: "Accessories", count: 24, desc: "Optimal condition for years", image: accessoriesImg },
  { name: "Wireless", count: 15, desc: "Headphones to enchant instead of entangle", image: headphonesImg },
  { name: "Gaming", count: 3, desc: "Dive into the game with every sound", image: earphonesImg },
  { name: "Limited", count: 4, desc: "Collection for the exceptional", image: speakersImg },
];

const CollectionsGrid = () => {
  return (
    <section className="section-padding pb-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {collections.map((col) => (
          <a
            key={col.name}
            href="#"
            className="group relative rounded-lg overflow-hidden aspect-[3/4] block"
          >
            <img
              src={col.image}
              alt={col.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="text-background font-display text-lg sm:text-xl font-semibold">{col.name}</h3>
                <span className="text-background/70 text-sm">{col.count}</span>
              </div>
              <p className="text-background/80 text-xs sm:text-sm">{col.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CollectionsGrid;
