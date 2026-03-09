/**
 * VCASE Brand Typography Component
 * 
 * Renders series product names with Bebas Neue condensed bold font
 * All product names use the same font-brand (Bebas Neue) styling
 * 
 * Examples:
 *   ClearMag, ClearMag Edge, SoftMag, EdgeGuard, LensGuard, Armor Edge
 */

interface BrandNameProps {
  name: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const BrandName = ({ name, className = "", as: Tag = "span" }: BrandNameProps) => {
  return (
    <Tag className={`font-brand uppercase tracking-wide ${className}`}>
      {name}
    </Tag>
  );
};

export default BrandName;
