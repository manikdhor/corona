"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sliders,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  getCustomFieldsAction,
  saveCustomFieldAction,
  deleteCustomFieldAction,
} from "@/lib/admin/actions";
import { CustomFieldDef } from "@/lib/admin/seed";

export default function CustomFieldsPage() {
  const [fields, setFields] = useState<CustomFieldDef[]>([
    { id: "f-1", name: "road_facing", label: "Road Facing Direction", type: "select", options: ["North", "South", "East", "West", "Corner Double Road"], isRequired: true },
    { id: "f-2", name: "soil_test_certified", label: "Soil Test Certified", type: "boolean", isRequired: true },
    { id: "f-3", name: "distance_to_metro", label: "Distance to Metro Rail (km)", type: "number", isRequired: false },
    { id: "f-4", name: "mutation_paper_ready", label: "Mutation Paper Ready", type: "boolean", isRequired: true },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [type, setType] = useState<"text" | "number" | "select" | "boolean">("text");
  const [optionsStr, setOptionsStr] = useState("");
  const [isRequired, setIsRequired] = useState(false);

  useEffect(() => {
    getCustomFieldsAction().then((data) => {
      if (data && data.length > 0) setFields(data);
    });
  }, []);

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const newField = {
      name: name.trim() || label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
      label: label.trim(),
      type,
      options: type === "select" ? optionsStr.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      isRequired,
    };

    const res = await saveCustomFieldAction(newField);
    if (res.success && res.field) {
      const refreshed = await getCustomFieldsAction();
      setFields(refreshed);
    }
    setShowAddModal(false);
    setName("");
    setLabel("");
    setOptionsStr("");
    setIsRequired(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this custom field? Existing values stored in properties will remain preserved in JSON.")) {
      await deleteCustomFieldAction(id);
      setFields(fields.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-navy-200 text-navy-600 hover:bg-navy-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
              Schema Extensibility
            </span>
            <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
              Dynamic Custom Fields Builder
            </h1>
            <p className="text-xs text-navy-400">
              Create arbitrary attributes for real estate properties without modifying database tables or requesting code deploys.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Dynamic Field
        </button>
      </div>

      {/* FIELDS LIST */}
      <div className="rounded-2xl bg-white shadow-xs border border-navy-100 overflow-hidden">
        <div className="border-b border-navy-100 bg-slate-50/70 px-6 py-4 flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-navy">
            Registered Property Attributes ({fields.length})
          </h3>
        </div>

        <div className="divide-y divide-navy-50">
          {fields.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-4 px-6 text-xs hover:bg-slate-50/50 transition">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-navy text-xs">{f.label}</h4>
                  <span className="rounded bg-navy-50 px-2 py-0.5 text-[10px] font-mono text-navy-600 font-bold uppercase">
                    {f.type}
                  </span>
                  {f.isRequired && (
                    <span className="rounded bg-red-50 text-red-700 px-1.5 py-0.5 text-[10px] font-bold">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-navy-400 font-mono">key: {f.name}</p>
                {f.options && f.options.length > 0 && (
                  <p className="text-[11px] text-navy-500">
                    Options: {f.options.join(", ")}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDelete(f.id)}
                className="p-1.5 rounded-lg text-navy-400 hover:bg-red-50 hover:text-red-600"
                title="Delete Field"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <h3 className="text-base font-serif font-bold text-navy">Create Dynamic Field</h3>
            <p className="text-xs text-navy-400 mt-1">
              Add a new attribute field that renders dynamically inside the Property Editor.
            </p>

            <form onSubmit={handleAddField} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-navy-700 block mb-1">Field Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gas Connection Line"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="font-semibold text-navy-700 block mb-1">Field Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold font-medium"
                >
                  <option value="text">Single Line Text</option>
                  <option value="number">Numeric / Decimal</option>
                  <option value="select">Dropdown Select</option>
                  <option value="boolean">Boolean Switch (Yes/No)</option>
                </select>
              </div>

              {type === "select" && (
                <div>
                  <label className="font-semibold text-navy-700 block mb-1">Dropdown Choices (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Option A, Option B, Option C"
                    value={optionsStr}
                    onChange={(e) => setOptionsStr(e.target.value)}
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reqCheck"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="rounded border-navy-300 text-gold focus:ring-gold"
                />
                <label htmlFor="reqCheck" className="font-semibold text-navy-700 cursor-pointer">
                  Mark as mandatory field
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2 border-t border-navy-50">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-navy-600 hover:bg-navy-50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-navy px-5 py-2 font-semibold text-gold hover:bg-navy-800 shadow-sm"
                >
                  Create Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
