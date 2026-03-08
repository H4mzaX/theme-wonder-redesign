import React, { forwardRef } from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/** Premium thin-line hamburger — 3 lines with elegant spacing */
export const MenuIcon = forwardRef<SVGSVGElement, IconProps>(({ size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...props}>
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="16" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
));
MenuIcon.displayName = "MenuIcon";

/** Premium search — thin circle with angled line */
export const SearchIcon = forwardRef<SVGSVGElement, IconProps>(({ size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="15.5" y1="15.5" x2="20" y2="20" />
  </svg>
));
SearchIcon.displayName = "SearchIcon";

/** Premium user — minimal head + shoulders silhouette */
export const UserIcon = forwardRef<SVGSVGElement, IconProps>(({ size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.418 3.582-7 8-7s8 2.582 8 7" />
  </svg>
));
UserIcon.displayName = "UserIcon";

/** Premium cart — minimal tote bag outline */
export const CartIcon = forwardRef<SVGSVGElement, IconProps>(({ size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
));
CartIcon.displayName = "CartIcon";
