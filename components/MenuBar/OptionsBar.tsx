"use client";

import { useEditorStore } from "@/store/useEditorStore";

const OptionsBar = () => {
  const { activeTool, brush, setBrush } = useEditorStore();

  return (
    <div className="flex items-center h-8 bg-editor-optbar border-b border-editor-border px-3 gap-3 flex-shrink-0 text-[11px] text-editor-textMuted select-none overflow-x-auto">
      {/* Active tool label */}
      <span className="text-editor-textPrimary font-medium min-w-max">
        {activeTool} Tool
      </span>

      <div className="w-px h-5 bg-editor-borderLight flex-shrink-0" />

      {/* Brush settings - only when brush/eraser is active */}
      {(activeTool === "Brush" || activeTool === "Eraser") && (
        <>
          <span>Size:</span>
          <input
            type="number"
            value={brush.size}
            min={1}
            max={500}
            onChange={(e) => setBrush({ size: Number(e.target.value) })}
            className="w-14 bg-[#2a2a2a] border border-editor-border text-editor-textPrimary px-1.5 py-0.5 text-center text-[11px] outline-none focus:border-editor-active"
          />
          <span>px</span>

          <div className="w-px h-5 bg-editor-borderLight flex-shrink-0" />

          <span>Opacity:</span>
          <input
            type="range"
            min={1}
            max={100}
            value={brush.opacity}
            onChange={(e) => setBrush({ opacity: Number(e.target.value) })}
            className="w-24"
          />
          <span className="w-8 text-editor-textPrimary">{brush.opacity}%</span>

          <div className="w-px h-5 bg-editor-borderLight flex-shrink-0" />

          <span>Hardness:</span>
          <input
            type="range"
            min={0}
            max={100}
            value={brush.hardness}
            onChange={(e) => setBrush({ hardness: Number(e.target.value) })}
            className="w-24"
          />
          <span className="w-8 text-editor-textPrimary">{brush.hardness}%</span>
        </>
      )}

      {/* Zoom percentage display */}
      {activeTool === "Zoom" && (
        <>
          <span>Tip: Scroll to zoom · Ctrl+scroll also works</span>
        </>
      )}
    </div>
  );
};

export default OptionsBar;
