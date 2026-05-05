import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import {
  drawCropOverlay,
  drawLassoOverlay,
  drawSelectionOverlay,
} from "@/lib/tools/drawingEngine";

type CropRect = { x: number; y: number; width: number; height: number } | null;

export function useSelectionAnimation(
  overlayRef: React.RefObject<HTMLCanvasElement | null>,
  isLassoDrawing: boolean,
  lassoPointsRef: React.RefObject<{ x: number; y: number }[]>,
  effectiveCropRect: CropRect,
) {
  const { selection, canvasSize, activeTool } = useEditorStore();

  // initialize refs for animation state
  const dashOffsetRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    const hasAnimation = selection || isLassoDrawing;

    if (!hasAnimation) {
      cancelAnimationFrame(animFrameRef.current);
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      // crop overlay is static; draw once, no animation needed
      if (effectiveCropRect && activeTool === "Crop") {
        drawCropOverlay(ctx, effectiveCropRect, canvasSize);
      }
      return;
    }

    const animate = () => {
      dashOffsetRef.current = (dashOffsetRef.current - 0.5) % 8;
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      if (selection) {
        drawSelectionOverlay(ctx, selection, dashOffsetRef.current);
      } else if (isLassoDrawing) {
        drawLassoOverlay(ctx, lassoPointsRef.current, dashOffsetRef.current);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [
    selection,
    isLassoDrawing,
    activeTool,
    effectiveCropRect,
    canvasSize,
    overlayRef,
    lassoPointsRef,
  ]);
}
