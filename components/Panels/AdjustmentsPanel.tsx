"use client";

import { Panel } from "@/components/ui";

const ADJUSTMENTS = [
  { icon: "☀", label: "B/C" },
  { icon: "◑", label: "Levels" },
  { icon: "〜", label: "Curves" },
  { icon: "🎨", label: "Hue/Sat" },
  { icon: "◻", label: "B&W" },
  { icon: "⬤", label: "Vibrance" },
  { icon: "▤", label: "Posterize" },
  { icon: "◈", label: "Invert" },
  { icon: "▦", label: "Threshold" },
  { icon: "◧", label: "Gradient Map" },
];

const AdjustmentsPanel = () => {
  return (
    <Panel title="Adjustments">
      <p className="text-[10px] text-editor-text-muted mb-2">
        Add an adjustment
      </p>
      <div className="grid grid-cols-5 gap-1">
        {ADJUSTMENTS.map((adj) => (
          <button
            key={adj.label}
            title={`${adj.label} — coming in Phase 4`}
            className="flex flex-col items-center gap-0.5 bg-editor-input-bg border border-editor-border-light
                       text-editor-text-muted px-1 py-1.5 text-[9px]
                       hover:bg-editor-hover hover:text-editor-text transition-colors"
          >
            <span className="text-sm leading-none">{adj.icon}</span>
            <span className="leading-tight text-center">{adj.label}</span>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-editor-text-disabled mt-2 italic">
        Adjustments arrive in Phase 4
      </p>
    </Panel>
  );
};

export default AdjustmentsPanel;
