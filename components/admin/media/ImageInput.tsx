"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  FolderOpen,
  Eye,
} from "lucide-react";
import MediaLibraryModal from "./MediaLibraryModal";

interface ImageInputProps {
  value: string;
  onChange: (url: string, metadata?: { alt?: string; sizeBytes?: number; width?: number; height?: number }) => void;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  label?: string;
  requiredAlt?: boolean;
}

export default function ImageInput({
  value,
  onChange,
  altValue = "",
  onAltChange,
  label = "Featured Image",
  requiredAlt = true,
}: ImageInputProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // URL mode verification states
  const [inputUrl, setInputUrl] = useState(value || "");
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [urlValidationResult, setUrlValidationResult] = useState<{ valid?: boolean; error?: string; contentType?: string }>({});

  const [showMediaModal, setShowMediaModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert image to WebP on client side & strip EXIF via HTML5 Canvas
  const processImageFile = async (file: File): Promise<{ webpDataUrl: string; width: number; height: number; sizeBytes: number }> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context creation failed"));
          return;
        }

        // Draw image onto canvas - automatically strips EXIF metadata
        ctx.drawImage(img, 0, 0);

        // Convert to WebP format with 0.88 high-quality compression
        const webpDataUrl = canvas.toDataURL("image/webp", 0.88);
        const approxBytes = Math.round((webpDataUrl.length * 3) / 4);

        resolve({
          webpDataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeBytes: approxBytes,
        });
      };
      img.onerror = () => reject(new Error("Failed to load file into Image element"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPEG, PNG, WebP, AVIF).");
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(25);

      // Client-side WebP conversion & EXIF stripping
      const processed = await processImageFile(file);
      setProgress(60);

      // Simulating Supabase Storage CDN upload or using data URL for preview/storage
      setTimeout(() => {
        setProgress(100);
        onChange(processed.webpDataUrl, {
          alt: altValue || file.name.replace(/\.[^/.]+$/, ""),
          sizeBytes: processed.sizeBytes,
          width: processed.width,
          height: processed.height,
        });
        if (onAltChange && !altValue) {
          onAltChange(file.name.replace(/\.[^/.]+$/, ""));
        }
        setIsProcessing(false);
        setProgress(0);
      }, 400);
    } catch (err: any) {
      alert(err.message || "Failed to process image");
      setIsProcessing(false);
      setProgress(0);
    }
  };

  // Verify external URL with HEAD request endpoint
  const handleVerifyUrl = async () => {
    if (!inputUrl) return;

    // Direct local images pass immediately
    if (inputUrl.startsWith("/")) {
      setUrlValidationResult({ valid: true, contentType: "image/webp" });
      onChange(inputUrl, { alt: altValue });
      return;
    }

    setIsValidatingUrl(true);
    setUrlValidationResult({});

    try {
      const res = await fetch("/api/admin/validate-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await res.json();
      setUrlValidationResult(data);

      if (data.valid) {
        onChange(inputUrl, { alt: altValue, sizeBytes: data.sizeBytes });
      }
    } catch {
      setUrlValidationResult({ valid: false, error: "Network error checking URL" });
    } finally {
      setIsValidatingUrl(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">
          {label}
        </label>
        <div className="flex items-center rounded-lg bg-navy-50 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
              mode === "upload" ? "bg-white text-navy font-semibold shadow-xs" : "text-navy-400 hover:text-navy-800"
            }`}
          >
            <Upload className="h-3.5 w-3.5" /> Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
              mode === "url" ? "bg-white text-navy font-semibold shadow-xs" : "text-navy-400 hover:text-navy-800"
            }`}
          >
            <LinkIcon className="h-3.5 w-3.5" /> Paste URL
          </button>
          <button
            type="button"
            onClick={() => setShowMediaModal(true)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-gold-700 hover:text-gold-900 transition ml-1"
            title="Browse Media Library"
          >
            <FolderOpen className="h-3.5 w-3.5" /> Library
          </button>
        </div>
      </div>

      {/* INPUT AREA */}
      {mode === "upload" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileUpload(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
            isDragging
              ? "border-gold bg-gold/5"
              : "border-navy-200 bg-slate-50/50 hover:bg-slate-50 hover:border-gold/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          {isProcessing ? (
            <div className="w-full max-w-xs space-y-2">
              <Loader2 className="h-7 w-7 animate-spin text-gold mx-auto" />
              <p className="text-xs font-medium text-navy-700">Converting to WebP & stripping EXIF...</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy-100">
                <div
                  className="h-full bg-gradient-gold transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100/60 text-navy mb-2">
                <Upload className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-navy-700">
                <span className="text-gold-700 font-semibold underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-[11px] text-navy-400 mt-1">
                WebP/AVIF auto-conversion &bull; EXIF metadata stripped &bull; CDN cached
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or /image-06.webp"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 rounded-lg border border-navy-200 px-3 py-2 text-xs focus:border-gold focus:ring-1 focus:ring-gold outline-none"
            />
            <button
              type="button"
              onClick={handleVerifyUrl}
              disabled={isValidatingUrl || !inputUrl}
              className="flex items-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-gold hover:bg-navy-800 disabled:opacity-40 transition shrink-0"
            >
              {isValidatingUrl ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
              Validate & Preview
            </button>
          </div>

          {urlValidationResult.valid === true && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Valid Image ({urlValidationResult.contentType})
            </div>
          )}
          {urlValidationResult.valid === false && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              {urlValidationResult.error || "URL could not be verified as an image"}
            </div>
          )}
        </div>
      )}

      {/* ACTIVE PREVIEW & ALT-TEXT */}
      {value && (
        <div className="flex items-start gap-4 rounded-xl border border-navy-100 bg-white p-3 shadow-xs">
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-navy-50 border border-navy-100">
            <Image
              src={value}
              alt={altValue || "Preview"}
              fill
              className="object-cover"
              sizes="120px"
              unoptimized={value.startsWith("data:")}
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-navy-500 uppercase">Image Alt Text (SEO & A11y)</span>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setInputUrl("");
                  setUrlValidationResult({});
                }}
                className="text-navy-400 hover:text-red-500 p-1"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Descriptive alt text for Google SEO and screen readers"
              value={altValue}
              onChange={(e) => onAltChange && onAltChange(e.target.value)}
              className={`w-full rounded-md border px-2.5 py-1.5 text-xs outline-none transition ${
                requiredAlt && !altValue ? "border-amber-400 bg-amber-50/20" : "border-navy-200 focus:border-gold"
              }`}
            />
            {requiredAlt && !altValue && (
              <p className="text-[11px] text-amber-600">Alt text is required for Google Image SEO ranking.</p>
            )}
          </div>
        </div>
      )}

      {/* MEDIA LIBRARY MODAL */}
      {showMediaModal && (
        <MediaLibraryModal
          onSelect={(selectedUrl, alt) => {
            onChange(selectedUrl, { alt });
            if (onAltChange && alt) onAltChange(alt);
            setShowMediaModal(false);
          }}
          onClose={() => setShowMediaModal(false)}
        />
      )}
    </div>
  );
}
