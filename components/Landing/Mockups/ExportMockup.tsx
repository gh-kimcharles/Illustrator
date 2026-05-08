import { MmBar } from "../FeatureSection";

export default function ExportMockup() {
  return (
    <div className="feat-mockup">
      <MmBar>
        <span className="text-[10px] text-[var(--muted)]">Export image</span>
      </MmBar>
      <div className="p-3.5 flex flex-col gap-2">
        <div className="text-[10.5px] text-[var(--muted)] mb-0.5">Format</div>
        <div className="grid grid-cols-3 gap-[5px] mb-1">
          {["PNG", "JPEG", "WebP"].map((fmt) => (
            <div
              key={fmt}
              className={`py-[7px] text-center rounded-[6px] border text-[11px] cursor-default ${
                fmt === "PNG"
                  ? "bg-[var(--accent-s)] border-[var(--accent-b)] text-[var(--accent)]"
                  : "bg-[var(--ph)] border-[var(--bl)] text-[var(--muted)]"
              }`}
            >
              {fmt}
            </div>
          ))}
        </div>
        {[
          { label: "Width", val: "800 px" },
          { label: "Height", val: "600 px" },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="text-[10.5px] text-[var(--muted)] w-[52px]">
              {r.label}
            </span>
            <span className="text-[10.5px] text-[var(--text)] bg-[var(--input)] px-[7px] py-[3px] rounded border border-[var(--bl)]">
              {r.val}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] text-[var(--muted)] w-[52px]">
            Quality
          </span>
          <div className="flex-1 h-[3px] bg-[var(--bl)] rounded-sm relative">
            <div className="absolute left-0 top-0 h-full w-[90%] bg-[var(--accent)] rounded-sm" />
            <div
              className="absolute w-[9px] h-[9px] bg-[var(--text)] rounded-full top-1/2 -translate-y-1/2 border border-[var(--bl)]"
              style={{ left: "88%" }}
            />
          </div>
          <span className="text-[10px] text-[var(--muted)] w-6 text-right">
            90%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] text-[var(--muted)] w-[52px]">
            Layers
          </span>
          <span className="text-[10.5px] text-[var(--accent)] bg-[var(--input)] px-[7px] py-[3px] rounded border border-[var(--bl)]">
            Flatten all
          </span>
        </div>
        <button className="w-full bg-[var(--accent)] text-white border-none rounded-[6px] py-[7px] text-xs font-medium cursor-default mt-1 font-[inherit]">
          ↓ Download image
        </button>
      </div>
    </div>
  );
}
