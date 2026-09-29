"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Save,
  CheckCircle2,
  Sliders,
  Webhook,
  Database,
  Download,
  MapPin,
  Palette,
  Layers,
} from "lucide-react";
import { adminStore } from "@/lib/admin/seed";
import ImageInput from "@/components/admin/media/ImageInput";
import { updateSettingsAction } from "@/lib/admin/actions";

export default function SettingsPage() {
  const currentSettings = adminStore.getSettings();
  const [branding, setBranding] = useState(currentSettings.branding || {});
  const [mapConfig, setMapConfig] = useState(currentSettings.mapConfig || {});
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettingsAction("branding", branding);
    await updateSettingsAction("mapConfig", mapConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      properties: adminStore.getProperties(),
      leads: adminStore.getLeads(),
      stages: adminStore.getStages(),
      socialLinks: adminStore.getSocialLinks(),
      settings: adminStore.getSettings(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `corona_properties_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            System & Brand Configuration
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            White-Label & System Settings
          </h1>
          <p className="text-xs text-navy-400">
            Configure luxury brand assets, public map parameters, webhooks, and dynamic attributes without code redeployment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/settings/custom-fields"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
          >
            <Sliders className="h-4 w-4 text-gold-700" /> Custom Fields Builder
          </Link>
          <Link
            href="/admin/settings/webhooks"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
          >
            <Webhook className="h-4 w-4 text-gold-700" /> Webhook & n8n
          </Link>
        </div>
      </div>

      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fade-down">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Settings successfully saved and published.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* BRAND IDENTITY */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-navy-50 pb-3">
            <Palette className="h-4 w-4 text-gold-700" />
            <h3 className="font-serif font-bold text-sm text-navy">Corporate Brand Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Company Legal Name</label>
              <input
                type="text"
                value={branding.companyName || ""}
                onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">Short Brand Name</label>
              <input
                type="text"
                value={branding.shortName || ""}
                onChange={(e) => setBranding({ ...branding, shortName: e.target.value })}
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">English Brand Tagline</label>
              <input
                type="text"
                value={branding.tagline || ""}
                onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">বাংলা ব্র্যান্ড ট্যাগলাইন</label>
              <input
                type="text"
                value={branding.taglineBn || ""}
                onChange={(e) => setBranding({ ...branding, taglineBn: e.target.value })}
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">Helpline Phone</label>
              <input
                type="text"
                value={branding.phone || ""}
                onChange={(e) => setBranding({ ...branding, phone: e.target.value })}
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">Concierge Email</label>
              <input
                type="email"
                value={branding.email || ""}
                onChange={(e) => setBranding({ ...branding, email: e.target.value })}
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="font-semibold text-xs text-navy-700 block mb-1">Headquarters Physical Address</label>
            <input
              type="text"
              value={branding.address || ""}
              onChange={(e) => setBranding({ ...branding, address: e.target.value })}
              className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
            />
          </div>
        </div>

        {/* MAP & GEOGRAPHY CONFIG */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-navy-50 pb-3">
            <MapPin className="h-4 w-4 text-gold-700" />
            <h3 className="font-serif font-bold text-sm text-navy">Public Map & Spatial Settings</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Default Map Center Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={mapConfig.defaultLat || 23.86489}
                onChange={(e) => setMapConfig({ ...mapConfig, defaultLat: Number(e.target.value) })}
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">Default Map Center Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={mapConfig.defaultLng || 90.5647}
                onChange={(e) => setMapConfig({ ...mapConfig, defaultLng: Number(e.target.value) })}
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">Default Zoom Level</label>
              <input
                type="number"
                value={mapConfig.defaultZoom || 14}
                onChange={(e) => setMapConfig({ ...mapConfig, defaultZoom: Number(e.target.value) })}
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* DATABASE BACKUP & EXPORT */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-50 pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-gold-700" />
              <h3 className="font-serif font-bold text-sm text-navy">One-Click Database Backup</h3>
            </div>
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 rounded-xl border border-navy-200 px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition"
            >
              <Download className="h-4 w-4 text-gold-700" /> Download Complete JSON Archive
            </button>
          </div>
          <p className="text-xs text-navy-400">
            Creates an instant standalone snapshot of all properties, leads, pipeline stages, and settings for offsite disaster recovery.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-navy px-6 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
          >
            <Save className="h-4 w-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
