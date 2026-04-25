"use client";

import { useCallback, useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { makeBackgroundLayer } from "@/lib/layers/layerManager";
import { history } from "@/lib/layers/historyManager";

import MenuBar from "@/components/MenuBar/MenuBar";
import OptionsBar from "@/components/MenuBar/OptionsBar";
import CanvasArea from "@/components/CanvasArea/CanvasArea";
import Toolbar from "@/components/Toolbar/Toolbar";
import ColorPanel from "@/components/Panels/ColorPanel";
import AdjustmentsPanel from "@/components/Panels/AdjustmentsPanel";
import LayersPanel from "@/components/Panels/LayersPanel";
import StatusBar from "@/components/StatusBar";
import NewDocumentDialog from "@/components/NewDocumentDialog";

const EditorShell = () => {
  useKeyboardShortcuts();

  const { setCanvasSize, canUndo, canRedo, undo, redo } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showNewDoc, setShowNewDoc] = useState(false);

  // Get composited display canvas exposed by canvasarea
  const getCanvas = () =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__editorCanvas as HTMLCanvasElement | null;

  // New document
  const handleNewDocConfirm = useCallback(
    (width: number, height: number) => {
      const size = { width, height };

      // Build a fresh background layer with offscreencanvas
      const bg = makeBackgroundLayer(size);

      // Reset store: new size + single background layer
      useEditorStore.setState({
        canvasSize: size,
        layers: [bg],
        activeLayerId: bg.id,
        selection: null,
      });

      // Clear undo history for fresh document
      history.clear();
      useEditorStore.setState({
        canUndo: false,
        canRedo: false,
      });

      // Resize the display
      const canvas = getCanvas();
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }

      setShowNewDoc(false);
    },
    [setCanvasSize],
  );

  // Open file
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const img = new Image();
      img.onload = () => {
        const size = { width: img.width, height: img.height };

        // Create a background layer and draw image into it
        const bg = makeBackgroundLayer(size);
        const ctx = bg.canvas?.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0);

        useEditorStore.setState({
          canvasSize: size,
          layers: [bg],
          activeLayerId: bg.id,
          selection: null,
        });

        history.clear();
        useEditorStore.setState({
          canUndo: false,
          canRedo: false,
        });

        // Resize display canvas
        const canvas = getCanvas();
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
      e.target.value = "";
    },
    [],
  );

  // Export PNG
  const handleExportPNG = useCallback(() => {
    const canvas = getCanvas();
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "canvas.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-editor-bg text-editor-text">
      <MenuBar
        onNewDocument={() => setShowNewDoc(true)}
        onOpenFile={() => fileInputRef.current?.click()}
        onExportPNG={handleExportPNG}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />
      <OptionsBar />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <CanvasArea />
        <div className="w-60 bg-editor-panel border-l border-editor-border flex flex-col overflow-y-auto flex-shrink-0">
          <ColorPanel />
          <AdjustmentsPanel />
          <LayersPanel />
        </div>
      </div>
      <StatusBar />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {showNewDoc && (
        <NewDocumentDialog
          onConfirm={handleNewDocConfirm}
          onCancel={() => setShowNewDoc(false)}
        />
      )}
    </div>
  );
};

export default EditorShell;
