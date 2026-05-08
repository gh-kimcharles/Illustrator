import React from "react";
import CanvasMockup from "./Mockups/CanvasMockup";
import LayersMockup from "./Mockups/LayersMockup";
import ToolsMockup from "./Mockups/ToolsMockup";
import FiltersMockup from "./Mockups/FiltersMockup";
import CloudMockup from "./Mockups/CloudMockup";
import ExportMockup from "./Mockups/ExportMockup";

// ─── Shared primitives ───────────────────────────────────────────────────────

export function MmBar({ children }: { children: React.ReactNode }) {
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
    <div className="flex items-center gap-2 text-[16px] text-[var(--text)]">
      <span className="text-[var(--accent)] flex-shrink-0">
        <CheckIcon />
      </span>
      {children}
    </div>
  );
}

// ─── Mockups ─────────────────────────────────────────────────────────────────
// refactor: separates components for each mockup (/Mockups/*.tsx)

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
        className="max-w-7xl mx-auto px-10 py-20"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Section header */}
        <div className="flex items-center justify-center flex-col text-center mb-16">
          <div className="text-[11px] font-semibold tracking-[.12em] uppercase text-[var(--accent)] mb-3.5">
            What&apos;s inside
          </div>
          <h2
            className="text-[52px] font-semibold  mb-3"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Everything a desktop editor has,
            <br />
            now in your browser.
          </h2>
          <p className="text-[18px] text-[var(--muted)] leading-[1.7] max-w-[480px] font-light mb-[72px]">
            Illustrator brings professional-grade tools, layers, filters, and
            cloud workflow — all running natively in your browser with zero
            install.
          </p>
        </div>

        {/* Feature rows */}
        <div className="flex flex-col gap-16">
          {FEATURE_ROWS.map((feat) => (
            <div
              key={feat.title}
              className={`feat-row flex items-center gap-14 ${feat.flip ? "flex-row-reverse" : ""}`}
            >
              {/* Text block */}
              <div className="flex-none w-[340px]">
                <div className="text-[11px] font-semibold tracking-[.1em] uppercase text-[var(--accent)] mb-2.5">
                  {feat.eyebrow}
                </div>
                <h3
                  className="text-[36px] font-light tracking-[-1px] leading-[1.15] mb-3"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  {feat.title}
                </h3>
                <p className="text-[16px] text-[var(--muted)] leading-[1.7] font-light mb-[18px]">
                  {feat.desc}
                </p>
                <div className="flex flex-col gap-1.5 mb-5">
                  {feat.bullets.map((b) => (
                    <Bullet key={b}>{b}</Bullet>
                  ))}
                </div>
              </div>

              {/* Mockup */}
              <div className="flex-1 overflow-hidden">{feat.mockup}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
