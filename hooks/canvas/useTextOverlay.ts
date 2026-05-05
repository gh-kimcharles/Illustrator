import React, { useCallback, useEffect, useRef } from "react";
import { compositeLayers } from "@/lib/layers/layerManager";
import { drawTextOverlay } from "@/lib/tools/drawingEngine";
import { commitTextToCanvas } from "@/lib/tools/textEngine";
import { useEditorStore } from "@/store/useEditorStore";

export function useTextOverlay(
  displayRef: React.RefObject<HTMLCanvasElement | null>,
  overlayRef: React.RefObject<HTMLCanvasElement | null>,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
) {
  const {
    layers,
    activeLayerId,
    fgColor,
    canvasSize,
    textSettings,
    textOverlay,
    textValue,
    setTextOverlay,
    setTextValue,
    pushHistory,
  } = useEditorStore();

  // initialize refs for dashOffset and animation state
  const dashOffsetRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  // auto-focus textarea when overlay appears
  useEffect(() => {
    if (textOverlay) requestAnimationFrame(() => textareaRef.current?.focus());
  }, [textOverlay, textareaRef]);

  // marching-ants animation for text overlay bounding box
  useEffect(() => {
    if (!textOverlay) {
      cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const animate = () => {
      dashOffsetRef.current = (dashOffsetRef.current - 0.5) % 8;
      const overlay = overlayRef.current;
      if (overlay) {
        const ctx = overlay.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, overlay.width, overlay.height);
          drawTextOverlay(
            ctx,
            textOverlay.canvasX,
            textOverlay.canvasY,
            textValue,
            textSettings,
            dashOffsetRef.current,
          );
        }
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [textOverlay, textValue, textSettings, overlayRef]);

  /* Commit Text */
  const commitText = useCallback(() => {
    if (!textOverlay || !textValue.trim()) {
      setTextOverlay(null);
      setTextValue("");
      return;
    }

    const layer = layers.find((l) => l.id === activeLayerId);
    const ctx = layer?.canvas?.getContext("2d");
    if (!ctx) {
      setTextOverlay(null);
      setTextValue("");
      return;
    }

    commitTextToCanvas(
      ctx,
      textValue,
      textOverlay.canvasX,
      textOverlay.canvasY,
      textSettings,
      fgColor,
    );

    const display = displayRef.current;
    if (display) {
      const dCtx = display.getContext("2d");
      if (dCtx) compositeLayers(dCtx, layers, canvasSize);
    }

    pushHistory("Text");
    setTextOverlay(null);
    setTextValue("");
  }, [
    textOverlay,
    textValue,
    layers,
    activeLayerId,
    textSettings,
    fgColor,
    canvasSize,
    displayRef,
    setTextOverlay,
    setTextValue,
    pushHistory,
  ]);

  return { commitText };
}
