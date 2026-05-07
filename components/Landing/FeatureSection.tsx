import React from "react";

// ─── Shared primitives ───────────────────────────────────────────────────────

function MmBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-7 bg-[var(--ph)] border-b border-[var(--border)] flex items-center px-2.5 gap-1.5">
      {children}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
      <path
        d="M2 7L5.5 10.5L12 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[var(--text)]">
      <span className="text-[var(--accent)] flex-shrink-0">
        <CheckIcon />
      </span>
      {children}
    </div>
  );
}

// ─── Mockups ─────────────────────────────────────────────────────────────────

function CanvasMockup() {
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

function LayersMockup() {
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
        <span className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-[.08em]">
          Layers
        </span>
        <span className="ml-auto text-[10px] text-[var(--muted)]">
          Normal · 100%
        </span>
      </MmBar>
      <div className="flex flex-col gap-[3px] p-2">
        {layers.map((l) => (
          <div
            key={l.label}
            className={`flex items-center gap-[7px] px-[7px] py-[5px] rounded-[5px] border text-[11px] ${
              l.active
                ? "bg-[var(--accent-s)] border-[var(--accent-b)] text-[var(--text)]"
                : "bg-[var(--ph)] border-transparent text-[var(--muted)]"
            }`}
          >
            <div
              className="w-5 h-5 rounded-[3px] border border-[var(--bl)] flex-shrink-0"
              style={{ background: l.bg }}
            />
            <span>{l.label}</span>
            <span
              className={`ml-auto text-[10px] bg-[var(--input)] px-[5px] py-[2px] rounded-[3px] ${
                l.locked ? "text-[var(--dis)]" : "text-[var(--muted)]"
              }`}
            >
              {l.mode}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-[3px] px-2 py-1.5 border-t border-[var(--border)]">
        {["+", "↑", "↓", "🗑"].map((icon) => (
          <div
            key={icon}
            className="flex-1 h-[22px] flex items-center justify-center bg-[var(--ph)] border border-[var(--bl)] rounded text-xs text-[var(--muted)]"
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}

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

function ToolsMockup() {
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

function FiltersMockup() {
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
        <span className="text-[10px] text-[var(--muted)]">
          Adjustments panel
        </span>
      </MmBar>
      <div className="p-2.5 flex flex-col gap-[5px]">
        {/* Hue — rainbow track */}
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] text-[var(--muted)] w-[88px] flex-shrink-0">
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
              className="absolute w-[9px] h-[9px] bg-white rounded-full top-1/2 -translate-y-1/2 border border-[var(--bl)]"
              style={{ left: "30%" }}
            />
          </div>
          <span className="text-[10px] text-[var(--muted)] w-6 text-right">
            +18°
          </span>
        </div>

        {sliders.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <span className="text-[10.5px] text-[var(--muted)] w-[88px] flex-shrink-0">
              {s.name}
            </span>
            <div className="flex-1 h-[3px] bg-[var(--bl)] rounded-sm relative">
              <div
                className="absolute left-0 top-0 h-full bg-[var(--accent)] rounded-sm"
                style={{ width: s.fill }}
              />
              <div
                className="absolute w-[9px] h-[9px] bg-[var(--text)] rounded-full top-1/2 -translate-y-1/2 border border-[var(--bl)]"
                style={{ left: s.thumb }}
              />
            </div>
            <span className="text-[10px] text-[var(--muted)] w-6 text-right">
              {s.val}
            </span>
          </div>
        ))}

        <div className="flex flex-wrap gap-1 pt-1 border-t border-[var(--border)]">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] px-[7px] py-[3px] rounded border ${
                tag === "Levels"
                  ? "bg-[var(--accent-s)] border-[var(--accent-b)] text-[var(--accent)]"
                  : "bg-[var(--ph)] border-[var(--bl)] text-[var(--muted)]"
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

function CloudMockup() {
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

function ExportMockup() {
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

// ─── Feature row data ─────────────────────────────────────────────────────────

interface FeatureRow {
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
  mockup: React.ReactNode;
  flip?: boolean;
}

const FEATURE_ROWS: FeatureRow[] = [
  {
    eyebrow: "Foundation",
    title: "HTML5 Canvas rendering engine",
    desc: "Every pixel is rendered on a native HTML5 Canvas element — blazing fast, no plugins, no WebAssembly overhead. Supports 800×600 up to 4K canvases.",
    bullets: [
      "Pixel-perfect rendering",
      "Configurable canvas size",
      "RGB/8 color mode",
    ],
    mockup: <CanvasMockup />,
  },
  {
    eyebrow: "Compositing",
    title: "Non-destructive layer compositing",
    desc: "Stack unlimited layers with full blend mode support — Normal, Multiply, Screen, Overlay and more. Lock, hide, reorder, merge, and group with precision.",
    bullets: ["Unlimited layers", "Blend modes", "Per-layer opacity"],
    mockup: <LayersMockup />,
    flip: true,
  },
  {
    eyebrow: "Tools",
    title: "12 professional editing tools",
    desc: "Every tool you'd reach for — from the precision of the Marquee to the fluidity of the Brush. Includes Move, Lasso, Crop, Eyedropper, Fill, Text, Shape, Zoom, and Hand.",
    bullets: [
      "Selection & transform",
      "Drawing & painting",
      "Navigation & utility",
    ],
    mockup: <ToolsMockup />,
  },
  {
    eyebrow: "Filters & Adjustments",
    title: "10 real-time image adjustments",
    desc: "Apply professional color corrections and effects on any layer — non-destructively. Brightness/Contrast, Hue/Saturation, Curves, Levels, B&W, Vibrance, Posterize, Invert, Sharpen, and Blur.",
    bullets: ["Non-destructive", "Live preview", "Stack multiple adjustments"],
    mockup: <FiltersMockup />,
    flip: true,
  },
  {
    eyebrow: "Cloud",
    title: "Save, sync, and share instantly",
    desc: "Your projects live in the cloud. Pick up where you left off from any device. Share a live link with anyone — they can view or fork your project without an account.",
    bullets: [
      "Auto-save on every action",
      "Shareable link",
      "Project versioning",
    ],
    mockup: <CloudMockup />,
  },
  {
    eyebrow: "Export",
    title: "Export at any size, any format",
    desc: "Export your finished work as PNG, JPEG, or WebP at custom resolutions. Choose to flatten all layers or export individual ones. Download straight from your browser.",
    bullets: [
      "PNG · JPEG · WebP",
      "Custom resolution & quality",
      "Export single layers",
    ],
    mockup: <ExportMockup />,
    flip: true,
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function FeaturesSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ph:      oklch(0.21 0.006 285.885);
          --input:   oklch(0.16 0.005 285.823);
          --accent:  oklch(0.55 0.18 240);
          --accent-s:oklch(0.55 0.18 240 / 15%);
          --accent-b:oklch(0.55 0.18 240 / 35%);
          --text:    oklch(0.985 0 0);
          --muted:   oklch(0.705 0.015 286.067);
          --dis:     oklch(0.439 0 0);
          --border:  oklch(1 0 0 / 8%);
          --bl:      oklch(1 0 0 / 13%);
        }

        .feat-mockup {
          flex: 1;
          min-width: 0;
          background: oklch(0.18 0.005 285.823);
          border: 1px solid var(--bl);
          border-radius: 14px;
          overflow: hidden;
        }

        @keyframes featSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .feat-row { animation: featSlideIn 0.5s ease both; }
        .feat-row:nth-child(1) { animation-delay: 0.00s; }
        .feat-row:nth-child(2) { animation-delay: 0.05s; }
        .feat-row:nth-child(3) { animation-delay: 0.10s; }
        .feat-row:nth-child(4) { animation-delay: 0.15s; }
        .feat-row:nth-child(5) { animation-delay: 0.20s; }
        .feat-row:nth-child(6) { animation-delay: 0.25s; }
      `}</style>

      <section
        className="max-w-[960px] mx-auto px-10 py-20"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Section header */}
        <div className="text-[11px] font-semibold tracking-[.12em] uppercase text-[var(--accent)] mb-3.5">
          What&apos;s inside
        </div>
        <h2
          className="text-[36px] font-extrabold tracking-[-1.5px] leading-[1.1] mb-3"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Everything a desktop
          <br />
          editor has. In your browser.
        </h2>
        <p className="text-[14px] text-[var(--muted)] leading-[1.7] max-w-[480px] font-light mb-[72px]">
          Built on HTML5 Canvas, Illustrator brings professional-grade tools,
          layers, filters, and cloud workflow — all running natively in your
          browser with zero install.
        </p>

        {/* Feature rows */}
        <div className="flex flex-col gap-20">
          {FEATURE_ROWS.map((feat) => (
            <div
              key={feat.title}
              className={`feat-row flex items-center gap-14 ${feat.flip ? "flex-row-reverse" : ""}`}
            >
              {/* Text block */}
              <div className="flex-none w-[320px]">
                <div className="text-[11px] font-semibold tracking-[.1em] uppercase text-[var(--accent)] mb-2.5">
                  {feat.eyebrow}
                </div>
                <h3
                  className="text-[26px] font-extrabold tracking-[-1px] leading-[1.15] mb-3"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {feat.title}
                </h3>
                <p className="text-[13px] text-[var(--muted)] leading-[1.7] font-light mb-[18px]">
                  {feat.desc}
                </p>
                <div className="flex flex-col gap-1.5 mb-5">
                  {feat.bullets.map((b) => (
                    <Bullet key={b}>{b}</Bullet>
                  ))}
                </div>
              </div>

              {/* Mockup */}
              {feat.mockup}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
