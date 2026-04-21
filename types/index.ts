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

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface BrushSettings {
  size: number;
  hardness: number;
  opacity: number;
}
