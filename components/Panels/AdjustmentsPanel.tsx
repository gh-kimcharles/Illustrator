"use client";

import { useState } from "react";

interface AdjDef {
  icon: string;
  label: string;
  comingSoon?: boolean;
}

const ADJUSTMENTS: AdjDef[] = [
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

function PanelSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-editor-border flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full h-[26px] flex items-center justify-between px-2.5 bg-editor-panelHeader border-b border-editor-border hover:bg-editor-hover transition-colors"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide text-editor-textMuted">
          {title}
        </span>
        <span className="text-[10px] text-editor-textMuted">
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open && <div className="p-2.5">{children}</div>}
    </div>
  );
}

const AdjustmentsPanel = () => {
  return (
    <PanelSection title="Adjustments">
      <p className="text-[10px] text-editor-textMuted mb-2">
        Add an adjustment
      </p>
      <div className="grid grid-cols-5 gap-1">
        {ADJUSTMENTS.map((adj) => (
          <button
            key={adj.label}
            title={adj.label + " (Phase 4)"}
            className="flex flex-col items-center gap-0.5 bg-[#2a2a2a] border border-editor-borderLight text-editor-textMuted px-1 py-1.5 text-[9px] hover:bg-editor-hover hover:text-editor-textPrimary transition-colors"
          >
            <span className="text-sm leading-none">{adj.icon}</span>
            <span className="leading-tight text-center">{adj.label}</span>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-editor-textMuted mt-2 italic">
        Adjustments coming in Phase 4
      </p>
    </PanelSection>
  );
};

export default AdjustmentsPanel;
