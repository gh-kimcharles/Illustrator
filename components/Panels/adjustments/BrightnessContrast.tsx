"use client";

import { useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { AdjustmentModal } from "./AdjustmentModal";
import { applyBrightnessContrast } from "@/lib/filters";
import { SliderRow } from "@/components/ui/Slider";

export const BrightnessContrast = ({ onClose }: { onClose: () => void }) => {
  const { pushHistory } = useEditorStore();

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const brightnessRef = useRef(0);
  const contrastRef = useRef(0);

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
        applyBrightnessContrast(
          imageData,
          brightnessRef.current,
          contrastRef.current,
        );
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
              brightnessRef.current = v;
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
              contrastRef.current = v;
              setContrast(v);
              preview();
            }}
          />
        </>
      )}
    </AdjustmentModal>
  );
};
