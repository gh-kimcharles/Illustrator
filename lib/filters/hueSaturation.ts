import { hslToRgb, rgbToHsl } from "@/utils/color";

/* Hue / Saturation */

// ensure values ranges on normalization (0-1)
function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/* Apply Hue / Saturation */
// convert each pixel RGB -> HSL, adjusts, converts back to RGB.
// hue: -180 to +180 (degress shift)
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
    // normalised RGB
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;

    // convert RGB to HSL
    let [h, s, l] = rgbToHsl(r, g, b);

    // apply adjustments
    h = ((((h * 360 + hue) % 360) + 360) % 360) / 360; // hue = (h + shift) mod 360
    s = clamp01(s + saturation / 100); // saturation = clamp(s + Δs)
    l = clamp01(l + lightness / 100); // lightness = clamp(l + Δl)

    // add: snap near-zero saturation to exact 0 to prevent floating point float
    if (s < 0.001) s = 0;

    // convert back from HSL to RGB
    const [nr, ng, nb] = hslToRgb(h, s, l);

    // scale
    data[i] = Math.round(nr * 255);
    data[i + 1] = Math.round(ng * 255);
    data[i + 2] = Math.round(nb * 255);
    // Alpha untouched
  }
}
