import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const colorBurn: BlendModeDescriptor = {
  value: "color-burn",
  label: "Color Burn",
  group: "Darken",
};

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function blendColorBurn(s: number, b: number): number {
  if (s === 0) return 0;
  if (b === 1) return 1; // add: white background -> white
  return clamp01(1 - (1 - b) / s);
}
