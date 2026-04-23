"use client";

import {
  drawBrushDot,
  drawBrushStroke,
  floodFill,
  pickColor,
} from "@/lib/tools/drawingEngine";
import { useEditorStore } from "@/store/useEditorStore";
import React, { useCallback, useEffect, useRef, useState } from "react";

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

// Ruler tick marks
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
          color: "#555",
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
        background: "#2a2a2a",
        borderBottom: "1px solid #111",
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
          color: "#555",
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
        background: "#2a2a2a",
        borderRight: "1px solid #111",
        overflow: "hidden",
      }}
    >
      {ticks}
    </div>
  );
}

const CanvasArea = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const drawing = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasPosition = useCallback(
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

      const position = getCanvasPosition(e);
      drawing.current = true;
      lastPosition.current = position;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (activeTool === "Brush" || activeTool === "Eraser") {
        drawBrushDot(
          ctx,
          position.x,
          position.y,
          brush,
          fgColor,
          activeTool === "Eraser",
        );
      }
      if (activeTool === "Fill") {
        floodFill(ctx, position.x, position.y, fgColor);
      }
      if (activeTool === "Eyedropper") {
        const color = pickColor(ctx, position.x, position.y);
        if (color) setFgColor(color);
      }
    },
    [activeTool, brush, fgColor, getCanvasPosition, setFgColor],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const position = getCanvasPosition(e);
      setCursorPosition({
        x: Math.round(position.x),
        y: Math.round(position.y),
      });

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
          position.x,
          position.y,
          brush,
          fgColor,
          activeTool === "Eraser",
        );
      }

      lastPosition.current = position;
    },
    [activeTool, brush, fgColor, getCanvasPosition],
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

  // Export canvas (called from parent via ref - see EditorShell)
  // (accessed globally in EditorShell via canvasRef)
  useEffect(() => {
    // Expose canvas ref globally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__editorCanvas = canvasRef.current;
  });

  const rulerOffset = showRulers ? 20 : 0;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden"
      style={{
        background: "#404040",
        cursor: CURSOR_MAP[activeTool] || "crosshair",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Checker background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-conic-gradient(#383838 0% 25%, #404040 0% 50%)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Rulers */}
      {showRulers && (
        <>
          <div className="absolute top-0 left-0 w-5 h-5 bg-[#232323] border-r border-b border-editor-border z-10" />
          <RulerH width={canvasSize.width} />
          <RulerV height={canvasSize.height} />
        </>
      )}

      {/* Canvas wrapper - center, zoomable */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingLeft: rulerOffset, paddingTop: rulerOffset }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
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
      <div className="absolute bottom-1 right-2 text-[10px] text-editor-textMuted pointer-events-none">
        {cursorPosition.x}, {cursorPosition.y}
      </div>
    </div>
  );
};

export default CanvasArea;
