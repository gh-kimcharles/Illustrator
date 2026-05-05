/* Tools */
export type ToolName =
  | "Move"
  | "Marquee"
  | "Lasso"
  | "Crop"
  | "Eyedropper"
  | "Brush"
  | "Eraser"
  | "Fill"
  | "Text"
  | "Shape"
  | "Zoom"
  | "Hand";

/* Blend Modes */
export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

/* RGB colors (red, green, blue) */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/* Layer properties */
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;

  // add: each layer will have own offscreen canvas
  canvas: OffscreenCanvas | null;
  offsetX: number;
  offsetY: number;
}

/* Canvas properties */
export interface CanvasSize {
  width: number;
  height: number;
}

/* Brush settings */
export interface BrushSettings {
  size: number;
  hardness: number; // brush sharpness (crisp vs soft)
  opacity: number; // brush transparency (solid vs transparent)
}

export interface TextSettings {
  fontFamily: string;
  fontSize: number; // px
  bold: boolean;
  italic: boolean;
  align: CanvasTextAlign;
}

export interface TextOverlay {
  // canvas space coordinates where the user clicked
  canvasX: number;
  canvasY: number;

  // screen space position for the <textarea> - for zoom and pan
  screenX: number;
  screenY: number;
}

// add: selection and history
/* Rectanglular marquee selection */
export interface SelectionRectangle {
  kind: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}

// add: freehand lasso selection
export interface SelectionLasso {
  kind: "lasso";
  // raw polygon points in canvas coordinates
  points: { x: number; y: number }[];
  // prebuilt Path2D for clipping
  path: Path2D;
}

export type Selection = SelectionRectangle | SelectionLasso;

/* History */
export interface HistorySnapshot {
  label: string;
  layerData: Map<string, ImageData>; // layerId -> pixels
  layerOrder: string[]; // order layer ids
}
