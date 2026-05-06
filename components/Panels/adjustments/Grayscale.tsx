"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { AdjustmentModal } from "./AdjustmentModal";
import { applyGrayscale } from "@/lib/filters";

export const Grayscale = ({ onClose }: { onClose: () => void }) => {
  const { pushHistory } = useEditorStore();

  return (
    <AdjustmentModal
      title="Grayscale"
      autoPreview={true}
      onCommit={() => {
        pushHistory("Grayscale");
        onClose();
      }}
      onCancel={onClose}
      onPreview={(imageData) => applyGrayscale(imageData)}
    >
      {() => (
        <p className="text-[11px] text-editor-text-muted text-center py-2">
          Converts the active layer to grayscale using the BT.709 luminance
          formula.
        </p>
      )}
    </AdjustmentModal>
  );
};
