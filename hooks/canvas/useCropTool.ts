import { useCallback, useRef, useState } from "react";
import { compositeLayers } from "@/lib/layers/layerManager";
import { useEditorStore } from "@/store/useEditorStore";

type Rect = { x: number; y: number; width: number; height: number };

export function useCropTool(
  displayRef: React.RefObject<HTMLCanvasElement | null>,
  overlayRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const { canvasSize, layers, pushHistory, setCanvasSize, setLayers } =
    useEditorStore();

  // crop state: live rectangle drawn while dragging with the crop tool
  const [cropRect, setCropRect] = useState<Rect | null>(null);
  const cropStartRef = useRef({ x: 0, y: 0 });

  /* Start Crop */
  const startCrop = useCallback((x: number, y: number) => {
    cropStartRef.current = { x, y };
    setCropRect(null);
  }, []);

  /* Update Crop */
  const updateCrop = useCallback((x: number, y: number) => {
    const sx = cropStartRef.current.x;
    const sy = cropStartRef.current.y;
    setCropRect({
      x: Math.min(sx, x),
      y: Math.min(sy, y),
      width: Math.abs(x - sx),
      height: Math.abs(y - sy),
    });
  }, []);

  /* Commit Crop */
  const commitCrop = useCallback(
    (rect: Rect) => {
      const x = Math.max(0, Math.round(rect.x));
      const y = Math.max(0, Math.round(rect.y));
      const width = Math.min(Math.round(rect.width), canvasSize.width - x);
      const height = Math.min(Math.round(rect.height), canvasSize.height - y);
      if (width < 1 || height < 1) return;

      pushHistory("Crop");

      const croppedLayers = layers.map((layer) => {
        if (!layer.canvas) return layer;
        const srcCtx = layer.canvas.getContext("2d");
        if (!srcCtx) return layer;
        const imageData = srcCtx.getImageData(x, y, width, height);
        const newCanvas = new OffscreenCanvas(width, height);
        newCanvas.getContext("2d")?.putImageData(imageData, 0, 0);
        return { ...layer, canvas: newCanvas };
      });

      setLayers(croppedLayers);
      setCanvasSize({ width, height });

      if (displayRef.current) {
        displayRef.current.width = width;
        displayRef.current.height = height;
      }
      if (overlayRef.current) {
        overlayRef.current.width = width;
        overlayRef.current.height = height;
      }

      // recomposite after crop
      const display = displayRef.current;
      if (display) {
        const ctx = display.getContext("2d");
        if (ctx) compositeLayers(ctx, croppedLayers, { width, height });
      }
    },
    [
      canvasSize,
      layers,
      pushHistory,
      setCanvasSize,
      setLayers,
      displayRef,
      overlayRef,
    ],
  );

  /* Finish Crop */
  const finishCrop = useCallback(
    (MIN_SIZE = 4) => {
      if (cropRect && cropRect.width > MIN_SIZE && cropRect.height > MIN_SIZE) {
        commitCrop(cropRect);
      }
      setCropRect(null);
    },
    [cropRect, commitCrop],
  );

  return { cropRect, startCrop, updateCrop, finishCrop };
}
