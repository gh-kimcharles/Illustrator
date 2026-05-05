import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge class names (clsx + tailwind-merge)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date as "MMM D, YYYY"
export function formatDate(date: Date | string | number): string {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
