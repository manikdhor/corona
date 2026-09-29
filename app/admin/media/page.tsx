"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Upload,
  Trash2,
  Edit2,
  Info,
  Check,
  X,
  ExternalLink,
  Copy,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import { adminStore, MediaItem } from "@/lib/admin/seed";
import ImageInput from "@/components/admin/media/ImageInput";
import { deleteMediaAction, updateMediaAltAction } from "@/lib/admin/actions";

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(adminStore.getMedia());
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(mediaItems[0] || null);
  const [editingAlt, setEditingAlt] = useState(false);
  const [altInput, setAltInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newUploadedUrl, setNewUploadedUrl] = useState("");
  const [newUploadedAlt, setNewUploadedAlt] = useState("");

  const filtered = mediaItems.filter(
    (m) =>
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.altText.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveAlt = async () => {
    if (!selectedItem) return;
    await updateMediaAltAction(selectedItem.id, altInput);
    selectedItem.altText = altInput;
    setEditingAlt(false);
    setMediaItems([...adminStore.getMedia()]);
  };

  const handleDelete = async (item: MediaItem) => {
    if (item.usageCount > 0) {
      if (
        !confirm(
          `WARNING: This asset is currently in use across ${item.usageCount} listing(s)!\nDeleting it will create broken images on the website.\nAre you absolutely sure?`
        )
      ) {
        return;
      }
    } else if (!confirm(`Delete '${item.filename}'?`)) {
      return;
    }

    await deleteMediaAction(item.id);
    const updated = adminStore.getMedia();
    setMediaItems(updated);
    setSelectedItem(updated[0] || null);
  };

  const handleNewUpload = (url: string) => {
    if (!url) return;
    const added = adminStore.addMediaItem({
      filename: `asset-${Date.now()}.webp`,
      filePath: `uploads/asset-${Date.now()}.webp`,
      url,
      thumbnailUrl: url,
      mimeType: "image/webp",
      sizeBytes: 320000,
      altText: newUploadedAlt || "Corona Properties Luxury Asset",
      usageCount: 0,
      usageReferences: [],
    });
    setMediaItems([...adminStore.getMedia()]);
    setSelectedItem(added);
    setShowUploadModal(false);
    setNewUploadedUrl("");
    setNewUploadedAlt("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Digital Asset Management
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            Central Media Library
          </h1>
          <p className="text-xs text-navy-400">
            Search, optimize, inspect usage, and manage alt-text metadata across all property imagery.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
        >
          <Upload className="h-4 w-4" /> Upload New Asset
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-3 shadow-xs border border-navy-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search assets by filename or SEO alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-navy-200 pl-9 pr-4 py-2 text-xs focus:border-gold outline-none"
          />
        </div>
        <span className="text-xs text-navy-400 font-medium">
          {filtered.length} assets registered
        </span>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Media Grid */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-xs border border-navy-100">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-navy-400">
              <FolderOpen className="h-10 w-10 text-navy-200 mx-auto mb-2" />
              <p className="text-sm font-medium">No assets matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setAltInput(item.altText);
                      setEditingAlt(false);
                    }}
                    className={`group relative aspect-video cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                      isSelected
                        ? "border-gold shadow-md ring-2 ring-gold/40"
                        : "border-navy-100 hover:border-navy-300"
                    }`}
                  >
                    <Image
                      src={item.url}
                      alt={item.altText}
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />

                    {/* Usage Tag */}
                    {item.usageCount > 0 ? (
                      <span className="absolute top-2 left-2 rounded-md bg-navy-900/80 px-2 py-0.5 text-[10px] font-bold text-gold-300 backdrop-blur-xs">
                        {item.usageCount} in use
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 rounded-md bg-slate-900/60 px-2 py-0.5 text-[10px] font-medium text-slate-300 backdrop-blur-xs">
                        Unused
                      </span>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent p-2">
                      <p className="truncate text-[11px] font-medium text-white">{item.filename}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Asset Inspection Drawer */}
        {selectedItem && (
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-5 h-fit">
            <h3 className="font-serif font-bold text-sm text-navy">Asset Details</h3>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-navy-100 bg-navy-50 shadow-xs">
              <Image
                src={selectedItem.url}
                alt={selectedItem.altText}
                fill
                className="object-cover"
                sizes="350px"
              />
            </div>

            <div>
              <h4 className="font-bold text-xs text-navy truncate" title={selectedItem.filename}>
                {selectedItem.filename}
              </h4>
              <p className="text-[11px] text-navy-400 mt-0.5 font-mono">
                {selectedItem.mimeType} &bull; {(selectedItem.sizeBytes / 1024).toFixed(0)} KB &bull; {selectedItem.width || 1920}x{selectedItem.height || 1080}
              </p>
            </div>

            {/* Direct URL Copy */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-navy-600 block">Asset URL</span>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  readOnly
                  value={selectedItem.url}
                  className="w-full rounded-lg border border-navy-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-mono text-navy-700 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopyUrl(selectedItem.url, selectedItem.id)}
                  className="rounded-lg border border-navy-200 p-2 text-navy-600 hover:bg-slate-50"
                  title="Copy URL"
                >
                  {copiedId === selectedItem.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Alt-Text Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-navy-700">
                  SEO Alt Text (Required)
                </span>
                {!editingAlt && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAlt(true);
                      setAltInput(selectedItem.altText);
                    }}
                    className="flex items-center gap-1 text-[11px] text-gold-700 font-semibold hover:underline"
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                )}
              </div>

              {editingAlt ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={altInput}
                    onChange={(e) => setAltInput(e.target.value)}
                    className="w-full rounded-lg border border-navy-300 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingAlt(false)}
                      className="px-2.5 py-1 text-xs text-navy-500 hover:bg-navy-50 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAlt}
                      className="px-3 py-1 text-xs bg-navy text-gold rounded font-semibold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="rounded-xl border border-navy-100 bg-slate-50/70 p-2.5 text-xs text-navy-800 italic">
                  &ldquo;{selectedItem.altText}&rdquo;
                </p>
              )}
            </div>

            {/* Usage Tracking Card */}
            <div className="rounded-xl bg-gold/10 p-3.5 text-xs border border-gold/20 text-gold-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-gold-800">
                <Info className="h-3.5 w-3.5" /> Usage Tracker
              </div>
              <p className="text-[11px]">
                Referenced in <strong>{selectedItem.usageCount}</strong> active listing(s).
              </p>
              {selectedItem.usageReferences.length > 0 && (
                <ul className="mt-1 space-y-1 text-[11px] list-disc list-inside">
                  {selectedItem.usageReferences.map((ref, idx) => (
                    <li key={idx} className="truncate">
                      <strong>{ref.type}:</strong> {ref.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Actions: Delete */}
            <div className="pt-2 border-t border-navy-100">
              <button
                type="button"
                onClick={() => handleDelete(selectedItem)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Asset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <h3 className="text-base font-serif font-bold text-navy">Upload Asset to Media Library</h3>
            <p className="text-xs text-navy-400 mt-1">
              Uploaded files are converted to WebP and stripped of all EXIF metadata before caching.
            </p>

            <div className="mt-4">
              <ImageInput
                value={newUploadedUrl}
                onChange={(url) => setNewUploadedUrl(url)}
                altValue={newUploadedAlt}
                onAltChange={(alt) => setNewUploadedAlt(alt)}
                label="Choose Image"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-navy-600 hover:bg-navy-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleNewUpload(newUploadedUrl)}
                disabled={!newUploadedUrl}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-navy text-gold hover:bg-navy-800 disabled:opacity-40"
              >
                Save to Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
