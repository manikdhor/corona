"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, X, Star, MoveLeft, MoveRight, Image as ImageIcon } from "lucide-react";
import ImageInput from "./ImageInput";

interface GalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  featuredImage?: string;
  onSetFeatured?: (url: string) => void;
}

export default function GalleryManager({
  images,
  onChange,
  featuredImage,
  onSetFeatured,
}: GalleryManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  const handleAddImage = (url: string) => {
    if (url && !images.includes(url)) {
      const updated = [...images, url];
      onChange(updated);
      setNewImageUrl("");
      setNewImageAlt("");
      setShowAddModal(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-700">
            Property Gallery ({images.length} Images)
          </h4>
          <p className="text-xs text-navy-400">
            Drag, reorder, and set the primary featured cover image.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-gold hover:bg-navy-800 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Add Gallery Image
        </button>
      </div>

      {images.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-navy-200 p-8 text-center bg-slate-50/50">
          <ImageIcon className="h-8 w-8 text-navy-300 mx-auto mb-2" />
          <p className="text-xs font-medium text-navy-600">No gallery images added yet.</p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="mt-2 text-xs font-semibold text-gold-700 hover:underline"
          >
            Click here to add your first photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, idx) => {
            const isFeatured = featuredImage === img;
            return (
              <div
                key={idx}
                className={`group relative aspect-video overflow-hidden rounded-xl border-2 transition ${
                  isFeatured ? "border-gold ring-2 ring-gold/40" : "border-navy-100 bg-navy-50"
                }`}
              >
                <Image
                  src={img}
                  alt={`Gallery Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  unoptimized={img.startsWith("data:")}
                />

                {/* Badges and Actions overlay */}
                <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex items-center justify-between">
                    {onSetFeatured && (
                      <button
                        type="button"
                        onClick={() => onSetFeatured(img)}
                        className={`p-1.5 rounded-md text-xs font-semibold transition ${
                          isFeatured ? "bg-gold text-navy" : "bg-white/90 text-navy-700 hover:bg-gold hover:text-navy"
                        }`}
                        title={isFeatured ? "Currently Featured" : "Set as Featured Cover"}
                      >
                        <Star className={`h-3.5 w-3.5 ${isFeatured ? "fill-navy" : ""}`} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 rounded-md bg-red-600/90 text-white hover:bg-red-600 transition ml-auto"
                      title="Delete Image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Reordering arrows */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "left")}
                      className="p-1 rounded bg-white/90 text-navy hover:bg-gold disabled:opacity-30 transition"
                      title="Move backward"
                    >
                      <MoveLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[10px] font-bold text-white bg-navy-900/80 px-2 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMove(idx, "right")}
                      className="p-1 rounded bg-white/90 text-navy hover:bg-gold disabled:opacity-30 transition"
                      title="Move forward"
                    >
                      <MoveRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {isFeatured && (
                  <span className="absolute bottom-2 left-2 rounded bg-gold px-1.5 py-0.5 text-[10px] font-bold text-navy shadow-sm">
                    Featured
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Image Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <h3 className="text-lg font-serif font-bold text-navy">Add Gallery Image</h3>
            <p className="text-xs text-navy-400 mt-1">Upload an image file or paste an external image URL.</p>

            <div className="mt-4">
              <ImageInput
                value={newImageUrl}
                onChange={(url) => setNewImageUrl(url)}
                altValue={newImageAlt}
                onAltChange={(alt) => setNewImageAlt(alt)}
                label="Select Photo"
                requiredAlt={false}
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg text-navy-600 hover:bg-navy-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddImage(newImageUrl)}
                disabled={!newImageUrl}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-navy text-gold hover:bg-navy-800 disabled:opacity-40"
              >
                Add to Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
