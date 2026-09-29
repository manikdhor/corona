/**
 * Corona Properties Admin Authentication Token Utility
 * Standard Web Crypto API (HMAC-SHA256) compatible with Next.js Edge Middleware and Node.js
 */

export interface AdminSession {
  email: string;
  role: string;
  name: string;
  expiresAt: number; // Unix timestamp in ms
}

export const SESSION_COOKIE_NAME = "corona_admin_session";

// Default admin credentials (can be overridden via environment variables)
export const DEFAULT_ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "admin@coronapropertiesltd.com";
export const DEFAULT_ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "Corona@2026Admin!";

const SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 32) ||
  "corona_properties_super_secure_admin_jwt_secret_2026";

async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function base64UrlEncode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str).toString("base64url");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64url").toString("utf-8");
  }
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return atob(b64);
}

/**
 * Creates a cryptographically signed session token string
 */
export async function createAdminToken(session: AdminSession): Promise<string> {
  const key = await getCryptoKey();
  const encoder = new TextEncoder();
  const payloadStr = JSON.stringify(session);
  const encodedPayload = base64UrlEncode(payloadStr);

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(encodedPayload)
  );
  const signatureHex = bufferToHex(signatureBuffer);

  return `${encodedPayload}.${signatureHex}`;
}

/**
 * Verifies a token's HMAC signature and checks expiration
 */
export async function verifyAdminToken(
  token: string | undefined | null
): Promise<AdminSession | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, signatureHex] = parts;
  if (!encodedPayload || !signatureHex) return null;

  try {
    const key = await getCryptoKey();
    const encoder = new TextEncoder();
    const signatureBytes = hexToUint8Array(signatureHex);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      encoder.encode(encodedPayload)
    );

    if (!isValid) return null;

    const payloadJson = base64UrlDecode(encodedPayload);
    const session: AdminSession = JSON.parse(payloadJson);

    // Expiry check
    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
