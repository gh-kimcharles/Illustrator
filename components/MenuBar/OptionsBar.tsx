"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { NumberInput, Slider } from "@/components/ui";

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
      {activeTool === "Zoom" && (
        <span className="text-editor-text-muted">
          Scroll to zoom · Ctrl+scroll also works
        </span>
      )}
      {activeTool === "Fill" && (
        <span className="text-editor-text-muted">
          Click on canvas to fill · Tolerance: 32px
        </span>
      )}
      {activeTool === "Eyedropper" && (
        <span className="text-editor-text-muted">
          Click on canvas to pick a color
        </span>
      )}
    </div>
  );
};

export default OptionsBar;
