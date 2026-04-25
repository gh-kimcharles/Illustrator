/* Kernel builder */
function buildGaussianKernel(radius: number): number[] {
  const size = radius * 2 + 1;
  const sigma = radius / 3;
  const kernel: number[] = [];
  let sum = 0;

  for (let i = 0; i < size; i++) {
    const x = i - radius;
    const val = Math.exp(-(x * x) / (2 * sigma * sigma));
    kernel.push(val);
    sum += val;
  }

  // normalise for weights to sum to 1
  return kernel.map((v) => v / sum);
}

function clampCoord(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/* Guassian Blur */
// performs a separable gaussian blur - one horizontal pass then one vertical
// pass. This is 0(w * h * radius) instead of 0(w * h * radius^2) for a naive
// 2D kernel, making it fast for interactive use
// radius: 1-20 pixels

export function applyGaussianBlur(imageData: ImageData, radius: number): void {
  if (radius < 1) return;

  const { width, height, data } = imageData;

  // build 1D gaussian kernel
  const kernel = buildGaussianKernel(radius);
  const kLen = kernel.length;
  const half = Math.floor(kLen / 2);

  // temporary buffer for the horizontal pass output
  const tmp = new Uint8ClampedArray(data.length);

  // horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        wSum = 0;

      for (let k = 0; k < kLen; k++) {
        const px = clampCoord(x + k - half, 0, width - 1);
        const idx = (y * width + px) * 4;
        const w = kernel[k];
        r += data[idx] * w;
        g += data[idx + 1] * w;
        b += data[idx + 2] * w;
        a += data[idx + 3] * w;
        wSum += w;
      }

      const out = (y * width + x) * 4;
      tmp[out] = r / wSum;
      tmp[out + 1] = g / wSum;
      tmp[out + 2] = b / wSum;
      tmp[out + 3] = a / wSum;
    }
  }

  // vertical pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        wSum = 0;

      for (let k = 0; k < kLen; k++) {
        const py = clampCoord(y + k - half, 0, height - 1);
        const idx = (py * width + x) * 4;
        const w = kernel[k];
        r += tmp[idx] * w;
        g += tmp[idx + 1] * w;
        b += tmp[idx + 2] * w;
        a += tmp[idx + 3] * w;
        wSum += w;
      }

      const out = (y * width + x) * 4;
      data[out] = r / wSum;
      data[out + 1] = g / wSum;
      data[out + 2] = b / wSum;
      data[out + 3] = a / wSum;
    }
  }
}
