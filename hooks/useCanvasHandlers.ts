import React, { useCallback, useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { compositeLayers } from "@/lib/layers/layerManager";
import { useCanvasPan, useCropTool, useLassoTool } from "./canvas"; // /hooks/CanvasArea/index.ts
import {
  applySelectionClip,
  drawBrushDot,
  drawBrushStroke,
  floodFill,
  pickColor,
} from "@/lib/tools/drawingEngine";

export function useCanvasHandlers(
  displayRef: React.RefObject<HTMLCanvasElement | null>,
  overlayRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  commitText: () => void,
) {
  const {
    activeTool,
    brush,
    fgColor,
    zoom,
    canvasSize,
    layers,
    activeLayerId,
    selection,
    setZoom,
    setFgColor,
    setSelection,
    pushHistory,
    textOverlay,
    setTextOverlay,
    setTextValue,
  } = useEditorStore();

  const drawing = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const selectionStart = useRef({ x: 0, y: 0 });
  const moveStart = useRef({ x: 0, y: 0 });

  const pan = useCanvasPan();
  const crop = useCropTool(displayRef, overlayRef);
  const lasso = useLassoTool(overlayRef);

  /* Helpers */
  // get active layer
  const getActiveCtx = useCallback(() => {
    const layer = layers.find((l) => l.id === activeLayerId);
    if (!layer?.canvas) return null;
    return layer.canvas.getContext("2d");
  }, [layers, activeLayerId]);

  // converts a mouse event to canvas value coordinates (accounts for zoom)
  const getCanvasPosition = useCallback(
    (e: React.MouseEvent) => {
      const wrapper = displayRef.current?.parentElement;
      if (!wrapper) return { x: 0, y: 0 };
      const rect = wrapper.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      };
    },
    [displayRef, zoom],
  );

  // recomposite helper; call after any pixel change
  const recomposite = useCallback(() => {
    const canvas = displayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    compositeLayers(ctx, layers, canvasSize);
  }, [layers, canvasSize, displayRef]);

  // mouse down
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      const pos = getCanvasPosition(e);
      drawing.current = true;
      lastPosition.current = pos;

      // hand: start pan
      if (activeTool === "Hand") {
        pan.startPan(e.clientX, e.clientY);
        return;
      }

      // marquee: start selection
      if (activeTool === "Marquee") {
        selectionStart.current = pos;
        setSelection(null);
        return;
      }

      if (activeTool === "Lasso") {
        lasso.startLasso(pos);
        return;
      }

      // crop: start crop rectangle
      if (activeTool === "Crop") {
        crop.startCrop(pos.x, pos.y);
        return;
      }

      // move: record start position
      if (activeTool === "Move") {
        moveStart.current = pos;
        return;
      }

      // text: place the inline editor
      if (activeTool === "Text") {
        // commit to any existing overlay first
        if (textOverlay) commitText();

        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;

        setTextOverlay({
          canvasX: pos.x,
          canvasY: pos.y,
          screenX: e.clientX - containerRect.left,
          screenY: e.clientY - containerRect.top,
        });

        setTextValue("");
        drawing.current = false;
        return;
      }

      const ctx = getActiveCtx();
      if (!ctx) return;

      if (activeTool === "Brush" || activeTool === "Eraser") {
        ctx.save();
        applySelectionClip(ctx, selection); // if there is selection clip, ensure it only draws that part
        drawBrushDot(
          ctx,
          pos.x,
          pos.y,
          brush,
          fgColor,
          activeTool === "Eraser",
        );
        ctx.restore();

        recomposite();
      }

      if (activeTool === "Fill") {
        const rectBounds = selection?.kind === "rect" ? selection : undefined;

        if (selection?.kind === "lasso") {
          // fill onto a temp canvas so we can mask it
          const tempCanvas = new OffscreenCanvas(
            canvasSize.width,
            canvasSize.height,
          );

          const tempCtx = tempCanvas.getContext("2d");
          if (tempCtx) {
            // copy current layer pixels
            const srcCtx = getActiveCtx();
            if (srcCtx) {
              const imageData = (srcCtx.canvas as OffscreenCanvas)
                .getContext("2d")!
                .getImageData(0, 0, canvasSize.width, canvasSize.height);
              tempCtx.putImageData(imageData, 0, 0);
            }

            // run flood fill on temp canvas
            floodFill(tempCtx, pos.x, pos.y, fgColor, 32);

            // clip to lasso polygon and draw result
            ctx.save();
            ctx.clip(selection.path);
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.restore();
          }
        } else {
          floodFill(ctx, pos.x, pos.y, fgColor, 32, rectBounds);
        }

        recomposite();
      }

      if (activeTool === "Eyedropper") {
        const display = displayRef.current;
        if (!display) return;
        const dCtx = display.getContext("2d");
        if (!dCtx) return;
        const color = pickColor(dCtx, pos.x, pos.y);
        if (color) setFgColor(color);
      }

      if (activeTool === "Zoom") {
        const oldZoom = zoom;
        const newZoom = e.altKey
          ? Math.max(oldZoom / 1.25, 0.05)
          : Math.min(oldZoom * 1.25, 16);

        // position of click relative to the container center
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        pan.adjustPanForZoom(
          zoom,
          newZoom,
          e.clientX - rect.left - rect.width / 2,
          e.clientY - rect.top - rect.height / 2,
        );
        setZoom(newZoom);
        drawing.current = false;
        return;
      }
    },
    [
      activeTool,
      brush,
      fgColor,
      selection,
      zoom,
      canvasSize,
      textOverlay,
      pan,
      crop,
      lasso,
      commitText,
      getCanvasPosition,
      getActiveCtx,
      recomposite,
      setFgColor,
      setSelection,
      setZoom,
      setTextOverlay,
      setTextValue,
      containerRef,
      displayRef,
    ],
  );

  // mouse move
  const handleMouseMove = useCallback(
    (
      e: React.MouseEvent,
      setCursorPosition: (p: { x: number; y: number }) => void,
    ) => {
      const pos = getCanvasPosition(e);
      setCursorPosition({
        x: Math.round(pos.x),
        y: Math.round(pos.y),
      });

      // hand: pan the canvas
      if (activeTool === "Hand") {
        pan.updatePan(e.clientX, e.clientY);
        return;
      }

      if (!drawing.current) return;

      // marquee rect: selection live
      if (activeTool === "Marquee") {
        const sx = selectionStart.current.x;
        const sy = selectionStart.current.y;
        setSelection({
          kind: "rect",
          x: Math.min(sx, pos.x),
          y: Math.min(sy, pos.y),
          width: Math.abs(pos.x - sx),
          height: Math.abs(pos.y - sy),
        });
        return;
      }

      // lasso:
      if (activeTool === "Lasso") {
        lasso.updateLasso(pos);
        return;
      }

      // crop: live crop rect
      if (activeTool === "Crop") {
        crop.updateCrop(pos.x, pos.y);
        return;
      }

      // move: adjust the active layer offset
      if (activeTool === "Move") {
        const dx = pos.x - moveStart.current.x;
        const dy = pos.y - moveStart.current.y;
        const active = layers.find((l) => l.id === activeLayerId);
        if (active && !active.locked) {
          active.offsetX += dx;
          active.offsetY += dy;
          recomposite();
        }
        moveStart.current = pos;
        return;
      }

      // Brush / Eraser
      const ctx = getActiveCtx();
      if (!ctx) return;

      if (activeTool === "Brush" || activeTool === "Eraser") {
        ctx.save();
        applySelectionClip(ctx, selection);
        drawBrushStroke(
          ctx,
          lastPosition.current.x,
          lastPosition.current.y,
          pos.x,
          pos.y,
          brush,
          fgColor,
          activeTool === "Eraser",
        );
        ctx.restore();
        recomposite();
      }
      lastPosition.current = pos;
    },
    [
      activeTool,
      brush,
      fgColor,
      selection,
      layers,
      activeLayerId,
      pan,
      crop,
      lasso,
      getCanvasPosition,
      getActiveCtx,
      recomposite,
      setSelection,
    ],
  );

  // modify: push AFTER stroke completes
  const handleMouseUp = useCallback(
    (e?: React.MouseEvent) => {
      // guard: if button still held, don't commit persistent-state tools
      if (e && e.buttons === 1) {
        if (
          activeTool === "Lasso" ||
          activeTool === "Marquee" ||
          activeTool === "Crop"
        )
          return;
      }

      // hand: stop pan
      if (activeTool === "Hand") {
        pan.stopPan();
        drawing.current = false;
        return;
      }

      // crop: commit the crop when mouse is released
      // only commit if the rectangle is large enough to be intentional
      if (activeTool === "Crop") {
        crop.finishCrop();
        drawing.current = false;
        return;
      }

      // lasso: apply point selection from starting point to end
      if (activeTool === "Lasso") {
        if (!drawing.current) return;
        lasso.finishLasso();
        drawing.current = false;
        return;
      }

      // post-stroke history push
      if (drawing.current) {
        if (
          activeTool === "Brush" ||
          activeTool === "Eraser" ||
          activeTool === "Fill"
        ) {
          pushHistory(activeTool); // post-action snapshots
        }
      }

      drawing.current = false;
    },
    [activeTool, pan, crop, lasso, pushHistory],
  );

  // wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1.1 : 0.9;
      setZoom(Math.min(Math.max(zoom * delta, 0.05), 16));
    },
    [zoom, setZoom],
  );

  return {
    pan,
    crop,
    lasso,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
  };
}
