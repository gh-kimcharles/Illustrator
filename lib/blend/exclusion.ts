import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const exclusion: BlendModeDescriptor = {
  value: "exclusion",
  label: "Exclusion",
  group: "Difference",
};

// softer version of difference
export function blendExclusion(s: number, b: number): number {
  return s + b - 2 * s * b;
}
