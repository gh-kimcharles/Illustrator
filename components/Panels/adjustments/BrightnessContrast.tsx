"use client";

import React, { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { AdjustmentModal } from "./AdjustmentModal";
import { applyBrightnessContrast } from "@/lib/filters";
import { SliderRow } from "@/components/ui/Slider";

interface Props {
  onClose: () => void;
}

export const BrightnessContrast = ({ onClose }: Props) => {
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const { pushHistory } = useEditorStore();

  function handleCommit() {
    pushHistory("Brightness/Contrast");
    onClose();
  }

  return (
    <AdjustmentModal
      title="Brightness / Contrast"
      onCommit={handleCommit}
      onCancel={onClose}
      onPreview={(imageData) => {
        applyBrightnessContrast(imageData, brightness, contrast);
      }}
    >
      {(preview: () => void) => (
        <>
          <SliderRow
            label="Brightness"
            value={brightness}
            min={-100}
            max={100}
            onChange={(v) => {
              setBrightness(v);
              preview();
            }}
          />
          <SliderRow
            label="Contrast"
            value={contrast}
            min={-100}
            max={100}
            onChange={(v) => {
              setContrast(v);
              preview();
            }}
          />
        </>
      )}
    </AdjustmentModal>
  );
};
