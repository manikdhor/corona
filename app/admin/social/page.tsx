"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  MoveUp,
  MoveDown,
  Check,
  Share2,
  Globe,
  Sparkles,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  MessageCircle,
  Pin,
  Send,
  Github,
} from "lucide-react";
import { SocialLink } from "@/lib/admin/seed";
import IconPicker from "@/components/admin/icons/IconPicker";
import {
  getSocialLinksAction,
  saveSocialLinkAction,
  deleteSocialLinkAction,
  reorderSocialLinksAction,
} from "@/lib/admin/actions";

// Built-in 24+ platform presets with recommended icons
const SOCIAL_PRESETS = [
  { platform: "Facebook", icon: Facebook, defaultUrl: "https://facebook.com/" },
  { platform: "Instagram", icon: Instagram, defaultUrl: "https://instagram.com/" },
  { platform: "YouTube", icon: Youtube, defaultUrl: "https://youtube.com/@" },
  { platform: "TikTok", icon: Share2, defaultUrl: "https://tiktok.com/@" },
  { platform: "WhatsApp", icon: MessageCircle, defaultUrl: "https://wa.me/880" },
  { platform: "Messenger", icon: MessageCircle, defaultUrl: "https://m.me/" },
  { platform: "Twitter / X", icon: Twitter, defaultUrl: "https://x.com/" },
  { platform: "LinkedIn", icon: Linkedin, defaultUrl: "https://linkedin.com/company/" },
  { platform: "Pinterest", icon: Pin, defaultUrl: "https://pinterest.com/" },
  { platform: "Telegram", icon: Send, defaultUrl: "https://t.me/" },
  { platform: "Discord", icon: Share2, defaultUrl: "https://discord.gg/" },
  { platform: "Reddit", icon: Share2, defaultUrl: "https://reddit.com/r/" },
  { platform: "GitHub", icon: Github, defaultUrl: "https://github.com/" },
  { platform: "Google Business / Maps", icon: Globe, defaultUrl: "https://maps.google.com/?cid=" },
  { platform: "Phone", icon: Phone, defaultUrl: "tel:+880" },
  { platform: "Email", icon: Mail, defaultUrl: "mailto:info@coronaproperties.com" },
];

