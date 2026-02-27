import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const disableMobilePinchZoom = () => {
  if (typeof window === "undefined") return;

  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) return;

  const preventDefault = (event: Event) => {
    event.preventDefault();
  };

  document.addEventListener("gesturestart", preventDefault, { passive: false });
  document.addEventListener("gesturechange", preventDefault, { passive: false });
  document.addEventListener("gestureend", preventDefault, { passive: false });
  document.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    { passive: false }
  );
};

disableMobilePinchZoom();

createRoot(document.getElementById("root")!).render(<App />);

