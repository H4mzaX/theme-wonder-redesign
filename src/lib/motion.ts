import type { Transition, Variants } from "framer-motion";

/* ── Easing ── */
export const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ── Springs ── */
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

export const snappySpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 0.6,
};

/* ── Micro-interactions (use with motion components) ── */

/** Subtle scale-down on tap */
export const tapScale = { scale: 0.96 };

/** Lift + shadow on hover for cards */
export const cardHover = {
  y: -6,
  transition: { type: "spring", stiffness: 300, damping: 20 } as Transition,
};

/** Button press feel */
export const buttonTap = { scale: 0.97 };
export const buttonHover = { scale: 1.02 };

/* ── Stagger variants ── */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

export const staggerFadeUp: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: premiumEase },
  },
};

/* ── Badge entrance ── */
export const badgePop: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 25, delay: 0.15 },
  },
};
