import type { Transition, Variants } from "framer-motion";

/* ── Easing — Concept Theme Signature ── */
/** Expo-out: fast start, feather-soft landing — the premium feel */
export const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const smoothEase: [number, number, number, number] = [0.7, 0, 0.3, 1];

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

/** Magnetic interactions — elastic but not bouncy */
export const magnetSpring: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 15,
  mass: 0.1,
};

/* ── Micro-interactions ── */
export const tapScale = { scale: 0.96 };
export const cardHover = {
  y: -6,
  transition: { type: "spring", stiffness: 300, damping: 20 } as Transition,
};
export const buttonTap = { scale: 0.97 };
export const buttonHover = { scale: 1.02 };

/* ── Stagger variants (Concept Theme) ── */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export const staggerFadeUp: Variants = {
  hidden: { opacity: 0, y: "2.5rem" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.075, 0.82, 0.165, 1] },
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

/* ── Modal / Overlay ── */
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: [0.3, 1, 0.3, 1] } },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: expoOut } },
};

/* ── Drawer menu stagger ── */
export const drawerMenuVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const drawerItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.075, 0.82, 0.165, 1] } },
};
