"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { ToolName } from "@/types";
import { rgbToCss } from "@/utils/color";
import { ToolButton } from "@/components/ui";
import {
  BrushIcon,
  CropIcon,
  EraserIcon,
  EyedropperIcon,
  FillIcon,
  HandIcon,
  LassoIcon,
  MoveIcon,
  SelectionIcon,
  TextIcon,
  ShapeIcon,
  ZoomIcon,
  SwapIcon,
} from "@/assets/icons/tools";

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
    icon: <MoveIcon strokeWidth={1.6} />,
  },
  {
    id: "Marquee",
    shortcut: "M",
    label: "Rectangular Marquee",
    icon: <SelectionIcon />,
  },
  {
    id: "Lasso",
    shortcut: "L",
    label: "Lasso",
    icon: <LassoIcon />,
  },
  "separator",
  {
    id: "Crop",
    shortcut: "C",
    label: "Crop",
    icon: <CropIcon />,
  },
  {
    id: "Eyedropper",
    shortcut: "I",
    label: "Eyedropper",
    icon: <EyedropperIcon />,
  },
  "separator",
  {
    id: "Brush",
    shortcut: "B",
    label: "Brush",
    icon: <BrushIcon />,
  },
  {
    id: "Eraser",
    shortcut: "E",
    label: "Eraser",
    icon: <EraserIcon />,
  },
  {
    id: "Fill",
    shortcut: "G",
    label: "Paint Bucket",
    icon: <FillIcon />,
  },
  "separator",
  {
    id: "Text",
    shortcut: "T",
    label: "Text",
    icon: <TextIcon />,
  },
  {
    id: "Shape",
    shortcut: "U",
    label: "Shape",
    icon: <ShapeIcon />,
  },
  "separator",
  {
    id: "Zoom",
    shortcut: "Z",
    label: "Zoom",
    icon: <ZoomIcon strokeWidth={1.6} />,
  },
  {
    id: "Hand",
    shortcut: "H",
    label: "Hand",
    icon: <HandIcon />,
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
          <SwapIcon size={9} />
        </span>
      </div>
    </div>
  );
};

export default Toolbar;
