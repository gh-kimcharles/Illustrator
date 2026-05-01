"use client";

import React, { useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { AdjustmentModal } from "./AdjustmentModal";
import { applyPosterize } from "@/lib/filters";
import { SliderRow } from "@/components/ui/Slider";

export const Posterize = ({ onClose }: { onClose: () => void }) => {
  const { pushHistory } = useEditorStore();

  const [levels, setLevels] = useState(4);

  // add: refs to hold latest values synchronously
  const levelsRef = useRef(4);

  return (
    <AdjustmentModal
      title="Posterize"
      onCommit={() => {
        pushHistory("Posterize");
        onClose();
      }}
      onCancel={onClose}
      onPreview={(imageData) => applyPosterize(imageData, levelsRef.current)}
    >
      {(preview: () => void) => (
        <>
          <SliderRow
            label="Levels"
            value={levels}
            min={2}
            max={16}
            onChange={(v) => {
              levelsRef.current = v;
              setLevels(v);
              preview();
            }}
          />
          {/* help user understand what the value means */}
          <p className="text-[10px] text-editor-text-disabled text-center">
            {levels === 2
              ? "Maximum effect — 8 possible colours"
              : levels <= 4
                ? "Strong posterize"
                : levels <= 8
                  ? "Moderate posterize"
                  : "Subtle posterize"}
          </p>
        </>
      )}
    </AdjustmentModal>
  );
};
