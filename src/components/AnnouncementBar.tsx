import { Mail, ChevronLeft, ChevronRight } from "lucide-react";

const AnnouncementBar = () => {
  return (
    <div className="bg-announcement text-announcement-foreground py-2.5 section-padding">
      <div className="flex items-center justify-between text-sm">
        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="hover:opacity-70 transition-opacity">Facebook</a>
          <a href="#" className="hover:opacity-70 transition-opacity">X</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Instagram</a>
          <a href="#" className="hover:opacity-70 transition-opacity">YouTube</a>
        </div>
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <button className="hover:opacity-70 transition-opacity"><ChevronLeft className="w-4 h-4" /></button>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>Free shipping on orders over $50</span>
          </div>
          <button className="hover:opacity-70 transition-opacity"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span>English</span>
          <span>United States (USD $)</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
