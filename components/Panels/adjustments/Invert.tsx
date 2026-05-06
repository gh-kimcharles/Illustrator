"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { AdjustmentModal } from "./AdjustmentModal";
import { applyInvert } from "@/lib/filters";

export const Invert = ({ onClose }: { onClose: () => void }) => {
  const { pushHistory } = useEditorStore();

  return (
    <AdjustmentModal
      title="Invert"
      autoPreview={true}
      onCommit={() => {
        pushHistory("Invert");
        onClose();
      }}
      onCancel={onClose}
      onPreview={(imageData) => applyInvert(imageData)}
    >
      {() => (
        <p className="text-[11px] text-editor-text-muted text-center py-2">
          Inverts all colour channels on the active layer.
        </p>
      )}
    </AdjustmentModal>
  );
};
