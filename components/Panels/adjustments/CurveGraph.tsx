import { CurvePoint } from "@/lib/filters/curves";
import React, { useCallback, useEffect, useRef } from "react";

// constants
const GRAPH_SIZE = 200; // square canvas size (px)
const POINT_RADIUS = 5; // hit area for dragging control points (px)
const GRID_DIVS = 4; // number of grid

// channel colours for the curve line
const CHANNEL_COLORS: Record<string, string> = {
  rgb: "#ffffff",
  r: "#ef4444",
  g: "#22c55e",
  b: "#3b82f6",
};

interface CurveGraphProps {
  points: CurvePoint[];
  channel: string;
  onChange: (points: CurvePoint[]) => void;
}

// ensure value ranges min-max
function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

// inline curve evaluator (for drawing only - not the pixel filter)
// uses linear interpolation between sorted control points for the graph preview.
// the actual pixel filter uses the full cubic spline in curves.ts.
function evaluateCurve(sorted: CurvePoint[], x: number): number {
  if (sorted.length === 0) return x;
  if (x <= sorted[0].x) return sorted[0].y;
  if (x >= sorted[sorted.length - 1].x) return sorted[sorted.length - 1].y;

  for (let i = 0; i < sorted.length - 1; i++) {
    const p0 = sorted[i];
    const p1 = sorted[i + 1];
    if (x >= p0.x && x <= p1.x) {
      const t = (x - p0.x) / (p1.x - p0.x);
      // Smooth step for a nicer curve approximation in the graph
      const smooth = t * t * (3 - 2 * t);
      return p0.y + smooth * (p1.y - p0.y);
    }
  }

  return x;
}

export const CurveGraph = ({ points, channel, onChange }: CurveGraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggingIdx = useRef<number | null>(null);

  // convert between canvas px and curve value place
  // canvas: top-left = (0,0), bottom-right = (GRAPH_SIZE, GRAPH_SIZE)
  // curve:  x = 0–255 (input), y = 0–255 (output, 0 = dark at bottom)
  function toCanvas(p: CurvePoint) {
    return {
      cx: (p.x / 255) * GRAPH_SIZE,
      cy: GRAPH_SIZE - (p.y / 255) * GRAPH_SIZE,
    };
  }

  function toCurve(cx: number, cy: number): CurvePoint {
    return {
      x: Math.round(clamp((cx / GRAPH_SIZE) * 255, 0, 255)),
      y: Math.round(clamp(((GRAPH_SIZE - cy) / GRAPH_SIZE) * 255, 0, 255)),
    };
  }

  // draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, GRAPH_SIZE, GRAPH_SIZE);

    // background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, GRAPH_SIZE, GRAPH_SIZE);

    // grid lines
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 0.5;
    for (let i = 1; i < GRID_DIVS; i++) {
      const pos = (GRAPH_SIZE / GRID_DIVS) * i;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, GRAPH_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(GRAPH_SIZE, pos);
      ctx.stroke();
    }

    // identity diagonal (grey reference line)
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, GRAPH_SIZE);
    ctx.lineTo(GRAPH_SIZE, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // curve line - sample the spline at every pixel using the same
    // interpolation as buildSplineLut (simplified inline version for drawing)
    const sorted = [...points].sort((a, b) => a.x - b.x);
    const color = CHANNEL_COLORS[channel] ?? "#fff";

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let px = 0; px <= GRAPH_SIZE; px++) {
      const inputVal = (px / GRAPH_SIZE) * 255;
      const outputVal = evaluateCurve(sorted, inputVal);
      const cy = GRAPH_SIZE - (outputVal / 255) * GRAPH_SIZE;
      if (px === 0) ctx.moveTo(px, cy);
      else ctx.lineTo(px, cy);
    }
    ctx.stroke();

    // Control points
    sorted.forEach((p) => {
      const { cx, cy } = toCanvas(p);
      ctx.fillStyle = color;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, POINT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }, [points, channel]);

  useEffect(() => {
    draw();
  }, [draw]);

  // hit test - find closest control point within POINT_RADIUS
  function hitTest(cx: number, cy: number): number {
    const sorted = [...points].sort((a, b) => a.x - b.x);
    for (let i = 0; i < sorted.length; i++) {
      const { cx: px, cy: py } = toCanvas(sorted[i]);
      const dist = Math.hypot(cx - px, cy - py);
      if (dist <= POINT_RADIUS + 2) return i;
    }
    return -1;
  }

  // mouse events
  function getCanvasXY(e: React.MouseEvent): { cx: number; cy: number } {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      cx: clamp(e.clientX - rect.left, 0, GRAPH_SIZE),
      cy: clamp(e.clientY - rect.top, 0, GRAPH_SIZE),
    };
  }

  function handleMouseDown(e: React.MouseEvent) {
    const { cx, cy } = getCanvasXY(e);
    const idx = hitTest(cx, cy);

    if (idx !== -1) {
      // Start dragging existing point
      draggingIdx.current = idx;
    } else {
      // Add a new control point — keep endpoints fixed
      const newPoint = toCurve(cx, cy);
      const sorted = [...points].sort((a, b) => a.x - b.x);

      // Don't allow points too close to the endpoints x=0 or x=255
      if (newPoint.x < 5 || newPoint.x > 250) return;

      // Don't allow duplicate x positions
      if (sorted.some((p) => Math.abs(p.x - newPoint.x) < 8)) return;

      const next = [...points, newPoint].sort((a, b) => a.x - b.x);
      onChange(next);
      draggingIdx.current = next.findIndex(
        (p) => p.x === newPoint.x && p.y === newPoint.y,
      );
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (draggingIdx.current === null) return;
    const { cx, cy } = getCanvasXY(e);
    const sorted = [...points].sort((a, b) => a.x - b.x);
    const idx = draggingIdx.current;
    const updated = toCurve(cx, cy);

    // endpoints (first and last) can only move vertically - x is locked
    if (idx === 0) updated.x = 0;
    if (idx === sorted.length - 1) updated.x = 255;

    // Clamp x so it doesn't cross adjacent points
    if (idx > 0) updated.x = Math.max(updated.x, sorted[idx - 1].x + 4);
    if (idx < sorted.length - 1)
      updated.x = Math.min(updated.x, sorted[idx + 1].x - 4);

    sorted[idx] = updated;
    onChange([...sorted]);
  }

  function handleMouseUp() {
    draggingIdx.current = null;
  }

  function handleDoubleClick(e: React.MouseEvent) {
    // double-click removes a control point (except the two endpoints)
    const { cx, cy } = getCanvasXY(e);
    const idx = hitTest(cx, cy);
    const sorted = [...points].sort((a, b) => a.x - b.x);

    // never remove the first or last point
    if (idx <= 0 || idx >= sorted.length - 1) return;

    sorted.splice(idx, 1);
    onChange([...sorted]);
  }

  return (
    <canvas
      ref={canvasRef}
      width={GRAPH_SIZE}
      height={GRAPH_SIZE}
      className="block border border-editor-border-light cursor-crosshair"
      style={{ imageRendering: "pixelated" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    />
  );
};
