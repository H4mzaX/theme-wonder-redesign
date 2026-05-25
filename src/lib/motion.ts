import type { Transition, Variants } from "framer-motion";

/* ── Easing — Concept Theme Signature ── */
/** Expo-out: fast start, feather-soft landing — the premium feel */
export const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const primaryEase: [number, number, number, number] = [0.3, 1, 0.3, 1];
export const smoothEase: [number, number, number, number] = [0.7, 0, 0.3, 1];
export const navEase: [number, number, number, number] = [0.6, 0, 0.4, 1];
/** Concept theme's signature ease — snappy yet smooth */
export const conceptEase: [number, number, number, number] = [0.25, 1, 0.5, 1];

/* ── Springs — tightened for snappier feel ── */
export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 24,
  mass: 0.75,
};

export const drawerSpring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.7,
};

export const snappySpring: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 22,
  mass: 0.45,
};

/** Magnetic interactions — elastic but not bouncy */
export const magnetSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 18,
  mass: 0.08,
};

/* ── Micro-interactions — tighter timings ── */
export const tapScale = { scale: 0.97 };
export const cardHover = {
  y: -5,
  transition: { type: "spring", stiffness: 360, damping: 22 } as Transition,
};
export const buttonTap = { scale: 0.97 };
export const buttonHover = { scale: 1.02 };

/* ── Stagger variants — faster cascade ── */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.175 },
  },
};

export const staggerFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5, ease: expoOut },
  },
};

/* ── Badge entrance ── */
export const badgePop: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 25, delay: 0.1 },
  },
};

/* ── Modal / Overlay — faster open/close ── */
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: conceptEase } },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: conceptEase } },
};

/* ── Drawer menu stagger — snappier ── */
export const drawerMenuVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export const drawerItemVariants: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: conceptEase } },
};
