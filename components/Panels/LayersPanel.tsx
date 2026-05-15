"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { IconButton, Panel, Select, Slider } from "@/components/ui";
import { GroupedBlendModes } from "./BlendModes";
import { LockIcon, NonVisibleIcon, VisibleIcon } from "@/assets/icons/tools";

// update: use GroupedBlendModes from ./BlendModes; separated concerns for layers and blend modes
const BLEND_MODES = GroupedBlendModes();

const LayersPanel = () => {
  const {
    layers,
    activeLayerId,
    setActiveLayer,
    addLayer,
    deleteLayer,
    duplicateLayer,
    setLayerVisibility,
    setLayerOpacity,
    setLayerBlendMode,
    setLayerName,
    moveLayerUp,
    moveLayerDown,
  } = useEditorStore();

  const activeLayer = layers.find((l) => l.id === activeLayerId);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  function startRename(id: string, current: string) {
    setRenamingId(id);
    setRenameValue(current);
  }

  function commitRename(id: string) {
    if (renameValue.trim()) setLayerName(id, renameValue.trim());
    setRenamingId(null);
  }

  return (
    <Panel title="Layers">
      {/* Blend mode */}
      <div className="space-y-1.5 mb-2">
        <Select
          value={activeLayer?.blendMode ?? "normal"}
          onChange={(v) => activeLayer && setLayerBlendMode(activeLayer.id, v)}
          groups={BLEND_MODES}
        />

        {/* Opacity */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-editor-text-muted w-12 flex-shrink-0">
            Opacity:
          </span>
          <Slider
            min={0}
            max={100}
            value={activeLayer?.opacity ?? 100}
            onChange={(v) => activeLayer && setLayerOpacity(activeLayer.id, v)}
            showValue={false}
          />
          <span className="text-[11px] text-editor-text w-8 text-right flex-shrink-0">
            {activeLayer?.opacity ?? 100}%
          </span>
        </div>
      </div>

      {/* Lock row */}
      <div className="flex items-center gap-1 mb-2">
        <span className="text-[10px] text-editor-text-muted mr-1">Lock:</span>
        {["⬜", "🖌", "✛", "🔒"].map((icon, i) => (
          <button
            key={i}
            title="Coming in Phase 2"
            className="w-5 h-5 flex items-center justify-center border border-editor-border-light
                       text-editor-text-muted text-[10px] hover:bg-editor-hover transition-colors"
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Layer list — reversed (top layer first) */}
      <div className="space-y-px mb-2 max-h-64 overflow-y-auto">
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            onDoubleClick={() => startRename(layer.id, layer.name)}
            className={`editor-layer-item ${layer.id === activeLayerId ? "editor-layer-item-active" : ""}`}
          >
            {/* Visibility eye */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLayerVisibility(layer.id, !layer.visible);
              }}
              className="text-[12px] w-4 flex-shrink-0 hover:opacity-70 transition-opacity"
              title={layer.visible ? "Hide layer" : "Show layer"}
            >
              {layer.visible ? (
                <span className="text-editor-text-muted">
                  <VisibleIcon size={12} />
                </span>
              ) : (
                <span className="text-editor-text-disabled">
                  <NonVisibleIcon size={12} />
                </span>
              )}
            </button>

            {/* Thumbnail */}
            <div
              className="w-7 h-7 flex-shrink-0 border border-editor-border-light overflow-hidden"
              style={{
                backgroundImage:
                  "repeating-conic-gradient(#555 0% 25%, #333 0% 50%)",
                backgroundSize: "6px 6px",
              }}
            />

            {/* Name / rename input */}
            {renamingId === layer.id ? (
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => commitRename(layer.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename(layer.id);
                  if (e.key === "Escape") setRenamingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 editor-input text-[11px]"
              />
            ) : (
              <span className="flex-1 text-[11px] text-editor-text truncate">
                {layer.name}
              </span>
            )}

            {layer.locked && (
              <span className="text-editor-text-muted flex-shrink-0">
                <LockIcon size={12} />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1.5 border-t border-editor-border-light">
        {/* Reorder */}
        <div className="flex gap-1">
          <IconButton
            onClick={() => activeLayerId && moveLayerUp(activeLayerId)}
            title="Move layer up"
          >
            ↑
          </IconButton>
          <IconButton
            onClick={() => activeLayerId && moveLayerDown(activeLayerId)}
            title="Move layer down"
          >
            ↓
          </IconButton>
        </div>
        {/* CRUD */}
        <div className="flex gap-1">
          <IconButton onClick={() => addLayer()} title="New layer">
            +
          </IconButton>
          <IconButton
            onClick={() => activeLayerId && duplicateLayer(activeLayerId)}
            title="Duplicate layer"
          >
            ⧉
          </IconButton>
          <IconButton
            onClick={() => activeLayerId && deleteLayer(activeLayerId)}
            danger
            title="Delete layer"
          >
            🗑
          </IconButton>
        </div>
      </div>
    </Panel>
  );
};

export default LayersPanel;
