import { BrushSettings, RGBColor, Selection, TextSettings } from "@/types";

/* Brush & Eraser Strokes */
export function drawBrushStroke(
  ctx: OffscreenCanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  settings: BrushSettings,
  color: RGBColor,
  isEraser: boolean,
) {
  ctx.save();

  if (isEraser) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${settings.opacity / 100})`;
  }

  ctx.lineWidth = settings.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.restore();
}

/* Brush Dot */
export function drawBrushDot(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  settings: BrushSettings,
  color: RGBColor,
  isEraser: boolean,
) {
  ctx.save();

  if (isEraser) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${settings.opacity / 100})`;
  }

  ctx.beginPath();
  ctx.arc(x, y, settings.size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* Crop Overlay Drawing */
export function drawCropOverlay(
  ctx: CanvasRenderingContext2D,
  rect: { x: number; y: number; width: number; height: number },
  canvasSize: { width: number; height: number },
) {
  const { x, y, width, height } = rect;
  const { width: cw, height: ch } = canvasSize;

  ctx.save();

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

  ctx.fillRect(0, 0, cw, y);
  ctx.fillRect(0, y + height, cw, ch - y - height);
  ctx.fillRect(0, y, x, height);
  ctx.fillRect(x + width, y, cw - x - width, height);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 0.5;
  ctx.setLineDash([]);

  for (let i = 1; i < 3; i++) {
    // vertical thirds
    const vx = x + (width / 3) * i;
    ctx.beginPath();
    ctx.moveTo(vx, y);
    ctx.lineTo(vx, y + height);
    ctx.stroke();

    // horizontal thirds
    const hy = y + (height / 3) * i;
    ctx.beginPath();
    ctx.moveTo(x, hy);
    ctx.lineTo(x + width, hy);
    ctx.stroke();
  }

  const handleSize = 6;
  const corners = [
    { cx: x, cy: y },
    { cx: x + width, cy: y },
    { cx: x, cy: y + height },
    { cx: x + width, cy: y + height },
  ];

  ctx.fillStyle = "white";
  corners.forEach(({ cx, cy }) => {
    ctx.fillRect(
      cx - handleSize / 2,
      cy - handleSize / 2,
      handleSize,
      handleSize,
    );
  });

  ctx.restore();
}

/* Draw Selection Overlay */
// update: draws the selection outline (marching ants) for both rect and lasso
// selections on the overlay canvas
export function drawSelectionOverlay(
  overlayCtx: CanvasRenderingContext2D,
  selection: Selection | null,
  dashOffset: number = 0,
) {
  const { width, height } = overlayCtx.canvas;
  overlayCtx.clearRect(0, 0, width, height);
  if (!selection) return;

  overlayCtx.save();

  if (selection.kind === "rect") {
    // marching-ants rect selection
    drawMarchingAntsRect(
      overlayCtx,
      selection.x,
      selection.y,
      selection.width,
      selection.height,
      dashOffset,
    );
  } else {
    // Marching-ants lasso polygon
    drawMarchingAntsPath(overlayCtx, selection.path, dashOffset);
  }

  overlayCtx.restore();
}

/* Draw Lasso Overlay */
// draws the live (in-progress) lasso path while the user is still dragging
// call this every mousemove to refresh the overlay
export function drawLassoOverlay(
  overlayCtx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  dashOffset: number = 0,
) {
  if (points.length < 2) return;

  overlayCtx.save();

  // white base
  overlayCtx.beginPath();
  overlayCtx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    overlayCtx.lineTo(points[i].x, points[i].y);
  }
  overlayCtx.strokeStyle = "white";
  overlayCtx.lineWidth = 1;
  overlayCtx.setLineDash([4, 4]);
  overlayCtx.lineDashOffset = dashOffset;
  overlayCtx.stroke();

  // black offset on top
  overlayCtx.beginPath();
  overlayCtx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    overlayCtx.lineTo(points[i].x, points[i].y);
  }
  overlayCtx.strokeStyle = "black";
  overlayCtx.lineWidth = 1;
  overlayCtx.setLineDash([4, 4]);
  overlayCtx.lineDashOffset = dashOffset + 4;
  overlayCtx.stroke();

  // faint closing-line hint
  if (points.length > 3) {
    const last = points[points.length - 1];
    const first = points[0];
    overlayCtx.beginPath();
    overlayCtx.moveTo(last.x, last.y);
    overlayCtx.lineTo(first.x, first.y);
    overlayCtx.strokeStyle = "rgba(255,255,255,0.35)";
    overlayCtx.lineWidth = 1;
    overlayCtx.setLineDash([2, 4]);
    overlayCtx.lineDashOffset = 0;
    overlayCtx.stroke();
  }

  overlayCtx.restore();
}

