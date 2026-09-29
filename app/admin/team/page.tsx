"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  MessageSquare,
  Award,
} from "lucide-react";
import {
  getTeamMembersAction,
  saveTeamMemberAction,
  deleteTeamMemberAction,
  reorderTeamMembersAction,
  getSiteContentAction,
  updateSiteContentAction,
} from "@/lib/admin/actions";
import { AdminTeamMember } from "@/lib/admin/seed";

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState<"members" | "messages">("members");
  const [members, setMembers] = useState<AdminTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Member Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<AdminTeamMember> | null>(null);
  const [saving, setSaving] = useState(false);

  // Executive Messages State
  const [executiveMessages, setExecutiveMessages] = useState<any>(null);
  const [savingMsg, setSavingMsg] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [teamData, contentData] = await Promise.all([
      getTeamMembersAction(),
      getSiteContentAction(),
    ]);
    setMembers(teamData);
    setExecutiveMessages(contentData.executiveMessages);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- MEMBER CRUD ---
  const handleOpenAdd = () => {
    setEditingMember({
      name: "",
      role: "",
      bio: "",
      image: "/image-01.webp",
      sortOrder: members.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: AdminTeamMember) => {
    setEditingMember({ ...m });
    setIsModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setSaving(true);
    setErrorMsg("");
    const res = await saveTeamMemberAction(editingMember);
    setSaving(false);

    if (res.success && res.member) {
      setSuccessMsg("Team member saved successfully.");
      setIsModalOpen(false);
      setEditingMember(null);
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg(res.error || "Failed to save team member.");
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the leadership team?`)) return;
    const res = await deleteTeamMemberAction(id);
    if (res.success) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setSuccessMsg(`${name} removed.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= members.length) return;

    const updated = [...members];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;

    setMembers(updated);
    await reorderTeamMembersAction(updated.map((m) => m.id));
  };

  // --- EXECUTIVE MESSAGES ---
  const handleSaveExecutiveMessages = async () => {
    setSavingMsg(true);
    setErrorMsg("");
    const res = await updateSiteContentAction("executiveMessages", executiveMessages);
    setSavingMsg(false);
    if (res.success) {
      setSuccessMsg("Executive leadership messages successfully updated.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg("Failed to update executive messages.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Corporate Leadership
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            Leadership & Management Team
          </h1>
          <p className="text-xs text-navy-400">
            Manage board profiles, executive messages from the Chairman & MD, and team roster.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/team"
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-navy-400" />
            View Public Team
          </Link>
          {activeTab === "members" && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-800 transition shadow-xs"
            >
              <Plus className="h-4 w-4 text-gold" />
              Add Member
            </button>
          )}
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
          onClick={() => setActiveTab("members")}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === "members"
              ? "border-navy text-navy font-bold"
              : "border-transparent text-navy-400 hover:text-navy-700"
          }`}
        >
          <Users className="h-4 w-4 text-gold-700" />
          Leadership Team ({members.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("messages")}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === "messages"
              ? "border-navy text-navy font-bold"
              : "border-transparent text-navy-400 hover:text-navy-700"
          }`}
        >
          <MessageSquare className="h-4 w-4 text-gold-700" />
          Executive Keynote Messages (MD & Chairman)
        </button>
      </div>

      {/* TAB 1: MEMBERS ROSTER */}
      {activeTab === "members" && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xs">
            {loading ? (
              <div className="p-12 text-center text-xs text-navy-400">Loading team...</div>
            ) : members.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto h-10 w-10 text-navy-200" />
                <h3 className="mt-3 text-sm font-bold text-navy">No team members added yet</h3>
                <p className="text-xs text-navy-400 mt-1">Add your leadership and executive staff.</p>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy px-3.5 py-1.5 text-xs font-bold text-white hover:bg-navy-800 transition"
                >
                  <Plus className="h-3.5 w-3.5 text-gold" /> Add First Member
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-navy-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-navy-500">
                    <th className="py-3 px-4 w-12 text-center">Order</th>
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Designation / Role</th>
                    <th className="py-3 px-4">Biography</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {members.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMove(idx, "up")}
                            disabled={idx === 0}
                            className="text-navy-400 hover:text-navy disabled:opacity-20"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <span className="font-mono text-[10px] text-navy-500 font-bold">
                            {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMove(idx, "down")}
                            disabled={idx === members.length - 1}
                            className="text-navy-400 hover:text-navy disabled:opacity-20"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gold/30 bg-navy-100">
                            <img
                              src={m.image}
                              alt={m.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/image-01.webp";
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-navy">{m.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="rounded-md bg-gold/10 px-2 py-0.5 text-[11px] font-bold text-gold-800 border border-gold/20">
                          {m.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <p className="line-clamp-2 text-navy-500 text-[11px] leading-relaxed">
                          {m.bio}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(m)}
                            className="rounded-lg p-1.5 text-navy-600 hover:bg-navy-50 hover:text-navy transition"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(m.id, m.name)}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EXECUTIVE MESSAGES */}
      {activeTab === "messages" && executiveMessages && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveExecutiveMessages}
              disabled={savingMsg}
              className="flex items-center gap-2 rounded-xl bg-navy px-5 py-2 text-xs font-bold text-white hover:bg-navy-800 transition shadow-xs disabled:opacity-50"
            >
              <Save className="h-4 w-4 text-gold" />
              {savingMsg ? "Saving Messages..." : "Save Executive Messages"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Managing Director Message */}
            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-navy-100 pb-3">
                <Award className="h-4 w-4 text-gold-700" />
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
                  Managing Director (MD) Keynote
                </h3>
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-600 mb-1">Section Title</label>
                <input
                  type="text"
                  value={executiveMessages.mdMessage?.title || ""}
                  onChange={(e) =>
                    setExecutiveMessages({
                      ...executiveMessages,
                      mdMessage: { ...executiveMessages.mdMessage, title: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs text-navy focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-navy-600 mb-1">Executive Name</label>
                  <input
                    type="text"
                    value={executiveMessages.mdMessage?.name || ""}
                    onChange={(e) =>
                      setExecutiveMessages({
                        ...executiveMessages,
                        mdMessage: { ...executiveMessages.mdMessage, name: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs text-navy focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-600 mb-1">Official Role</label>
                  <input
                    type="text"
                    value={executiveMessages.mdMessage?.role || ""}
                    onChange={(e) =>
                      setExecutiveMessages({
                        ...executiveMessages,
                        mdMessage: { ...executiveMessages.mdMessage, role: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs text-navy focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-600 mb-1">Portrait Image URL</label>
                <input
                  type="text"
                  value={executiveMessages.mdMessage?.image || ""}
                  onChange={(e) =>
                    setExecutiveMessages({
                      ...executiveMessages,
                      mdMessage: { ...executiveMessages.mdMessage, image: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs text-navy focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-600 mb-1">Lead Highlight Quote</label>
                <textarea
                  rows={2}
                  value={executiveMessages.mdMessage?.quote || ""}
                  onChange={(e) =>
                    setExecutiveMessages({
                      ...executiveMessages,
                      mdMessage: { ...executiveMessages.mdMessage, quote: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 p-2.5 text-xs text-navy focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-600 mb-1">Full Keynote Message</label>
                <textarea
                  rows={6}
                  value={executiveMessages.mdMessage?.fullText || ""}
                  onChange={(e) =>
                    setExecutiveMessages({
                      ...executiveMessages,
                      mdMessage: { ...executiveMessages.mdMessage, fullText: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 p-2.5 text-xs text-navy focus:border-gold focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Chairman Message */}
            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-navy-100 pb-3">
                <Award className="h-4 w-4 text-gold-700" />
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
                  Chairman Keynote Message
                </h3>
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-600 mb-1">Section Title</label>
                <input
                  type="text"
                  value={executiveMessages.chairmanMessage?.title || ""}
                  onChange={(e) =>
                    setExecutiveMessages({
                      ...executiveMessages,
                      chairmanMessage: { ...executiveMessages.chairmanMessage, title: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs text-navy focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-navy-600 mb-1">Executive Name</label>
                  <input
                    type="text"
                    value={executiveMessages.chairmanMessage?.name || ""}
                    onChange={(e) =>
                      setExecutiveMessages({
                        ...executiveMessages,
                        chairmanMessage: { ...executiveMessages.chairmanMessage, name: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs text-navy focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-600 mb-1">Official Role</label>
                  <input
                    type="text"
                    value={executiveMessages.chairmanMessage?.role || ""}
                    onChange={(e) =>
                      setExecutiveMessages({
                        ...executiveMessages,
                        chairmanMessage: { ...executiveMessages.chairmanMessage, role: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs text-navy focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-600 mb-1">Portrait Image URL</label>
                <input
                  type="text"
                  value={executiveMessages.chairmanMessage?.image || ""}
                  onChange={(e) =>
                    setExecutiveMessages({
                      ...executiveMessages,
                      chairmanMessage: { ...executiveMessages.chairmanMessage, image: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs text-navy focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-600 mb-1">Lead Highlight Quote</label>
                <textarea
                  rows={2}
                  value={executiveMessages.chairmanMessage?.quote || ""}
                  onChange={(e) =>
                    setExecutiveMessages({
                      ...executiveMessages,
                      chairmanMessage: { ...executiveMessages.chairmanMessage, quote: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 p-2.5 text-xs text-navy focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-600 mb-1">Full Keynote Message</label>
                <textarea
                  rows={6}
                  value={executiveMessages.chairmanMessage?.fullText || ""}
                  onChange={(e) =>
                    setExecutiveMessages({
                      ...executiveMessages,
                      chairmanMessage: { ...executiveMessages.chairmanMessage, fullText: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 p-2.5 text-xs text-navy focus:border-gold focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEMBER MODAL */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-navy-100 animate-scale-up">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-navy">
                {editingMember.id ? "Edit Team Member" : "Add Team Member"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-navy-400 hover:text-navy text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-navy-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="e.g. Engr. Shafiqur Rahman"
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-navy-600 mb-1">Role / Designation *</label>
                <input
                  type="text"
                  required
                  value={editingMember.role || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="e.g. Head of Architecture & Planning"
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-navy-600 mb-1">Portrait Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingMember.image || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                  placeholder="/image-01.webp or image URL"
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-navy-600 mb-1">Short Biography *</label>
                <textarea
                  rows={3}
                  required
                  value={editingMember.bio || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  placeholder="Background, qualifications, and domain expertise..."
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
                  {saving ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
