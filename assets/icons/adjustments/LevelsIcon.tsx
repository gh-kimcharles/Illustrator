import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const LevelsIcon = ({ size = 20, className, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <rect x="2" y="15" width="2" height="5" />
      <rect x="5" y="12" width="2" height="8" />
      <rect x="8" y="8" width="2" height="12" />
      <rect x="11" y="6" width="2" height="14" />
      <rect x="14" y="8" width="2" height="12" />
      <rect x="17" y="12" width="2" height="8" />
      <rect x="20" y="14" width="2" height="6" />
      <rect
        x="2"
        y="21"
        width="20"
        height="1.5"
        rx="0.75"
        fill="currentColor"
      />
      <polygon points="12,21 9.5,24 14.5,24" />
    </svg>
  );
};
