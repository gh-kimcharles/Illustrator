import { useCallback, useRef, useState } from "react";

export function useCanvasPan() {
  // hand tool pan state: tracks how far the canvas has been panned from centre
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); //
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);

  /* Start Pan */
  const startPan = useCallback((clientX: number, clientY: number) => {
    isPanningRef.current = true;
    setIsPanning(false);
    panStartRef.current = { x: clientX, y: clientY };
  }, []);

  /* Update Pan */
  const updatePan = useCallback((clientX: number, clientY: number) => {
    if (!isPanningRef.current) return;
    const dx = clientX - panStartRef.current.x;
    const dy = clientY - panStartRef.current.y;
    panStartRef.current = { x: clientX, y: clientY };
    setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  /* Stop Pan */
  const stopPan = useCallback(() => {
    isPanningRef.current = false;
    setIsPanning(true);
  }, []);

  /* Adjust Pan for Zoom */
  const adjustPanForZoom = useCallback(
    (oldZoom: number, newZoom: number, cx: number, cy: number) => {
      const scale = newZoom / oldZoom;
      setPanOffset((prev) => ({
        x: cx + (prev.x - cx) * scale,
        y: cy + (prev.y - cy) * scale,
      }));
    },
    [],
  );

  return {
    panOffset,
    isPanning,
    isPanningRef,
    startPan,
    updatePan,
    stopPan,
    adjustPanForZoom,
  };
}
