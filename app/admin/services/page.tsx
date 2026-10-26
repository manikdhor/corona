"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wrench,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Building2,
  ShieldCheck,
  Landmark,
  FileCheck2,
  Compass,
  KeyRound,
  Check,
  X,
  Layers,
} from "lucide-react";
import {
  getServicesAction,
  saveServiceAction,
  deleteServiceAction,
  getCategoriesAction,
} from "@/lib/admin/actions";
import { AdminService, AdminCategory } from "@/lib/admin/seed";

const ICON_OPTIONS = [
  { name: "Building2", label: "Building & Construction" },
  { name: "ShieldCheck", label: "Security & Legitimacy" },
  { name: "Landmark", label: "Finance & Wealth" },
  { name: "FileCheck2", label: "Legal & Documentation" },
  { name: "Compass", label: "Architecture & Planning" },
  { name: "KeyRound", label: "Handover & Management" },
];

export default function ServicesAdminPage() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [serviceCats, setServiceCats] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<AdminService> | null>(null);
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [saving, setSaving] = useState(false);

  const loadServices = async () => {
    setLoading(true);
    const [data, cats] = await Promise.all([
      getServicesAction(),
      getCategoriesAction("service"),
    ]);
    setServices(data);
    if (cats) setServiceCats(cats.filter((c) => c.isActive));
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      title: "",
      category: serviceCats[0]?.name || "Land Acquisition & Sales",
      iconName: "Building2",
      description: "",
      sortOrder: services.length + 1,
    });
    setFeaturesList(["RAJUK Approved Masterplan", "Turnkey Handover"]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminService) => {
    setEditingItem({ ...item });
    setFeaturesList(item.features || []);
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFeaturesList([...featuresList, newFeatureInput.trim()]);
    setNewFeatureInput("");
  };

  const handleRemoveFeature = (idx: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSaving(true);
    setErrorMsg("");
    const res = await saveServiceAction({
      ...editingItem,
      features: featuresList,
    });
    setSaving(false);

    if (res.success && res.service) {
      setSuccessMsg("Service successfully saved.");
      setIsModalOpen(false);
      setEditingItem(null);
      loadServices();
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg(res.error || "Failed to save service.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}"?`)) return;
    const res = await deleteServiceAction(id);
    if (res.success) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      setSuccessMsg(`Service "${title}" removed.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case "ShieldCheck":
        return <ShieldCheck className="h-5 w-5 text-gold-700" />;
      case "Landmark":
        return <Landmark className="h-5 w-5 text-gold-700" />;
      case "FileCheck2":
        return <FileCheck2 className="h-5 w-5 text-gold-700" />;
      case "Compass":
        return <Compass className="h-5 w-5 text-gold-700" />;
      case "KeyRound":
        return <KeyRound className="h-5 w-5 text-gold-700" />;
      default:
        return <Building2 className="h-5 w-5 text-gold-700" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Corporate Offerings
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            Services & Solutions Catalog
          </h1>
          <p className="text-xs text-navy-400">
            Manage comprehensive real estate development, investment advisory, and architectural services.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/services"
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-navy-400" />
            View Public Services
          </Link>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-800 transition shadow-xs"
          >
            <Plus className="h-4 w-4 text-gold" />
            Add Service
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

      {/* Services Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-navy-400">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-navy-100 bg-white p-12 text-center shadow-xs">
          <Layers className="mx-auto h-10 w-10 text-navy-200" />
          <h3 className="mt-3 text-sm font-bold text-navy">No services configured</h3>
          <p className="text-xs text-navy-400 mt-1">Add your offerings to display on the services page.</p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy px-3.5 py-1.5 text-xs font-bold text-white hover:bg-navy-800 transition"
          >
            <Plus className="h-3.5 w-3.5 text-gold" /> Add First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
                    {renderIcon(s.iconName)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(s)}
                      className="rounded-lg p-1.5 text-navy-500 hover:bg-slate-100 hover:text-navy transition"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id, s.title)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-navy text-sm">{s.title}</h3>
                  <p className="mt-1.5 text-xs text-navy-500 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                {s.features && s.features.length > 0 && (
                  <div className="pt-2 border-t border-navy-100 space-y-1.5">
                    {s.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-navy-700">
                        <Check className="h-3.5 w-3.5 text-gold-700 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-navy-100 flex items-center justify-between text-[11px] text-navy-400">
                <span>Display Order: #{s.sortOrder}</span>
                <span className="font-mono text-[10px] text-slate-400">{s.iconName}</span>
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
                {editingItem.id ? "Edit Service" : "Add Service"}
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
              <div>
                <label className="block font-medium text-navy-600 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Masterplanned Township Development"
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-navy-600 mb-1">Service Category</label>
                  <select
                    value={editingItem.category || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
                  >
                    <option value="">General Service</option>
                    {(serviceCats.length > 0
                      ? serviceCats.map((c) => c.name)
                      : [
                          "Land Acquisition & Sales",
                          "Legal & Documentation",
                          "Development & Infrastructure",
                          "Investment & Advisory",
                        ]
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-navy-600 mb-1">Icon Style</label>
                  <select
                    value={editingItem.iconName || "Building2"}
                    onChange={(e) => setEditingItem({ ...editingItem, iconName: e.target.value })}
                    className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
                  >
                    {ICON_OPTIONS.map((ico) => (
                      <option key={ico.name} value={ico.name}>
                        {ico.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-navy-600 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingItem.sortOrder || 1}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, sortOrder: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-navy-600 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Core value proposition and deliverables for this service..."
                  className="w-full rounded-xl border border-navy-200 p-2.5 text-xs text-navy focus:border-gold focus:outline-none leading-relaxed"
                />
              </div>

              {/* Bullet Features Manager */}
              <div>
                <label className="block font-medium text-navy-600 mb-1">Key Deliverables / Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Add deliverable, e.g. Soil testing report"
                    className="flex-1 rounded-xl border border-navy-200 px-3 py-1.5 text-xs text-navy focus:border-gold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="rounded-xl bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-800 transition"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {featuresList.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] text-navy-700 border border-slate-100"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
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
                  {saving ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
