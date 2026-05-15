import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const CurvesIcon = ({ size = 20, className, ...props }: IconProps) => {
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
      <rect x="2" y="2" width="20" height="20" rx="1" opacity={0.4} />
      <line x1="2" y1="22" x2="22" y2="2" opacity={0.35} />
      <path d="M2 20 C6 18, 8 14, 12 10 S18 4, 22 2" />
    </svg>
  );
};
