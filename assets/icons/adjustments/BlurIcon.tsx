import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const BlurIcon = ({ size = 20, className, ...props }: IconProps) => {
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
      <circle cx="12" cy="12" r="9" strokeDasharray="2 2.5" opacity={0.35} />
      <circle cx="12" cy="12" r="6" opacity={0.55} />
      <circle cx="12" cy="12" r="3" opacity={0.8} />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <line x1="12" y1="2" x2="12" y2="3.5" opacity={0.5} />
      <line x1="12" y1="20.5" x2="12" y2="22" opacity={0.5} />
      <line x1="2" y1="12" x2="3.5" y2="12" opacity={0.5} />
      <line x1="20.5" y1="12" x2="22" y2="12" opacity={0.5} />
      <line x1="4.93" y1="4.93" x2="5.99" y2="5.99" opacity={0.35} />
      <line x1="18.01" y1="18.01" x2="19.07" y2="19.07" opacity={0.35} />
      <line x1="19.07" y1="4.93" x2="18.01" y2="5.99" opacity={0.35} />
      <line x1="5.99" y1="18.01" x2="4.93" y2="19.07" opacity={0.35} />
    </svg>
  );
};
