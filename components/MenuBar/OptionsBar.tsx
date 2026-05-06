"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { NumberInput, Slider } from "@/components/ui";

const HintBar = ({ children }: { children: React.ReactNode }) => (
  <div className="text-editor-text-muted">{children}</div>
);

const OptionsBar = () => {
  const { activeTool, brush, setBrush } = useEditorStore();

  return (
    <div className="flex items-center h-8 bg-editor-optbar border-b border-editor-border px-3 gap-3 flex-shrink-0 text-[11px] text-editor-text-muted select-none overflow-x-auto">
      {/* Active tool label */}
      <span className="text-editor-text font-medium min-w-max">
        {activeTool} Tool
      </span>

      <div className="editor-sep" />

      {/* Brush settings - only when brush/eraser is active */}
      {(activeTool === "Brush" || activeTool === "Eraser") && (
        <>
          <span>Size:</span>
          <NumberInput
            value={brush.size}
            min={1}
            max={500}
            onChange={(v) => setBrush({ size: v })}
            suffix="px"
          />
          <div className="editor-sep" />
          <span>Opacity:</span>
          <Slider
            min={1}
            max={100}
            value={brush.opacity}
            onChange={(v) => setBrush({ opacity: v })}
            className="w-28"
          />
          <span>{brush.opacity}%</span>
          <div className="editor-sep" />
          <span>Hardness:</span>
          <Slider
            min={0}
            max={100}
            value={brush.hardness}
            onChange={(v) => setBrush({ hardness: v })}
            className="w-28"
          />
          <span>{brush.hardness}%</span>
        </>
      )}

      {/* Tool with functionalities */}
      {activeTool === "Move" && (
        <HintBar>Click on selected objects to drag and move</HintBar>
      )}
      {activeTool === "Marquee" && (
        <HintBar>Click to select a rectangular area of the canvas</HintBar>
      )}
      {activeTool === "Lasso" && (
        <HintBar>Click to draw freeform selection of the canvas</HintBar>
      )}
      {activeTool === "Crop" && (
        <HintBar>Hold to trim or adjust the canvas</HintBar>
      )}
      {activeTool === "Eyedropper" && (
        <HintBar>Click on canvas to pick a color</HintBar>
      )}
      {activeTool === "Fill" && (
        <HintBar>Click on canvas to fill selected areas</HintBar>
      )}
      {activeTool === "Text" && (
        <HintBar>Click on canvas to add text input</HintBar>
      )}
      {activeTool === "Shape" && (
        <HintBar>Click on canvas to add geometric shapes selection</HintBar>
      )}
      {activeTool === "Zoom" && (
        <HintBar>Scroll to zoom · Ctrl+scroll also works</HintBar>
      )}
      {activeTool === "Hand" && (
        <HintBar>Click on canvas to pan and navigate</HintBar>
      )}
    </div>
  );
};

export default OptionsBar;
