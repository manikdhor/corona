/**
 * Google Maps Utility Functions
 * Safely parses, sanitizes, and normalizes Google Maps URLs and embed codes.
 */

/**
 * Extracts a clean embed URL from an input string which might be:
 * - A full `<iframe src="..."></iframe>` snippet
 * - A direct embed URL (e.g. `https://www.google.com/maps/embed?...`)
 * - An empty or undefined string, which falls back to coordinates or query
 */
export function extractMapEmbedUrl(
  input?: string | null,
  coordinates?: { lat: number; lng: number } | null,
  query?: string | null
): string {
  if (input && typeof input === "string") {
    const trimmed = input.trim();

    // If input is an iframe HTML tag, extract the src attribute
    if (trimmed.includes("<iframe")) {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // If input is already an embed URL, return it
    if (trimmed.includes("google.com/maps/embed") || trimmed.includes("maps.google.com/maps/embed")) {
      return trimmed;
    }

    // If it's a URL that starts with http/https
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      // If it contains output=embed, convert to direct origin=mfe embed to avoid SAMEORIGIN 301 block
      if (trimmed.includes("output=embed")) {
        try {
          const url = new URL(trimmed);
          const q = url.searchParams.get("q");
          if (q) {
            return `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${encodeURIComponent(q)}!6i14`;
          }
        } catch {
          // continue to fallback
        }
      }
      return trimmed;
    }
  }

  // Fallback using coordinates if available
  if (coordinates && typeof coordinates.lat === "number" && typeof coordinates.lng === "number") {
    if (!isNaN(coordinates.lat) && !isNaN(coordinates.lng) && (coordinates.lat !== 0 || coordinates.lng !== 0)) {
      return `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${coordinates.lat},${coordinates.lng}!6i14`;
    }
  }

  // Fallback using search query
  if (query && query.trim()) {
    return `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${encodeURIComponent(query.trim())}!6i14`;
  }

  // Final fallback to Dhaka, Bangladesh default
  return "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s23.86489,90.5647!6i14";
}

/**
 * Returns a clean Google Maps directions link for external opening ("Get Directions").
 * Prioritizes place name so Google Maps explicitly targets the project name (e.g. "Maple Leaf Garden City Purbachal").
 */
export function getGoogleMapsDirectionsUrl(
  query?: string | null,
  coordinates?: { lat: number; lng: number } | null
): string {
  if (query && query.trim()) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query.trim())}`;
  }
  if (coordinates && coordinates.lat && coordinates.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
  }
  return "https://www.google.com/maps/dir/?api=1&destination=Maple+Leaf+Garden+City+Purbachal";
}

/**
 * Returns a clean Google Maps place/search view link for external opening in a new tab.
 * Uses /maps/place/ query to display the official Google Maps business profile (Image 3).
 * IMPORTANT: Never returns an /embed URL because Google blocks opening embed URLs directly in a browser tab.
 */
export function getGoogleMapsViewUrl(
  query?: string | null,
  coordinates?: { lat: number; lng: number } | null,
  customUrl?: string | null
): string {
  // If query / place name is provided, use Google Maps Place URL directly (e.g. /maps/place/Maple+Leaf+Garden+City+Purbachal)
  if (query && query.trim()) {
    return `https://www.google.com/maps/place/${encodeURIComponent(query.trim())}`;
  }

  // If customUrl is a direct non-embed map link (like maps.google.com/?q=... or maps.app.goo.gl/...), use it
  if (customUrl && typeof customUrl === "string") {
    const trimmed = customUrl.trim();
    if (!trimmed.includes("/maps/embed") && !trimmed.includes("<iframe")) {
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
      }
    }
  }

  // Use coordinates if provided
  if (coordinates && coordinates.lat && coordinates.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
  }

  return "https://www.google.com/maps/place/Maple+Leaf+Garden+City+Purbachal";
}
