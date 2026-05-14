import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const lighten: BlendModeDescriptor = {
  value: "lighten",
  label: "Lighten",
  group: "Lighten",
};

export function blendLighten(s: number, b: number): number {
  return s > b ? s : b;
}
