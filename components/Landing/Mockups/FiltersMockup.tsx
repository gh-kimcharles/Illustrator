import { MmBar } from "../FeatureSection";

export default function FiltersMockup() {
  const sliders = [
    { name: "Brightness", fill: "65%", thumb: "63%", val: "+26" },
    { name: "Contrast", fill: "40%", thumb: "38%", val: "−12" },
    { name: "Saturation", fill: "75%", thumb: "73%", val: "+30" },
    { name: "Vibrance", fill: "55%", thumb: "53%", val: "+10" },
    { name: "Blur", fill: "20%", thumb: "18%", val: "2px" },
  ];
  const tags = ["Curves", "Levels", "Invert", "B&W", "Posterize"];

  return (
    <div className="feat-mockup">
      <MmBar>
        <span className="text-[10px] text-[var(--editor-text-muted)]">
          Adjustments panel
        </span>
      </MmBar>
      <div className="p-2.5 flex flex-col gap-[12px]">
        {/* Hue — rainbow track */}
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] text-[var(--editor-text-muted)] w-[88px] flex-shrink-0">
            Hue
          </span>
          <div
            className="flex-1 h-[3px] rounded-sm relative"
            style={{
              background:
                "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)",
            }}
          >
            <div
              className="absolute w-[9px] h-[9px] bg-white rounded-full top-1/2 -translate-y-1/2 border border-[var(--editor-border-light)]"
              style={{ left: "30%" }}
            />
          </div>
          <span className="text-[10px] text-[var(--editor-text-muted)] w-6 text-right">
            +18°
          </span>
        </div>

        {sliders.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <span className="text-[10.5px] text-[var(--editor-text-muted)] w-[88px] flex-shrink-0">
              {s.name}
            </span>
            <div className="flex-1 h-[3px] bg-[var(--editor-border-light)] rounded-sm relative">
              <div
                className="absolute left-0 top-0 h-full bg-[var(--editor-accent)] rounded-sm"
                style={{ width: s.fill }}
              />
              <div
                className="absolute w-[9px] h-[9px] bg-[var(--editor-text)] rounded-full top-1/2 -translate-y-1/2 border border-[var(--editor-border-light)]"
                style={{ left: s.thumb }}
              />
            </div>
            <span className="text-[10px] text-[var(--editor-text-muted)] w-6 text-right">
              {s.val}
            </span>
          </div>
        ))}

        <div className="flex flex-wrap gap-1 pt-3 border-t border-[var(--editor-border)]">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] px-[7px] py-[3px] rounded border ${
                tag === "Levels"
                  ? "bg-[var(--editor-accent-subtle)] border-[var(--editor-accent-border)] text-[var(--editor-accent)]"
                  : "bg-[var(--editor-panel-header)] border-[var(--editor-border-light)] text-[var(--editor-text-muted)]"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
