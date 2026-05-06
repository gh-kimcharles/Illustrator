import { useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import {
  applyCurves,
  CurveData,
  CurvePoint,
  defaultCurves,
} from "@/lib/filters/curves";
import { CurveGraph } from "./CurveGraph";
import { AdjustmentModal } from "./AdjustmentModal";

// channel tabl definitions
const CHANNELS: { id: keyof CurveData; label: string; color: string }[] = [
  { id: "rgb", label: "RGB", color: "#ffffff" },
  { id: "r", label: "R", color: "#ef4444" },
  { id: "g", label: "G", color: "#22c55e" },
  { id: "b", label: "B", color: "#3b82f6" },
];

export function Curves({ onClose }: { onClose: () => void }) {
  const { pushHistory } = useEditorStore();

  // each channel has its own set of control points
  const [curves, setCurves] = useState<CurveData>(defaultCurves());
  const [activeChannel, setActiveChannel] = useState<keyof CurveData>("rgb");
  const curvesRef = useRef(defaultCurves());

  // update a single channels' points
  function handlePointsChange(channel: keyof CurveData, points: CurvePoint[]) {
    const next = { ...curvesRef.current, [channel]: points };
    curvesRef.current = next;
    setCurves(next);
  }

  // reset active channel back to identity
  function handleResetChannel() {
    const identity: CurvePoint[] = [
      { x: 0, y: 0 },
      { x: 255, y: 255 },
    ];
    handlePointsChange(activeChannel, identity);
  }

  // reset all channels
  function handleResetAll() {
    const reset = defaultCurves();
    curvesRef.current = reset;
    setCurves(reset);
  }

  return (
    <AdjustmentModal
      title="Curves"
      onCommit={() => {
        pushHistory("Curves");
        onClose();
      }}
      onCancel={onClose}
      onPreview={(imageData) => applyCurves(imageData, curvesRef.current)}
      className="w-[280px]"
    >
      {(preview: () => void) => (
        <div className="space-y-3">
          {/* Channel Tabs */}
          <div className="flex gap-1">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`
                  flex-1 py-1 text-[11px] font-medium border transition-colors
                  ${
                    activeChannel === ch.id
                      ? "border-editor-accent bg-editor-accent-subtle text-editor-accent"
                      : "border-editor-border-light text-editor-text-muted hover:bg-editor-hover"
                  }
                `}
                style={activeChannel === ch.id ? { color: ch.color } : {}}
              >
                {ch.label}
              </button>
            ))}
          </div>

          {/* Curve Graph */}
          {/* Triggers preview on every point change */}
          <div className="flex justify-center">
            <CurveGraph
              points={curves[activeChannel]}
              channel={activeChannel}
              onChange={(pts) => {
                handlePointsChange(activeChannel, pts);
                preview();
              }}
            />
          </div>

          {/* Usage Hint */}
          <div className="space-y-0.5">
            <p className="text-[10px] text-editor-text-disabled text-center">
              Click to add points · Drag to adjust · Double-click to remove
            </p>
          </div>

          {/* Reset Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                handleResetChannel();
                preview();
              }}
              className="flex-1 text-[11px] border border-editor-border-light
                         text-editor-text-muted hover:bg-editor-hover
                         hover:text-editor-text py-1 transition-colors"
            >
              Reset {activeChannel.toUpperCase()}
            </button>
            <button
              onClick={() => {
                handleResetAll();
                preview();
              }}
              className="flex-1 text-[11px] border border-editor-border-light
                         text-editor-text-muted hover:bg-editor-hover
                         hover:text-editor-text py-1 transition-colors"
            >
              Reset All
            </button>
          </div>
        </div>
      )}
    </AdjustmentModal>
  );
}
