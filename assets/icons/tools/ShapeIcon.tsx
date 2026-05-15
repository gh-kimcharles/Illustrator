import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const ShapeIcon = ({ size = 16, className, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  );
};
