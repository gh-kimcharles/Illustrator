"use client";

import { useEditorStore } from "@/store/useEditorStore";
import type { BlendMode } from "@/types";
import React, { useState } from "react";

const BLEND_MODES: { value: BlendMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "darken", label: "Darken" },
  { value: "lighten", label: "Lighten" },
  { value: "color-dodge", label: "Color Dodge" },
  { value: "color-burn", label: "Color Burn" },
  { value: "hard-light", label: "Hard Light" },
  { value: "soft-light", label: "Soft Light" },
  { value: "difference", label: "Difference" },
  { value: "exclusion", label: "Exclusion" },
  { value: "hue", label: "Hue" },
  { value: "saturation", label: "Saturation" },
  { value: "color", label: "Color" },
  { value: "luminosity", label: "Luminosity" },
];

function PanelSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-editor-border flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full h-[26px] flex items-center justify-between px-2.5 bg-editor-panelHeader border-b border-editor-border hover:bg-editor-hover transition-colors"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide text-editor-textMuted">
          {title}
        </span>
        <span className="text-[10px] text-editor-textMuted">
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open && <div className="p-2.5">{children}</div>}
    </div>
  );
}

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
    <PanelSection title="Layers">
      {/* Blend mode + opacity */}
      <div className="space-y-1.5 mb-2">
        <select
          value={activeLayer?.blendMode ?? "normal"}
          onChange={(e) =>
            activeLayer &&
            setLayerBlendMode(activeLayer.id, e.target.value as BlendMode)
          }
          className="w-full bg-[#1e1e1e] border border-editor-borderLight text-editor-textPrimary text-[11px] px-1.5 py-0.5 outline-none focus:border-editor-active"
        >
          {BLEND_MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-editor-textMuted w-11">
            Opacity:
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={activeLayer?.opacity ?? 100}
            onChange={(e) =>
              activeLayer &&
              setLayerOpacity(activeLayer.id, Number(e.target.value))
            }
            className="flex-1"
          />
          <span className="text-[11px] text-editor-textPrimary w-8 text-right">
            {activeLayer?.opacity ?? 100}%
          </span>
        </div>
      </div>

      {/* Lock row */}
      <div className="flex items-center gap-1 mb-2">
        <span className="text-[10px] text-editor-textMuted mr-1">Lock:</span>
        {["⬜", "🖌", "✛", "🔒"].map((icon, i) => (
          <button
            key={i}
            title="Coming in Phase 2"
            className="w-5 h-5 flex items-center justify-center bg-transparent border border-editor-borderLight text-editor-textMuted text-[10px] hover:bg-editor-hover"
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Layer list - renders top-to-bottom (reversed) */}
      <div className="space-y-px mb-2">
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            onDoubleClick={() => startRename(layer.id, layer.name)}
            className={`flex items-center gap-1.5 px-1.5 py-1 cursor-pointer border min-h-[36px] transition-colors ${
              layer.id === activeLayerId
                ? "bg-editor-active/20 border-editor-active/40"
                : "bg-[#2a2a2a] border-transparent hover:bg-editor-hover"
            }`}
          >
            {/* Visibility toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLayerVisibility(layer.id, !layer.visible);
              }}
              className="text-[12px] w-4 flex-shrink-0 hover:opacity-70"
              title={layer.visible ? "Hide layer" : "Show layer"}
            >
              {layer.visible ? (
                "👁"
              ) : (
                <span className="text-editor-border">○</span>
              )}
            </button>

            {/* Thumbnail placeholder */}
            <div
              className="w-7 h-7 flex-shrink-0 border border-[#444] overflow-hidden"
              style={{
                backgroundImage:
                  "repeating-conic-gradient(#aaa 0% 25%, #fff 0% 50%)",
                backgroundSize: "6px 6px",
              }}
            />

            {/* Name */}
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
                className="flex-1 bg-[#1e1e1e] border border-editor-active text-editor-textPrimary text-[11px] px-1 outline-none"
              />
            ) : (
              <span className="flex-1 text-[11px] text-editor-textPrimary truncate">
                {layer.name}
              </span>
            )}

            {layer.locked && (
              <span className="text-[10px] text-editor-textMuted flex-shrink-0">
                🔒︎
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex justify-between items-center pt-1.5 border-t border-editor-borderLight">
        {/* Reorder */}
        <div className="flex gap-1">
          <button
            onClick={() => activeLayerId && moveLayerUp(activeLayerId)}
            title="Move layer up"
            className="w-6 h-6 flex items-center justify-center bg-transparent border border-editor-borderLight text-editor-textMuted text-[11px] hover:bg-editor-hover hover:text-editor-textPrimary"
          >
            ↑
          </button>
          <button
            onClick={() => activeLayerId && moveLayerDown(activeLayerId)}
            title="Move layer down"
            className="w-6 h-6 flex items-center justify-center bg-transparent border border-editor-borderLight text-editor-textMuted text-[11px] hover:bg-editor-hover hover:text-editor-textPrimary"
          >
            ↓
          </button>
        </div>

        {/* CRUD */}
        <div className="flex gap-1">
          <button
            onClick={() => addLayer()}
            title="New layer"
            className="w-6 h-6 flex items-center justify-center bg-transparent border border-editor-borderLight text-editor-textMuted text-[14px] hover:bg-editor-hover hover:text-editor-textPrimary"
          >
            +
          </button>
          <button
            onClick={() => activeLayerId && duplicateLayer(activeLayerId)}
            title="Duplicate layer"
            className="w-6 h-6 flex items-center justify-center bg-transparent border border-editor-borderLight text-editor-textMuted text-[10px] hover:bg-editor-hover hover:text-editor-textPrimary"
          >
            ⧉
          </button>
          <button
            onClick={() => activeLayerId && deleteLayer(activeLayerId)}
            title="Delete layer"
            className="w-6 h-6 flex items-center justify-center bg-transparent border border-editor-borderLight text-editor-textMuted text-[12px] hover:bg-red-900/50 hover:text-red-300 hover:border-red-800"
          >
            🗑
          </button>
        </div>
      </div>
    </PanelSection>
  );
};

export default LayersPanel;
