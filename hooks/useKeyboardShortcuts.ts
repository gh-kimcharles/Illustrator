"use client";

import { useEffect, useRef } from "react";
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

  const latestRef = useRef({ undo, redo, canUndo, canRedo });
  useEffect(() => {
    latestRef.current = { undo, redo, canUndo, canRedo };
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const ctrl = e.ctrlKey || e.metaKey;
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
          case "z":
            e.preventDefault();
            if (!e.shiftKey && latestRef.current.canUndo)
              latestRef.current.undo();
            break;
          case "y":
            e.preventDefault();
            if (latestRef.current.canRedo) latestRef.current.redo();
            break;
          case "Z":
            e.preventDefault();
            if (e.shiftKey && latestRef.current.canRedo)
              latestRef.current.redo();
            break;
          case "d":
            e.preventDefault();
            setSelection(null);
            break;
        }
        return;
      }

      const tool = KEY_TOOL_MAP[e.key.toLowerCase()];
      if (tool) {
        e.preventDefault();
        setActiveTool(tool);
      }
      if (e.key === "Escape") setSelection(null);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setActiveTool, zoomIn, zoomOut, zoomFit, zoom100, setSelection]);
}
