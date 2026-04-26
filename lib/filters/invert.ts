/* Invert */
// inverts each colour channel

export function applyInvert(imageData: ImageData): void {
  const data = imageData.data;

  // invert = 255 - oldValue
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
    // Alpha (i+3) untoched
  }
}
