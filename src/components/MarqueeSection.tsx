import { useRef, useEffect } from "react";

const items = [
  "Premium Accessories.",
  "Unbeatable Prices.",
  "Drop-Proof Design.",
  "MagSafe Ready.",
  "Same Day Shipping.",
  "Easy Returns.",
];

const MarqueeSection = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf;
    let pos = 0;
    const speed = 1.2;

    const step = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
        .marquee-text {
          font-family: 'Montserrat', sans-serif;
          font-weight: 900;
          font-size: clamp(2.8rem, 6vw, 5.5rem);
          color: #f97f06;
          line-height: 1;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
        }
        .marquee-dot {
          color: #f97f06;
          opacity: 0.35;
          margin: 0 2rem;
          font-size: clamp(1rem, 2vw, 1.8rem);
        }
      `}</style>

      <section
        style={{
          overflow: "hidden",
          padding: "2.5rem 0",
          background: "#ffffff",
          userSelect: "none",
        }}
      >
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            willChange: "transform",
            alignItems: "center",
          }}
        >
          {[0, 1].map((set) =>
            items.map((text, i) => (
              <span key={`${set}-${i}`} className="marquee-text">
                {text}
                <span className="marquee-dot">✦</span>
              </span>
            )),
          )}
        </div>
      </section>
    </>
  );
};

export default MarqueeSection;
