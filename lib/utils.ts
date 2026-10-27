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
  if (!url) return "/corona-logo.png";
  return url.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)$/, "$3");
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function getYoutubeVideoId(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  // Check if string itself is an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

/**
 * Checks if a string or URL is a YouTube video
 */
export function isYoutubeUrl(url?: string | null): boolean {
  return !!getYoutubeVideoId(url);
}

/**
 * Gets the standard embed URL for YouTube
 */
export function getYoutubeEmbedUrl(url?: string | null): string {
  const id = getYoutubeVideoId(url);
  if (!id) return "";
  return `https://www.youtube.com/embed/${id}`;
}

/**
 * Gets high-quality thumbnail URL for a YouTube video
 */
export function getYoutubeThumbnail(url?: string | null, quality: "hqdefault" | "maxresdefault" = "hqdefault"): string {
  const id = getYoutubeVideoId(url);
  if (!id) return "/image-01.webp";
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

