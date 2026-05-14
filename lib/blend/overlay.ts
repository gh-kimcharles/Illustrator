import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const overlay: BlendModeDescriptor = {
  value: "overlay",
  label: "Overlay",
  group: "Contrast",
};

// overlay is hard light with s and b swapped
export function blendOverlay(s: number, b: number): number {
  return b < 0.5 ? 2 * s * b : 1 - 2 * (1 - s) * (1 - b);
}
