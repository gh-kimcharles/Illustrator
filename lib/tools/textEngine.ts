import { RGBColor, TextSettings } from "@/types";

/* Commit Text to Canvas */
// renders a multi-line text string onto an OffscreenCanvas context
export function commitTextToCanvas(
  ctx: OffscreenCanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  settings: TextSettings,
  color: RGBColor,
) {
  if (!text.trim()) return;

  ctx.save();

  // build CSS font string
  const style = [
    settings.italic ? "italic" : "",
    settings.bold ? "bold" : "",
    `${settings.fontSize}px`,
    settings.fontFamily,
  ]
    .filter(Boolean)
    .join(" ");

  ctx.font = style;
  ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
  ctx.textAlign = settings.align;
  ctx.textBaseline = "top";

  // split on newlines and render each line
  const lineHeight = settings.fontSize * 1.2;
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    ctx.fillText(line, x, y + i * lineHeight);
  });

  ctx.restore();
}
