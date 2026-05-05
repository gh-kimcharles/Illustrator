/* Curves */

export type CurveChannel = "rgb" | "r" | "g" | "b";

export interface CurvePoint {
  x: number; // input 0-255
  y: number; // output 0-255
}

// accepts multiple rgb points
export interface CurveData {
  rgb: CurvePoint[];
  r: CurvePoint[];
  g: CurvePoint[];
  b: CurvePoint[];
}

// min-max value range (0-255)
function clamp(v: number): number {
  return Math.min(255, Math.max(0, v));
}

/* Default identity curves */
// straight diagonal, no change
export function defaultCurves(): CurveData {
  const identity = (): CurvePoint[] => [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ];
  return {
    rgb: identity(),
    r: identity(),
    g: identity(),
    b: identity(),
  };
}

/* Cubic Spline Interpolation */
// a set of control points, builds a lookup table mapping every input value 0-255
// to a smooth output value.

// natural cubic spline algorithm:
//   1. Compute second derivatives at each knot (the "spline coefficients")
//   2. For each input x, find which segment it falls in
//   3. Interpolate using the cubic formula for that segment
function buildSplineLut(points: CurvePoint[]): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256);

  // sort points by x to ensure ascending order
  const pts = [...points].sort((a, b) => a.x - b.x);

  // need at least 2 points
  if (pts.length < 2) {
    for (let i = 0; i < 256; i++) lut[i] = i;
    return lut;
  }

  const n = pts.length;
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);

  // step 1: compute second derivatives
  const y2 = new Float64Array(n); // second derivatives
  const u = new Float64Array(n - 1); // termporary wokr array

  // natural spline boundary condition: second derivative = 0 at endpoints
  y2[0] = 0;
  u[0] = 0;

  for (let i = 1; i < n - 1; i++) {
    const sig = (xs[i] - xs[i - 1]) / (xs[i + 1] - xs[i - 1]);
    const p = sig * y2[i - 1] + 2;
    y2[i] = (sig - 1) / p;
    u[i] =
      (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]) -
      (ys[i] - ys[i - 1]) / (xs[i] - xs[i - 1]);
    u[i] = ((6 * u[i]) / (xs[i + 1] - xs[i - 1]) - sig * u[i - 1]) / p;
  }

  // back substitution
  y2[n - 1] = 0;
  for (let k = n - 2; k >= 0; k--) {
    y2[k] = y2[k] * y2[k + 1] + u[k];
  }

  // step 2: for every input value 0-255, evaluate the spline
  for (let x = 0; x < 256; x++) {
    // clamp x to the range of the contorl points
    if (x <= xs[0]) {
      lut[x] = Math.round(clamp(ys[0]));
      continue;
    }
    if (x >= xs[n - 1]) {
      lut[x] = Math.round(clamp(ys[n - 1]));
      continue;
    }

    // binary search for the right segment
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (xs[mid] > x) hi = mid;
      else lo = mid;
    }

    // cubic spline evaluation for segment [lo, hi]
    const h = xs[hi] - xs[lo];
    const a = (xs[hi] - x) / h;
    const b = (x - xs[lo]) / h;
    const y =
      a * ys[lo] +
      b * ys[hi] +
      (((a * a * a - a) * y2[lo] + (b * b * b - b) * y2[hi]) * (h * h)) / 6;

    lut[x] = Math.round(clamp(y));
  }

  return lut;
}

/* Apply Curves */
export function applyCurves(imageData: ImageData, curves: CurveData): void {
  const data = imageData.data;

  // built LUTs for each active channel
  const rgbLut = buildSplineLut(curves.rgb);
  const rLut = buildSplineLut(curves.r);
  const gLut = buildSplineLut(curves.g);
  const bLut = buildSplineLut(curves.b);

  for (let i = 0; i < data.length; i += 4) {
    // apply RGB curves first, then individual
    data[i] = rLut[rgbLut[data[i]]];
    data[i + 1] = gLut[rgbLut[data[i + 1]]];
    data[i + 2] = bLut[rgbLut[data[i + 2]]];
    // alpha untouched
  }
}

/* Helper */
// used to skip building a LUT for unchanged channels
export function isIdentityCurve(points: CurvePoint[]): boolean {
  if (points.length !== 2) return false;
  return (
    points[0].x === 0 &&
    points[0].y === 0 &&
    points[1].x === 255 &&
    points[1].y === 255
  );
}
