/* Posterize */
// creates a flat, graphic poster-like effect bt quantising pixel values

// levels: 2-16
//  - 2 = most dramatic
//  - 16 - subtle
function clamp(levels: number): number {
  return Math.max(2, Math.min(16, Math.round(levels)));
}

// reduces each colour channel to N discrete levels
export function applyPosterize(imageData: ImageData, levels: number): void {
  const n = clamp(levels);

  const data = imageData.data;

  // build a lookup table for performance
  // avoid recalculating for every pixel

  // formula per channel:
  //  step = 255 / (levels - 1)
  //  output = round(pixel / step) * step
  const lut = new Uint8ClampedArray(256);
  const levelsMinus1 = n - 1;

  for (let i = 0; i < 256; i++) {
    // quantise: find nearest level then snap

    // update: remove round duplicate, switch to normalize quantization
    const normalized = i / 255;
    const quantized = Math.round(normalized * levelsMinus1) / levelsMinus1;
    lut[i] = Math.round(quantized * 255);
  }

  for (let i = 0; i < data.length; i += 4) {
    data[i] = lut[data[i]]; // R
    data[i + 1] = lut[data[i + 1]]; // G
    data[i + 2] = lut[data[i + 2]]; // B
    // alpha untouched
  }
}
