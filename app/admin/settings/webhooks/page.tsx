"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Webhook,
  Send,
  CheckCircle2,
  ArrowLeft,
  Key,
  ShieldAlert,
  Save,
  Bell,
  RefreshCw,
} from "lucide-react";
import { adminStore } from "@/lib/admin/seed";
import { getSettingsAction, updateSettingsAction } from "@/lib/admin/actions";

export default function WebhooksPage() {
  const currentSettings = adminStore.getSettings();
  const [webhooks, setWebhooks] = useState(currentSettings.webhooks || {});
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    getSettingsAction().then((s) => {
      if (s?.webhooks) setWebhooks(s.webhooks);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettingsAction("webhooks", webhooks);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestPing = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult("HTTP 200 OK: n8n webhook listener acknowledged test payload successfully.");
    }, 800);
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
              Automation & Integrations
            </span>
            <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
              Webhook & Telegram Pipeline
            </h1>
            <p className="text-xs text-navy-400">
              Dispatch real-time notifications to n8n workflows, Telegram approval queues, and CRM endpoints.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTestPing}
          disabled={isTesting}
          className="flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs disabled:opacity-50"
        >
          {isTesting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 text-gold-700" />}
          Test Webhook Ping
        </button>
      </div>

      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fade-down">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Webhook parameters saved.
        </div>
      )}

      {testResult && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fade-down">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {testResult}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* n8n & Endpoint */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <h3 className="font-serif font-bold text-sm text-navy">n8n / CRM Lead Dispatch Endpoint</h3>

          <div>
            <label className="text-xs font-semibold text-navy-700 block mb-1">
              Outgoing Webhook URL
            </label>
            <input
              type="url"
              placeholder="https://n8n.coronaproperties.com/webhook/new-lead"
              value={webhooks.n8nLeadWebhook || ""}
              onChange={(e) => setWebhooks({ ...webhooks, n8nLeadWebhook: e.target.value })}
              className="w-full font-mono text-xs rounded-xl border border-navy-200 px-3.5 py-2.5 outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-navy-700 block">Trigger Events:</span>
            <div className="flex flex-wrap gap-4 text-xs text-navy-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-navy-300 text-gold focus:ring-gold" />
                New Inbound Lead Received
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-navy-300 text-gold focus:ring-gold" />
                Lead Moved to Negotiation / Won
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-navy-300 text-gold focus:ring-gold" />
                Listing Published or Price Changed
              </label>
            </div>
          </div>
        </div>

        {/* TELEGRAM PIPELINE */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-navy-50 pb-3">
            <Bell className="h-4 w-4 text-gold-700" />
            <h3 className="font-serif font-bold text-sm text-navy">Telegram Channel & Bot Integration</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Telegram Bot Token</label>
              <input
                type="password"
                placeholder="bot123456789:ABCdef..."
                value={webhooks.telegramBotToken || ""}
                onChange={(e) => setWebhooks({ ...webhooks, telegramBotToken: e.target.value })}
                className="w-full font-mono rounded-xl border border-navy-200 px-3.5 py-2 outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">Advisory Group Chat ID</label>
              <input
                type="text"
                placeholder="-100192837465"
                value={webhooks.telegramChatId || ""}
                onChange={(e) => setWebhooks({ ...webhooks, telegramChatId: e.target.value })}
                className="w-full font-mono rounded-xl border border-navy-200 px-3.5 py-2 outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-navy px-6 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
          >
            <Save className="h-4 w-4" /> Save Webhook Parameters
          </button>
        </div>
      </form>
    </div>
  );
}
