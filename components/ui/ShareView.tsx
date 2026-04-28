"use client";

import { useEffect, useRef } from "react";

interface LayerData {
  pixelData: string | null;
  visible: boolean;
  opacity: number;
  blendMode: string;
  offsetX: number;
  offsetY: number;
}

interface ProjectData {
  canvasSize: { width: number; height: number };
  layers: LayerData[];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// renders the shared project by drawing each layer's pixelData
// onto a single display canvas
export function ShareView({ projectData }: { projectData: unknown }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const data = projectData as ProjectData;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    async function render() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw a white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw each visible layer bottom to top
      for (const layer of data.layers) {
        if (!layer.visible || !layer.pixelData) continue;

        const img = await loadImage(layer.pixelData);

        ctx.save();
        ctx.globalAlpha = layer.opacity / 100;
        ctx.globalCompositeOperation =
          layer.blendMode as GlobalCompositeOperation;
        ctx.drawImage(img, layer.offsetX ?? 0, layer.offsetY ?? 0);
        ctx.restore();
      }
    }

    render();
  }, [data]);

  // scale down large canvases to fit the viewport
  const maxDisplay = 800;
  const scale = Math.min(
    1,
    maxDisplay / Math.max(data.canvasSize.width, data.canvasSize.height),
  );

  return (
    <div
      className="shadow-2xl border border-editor-border"
      style={{
        width: data.canvasSize.width * scale,
        height: data.canvasSize.height * scale,
      }}
    >
      <canvas
        ref={canvasRef}
        width={data.canvasSize.width}
        height={data.canvasSize.height}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}
