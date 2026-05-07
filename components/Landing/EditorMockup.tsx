"use client";

import { useEffect, useRef, useState } from "react";

const COLORS = [
  { hex: "2563eb", r: 37, g: 99, b: 235, rp: "15%", gp: "39%", bp: "92%" },
  { hex: "e11d48", r: 225, g: 29, b: 72, rp: "88%", gp: "11%", bp: "28%" },
  { hex: "16a34a", r: 22, g: 163, b: 74, rp: "9%", gp: "64%", bp: "29%" },
  { hex: "d97706", r: 217, g: 119, b: 6, rp: "85%", gp: "47%", bp: "2%" },
  { hex: "7c3aed", r: 124, g: 58, b: 237, rp: "49%", gp: "23%", bp: "93%" },
];

const ADJ_BTNS = [
  "B/C",
  "Hue/Sat",
  "Levels",
  "Curves",
  "Vibrance",
  "Posterize",
  "Invert",
  "B&W",
  "Blur",
  "Sharpen",
];
const ADJ_NAMES = [
  "Brightness/Contrast",
  "Hue/Saturation",
  "Levels",
  "Curves",
  "Vibrance",
  "Posterize",
  "Invert",
  "Black & White",
  "Gaussian Blur",
  "Sharpen",
];

const TOOLS = [
  { id: "move", label: "Move Tool" },
  { id: "brush", label: "Brush Tool" },
];

const LAYERS = [
  {
    name: "Layer 5",
    thumb: <circle cx="12" cy="12" r="5" fill="#2563eb" />,
    active: true,
  },
  {
    name: "Layer 4",
    thumb: <path d="M4 18L12 6L20 18Z" fill="#888" opacity={0.5} />,
  },
  {
    name: "Layer 3",
    thumb: <rect x="4" y="4" width="16" height="16" rx="2" fill="#555" />,
  },
  {
    name: "Layer 2",
    thumb: <ellipse cx="12" cy="12" rx="8" ry="5" fill="#333" />,
  },
  { name: "Background", locked: true },
];

const OPACITY_MAP = [100, 85, 70, 90, 60];

// SVG paint strokes drawn on canvas
const STROKE_DEFS = [
  {
    tag: "path",
    attrs: {
      d: "M60 80 Q110 60 160 100 Q210 140 250 90 Q290 50 320 80",
      stroke: "#2563eb",
      strokeWidth: 14,
    },
  },
  {
    tag: "path",
    attrs: {
      d: "M50 180 Q120 140 200 170 Q260 195 310 160",
      stroke: "#e11d48",
      strokeWidth: 10,
    },
  },
  {
    tag: "path",
    attrs: {
      d: "M80 230 Q150 210 230 230 Q280 245 330 215",
      stroke: "#16a34a",
      strokeWidth: 8,
    },
  },
];

