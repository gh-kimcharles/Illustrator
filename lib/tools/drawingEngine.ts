import { BrushSettings, RGBColor } from "@/types";

/**
 * Brush & Eraser Properties
 */
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

/**
 * Flood Fill
 */
export function floodFill(
  ctx: OffscreenCanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColor: RGBColor,
  tolerance = 32,
) {
  const { width, height } = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

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
    if (x < 0 || x >= width || y < 0 || y >= height) continue;

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

/**
 * Eyedropper
 */
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
