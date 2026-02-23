import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const posts = [
  {
    tag: "Speakers",
    title: "Eco-Audio — Sustainable Sound",
    excerpt: "The realm of audio has witnessed incredible advancements over the past decade. As we venture further into this era of technological marvels...",
    image: blog1,
    date: "October 9, 2023",
  },
  {
    tag: "Headphones",
    title: "Inside In-Ear Excellence",
    excerpt: "In the audio tech world, there's always room for innovation. But, there are few moments when a product redefines expectations...",
    image: blog2,
    date: "October 9, 2023",
  },
  {
    tag: "News & Events",
    title: "The International Sound Artistry Conference",
    excerpt: "This year's AudioTech Expo in Los Angeles was nothing short of sensational. The air buzzed with anticipation and excitement...",
    image: blog3,
    date: "October 9, 2023",
  },
];

const BlogSection = () => {
  return (
    <section className="section-padding py-20 lg:py-28">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl sm:text-4xl font-display">
          Latest<em className="italic">Stories</em>
        </h2>
        <a
          href="#"
          className="text-sm font-medium text-foreground border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors"
        >
          View all
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {posts.map((post) => (
          <a key={post.title} href="#" className="group block">
            <div className="rounded-lg overflow-hidden mb-4 aspect-[4/3]">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground">{post.tag}</span>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 mb-2">
              <span>{post.date}</span>
              <span>·</span>
              <span>0 comments</span>
            </div>
            <h3 className="font-display text-lg font-semibold group-hover:text-accent transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
