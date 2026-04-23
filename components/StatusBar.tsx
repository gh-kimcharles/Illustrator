"use client";

import { useEditorStore } from "@/store/useEditorStore";

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1 text-[11px]">
      <span className="text-editor-textMuted">{label}:</span>
      <span className="text-editor-textPrimary">{value}</span>
    </div>
  );
}

const StatusBar = () => {
  const { zoom, canvasSize, activeTool } = useEditorStore();

  return (
    <div className="h-[22px] bg-editor-menubar border-t border-editor-border flex items-center px-3 gap-4 flex-shrink-0 select-none">
      <StatusItem label="Zoom" value={`${Math.round(zoom * 100)}%`} />
      <StatusItem
        label="Canvas"
        value={`${canvasSize.width} × ${canvasSize.height} px`}
      />
      <StatusItem label="Mode" value="RGB/8" />
      <div className="ml-auto">
        <StatusItem label="Tool" value={`${activeTool} Tool`} />
      </div>
    </div>
  );
};

export default StatusBar;
