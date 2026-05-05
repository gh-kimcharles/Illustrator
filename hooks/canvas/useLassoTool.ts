import { useCallback, useEffect, useRef, useState } from "react";
import { buildLassoPath } from "@/lib/tools/drawingEngine";
import { useEditorStore } from "@/store/useEditorStore";

export function useLassoTool(
  overlayRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const { setSelection } = useEditorStore();

  // lasso state: tracks the points of the lasso path
  const [isLassoDrawing, setIsLassoDrawing] = useState(false);
  const lassoPointsRef = useRef<{ x: number; y: number }[]>([]);

  /* Clear Overlay */
  const clearOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    overlay.getContext("2d")?.clearRect(0, 0, overlay.width, overlay.height);
  }, [overlayRef]);

  /* Start Lasso */
  const startLasso = useCallback(
    (pos: { x: number; y: number }) => {
      lassoPointsRef.current = [pos];
      setIsLassoDrawing(true);
      setSelection(null);
    },
    [setSelection],
  );

  /* Update Lasso */
  const updateLasso = useCallback((pos: { x: number; y: number }) => {
    lassoPointsRef.current.push(pos);
  }, []);

  /* Finish Lasso */
  const finishLasso = useCallback(() => {
    setIsLassoDrawing(false);
    const points = lassoPointsRef.current;

    if (points.length >= 3) {
      setSelection({ kind: "lasso", points, path: buildLassoPath(points) });
    } else {
      setSelection(null);
      clearOverlay();
    }

    lassoPointsRef.current = [];
  }, [setSelection, clearOverlay]);

  /* Cancel Lasso */
  const cancelLasso = useCallback(() => {
    lassoPointsRef.current = [];
    setIsLassoDrawing(false);
    clearOverlay();
  }, [clearOverlay]);

  // listen for global cancel events (e.g. pressing Escape via EditorShell)
  useEffect(() => {
    window.addEventListener("editor:cancel", cancelLasso);
    return () => window.removeEventListener("editor:cancel", cancelLasso);
  }, [cancelLasso]);

  return {
    isLassoDrawing,
    lassoPointsRef,
    startLasso,
    updateLasso,
    finishLasso,
    cancelLasso,
  };
}
