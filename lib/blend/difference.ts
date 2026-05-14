import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const difference: BlendModeDescriptor = {
  value: "difference",
  label: "Difference",
  group: "Difference",
};

export function blendDifference(s: number, b: number): number {
  return Math.abs(s - b);
}
