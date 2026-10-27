import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

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
      mimeType = file.type || "application/octet-stream";
      const originalExt = file.name.split(".").pop() || "pdf";
      // Sanitize filename to avoid weird character issues
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .toLowerCase()
        .slice(0, 40);
      fileName = `${cleanName}-${Date.now()}.${originalExt}`;
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

    let finalPublicUrl = "";

    // 1. Try uploading to Supabase Storage bucket "media"
    try {
      const supabase = createAdminClient();
      try {
        await supabase.storage.createBucket("media", { public: true, fileSizeLimit: 26214400 });
      } catch {}

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(uploadData.path || fileName);
        if (publicUrlData?.publicUrl) {
          finalPublicUrl = publicUrlData.publicUrl;
        }
      } else if (uploadError) {
        console.warn("Supabase Storage upload warning, falling back to local:", uploadError.message);
      }
    } catch (sbErr) {
      console.warn("Supabase client error in upload API, falling back to local:", sbErr);
    }

    // 2. If Supabase upload was not possible or returned empty, save to local public/uploads directory
    if (!finalPublicUrl) {
      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path.join(uploadsDir, fileName);
        await fs.promises.writeFile(filePath, fileBuffer);
        finalPublicUrl = `/uploads/${fileName}`;
      } catch (localErr) {
        console.error("Local file save error:", localErr);
        return NextResponse.json(
          { success: false, error: "Could not save file to storage or local disk" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      url: finalPublicUrl,
      filename: fileName,
      sizeBytes: fileBuffer.length,
      mimeType,
    });
  } catch (err: any) {
    console.error("Upload API Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error uploading file" },
      { status: 500 }
    );
  }
}
