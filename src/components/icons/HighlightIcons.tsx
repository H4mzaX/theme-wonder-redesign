import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const BaseIcon = ({ size = 20, children, ...props }: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

/** Minimal MagSafe / magnet */
export const MagnetIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M7 7v6a5 5 0 0 0 10 0V7" />
    <path d="M7 7h4" />
    <path d="M13 7h4" />
    <path d="M7 13h10" />
  </BaseIcon>
);

/** Drop protection / shield */
export const DropShieldIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 2l8 4v6c0 5-3.2 9.2-8 10-4.8-.8-8-5-8-10V6l8-4z" />
    <path d="M9.5 12.5l1.8 1.8 3.8-4" />
  </BaseIcon>
);

/** Crystal clarity / anti-yellow */
export const CrystalIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 2l3 6-3 14-3-14 3-6z" />
    <path d="M9 8h6" />
    <path d="M7.5 12h9" />
  </BaseIcon>
);

/** Fingerprint / smudge resistance */
export const FingerprintIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 12v2" />
    <path d="M9.3 10.6a4 4 0 0 1 5.4 0" />
    <path d="M8 13.2c0 3.8 2.4 6.8 4 6.8s4-3 4-6.8" />
    <path d="M10.2 16.2c.3 1.9 1.2 3.8 1.8 3.8s1.5-1.9 1.8-3.8" />
  </BaseIcon>
);

/** Grip / texture */
export const GripIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M8 6h8" />
    <path d="M8 10h8" />
    <path d="M8 14h8" />
    <path d="M8 18h8" />
    <path d="M6.5 7.5l-1 1" />
    <path d="M6.5 15.5l-1 1" />
    <path d="M18.5 7.5l1 1" />
    <path d="M18.5 15.5l1 1" />
  </BaseIcon>
);

/** Camera protection */
export const CameraIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M7 7h3l1-2h2l1 2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
    <path d="M12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
  </BaseIcon>
);

/** Glass / screen protection */
export const GlassIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M9 7h6" />
    <path d="M9 17h6" />
  </BaseIcon>
);

/** Charging / energy */
export const BoltIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </BaseIcon>
);

/** Generic quality check */
export const CheckBadgeIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 3l2.3 1.2 2.6-.1 1.2 2.3 2.2 1.4-1 2.4.5 2.5-2.3 1.2-1.4 2.2-2.5-.5-2.4 1-1.4-2.2-2.3-1.2.5-2.5-1-2.4 2.2-1.4 1.2-2.3 2.6.1L12 3z" />
    <path d="M9.5 12.2l1.7 1.7 3.8-4" />
  </BaseIcon>
);
