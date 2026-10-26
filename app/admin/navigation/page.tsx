"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  LayoutGrid,
  ChevronDown,
  Link2,
  FolderTree,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { getNavigationAction, updateNavigationAction } from "@/lib/admin/actions";
import { AdminNavigation, AdminNavItem, AdminNavChildItem } from "@/lib/admin/seed";

export default function NavigationAdminPage() {
  const [activeTab, setActiveTab] = useState<"header" | "footer" | "categories">("header");
  const [nav, setNav] = useState<AdminNavigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadNav = async () => {
    setLoading(true);
    const data = await getNavigationAction();
    setNav(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNav();
  }, []);

  const handleSave = async () => {
    if (!nav) return;
    setSaving(true);
    setErrorMsg("");
    const res = await updateNavigationAction(nav);
    setSaving(false);
    if (res.success) {
      setSuccessMsg("Navigation menus successfully saved and updated site-wide.");
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      setErrorMsg("Failed to save navigation.");
    }
  };

  // --- HEADER LINK HELPERS ---
  const addHeaderLink = (isDropdown = false) => {
    if (!nav) return;
    const newItem: AdminNavItem = isDropdown
      ? {
          label: "New Dropdown Menu",
          href: "#",
          isDropdown: true,
          children: [
            {
              label: "Sub Item 1",
              href: "/",
              description: "Optional brief description",
            },
          ],
        }
      : {
          label: "New Link",
          href: "/",
          isDropdown: false,
          children: [],
        };

    setNav({
      ...nav,
      header: [...nav.header, newItem],
    });
  };

  const toggleItemType = (index: number) => {
    if (!nav) return;
    const updated = [...nav.header];
    const current = updated[index];
    const willBeDropdown = !current.isDropdown;

    updated[index] = {
      ...current,
      isDropdown: willBeDropdown,
      href: willBeDropdown ? (current.href === "/" ? "#" : current.href) : current.href,
      children:
        willBeDropdown && (!current.children || current.children.length === 0)
          ? [{ label: "Sub Item 1", href: "/", description: "" }]
          : current.children || [],
    };
    setNav({ ...nav, header: updated });
  };

  const updateHeaderLink = (
    index: number,
    field: "label" | "href",
    value: string
  ) => {
    if (!nav) return;
    const updated = [...nav.header];
    updated[index] = { ...updated[index], [field]: value };
    setNav({ ...nav, header: updated });
  };

  const removeHeaderLink = (index: number) => {
    if (!nav) return;
    setNav({
      ...nav,
      header: nav.header.filter((_, i) => i !== index),
    });
  };

  const moveHeaderLink = (index: number, dir: "up" | "down") => {
    if (!nav) return;
    const targetIdx = dir === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nav.header.length) return;
    const updated = [...nav.header];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setNav({ ...nav, header: updated });
  };

  // --- DROPDOWN SUB-ITEMS HELPERS ---
  const addDropdownChild = (parentIndex: number) => {
    if (!nav) return;
    const updated = [...nav.header];
    const parent = updated[parentIndex];
    const currentChildren = parent.children || [];
    updated[parentIndex] = {
      ...parent,
      isDropdown: true,
      children: [
        ...currentChildren,
        {
          label: "New Sub-Item",
          href: "/",
          description: "",
        },
      ],
    };
    setNav({ ...nav, header: updated });
  };

  const updateDropdownChild = (
    parentIndex: number,
    childIndex: number,
    field: keyof AdminNavChildItem,
    value: string
  ) => {
    if (!nav) return;
    const updated = [...nav.header];
    const parent = updated[parentIndex];
    const children = [...(parent.children || [])];
    children[childIndex] = { ...children[childIndex], [field]: value };
    updated[parentIndex] = { ...parent, children };
    setNav({ ...nav, header: updated });
  };

  const removeDropdownChild = (parentIndex: number, childIndex: number) => {
    if (!nav) return;
    const updated = [...nav.header];
    const parent = updated[parentIndex];
    const children = (parent.children || []).filter((_, i) => i !== childIndex);
    updated[parentIndex] = { ...parent, children };
    setNav({ ...nav, header: updated });
  };

  const moveDropdownChild = (
    parentIndex: number,
    childIndex: number,
    dir: "up" | "down"
  ) => {
    if (!nav) return;
    const updated = [...nav.header];
    const parent = updated[parentIndex];
    const children = [...(parent.children || [])];
    const targetIdx = dir === "up" ? childIndex - 1 : childIndex + 1;
    if (targetIdx < 0 || targetIdx >= children.length) return;
    const temp = children[childIndex];
    children[childIndex] = children[targetIdx];
    children[targetIdx] = temp;
    updated[parentIndex] = { ...parent, children };
    setNav({ ...nav, header: updated });
  };

  // Preset: Load Standard Hierarchy
  const handleLoadStandardHierarchy = () => {
    if (
      !confirm(
        "Load standard navigation hierarchy with 'About' and 'Projects' dropdown menus? Unsaved changes will be replaced."
      )
    ) {
      return;
    }
    if (!nav) return;

    setNav({
      ...nav,
      header: [
        { label: "Home", href: "/", isDropdown: false },
        {
          label: "About",
          href: "/about",
          isDropdown: true,
          children: [
            { label: "About Us", href: "/about", description: "Our heritage, philosophy, and legacy" },
            { label: "Group Profile", href: "/corona-group", description: "Corona Group corporate profile & enterprises" },
            { label: "Management Messages", href: "/team", description: "Leadership messages & executive directors" },
          ],
        },
        {
          label: "Projects",
          href: "/projects",
          isDropdown: true,
          children: [
            {
              label: "Maple Leaf Garden City",
              href: "/projects/maple-leaf-garden-city",
              description: "Flagship master-planned township in Purbachal",
            },
          ],
        },
        { label: "Services", href: "/services", isDropdown: false },
        { label: "Gallery", href: "/gallery", isDropdown: false },
        { label: "Blog", href: "/blog", isDropdown: false },
        { label: "Contact", href: "/contact", isDropdown: false },
      ],
    });
  };

  // --- FOOTER LINK HELPERS ---
  const addFooterLink = (column: keyof AdminNavigation["footer"]) => {
    if (!nav) return;
    setNav({
      ...nav,
      footer: {
        ...nav.footer,
        [column]: [...nav.footer[column], { label: "New Link", href: "/" }],
      },
    });
  };

  const updateFooterLink = (
    column: keyof AdminNavigation["footer"],
    index: number,
    field: "label" | "href",
    value: string
  ) => {
    if (!nav) return;
    const updated = [...nav.footer[column]];
    updated[index] = { ...updated[index], [field]: value };
    setNav({
      ...nav,
      footer: {
        ...nav.footer,
        [column]: updated,
      },
    });
  };

  const removeFooterLink = (column: keyof AdminNavigation["footer"], index: number) => {
    if (!nav) return;
    setNav({
      ...nav,
      footer: {
        ...nav.footer,
        [column]: nav.footer[column].filter((_, i) => i !== index),
      },
    });
  };

  if (loading || !nav) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-navy-400">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <span>Loading navigation settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Information Architecture
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            Navigation & Menus Builder
          </h1>
          <p className="text-xs text-navy-400">
            Configure primary desktop/mobile navigation, dropdown sub-menus, footer columns, and categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-navy-400" />
            View Public Site
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-navy px-5 py-2 text-xs font-bold text-white hover:bg-navy-800 transition shadow-xs disabled:opacity-50"
          >
            <Save className="h-4 w-4 text-gold" />
            {saving ? "Saving..." : "Save Navigation"}
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

      {/* Tabs */}
      <div className="flex border-b border-navy-100 bg-white rounded-2xl px-4 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("header")}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === "header"
              ? "border-navy text-navy font-bold"
              : "border-transparent text-navy-400 hover:text-navy-700"
          }`}
        >
          <Menu className="h-4 w-4 text-gold-700" />
          Header Navigation & Dropdowns ({nav.header.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("footer")}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === "footer"
              ? "border-navy text-navy font-bold"
              : "border-transparent text-navy-400 hover:text-navy-700"
          }`}
        >
          <LayoutGrid className="h-4 w-4 text-gold-700" />
          Footer Columns & Links
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === "categories"
              ? "border-navy text-navy font-bold"
              : "border-transparent text-navy-400 hover:text-navy-700"
          }`}
        >
          <Layers className="h-4 w-4 text-gold-700" />
          Property Categories Dropdown ({nav.categories?.length || 0})
        </button>
      </div>

      {/* TAB 1: HEADER NAVIGATION & DROPDOWNS */}
      {activeTab === "header" && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-xs">
            <div>
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
                Primary Top Navigation Items
              </h3>
              <p className="text-[11px] text-navy-400">
                Create direct single links or multi-level dropdown menus. Changes apply immediately to the website header.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleLoadStandardHierarchy}
                className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition"
                title="Restore default navigation structure with About & Projects dropdowns"
              >
                <RotateCcw className="h-3.5 w-3.5 text-navy-500" />
                Reset Standard Hierarchy
              </button>
              <button
                type="button"
                onClick={() => addHeaderLink(false)}
                className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-navy-800 transition"
              >
                <Link2 className="h-3.5 w-3.5 text-navy-500" />
                + Add Direct Link
              </button>
              <button
                type="button"
                onClick={() => addHeaderLink(true)}
                className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-1.5 text-xs font-bold text-white hover:bg-navy-800 transition shadow-xs"
              >
                <FolderTree className="h-3.5 w-3.5 text-gold" />
                + Add Dropdown Menu
              </button>
            </div>
          </div>

          {/* Live Mockup Preview Bar */}
          <div className="rounded-2xl border border-navy-800 bg-navy-950 p-4 shadow-md text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                Live Navbar Mockup Preview
              </span>
              <span className="text-[10px] text-navy-400 font-mono">
                {nav.header.length} top-level items
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {nav.header.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 border transition ${
                    item.isDropdown || (item.children && item.children.length > 0)
                      ? "bg-gold/15 text-gold-300 border-gold/40 font-bold"
                      : "bg-white/5 text-cream border-white/10 font-medium"
                  }`}
                >
                  <span>{item.label || "Untitled"}</span>
                  {(item.isDropdown || (item.children && item.children.length > 0)) && (
                    <ChevronDown className="h-3 w-3 text-gold" />
                  )}
                  {(item.isDropdown || (item.children && item.children.length > 0)) && (
                    <span className="ml-1 rounded-full bg-gold/20 px-1.5 py-0.2 text-[9px] text-gold font-mono">
                      {item.children?.length || 0}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Items List */}
          <div className="space-y-4">
            {nav.header.map((item, parentIdx) => {
              const isDropdown =
                item.isDropdown || (item.children && item.children.length > 0);

              return (
                <div
                  key={parentIdx}
                  className={`rounded-2xl border bg-white p-5 shadow-xs transition ${
                    isDropdown
                      ? "border-gold/40 shadow-[0_2px_12px_rgba(201,169,110,0.08)] ring-1 ring-gold/20"
                      : "border-navy-100"
                  }`}
                >
                  {/* Top Bar for Item */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-50 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-navy-50 text-[11px] font-bold text-navy-700">
                        {parentIdx + 1}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isDropdown
                            ? "bg-gold/20 text-gold-800 border border-gold/30"
                            : "bg-slate-100 text-navy-600 border border-navy-100"
                        }`}
                      >
                        {isDropdown ? (
                          <>
                            <FolderTree className="h-3 w-3 text-gold-700" />
                            Dropdown Menu ({item.children?.length || 0} sub-items)
                          </>
                        ) : (
                          <>
                            <Link2 className="h-3 w-3 text-navy-500" />
                            Direct Link
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle Link vs Dropdown */}
                      <button
                        type="button"
                        onClick={() => toggleItemType(parentIdx)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition border ${
                          isDropdown
                            ? "border-navy-200 text-navy-600 hover:bg-navy-50"
                            : "border-gold/50 bg-gold/10 text-gold-800 hover:bg-gold/20"
                        }`}
                        title="Switch between single link and dropdown menu with children"
                      >
                        {isDropdown ? "Convert to Single Link" : "Convert to Dropdown Menu"}
                      </button>

                      {/* Reorder Up/Down */}
                      <div className="flex items-center border border-navy-100 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          type="button"
                          onClick={() => moveHeaderLink(parentIdx, "up")}
                          disabled={parentIdx === 0}
                          className="p-1.5 text-navy-400 hover:text-navy hover:bg-white disabled:opacity-20 transition"
                          title="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveHeaderLink(parentIdx, "down")}
                          disabled={parentIdx === nav.header.length - 1}
                          className="p-1.5 text-navy-400 hover:text-navy hover:bg-white disabled:opacity-20 transition"
                          title="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              `Delete '${item.label || "Untitled"}' ${
                                isDropdown ? "and all its dropdown items" : ""
                              }?`
                            )
                          ) {
                            removeHeaderLink(parentIdx);
                          }
                        }}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                        title="Delete this navigation item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Primary Item Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-navy-700 mb-1">
                        Menu Display Label
                      </label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateHeaderLink(parentIdx, "label", e.target.value)}
                        placeholder="e.g. Projects, About, Services"
                        className="w-full rounded-xl border border-navy-200 bg-slate-50/50 px-3.5 py-2 text-xs font-bold text-navy focus:bg-white focus:border-gold focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-700 mb-1">
                        {isDropdown ? "Parent URL / Fallback (e.g. # or /projects)" : "Destination URL"}
                      </label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => updateHeaderLink(parentIdx, "href", e.target.value)}
                        placeholder={isDropdown ? "#" : "/about"}
                        className="w-full rounded-xl border border-navy-200 bg-slate-50/50 px-3.5 py-2 text-xs font-mono text-navy focus:bg-white focus:border-gold focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Dropdown Children Section */}
                  {isDropdown && (
                    <div className="mt-5 rounded-xl border border-gold/30 bg-gold/[0.03] p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-gold/20 pb-2.5">
                        <div className="flex items-center gap-2">
                          <FolderTree className="h-4 w-4 text-gold-700" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-navy-800">
                            Dropdown Sub-Items
                          </h4>
                          <span className="text-[11px] text-navy-500">
                            (Revealed when user hovers or taps this menu)
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => addDropdownChild(parentIdx)}
                          className="flex items-center gap-1.5 rounded-lg bg-gold/20 hover:bg-gold/30 text-gold-900 border border-gold/40 px-3 py-1 text-xs font-bold transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Sub-Item
                        </button>
                      </div>

                      {/* Children List */}
                      {(!item.children || item.children.length === 0) ? (
                        <div className="py-6 text-center text-xs text-navy-400">
                          No dropdown sub-items added yet. Click &quot;Add Sub-Item&quot; above to add links under this menu.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {item.children.map((child, childIdx) => (
                            <div
                              key={childIdx}
                              className="flex items-start gap-2.5 rounded-xl border border-navy-100 bg-white p-3 shadow-xs hover:border-gold/40 transition"
                            >
                              <div className="flex flex-col gap-0.5 pt-1 text-navy-400">
                                <button
                                  type="button"
                                  onClick={() => moveDropdownChild(parentIdx, childIdx, "up")}
                                  disabled={childIdx === 0}
                                  className="hover:text-navy disabled:opacity-20 transition"
                                  title="Move sub-item up"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveDropdownChild(parentIdx, childIdx, "down")}
                                  disabled={childIdx === item.children!.length - 1}
                                  className="hover:text-navy disabled:opacity-20 transition"
                                  title="Move sub-item down"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                              </div>

                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                <div>
                                  <label className="block text-[10px] font-medium text-navy-500 mb-0.5">
                                    Sub-Item Label
                                  </label>
                                  <input
                                    type="text"
                                    value={child.label}
                                    onChange={(e) =>
                                      updateDropdownChild(
                                        parentIdx,
                                        childIdx,
                                        "label",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g. Maple Leaf Garden City"
                                    className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs font-semibold text-navy focus:border-gold focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-medium text-navy-500 mb-0.5">
                                    Sub-Item Destination URL
                                  </label>
                                  <input
                                    type="text"
                                    value={child.href}
                                    onChange={(e) =>
                                      updateDropdownChild(
                                        parentIdx,
                                        childIdx,
                                        "href",
                                        e.target.value
                                      )
                                    }
                                    placeholder="/projects/maple-leaf-garden-city"
                                    className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs font-mono text-navy focus:border-gold focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-medium text-navy-500 mb-0.5">
                                    Brief Description (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={child.description || ""}
                                    onChange={(e) =>
                                      updateDropdownChild(
                                        parentIdx,
                                        childIdx,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g. Flagship Purbachal Sector 17"
                                    className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs text-navy-600 focus:border-gold focus:outline-none"
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeDropdownChild(parentIdx, childIdx)}
                                className="mt-1 rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                                title="Remove sub-item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FOOTER COLUMNS */}
      {activeTab === "footer" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(
            [
              { key: "company", label: "Company" },
              { key: "services", label: "Services & Developments" },
              { key: "support", label: "Support & Contact" },
              { key: "legal", label: "Legal & Regulatory" },
            ] as const
          ).map(({ key, label }) => (
            <div
              key={key}
              className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-navy-100 pb-2.5">
                <h4 className="text-xs font-bold text-navy uppercase tracking-wider">{label}</h4>
                <button
                  type="button"
                  onClick={() => addFooterLink(key)}
                  className="flex items-center gap-1 text-[11px] font-bold text-gold-800 hover:underline"
                >
                  <Plus className="h-3 w-3" /> Add Link
                </button>
              </div>

              <div className="space-y-2">
                {nav.footer[key]?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl bg-slate-50/50 p-2 border border-navy-100"
                  >
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateFooterLink(key, idx, "label", e.target.value)}
                      placeholder="Label"
                      className="w-1/2 rounded-lg border border-navy-200 bg-white px-2 py-1 text-xs text-navy font-semibold focus:border-gold focus:outline-none"
                    />
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => updateFooterLink(key, idx, "href", e.target.value)}
                      placeholder="URL"
                      className="w-1/2 rounded-lg border border-navy-200 bg-white px-2 py-1 text-xs font-mono text-navy focus:border-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeFooterLink(key, idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Remove link"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PROPERTY CATEGORIES */}
      {activeTab === "categories" && (
        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
                Property Categories Dropdown
              </h3>
              <p className="text-[11px] text-navy-400">
                Categories highlighted across property filter dropdowns and search menus. Remember to click Save Navigation after editing.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/categories"
                className="flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-1.5 text-[11px] font-bold text-navy hover:bg-gold/20 transition"
              >
                <FolderTree className="h-3.5 w-3.5 text-gold-700" /> Universal Category Manager
              </Link>
              <button
                type="button"
                onClick={() => {
                  const list = [...(nav.categories || [])];
                  list.push({
                    label: "New Category",
                    href: "/properties?type=New%20Category",
                    description: "Category description",
                  });
                  setNav({ ...nav, categories: list });
                }}
                className="flex items-center gap-1 rounded-xl bg-navy px-3 py-1.5 text-[11px] font-semibold text-gold hover:bg-navy-800 transition"
              >
                <Plus className="h-3.5 w-3.5" /> Add Category Link
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nav.categories?.map((cat, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-navy-100 bg-slate-50/50 p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold-700">
                    Category #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const list = [...(nav.categories || [])];
                        [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
                        setNav({ ...nav, categories: list });
                      }}
                      className="rounded p-1 text-navy-400 hover:bg-white hover:text-navy disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (nav.categories?.length || 0) - 1}
                      onClick={() => {
                        const list = [...(nav.categories || [])];
                        [list[idx + 1], list[idx]] = [list[idx], list[idx + 1]];
                        setNav({ ...nav, categories: list });
                      }}
                      className="rounded p-1 text-navy-400 hover:bg-white hover:text-navy disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const list = (nav.categories || []).filter((_, i) => i !== idx);
                        setNav({ ...nav, categories: list });
                      }}
                      className="rounded p-1 text-rose-500 hover:bg-rose-50"
                      title="Remove Category"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-navy-500 block mb-0.5">
                      Category Label
                    </label>
                    <input
                      type="text"
                      value={cat.label}
                      onChange={(e) => {
                        const list = [...(nav.categories || [])];
                        list[idx] = { ...list[idx], label: e.target.value };
                        setNav({ ...nav, categories: list });
                      }}
                      className="w-full rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 font-semibold text-navy focus:border-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-navy-500 block mb-0.5">
                      Target URL / Filter Link
                    </label>
                    <input
                      type="text"
                      value={cat.href}
                      onChange={(e) => {
                        const list = [...(nav.categories || [])];
                        list[idx] = { ...list[idx], href: e.target.value };
                        setNav({ ...nav, categories: list });
                      }}
                      className="w-full rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 font-mono text-[11px] text-gold-700 focus:border-gold outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-navy-500 block mb-0.5">
                    Subtitle / Description
                  </label>
                  <input
                    type="text"
                    value={cat.description || ""}
                    onChange={(e) => {
                      const list = [...(nav.categories || [])];
                      list[idx] = { ...list[idx], description: e.target.value };
                      setNav({ ...nav, categories: list });
                    }}
                    className="w-full rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-xs text-navy-600 focus:border-gold outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
