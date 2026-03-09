/**
 * VCASE Brand Typography Component
 * 
 * Renders series product names with split weight styling:
 * First word → font-light (300)
 * Remaining words → font-bold (700)
 * 
 * Examples:
 *   ClearMag     → "Clear" light + "Mag" bold
 *   ClearMag Edge → "Clear" light + "Mag" bold + " Edge" bold  
 *   SoftMag      → "Soft" light + "Mag" bold
 *   EdgeGuard    → "Edge" light + "Guard" bold
 *   LensGuard    → "Lens" light + "Guard" bold
 *   Armor Edge   → "Armor" light + "Edge" bold
 */

interface BrandNameProps {
  name: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// Map of known series names to their split points
const brandSplits: Record<string, [string, string]> = {
  ClearMag: ["Clear", "Mag"],
  "ClearMag Edge": ["Clear", "Mag Edge"],
  SoftMag: ["Soft", "Mag"],
  "Armor Edge": ["Armor", "Edge"],
  EdgeGuard: ["Edge", "Guard"],
  LensGuard: ["Lens", "Guard"],
};

const BrandName = ({ name, className = "", as: Tag = "span" }: BrandNameProps) => {
  const split = brandSplits[name];

  if (!split) {
    return <Tag className={className}>{name}</Tag>;
  }

  const [light, bold] = split;

  return (
    <Tag className={className}>
      <span className="font-light">{light}</span>
      <span className="font-bold">{bold}</span>
    </Tag>
  );
};

export default BrandName;
