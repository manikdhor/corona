"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  ExternalLink,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Link as LinkIcon,
} from "lucide-react";

interface FileUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
  accept?: string;
}

export default function FileUploadInput({
  label,
  value,
  onChange,
  placeholder = "/document.pdf or https://...",
  helperText = "Upload PDF, DOCX, CAD or image file (max 25MB)",
  accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp",
}: FileUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDirectUrl, setShowDirectUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Max 25MB
    if (file.size > 25 * 1024 * 1024) {
      setUploadError("File is too large. Maximum size is 25MB.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || "Failed to upload file");
      }

      onChange(data.url);
    } catch (err: any) {
      console.error("File upload error:", err);
      setUploadError(err.message || "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const isPdf = value?.toLowerCase().endsWith(".pdf");
  const fileName = value ? value.split("/").pop() : "";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-navy-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowDirectUrl(!showDirectUrl)}
          className="text-[11px] font-medium text-navy-400 hover:text-gold-700 flex items-center gap-1 transition"
        >
          <LinkIcon className="h-3 w-3" />
          {showDirectUrl ? "Hide Direct URL" : "Edit Direct URL"}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileChange(e.target.files)}
        className="hidden"
      />

      {value ? (
        /* CURRENT FILE CARD */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-navy-200 bg-navy-50/40 p-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy text-gold">
              {isPdf ? <FileText className="h-5 w-5" /> : <FileSpreadsheet className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-navy truncate" title={fileName}>
                {fileName || "Uploaded File"}
              </p>
              <p className="text-[10px] text-navy-400 truncate max-w-xs" title={value}>
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-gold-700" /> View
            </a>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-2xs disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5 text-navy-600" /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center justify-center h-7 w-7 rounded-lg text-red-500 hover:bg-red-50 transition"
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* DRAG & DROP UPLOAD ZONE */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileChange(e.dataTransfer.files);
          }}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition ${
            isDragging
              ? "border-gold bg-gold-50/20"
              : "border-navy-200 bg-slate-50/50 hover:border-gold hover:bg-gold-50/10"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-1">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
              <p className="text-xs font-medium text-navy-600">Uploading document to storage...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100/60 text-navy">
                <Upload className="h-4 w-4" />
              </div>
              <p className="text-xs text-navy-700">
                <span className="font-semibold text-gold-700 underline">Click to upload file</span> or drag & drop
              </p>
              <p className="text-[11px] text-navy-400">{helperText}</p>
            </div>
          )}
        </div>
      )}

      {/* DIRECT URL INPUT (Toggleable / Always accessible) */}
      {(showDirectUrl || (!value && !isUploading)) && (
        <div className="pt-1">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-navy-200 px-3.5 py-1.5 text-xs text-navy-800 placeholder:text-navy-300 focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none"
          />
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-red-600 pt-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
