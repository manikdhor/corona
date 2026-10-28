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
 * Extracts place details from a Google Maps embed URL protobuf parameters (!1s, !2s, !3d, !2d)
 */
export function extractPlaceDetailsFromEmbed(url?: string | null): {
  placeName?: string;
  lat?: number;
  lng?: number;
  featureId?: string;
} {
  if (!url || typeof url !== "string") return {};

  const featureMatch = url.match(/!1s([^!]+)/);
  const nameMatch = url.match(/!2s([^!]+)/);
  const latMatch = url.match(/!3d([0-9.-]+)/);
  const lngMatch = url.match(/!2d([0-9.-]+)/);

  return {
    featureId: featureMatch ? decodeURIComponent(featureMatch[1]) : undefined,
    placeName: nameMatch ? decodeURIComponent(nameMatch[1]) : undefined,
    lat: latMatch ? parseFloat(latMatch[1]) : undefined,
    lng: lngMatch ? parseFloat(lngMatch[1]) : undefined,
  };
}

/**
 * Returns a clean Google Maps directions link for external opening ("Get Directions").
 * Prioritizes place name so Google Maps explicitly targets the project name (e.g. "Maple Leaf Garden City Purbachal").
 */
export function getGoogleMapsDirectionsUrl(
  query?: string | null,
  coordinates?: { lat: number; lng: number } | null,
  customUrl?: string | null
): string {
  const embedDetails = extractPlaceDetailsFromEmbed(customUrl);
  const placeName =
    query?.trim() || embedDetails.placeName || "Maple Leaf Garden City Purbachal";
  const formattedName = placeName.replace(/\s+/g, "+");

  return `https://www.google.com/maps/dir/?api=1&destination=${formattedName}`;
}

/**
 * Returns a clean Google Maps place view link for external opening in a new tab.
 * Uses the exact Google Maps /place/ path with name, coordinates, and Place Feature ID
 * so Google Maps renders the complete official business profile with photos, rating, and pin.
 * IMPORTANT: Never returns an /embed URL because Google blocks opening embed URLs directly in a browser tab.
 */
export function getGoogleMapsViewUrl(
  query?: string | null,
  coordinates?: { lat: number; lng: number } | null,
  customUrl?: string | null
): string {
  // If customUrl is a direct non-embed map link (like maps.google.com/?q=... or maps.app.goo.gl/...), use it directly
  if (customUrl && typeof customUrl === "string") {
    const trimmed = customUrl.trim();
    if (!trimmed.includes("/maps/embed") && !trimmed.includes("<iframe")) {
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
      }
    }
  }

  const embedDetails = extractPlaceDetailsFromEmbed(customUrl);
  const placeName =
    query?.trim() || embedDetails.placeName || "Maple Leaf Garden City Purbachal";
  const formattedName = placeName.replace(/\s+/g, "+");

  const lat = coordinates?.lat ?? embedDetails.lat ?? 23.8611106;
  const lng = coordinates?.lng ?? embedDetails.lng ?? 90.5482366;
  const featureId = embedDetails.featureId || "0x3755cd0045f1a14b:0x9b4de0cfba863528";

  // Full Google Maps Place URL with Coordinates and Place Feature ID
  return `https://www.google.com/maps/place/${formattedName}/@${lat},${lng},17z/data=!4m2!3m1!1s${featureId}`;
}
