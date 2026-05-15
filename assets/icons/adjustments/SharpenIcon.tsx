import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const SharpenIcon = ({ size = 20, className, ...props }: IconProps) => {
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
      <polygon points="12,2 22,12 12,22 2,12" opacity={0.4} />
      <path
        d="M12 2 L10 9 L14 9 Z"
        fill="currentColor"
        stroke="none"
        opacity={0.75}
      />
      <path
        d="M12 22 L10 15 L14 15 Z"
        fill="currentColor"
        stroke="none"
        opacity={0.75}
      />
      <path
        d="M2 12 L9 10 L9 14 Z"
        fill="currentColor"
        stroke="none"
        opacity={0.75}
      />
      <path
        d="M22 12 L15 10 L15 14 Z"
        fill="currentColor"
        stroke="none"
        opacity={0.75}
      />
      <line x1="7" y1="12" x2="17" y2="12" strokeWidth={1.5} />
      <line x1="12" y1="7" x2="12" y2="17" strokeWidth={1.5} />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle
        cx="12"
        cy="12"
        r="0.75"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        opacity={0.6}
      />
    </svg>
  );
};
