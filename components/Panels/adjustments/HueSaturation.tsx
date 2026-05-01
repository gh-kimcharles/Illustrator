"use client";

import React, { useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { AdjustmentModal } from "./AdjustmentModal";
import { applyHueSaturation } from "@/lib/filters";
import { SliderRow } from "@/components/ui/Slider";

interface Props {
  onClose: () => void;
}

export const HueSaturation = ({ onClose }: Props) => {
  const { pushHistory } = useEditorStore();

  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(0);

  // add: refs to hold latest values synchronously
  const hueRef = useRef(0);
  const saturationRef = useRef(0);
  const lightnessRef = useRef(0);

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
        applyHueSaturation(
          imageData,
          hueRef.current,
          saturationRef.current,
          lightnessRef.current,
        );
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
              hueRef.current = v;
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
              saturationRef.current = v;
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
              lightnessRef.current = v;
              setLightness(v);
              preview();
            }}
          />
        </>
      )}
    </AdjustmentModal>
  );
};
