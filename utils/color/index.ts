import { RGBColor } from "@/types";

export function rgbToHex({ r, g, b }: RGBColor): string {
  return ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase();
}

export function hexToRgb(hex: string): RGBColor | null {
  const clean = hex.replace("#", "");

  // Validate hex value
  if (clean.length !== 6) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

export function rgbToCss({ r, g, b }: RGBColor): string {
  return `rgb(${r},${g},${b})`;
}
