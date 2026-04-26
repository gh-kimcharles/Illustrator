/* Grayscale */

// this weights green more heavily because human eye is sentitive to green light.
// produces more natural grayscale than a simple (R+G+B)/3 ave
export function applyGrayscale(imageData: ImageData) {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // converts each pixel to grayscale using UTI-R BT.70 luminance formula:
    // L = 0.2126 * R + 0.7152 * G + 0.0722 & B
    const luminance = Math.round(
      0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2],
    );

    data[i] = luminance;
    data[i + 1] = luminance;
    data[i + 2] = luminance;
    // alpha untouched
  }
}
