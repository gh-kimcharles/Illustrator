import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const PosterizeIcon = ({
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
      <line x1="2" y1="21" x2="22" y2="21" />
      <rect
        x="2.5"
        y="15"
        width="4"
        height="6"
        fill="currentColor"
        stroke="none"
        opacity={0.25}
      />
      <rect x="2.5" y="15" width="4" height="6" fill="none" />
      <rect
        x="7.5"
        y="11"
        width="4"
        height="10"
        fill="currentColor"
        stroke="none"
        opacity={0.45}
      />
      <rect x="7.5" y="11" width="4" height="10" fill="none" />
      <rect
        x="12.5"
        y="7"
        width="4"
        height="14"
        fill="currentColor"
        stroke="none"
        opacity={0.65}
      />
      <rect x="12.5" y="7" width="4" height="14" fill="none" />
      <rect
        x="17.5"
        y="3"
        width="4"
        height="18"
        fill="currentColor"
        stroke="none"
        opacity={0.9}
      />
      <rect x="17.5" y="3" width="4" height="18" fill="none" />
      <polyline
        points="2.5,15 6.5,15 6.5,11 10.5,11 10.5,7 14.5,7 14.5,3 21.5,3"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </svg>
  );
};
