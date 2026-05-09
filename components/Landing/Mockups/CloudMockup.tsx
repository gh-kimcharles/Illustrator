import { MmBar } from "../FeatureSection";

export default function CloudMockup() {
  const files = [
    { name: "landscape-edit.illus", meta: "Saved 2 min ago · 4 layers" },
    { name: "portrait-v3.illus", meta: "Yesterday · 9 layers" },
  ];

  return (
    <div className="feat-mockup">
      <MmBar>
        <span className="text-[10px] text-[var(--muted)]">My projects</span>
        <span className="ml-auto text-[10px] text-[var(--accent)]">+ New</span>
      </MmBar>
      <div className="p-4 flex flex-col gap-2.5">
        {files.map((f) => (
          <div
            key={f.name}
            className="flex items-center gap-[9px] px-[9px] py-[7px] bg-[var(--ph)] rounded-[6px] border border-[var(--bl)]"
          >
            <div className="w-7 h-7 bg-[var(--accent-s)] border border-[var(--accent-b)] rounded-[5px] flex items-center justify-center flex-shrink-0">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.3"
                strokeLinecap="round"
              >
                <rect x="2" y="1" width="10" height="12" rx="1.5" />
                <path d="M4 4h6M4 6.5h6M4 9h4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-[var(--text)]">{f.name}</div>
              <div className="text-[10px] text-[var(--muted)]">{f.meta}</div>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-1.5 bg-[var(--input)] border border-[var(--bl)] rounded-[6px] px-2.5 py-[6px] text-[10.5px] text-[var(--muted)]">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            <path d="M4 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
            <path d="M8 6l3-3M8 6l3 3" />
            <path d="M4 6L1 3M4 6L1 9" />
          </svg>
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            illustr.app/share/xK92mP4
          </span>
          <button className="bg-[var(--accent)] text-white border-none text-[10px] px-2 py-[3px] rounded cursor-default flex-shrink-0">
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