export default function SocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLinks = async () => {
    try {
      const data = await getSocialLinksAction();
      setLinks(data);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadLinks();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id?: string;
    platform: string;
    label: string;
    url: string;
    iconName: string;
    openNewTab: boolean;
    isActive: boolean;
  }>({
    platform: "Facebook",
    label: "Corona Properties Official",
    url: "https://facebook.com/coronapropertiesltd",
    iconName: "Facebook",
    openNewTab: true,
    isActive: true,
  });

  const handleOpenAdd = (preset?: typeof SOCIAL_PRESETS[0]) => {
    if (preset) {
      setFormData({
        platform: preset.platform,
        label: `Corona Properties on ${preset.platform}`,
        url: preset.defaultUrl,
        iconName: preset.platform.split(" ")[0],
        openNewTab: !preset.defaultUrl.startsWith("tel:") && !preset.defaultUrl.startsWith("mailto:"),
        isActive: true,
      });
    } else {
      setFormData({
        platform: "Facebook",
        label: "Official Social Page",
        url: "https://",
        iconName: "Facebook",
        openNewTab: true,
        isActive: true,
      });
    }
    setEditingLink(null);
    setShowAddModal(true);
  };

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      id: link.id,
      platform: link.platform,
      label: link.label,
      url: link.url,
      iconName: link.iconName || link.platform,
      openNewTab: link.openNewTab,
      isActive: link.isActive,
    });
    setShowAddModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSocialLinkAction(formData);
    await loadLinks();
    setShowAddModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this social link?")) {
      await deleteSocialLinkAction(id);
      await loadLinks();
    }
  };

  const handleToggleActive = async (link: SocialLink) => {
    await saveSocialLinkAction({ ...link, isActive: !link.isActive });
    await loadLinks();
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= links.length) return;

    const copy = [...links];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;

    await reorderSocialLinksAction(copy.map((l) => l.id));
    await loadLinks();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Channel Management
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            Social Media Links & Channels
          </h1>
          <p className="text-xs text-navy-400">
            Configure social presence across 24+ platforms. Changes update header, footer, and agent cards dynamically.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAdd()}
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Social Channel
        </button>
      </div>

      {/* QUICK PRESETS STRIP */}
      <div className="rounded-2xl bg-white p-4 shadow-xs border border-navy-100 space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-navy-400">
          Quick-Add Platform Presets
        </span>
        <div className="flex flex-wrap gap-2">
          {SOCIAL_PRESETS.slice(0, 10).map((preset) => (
            <button
              key={preset.platform}
              type="button"
              onClick={() => handleOpenAdd(preset)}
              className="flex items-center gap-1.5 rounded-xl border border-navy-100 bg-slate-50 px-3 py-1.5 text-xs font-medium text-navy-700 hover:border-gold hover:bg-gold/10 transition"
            >
              <preset.icon className="h-3.5 w-3.5 text-gold-700" />
              <span>{preset.platform}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE LINKS TABLE & REORDER */}
      <div className="rounded-2xl bg-white shadow-xs border border-navy-100 overflow-hidden">
        <div className="border-b border-navy-100 bg-slate-50/70 px-6 py-4 flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-navy">
            Active Social Links ({links.length})
          </h3>
          <span className="text-xs text-navy-400">Drag or use arrows to change display order</span>
        </div>

        <div className="divide-y divide-navy-50">
          {links.map((link, idx) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition"
            >
              <div className="flex items-center gap-3">
                {/* Order arrows */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                    className="p-1 rounded text-navy-400 hover:text-navy-900 disabled:opacity-20"
                    title="Move up"
                  >
                    <MoveUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === links.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    className="p-1 rounded text-navy-400 hover:text-navy-900 disabled:opacity-20"
                    title="Move down"
                  >
                    <MoveDown className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-gold font-bold shadow-xs">
                  <Share2 className="h-4 w-4" />
                </div>

                <div>
                  <h4 className="font-bold text-xs text-navy flex items-center gap-2">
                    {link.label}
                    <span className="text-[10px] text-navy-400 font-normal">({link.platform})</span>
                  </h4>
                  <a
                    href={link.url}
                    target="_blank"
                    className="text-[11px] text-gold-700 hover:underline flex items-center gap-1 font-mono truncate max-w-sm"
                  >
                    {link.url} <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleActive(link)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                    link.isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {link.isActive ? "Active" : "Hidden"}
                </button>

                <button
                  type="button"
                  onClick={() => handleEdit(link)}
                  className="p-1.5 rounded-lg text-navy-600 hover:bg-navy-50"
                  title="Edit Link"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(link.id)}
                  className="p-1.5 rounded-lg text-navy-400 hover:bg-red-50 hover:text-red-600"
                  title="Delete Link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE PUBLIC PREVIEW */}
      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-xs space-y-3">
        <h4 className="font-serif font-bold text-sm text-navy">
          Live Theme Display Preview
        </h4>
        <p className="text-xs text-navy-400">
          This preview demonstrates how the dynamic social icons render inside public footer and contact bars.
        </p>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-navy text-white">
          <span className="text-xs text-navy-300">Connect with Corona Properties:</span>
          <div className="flex items-center gap-2">
            {links
              .filter((l) => l.isActive)
              .map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target={l.openNewTab ? "_blank" : "_self"}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800 text-gold hover:bg-gold hover:text-navy transition shadow-xs"
                  title={l.label}
                >
                  <Share2 className="h-4 w-4" />
                </a>
              ))}
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <h3 className="text-base font-serif font-bold text-navy">
              {editingLink ? "Edit Social Link" : "Add Social Channel"}
            </h3>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-navy-700 block mb-1">Platform Name *</label>
                <input
                  type="text"
                  required
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="font-semibold text-navy-700 block mb-1">Display Label *</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="font-semibold text-navy-700 block mb-1">Destination URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://... or tel: or mailto:"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full font-mono rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold"
                />
              </div>

              {/* Visual Icon Picker */}
              <div>
                <IconPicker
                  label="Channel Visual Icon"
                  value={formData.iconName}
                  onChange={(iconName) => setFormData({ ...formData, iconName })}
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-navy-700">
                  <input
                    type="checkbox"
                    checked={formData.openNewTab}
                    onChange={(e) => setFormData({ ...formData, openNewTab: e.target.checked })}
                    className="rounded border-navy-300 text-gold focus:ring-gold"
                  />
                  Open in new tab
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-navy-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-navy-300 text-gold focus:ring-gold"
                  />
                  Active & visible
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
                  Save Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
