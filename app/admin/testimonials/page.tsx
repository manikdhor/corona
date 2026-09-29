"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Quote,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  getTestimonialsAction,
  saveTestimonialAction,
  deleteTestimonialAction,
} from "@/lib/admin/actions";
import { AdminTestimonial } from "@/lib/admin/seed";

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<AdminTestimonial> | null>(null);
  const [saving, setSaving] = useState(false);

  const loadTestimonials = async () => {
    setLoading(true);
    const data = await getTestimonialsAction();
    setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      name: "",
      role: "",
      quote: "",
      rating: 5,
      image: "/image-01.webp",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminTestimonial) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSaving(true);
    setErrorMsg("");
    const res = await saveTestimonialAction(editingItem);
    setSaving(false);

    if (res.success && res.testimonial) {
      setSuccessMsg("Testimonial saved successfully.");
      setIsModalOpen(false);
      setEditingItem(null);
      loadTestimonials();
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg(res.error || "Failed to save testimonial.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the testimonial from "${name}"?`)) return;
    const res = await deleteTestimonialAction(id);
    if (res.success) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setSuccessMsg(`Testimonial from ${name} removed.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleToggleActive = async (item: AdminTestimonial) => {
    const updated = { ...item, isActive: !item.isActive };
    const res = await saveTestimonialAction(updated);
    if (res.success) {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, isActive: !t.isActive } : t))
      );
    }
  };

  const activeCount = testimonials.filter((t) => t.isActive).length;
  const avgRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0) / testimonials.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Social Proof & Trust
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            Client Testimonials & Reviews
          </h1>
          <p className="text-xs text-navy-400">
            Manage high-net-worth client recommendations, NRB buyer stories, and homepage reviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#testimonials"
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-navy-400" />
            View on Homepage
          </Link>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-800 transition shadow-xs"
          >
            <Plus className="h-4 w-4 text-gold" />
            Add Testimonial
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-800 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-800 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-navy-400">Total Reviews</p>
          <p className="text-2xl font-serif font-bold text-navy mt-1">{testimonials.length}</p>
        </div>
        <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-emerald-600">Active Live</p>
          <p className="text-2xl font-serif font-bold text-emerald-700 mt-1">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-gold-700">Average Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-serif font-bold text-navy">{avgRating}</span>
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Testimonial Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-navy-400">Loading testimonials...</div>
      ) : testimonials.length === 0 ? (
        <div className="rounded-2xl border border-navy-100 bg-white p-12 text-center shadow-xs">
          <Quote className="mx-auto h-10 w-10 text-navy-200" />
          <h3 className="mt-3 text-sm font-bold text-navy">No testimonials added</h3>
          <p className="text-xs text-navy-400 mt-1">
            Add feedback from verified buyers and investors.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy px-3.5 py-1.5 text-xs font-bold text-white hover:bg-navy-800 transition"
          >
            <Plus className="h-3.5 w-3.5 text-gold" /> Add First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`rounded-2xl border bg-white p-5 shadow-xs transition flex flex-col justify-between ${
                t.isActive ? "border-navy-100" : "border-slate-200 opacity-60 bg-slate-50/50"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3.5 w-3.5 ${
                          idx < (t.rating || 5)
                            ? "fill-gold text-gold"
                            : "text-slate-300 fill-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(t)}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      t.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {t.isActive ? (
                      <>
                        <Eye className="h-3 w-3" /> Live
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" /> Hidden
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-navy-700 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-navy-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gold/30 bg-navy-100">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/image-01.webp";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy">{t.name}</h4>
                    <p className="text-[10px] text-navy-400">{t.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(t)}
                    className="rounded-lg p-1 text-navy-500 hover:bg-slate-100 hover:text-navy transition"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.id, t.name)}
                    className="rounded-lg p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-navy-100 animate-scale-up">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-navy">
                {editingItem.id ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-navy-400 hover:text-navy text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-navy-600 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. Dr. Farhan Ahmed"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-navy-600 mb-1">Role / Location *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.role || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="e.g. NRB Investor, London UK"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-navy-600 mb-1">Avatar Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingItem.image || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  placeholder="/image-01.webp or image URL"
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-navy-600 mb-1">Star Rating (1-5)</label>
                  <select
                    value={editingItem.rating || 5}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, rating: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                    <option value={2}>2 Stars (Fair)</option>
                    <option value={1}>1 Star (Poor)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-navy-600 mb-1">Status</label>
                  <select
                    value={editingItem.isActive ? "active" : "hidden"}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isActive: e.target.value === "active" })
                    }
                    className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-navy-600 mb-1">Client Quote / Review *</label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.quote || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  placeholder="Detailed review and feedback about the purchasing experience..."
                  className="w-full rounded-xl border border-navy-200 p-2.5 text-xs text-navy focus:border-gold focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-navy-200 px-4 py-2 text-xs font-semibold text-navy-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-navy px-5 py-2 text-xs font-bold text-white hover:bg-navy-800 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
