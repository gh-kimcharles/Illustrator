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

/* Canvas properties */
export interface CanvasSize {
  width: number;
  height: number;
}

/* Layer properties */
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;

  // each layer will have their own offscreen canvas
  canvas: OffscreenCanvas | null;
  offsetX: number;
  offsetY: number;
}

/* RGB colors */
export interface RGBColor {
  r: number; // red
  g: number; // green
  b: number; // blue
}

/* Brush settings */
export interface BrushSettings {
  size: number;
  hardness: number; // sharpness; crisp vs soft
  opacity: number; // transparency; solid vs transparent
}

/* Text settings */
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

export type Selection = SelectionRectangle | SelectionLasso;

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

/* History */
export interface HistorySnapshot {
  label: string;
  layerData: Map<string, ImageData>; // layerId in pixels
  layerOrder: string[]; // order layer ids
}
