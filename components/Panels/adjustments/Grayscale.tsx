"use client";

import { useEditorStore } from "@/store/useEditorStore";
import React, { useEffect } from "react";
import { AdjustmentModal } from "./AdjustmentModal";
import { applyGrayscale } from "@/lib/filters";

export const Grayscale = ({ onClose }: { onClose: () => void }) => {
  const { pushHistory } = useEditorStore();

  return (
    <AdjustmentModal
      title="Grayscale"
      onCommit={() => {
        pushHistory("Grayscale");
        onClose();
      }}
      onCancel={onClose}
      onPreview={(imageData) => applyGrayscale(imageData)}
    >
      {(preview: () => void) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          preview();
        }, []);
        return (
          <p className="text-[11px] text-editor-text-muted text-center py-2">
            Converts the active layer to grayscale using the BT.709 luminance
            formula.
          </p>
        );
      }}
    </AdjustmentModal>
  );
};
