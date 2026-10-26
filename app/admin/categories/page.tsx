"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tags,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  Sparkles,
  Image as ImageIcon,
  FileText,
  HelpCircle,
  Layers,
  Wrench,
  RefreshCw,
} from "lucide-react";
import {
  getCategoriesAction,
  saveCategoryAction,
  deleteCategoryAction,
  reorderCategoriesAction,
  getNavigationAction,
  updateNavigationAction,
} from "@/lib/admin/actions";
import { AdminCategory, CategoryScope } from "@/lib/admin/seed";

const CATEGORY_SCOPES: {
  id: CategoryScope;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  publicLink?: string;
}[] = [
  {
    id: "property_type",
    label: "Property Categories / Types",
    shortLabel: "Property Types",
    description: "Controls Property Type filters on /properties, Property Editor categories, and Navbar dropdowns.",
    icon: Building2,
    publicLink: "/properties",
  },
  {
    id: "property_area",
    label: "Property Areas / Locations",
    shortLabel: "Locations & Areas",
    description: "Controls Area filter buttons on /properties (e.g. Purbachal, Gulshan, Banani) and Property Editor.",
    icon: MapPin,
    publicLink: "/properties",
  },
  {
    id: "property_status",
    label: "Project & Plot Statuses",
    shortLabel: "Plot Statuses",
    description: "Controls availability & launch badges (Available, Ongoing, New Launch, Sold Out) across listings.",
    icon: Sparkles,
    publicLink: "/projects",
  },
  {
    id: "gallery",
    label: "Gallery & Media Categories",
    shortLabel: "Gallery Tabs",
    description: "Controls category filter tabs on the public /gallery page and Media Library folders.",
    icon: ImageIcon,
    publicLink: "/gallery",
  },
  {
    id: "blog",
    label: "Blog & Editorial Categories",
    shortLabel: "Blog Categories",
    description: "Controls article categories in the Blog Editor and filter tabs on the public /blog page.",
    icon: FileText,
    publicLink: "/blog",
  },
  {
    id: "faq",
    label: "FAQ Categories",
    shortLabel: "FAQ Topics",
    description: "Controls question topic tabs on the /contact FAQ accordion and Content Manager.",
    icon: HelpCircle,
    publicLink: "/contact",
  },
  {
    id: "amenity",
    label: "Amenity & Facility Categories",
    shortLabel: "Amenity Groups",
    description: "Controls masterplan amenity groupings (Healthcare, Civic, Nature, Security) inside Property Editor.",
    icon: Layers,
    publicLink: "/projects/maple-leaf-garden-city",
  },
  {
    id: "service",
    label: "Corporate Service Categories",
    shortLabel: "Service Groups",
    description: "Controls service classifications across the Services catalog.",
    icon: Wrench,
    publicLink: "/services",
  },
];

