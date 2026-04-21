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
  const { setActiveTool, zoomIn, zoomOut, zoomFit, zoom100 } = useEditorStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      // Tool shortcuts (single key)
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        const tool = KEY_TOOL_MAP[e.key.toLowerCase()];
        if (tool) {
          e.preventDefault();
          setActiveTool(tool);
        }
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          zoomIn();
        }
        if (e.key === "-") {
          e.preventDefault();
          zoomOut();
        }
        if (e.key === "0") {
          e.preventDefault();
          zoomFit();
        }
        if (e.key === "1") {
          e.preventDefault();
          zoom100();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setActiveTool, zoomIn, zoomOut, zoomFit, zoom100]);
}
