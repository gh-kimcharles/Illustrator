import { BrushSettings, RGBColor } from "@/types";

/* Brush & Eraser Properties */
export function drawBrushStroke(
  ctx: OffscreenCanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  settings: BrushSettings,
  color: RGBColor,
  isEraser: boolean, // allow eraser brush (not final)
) {
  ctx.save();

  if (isEraser) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)"; // removes color
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
    ctx.fillStyle = "rgba(0,0,0,1)"; // removes color
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${settings.opacity / 100})`;
  }

  ctx.beginPath();
  ctx.arc(x, y, settings.size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* Crop overlay drawing */
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

/* Draw selection overlay */
export function drawSelectionOverlay(
  overlayCtx: CanvasRenderingContext2D,
  selection: { x: number; y: number; width: number; height: number } | null,
) {
  const { width, height } = overlayCtx.canvas;
  overlayCtx.clearRect(0, 0, width, height);
  if (!selection) return;

  overlayCtx.save();
  overlayCtx.strokeStyle = "white";
  overlayCtx.lineWidth = 1;
  overlayCtx.setLineDash([4, 4]);
  overlayCtx.strokeRect(
    selection.x,
    selection.y,
    selection.width,
    selection.height,
  );
  overlayCtx.strokeStyle = "black";
  overlayCtx.setLineDash([4, 4]);
  overlayCtx.lineDashOffset = 4;
  overlayCtx.strokeRect(
    selection.x,
    selection.y,
    selection.width,
    selection.height,
  );
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
