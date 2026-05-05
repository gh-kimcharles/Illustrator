import { applyGaussianBlur } from "./blur";

/* Sharpen */

// ensure pixel channel remain in the RGB range
function clamp(v: number): number {
  return Math.min(255, Math.max(0, Math.round(v))); // 0 >= value <= 255
}

/* Sharpen (unsharp mask) */
// classic unsharp mask algorithm:
//    create a blurred copy of the image
//    subtract it from the original to get the "detail" layer
//    add the detail layer back sscaled by 'amount'
// amount: 0-200 (100 = standard sharpen)
// radius: 1-10 (blur radius for the mask)
export function applySharpen(
  imageData: ImageData,
  amount: number,
  radius: number,
): void {
  const { width, height, data } = imageData;

  // blur image to remove high frequency detail
  const blurred = new ImageData(new Uint8ClampedArray(data), width, height);
  applyGaussianBlur(blurred, radius);

  const strength = amount / 100;

  // unsharp mask algorithm: Isharp ​= Ioriginal ​+ (Ioriginal ​− Iblurred​) * α
  // unsharp mask (easy implmentation): output = original + (original - blurred) * (amount / 100)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] + (data[i] - blurred.data[i]) * strength);
    data[i + 1] = clamp(
      data[i + 1] + (data[i + 1] - blurred.data[i + 1]) * strength,
    );
    data[i + 2] = clamp(
      data[i + 2] + (data[i + 2] - blurred.data[i + 2]) * strength,
    );
    // alpha untouched
  }
}
