"use client";

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useEditorStore } from "@/store/useEditorStore";
import { useCallback, useRef, useState } from "react";
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

  const { setCanvasSize } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showNewDoc, setShowNewDoc] = useState(false);

  // File operations
  const handleNewDocument = useCallback(() => setShowNewDoc(true), []);

  const handleNewDocConfirm = useCallback(
    (width: number, height: number) => {
      setCanvasSize({ width, height });
      setShowNewDoc(false);

      // Clear canvas
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const canvas = (window as any).__editorCanvas as HTMLCanvasElement | null;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = width;
          canvas.height = height;
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, width, height);
        }
      }
    },
    [setCanvasSize],
  );

  const handleOpenFile = useCallback(() => fileInputRef.current?.click(), []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => {
        setCanvasSize({ width: img.width, height: img.height });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const canvas = (window as any)
          .__editorCanvas as HTMLCanvasElement | null;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        }
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
      e.target.value = "";
    },
    [setCanvasSize],
  );

  const handleExportPNG = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canvas = (window as any).__editorCanvas as HTMLCanvasElement | null;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "canvas.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  }, []);

  return (
    <>
      {/* Render */}
      <div className="flex flex-col h-screen overflow-hidden bg-editor-bg text-editor-textPrimary">
        {/* Menu bar */}
        <MenuBar
          onNewDocument={handleNewDocument}
          onOpenFile={handleOpenFile}
          onExportPNG={handleExportPNG}
        />

        {/* Option bar */}
        <OptionsBar />

        {/* Main work */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left toolbar */}
          <Toolbar />

          {/* Canvas */}
          <CanvasArea />

          {/* Right panel column */}
          <div
            className="w-60 bg-editor-panel border-l border-editor-border flex flex-col overflow-y-auto flex-shrink-0"
            style={{ scrollbarWidth: "thin" }}
          >
            <ColorPanel />
            <AdjustmentsPanel />
            <LayersPanel />
          </div>
        </div>

        {/* Status bar */}
        <StatusBar />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* New Document dialog */}
        {showNewDoc && (
          <NewDocumentDialog
            onConfirm={handleNewDocConfirm}
            onCancel={() => setShowNewDoc(false)}
          />
        )}
      </div>
    </>
  );
};

export default EditorShell;
