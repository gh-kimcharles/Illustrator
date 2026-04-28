"use client";

import { makeLayer } from "@/lib/layers/layerManager";
import { useEditorStore } from "@/store/useEditorStore";
import { useCallback, useRef } from "react";

// serialise
// convert each layer's OffscreenCanvas to a base64 PNG string
async function serialiseProject() {
  const { layers, canvasSize, activeLayerId } = useEditorStore.getState();

  const serialisedLayers = await Promise.all(
    layers.map(async (layer) => {
      let pixelData: string | null = null;

      if (layer.canvas) {
        // convert OffscreenCanvas -> blob -> base64
        const blob = await layer.canvas.convertToBlob({ type: "image/png" });
        pixelData = await blobToBase64(blob);
      }

      return {
        id: layer.id,
        name: layer.name,
        visible: layer.visible,
        locked: layer.locked,
        opacity: layer.opacity,
        blendMode: layer.blendMode,
        offsetX: layer.offsetX,
        offsetY: layer.offsetY,
        pixelData,
      };
    }),
  );

  return {
    canvasSize,
    layers: serialisedLayers,
    activeLayerId,
  };
}

// deserialise
// reconstructs OffscreenCanvas instances from base64 PNG strings
async function deserialiseProject(data: ReturnType<typeof JSON.parse>) {
  const { canvasSize, layers: rawLayers, activeLayerId } = data;

  const layers = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawLayers.map(async (raw: any) => {
      const layer = makeLayer(raw.name, canvasSize, raw.locked);

      // restore metadata
      layer.id = raw.id;
      layer.visible = raw.visible;
      layer.opacity = raw.opacity;
      layer.blendMode = raw.blendMode;
      layer.offsetX = raw.offsetX ?? 0;
      layer.offsetY = raw.offsetY ?? 0;

      // restore pixel data from base64 PNG
      if (raw.pixelData && layer.canvas) {
        const ctx = layer.canvas.getContext("2d");
        if (ctx) {
          const img = await base64ToImage(raw.pixelData);
          ctx.drawImage(img, 0, 0);
        }
      }

      return layer;
    }),
  );

  return { canvasSize, layers, activeLayerId };
}

// helpers
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToImage(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64;
  });
}

// generate thumbnail
// takes a small screenshot of the display canvas for the project card
function generateThumbnail(): string | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canvas = (window as any).__editorCanvas as HTMLCanvasElement | null;
  if (!canvas) return null;

  // draw to a small 200x150 thumbnail canvas
  const thumb = document.createElement("canvas");
  thumb.width = 200;
  thumb.height = 150;
  const ctx = thumb.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(canvas, 0, 0, 200, 150);
  return thumb.toDataURL("image/jpeg", 0.7);
}

// hook
export function useProject() {
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // save project
  const saveProject = useCallback(
    async (name: string, existingId?: string): Promise<string | null> => {
      try {
        const data = await serialiseProject();
        const thumbnail = generateThumbnail();

        if (existingId) {
          // update existing project
          await fetch(`/api/projects/${existingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, thumbnail, data }),
          });
          return existingId;
        } else {
          // create new project
          const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, thumbnail, data }),
          });
          const json = await res.json();
          return json.project?.id ?? null;
        }
      } catch (err) {
        console.error("[useProject] save error:", err);
        return null;
      }
    },
    [],
  );

  // load project
  const loadProject = useCallback(
    async (projectId: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const json = await res.json();
        if (!json.project) return false;

        const { canvasSize, layers, activeLayerId } = await deserialiseProject(
          json.project.data,
        );

        // push everything into the Zustand store
        useEditorStore.setState({
          canvasSize,
          layers,
          activeLayerId,
          selection: null,
        });

        return true;
      } catch (err) {
        console.log("[useProject] load error:", err);
        return false;
      }
    },
    [],
  );

  // auto save
  const triggerAutoSave = useCallback(
    (name: string, existingId: string) => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        saveProject(name, existingId);
      }, 3000);
    },
    [saveProject],
  );

  return { saveProject, loadProject, triggerAutoSave };
}
