import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const BrightnessContrastIcon = ({
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
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="2" x2="12" y2="4" strokeLinecap="round" />
      <line x1="12" y1="20" x2="12" y2="22" strokeLinecap="round" />
      <line x1="2" y1="12" x2="4" y2="12" strokeLinecap="round" />
      <line x1="20" y1="12" x2="22" y2="12" strokeLinecap="round" />
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" strokeLinecap="round" />
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" strokeLinecap="round" />
      <line x1="19.07" y1="4.93" x2="17.66" y2="6.34" strokeLinecap="round" />
      <line x1="6.34" y1="17.66" x2="4.93" y2="19.07" strokeLinecap="round" />
      <path d="M12 7 a5 5 0 0 1 0 10 Z" fill="currentColor" stroke="none" />
    </svg>
  );
};