export default function CategoriesAdminPage() {
  const [activeScope, setActiveScope] = useState<CategoryScope>("property_type");
  const [allCategories, setAllCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<AdminCategory> | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncingNav, setSyncingNav] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategoriesAction();
      setAllCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const currentScopeMeta =
    CATEGORY_SCOPES.find((s) => s.id === activeScope) || CATEGORY_SCOPES[0];

  const scopedCategories = allCategories
    .filter((c) => c.scope === activeScope)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const handleOpenAdd = () => {
    setEditingItem({
      name: "",
      nameBn: "",
      slug: "",
      scope: activeScope,
      description: "",
      color: "#c9a96e",
      sortOrder: scopedCategories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminCategory) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name?.trim()) return;

    setSaving(true);
    setErrorMsg("");
    const res = await saveCategoryAction({
      ...editingItem,
      name: editingItem.name.trim(),
      scope: (editingItem.scope as CategoryScope) || activeScope,
    });
    setSaving(false);

    if (res.success) {
      setSuccessMsg(`Category "${editingItem.name}" saved successfully.`);
      setIsModalOpen(false);
      setEditingItem(null);
      await loadCategories();
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg(res.error || "Failed to save category.");
    }
  };

  const handleDelete = async (item: AdminCategory) => {
    if (!confirm(`Are you sure you want to delete the category "${item.name}"?`)) return;
    const res = await deleteCategoryAction(item.id);
    if (res.success) {
      setAllCategories((prev) => prev.filter((c) => c.id !== item.id));
      setSuccessMsg(`Category "${item.name}" removed.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleToggleActive = async (item: AdminCategory) => {
    const res = await saveCategoryAction({
      ...item,
      isActive: !item.isActive,
    });
    if (res.success) {
      await loadCategories();
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= scopedCategories.length) return;

    const updatedScope = [...scopedCategories];
    const temp = updatedScope[index];
    updatedScope[index] = updatedScope[targetIdx];
    updatedScope[targetIdx] = temp;

    await reorderCategoriesAction(updatedScope.map((c) => c.id));
    await loadCategories();
  };

  const handleSyncToNavbar = async () => {
    setSyncingNav(true);
    try {
      const nav = await getNavigationAction();
      const activePropTypes = allCategories
        .filter((c) => c.scope === "property_type" && c.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const updatedNav = {
        ...nav,
        categories: activePropTypes.map((c) => ({
          label: `${c.name} Plots`,
          href: `/properties?type=${encodeURIComponent(c.name)}`,
          description: c.description || `Explore ${c.name} properties`,
        })),
      };
      await updateNavigationAction(updatedNav);
      setSuccessMsg("Property categories synced to Navigation Dropdowns!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setSyncingNav(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Taxonomy & Classification Engine
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            Universal Category Manager
          </h1>
          <p className="text-xs text-navy-400">
            Manage every category, location filter, status badge, gallery tab, blog topic, and amenity group across the website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeScope === "property_type" && (
            <button
              type="button"
              onClick={handleSyncToNavbar}
              disabled={syncingNav}
              className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-gold-700 ${syncingNav ? "animate-spin" : ""}`} />
              Sync to Navbar Dropdown
            </button>
          )}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-bold text-gold hover:bg-navy-800 transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add {currentScopeMeta.shortLabel.replace(/s$/, "")}
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

      {/* Scope Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {CATEGORY_SCOPES.map((sc) => {
          const Icon = sc.icon;
          const count = allCategories.filter((c) => c.scope === sc.id).length;
          const isActive = activeScope === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => setActiveScope(sc.id)}
              className={`flex flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition ${
                isActive
                  ? "border-navy bg-navy text-white shadow-sm"
                  : "border-navy-100 bg-white text-navy hover:border-gold/50 hover:bg-slate-50"
              }`}
            >
              <div className="flex w-full items-center justify-between mb-2">
                <Icon className={`h-4 w-4 ${isActive ? "text-gold" : "text-gold-700"}`} />
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive ? "bg-navy-800 text-gold" : "bg-slate-100 text-navy-600"
                  }`}
                >
                  {count}
                </span>
              </div>
              <span className="text-xs font-bold leading-snug">{sc.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Active Scope Table Card */}
      <div className="rounded-2xl border border-navy-100 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-navy-100 bg-slate-50/70 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-base font-bold text-navy flex items-center gap-2">
              <Tags className="h-4 w-4 text-gold-700" />
              {currentScopeMeta.label} ({scopedCategories.length})
            </h2>
            <p className="text-xs text-navy-400 mt-0.5">{currentScopeMeta.description}</p>
          </div>
          {currentScopeMeta.publicLink && (
            <Link
              href={currentScopeMeta.publicLink}
              target="_blank"
              className="text-xs font-semibold text-gold-700 hover:underline"
            >
              View Live on {currentScopeMeta.publicLink} &rarr;
            </Link>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-navy-400">Loading categories...</div>
        ) : scopedCategories.length === 0 ? (
          <div className="p-12 text-center">
            <Tags className="mx-auto h-10 w-10 text-navy-200" />
            <h3 className="mt-3 text-sm font-bold text-navy">No categories in this group yet</h3>
            <p className="text-xs text-navy-400 mt-1">
              Create your first category for {currentScopeMeta.label}.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-gold hover:bg-navy-800 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Add Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-navy-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-navy-500">
                  <th className="py-3 px-4 w-16 text-center">Order</th>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Bangla Label</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {scopedCategories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, "up")}
                          className="p-1 rounded text-navy-400 hover:text-navy disabled:opacity-20"
                          title="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono text-[11px] font-bold text-navy-600 w-4 text-center">
                          {idx + 1}
                        </span>
                        <button
                          type="button"
                          disabled={idx === scopedCategories.length - 1}
                          onClick={() => handleMove(idx, "down")}
                          className="p-1 rounded text-navy-400 hover:text-navy disabled:opacity-20"
                          title="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-3 w-3 rounded-full shrink-0 border border-black/10"
                          style={{ backgroundColor: cat.color || "#c9a96e" }}
                        />
                        <span className="font-bold text-navy text-xs">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-navy-600">
                      {cat.nameBn || "—"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-navy-400">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-navy-500 line-clamp-1">{cat.description || "—"}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(cat)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                          cat.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {cat.isActive ? (
                          <>
                            <Eye className="h-3 w-3" /> Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" /> Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="rounded-lg p-1.5 text-navy-600 hover:bg-navy-50 hover:text-navy transition"
                          title="Edit Category"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                          title="Delete Category"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT CATEGORY MODAL */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-700">
                  {currentScopeMeta.label}
                </span>
                <h3 className="font-serif text-lg font-bold text-navy">
                  {editingItem.id ? "Edit Category" : "Create New Category"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-navy-400 hover:text-navy text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy-700 mb-1">
                    Category Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingItem({
                        ...editingItem,
                        name: val,
                        slug: editingItem.id
                          ? editingItem.slug
                          : val.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      });
                    }}
                    placeholder="e.g. Waterfront Enclave"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 font-semibold text-navy focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy-700 mb-1">
                    Bangla Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingItem.nameBn || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, nameBn: e.target.value })
                    }
                    placeholder="যেমন: ওয়াটারফ্রন্ট"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 text-navy focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-navy-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={editingItem.slug || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, slug: e.target.value })
                    }
                    placeholder="waterfront-enclave"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 font-mono text-navy focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy-700 mb-1">Category Group</label>
                  <select
                    value={editingItem.scope || activeScope}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        scope: e.target.value as CategoryScope,
                      })
                    }
                    className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2 font-medium text-navy focus:border-gold outline-none"
                  >
                    {CATEGORY_SCOPES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shortLabel}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-navy-700 mb-1">Badge Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingItem.color || "#c9a96e"}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, color: e.target.value })
                      }
                      className="h-9 w-12 rounded-lg border border-navy-200 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingItem.color || "#c9a96e"}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, color: e.target.value })
                      }
                      className="w-full rounded-xl border border-navy-200 px-2.5 py-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-navy-700 mb-1">
                  Description / Tooltip Note
                </label>
                <textarea
                  rows={2}
                  value={editingItem.description || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  placeholder="Short description used in navigation dropdowns or admin hints..."
                  className="w-full rounded-xl border border-navy-200 p-2.5 text-navy focus:border-gold outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-navy-700">
                  <input
                    type="checkbox"
                    checked={editingItem.isActive !== false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isActive: e.target.checked })
                    }
                    className="rounded border-navy-300 text-gold focus:ring-gold"
                  />
                  Active & Visible on Website Filters
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-navy-500 font-medium">Sort Order:</span>
                  <input
                    type="number"
                    value={editingItem.sortOrder ?? 1}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        sortOrder: Number(e.target.value),
                      })
                    }
                    className="w-16 rounded-xl border border-navy-200 px-2.5 py-1.5 text-center font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-navy-200 px-4 py-2 font-semibold text-navy-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-navy px-5 py-2 font-bold text-gold hover:bg-navy-800 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
