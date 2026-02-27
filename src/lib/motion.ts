import type { Transition } from "framer-motion";

export const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 28,
  mass: 0.85,
};

export const drawerSpring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.85,
};
