import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowUp } from "lucide-react";

interface FloatingNavPillProps {
  sections: { id: string; label: string }[];
}

/**
 * Concept Theme style inline pill navigation.
 * Sits inline between product info and content, becomes sticky on scroll.
 */
const FloatingNavPill = ({ sections }: FloatingNavPillProps) => {
  const [activeSection, setActiveSection] = useState("");
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i].id);
            return;
          }
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <div
      ref={pillRef}
      className="sticky top-[56px] sm:top-[60px] z-[55] py-3 sm:py-4 flex justify-center bg-background"
    >
      <div className="flex items-center gap-0.5 bg-secondary/40 border border-border/40 rounded-full px-1 py-1 shadow-sm w-fit">
        {/* Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-background transition-colors flex-shrink-0"
        >
          <ArrowUp className="w-3.5 h-3.5 text-foreground" />
        </button>

        {/* Section links */}
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[12px] font-semibold transition-all whitespace-nowrap ${
              activeSection === section.id
                ? "bg-foreground text-background"
                : "text-foreground hover:bg-background"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FloatingNavPill;