import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const enforceFixedMobileViewport = () => {
  if (typeof document === "undefined") return;

  const desiredViewport = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
  let viewportMeta = document.querySelector('meta[name="viewport"]');

  if (!viewportMeta) {
    viewportMeta = document.createElement("meta");
    viewportMeta.setAttribute("name", "viewport");
    document.head.appendChild(viewportMeta);
  }

  viewportMeta.setAttribute("content", desiredViewport);
};

const disableMobilePinchZoom = () => {
  if (typeof window === "undefined") return;

  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) return;

  const preventGesture = (event: Event) => event.preventDefault();

  document.addEventListener("gesturestart", preventGesture, { passive: false });
  document.addEventListener("gesturechange", preventGesture, { passive: false });
  document.addEventListener("gestureend", preventGesture, { passive: false });

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

enforceFixedMobileViewport();
disableMobilePinchZoom();

createRoot(document.getElementById("root")!).render(<App />);

