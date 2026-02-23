import lookbookImg from "@/assets/lookbook.jpg";

const LookbookSection = () => {
  return (
    <section className="section-padding py-20">
      <div className="text-center mb-12">
        <p className="text-sm tracking-widest text-muted-foreground uppercase mb-3">Premium Speakers</p>
        <h2 className="text-3xl sm:text-4xl font-display">
          Bring Quality Sound into <em className="italic">Your Home</em>
        </h2>
      </div>
      <div className="rounded-lg overflow-hidden">
        <img
          src={lookbookImg}
          alt="Premium speakers in luxury living room"
          className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover"
        />
      </div>
    </section>
  );
};

export default LookbookSection;
