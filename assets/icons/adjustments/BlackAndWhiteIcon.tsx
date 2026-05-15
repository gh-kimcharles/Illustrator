import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const BlackAndWhiteIcon = ({
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
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path
        d="M3 7 a2 2 0 0 1 2-2 h7 v14 H5 a2 2 0 0 1-2-2 Z"
        fill="currentColor"
        stroke="none"
      />
      <line x1="12" y1="5" x2="12" y2="19" strokeWidth={1} />
    </svg>
  );
};
