"use client";

import { useEditorStore } from "@/store/useEditorStore";
import React, { useEffect } from "react";
import { AdjustmentModal } from "./AdjustmentModal";
import { applyInvert } from "@/lib/filters";

export const Invert = ({ onClose }: { onClose: () => void }) => {
  const { pushHistory } = useEditorStore();

  return (
    <AdjustmentModal
      title="Invert"
      onCommit={() => {
        pushHistory("Invert");
        onClose();
      }}
      onCancel={onClose}
      onPreview={(imageData) => applyInvert(imageData)}
    >
      {(preview: () => void) => {
        // Auto-preview on mount — no sliders needed
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          preview();
        }, []);
        return (
          <p className="text-[11px] text-editor-text-muted text-center py-2">
            Inverts all colour channels on the active layer.
          </p>
        );
      }}
    </AdjustmentModal>
  );
};
