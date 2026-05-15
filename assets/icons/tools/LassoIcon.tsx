import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const LassoIcon = ({ size = 16, className, ...props }: IconProps) => {
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
      <path d="M3.704 14.467a10 8 0 1 1 3.115 2.375" />
      <path d="M7 22a5 5 0 0 1-2-3.994" />
      <circle cx="5" cy="16" r="2" />
    </svg>
  );
};
