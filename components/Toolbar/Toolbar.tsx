"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { ToolName } from "@/types";
import { rgbToCss } from "@/utils/color";
import { ToolButton } from "@/components/ui";
import {
  BrushOutline,
  CropOutline,
  EraserOutline,
  EyedropperOutline,
  FillOutline,
  HandSolid,
  LassoOutline,
  MoveOutline,
  SelectionOutline,
  TextOutline,
  ZoomOutline,
} from "@/assets/icons/tools";
import { ShapeOutline } from "@/assets/icons/tools/shape-outline";

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
    icon: <MoveOutline strokeWidth={1.6} />,
  },
  {
    id: "Marquee",
    shortcut: "M",
    label: "Rectangular Marquee",
    icon: <SelectionOutline />,
  },
  {
    id: "Lasso",
    shortcut: "L",
    label: "Lasso",
    icon: <LassoOutline />,
  },
  "separator",
  {
    id: "Crop",
    shortcut: "C",
    label: "Crop",
    icon: <CropOutline />,
  },
  {
    id: "Eyedropper",
    shortcut: "I",
    label: "Eyedropper",
    icon: <EyedropperOutline />,
  },
  "separator",
  {
    id: "Brush",
    shortcut: "B",
    label: "Brush",
    icon: <BrushOutline />,
  },
  {
    id: "Eraser",
    shortcut: "E",
    label: "Eraser",
    icon: <EraserOutline />,
  },
  {
    id: "Fill",
    shortcut: "G",
    label: "Paint Bucket",
    icon: <FillOutline />,
  },
  "separator",
  {
    id: "Text",
    shortcut: "T",
    label: "Text",
    icon: <TextOutline />,
  },
  {
    id: "Shape",
    shortcut: "U",
    label: "Shape",
    icon: <ShapeOutline />,
  },
  "separator",
  {
    id: "Zoom",
    shortcut: "Z",
    label: "Zoom",
    icon: <ZoomOutline strokeWidth={1.6} />,
  },
  {
    id: "Hand",
    shortcut: "H",
    label: "Hand",
    icon: <HandSolid />,
  },
];

const Toolbar = () => {
  const { activeTool, setActiveTool, fgColor, bgColor, swapColors } =
    useEditorStore();

  return (
    <div className="bg-editor-toolbar border-r border-editor-border flex flex-col items-center p-1.5 gap-px flex-shrink-0">
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
