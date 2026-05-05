import { CanvasSize, Layer } from "@/types";

/* Create layer */
export function makeLayer(
  name: string,
  size: CanvasSize,
  locked = false,
): Layer {
  const offscreen =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(size.width, size.height)
      : null;

  return {
    id: crypto.randomUUID(),
    name,
    visible: true,
    locked,
    opacity: 100,
    blendMode: "normal",
    canvas: offscreen,
    offsetX: 0,
    offsetY: 0,
  };
}

/* Background */
// background layer is white-filled and locked by default
export function makeBackgroundLayer(size: CanvasSize): Layer {
  const layer = makeLayer("Background", size, true);
  if (layer.canvas) {
    const ctx = layer.canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, size.width, size.height);
    }
  }

  return layer;
}

/* Compositor */
// merge all visible layer on the canvas (bottom to top); called after every event
export function compositeLayers(
  displayCtx: CanvasRenderingContext2D,
  layers: Layer[],
  size: CanvasSize,
): void {
  // Clear display canvas first
  displayCtx.clearRect(0, 0, size.width, size.height);

  // Paint layer from bottom to top
  for (const layer of layers) {
    if (!layer.visible || !layer.canvas) continue;

    displayCtx.save();
    displayCtx.globalAlpha = layer.opacity / 100;
    displayCtx.globalCompositeOperation =
      layer.blendMode as GlobalCompositeOperation;
    displayCtx.drawImage(layer.canvas, layer.offsetX, layer.offsetY);
    displayCtx.restore();
  }
}

/* Snapshot */
// captures the current pixel state of every layer as image data
// update: wrapping the imageData in a new Uint8ClampedArray copy so snapshots aren't sharing the same pixel buffer
export function snapshotLayers(layers: Layer[]): Map<string, ImageData> {
  const map = new Map<string, ImageData>();
  for (const layer of layers) {
    if (!layer.canvas) continue;
    const ctx = layer.canvas.getContext("2d");
    if (!ctx) continue;
    const imageData = ctx.getImageData(
      0,
      0,
      layer.canvas.width,
      layer.canvas.height,
    );
    map.set(
      layer.id,
      new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height,
      ),
    );
  }
  return map;
}

/* Restore snapshot (from undo/redo) */
// writes ImageData back to each layer's OffscreenCanvas
export function restoreSnapshot(
  layers: Layer[],
  snapshot: Map<string, ImageData>,
): void {
  for (const layer of layers) {
    const imageData = snapshot.get(layer.id);
    if (!imageData || !layer.canvas) continue;
    const ctx = layer.canvas.getContext("2d");
    if (!ctx) continue;
    ctx.putImageData(imageData, 0, 0);
  }
}

/* Resize */
// creates new OffscreenCanvas size, copying old content
export function resizeLayerCanvas(
  layer: Layer,
  newSize: CanvasSize,
): OffscreenCanvas {
  const next = new OffscreenCanvas(newSize.width, newSize.height);
  const ctx = next.getContext("2d");
  if (ctx && layer.canvas) {
    ctx.drawImage(layer.canvas, 0, 0);
  }
  return next;
}
