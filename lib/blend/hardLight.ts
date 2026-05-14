import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const hardLight: BlendModeDescriptor = {
  value: "hard-light",
  label: "Hard Light",
  group: "Contrast",
};

// hard light is overlay with s and b swapped
export function blendHardLight(s: number, b: number): number {
  return s < 0.5 ? 2 * s * b : 1 - 2 * (1 - s) * (1 - b);
}
