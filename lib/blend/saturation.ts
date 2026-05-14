import { hslToRgb, rgbToHsl } from "@/utils/color";
import { BlendModeDescriptor } from "../../components/Panels/BlendModes";

export const saturation: BlendModeDescriptor = {
  value: "saturation",
  label: "Saturation",
  group: "Component",
};

// backdrop hue + source saturation + backdrop luminosity
export function blendSaturation(
  sr: number,
  sg: number,
  sb: number,
  br: number,
  bg: number,
  bb: number,
): [number, number, number] {
  const [bH, , bL] = rgbToHsl(br, bg, bb);
  const [, sS] = rgbToHsl(sr, sg, sb);
  return hslToRgb(bH, sS, bL);
}
