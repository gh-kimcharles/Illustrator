"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import {
  drawBrushStroke,
  drawBrushDot,
  floodFill,
  pickColor,
} from "@/lib/tools/drawingEngine";

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

function RulerH({ width }: { width: number }) {
  const ticks = [];
  for (let i = 0; i <= width; i += 50) {
    ticks.push(
      <span
        key={i}
        style={{
          position: "absolute",
          left: i,
          fontSize: 9,
          color: "var(--editor-text-muted)",
          bottom: 2,
        }}
      >
        {i}
      </span>,
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 20,
        right: 0,
        height: 20,
        background: "var(--editor-panel-header)",
        borderBottom: "1px solid var(--editor-border)",
        overflow: "hidden",
      }}
    >
      {ticks}
    </div>
  );
}

function RulerV({ height }: { height: number }) {
  const ticks = [];
  for (let i = 0; i <= height; i += 50) {
    ticks.push(
      <span
        key={i}
        style={{
          position: "absolute",
          top: i,
          fontSize: 8,
          color: "var(--editor-text-muted)",
          right: 2,
          writingMode: "vertical-rl",
        }}
      >
        {i}
      </span>,
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 0,
        width: 20,
        bottom: 0,
        background: "var(--editor-panel-header)",
        borderRight: "1px solid var(--editor-border)",
        overflow: "hidden",
      }}
    >
      {ticks}
    </div>
  );
}

export const CanvasArea = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const {
    activeTool,
    brush,
    fgColor,
    zoom,
    showRulers,
    canvasSize,
    setZoom,
    setFgColor,
  } = useEditorStore();

  // Init white canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Expose canvas globally for EditorShell file I/O
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__editorCanvas = canvasRef.current;
  });

  const getCanvasPos = useCallback(
    (e: React.MouseEvent) => {
      const wrapper = canvasRef.current?.parentElement;
      if (!wrapper) return { x: 0, y: 0 };
      const rect = wrapper.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      };
    },
    [zoom],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      const pos = getCanvasPos(e);
      drawing.current = true;
      lastPosition.current = pos;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (activeTool === "Brush" || activeTool === "Eraser") {
        drawBrushDot(
          ctx,
          pos.x,
          pos.y,
          brush,
          fgColor,
          activeTool === "Eraser",
        );
      }
      if (activeTool === "Fill") {
        floodFill(ctx, pos.x, pos.y, fgColor);
      }
      if (activeTool === "Eyedropper") {
        const color = pickColor(ctx, pos.x, pos.y);
        if (color) setFgColor(color);
      }
    },
    [activeTool, brush, fgColor, getCanvasPos, setFgColor],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const pos = getCanvasPos(e);
      setCursorPosition({ x: Math.round(pos.x), y: Math.round(pos.y) });

      if (!drawing.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (activeTool === "Brush" || activeTool === "Eraser") {
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
      }
      lastPosition.current = pos;
    },
    [activeTool, brush, fgColor, getCanvasPos],
  );

  const handleMouseUp = useCallback(() => {
    drawing.current = false;
  }, []);

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

      {/* Zoomable canvas */}
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
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{ display: "block", background: "white" }}
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
