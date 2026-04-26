/* Brightness / Contrast Filter */

// applies brightness and contract adjustments to ImageData
// brightness: -100 to +100 (0 = no change)
// contrast: -100 to +100 (0 = no change)
export function applyBrightnessContrast(
  imageData: ImageData,
  brightness: number,
  contrast: number,
): void {
  const data = imageData.data;

  // convert contrast to multiplier
  // contrast formula: https://www.dfstudios.co.uk/articles/programming/image-programming-algorithms/image-processing-algorithms-part-5-contrast-adjustment/
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  // brigtness offset in raw 0-255
  const brightnessOffset = (brightness / 100) * 255; // pixel = oldPixel + brightnessOffset

  for (let i = 0; i < data.length; i += 4) {
    // apply brightness then contrast to each channel
    // formula: pixel = (factor * (oldPixel + brightnessOffset - 128) + 128);
    data[i] = clamp(factor * (data[i] + brightnessOffset - 128) + 128);
    data[i + 1] = clamp(factor * (data[i + 1] + brightnessOffset - 128) + 128);
    data[i + 2] = clamp(factor * (data[i + 2] + brightnessOffset - 128) + 128);
    // alpha untouched
  }
}

// ensure pixel channel remain in the RGB range
function clamp(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value))); // 0 >= value <= 255
}