export default function EditorMockup() {
  const [colorIdx, setColorIdx] = useState(0);
  const [adjIdx, setAdjIdx] = useState(0);
  const [activeLayer, setActiveLayer] = useState(0);
  const [toolIdx, setToolIdx] = useState(0);
  const [drawKey, setDrawKey] = useState(0); // increment to re-trigger stroke animation
  const [brightVal, setBrightVal] = useState(60);
  const [contrastVal, setContrastVal] = useState(40);

  const color = COLORS[colorIdx];
  const opacity = OPACITY_MAP[activeLayer] ?? 100;

  useEffect(() => {
    const intervals = [
      setInterval(() => setColorIdx((i) => (i + 1) % COLORS.length), 2200),
      setInterval(() => {
        setAdjIdx((i) => (i + 1) % ADJ_BTNS.length);
        setBrightVal(Math.floor(Math.random() * 70 + 20));
        setContrastVal(Math.floor(Math.random() * 60 + 20));
      }, 3100),
      setInterval(
        () => setActiveLayer((i) => (i + 1) % (LAYERS.length - 1)),
        4000,
      ),
      setInterval(() => setToolIdx((i) => (i + 1) % TOOLS.length), 6000),
      setInterval(() => setDrawKey((k) => k + 1), 5000),
    ];
    return () => intervals.forEach(clearInterval);
  }, []);

  const activeTool = TOOLS[toolIdx];

  return (
    <div
      className="rounded-xl overflow-hidden border border-editor-border-light text-[11px]"
      style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
    >
      {/* Menubar */}
      <div className="h-8 bg-editor-menubar border-b border-editor-border flex items-center px-2 gap-0 flex-shrink-0">
        <div className="flex gap-1.5 px-2 mr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        {["File", "Edit", "Image", "Filter", "Layer", "Select", "View"].map(
          (m) => (
            <div
              key={m}
              className="px-2.5 h-full flex items-center text-editor-text-muted text-[11px] cursor-default hover:bg-editor-hover hover:text-editor-text transition-colors"
            >
              {m}
            </div>
          ),
        )}
      </div>

      {/* Options bar */}
      <div className="h-7 bg-editor-optbar border-b border-editor-border flex items-center px-2.5 gap-2.5 flex-shrink-0">
        <span className="text-editor-text-muted text-[10.5px]">Tool:</span>
        <span className="text-editor-text text-[10.5px] bg-editor-input-bg px-1.5 py-0.5 rounded border border-editor-border-light transition-all">
          {activeTool.label}
        </span>
        <span className="text-editor-text-muted text-[10.5px] ml-2">
          Opacity:
        </span>
        <span className="text-editor-text text-[10.5px] bg-editor-input-bg px-1.5 py-0.5 rounded border border-editor-border-light">
          100%
        </span>
        <span className="text-editor-text-muted text-[10.5px] ml-2">Mode:</span>
        <span className="text-editor-text text-[10.5px] bg-editor-input-bg px-1.5 py-0.5 rounded border border-editor-border-light">
          Normal
        </span>
      </div>

      {/* Main area */}
      <div className="flex h-[460px]">
        {/* Toolbar */}
        <div className="w-10 bg-editor-toolbar border-r border-editor-border flex flex-col items-center py-1.5 gap-0.5 flex-shrink-0">
          <ToolBtn active={toolIdx === 0} title="Move">
            <MoveIcon />
          </ToolBtn>
          <ToolBtn title="Marquee">
            <MarqueeIcon />
          </ToolBtn>
          <ToolBtn title="Lasso">
            <LassoIcon />
          </ToolBtn>
          <div className="w-5 h-px bg-editor-border-light my-1" />
          <ToolBtn active={toolIdx === 1} title="Brush">
            <BrushIcon />
          </ToolBtn>
          <ToolBtn title="Eraser">
            <EraserIcon />
          </ToolBtn>
          <ToolBtn title="Clone">
            <CloneIcon />
          </ToolBtn>
          <div className="w-5 h-px bg-editor-border-light my-1" />
          <ToolBtn title="Crop">
            <CropIcon />
          </ToolBtn>
          <ToolBtn title="Text">
            <TextIcon />
          </ToolBtn>
          <ToolBtn title="Shape">
            <ShapeIcon />
          </ToolBtn>
          <div className="w-5 h-px bg-editor-border-light my-1" />
          {/* Foreground/Background color */}
          <div className="relative w-8 h-6 flex items-center justify-center my-0.5">
            <div className="absolute left-0.5 top-0 w-[18px] h-[18px] bg-black border border-editor-border-light rounded-sm" />
            <div
              className="absolute right-0.5 bottom-0 w-[18px] h-[18px] border border-editor-border-light rounded-sm transition-all duration-500"
              style={{ background: `#${color.hex}` }}
            />
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 bg-editor-canvas-bg overflow-hidden relative flex items-center justify-center">
          <div className="absolute top-0 left-0 right-0 h-5 bg-editor-panel border-b border-editor-border z-10" />
          <div className="absolute top-0 left-0 bottom-0 w-5 bg-editor-panel border-r border-editor-border z-10" />
          <div
            className="bg-white mt-6 ml-6"
            style={{
              width: 360,
              height: 280,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <AnimatedCanvas key={drawKey} color={color} />
          </div>
        </div>

        {/* Right panels */}
        <div className="w-[200px] bg-editor-panel border-l border-editor-border flex flex-col overflow-y-auto flex-shrink-0">
          {/* Color panel */}
          <PanelSection title="Color">
            <div className="mb-1.5 h-6 rounded border border-editor-border-light overflow-hidden">
              <div
                className="w-full h-full transition-all duration-500"
                style={{
                  background: `linear-gradient(to right, #000, #${color.hex})`,
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              {[
                {
                  label: "R",
                  trackBg: "linear-gradient(to right,#000,#f00)",
                  thumbLeft: color.rp,
                  val: color.r,
                },
                {
                  label: "G",
                  trackBg: "linear-gradient(to right,#000,#0f0)",
                  thumbLeft: color.gp,
                  val: color.g,
                },
                {
                  label: "B",
                  trackBg: "linear-gradient(to right,#000,#00f)",
                  thumbLeft: color.bp,
                  val: color.b,
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-1.5">
                  <span className="text-[10px] text-editor-text-muted w-2.5">
                    {row.label}
                  </span>
                  <div
                    className="flex-1 h-1 rounded-full relative overflow-hidden"
                    style={{ background: row.trackBg }}
                  >
                    <div
                      className="absolute w-2.5 h-2.5 rounded-full bg-editor-text border border-editor-border-light top-1/2 -translate-y-1/2 transition-all duration-500"
                      style={{ left: row.thumbLeft }}
                    />
                  </div>
                  <span className="text-[10px] text-editor-text-muted w-6 text-right tabular-nums">
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] text-editor-text-muted">#</span>
              <input
                readOnly
                value={color.hex}
                className="flex-1 bg-editor-input-bg border border-editor-border-light text-editor-text text-[10.5px] px-1.5 py-0.5 rounded font-mono transition-all duration-500 outline-none"
              />
            </div>
          </PanelSection>

          {/* Adjustments */}
          <PanelSection title="Adjustments">
            <div className="flex flex-wrap gap-1">
              {ADJ_BTNS.map((btn, i) => (
                <div
                  key={btn}
                  className={`px-1.5 py-1 text-[9.5px] rounded border cursor-default transition-all ${
                    i === adjIdx
                      ? "bg-editor-accent-subtle border-editor-accent-border text-editor-accent"
                      : "bg-editor-panel-header border-editor-border-light text-editor-text-muted hover:bg-editor-hover hover:text-editor-text"
                  }`}
                >
                  {btn}
                </div>
              ))}
            </div>
            <div className="mt-2 pt-1.5 border-t border-editor-border">
              <div className="text-[10px] text-editor-text-muted mb-1">
                {ADJ_NAMES[adjIdx]}
              </div>
              <SliderRow label="Brightness" value={brightVal} />
              <SliderRow label="Contrast" value={contrastVal} />
            </div>
          </PanelSection>

          {/* Opacity row */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-editor-border">
            <span className="text-[10px] text-editor-text-muted w-11 flex-shrink-0">
              Opacity
            </span>
            <div className="flex-1 h-1 bg-editor-border-light rounded-full relative">
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-editor-text border border-editor-border-light top-1/2 -translate-y-1/2 transition-all duration-500"
                style={{ left: `${Math.max(0, opacity - 2)}%` }}
              />
            </div>
            <span className="text-[10px] text-editor-text w-7 text-right tabular-nums">
              {opacity}%
            </span>
          </div>

          {/* Layers */}
          <div className="flex-1 flex flex-col border-b border-editor-border">
            <div className="h-[26px] flex items-center justify-between px-2.5 bg-editor-panel-header border-b border-editor-border">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-editor-text-muted">
                Layers
              </span>
            </div>
            <div className="flex flex-col gap-0.5 p-2 flex-1">
              {LAYERS.map((layer, i) => (
                <div
                  key={layer.name}
                  className={`flex items-center gap-1.5 px-1.5 py-1 rounded border cursor-default transition-all ${
                    i === activeLayer && !layer.locked
                      ? "bg-editor-accent-subtle border-editor-accent-border"
                      : "bg-editor-panel-header border-transparent hover:bg-editor-hover"
                  }`}
                >
                  <div className="w-6 h-6 rounded border border-editor-border-light flex-shrink-0 bg-editor-canvas-bg overflow-hidden">
                    {layer.thumb && (
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        {!layer.locked && (
                          <rect
                            width="24"
                            height="24"
                            fill={`#${color.hex}`}
                            opacity={0.1}
                          />
                        )}
                        {layer.thumb}
                      </svg>
                    )}
                    {layer.locked && <div className="w-full h-full bg-white" />}
                  </div>
                  <span className="text-[10.5px] text-editor-text flex-1 truncate">
                    {layer.name}
                  </span>
                  <span className="text-[11px] text-editor-text-muted">
                    {layer.locked ? "🔒" : "◉"}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-0.5 p-1.5 border-t border-editor-border">
              {["+", "⊕", "↑", "↓", "🗑"].map((icon) => (
                <div
                  key={icon}
                  className="flex-1 h-5 flex items-center justify-center bg-editor-panel-header border border-editor-border-light rounded text-[11px] text-editor-text-muted cursor-default hover:bg-editor-hover hover:text-editor-text transition-colors"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statusbar */}
      <div className="h-[22px] bg-editor-menubar border-t border-editor-border flex items-center px-2.5 gap-4 flex-shrink-0">
        {[
          "Zoom: 100%",
          "Canvas: 800 × 600 px",
          "Mode: RGB/8",
          `Tool: ${activeTool.label}`,
        ].map((s) => (
          <span key={s} className="text-[10px] text-editor-text-muted">
            {s}
          </span>
        ))}
        <button className="ml-auto bg-editor-accent text-white border-none text-[10.5px] px-3 py-0.5 rounded cursor-default font-sans">
          Save
        </button>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function PanelSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-editor-border flex-shrink-0">
      <div className="h-[26px] flex items-center justify-between px-2.5 bg-editor-panel-header border-b border-editor-border">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-editor-text-muted">
          {title}
        </span>
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

function SliderRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-1.5">
      <div className="text-[10px] text-editor-text-muted mb-1">{label}</div>
      <div className="relative h-1 bg-editor-border-light rounded-full">
        <div
          className="absolute left-0 top-0 h-full bg-editor-accent rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-editor-text border border-editor-border-light top-1/2 -translate-y-1/2 transition-all duration-500"
          style={{ left: `${Math.max(0, value - 2)}%` }}
        />
      </div>
    </div>
  );
}

function ToolBtn({
  children,
  active,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  title?: string;
}) {
  return (
    <div
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-md border cursor-default transition-all ${
        active
          ? "bg-editor-accent-subtle border-editor-accent-border text-editor-accent"
          : "border-transparent text-editor-text-muted hover:bg-editor-hover hover:text-editor-text hover:border-editor-border-light"
      }`}
    >
      {children}
    </div>
  );
}

// Animated SVG canvas
function AnimatedCanvas({ color }: { color: (typeof COLORS)[0] }) {
  return (
    <svg
      width="360"
      height="280"
      viewBox="0 0 360 280"
      style={{ display: "block" }}
    >
      <style>{`
        @keyframes drawStroke {
          from { stroke-dashoffset: 1; opacity: 0; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
        .stroke-1 { animation: drawStroke 1.2s 0.1s cubic-bezier(0.4,0,0.2,1) both; }
        .stroke-2 { animation: drawStroke 1.2s 0.7s cubic-bezier(0.4,0,0.2,1) both; }
        .stroke-3 { animation: drawStroke 1.2s 1.3s cubic-bezier(0.4,0,0.2,1) both; }
        .blob     { animation: blobFade  0.8s 1.6s ease both; }
        @keyframes blobFade { from { opacity: 0; } to { opacity: 0.18; } }
      `}</style>

      {/* Blob behind strokes */}
      <ellipse
        className="blob"
        cx="185"
        cy="140"
        rx="70"
        ry="45"
        fill={`#${color.hex}`}
        opacity={0}
      />

      {STROKE_DEFS.map((s, i) => (
        <path
          key={i}
          className={`stroke-${i + 1}`}
          d={s.attrs.d}
          stroke={i === 0 ? `#${color.hex}` : s.attrs.stroke}
          strokeWidth={s.attrs.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          opacity={0}
        />
      ))}
    </svg>
  );
}

// ── Toolbar Icons ────────────────────────────────────────────────────────────
const ic = (d: string) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);
const MoveIcon = () =>
  ic(
    "M7 1v12M1 7h12M7 1L5 3M7 1L9 3M7 13L5 11M7 13L9 11M1 7L3 5M1 7L3 9M13 7L11 5M13 7L11 9",
  );
const EraserIcon = () => ic("M2 11L7 3L12 8L8 12H2");
const TextIcon = () => ic("M3 3h8M7 3v8M5 11h4");
const BrushIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinejoin="round"
  >
    <path d="M9 2L12 5L5 12C4 12.5 2.5 12.5 2 12C1.5 11.5 1.5 10 2 9L9 2Z" />
  </svg>
);
const MarqueeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect
      x="1.5"
      y="1.5"
      width="11"
      height="11"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeDasharray="2 1.5"
    />
  </svg>
);
const LassoIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
  >
    <path d="M7 2C4 2 2 4 2 6.5C2 9 4 11 7 11C10 11 12 9 12 6.5" />
    <path d="M12 6.5L11 9L10 8" strokeLinejoin="round" />
  </svg>
);
const CloneIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
  >
    <circle cx="5" cy="5" r="3" />
    <path d="M9 9L12 12" strokeLinecap="round" />
    <circle cx="9" cy="9" r="2" />
  </svg>
);
const CropIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 5H10V12" />
    <path d="M5 2V9H12" />
  </svg>
);
const ShapeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect
      x="2"
      y="2"
      width="10"
      height="10"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
);
