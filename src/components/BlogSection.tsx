import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
import { motion } from "framer-motion";

const posts = [
  {
    tag: "Protection",
    title: "Drop Test Results — Which Cases Survived?",
    excerpt: "We put the top-selling cases through extreme drop tests from 10 feet. The results might surprise you...",
    image: blog1,
    date: "February 15, 2026",
  },
  {
    tag: "Guides",
    title: "How to Apply a Screen Protector Perfectly",
    excerpt: "Zero bubbles, perfect alignment. Follow our step-by-step guide to flawless screen protector installation...",
    image: blog2,
    date: "February 10, 2026",
  },
  {
    tag: "New Arrivals",
    title: "2026 Case Collection — What's New",
    excerpt: "From iPhone 17 to Galaxy S26, we've got the freshest cases and accessories arriving this spring...",
    image: blog3,
    date: "February 5, 2026",
  },
];

const BlogSection = () => {
  return (
    <section className="section-padding py-20 lg:py-28">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl sm:text-4xl font-display">
            Latest<em className="italic">Stories</em>
          </h2>
          <a href="#" className="text-sm font-medium text-foreground relative group">
            View all
            <span className="absolute bottom-0 left-0 w-full h-px bg-foreground" />
            <span className="absolute bottom-0 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </a>
        </div>
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" staggerDelay={0.12}>
        {posts.map((post) => (
          <StaggerItem key={post.title}>
            <a href="#" className="group block">
              <motion.div className="rounded-lg overflow-hidden mb-4 aspect-[4/3]" whileHover="hovered">
                <motion.img src={post.image} alt={post.title} className="w-full h-full object-cover" variants={{ hovered: { scale: 1.06 } }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} />
              </motion.div>
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground">{post.tag}</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 mb-2">
                <span>{post.date}</span>
                <span>·</span>
                <span>0 comments</span>
              </div>
              <h3 className="font-display text-lg font-semibold group-hover:text-accent transition-colors duration-300">{post.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
              <span className="inline-block mt-3 text-xs font-medium text-foreground relative group/link">
                Read more
                <span className="absolute bottom-0 left-0 w-full h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </span>
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
};

export default BlogSection;
