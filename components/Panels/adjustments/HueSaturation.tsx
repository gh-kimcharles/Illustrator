"use client";

import React, { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { AdjustmentModal } from "./AdjustmentModal";
import { applyHueSaturation } from "@/lib/filters";
import { SliderRow } from "@/components/ui/Slider";

interface Props {
  onClose: () => void;
}

export const HueSaturation = ({ onClose }: Props) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(0);
  const { pushHistory } = useEditorStore();

  function handleCommit() {
    pushHistory("Hue/Saturation");
    onClose();
  }

  return (
    <AdjustmentModal
      title="Hue / Saturation"
      onCommit={handleCommit}
      onCancel={onClose}
      onPreview={(imageData) => {
        applyHueSaturation(imageData, hue, saturation, lightness);
      }}
    >
      {(preview: () => void) => (
        <>
          <SliderRow
            label="Hue"
            value={hue}
            min={-180}
            max={180}
            onChange={(v) => {
              setHue(v);
              preview();
            }}
          />
          <SliderRow
            label="Saturation"
            value={saturation}
            min={-100}
            max={100}
            onChange={(v) => {
              setSaturation(v);
              preview();
            }}
          />
          <SliderRow
            label="Lightness"
            value={lightness}
            min={-100}
            max={100}
            onChange={(v) => {
              setLightness(v);
              preview();
            }}
          />
        </>
      )}
    </AdjustmentModal>
  );
};
