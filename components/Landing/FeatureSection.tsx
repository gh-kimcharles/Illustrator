import React from "react";
import CanvasMockup from "./Mockups/CanvasMockup";
import LayersMockup from "./Mockups/LayersMockup";
import ToolsMockup from "./Mockups/ToolsMockup";
import FiltersMockup from "./Mockups/FiltersMockup";
import CloudMockup from "./Mockups/CloudMockup";
import ExportMockup from "./Mockups/ExportMockup";

// Shared primitives
export function MmBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-7 bg-[var(--editor-panel-header)] border-b border-[var(--editor-border)] flex items-center px-2.5 gap-1.5">
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
    <div className="flex items-center gap-2 text-[16px] text-[var(--editor-text)]">
      <span className="text-[var(--editor-accent)] flex-shrink-0">
        <CheckIcon />
      </span>
      {children}
    </div>
  );
}

// Mockups
// refactor: separates components for each mockup (/Mockups/*.tsx)

// Feature row data
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

export default function FeaturesSection() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-10 py-20 font-sans">
        {/* Section header */}
        <div className="flex items-center justify-center flex-col text-center mb-16">
          <div className="text-[14px] tracking-[.12em] font-inter uppercase text-[var(--editor-accent)] py-1.5 px-3 mb-3.5 border rounded-lg border-[var(--editor-accent)] bg-editor-panel">
            Meet Illustrator
          </div>
          <h2 className="text-[52px] font-semibold font-rethink-sans mb-3">
            Everything a desktop editor has,
            <br />
            now in your browser.
          </h2>
          <p className="text-[18px] text-[var(--editor-text-muted)] leading-[1.7] max-w-[480px] font-inter font-light mb-[72px]">
            Illustrator brings professional-grade tools, layers, filters, and
            cloud workflow — all running natively in your browser with zero
            install.
          </p>
        </div>

        {/* Feature rows */}
        {FEATURE_ROWS.map((feat) => (
          <div
            key={feat.title}
            className={`feat-row flex items-center justify-center gap-45 py-20 ${feat.flip ? "flex-row-reverse" : ""}`}
          >
            {/* Text block */}
            <div className="feat-text-block flex-none w-[340px]">
              <div className="text-[14px] font-inter font-medium tracking-[.1em] text-[var(--editor-accent)] mb-2.5">
                {feat.eyebrow}
              </div>
              <h3 className="text-[42px] font-rethink-sans font-light tracking-[-1px] leading-[1.15] mb-3">
                {feat.title}
              </h3>
              <p className="text-[18px] font-inter text-[var(--editor-text-muted)] leading-[1.7] font-light mb-[18px]">
                {feat.desc}
              </p>
              <div className="flex flex-col gap-1.5 mb-5">
                {feat.bullets.map((b) => (
                  <Bullet key={b}>{b}</Bullet>
                ))}
              </div>
            </div>

            {/* Mockup features */}
            <div className="feat-mockup-wrap flex-none w-[480px] overflow-hidden">
              {feat.mockup}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
