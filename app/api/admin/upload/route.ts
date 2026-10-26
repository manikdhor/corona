import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let fileBuffer: Buffer | null = null;
    let fileName = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
    let mimeType = "image/webp";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);
      mimeType = file.type || "image/webp";
      const originalExt = file.name.split(".").pop() || "webp";
      fileName = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${originalExt}`;
    } else {
      const body = await req.json();
      if (!body.dataUrl) {
        return NextResponse.json({ success: false, error: "No dataUrl provided" }, { status: 400 });
      }

      // Parse base64 data URL: "data:image/webp;base64,..."
      const matches = body.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        fileBuffer = Buffer.from(matches[2], "base64");
        const ext = mimeType.split("/")[1] || "webp";
        fileName = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      } else {
        return NextResponse.json({ success: false, error: "Invalid data URL format" }, { status: 400 });
      }
    }

    if (!fileBuffer) {
      return NextResponse.json({ success: false, error: "Failed to read file buffer" }, { status: 400 });
    }

    // Upload to Supabase Storage bucket "media"
    const supabase = createAdminClient();

    // Ensure bucket exists
    try {
      await supabase.storage.createBucket("media", { public: true, fileSizeLimit: 10485760 });
    } catch {}

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media")
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError || !uploadData) {
      console.error("Supabase Storage upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: uploadError?.message || "Storage upload failed" },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(uploadData.path || fileName);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      filename: fileName,
      sizeBytes: fileBuffer.length,
      mimeType,
    });
  } catch (err: any) {
    console.error("Upload API Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error uploading image" },
      { status: 500 }
    );
  }
}
