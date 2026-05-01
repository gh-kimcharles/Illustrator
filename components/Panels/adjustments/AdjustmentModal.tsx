"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { Dialog, DialogButton } from "@/components/ui";
import { compositeLayers } from "@/lib/layers/layerManager";

interface AdjustmentModalProps {
  title: string;
  onCommit: () => void;
  onCancel: () => void;
  // parent renders the sliders as children
  // parent can only apply filters on top of a copy
  children: (preview: () => void) => React.ReactNode;
  onPreview: (savedData: ImageData) => void;
  autoPreview?: boolean; // add: autoPreview will populate savedDataRef for Invert and Grayscale filters
  className?: string;
}

export const AdjustmentModal = ({
  title,
  onCommit,
  onCancel,
  children,
  onPreview,
  autoPreview = false,
  className,
}: AdjustmentModalProps) => {
  const { layers, activeLayerId, canvasSize } = useEditorStore();

  // snapshot of pixel data before any adjustment - restored on cancel
  const savedDataRef = useRef<ImageData | null>(null);

  // holds the latest handlePreview so the snapshot effect can call it
  // without needing handlePreview in the dependency array
  const previewFnRef = useRef<() => void>(() => {});

  // get display canvas for recompositing
  const getDisplayCtx = useCallback((): CanvasRenderingContext2D | null => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canvas = (window as any).__editorCanvas as HTMLCanvasElement | null;
    return canvas?.getContext("2d") ?? null;
  }, []);

  // preview: restore clean copy, apply filter, recomposite
  const handlePreview = useCallback(() => {
    const saved = savedDataRef.current;
    if (!saved) return;

    const layer = layers.find((l) => l.id === activeLayerId);
    if (!layer?.canvas) return;

    const ctx = layer.canvas.getContext("2d");
    if (!ctx) return;

    // restore pre-adjustment pixels first
    ctx.putImageData(saved, 0, 0);

    // let the parent apply its filter onto the now-clean layer
    const cleanCopy = new ImageData(
      new Uint8ClampedArray(saved.data),
      saved.width,
      saved.height,
    );
    onPreview(cleanCopy);

    // Write the filtered result back to the layer
    ctx.putImageData(cleanCopy, 0, 0);

    // Recomposite all layers onto the display canvas
    const displayCtx = getDisplayCtx();
    if (displayCtx) compositeLayers(displayCtx, layers, canvasSize);
  }, [layers, activeLayerId, canvasSize, onPreview, getDisplayCtx]);

  // eslint-disable-next-line react-hooks/refs
  previewFnRef.current = handlePreview;

  // stable wrapper - created once, reads from ref at call time
  const stablePreview = useCallback(() => {
    previewFnRef.current();
  }, []); // empty deps - identity is stable, reads latest via ref

  // snaphot on mount
  useEffect(() => {
    const layer = layers.find((l) => l.id === activeLayerId);
    if (!layer?.canvas) return;
    const ctx = layer.canvas.getContext("2d");
    if (!ctx) return;

    // Save a copy
    savedDataRef.current = ctx.getImageData(
      0,
      0,
      layer.canvas.width,
      layer.canvas.height,
    );

    // auto-preview immediately after snapshot is ready
    // setTimeout 0 ensures savedDataRef.current is set
    // before previewFnRef.current() reads it
    if (autoPreview) {
      // use timeout to set before handlePreview reads the snapshot
      setTimeout(() => {
        previewFnRef.current();
      }, 0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs once on mount only

  // apply: commit the current state
  const handleApply = useCallback(() => {
    onCommit();
  }, [onCommit]);

  // cancel: restore saved pixels
  const handleCancel = useCallback(() => {
    const saved = savedDataRef.current;
    const layer = layers.find((l) => l.id === activeLayerId);
    if (saved && layer?.canvas) {
      const ctx = layer.canvas.getContext("2d");
      if (ctx) ctx.putImageData(saved, 0, 0);

      // recomposite
      const displayCtx = getDisplayCtx();
      if (displayCtx) compositeLayers(displayCtx, layers, canvasSize);
    }
    onCancel();
  }, [layers, activeLayerId, canvasSize, onCancel, getDisplayCtx]);

  return (
    <Dialog
      title={title}
      onClose={handleCancel}
      footer={
        <>
          <DialogButton variant="default" onClick={handleCancel}>
            Cancel
          </DialogButton>
          <DialogButton variant="primary" onClick={handleApply}>
            Apply
          </DialogButton>
        </>
      }
      className="w-80"
    >
      {/* Render sliders from parent */}
      <div className="space-y-4">
        {/* Inject handlePreview so sliders can trigger it */}
        {typeof children === "function"
          ? (children as (preview: () => void) => React.ReactNode)(
              // eslint-disable-next-line react-hooks/refs
              stablePreview,
            )
          : children}
      </div>
    </Dialog>
  );
};
