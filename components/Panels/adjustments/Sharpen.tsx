"use client";

import { useEditorStore } from "@/store/useEditorStore";
import React, { useState } from "react";
import { AdjustmentModal } from "./AdjustmentModal";
import { applySharpen } from "@/lib/filters";
import { SliderRow } from "@/components/ui/Slider";

export const Sharpen = ({ onClose }: { onClose: () => void }) => {
  const [amount, setAmount] = useState(100);
  const [radius, setRadius] = useState(1);
  const { pushHistory } = useEditorStore();

  return (
    <AdjustmentModal
      title="Sharpen"
      onCommit={() => {
        pushHistory("Sharpen");
        onClose();
      }}
      onCancel={onClose}
      onPreview={(imageData) => applySharpen(imageData, amount, radius)}
    >
      {(preview: () => void) => (
        <>
          <SliderRow
            label="Amount"
            value={amount}
            min={0}
            max={200}
            onChange={(v) => {
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
              setRadius(v);
              preview();
            }}
          />
        </>
      )}
    </AdjustmentModal>
  );
};
