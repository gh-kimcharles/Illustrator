"use client";

import { useState } from "react";

interface SaveProjectModalProps {
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

export function SaveProjectModal({
  onSave,
  onCancel,
  saving,
}: SaveProjectModalProps) {
  const [name, setName] = useState("Untitled Project");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave(name.trim() || "Untitled Project");
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-editor-panel border border-editor-border-light w-80 shadow-2xl">
        <div className="px-4 py-3 bg-editor-panel-header border-b border-editor-border flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-editor-text">
            Save Project
          </h2>
          <button
            onClick={onCancel}
            className="text-editor-text-muted hover:text-editor-text text-lg leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] text-editor-text-muted uppercase tracking-wide">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full editor-input px-3 py-2 text-[13px]"
              autoFocus
              placeholder="Untitled Project"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 text-[12px] border border-editor-border-light text-editor-text-muted hover:bg-editor-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 text-[12px] bg-editor-accent text-white hover:bg-editor-accent-hover transition-colors disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
