import { MmBar } from "../FeatureSection";

const TOOLS = [
  {
    label: "Move",
    active: true,
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      >
        <path d="M8 1v14M1 8h14M8 1L6 3M8 1L10 3M8 15L6 13M8 15L10 13" />
      </svg>
    ),
  },
  {
    label: "Marquee",
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <rect
          x="2"
          y="2"
          width="12"
          height="12"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="2 1.5"
        />
      </svg>
    ),
  },
  {
    label: "Lasso",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        <path d="M8 2C5 2 2 4.5 2 7.5S5 13 8 13s6-2.5 6-5.5" />
        <path d="M14 7.5L13 10L11.5 9" />
      </svg>
    ),
  },
  {
    label: "Crop",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 6H12V14" />
        <path d="M6 2V10H14" />
      </svg>
    ),
  },
  {
    label: "Eyedrop",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="7" cy="7" r="4" />
        <path d="M9.8 9.8L14 14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Brush",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 2L14 6L6 14C5 14.5 3 14.5 2.5 14S1.5 12 2 11L10 2Z" />
      </svg>
    ),
  },
  {
    label: "Eraser",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12L7 4L12 9L8 13H2Z" />
      </svg>
    ),
  },
  {
    label: "Fill",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        <path d="M2 14C2 11 4 9 8 9C12 9 14 11 14 14" />
        <path d="M5 5a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />
      </svg>
    ),
  },
  {
    label: "Text",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      >
        <path d="M3 4h10M7 4v8M5 12h6" />
      </svg>
    ),
  },
  {
    label: "Shape",
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <rect
          x="2.5"
          y="2.5"
          width="11"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
  {
    label: "Zoom",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        <circle cx="7" cy="7" r="5" />
        <path d="M5 7h4M7 5v4M12 12L15 15" />
      </svg>
    ),
  },
  {
    label: "Hand",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3C5 3 4 4 4 5V11C4 12 5 13 6 13C7 13 8 12 8 11V8M8 8C8 9 9 10 10 10C11 10 12 9 12 8V5C12 4 11 3 10 3C9 3 8 4 8 5V8Z" />
      </svg>
    ),
  },
];

export default function ToolsMockup() {
  return (
    <div className="feat-mockup">
      <MmBar>
        <span className="text-[10px] text-[var(--muted)]">Tool palette</span>
      </MmBar>
      <div className="grid grid-cols-4 gap-1 p-2.5">
        {TOOLS.map((t) => (
          <div
            key={t.label}
            className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-[6px] border text-[9px] cursor-default [&_svg]:w-4 [&_svg]:h-4 ${
              t.active
                ? "bg-[var(--accent-s)] border-[var(--accent-b)] text-[var(--accent)]"
                : "bg-[var(--ph)] border-transparent text-[var(--muted)]"
            }`}
          >
            {t.icon}
            {t.label}
          </div>
        ))}
      </div>
    </div>
  );
}
