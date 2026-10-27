"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Tags,
  Plus,
  Loader2,
  CheckCircle2,
  Play,
  Video,
  Youtube,
  Image as ImageIcon,
} from "lucide-react";
import { adminStore, MediaItem, AdminCategory } from "@/lib/admin/seed";
import ImageInput from "@/components/admin/media/ImageInput";
import {
  getYoutubeVideoId,
  getYoutubeThumbnail,
  isYoutubeUrl,
  getYoutubeEmbedUrl,
} from "@/lib/utils";
import {
  getMediaAction,
  addMediaItemAction,
  deleteMediaAction,
  updateMediaItemAction,
  getCategoriesAction,
  saveCategoryAction,
  deleteCategoryAction,
} from "@/lib/admin/actions";

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [galleryCats, setGalleryCats] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [editingMeta, setEditingMeta] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Residential");
  const [altInput, setAltInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTab, setUploadTab] = useState<"image" | "youtube">("image");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [newUploadedUrl, setNewUploadedUrl] = useState("");
  const [newUploadedTitle, setNewUploadedTitle] = useState("");
  const [newUploadedCategory, setNewUploadedCategory] = useState("Residential");
  const [newUploadedAlt, setNewUploadedAlt] = useState("");
  const [isSavingMedia, setIsSavingMedia] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Inline Gallery Category Manager Modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [items, cats] = await Promise.all([
        getMediaAction(),
        getCategoriesAction("gallery"),
      ]);
      setMediaItems(items || []);
      if (items && items.length > 0) {
        setSelectedItem((prev) => items.find((m) => m.id === prev?.id) || items[0]);
      } else {
        setSelectedItem(null);
      }
      if (cats) {
        setGalleryCats(cats.filter((c) => c.isActive));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categoryOptions =
    galleryCats.length > 0
      ? galleryCats.map((c) => c.name)
      : ["Residential", "Aerial Views", "Layouts", "Infrastructure"];

  const filtered = mediaItems.filter((m) => {
    const matchesSearch =
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      (m.title || "").toLowerCase().includes(search.toLowerCase()) ||
      m.altText.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "All" || (m.category || "Residential") === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveMeta = async () => {
    if (!selectedItem) return;
    await updateMediaItemAction(selectedItem.id, {
      title: titleInput,
      category: categoryInput,
      altText: altInput,
    });
    const updatedItem = {
      ...selectedItem,
      title: titleInput,
      category: categoryInput,
      altText: altInput,
    };
    setSelectedItem(updatedItem);
    setEditingMeta(false);
    await loadData();
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
    await loadData();
  };

  const handleNewUpload = async (url: string) => {
    if (!url) {
      setSaveError("Please choose or paste an image first.");
      return;
    }

    try {
      setIsSavingMedia(true);
      setSaveError(null);

      const res = await addMediaItemAction({
        filename: `asset-${Date.now()}.webp`,
        filePath: `uploads/asset-${Date.now()}.webp`,
        url,
        thumbnailUrl: url,
        mimeType: "image/webp",
        sizeBytes: 320000,
        title: newUploadedTitle.trim() || "Property Showcase",
        category: newUploadedCategory || "Residential",
        altText: newUploadedAlt.trim() || newUploadedTitle.trim() || "Corona Properties Luxury Asset",
      });

      if (res.success && res.media) {
        await loadData();
        setSelectedItem(res.media);
        setShowUploadModal(false);
        setNewUploadedUrl("");
        setNewUploadedTitle("");
        setNewUploadedAlt("");
        setSaveSuccessMsg("Image successfully added to the gallery and media library!");
        setTimeout(() => setSaveSuccessMsg(null), 3500);
      } else {
        setSaveError((res as any)?.error || "Failed to save image. Please verify your connection.");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setSaveError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsSavingMedia(false);
    }
  };

  const handleSaveYoutubeVideo = async () => {
    const vidId = getYoutubeVideoId(youtubeUrl);
    if (!vidId) {
      setSaveError("Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)");
      return;
    }

    try {
      setIsSavingMedia(true);
      setSaveError(null);

      const title = newUploadedTitle.trim() || "YouTube Video Tour";
      const cat = newUploadedCategory || "Aerial Views";
      const alt = newUploadedAlt.trim() || title;

      const res = await addMediaItemAction({
        filename: `youtube-${vidId}.mp4`,
        filePath: `youtube/${vidId}`,
        url: `https://www.youtube.com/watch?v=${vidId}`,
        thumbnailUrl: getYoutubeThumbnail(vidId, "hqdefault"),
        mimeType: "video/youtube",
        sizeBytes: 0,
        title,
        category: cat,
        altText: alt,
      });

      if (res.success && res.media) {
        await loadData();
        setSelectedItem(res.media);
        setShowUploadModal(false);
        setYoutubeUrl("");
        setNewUploadedTitle("");
        setNewUploadedAlt("");
        setSaveSuccessMsg("YouTube video embedded successfully and added to the gallery!");
        setTimeout(() => setSaveSuccessMsg(null), 3500);
      } else {
        setSaveError((res as any)?.error || "Failed to embed YouTube video.");
      }
    } catch (err: any) {
      console.error("YouTube save error:", err);
      setSaveError(err.message || "Failed to embed video. Please try again.");
    } finally {
      setIsSavingMedia(false);
    }
  };

  const handleAddGalleryCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const res = await saveCategoryAction({
      name: newCatName.trim(),
      slug: newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      scope: "gallery",
      sortOrder: galleryCats.length + 1,
      isActive: true,
    });
    if (res.success && res.category) {
      await loadData();
      setNewUploadedCategory(res.category.name);
      setCategoryInput(res.category.name);
      setNewCatName("");
    }
  };

  const handleRenameGalleryCategory = async (cat: AdminCategory) => {
    if (!editingCatName.trim()) return;
    await saveCategoryAction({
      ...cat,
      name: editingCatName.trim(),
      slug: editingCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    });
    setEditingCatId(null);
    setEditingCatName("");
    await loadData();
  };

  const handleDeleteGalleryCategory = async (id: string, name: string) => {
    if (!confirm(`Delete gallery category "${name}"?`)) return;
    await deleteCategoryAction(id);
    await loadData();
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCatModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition"
          >
            <Tags className="h-3.5 w-3.5 text-gold-700" /> Manage Gallery Categories
          </button>
          <button
            type="button"
            onClick={() => {
              setUploadTab("youtube");
              setSaveError(null);
              setShowUploadModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3.5 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition shadow-2xs"
          >
            <Youtube className="h-4 w-4 text-red-600" /> Embed YouTube Video
          </button>
          <button
            type="button"
            onClick={() => {
              setUploadTab("image");
              setSaveError(null);
              setShowUploadModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
          >
            <Upload className="h-4 w-4" /> Upload New Asset
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 animate-fade-down">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {saveSuccessMsg}
        </div>
      )}

      {/* SEARCH & CATEGORY FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-3 shadow-xs border border-navy-100">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search assets by title, filename, or SEO alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-navy-200 pl-9 pr-4 py-2 text-xs focus:border-gold outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", ...categoryOptions].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-navy text-gold shadow-xs"
                  : "bg-slate-50 text-navy-600 hover:bg-navy-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-xs text-navy-400 font-medium">
          {isLoading ? "Loading assets..." : `${filtered.length} assets shown`}
        </span>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Media Grid */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-xs border border-navy-100">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="aspect-video rounded-xl bg-slate-100 animate-pulse border border-navy-50 flex items-center justify-center"
                >
                  <div className="h-6 w-6 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-navy-400">
              <FolderOpen className="h-10 w-10 text-navy-200 mx-auto mb-2" />
              <p className="text-sm font-medium">No assets matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isVid = item.mimeType === "video/youtube" || isYoutubeUrl(item.url);
                const thumbUrl = isVid ? (item.thumbnailUrl || getYoutubeThumbnail(item.url)) : item.url;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setTitleInput(item.title || item.filename);
                      setCategoryInput(item.category || "Residential");
                      setAltInput(item.altText);
                      setEditingMeta(false);
                    }}
                    className={`group relative aspect-video cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                      isSelected
                        ? "border-gold shadow-md ring-2 ring-gold/40"
                        : "border-navy-100 hover:border-navy-300"
                    }`}
                  >
                    <Image
                      src={thumbUrl}
                      alt={item.altText}
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />

                    {/* Category Badge */}
                    <span className="absolute top-2 right-2 rounded-md bg-gold/90 px-2 py-0.5 text-[10px] font-bold text-navy backdrop-blur-xs">
                      {item.category || "Residential"}
                    </span>

                    {/* Usage Tag / Video Badge */}
                    {isVid ? (
                      <span className="absolute top-2 left-2 rounded-md bg-red-600/90 text-white px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-sm backdrop-blur-xs">
                        <Play className="h-2.5 w-2.5 fill-white" /> Video
                      </span>
                    ) : item.usageCount > 0 ? (
                      <span className="absolute top-2 left-2 rounded-md bg-navy-900/80 px-2 py-0.5 text-[10px] font-bold text-gold-300 backdrop-blur-xs">
                        {item.usageCount} in use
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 rounded-md bg-slate-900/60 px-2 py-0.5 text-[10px] font-medium text-slate-300 backdrop-blur-xs">
                        Gallery
                      </span>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent p-2">
                      <p className="truncate text-[11px] font-bold text-white">
                        {item.title || item.filename}
                      </p>
                      <p className="truncate text-[10px] text-slate-300">{item.filename}</p>
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

            {selectedItem.mimeType === "video/youtube" || isYoutubeUrl(selectedItem.url) ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-navy-700 bg-black shadow-xs">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeVideoId(selectedItem.url)}?rel=0`}
                  title={selectedItem.title || "YouTube Video"}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-navy-100 bg-navy-50 shadow-xs">
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.altText}
                  fill
                  className="object-cover"
                  sizes="350px"
                />
              </div>
            )}

            <div>
              <h4 className="font-bold text-xs text-navy truncate" title={selectedItem.filename}>
                {selectedItem.title || selectedItem.filename}
              </h4>
              <p className="text-[11px] text-navy-400 mt-0.5 font-mono">
                {selectedItem.filename} &bull; {(selectedItem.sizeBytes / 1024).toFixed(0)} KB
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

            {/* Title, Category & Alt-Text Editor */}
            <div className="space-y-2 border-t border-navy-50 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-navy-700">
                  Gallery Title, Category & SEO Alt Text
                </span>
                {!editingMeta && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMeta(true);
                      setTitleInput(selectedItem.title || selectedItem.filename);
                      setCategoryInput(selectedItem.category || "Residential");
                      setAltInput(selectedItem.altText);
                    }}
                    className="flex items-center gap-1 text-[11px] text-gold-700 font-semibold hover:underline"
                  >
                    <Edit2 className="h-3 w-3" /> Edit Metadata
                  </button>
                )}
              </div>

              {editingMeta ? (
                <div className="space-y-2.5 rounded-xl border border-navy-100 bg-slate-50/50 p-3">
                  <div>
                    <label className="text-[10px] font-semibold text-navy-600 block mb-1">
                      Display Title (Shown in Gallery Lightbox)
                    </label>
                    <input
                      type="text"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      className="w-full rounded-lg border border-navy-300 bg-white px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-semibold text-navy-600">
                        Gallery Category
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCatModal(true)}
                        className="text-[10px] font-bold text-gold-700 hover:underline flex items-center gap-0.5"
                      >
                        <Plus className="h-3 w-3" /> Add / Edit Categories
                      </button>
                    </div>
                    <select
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      className="w-full rounded-lg border border-navy-300 bg-white px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-navy-600 block mb-1">
                      SEO Alt Text
                    </label>
                    <input
                      type="text"
                      value={altInput}
                      onChange={(e) => setAltInput(e.target.value)}
                      className="w-full rounded-lg border border-navy-300 bg-white px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingMeta(false)}
                      className="px-2.5 py-1 text-xs text-navy-500 hover:bg-navy-50 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveMeta}
                      className="px-3 py-1 text-xs bg-navy text-gold rounded font-semibold"
                    >
                      Save Metadata
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-navy-100 bg-slate-50/70 p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-navy-400">Title:</span>
                    <span className="font-semibold text-navy">
                      {selectedItem.title || selectedItem.filename}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-navy-400">Category:</span>
                    <span className="rounded bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-navy">
                      {selectedItem.category || "Residential"}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-navy-100/60 text-navy-700 italic">
                    &ldquo;{selectedItem.altText}&rdquo;
                  </div>
                </div>
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

      {/* UPLOAD & EMBED MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            {/* Modal Tabs */}
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUploadTab("image");
                    setSaveError(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    uploadTab === "image"
                      ? "bg-navy text-gold shadow-xs"
                      : "text-navy-500 hover:bg-slate-100"
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" /> Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadTab("youtube");
                    setSaveError(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    uploadTab === "youtube"
                      ? "bg-red-600 text-white shadow-xs"
                      : "text-navy-500 hover:bg-slate-100"
                  }`}
                >
                  <Youtube className="h-3.5 w-3.5" /> Embed YouTube Video
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  setSaveError(null);
                }}
                className="text-navy-400 hover:text-navy-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {uploadTab === "youtube" ? (
              /* YOUTUBE EMBED FORM */
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-navy-700 block mb-1">
                    YouTube Video URL *
                  </label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setYoutubeUrl(val);
                      setSaveError(null);
                      const id = getYoutubeVideoId(val);
                      if (id && !newUploadedTitle) {
                        setNewUploadedTitle(`YouTube Tour - ${id}`);
                      }
                    }}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
                  />
                  <p className="text-[11px] text-navy-400 mt-1">
                    Paste any YouTube video link (watch, share, embed, or shorts link).
                  </p>
                </div>

                {/* Live YouTube Preview */}
                {getYoutubeVideoId(youtubeUrl) && (
                  <div className="rounded-xl overflow-hidden aspect-video bg-black border border-navy-200 shadow-sm relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeVideoId(youtubeUrl)}?rel=0`}
                      title="YouTube Preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-navy-700 block mb-1">
                    Display Title (Shown in Lightbox & Gallery)
                  </label>
                  <input
                    type="text"
                    value={newUploadedTitle}
                    onChange={(e) => setNewUploadedTitle(e.target.value)}
                    placeholder="e.g. Corona Green Valley Aerial Drone Tour 4K"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-navy-700">
                      Gallery Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCatModal(true)}
                      className="text-[11px] font-bold text-gold-700 hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add / Modify Categories
                    </button>
                  </div>
                  <select
                    value={newUploadedCategory}
                    onChange={(e) => setNewUploadedCategory(e.target.value)}
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy-700 block mb-1">
                    SEO Alt / Description Text
                  </label>
                  <input
                    type="text"
                    value={newUploadedAlt}
                    onChange={(e) => setNewUploadedAlt(e.target.value)}
                    placeholder="e.g. Corona Properties luxury drone video footage"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
                  />
                </div>
              </div>
            ) : (
              /* IMAGE UPLOAD FORM */
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-navy-700 block mb-1">
                    Display Title
                  </label>
                  <input
                    type="text"
                    value={newUploadedTitle}
                    onChange={(e) => setNewUploadedTitle(e.target.value)}
                    placeholder="e.g. Maple Leaf Garden City Aerial View"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-navy-700">
                      Gallery Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCatModal(true)}
                      className="text-[11px] font-bold text-gold-700 hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add / Modify Categories
                    </button>
                  </div>
                  <select
                    value={newUploadedCategory}
                    onChange={(e) => setNewUploadedCategory(e.target.value)}
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <ImageInput
                  value={newUploadedUrl}
                  onChange={(url) => {
                    setNewUploadedUrl(url);
                    setSaveError(null);
                  }}
                  altValue={newUploadedAlt}
                  onAltChange={(alt) => setNewUploadedAlt(alt)}
                  label="Choose Image"
                />
              </div>
            )}

            {saveError && (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-start gap-2 animate-fade-down">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-snug">{saveError}</span>
              </div>
            )}

            {uploadTab === "image" && !newUploadedUrl && (
              <p className="mt-2 text-[11px] text-navy-400 italic text-center">
                * Click or drag an image above, or switch to Paste URL to select an image before saving.
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-navy-50 pt-3">
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  setSaveError(null);
                }}
                disabled={isSavingMedia}
                className="px-3.5 py-2 text-xs font-semibold text-navy-600 hover:bg-navy-50 rounded-xl transition"
              >
                Cancel
              </button>
              {uploadTab === "youtube" ? (
                <button
                  type="button"
                  onClick={handleSaveYoutubeVideo}
                  disabled={!getYoutubeVideoId(youtubeUrl) || isSavingMedia}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 shadow-sm transition"
                >
                  {isSavingMedia ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Embedding Video...</span>
                    </>
                  ) : (
                    <>
                      <Youtube className="h-4 w-4" />
                      <span>Embed in Gallery</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNewUpload(newUploadedUrl)}
                  disabled={!newUploadedUrl || isSavingMedia}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-navy text-gold hover:bg-navy-800 disabled:opacity-40 shadow-sm transition"
                >
                  {isSavingMedia ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-gold" />
                      <span>Saving to Library...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Save to Library</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INLINE GALLERY CATEGORY MANAGER MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-navy-100 space-y-4">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-navy">
                  Manage Gallery Categories
                </h3>
                <p className="text-xs text-navy-400">
                  Create, rename, or remove categories shown in the Gallery & Media Library.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Add New Category Form */}
            <form onSubmit={handleAddGalleryCategory} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="New category name (e.g. Master Plan)..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition shrink-0"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </form>

            {/* Existing Categories List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-navy-50 rounded-xl border border-navy-100">
              {galleryCats.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-2.5 px-3 text-xs">
                  {editingCatId === cat.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingCatName}
                        onChange={(e) => setEditingCatName(e.target.value)}
                        className="flex-1 rounded-lg border border-gold px-2.5 py-1 text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRenameGalleryCategory(cat)}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCatId(null)}
                        className="text-navy-400 hover:text-navy px-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-navy">{cat.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setEditingCatName(cat.name);
                          }}
                          className="rounded p-1.5 text-navy-500 hover:bg-slate-100 hover:text-navy"
                          title="Rename Category"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryCategory(cat.id, cat.name)}
                          className="rounded p-1.5 text-rose-500 hover:bg-rose-50"
                          title="Delete Category"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-navy-100">
              <Link
                href="/admin/categories"
                className="text-xs font-semibold text-gold-700 hover:underline flex items-center gap-1"
              >
                Open Full Category Manager <ExternalLink className="h-3 w-3" />
              </Link>
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-navy hover:bg-slate-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
