"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { compositeLayers } from "@/lib/layers/layerManager";
import { RulerH, RulerV } from "../ui";
import { useSelectionAnimation, useTextOverlay } from "@/hooks/canvas";
import { useCanvasHandlers } from "@/hooks/useCanvasHandlers";

const CURSOR_MAP: Record<string, string> = {
  Move: "default",
  Marquee: "crosshair",
  Lasso: "crosshair",
  Crop: "crosshair",
  Eyedropper: "crosshair",
  Brush: "crosshair",
  Eraser: "crosshair",
  Fill: "crosshair",
  Text: "text",
  Shape: "crosshair",
  Zoom: "zoom-in",
  Hand: "grab",
};

/* Hint Bar for Tools Actions / Cancel */
const HintBar = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-editor-panel-header border border-editor-border-light text-[11px] text-editor-text px-3 py-1 pointer-events-none">
    {children}
  </div>
);

export const CanvasArea = () => {
  const {
    activeTool,
    fgColor,
    zoom,
    showRulers,
    canvasSize,
    layers,
    textSettings,
    textOverlay,
    textValue,
    setTextValue,
    setTextOverlay,
  } = useEditorStore();

  const displayRef = useRef<HTMLCanvasElement>(null); // composited display
  const overlayRef = useRef<HTMLCanvasElement>(null); // selection dashes
  const containerRef = useRef<HTMLDivElement>(null); // outer scrollable container
  const textareaRef = useRef<HTMLTextAreaElement>(null); // for text input focus

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); // tracks cursor position
  const [altHeld, setAltHeld] = useState(false); // check if alt is held for zoom

  // Custom hooks
  const { commitText } = useTextOverlay(displayRef, overlayRef, textareaRef);
  const {
    pan,
    crop,
    lasso,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
  } = useCanvasHandlers(displayRef, overlayRef, containerRef, commitText);
  const effectiveCropRect = activeTool === "Crop" ? crop.cropRect : null; // crop overlay is only rendered when the Crop tool is active
  useSelectionAnimation(
    overlayRef,
    lasso.isLassoDrawing,
    lasso.lassoPointsRef,
    effectiveCropRect,
  );

  const cursor =
    activeTool === "Hand"
      ? pan.isPanning
        ? "grabbing"
        : "grab"
      : activeTool === "Zoom"
        ? altHeld
          ? "zoom-out"
          : "zoom-in"
        : CURSOR_MAP[activeTool] || "crosshair";

  const rulerOffset = showRulers ? 20 : 0;

  const textareaFont = [
    textSettings.italic ? "italic" : "",
    textSettings.bold ? "bold" : "",
    `${textSettings.fontSize * zoom}px`,
    textSettings.fontFamily,
  ]
    .filter(Boolean)
    .join(" ");

  // track alt
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => setAltHeld(e.altKey);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  // expose canvas globally for EditorShell file I/O
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__editorCanvas = displayRef.current;
  });

  // recomposite when data changes
  useEffect(() => {
    const canvas = displayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    compositeLayers(ctx, layers, canvasSize);
  }, [layers, canvasSize]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => handleMouseMove(e, setCursorPosition),
    [handleMouseMove],
  );

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden"
      style={{ background: "var(--editor-canvas-bg)", cursor }}
      onMouseMove={onMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={(e) => handleMouseUp(e)}
      onWheel={handleWheel}
    >
      {/* Checker pattern background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-conic-gradient(oklch(0.22 0.005 285) 0% 25%, oklch(0.25 0.005 285) 0% 50%)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Rulers */}
      {showRulers && (
        <>
          <div
            className="absolute top-0 left-0 w-5 h-5 z-10"
            style={{
              background: "var(--editor-toolbar)",
              borderRight: "1px solid var(--editor-border)",
              borderBottom: "1px solid var(--editor-border)",
            }}
          />
          <RulerH width={canvasSize.width} />
          <RulerV height={canvasSize.height} />
        </>
      )}

      {/* Zoomable + pannable canvas wrapper */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingLeft: rulerOffset, paddingTop: rulerOffset }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            transform: `translate(${pan.panOffset.x}px, ${pan.panOffset.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
            position: "relative",
            transition: pan.isPanning ? "none" : "transform 0.05s ease-out",
          }}
        >
          <canvas
            ref={displayRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{ display: "block" }}
          />
          <canvas
            ref={overlayRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Inline text editor */}
      {textOverlay && (
        <textarea
          ref={textareaRef}
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              commitText();
            }
            if (e.key === "Escape") {
              setTextOverlay(null);
              setTextValue("");
            }
          }}
          onBlur={commitText}
          onMouseDown={(e) => e.stopPropagation()}
          rows={1}
          style={{
            position: "absolute",
            left: textOverlay.screenX,
            top: textOverlay.screenY,
            font: textareaFont,
            color: `rgb(${fgColor.r},${fgColor.g},${fgColor.b})`,
            textAlign: textSettings.align,
            background: "transparent",
            border: "1px dashed rgba(255,255,255,0.6)",
            outline: "none",
            resize: "none",
            minWidth: "4ch",
            minHeight: `${textSettings.fontSize * zoom * 1.4}px`,
            padding: "2px 4px",
            lineHeight: 1.25,
            width: "auto",
            whiteSpace: "pre",
            overflow: "hidden",
            caretColor: `rgb(${fgColor.r},${fgColor.g},${fgColor.b})`,
            zIndex: 100,
          }}
        />
      )}

      {/* Status / hint overlays */}
      <div className="absolute bottom-1.5 right-2 text-[10px] text-editor-text-disabled pointer-events-none select-none">
        {cursorPosition.x}, {cursorPosition.y} px
      </div>

      {activeTool === "Crop" && crop.cropRect && crop.cropRect.width > 4 && (
        <HintBar>Release to crop · Esc to cancel</HintBar>
      )}
      {activeTool === "Lasso" && lasso.isLassoDrawing && (
        <HintBar>Release to close selection · Esc to cancel</HintBar>
      )}
      {activeTool === "Text" && !textOverlay && (
        <HintBar>Click on canvas to place text</HintBar>
      )}
      {activeTool === "Text" && textOverlay && (
        <HintBar>
          Enter to commit · Shift+Enter for new line · Esc to cancel
        </HintBar>
      )}
    </div>
  );
};

export default CanvasArea;
