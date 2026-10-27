import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminToken, SESSION_COOKIE_NAME } from "@/lib/admin/auth-token";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifyAdminToken(sessionToken);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { filename, mimeType } = body;
    if (!filename || typeof filename !== "string") {
      return NextResponse.json({ success: false, error: "Filename is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Ensure bucket exists with 50MB limit
    try {
      await supabase.storage.createBucket("media", { public: true, fileSizeLimit: 52428800 });
    } catch {}

    const originalExt = filename.split(".").pop()?.toLowerCase() || "pdf";
    const cleanName = filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase()
      .slice(0, 40);
    const storagePath = `${cleanName}-${Date.now()}.${originalExt}`;

    const { data, error } = await supabase.storage
      .from("media")
      .createSignedUploadUrl(storagePath);

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: error?.message || "Failed to create signed upload URL" },
        { status: 500 }
      );
    }

    const { data: pubData } = supabase.storage.from("media").getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: pubData.publicUrl,
      filename: storagePath,
    });
  } catch (err: any) {
    console.error("Upload sign error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
