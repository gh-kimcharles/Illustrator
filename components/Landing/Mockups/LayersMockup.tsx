import { MmBar } from "../FeatureSection";

export default function LayersMockup() {
  const layers = [
    {
      label: "Brush strokes",
      mode: "Normal",
      bg: "linear-gradient(135deg,#2563eb33,#2563eb88)",
      active: true,
      locked: false,
    },
    {
      label: "Shape layer",
      mode: "Multiply",
      bg: "#fde68a55",
      active: false,
      locked: false,
    },
    {
      label: "Adjustment",
      mode: "Screen",
      bg: "#e0e7ff55",
      active: false,
      locked: false,
    },
    {
      label: "Background",
      mode: "🔒",
      bg: "#f1f5f9",
      active: false,
      locked: true,
    },
  ];

  return (
    <div className="feat-mockup">
      <MmBar>
        <span className="text-[10px] text-[var(--editor-text-muted)] font-semibold uppercase tracking-[.08em]">
          Layers
        </span>
        <span className="ml-auto text-[10px] text-[var(--editor-text-muted)]">
          Normal · 100%
        </span>
      </MmBar>
      <div className="flex flex-col gap-[3px] p-2 h-75">
        {layers.map((l) => (
          <div
            key={l.label}
            className={`flex items-center gap-[7px] px-[7px] py-[5px] rounded-[5px] border text-[11px] ${
              l.active
                ? "bg-[var(--editor-accent-subtle)] border-[var(--editor-accent-border)] text-[var(--editor-text)]"
                : "bg-[var(--editor-panel-header)] border-transparent text-[var(--editor-text-muted)]"
            }`}
          >
            <div
              className="w-5 h-5 rounded-[3px] border border-[var(--editor-border-light)] flex-shrink-0"
              style={{ background: l.bg }}
            />
            <span>{l.label}</span>
            <span
              className={`ml-auto text-[10px] bg-[var(--editor-input-bg)] px-[5px] py-[2px] rounded-[3px] ${
                l.locked
                  ? "text-[var(--editor-text-disabled)]"
                  : "text-[var(--editor-text-muted)]"
              }`}
            >
              {l.mode}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-[3px] px-2 py-1.5 border-t border-[var(--editor-border)]">
        {["+", "↑", "↓", "🗑"].map((icon) => (
          <div
            key={icon}
            className="flex-1 h-[22px] flex items-center justify-center bg-[var(--editor-panel-header)] border border-[var(--editor-border-light)] rounded text-xs text-[var(--editor-text-muted)]"
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}
