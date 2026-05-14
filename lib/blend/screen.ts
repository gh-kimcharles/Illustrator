import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const screen: BlendModeDescriptor = {
  value: "screen",
  label: "Screen",
  group: "Lighten",
};

// 1 - (1 - s) * (1 - b)
export function blendScreen(s: number, b: number): number {
  return 1 - (1 - s) * (1 - b);
}
