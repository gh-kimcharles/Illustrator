"use client";

import { useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { AdjustmentModal } from "./AdjustmentModal";
import { applyLevels } from "@/lib/filters";
import { SliderRow } from "@/components/ui/Slider";

interface Props {
  onClose: () => void;
}

export const Levels = ({ onClose }: Props) => {
  const { pushHistory } = useEditorStore();

  const [inMin, setInMin] = useState(0);
  const [inMax, setInMax] = useState(255);
  const [gamma, setGamma] = useState(100); // stored ×100 for slider (1.00 = 100)
  const [outMin, setOutMin] = useState(0);
  const [outMax, setOutMax] = useState(255);

  // add: refs to hold latest values synchronously
  const inMinRef = useRef(0);
  const inMaxRef = useRef(255);
  const gammaRef = useRef(100);
  const outMinRef = useRef(0);
  const outMaxRef = useRef(255);

  function handleCommit() {
    pushHistory("Levels");
    onClose();
  }

  // Gamma is stored as integer 10–999 (representing 0.10–9.99)
  const gammaFloat = gamma / 100;

  return (
    <AdjustmentModal
      title="Levels"
      onCommit={handleCommit}
      onCancel={onClose}
      onPreview={(imageData) =>
        applyLevels(
          imageData,
          inMinRef.current,
          inMaxRef.current,
          gammaRef.current / 100,
          outMinRef.current,
          outMaxRef.current,
        )
      }
    >
      {(preview: () => void) => (
        <>
          <p className="text-[10px] text-editor-text-muted uppercase tracking-wide">
            Input Levels
          </p>
          <SliderRow
            label="Shadows (in)"
            value={inMin}
            min={0}
            max={253}
            onChange={(v) => {
              const clamped = Math.min(v, inMaxRef.current - 2);
              inMinRef.current = clamped;
              setInMin(clamped);
              preview();
            }}
          />
          <SliderRow
            label="Highlights (in)"
            value={inMax}
            min={2}
            max={255}
            onChange={(v) => {
              const clamped = Math.max(v, inMinRef.current + 2);
              inMaxRef.current = clamped;
              setInMax(clamped);
              preview();
            }}
          />
          <SliderRow
            label={`Gamma (${gammaFloat.toFixed(2)})`}
            value={gamma}
            min={10}
            max={999}
            onChange={(v) => {
              gammaRef.current = v;
              setGamma(v);
              preview();
            }}
          />

          <div className="h-px bg-editor-border-light my-1" />

          <p className="text-[10px] text-editor-text-muted uppercase tracking-wide">
            Output Levels
          </p>
          <SliderRow
            label="Shadows (out)"
            value={outMin}
            min={0}
            max={253}
            onChange={(v) => {
              const clamped = Math.min(v, outMaxRef.current - 2);
              outMinRef.current = clamped;
              setOutMin(clamped);
              preview();
            }}
          />
          <SliderRow
            label="Highlights (out)"
            value={outMax}
            min={2}
            max={255}
            onChange={(v) => {
              const clamped = Math.max(v, outMinRef.current + 2);
              outMaxRef.current = clamped;
              setOutMax(clamped);
              preview();
            }}
          />
        </>
      )}
    </AdjustmentModal>
  );
};
