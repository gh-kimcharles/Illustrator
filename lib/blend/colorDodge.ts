import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const colorDodge: BlendModeDescriptor = {
  value: "color-dodge",
  label: "Color Dodge",
  group: "Lighten",
};

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// inverse of color burn
export function blendColorDodge(s: number, b: number): number {
  if (s === 1) return 1; // white source → white
  if (b === 0) return 0; // black backdrop → black
  return clamp01(b / (1 - s));
}
