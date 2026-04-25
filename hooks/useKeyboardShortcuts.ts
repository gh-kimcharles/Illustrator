"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import type { ToolName } from "@/types";

const KEY_TOOL_MAP: Record<string, ToolName> = {
  v: "Move",
  m: "Marquee",
  l: "Lasso",
  c: "Crop",
  i: "Eyedropper",
  b: "Brush",
  e: "Eraser",
  g: "Fill",
  t: "Text",
  u: "Shape",
  z: "Zoom",
  h: "Hand",
};

export function useKeyboardShortcuts() {
  const {
    setActiveTool,
    zoomIn,
    zoomOut,
    zoomFit,
    zoom100,
    undo,
    redo,
    canUndo,
    canRedo,
    setSelection,
  } = useEditorStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Do not apply shortcuts while typing in input
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const ctrl = e.ctrlKey || e.metaKey;

      // Tool shortcuts (single key)
      if (ctrl) {
        switch (e.key) {
          case "=":
          case "+":
            e.preventDefault();
            zoomIn();
            break;
          case "-":
            e.preventDefault();
            zoomOut();
            break;
          case "0":
            e.preventDefault();
            zoomFit();
            break;
          case "1":
            e.preventDefault();
            zoom100();
            break;
          // Undo (Ctrl+Z)
          case "z":
            e.preventDefault();
            if (!e.shiftKey && canUndo) undo();
            break;
          // Redo (Ctrl+Y  or  Ctrl+Shift+Z)
          case "y":
            e.preventDefault();
            if (canRedo) redo();
            break;
          // Ctrl+Shift+Z — also redo (common in many apps)
          case "Z":
            e.preventDefault();
            if (e.shiftKey && canRedo) redo();
            break;
          // Deselect all (Ctrl+D)
          case "d":
            e.preventDefault();
            setSelection(null);
            break;
        }
        return;
      }

      // Single-key tool shortcuts
      const tool = KEY_TOOL_MAP[e.key.toLowerCase()];
      if (tool) {
        e.preventDefault();
        setActiveTool(tool);
      }

      // Escape clear selection
      if (e.key === "Escape") setSelection(null);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    setActiveTool,
    zoomIn,
    zoomOut,
    zoomFit,
    zoom100,
    undo,
    redo,
    canUndo,
    canRedo,
    setSelection,
  ]);
}
