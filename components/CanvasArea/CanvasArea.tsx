"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import {
  drawBrushStroke,
  drawBrushDot,
  floodFill,
  pickColor,
  drawSelectionOverlay,
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
  const displayRef = useRef<HTMLCanvasElement>(null); // composited display
  const overlayRef = useRef<HTMLCanvasElement>(null); // selection dashes

  const drawing = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const selectionStart = useRef({ x: 0, y: 0 });
  const moveStart = useRef({ x: 0, y: 0 });

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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
  } = useEditorStore();

  // Composite when data changes
  useEffect(() => {
    const canvas = displayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    compositeLayers(ctx, layers, canvasSize);
  }, [layers, canvasSize]);

  // Redraw selection
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    drawSelectionOverlay(ctx, selection);
  }, [selection]);

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

      if (activeTool === "Marquee") {
        selectionStart.current = position;
        setSelection(null);
        return;
      }

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

      // Move - adjust the active layer offset
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

  // modify: push AFTER stroke completes
  const handleMouseUp = useCallback(() => {
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
  }, [activeTool, pushHistory]);

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

  const rulerOffset = showRulers ? 20 : 0;

  return (
    <div
      className="relative flex-1 overflow-hidden"
      style={{
        background: "var(--editor-canvas-bg)",
        cursor: CURSOR_MAP[activeTool] || "crosshair",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Checker pattern */}
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
      {/* Zoomable canvas wrapper */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingLeft: rulerOffset, paddingTop: rulerOffset }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
            position: "relative",
          }}
        >
          {/* Layer 1: composited display canvas */}
          <canvas
            ref={displayRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{ display: "block" }}
          />
          {/* Layer 2: selection overlay canvas (pointer-events-none) */}
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
    </div>
  );
};

export default CanvasArea;
