import { hslToRgb, rgbToHsl } from "@/utils/color";
import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const luminosity: BlendModeDescriptor = {
  value: "luminosity",
  label: "Luminosity",
  group: "Component",
};

// backdrop hue + backdrop saturation + source luminosity
export function blendLuminosity(
  sr: number,
  sg: number,
  sb: number,
  br: number,
  bg: number,
  bb: number,
): [number, number, number] {
  const [, , sL] = rgbToHsl(sr, sg, sb);
  const [bH, bS] = rgbToHsl(br, bg, bb);
  return hslToRgb(bH, bS, sL);
}
