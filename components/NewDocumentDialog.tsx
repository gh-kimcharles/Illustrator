"use client";

import { useState } from "react";
import { Dialog, DialogButton, NumberInput } from "@/components/ui";

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
    <Dialog
      title="New Document"
      onClose={onCancel}
      footer={
        <>
          <DialogButton variant="default" onClick={onCancel}>
            Cancel
          </DialogButton>
          <DialogButton
            variant="primary"
            onClick={() => onConfirm(width, height)}
          >
            Create
          </DialogButton>
        </>
      }
    >
      {/* Presets */}
      <div className="mb-4">
        <p className="text-[11px] text-editor-text-muted mb-1.5">Presets</p>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setWidth(p.width);
                setHeight(p.height);
              }}
              className="bg-editor-input-bg border border-editor-border-light text-editor-text-muted
                         text-[11px] px-2 py-1.5 hover:bg-editor-hover hover:text-editor-text
                         transition-colors text-left"
            >
              <span className="block font-medium text-editor-text">
                {p.label}
              </span>
              <span className="text-[10px]">
                {p.width} × {p.height}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom */}
      <div className="space-y-2">
        <p className="text-[11px] text-editor-text-muted">Custom Size</p>
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-editor-text-muted w-12">
            Width
          </label>
          <NumberInput
            value={width}
            min={1}
            max={8000}
            onChange={setWidth}
            suffix="px"
            className="w-20"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-editor-text-muted w-12">
            Height
          </label>
          <NumberInput
            value={height}
            min={1}
            max={8000}
            onChange={setHeight}
            suffix="px"
            className="w-20"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default NewDocumentDialog;
