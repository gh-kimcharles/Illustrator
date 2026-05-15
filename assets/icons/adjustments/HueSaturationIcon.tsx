import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const HueSaturationIcon = ({
  size = 20,
  className,
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {/* Row 1 — Hue slider, thumb at 1/3 */}
      <line x1="2" y1="6" x2="22" y2="6" />
      <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />

      {/* Row 2 — Saturation slider, thumb at center */}
      <line x1="2" y1="12" x2="22" y2="12" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />

      {/* Row 3 — Lightness slider, thumb at 2/3 */}
      <line x1="2" y1="18" x2="22" y2="18" />
      <circle cx="16" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
};
