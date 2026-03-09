import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const BaseIcon = ({ size = 48, children, ...props }: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {children}
  </svg>
);

/** Minimal MagSafe / magnet */
export const MagnetIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    {/* Background Circle */}
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.05" />
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.3" />
    
    {/* MagSafe Ring */}
    <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.9" />
    <path d="M24 36v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Inner details */}
    <circle cx="24" cy="24" r="5" fill="currentColor" fillOpacity="0.2" />
    <path d="M22 24l2-3v3h2l-2 3v-3h-2z" fill="currentColor" />
  </BaseIcon>
);

/** Drop protection / shield */
export const DropShieldIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.05" />
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" />
    
    {/* Phone outline */}
    <rect x="15" y="10" width="18" height="28" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
    
    {/* Shockwaves at bottom corners */}
    <path d="M10 38c2 2 5 2 7 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M7 41c4 3 9 3 13 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    
    <path d="M38 38c-2 2-5 2-7 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M41 41c-4 3-9 3-13 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    
    <path d="M24 13h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </BaseIcon>
);

/** Crystal clarity / anti-yellow */
export const CrystalIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.05" />
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.3" />
    
    {/* Crystal Diamond Shape */}
    <path d="M24 10l9 9-9 19-9-19 9-9z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" strokeLinejoin="round" />
    <path d="M15 19h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 10v28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    
    {/* Sparkles */}
    <path d="M34 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" fill="currentColor" opacity="0.8" />
    <path d="M12 28l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z" fill="currentColor" opacity="0.6" />
  </BaseIcon>
);

/** Fingerprint / smudge resistance */
export const FingerprintIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.05" />
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.3" />
    
    {/* Fingerprint abstract */}
    <path d="M24 14c-4.5 0-8 3.5-8 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 18c-2 0-3.5 1.5-3.5 3.5v5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 14c2.5 0 5 1.5 6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 18c2 0 3.5 1.5 3.5 3.5v8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 30c0 2.5 2 4.5 4.5 4.5 1.5 0 2.8-.8 3.5-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    
    {/* Anti-slash or sparkles */}
    <path d="M32 30l2 2m0-2l-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M12 16l1.5 1.5m0-1.5L12 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </BaseIcon>
);

/** Grip / texture */
export const GripIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.05" />
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" strokeOpacity="0.3" />
    
    {/* Texture pattern */}
    <rect x="14" y="12" width="20" height="24" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
    
    {/* Grip lines on sides */}
    <path d="M10 18h4m-4 6h4m-4 6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M34 18h4m-4 6h4m-4 6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    
    {/* Interior grid */}
    <path d="M20 12v24M28 12v24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
    <path d="M14 20h20M14 28h20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
  </BaseIcon>
);

/** Camera protection */
export const CameraIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.05" />
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.3" />
    
    {/* Camera Bump */}
    <rect x="13" y="14" width="22" height="20" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
    
    {/* Lenses */}
    <circle cx="19" cy="24" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="29" cy="20" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="29" cy="28" r="3" stroke="currentColor" strokeWidth="2" />
    
    {/* Flash/Sensor */}
    <circle cx="19" cy="18" r="1" fill="currentColor" />
    
    {/* Protection shield overlap */}
    <path d="M10 24h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M35 24h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M24 10v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M24 35v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
  </BaseIcon>
);

/** Glass / screen protection */
export const GlassIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.05" />
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" />
    
    {/* Layered Glass */}
    <path d="M12 28l12-6 12 6-12 6-12-6z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" strokeLinejoin="round" />
    <path d="M12 22l12-6 12 6-12 6-12-6z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.7" />
    <path d="M12 16l12-6 12 6-12 6-12-6z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.4" />
    
    {/* 9H text indicator */}
    <text x="24" y="26" fontSize="8" fontWeight="bold" fill="currentColor" textAnchor="middle" dominantBaseline="middle" opacity="0.9">9H</text>
  </BaseIcon>
);

/** Charging / energy */
export const BoltIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.05" />
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.3" />
    
    {/* Bolt shape */}
    <path d="M26 10L14 26h8l-2 12 12-16h-8l2-12z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" strokeLinejoin="round" />
    
    {/* Radiating power lines */}
    <path d="M10 24h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M40 24h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M14 14l-1.5-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M34 34l1.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
  </BaseIcon>
);

/** Generic quality check */
export const CheckBadgeIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.05" />
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.3" />
    
    {/* Badge outline */}
    <path d="M24 10l3 4 5 1 1 5 4 3-4 3-1 5-5 1-3 4-3-4-5-1-1-5-4-3 4-3 1-5 5-1 3-4z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" strokeLinejoin="round" />
    
    {/* Check mark */}
    <path d="M17 24l5 5 10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </BaseIcon>
);

