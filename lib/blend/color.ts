import { hslToRgb, rgbToHsl } from "@/utils/color";
import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const color: BlendModeDescriptor = {
  value: "color",
  label: "Color",
  group: "Component",
};

// source hue + source saturation + backdrop luminosity
export function blendColor(
  sr: number,
  sg: number,
  sb: number,
  br: number,
  bg: number,
  bb: number,
): [number, number, number] {
  const [sH, sS] = rgbToHsl(sr, sg, sb);
  const [, , bL] = rgbToHsl(br, bg, bb);
  return hslToRgb(sH, sS, bL);
}
