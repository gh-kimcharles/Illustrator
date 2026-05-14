import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const multiply: BlendModeDescriptor = {
  value: "multiply",
  label: "Multiply",
  group: "Darken",
};

// S x B
export function blendMultiply(s: number, b: number): number {
  return s * b;
}
