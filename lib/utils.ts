import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely (handles conflicts)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes image URLs so localhost/127.0.0.1 full URLs are converted to root-relative paths.
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url) return "/image-01.webp";
  return url.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)$/, "$3");
}

