/* LUT builder */
// pre-computes the output for every possible 0-255 input value
// avoids repeating the math for every pixel in the image
function buildLut(
  inMin: number,
  inMax: number,
  gamma: number,
  outMin: number,
  outMax: number,
): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256);
  const inRange = inMax - inMin || 1;
  const outRange = outMax - outMin;

  for (let i = 0; i < 256; i++) {
    // clamp the input range
    const clamped = Math.min(inMax, Math.max(inMin, i));

    // normalise to 0-1
    const normalised = (clamped - inMin) / inRange;

    // apply gamma correction
    // gamma = 1 → no change
    // gamma > 1 → brighten midtones
    // gamma < 1 → darken midtones
    const gammaCorrected = Math.pow(normalised, 1 / gamma);

    // map to output range
    lut[i] = Math.round(outMin + gammaCorrected * outRange);
  }

  return lut;
}

/* Levels */
// remaps pixel values from an input range [inMin, inMax] to an output range
// [outMin, outMax] mirrors ps levels adjustment

// all values are range 0-255
// Default (no-op): inMin = 0; inMax = 255; gamma = 1.0, outMin = 0, outMax = 255
export function applyLevels(
  imageData: ImageData,
  inMin: number, // 0-254
  inMax: number, // 1-255
  gamma: number, //0.1-9.99
  outMin: number, // 0-254
  outMax: number, //1-255
): void {
  const data = imageData.data;

  // build a lookup table for speed
  const lut = buildLut(inMin, inMax, gamma, outMin, outMax);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = lut[data[i]];
    data[i + 1] = lut[data[i + 1]];
    data[i + 2] = lut[data[i + 2]];
    // aplha untouched
  }
}
