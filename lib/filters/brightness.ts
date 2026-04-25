function clamp(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

/* Brightness / Contrast */
// appliess brightness and contract adjustments to ImageData
// brightness: -100 to +100 (0 = no change)
// contrast: -100 to +100 (0 = no change)
export function applyBrightnessContrast(
  imageData: ImageData,
  brightness: number,
  contrast: number,
): void {
  const data = imageData.data;

  // convert contrast to multiplier
  const factor =
    contrast >= 0
      ? (259 * (contrast + 255)) / (255 * (259 - contrast))
      : (259 * (contrast + 255)) / (255 * (259 - contrast));

  // brigtness offset in raw 0-255
  const brightnessOffset = (brightness / 100) * 255;

  for (let i = 0; i < data.length; i += 4) {
    // apply brightness then contrast to each channel
    data[i] = clamp(factor * (data[i] + brightnessOffset - 128) + 128);
    data[i + 1] = clamp(factor * (data[i + 1] + brightnessOffset - 128) + 128);
    data[i + 2] = clamp(factor * (data[i + 2] + brightnessOffset - 128) + 128);
  }
}
