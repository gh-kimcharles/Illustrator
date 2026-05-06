"use client";

import { useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { AdjustmentModal } from "./AdjustmentModal";
import { applyGaussianBlur } from "@/lib/filters";
import { SliderRow } from "@/components/ui/Slider";

export const Blur = ({ onClose }: { onClose: () => void }) => {
  const { pushHistory } = useEditorStore();

  const [radius, setRadius] = useState(3);
  const radiusRef = useRef(3);

  return (
    <AdjustmentModal
      title="Gaussian Blur"
      onCommit={() => {
        pushHistory("Blur");
        onClose();
      }}
      onCancel={onClose}
      onPreview={(imageData) => applyGaussianBlur(imageData, radiusRef.current)}
    >
      {(preview: () => void) => (
        <SliderRow
          label="Radius"
          value={radius}
          min={1}
          max={20}
          onChange={(v) => {
            radiusRef.current = v;
            setRadius(v);
            preview();
          }}
        />
      )}
    </AdjustmentModal>
  );
};
