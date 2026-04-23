"use client";

import { useState } from "react";

interface Props {
  onConfirm: (width: number, height: number) => void;
  onCancel: () => void;
}

const PRESETS = [
  { label: "Web HD", width: 1920, height: 1080 },
  { label: "Square", width: 1000, height: 1000 },
  { label: "A4", width: 2480, height: 3508 },
  { label: "Default", width: 800, height: 600 },
];

const NewDocumentDialog = ({ onConfirm, onCancel }: Props) => {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-[#2a2a2a] border border-editor-borderLight w-80 shadow-2xl">
        {/* Header */}
        <div className="bg-editor-panelHeader px-4 py-2 border-b border-editor-border">
          <h2 className="text-[13px] font-semibold text-editor-textPrimary">
            New Document
          </h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Presets */}
          <div>
            <p className="text-[11px] text-editor-textMuted mb-1.5">Presets</p>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setWidth(p.width);
                    setHeight(p.height);
                  }}
                  className="bg-[#1e1e1e] border border-editor-borderLight text-editor-textMuted text-[11px] px-2 py-1.5 hover:bg-editor-hover hover:text-editor-textPrimary transition-colors text-left"
                >
                  <span className="block font-medium">{p.label}</span>
                  <span className="text-[10px]">
                    {p.width} × {p.height}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom size */}
          <div className="space-y-2">
            <p className="text-[11px] text-editor-textMuted">Custom Size</p>
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-editor-textMuted w-12">
                Width
              </label>
              <input
                type="number"
                value={width}
                min={1}
                max={8000}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="flex-1 bg-[#1e1e1e] border border-editor-borderLight text-editor-textPrimary px-2 py-1 text-[11px] outline-none focus:border-editor-active"
              />
              <span className="text-[11px] text-editor-textMuted">px</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-editor-textMuted w-12">
                Height
              </label>
              <input
                type="number"
                value={height}
                min={1}
                max={8000}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="flex-1 bg-[#1e1e1e] border border-editor-borderLight text-editor-textPrimary px-2 py-1 text-[11px] outline-none focus:border-editor-active"
              />
              <span className="text-[11px] text-editor-textMuted">px</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 pb-4">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-[12px] border border-editor-borderLight text-editor-textMuted hover:bg-editor-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(width, height)}
            className="px-4 py-1.5 text-[12px] bg-editor-active text-white hover:bg-[#3a80c9] transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewDocumentDialog;
