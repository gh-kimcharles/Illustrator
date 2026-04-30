"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { useSession } from "next-auth/react";
import { useProject } from "@/hooks/useProject";
import { SaveProjectModal } from "./ui/SaveProjectModal";

interface EditorShellProps {
  projectId?: string;
}

const EditorShell = ({ projectId }: EditorShellProps) => {
  useKeyboardShortcuts();

  const { data: session } = useSession();
  const { setCanvasSize, canUndo, canRedo, undo, redo } = useEditorStore();
  const { saveProject, loadProject, triggerAutoSave } = useProject();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showNewDoc, setShowNewDoc] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>(projectId);
  const [projectName, setProjectName] = useState("Untitled Project");

  // add: push initial blank state as stack[0]
  // to give undo baseline to restore to
  useEffect(() => {
    const { pushHistory } = useEditorStore.getState();
    pushHistory("initial");
  }, []);

  // Load project on mount if projectId provided
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // Get composited display canvas exposed by canvasarea
  const getCanvas = () =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__editorCanvas as HTMLCanvasElement | null;

  // Save handler
  async function handleSave(name?: string) {
    // If not logged in, return
    if (!session?.user?.id) return;

    const saveName = name ?? projectName;

    // First save - show name modal
    if (!currentId && !name) {
      setShowSaveModal(true);
      return;
    }

    setSaving(true);
    const id = await saveProject(saveName, currentId);
    if (id) {
      setCurrentId(id);
      setProjectName(saveName);
    }
    setSaving(false);
    setShowSaveModal(false);
  }

  // New document
  const handleNewDocConfirm = useCallback((width: number, height: number) => {
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

    // add: add initial state after clearing
    useEditorStore.getState().pushHistory("initial");

    // Resize the display
    const canvas = getCanvas();
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }

    setCurrentId(undefined);
    setProjectName("Untitled Project");
    setShowNewDoc(false);
  }, []);

  // Open file
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const img = new Image();
      img.onload = () => {
        const size = { width: img.width, height: img.height };
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

        // add: new initial state after file changes
        useEditorStore.getState().pushHistory("initial");

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
    a.download = `${projectName}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }, [projectName]);

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

      {/* Status bar */}
      <div className="h-[22px] bg-editor-menubar border-t border-editor-border flex items-center px-3 gap-4 flex-shrink-0 select-none">
        <StatusBar />
        {session?.user && (
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="ml-auto text-[11px] px-3 py-0.5 bg-editor-accent hover:bg-editor-accent-hover text-white transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : currentId ? "Save" : "Save project"}
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Dialogs */}
      {showNewDoc && (
        <NewDocumentDialog
          onConfirm={handleNewDocConfirm}
          onCancel={() => setShowNewDoc(false)}
        />
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <SaveProjectModal
          saving={saving}
          onCancel={() => setShowSaveModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default EditorShell;
