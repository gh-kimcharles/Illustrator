import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const VibranceIcon = ({ size = 20, className, ...props }: IconProps) => {
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
      <line x1="2" y1="12" x2="4" y2="12" />
      <polyline points="4,12 6,12 7,16 8,8 9,15 10,9 11,14 12,6 13,18 14,9 15,14 16,10 17,15 18,12 20,12" />
      <line x1="20" y1="12" x2="22" y2="12" />
    </svg>
  );
};
