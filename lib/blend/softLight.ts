import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const softLight: BlendModeDescriptor = {
  value: "soft-light",
  label: "Soft Light",
  group: "Contrast",
};

// W3C soft-light formula
export function blendSoftLight(s: number, b: number): number {
  if (s <= 0.5) {
    return b - (1 - 2 * s) * b * (1 - b);
  }
  const d =
    b <= 0.25
      ? ((16 * b - 12) * b + 4) * b // curved branch
      : Math.sqrt(b); // sqrt branch
  return b + (2 * s - 1) * (d - b);
}
