import { hslToRgb, rgbToHsl } from "@/utils/color";
import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const hue: BlendModeDescriptor = {
  value: "hue",
  label: "Hue",
  group: "Component",
};

// source hue + backdrop saturation + backdrop luminosity
export function blendHue(
  sr: number,
  sg: number,
  sb: number,
  br: number,
  bg: number,
  bb: number,
): [number, number, number] {
  const [sH] = rgbToHsl(sr, sg, sb);
  const [, bS, bL] = rgbToHsl(br, bg, bb);
  return hslToRgb(sH, bS, bL);
}
