import { MmBar } from "../FeatureSection";

export default function CanvasMockup() {
  return (
    <div className="feat-mockup">
      <MmBar>
        <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <div className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span className="text-[10px] text-[var(--editor-text-muted)] ml-1.5">
          Canvas — 800 × 600 px
        </span>
        <span className="ml-auto text-[10px] text-[var(--editor-text-muted)]">
          RGB/8
        </span>
      </MmBar>
      <div className="relative bg-[oklch(0.25_0.005_285.823)] h-75 flex items-center justify-center">
        <div className="bg-white rounded-sm overflow-hidden w-[280px] h-[200px]"></div>
        <div className="absolute bottom-2 right-2.5 text-[10px] text-[var(--editor-text-muted)]">
          Zoom: 100%
        </div>
      </div>
    </div>
  );
}
