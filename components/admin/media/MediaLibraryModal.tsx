"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, X, Check, Image as ImageIcon, Plus, Info } from "lucide-react";
import { getMediaAction } from "@/lib/admin/actions";
import { MediaItem } from "@/lib/admin/seed";

interface MediaLibraryModalProps {
  onSelect: (url: string, alt: string) => void;
  onClose: () => void;
}

export default function MediaLibraryModal({ onSelect, onClose }: MediaLibraryModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getMediaAction();
      setItems(data);
      if (data.length > 0) setSelectedItem(data[0]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = items.filter(
    (item) =>
      item.filename.toLowerCase().includes(search.toLowerCase()) ||
      item.altText.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4">
      <div className="flex h-[80vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl border border-navy-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-gold">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-navy text-base">Media Asset Library</h3>
              <p className="text-xs text-navy-400">Select an existing optimized asset or inspect usage.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-navy-400 hover:bg-navy-100 hover:text-navy-900 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Search Bar & Grid */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Grid Area */}
          <div className="flex flex-1 flex-col p-6 overflow-y-auto">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy-400" />
              <input
                type="text"
                placeholder="Search assets by name or alt text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-navy-200 pl-9 pr-4 py-2 text-xs focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </div>

            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-xs text-navy-400">Loading assets...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-center p-8">
                <p className="text-xs text-navy-400">No assets found matching &quot;{search}&quot;</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filtered.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
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
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      {isSelected && (
                        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy shadow-sm">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
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

          {/* Details Sidebar */}
          {selectedItem && (
            <div className="w-80 border-l border-navy-100 bg-slate-50/50 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-navy-200 bg-navy-50 shadow-xs">
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.altText}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-navy truncate" title={selectedItem.filename}>
                    {selectedItem.filename}
                  </h4>
                  <p className="text-[11px] text-navy-400 mt-0.5">
                    {selectedItem.mimeType} &bull; {(selectedItem.sizeBytes / 1024).toFixed(0)} KB
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-navy-600 block">Alt Text (Required)</label>
                  <p className="text-xs text-navy-700 bg-white p-2.5 rounded-lg border border-navy-100 italic">
                    &ldquo;{selectedItem.altText}&rdquo;
                  </p>
                </div>

                <div className="rounded-lg bg-gold/10 p-3 text-xs border border-gold/20 text-gold-900">
                  <div className="flex items-center gap-1.5 font-semibold text-gold-800 mb-1">
                    <Info className="h-3.5 w-3.5" /> Usage Tracker
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Referenced in <strong>{selectedItem.usageCount}</strong> active listing(s).
                  </p>
                  {selectedItem.usageReferences.length > 0 && (
                    <ul className="mt-1 space-y-0.5 text-[11px] list-disc list-inside text-gold-800">
                      {selectedItem.usageReferences.map((ref, idx) => (
                        <li key={idx} className="truncate">{ref.title}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-navy-100 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-navy-200 px-4 py-2.5 text-xs font-semibold text-navy-600 hover:bg-navy-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => onSelect(selectedItem.url, selectedItem.altText)}
                  className="flex-1 rounded-xl bg-navy px-4 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
                >
                  Use Asset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
