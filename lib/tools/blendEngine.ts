import { BlendMode } from "@/types";
import { blendMultiply } from "../blend/multiply";
import { blendDarken } from "../blend/darken";
import { blendColorBurn } from "../blend/colorBurn";

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/* Channel blender dispatch */
// returns blended value for a single channel (0-1) given mode;
// returns null for modes - fall back to normal for modes that aren't implemented YET
function blendChannel(mode: BlendMode, s: number, b: number): number | null {
  if (mode === "normal") return s; // explicit: source before alpha composite
  if (mode === "multiply") return blendMultiply(s, b);
  if (mode === "darken") return blendDarken(s, b);
  if (mode === "color-burn") return blendColorBurn(s, b);
  return null; // unimplemented -> fallback to normal
}

/* Compositor */
function blendPixel(
  mode: BlendMode,
  src: Uint8ClampedArray,
  backdrop: Uint8ClampedArray,
  out: Uint8ClampedArray,
  i: number, // byte offset (i, i+1, i+2, i+3 = R,G,B,A)
): void {
  const sA = src[i + 3] / 255;
  const bA = backdrop[i + 3] / 255;

  if (sA === 0) {
    // fully transparent source; backdrop shows through unchanged
    out[i] = backdrop[i];
    out[i + 1] = backdrop[i + 1];
    out[i + 2] = backdrop[i + 2];
    out[i + 3] = backdrop[i + 3];
    return;
  }

  const outA = sA + bA * (1 - sA);

  for (let c = 0; c < 3; c++) {
    const sC = src[i + c] / 255;
    const bC = backdrop[i + c] / 255;

    const blended = blendChannel(mode, sC, bC);

    // null = unimplemented mode, fall back to normal
    const mixed = blended !== null ? blended : sC;

    // alpha-composite the blended source over the backdrop
    const result = outA === 0 ? 0 : (mixed * sA + bC * bA * (1 - sA)) / outA;

    out[i + c] = Math.round(clamp01(result) * 255); // channel
  }

  out[i + 3] = Math.round(clamp01(outA) * 255); // alpha
}

export function compositeWithBlendMode(
  mode: BlendMode,
  srcData: ImageData,
  backdropData: ImageData,
): ImageData {
  const len = srcData.data.length;
  const out = new ImageData(srcData.width, srcData.height);

  for (let i = 0; i < len; i += 4) {
    blendPixel(mode, srcData.data, backdropData.data, out.data, i);
  }

  return out;
}
