"use client";

import { useEditorStore } from "@/store/useEditorStore";
import React, { useRef, useState } from "react";
import { AdjustmentModal } from "./AdjustmentModal";
import { applySharpen } from "@/lib/filters";
import { SliderRow } from "@/components/ui/Slider";

export const Sharpen = ({ onClose }: { onClose: () => void }) => {
  const { pushHistory } = useEditorStore();

  const [amount, setAmount] = useState(100);
  const [radius, setRadius] = useState(2); // increase radius amount for sharper default
  const amountRef = useRef(100);
  const radiusRef = useRef(2);

  return (
    <AdjustmentModal
      title="Sharpen"
      onCommit={() => {
        pushHistory("Sharpen");
        onClose();
      }}
      onCancel={onClose}
      onPreview={(imageData) =>
        applySharpen(imageData, amountRef.current, radiusRef.current)
      }
    >
      {(preview: () => void) => (
        <>
          <SliderRow
            label="Amount"
            value={amount}
            min={0}
            max={200}
            onChange={(v) => {
              amountRef.current = v;
              setAmount(v);
              preview();
            }}
          />
          <SliderRow
            label="Radius"
            value={radius}
            min={1}
            max={10}
            onChange={(v) => {
              radiusRef.current = v;
              setRadius(v);
              preview();
            }}
          />
        </>
      )}
    </AdjustmentModal>
  );
};
