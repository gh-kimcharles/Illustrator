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

  const getCanvas = () =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__editorCanvas as HTMLCanvasElement | null;

  const handleNewDocConfirm = useCallback(
    (width: number, height: number) => {
      setCanvasSize({ width, height });
      setShowNewDoc(false);
      const canvas = getCanvas();
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

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => {
        setCanvasSize({ width: img.width, height: img.height });
        const canvas = getCanvas();
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
      />

      <OptionsBar />

      <div className="flex flex-1 overflow-hidden">
        <Toolbar />

        <CanvasArea />

        {/* Right panel column */}
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
