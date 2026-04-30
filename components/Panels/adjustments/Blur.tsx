"use client";

import { useEditorStore } from "@/store/useEditorStore";
import React, { useState } from "react";
import { AdjustmentModal } from "./AdjustmentModal";
import { applyGaussianBlur } from "@/lib/filters";
import { SliderRow } from "@/components/ui/Slider";

export const Blur = ({ onClose }: { onClose: () => void }) => {
  const [radius, setRadius] = useState(3);
  const { pushHistory } = useEditorStore();

  return (
    <AdjustmentModal
      title="Gaussian Blur"
      onCommit={() => {
        pushHistory("Blur");
        onClose();
      }}
      onCancel={onClose}
      onPreview={(imageData) => applyGaussianBlur(imageData, radius)}
    >
      {(preview: () => void) => (
        <SliderRow
          label="Radius"
          value={radius}
          min={1}
          max={20}
          onChange={(v) => {
            setRadius(v);
            preview();
          }}
        />
      )}
    </AdjustmentModal>
  );
};
