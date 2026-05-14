import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const darken: BlendModeDescriptor = {
  value: "darken",
  label: "Darken",
  group: "Darken",
};

export function blendDarken(s: number, b: number): number {
  return s < b ? s : b;
}
