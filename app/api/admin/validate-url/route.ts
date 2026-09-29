import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ valid: false, error: "Missing URL" }, { status: 400 });
    }

    // Attempt a HEAD request first
    let response: Response;
    try {
      response = await fetch(url, { method: "HEAD", redirect: "follow" });
    } catch {
      // Fallback to GET with Range if server doesn't support HEAD
      response = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-1024" },
        redirect: "follow",
      });
    }

    if (!response.ok) {
      return NextResponse.json({
        valid: false,
        error: `Server responded with status ${response.status}`,
      });
    }

    const contentType = response.headers.get("content-type") || "";
    const isImage = contentType.startsWith("image/");

    if (!isImage) {
      return NextResponse.json({
        valid: false,
        error: `Content-Type '${contentType}' is not an image`,
      });
    }

    const contentLength = response.headers.get("content-length");
    const sizeBytes = contentLength ? parseInt(contentLength, 10) : undefined;

    return NextResponse.json({
      valid: true,
      contentType,
      sizeBytes,
    });
  } catch (error: any) {
    return NextResponse.json({
      valid: false,
      error: error.message || "Failed to fetch image URL",
    });
  }
}
