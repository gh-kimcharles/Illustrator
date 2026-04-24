"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { ToolName } from "@/types";
import { rgbToCss } from "@/utils/color";
import { ToolButton } from "@/components/ui";

interface ToolDef {
  id: ToolName;
  shortcut: string;
  label: string;
  icon: React.ReactNode;
}

const tools: (ToolDef | "separator")[] = [
  {
    id: "Move",
    shortcut: "V",
    label: "Move",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1l2 3H9v3h3V6l3 2-3 2V9h-3v3h1L8 15l-2-3h1V9H4v1L1 8l3-2v1h3V4H6L8 1z" />
      </svg>
    ),
  },
  {
    id: "Marquee",
    shortcut: "M",
    label: "Rectangular Marquee",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="1" y="1" width="12" height="12" strokeDasharray="2 1.5" />
      </svg>
    ),
  },
  {
    id: "Lasso",
    shortcut: "L",
    label: "Lasso",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M7 2C3 2 1 4 1 7c0 3 2 5 5 5 2 0 4-1 5-3l2 1"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  "separator",
  {
    id: "Crop",
    shortcut: "C",
    label: "Crop",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 1v10h10M1 3h10v10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "Eyedropper",
    shortcut: "I",
    label: "Eyedropper",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M11 2a2 2 0 010 2.8L6.4 9.4 4 10l.6-2.4L9.2 3A2 2 0 0111 2zM2 11l1.5 1.5-1 .5-.5-1L2 11z" />
      </svg>
    ),
  },
  "separator",
  {
    id: "Brush",
    shortcut: "B",
    label: "Brush",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M10 2l2 2L5 11c-1 1-3 1-3 1s0-2 1-3L10 2zM3 11a1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1 1 1 0 00-1 1z" />
      </svg>
    ),
  },
  {
    id: "Eraser",
    shortcut: "E",
    label: "Eraser",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M2 10L8 4l4 4-3 3H2zM6 12h6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "Fill",
    shortcut: "G",
    label: "Paint Bucket",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M2 9L7 2l5 5-3 3H2zm9 2a1.5 1.5 0 01-1.5-1.5c0-.8.7-1.5 1.5-2.5.8 1 1.5 1.7 1.5 2.5A1.5 1.5 0 0111 11z" />
      </svg>
    ),
  },
  "separator",
  {
    id: "Text",
    shortcut: "T",
    label: "Text",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M2 3h10v2H9v6H5V5H2V3z" />
      </svg>
    ),
  },
  {
    id: "Shape",
    shortcut: "U",
    label: "Shape",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2" y="2" width="10" height="10" rx="1" />
      </svg>
    ),
  },
  "separator",
  {
    id: "Zoom",
    shortcut: "Z",
    label: "Zoom",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="6" cy="6" r="4" />
        <line x1="9" y1="9" x2="13" y2="13" />
        <line x1="4" y1="6" x2="8" y2="6" />
        <line x1="6" y1="4" x2="6" y2="8" />
      </svg>
    ),
  },
  {
    id: "Hand",
    shortcut: "H",
    label: "Hand",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M6 1a1 1 0 011 1v4h.5a1 1 0 011 1v.5h.5a1 1 0 011 1V9h.5a1 1 0 011 1v1.5A3 3 0 019.5 14H6a3 3 0 01-3-3V7.5a1 1 0 011-1H5V2a1 1 0 011-1z" />
      </svg>
    ),
  },
];

const Toolbar = () => {
  const { activeTool, setActiveTool, fgColor, bgColor, swapColors } =
    useEditorStore();

  return (
    <div className="w-11 bg-editor-toolbar border-r border-editor-border flex flex-col items-center py-1 gap-px flex-shrink-0 overflow-y-auto">
      {tools.map((tool, i) => {
        if (tool === "separator") {
          return (
            <div
              key={`sep-${i}`}
              className="w-7 h-px bg-editor-border-light my-0.5"
            />
          );
        }
        return (
          <ToolButton
            key={tool.id}
            active={activeTool === tool.id}
            onClick={() => setActiveTool(tool.id)}
            title={`${tool.label} (${tool.shortcut})`}
          >
            {tool.icon}
          </ToolButton>
        );
      })}

      {/* Separator */}
      <div className="w-7 h-px bg-editor-border-light my-1" />

      {/* FG / BG color swatches */}
      <div
        className="relative w-9 h-9 cursor-pointer my-1"
        onClick={swapColors}
        title="Swap foreground/background colors (X)"
      >
        {/* BG swatch */}
        <div
          className="absolute bottom-0.5 right-0.5 w-5 h-5 border-2 border-editor-border-light"
          style={{ background: rgbToCss(bgColor) }}
        />

        {/* FG swatch */}
        <div
          className="absolute top-0.5 left-0.5 w-5 h-5 border-2 z-10"
          style={{
            background: rgbToCss(fgColor),
            borderColor: "var(--editor-text-muted)",
          }}
        />
        {/* Swap indicator */}
        <span className="absolute bottom-0 left-0 text-[8px] text-editor-text-muted leading-none z-20">
          ↺
        </span>
      </div>
    </div>
  );
};

export default Toolbar;
