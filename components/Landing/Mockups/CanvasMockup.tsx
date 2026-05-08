import { MmBar } from "../FeatureSection";

export default function CanvasMockup() {
  return (
    <div className="feat-mockup">
      <MmBar>
        <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <div className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span className="text-[10px] text-[var(--muted)] ml-1.5">
          Canvas — 800 × 600 px
        </span>
        <span className="ml-auto text-[10px] text-[var(--muted)]">RGB/8</span>
      </MmBar>
      <div className="relative bg-[oklch(0.25_0.005_285.823)] h-52 flex items-center justify-center">
        <div className="bg-white rounded-sm overflow-hidden w-[280px] h-[160px]">
          <svg width="280" height="160" viewBox="0 0 280 160">
            <rect width="280" height="160" fill="white" />
            <rect
              x="20"
              y="20"
              width="80"
              height="60"
              rx="4"
              fill="#e0e7ff"
              opacity=".7"
            />
            <ellipse
              cx="180"
              cy="60"
              rx="50"
              ry="35"
              fill="#fde68a"
              opacity=".6"
            />
            <path
              d="M30 130 Q80 90 140 110 Q200 130 260 100"
              stroke="#2563eb"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity=".8"
            />
            <path
              d="M30 140 Q80 105 140 120 Q200 138 260 112"
              stroke="#60a5fa"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              opacity=".5"
            />
            <line
              x1="0"
              y1="0"
              x2="280"
              y2="0"
              stroke="#e5e7eb"
              strokeWidth=".5"
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="160"
              stroke="#e5e7eb"
              strokeWidth=".5"
            />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2.5 text-[10px] text-[var(--muted)]">
          Zoom: 100%
        </div>
      </div>
    </div>
  );
}
