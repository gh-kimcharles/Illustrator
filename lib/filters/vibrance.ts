import { hslToRgb, rgbToHsl } from "@/utils/color";

/* Vibrance */
// intelligently boosts saturation, applies more effect to less-saturated
// pixels and less effect to already-vivid pixels.
// amount: -100 to +100
//  positive = boost dull colours
//  negative = desaturate dull colours more than vivid ones

// ensure value range from 0 to 1
function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/* Apply Vibrance */
// dull colours become vivid, already-vivid colours are protected from over-saturation
// pixels with low saturation get stronger boost
// pixels with near full saturation are left mostly alone
export function applyVibrance(imageData: ImageData, amount: number): void {
  const data = imageData.data;
  const strength = amount / 100;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;

    const [h, s0, l] = rgbToHsl(r, g, b);
    let s = s0; // saturation gets boost

    const inv = 1 - s;
    const weight = inv * inv;

    const luminanceMask = Math.pow(1 - Math.abs(2 * l - 1), 1.5);

    if (strength > 0) {
      if (s < 0.95) {
        s += weight * strength * luminanceMask;
      }
    } else {
      s += s * strength * luminanceMask;
    }

    // new saturation
    s = clamp01(s);

    // snap near-zero to prevent floating point tint
    if (s < 0.001) s = 0;

    const [nr, ng, nb] = hslToRgb(h, s, l);

    data[i] = Math.round(nr * 255);
    data[i + 1] = Math.round(ng * 255);
    data[i + 2] = Math.round(nb * 255);
    // alpha untouched
  }
}
