import { history } from "@/lib/layers/historyManager";
import { makeBackgroundLayer, makeLayer } from "@/lib/layers/layerManager";
import {
  BlendMode,
  BrushSettings,
  CanvasSize,
  Layer,
  RGBColor,
  SelectionRectangle,
  ToolName,
} from "@/types";
import { create } from "zustand";

const DEFAULT_SIZE: CanvasSize = { width: 800, height: 600 };

/* State Shape */
interface EditorState {
  // Tool
  activeTool: ToolName;
  brush: BrushSettings;

  // Colors
  fgColor: RGBColor;
  bgColor: RGBColor;

  // Document
  canvasSize: CanvasSize;

  // Layers
  layers: Layer[];
  activeLayerId: string;

  // Selection
  selection: SelectionRectangle | null;

  // History
  canUndo: boolean;
  canRedo: boolean;

  // View
  zoom: number;
  showRulers: boolean;

  // History
  // historyStack: HistoryEntry[];

  // Actions
  setActiveTool: (tool: ToolName) => void;
  setBrush: (patch: Partial<BrushSettings>) => void;

  setFgColor: (color: RGBColor) => void;
  setBgColor: (color: RGBColor) => void;
  swapColors: () => void;

  setCanvasSize: (size: CanvasSize) => void;

  addLayer: (name?: string) => void;
  deleteLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  setActiveLayer: (id: string) => void;
  setLayerName: (id: string, name: string) => void;
  setLayerVisibility: (id: string, visible: boolean) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  setLayerBlendMode: (id: string, blendMode: BlendMode) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;

  setSelection: (selection: SelectionRectangle | null) => void;
  pushHistory: (label: string) => void;
  undo: () => void;
  redo: () => void;

  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomFit: () => void;
  zoom100: () => void;
  toggleRulers: () => void;
}

/**
 * Store
 */
const bgLayer = makeBackgroundLayer(DEFAULT_SIZE); // default layer

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  activeTool: "Move",
  brush: { size: 20, hardness: 80, opacity: 100 },

  fgColor: { r: 0, g: 0, b: 0 },
  bgColor: { r: 255, g: 255, b: 255 },

  canvasSize: DEFAULT_SIZE,
  layers: [bgLayer],
  activeLayerId: bgLayer.id,

  selection: null,
  canUndo: false,
  canRedo: false,

  zoom: 1,
  showRulers: true,

  // Tool actions
  setActiveTool: (tool) => set({ activeTool: tool }),
  setBrush: (patch) => set((s) => ({ brush: { ...s.brush, ...patch } })),

  // Color actions
  setFgColor: (color) => set({ fgColor: color }),
  setBgColor: (color) => set({ bgColor: color }),
  swapColors: () => set((s) => ({ fgColor: s.bgColor, bgColor: s.fgColor })),

  // Canvas size
  setCanvasSize: (size) => set({ canvasSize: size }),

  // Layer CRUD actions
  addLayer: (name) => {
    const s = get();
    const layer = makeLayer(
      name ?? `Layer ${get().layers.length + 1}`,
      s.canvasSize,
    );
    set({
      layers: [...s.layers, layer],
      activeLayerId: layer.id,
    });
  },

  deleteLayer: (id) =>
    set((s) => {
      if (s.layers.length <= 1) return s;
      const layers = s.layers.filter((l) => l.id !== id);
      const activeLayerId =
        s.activeLayerId === id ? layers[layers.length - 1].id : s.activeLayerId;
      return { layers, activeLayerId };
    }),

  duplicateLayer: (id) =>
    set((s) => {
      const src = s.layers.find((l) => l.id === id);
      if (!src) return s;

      // Create a new Offscreencanvas and copy pixel data
      const newCanvas = new OffscreenCanvas(
        s.canvasSize.width,
        s.canvasSize.height,
      );

      const ctx = newCanvas.getContext("2d");
      if (ctx && src.canvas) ctx.drawImage(src.canvas, 0, 0);
      const copy: Layer = {
        ...src,
        id: crypto.randomUUID(),
        name: src.name + " copy",
        locked: false,
        canvas: newCanvas,
      };
      const idx = s.layers.findIndex((l) => l.id === id);
      const layers = [...s.layers];
      layers.splice(idx + 1, 0, copy);
      return { layers, activeLayerId: copy.id };
    }),

  setActiveLayer: (id) => set({ activeLayerId: id }),

  setLayerName: (id, name) =>
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, name } : l)),
    })),

  setLayerVisibility: (id, visible) =>
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, visible } : l)),
    })),

  setLayerOpacity: (id, opacity) =>
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, opacity } : l)),
    })),

  setLayerBlendMode: (id, blendMode) =>
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, blendMode } : l)),
    })),

  moveLayerUp: (id) =>
    set((s) => {
      const idx = s.layers.findIndex((l) => l.id === id);
      if (idx >= s.layers.length - 1) return s;
      const layers = [...s.layers];
      [layers[idx], layers[idx + 1]] = [layers[idx + 1], layers[idx]];
      return { layers };
    }),

  moveLayerDown: (id) =>
    set((s) => {
      const idx = s.layers.findIndex((l) => l.id === id);
      if (idx <= 0) return s;
      const layers = [...s.layers];
      [layers[idx], layers[idx - 1]] = [layers[idx - 1], layers[idx]];
      return { layers };
    }),

  setSelection: (selection) => set({ selection: selection }),
  pushHistory: (label) => {
    history.push(label, get().layers);
    set({
      canUndo: history.canUndo(),
      canRedo: history.canRedo(),
    });
  },
  undo: () => {
    const undo = history.undo(get().layers);
    if (undo)
      set((s) => ({
        layers: [...s.layers], // trigger re-render
        canUndo: history.canUndo(),
        canRedo: history.canRedo(),
      }));
  },

  redo: () => {
    const redo = history.redo(get().layers);
    if (redo)
      set((s) => ({
        layers: [...s.layers],
        canUndo: history.canUndo(),
        canRedo: history.canRedo(),
      }));
  },

  // View actions
  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.05), 16) }),
  zoomIn: () => set((s) => ({ zoom: Math.min(s.zoom * 1.25, 16) })),
  zoomOut: () => set((s) => ({ zoom: Math.max(s.zoom / 1.25, 0.05) })),
  zoomFit: () => set({ zoom: 0.6 }),
  zoom100: () => set({ zoom: 1 }),
  toggleRulers: () => set((s) => ({ showRulers: !s.showRulers })),
}));
