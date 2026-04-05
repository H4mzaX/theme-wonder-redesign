import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919876543210?text=Hi%20VCASE!%20I%20need%20help."
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-24 right-4 z-30 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:bg-green-600 hover:shadow-xl sm:bottom-6 sm:right-6 sm:w-14 sm:h-14"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="w-6 h-6" />
  </a>
);

export default WhatsAppButton;
