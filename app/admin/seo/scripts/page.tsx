"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Edit,
  FileCode,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { CustomScript } from "@/lib/admin/seed";
import { getCustomScriptsAction, saveCustomScriptAction, deleteCustomScriptAction } from "@/lib/admin/actions";

export default function CustomScriptsPage() {
  const [scripts, setScripts] = useState<CustomScript[]>([]);
  const [loading, setLoading] = useState(true);

  const loadScripts = async () => {
    try {
      const data = await getCustomScriptsAction();
      setScripts(data);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadScripts();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingScript, setEditingScript] = useState<CustomScript | null>(null);

  const [name, setName] = useState("");
  const [placement, setPlacement] = useState<"head" | "body_end">("head");
  const [code, setCode] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingScript(null);
    setName("");
    setPlacement("head");
    setCode("");
    setIsActive(true);
    setShowAddModal(true);
  };

  const handleEdit = (s: CustomScript) => {
    setEditingScript(s);
    setName(s.name);
    setPlacement(s.placement);
    setCode(s.code);
    setIsActive(s.isActive);
    setShowAddModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    await saveCustomScriptAction({
      id: editingScript?.id,
      name,
      placement,
      code,
      isActive,
    });

    await loadScripts();
    setShowAddModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this custom script?")) {
      await deleteCustomScriptAction(id);
      await loadScripts();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/seo"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-navy-200 text-navy-600 hover:bg-navy-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
              Developer Controls & Analytics
            </span>
            <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
              Global Custom Scripts & Pixels
            </h1>
            <p className="text-xs text-navy-400">
              Inject Google Tag Manager, Facebook Pixel, Hotjar, or live chat widgets into &lt;head&gt; or before &lt;/body&gt;.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Custom Script
        </button>
      </div>

      {/* SECURITY NOTICE */}
      <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-gold-700 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-navy-600">
          <strong>Super Admin Trusted Access:</strong> Script injection allows raw HTML and JavaScript to execute across all public visitor pages. All script updates are permanently tracked in the Audit Log with author IP and timestamps.
        </div>
      </div>

      {/* SCRIPTS LIST */}
      <div className="rounded-2xl bg-white shadow-xs border border-navy-100 overflow-hidden">
        <div className="border-b border-navy-100 bg-slate-50/70 px-6 py-4 flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-navy">
            Configured Scripts ({scripts.length})
          </h3>
        </div>

        <div className="divide-y divide-navy-50">
          {scripts.map((s) => (
            <div key={s.id} className="p-6 space-y-3 hover:bg-slate-50/40 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-gold">
                    <FileCode className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-navy">{s.name}</h4>
                    <p className="text-[11px] text-navy-400">
                      Placement: <code className="font-mono text-navy-700">{s.placement === "head" ? "<head>" : "before </body>"}</code> &bull; Added by: {s.createdBy}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      s.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {s.isActive ? "Injecting Live" : "Disabled"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEdit(s)}
                    className="p-1.5 rounded-lg text-navy-600 hover:bg-navy-50"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-lg text-navy-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Code Preview snippet */}
              <div className="rounded-xl border border-navy-100 bg-slate-900 p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-32">
                <pre>{s.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <h3 className="text-base font-serif font-bold text-navy">
              {editingScript ? "Edit Custom Script" : "Add Custom Script"}
            </h3>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-navy-700 block mb-1">Script Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Analytics 4 (GA4)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="font-semibold text-navy-700 block mb-1">Injection Placement</label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value as any)}
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold font-medium"
                >
                  <option value="head">&lt;head&gt; (Analytics, GTM, Meta Pixels, Fonts)</option>
                  <option value="body_end">Before &lt;/body&gt; (Chat widgets, defer scripts)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-navy-700 block mb-1">Raw Script Code *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="<!-- Embed Code Here -->\n<script>...</script>"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full font-mono text-[11px] rounded-xl border border-navy-200 p-3 outline-none focus:border-gold bg-slate-50"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeScript"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-navy-300 text-gold focus:ring-gold"
                />
                <label htmlFor="activeScript" className="font-semibold text-navy-700 cursor-pointer">
                  Activate script immediately across public site
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
                  Save Script
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
