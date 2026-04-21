import {
  BlendMode,
  BrushSettings,
  CanvasSize,
  Layer,
  RGBColor,
  ToolName,
} from "@/types";
import { create } from "zustand";

/**
 * Helpers
 */
function makeLayer(name: string, locked = false): Layer {
  return {
    id: crypto.randomUUID(),
    name,
    visible: true,
    locked,
    opacity: 100,
    blendMode: "normal",
  };
}

/**
 * State Shape
 */
interface EditorState {
  // Tool
  activeTool: ToolName;
  brush: BrushSettings;

  // Colors
  fgColor: RGBColor;
  bgColor: RGBColor;

  // Canvas
  canvasSize: CanvasSize;

  // Layers
  layers: Layer[];
  activeLayerId: string;

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
const backgroundLayer = makeLayer("Background", true); // default layer

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  activeTool: "Move",
  brush: { size: 20, hardness: 80, opacity: 100 },

  fgColor: { r: 0, g: 0, b: 0 },
  bgColor: { r: 255, g: 255, b: 255 },

  canvasSize: { width: 800, height: 600 },
  layers: [backgroundLayer],
  activeLayerId: backgroundLayer.id,

  zoom: 1,
  showRulers: true,

  // Tool actions
  setActiveTool: (tool) => set({ activeTool: tool }),
  setBrush: (patch) => set((s) => ({ brush: { ...s.brush, ...patch } })),

  // Color actions
  setFgColor: (color) => set({ fgColor: color }),
  setBgColor: (color) => set({ bgColor: color }),
  swapColors: () => set((s) => ({ fgColor: s.bgColor, bgColor: s.fgColor })),

  // Canvas actions
  setCanvasSize: (size) => set({ canvasSize: size }),

  // Layer actions
  addLayer: (name) => {
    const layer = makeLayer(name ?? `Layer ${get().layers.length + 1}`);
    set((s) => ({
      layers: [...s.layers, layer],
      activeLayerId: layer.id,
    }));
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
      const copy: Layer = {
        ...src,
        id: crypto.randomUUID(),
        name: src.name + " copy",
        locked: false,
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

  // View actions
  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.05), 16) }),
  zoomIn: () => set((s) => ({ zoom: Math.min(s.zoom * 1.25, 16) })),
  zoomOut: () => set((s) => ({ zoom: Math.max(s.zoom / 1.25, 0.05) })),
  zoomFit: () => set({ zoom: 0.6 }),
  zoom100: () => set({ zoom: 1 }),
  toggleRulers: () => set((s) => ({ showRulers: !s.showRulers })),
}));
