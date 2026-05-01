"use client";

import { useEditorStore } from "@/store/useEditorStore";
import React, { useRef, useState } from "react";
import { AdjustmentModal } from "./AdjustmentModal";
import { SliderRow } from "@/components/ui/Slider";
import { applyVibrance } from "@/lib/filters";

export const Vibrance = ({ onClose }: { onClose: () => void }) => {
  const { pushHistory } = useEditorStore();

  const [amount, setAmount] = useState(0);

  // add: refs to hold latest values synchronously
  const amountRef = useRef(0);

  return (
    <AdjustmentModal
      title="Vibrance"
      onCommit={() => {
        pushHistory("Vibrance");
        onClose();
      }}
      onCancel={onClose}
      onPreview={(imageData) => applyVibrance(imageData, amountRef.current)}
    >
      {(preview: () => void) => (
        <>
          <SliderRow
            label="Amount"
            value={amount}
            min={-100}
            max={100}
            onChange={(v) => {
              amountRef.current = v;
              setAmount(v);
              preview();
            }}
          />
          <p className="text-[10px] text-editor-text-disabled text-center mt-1">
            Boosts dull colours more than vivid ones. Protects skin tones.
          </p>
        </>
      )}
    </AdjustmentModal>
  );
};