/* Flood Fill */
export function floodFill(
  ctx: OffscreenCanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColor: RGBColor,
  tolerance = 32,
  bounds?: { x: number; y: number; width: number; height: number }, // add: to handle selection bounds only
) {
  const { width, height } = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // clamp stack walk to bounds if provided, otherwise full canvas
  const minX = bounds ? Math.max(0, Math.floor(bounds.x)) : 0;
  const minY = bounds ? Math.max(0, Math.floor(bounds.y)) : 0;
  const maxX = bounds
    ? Math.min(width, Math.floor(bounds.x + bounds.width))
    : width;
  const maxY = bounds
    ? Math.min(height, Math.floor(bounds.y + bounds.height))
    : height;

  const idx = (x: number, y: number) => (y * width + x) * 4;
  const startIdx = idx(Math.floor(startX), Math.floor(startY));
  const sr = data[startIdx];
  const sg = data[startIdx + 1];
  const sb = data[startIdx + 2];
  const sa = data[startIdx + 3];

  function colorMatch(i: number) {
    return (
      Math.abs(data[i] - sr) <= tolerance &&
      Math.abs(data[i + 1] - sg) <= tolerance &&
      Math.abs(data[i + 2] - sb) <= tolerance &&
      Math.abs(data[i + 3] - sa) <= tolerance
    );
  }

  const stack: number[][] = [[Math.floor(startX), Math.floor(startY)]];
  const visited = new Uint8Array(width * height);

  while (stack.length) {
    const [x, y] = stack.pop()!;
    // Use clamped bounds instead of raw canvas size
    if (x < minX || x >= maxX || y < minY || y >= maxY) continue;

    const i = idx(x, y);
    if (visited[y * width + x]) continue;
    if (!colorMatch(i)) continue;

    visited[y * width + x] = 1;
    data[i] = fillColor.r;
    data[i + 1] = fillColor.g;
    data[i + 2] = fillColor.b;
    data[i + 3] = 255;

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  ctx.putImageData(imageData, 0, 0);
}

/* Eyedropper */
export function pickColor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
): RGBColor | null {
  try {
    const px = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    return {
      r: px[0],
      g: px[1],
      b: px[2],
    };
  } catch {
    return null;
  }
}

/* Text Overlay */
export function drawTextOverlay(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  settings: TextSettings,
  dashOffset: number = 0,
) {
  ctx.save();

  // match the font exactly as commitTextToCanvas does
  const fontStyle = [
    settings.italic ? "italic" : "",
    settings.bold ? "bold" : "",
    `${settings.fontSize}px`,
    settings.fontFamily,
  ]
    .filter(Boolean)
    .join(" ");

  ctx.font = fontStyle;

  const lineHeight = settings.fontSize * 1.2;
  const lines = text ? text.split("\n") : [""];

  const measuredWidth = Math.max(
    ...lines.map((line) => ctx.measureText(line || " ").width),
    ctx.measureText("M").width * 4, // minimum width even when empty
  );

  const totalHeight = lines.length * lineHeight;

  const PAD = 4; // padding around the text box
  const rx = x - PAD;
  const ry = y - PAD;
  const rw = measuredWidth + PAD * 2;
  const rh = totalHeight + PAD * 2;

  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.lineDashOffset = dashOffset;
  ctx.strokeRect(rx, ry, rw, rh);

  ctx.strokeStyle = "black";
  ctx.setLineDash([4, 4]);
  ctx.lineDashOffset = dashOffset + 4;
  ctx.strokeRect(rx, ry, rw, rh);

  const TICK = 5;
  ctx.setLineDash([]);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - TICK, y);
  ctx.lineTo(x + TICK, y);
  ctx.moveTo(x, y - TICK);
  ctx.lineTo(x, y + TICK);
  ctx.stroke();

  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(x - TICK, y);
  ctx.lineTo(x + TICK, y);
  ctx.moveTo(x, y - TICK);
  ctx.lineTo(x, y + TICK);
  ctx.stroke();

  ctx.restore();
}

/* Internal Helpers */
export function drawMarchingAntsRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  dashOffset: number = 0,
) {
  ctx.save();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.lineDashOffset = dashOffset;
  ctx.strokeRect(x, y, width, height);

  ctx.strokeStyle = "black";
  ctx.setLineDash([4, 4]);
  ctx.lineDashOffset = dashOffset + 4;
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
}

export function drawMarchingAntsPath(
  ctx: CanvasRenderingContext2D,
  path: Path2D,
  dashOffset: number = 0,
) {
  ctx.save();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.lineDashOffset = dashOffset;
  ctx.stroke(path);

  ctx.strokeStyle = "black";
  ctx.setLineDash([4, 4]);
  ctx.lineDashOffset = dashOffset + 4;
  ctx.stroke(path);
  ctx.restore();
}

/* Helper*/

/* Build Lasso Path */
// builds a Path2D from an array of polygon points and returns it
// the path is closed (last point connects back to first)
export function buildLassoPath(points: { x: number; y: number }[]): Path2D {
  const path = new Path2D();
  if (points.length < 2) return path;
  path.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    path.lineTo(points[i].x, points[i].y);
  }
  path.closePath();
  return path;
}

/* Apply Selection Clip */
/**
 * applies the active selection as a clip path on a drawing context
 * - rect selection  → clips to the rectangle
 * - lasso selection → clips to the polygon Path2D
 * - no selection    → no-op (draw everywhere)
 *
 * call ctx.save() before and ctx.restore() after drawing to reset the clip
 */
export function applySelectionClip(
  ctx: OffscreenCanvasRenderingContext2D,
  selection: Selection | null,
) {
  if (!selection) return;

  if (selection.kind === "rect") {
    ctx.beginPath();
    ctx.rect(selection.x, selection.y, selection.width, selection.height);
    ctx.clip();
  } else {
    // path2D clip - browser clips to the closed lasso polygon
    ctx.clip(selection.path);
  }
}
