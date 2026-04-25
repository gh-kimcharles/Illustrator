import { hslToRgb, rgbToHsl } from "@/utils/color";

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/* Hue / Saturation */
// convert each pixel RGB -> HSL, adjusts, converts back to RGB.
// hue: -180 to + 180 (degress shift)
// saturation: -100 to +100 (0 = no change)
// lightness: -100 to +100 (0 = no change)
export function applyHueSaturation(
  imageData: ImageData,
  hue: number,
  saturation: number,
  lightness: number,
) {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;

    let [h, s, l] = rgbToHsl(r, g, b);

    // apply adjustments
    h = ((((h * 360 + hue) % 360) + 360) % 360) / 360;
    s = clamp01(s + saturation / 100);
    l = clamp01(l + lightness / 100);

    const [nr, ng, nb] = hslToRgb(h, s, l);

    data[i] = Math.round(nr * 255);
    data[i + 1] = Math.round(ng * 255);
    data[i + 2] = Math.round(nb * 255);
    // Alpha untouched
  }
}
