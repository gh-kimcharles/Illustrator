"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import {
  drawBrushStroke,
  drawBrushDot,
  floodFill,
  pickColor,
  drawSelectionOverlay,
  drawCropOverlay,
} from "@/lib/tools/drawingEngine";
import { compositeLayers } from "@/lib/layers/layerManager";
import { RulerH, RulerV } from "../ui";

const CURSOR_MAP: Record<string, string> = {
  Move: "default",
  Marquee: "crosshair",
  Lasso: "crosshair",
  Crop: "crosshair",
  Eyedropper: "crosshair",
  Brush: "crosshair",
  Eraser: "crosshair",
  Fill: "crosshair",
  Text: "text",
  Shape: "crosshair",
  Zoom: "zoom-in",
  Hand: "grab",
};

export const CanvasArea = () => {
  const {
    activeTool,
    brush,
    fgColor,
    zoom,
    showRulers,
    canvasSize,
    layers,
    activeLayerId,
    selection,
    setZoom,
    setFgColor,
    setSelection,
    pushHistory,
    setCanvasSize,
  } = useEditorStore();

  const displayRef = useRef<HTMLCanvasElement>(null); // composited display
  const overlayRef = useRef<HTMLCanvasElement>(null); // selection dashes
  const containerRef = useRef<HTMLDivElement>(null); // outer scrollable container

  const drawing = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const selectionStart = useRef({ x: 0, y: 0 });
  const moveStart = useRef({ x: 0, y: 0 });

  // tracks cursor position
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // hand tool pan state - tracks how far the canvas has been panned from centre
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); //
  const panStartRef = useRef({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const isPanningRef = useRef(false);

  // crop state - live rectangle drawn while dragging with the crop tool
  const [cropRect, setCropRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const cropStartRef = useRef({ x: 0, y: 0 });

  // Reset crop rect when switching away from Crop tool
  const effectiveCropRect = activeTool === "Crop" ? cropRect : null;

  // Composite when data changes
  useEffect(() => {
    const canvas = displayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    compositeLayers(ctx, layers, canvasSize);
  }, [layers, canvasSize]);

  // Redraw selection / crop overlay
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    // clear first
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    // draw marquee selection if present
    if (selection) {
      drawSelectionOverlay(ctx, selection);
    }

    // draw crop rectangle if actively cropping
    if (effectiveCropRect && activeTool === "Crop") {
      drawCropOverlay(ctx, effectiveCropRect, canvasSize);
    }

    // drawSelectionOverlay(ctx, selection); update: now handles selection and crop tool
  }, [selection, effectiveCropRect, activeTool, canvasSize]);

  // Expose canvas globally for EditorShell file I/O
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__editorCanvas = displayRef.current;
  });

  /* Helpers */
  const getActiveCtx = useCallback(() => {
    const layer = layers.find((l) => l.id === activeLayerId);
    if (!layer?.canvas) return null;
    return layer.canvas.getContext("2d");
  }, [layers, activeLayerId]);

  // Converts a mouse event to canvas value coordinates (accounts for zoom)
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
    [zoom],
  );

  // Recomposite helper - call after any pixel change
  const recomposite = useCallback(() => {
    const canvas = displayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    compositeLayers(ctx, layers, canvasSize);
  }, [layers, canvasSize]);

  // Mouse down
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      const position = getCanvasPosition(e);
      drawing.current = true;
      lastPosition.current = position;

      // hand: start pan
      if (activeTool === "Hand") {
        isPanningRef.current = true;
        setIsPanning(false);
        panStartRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      // marquee: start selection
      if (activeTool === "Marquee") {
        selectionStart.current = position;
        setSelection(null);
        return;
      }

      // crop: start crop rectangle
      if (activeTool === "Crop") {
        cropStartRef.current = position;
        setCropRect(null);
        return;
      }

      // move: record start position
      if (activeTool === "Move") {
        moveStart.current = position;
        return;
      }

      const ctx = getActiveCtx();
      if (!ctx) return;

      if (activeTool === "Brush" || activeTool === "Eraser") {
        // pushHistory(activeTool); // remove pushHistory on mouse down
        drawBrushDot(
          ctx,
          position.x,
          position.y,
          brush,
          fgColor,
          activeTool === "Eraser",
        );
        recomposite();
      }

      if (activeTool === "Fill") {
        // pushHistory(activeTool); // remove pushHistory on mouse down
        floodFill(ctx, position.x, position.y, fgColor);
        recomposite();
      }

      if (activeTool === "Eyedropper") {
        const display = displayRef.current;
        if (!display) return;
        const dCtx = display.getContext("2d");
        if (!dCtx) return;
        const color = pickColor(dCtx, position.x, position.y);
        if (color) setFgColor(color);
      }
    },
    [
      activeTool,
      brush,
      fgColor,
      getCanvasPosition,
      getActiveCtx,
      recomposite,
      setFgColor,
      setSelection,
      // pushHistory, // remove pushHistory on mouse down
    ],
  );

  // Mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const position = getCanvasPosition(e);
      setCursorPosition({
        x: Math.round(position.x),
        y: Math.round(position.y),
      });

      // hand: pan the canvas
      if (activeTool === "Hand" && isPanningRef.current) {
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        panStartRef.current = { x: e.clientX, y: e.clientY };
        setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        return;
      }

      if (!drawing.current) return;

      // Marquee selection live
      if (activeTool === "Marquee") {
        const sx = selectionStart.current.x;
        const sy = selectionStart.current.y;
        setSelection({
          x: Math.min(sx, position.x),
          y: Math.min(sy, position.y),
          width: Math.abs(position.x - sx),
          height: Math.abs(position.y - sy),
        });
        return;
      }

      // Crop: live crop rect
      if (activeTool === "Crop") {
        const sx = cropStartRef.current.x;
        const sy = cropStartRef.current.y;
        setCropRect({
          x: Math.min(sx, position.x),
          y: Math.min(sy, position.y),
          width: Math.abs(position.x - sx),
          height: Math.abs(position.y - sy),
        });
        return;
      }

      // Move: adjust the active layer offset
      if (activeTool === "Move") {
        const dx = position.x - moveStart.current.x;
        const dy = position.y - moveStart.current.y;
        const active = layers.find((l) => l.id === activeLayerId);
        if (active && !active.locked) {
          active.offsetX += dx;
          active.offsetY += dy;
          recomposite();
        }
        moveStart.current = position;
        return;
      }

      // Brush / Eraser
      const ctx = getActiveCtx();
      if (!ctx) return;

      if (activeTool === "Brush" || activeTool === "Eraser") {
        drawBrushStroke(
          ctx,
          lastPosition.current.x,
          lastPosition.current.y,
          position.x,
          position.y,
          brush,
          fgColor,
          activeTool === "Eraser",
        );
        recomposite();
      }
      lastPosition.current = position;
    },
    [
      activeTool,
      brush,
      fgColor,
      layers,
      activeLayerId,
      getCanvasPosition,
      getActiveCtx,
      recomposite,
      setSelection,
    ],
  );

  // Commit crop - crops every layer's OffscreenCanvas to the selected rectangle, then updates the canvas size in the store
  const commitCrop = useCallback(
    (rect: { x: number; y: number; width: number; height: number }) => {
      // clamp rect to canvas bounds
      const x = Math.max(0, Math.round(rect.x));
      const y = Math.max(0, Math.round(rect.y));
      const width = Math.min(Math.round(rect.width), canvasSize.width - x);
      const height = Math.min(Math.round(rect.height), canvasSize.height - y);

      if (width < 1 || height < 1) return;

      pushHistory("Crop");

      // crop every layer's OffscreenCanvas
      for (const layer of layers) {
        if (!layer.canvas) continue;
        const ctx = layer.canvas.getContext("2d");
        if (!ctx) continue;

        // read the region we want to keep
        const imageData = ctx.getImageData(x, y, width, height);

        // Resize the offscreencanvas to the new dimensions
        // layer.canvas.width = width;
        // layer.canvas.height = height;

        // write the cropped pixels back
        const newCtx = layer.canvas.getContext("2d");
        if (newCtx) newCtx.putImageData(imageData, 0, 0);
      }

      // update canvas size in the store - triggers re-render
      setCanvasSize({ width, height });

      // resize the display canvas element to match
      const display = displayRef.current;
      if (display) {
        display.width = width;
        display.height = height;
      }

      // resize the overlay canvas
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.width = width;
        overlay.height = height;
      }
    },
    [canvasSize, layers, pushHistory, setCanvasSize],
  );

  // modify: push AFTER stroke completes
  const handleMouseUp = useCallback(() => {
    // Hand: stop pan
    if (activeTool === "Hand") {
      isPanningRef.current = false;
      setIsPanning(true);
      drawing.current = false;
      return;
    }

    // Crop: commit the crop when mouse is released
    // only commit if the rectangle is large enough to be intentional
    if (activeTool === "Crop" && cropRect) {
      const MIN_SIZE = 4; // ignore tiny accidental clicks
      if (cropRect.width > MIN_SIZE && cropRect.height > MIN_SIZE) {
        commitCrop(cropRect);
      }
      setCropRect(null);
      drawing.current = false;
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
  }, [activeTool, cropRect, pushHistory]);

  // Wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 1.1 : 0.9;
        setZoom(Math.min(Math.max(zoom * delta, 0.05), 16));
      }
    },
    [zoom, setZoom],
  );

  // dynamic cursor for hand tool
  const cursor =
    activeTool === "Hand"
      ? isPanning
        ? "grabbing"
        : "grab"
      : CURSOR_MAP[activeTool] || "crosshair";

  const rulerOffset = showRulers ? 20 : 0;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden"
      style={{ background: "var(--editor-canvas-bg)", cursor }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Checker pattern background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-conic-gradient(oklch(0.22 0.005 285) 0% 25%, oklch(0.25 0.005 285) 0% 50%)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Rulers */}
      {showRulers && (
        <>
          <div
            className="absolute top-0 left-0 w-5 h-5 z-10"
            style={{
              background: "var(--editor-toolbar)",
              borderRight: "1px solid var(--editor-border)",
              borderBottom: "1px solid var(--editor-border)",
            }}
          />
          <RulerH width={canvasSize.width} />
          <RulerV height={canvasSize.height} />
        </>
      )}

      {/* Zoomable + pannable canvas wrapper */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingLeft: rulerOffset, paddingTop: rulerOffset }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            // Pan offset is applied here — translate moves the whole canvas
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
            position: "relative",
            // Smooth pan feel
            transition: isPanning ? "none" : "transform 0.05s ease-out",
          }}
        >
          {/* Display canvas — composited layers */}
          <canvas
            ref={displayRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{ display: "block" }}
          />

          {/* Overlay canvas — selection dashes + crop preview */}
          <canvas
            ref={overlayRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Cursor position */}
      <div className="absolute bottom-1.5 right-2 text-[10px] text-editor-text-disabled pointer-events-none select-none">
        {cursorPosition.x}, {cursorPosition.y} px
      </div>

      {/* Crop confirm hint — shown while crop rect is being drawn */}
      {activeTool === "Crop" && cropRect && cropRect.width > 4 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-editor-panel-header border border-editor-border-light text-[11px] text-editor-text px-3 py-1 pointer-events-none">
          Release to crop · Esc to cancel
        </div>
      )}
    </div>
  );
};

export default CanvasArea;
