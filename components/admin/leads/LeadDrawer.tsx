"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Tag,
  ShieldAlert,
} from "lucide-react";
import { AdminLead, LeadActivity, adminStore } from "@/lib/admin/seed";
import {
  getLeadDetailsAction,
  getStagesAction,
  getAgentsAction,
  updateLeadStageAction,
  addLeadActivityAction,
  saveLeadAction,
} from "@/lib/admin/actions";

interface LeadDrawerProps {
  leadId: string | null;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function LeadDrawer({ leadId, onClose, onUpdate }: LeadDrawerProps) {
  const [lead, setLead] = useState<AdminLead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [stages, setStages] = useState(adminStore.getStages());
  const [agents, setAgents] = useState(adminStore.getAgents());

  // New activity form
  const [activityType, setActivityType] = useState<"note" | "call" | "email" | "whatsapp">("note");
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDesc, setActivityDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshLeadDetails = async (id: string) => {
    const [details, stList, agList] = await Promise.all([
      getLeadDetailsAction(id),
      getStagesAction(),
      getAgentsAction(),
    ]);
    if (details?.lead) {
      setLead(details.lead);
      setActivities(details.activities || []);
    }
    if (stList?.length) setStages(stList);
    if (agList?.length) setAgents(agList);
  };

  useEffect(() => {
    if (leadId) {
      refreshLeadDetails(leadId);
    }
  }, [leadId]);

  if (!lead) return null;

  const currentStage = stages.find((s) => s.id === lead.stageId);
  const currentAgent = agents.find((a) => a.id === lead.assignedAgentId);

  const handleStageChange = async (newStageId: string) => {
    const updated = await updateLeadStageAction(lead.id, newStageId, "Advisor");
    if (updated.success && updated.lead) {
      await refreshLeadDetails(lead.id);
      if (onUpdate) onUpdate();
    }
  };

  const handleAgentChange = async (newAgentId: string) => {
    const updated = await saveLeadAction({
      ...lead,
      assignedAgentId: newAgentId,
    });
    if (updated.success && updated.lead) {
      await refreshLeadDetails(lead.id);
      if (onUpdate) onUpdate();
    }
  };

  const handlePriorityChange = async (newPriority: any) => {
    const updated = await saveLeadAction({
      ...lead,
      priority: newPriority,
    });
    if (updated.success && updated.lead) {
      await refreshLeadDetails(lead.id);
      if (onUpdate) onUpdate();
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim()) return;

    setIsSubmitting(true);
    await addLeadActivityAction(
      lead.id,
      activityType,
      activityTitle,
      activityDesc || undefined
    );
    await refreshLeadDetails(lead.id);
    setActivityTitle("");
    setActivityDesc("");
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-2xl border-l border-navy-100 animate-slide-left">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-gold font-bold text-sm shadow-xs">
            {lead.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-navy text-base">{lead.name}</h3>
              {lead.isDuplicate && (
                <span className="flex items-center gap-1 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                  <ShieldAlert className="h-3 w-3" /> Duplicate
                </span>
              )}
            </div>
            <p className="text-xs text-navy-400">Captured via {lead.source}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-navy-400 hover:bg-navy-100 hover:text-navy-900 transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* LEAD SCORING BANNER */}
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-navy via-navy-900 to-navy-800 p-4 text-white shadow-sm">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-300 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Algorithmic Lead Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-black text-gold">{lead.score}</span>
              <span className="text-xs text-navy-300">/ 100 points</span>
            </div>
            <p className="text-[11px] text-navy-200">
              {lead.score >= 80 ? "Hot High-Intent Buyer" : lead.score >= 60 ? "Qualified Prospect" : "Standard Inquiry"}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-navy-300 block">Priority</span>
            <select
              value={lead.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="mt-1 rounded-lg bg-navy-800 text-gold font-bold text-xs px-2.5 py-1 border border-navy-700 outline-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent 🔥</option>
            </select>
          </div>
        </div>

        {/* PIPELINE STAGE SELECTOR */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-navy-700 block">
            Pipeline Stage
          </label>
          <div className="flex items-center gap-2">
            <select
              value={lead.stageId}
              onChange={(e) => handleStageChange(e.target.value)}
              className="flex-1 rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-bold text-navy outline-none focus:border-gold"
            >
              {stages.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
            <span
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
              style={{ backgroundColor: currentStage?.color || "#c9a96e" }}
            >
              {currentStage?.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* CONTACT & PROPERTY DETAILS */}
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50/70 p-4 border border-navy-100 text-xs">
          <div>
            <span className="text-navy-400 block text-[11px]">Phone Number</span>
            <a
              href={`tel:${lead.phone}`}
              className="font-bold text-navy hover:text-gold-700 flex items-center gap-1.5 mt-0.5"
            >
              <Phone className="h-3.5 w-3.5 text-gold-700" /> {lead.phone}
            </a>
          </div>

          <div>
            <span className="text-navy-400 block text-[11px]">Email Address</span>
            <a
              href={`mailto:${lead.email}`}
              className="font-medium text-navy hover:text-gold-700 flex items-center gap-1.5 mt-0.5 truncate"
            >
              <Mail className="h-3.5 w-3.5 text-gold-700" /> {lead.email}
            </a>
          </div>

          <div>
            <span className="text-navy-400 block text-[11px]">Inquired Property</span>
            <span className="font-bold text-navy block mt-0.5">{lead.propertyTitle || "Maple Leaf Garden City"}</span>
          </div>

          <div>
            <span className="text-navy-400 block text-[11px]">Target Budget</span>
            <span className="font-bold text-gold-700 block mt-0.5">{lead.budget || "BDT 50 Lakh"}</span>
          </div>
        </div>

        {/* ASSIGNED AGENT */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-navy-700 block mb-1">
            Assigned Property Advisor
          </label>
          <select
            value={lead.assignedAgentId || ""}
            onChange={(e) => handleAgentChange(e.target.value)}
            className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs outline-none focus:border-gold"
          >
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name} ({ag.role})
              </option>
            ))}
          </select>
        </div>

        {/* MESSAGE OR INQUIRY NOTE */}
        {lead.message && (
          <div className="rounded-xl border border-gold/20 bg-gold/5 p-3.5 text-xs text-navy-800">
            <span className="font-bold text-gold-900 block mb-1">Customer Inquiry Message:</span>
            <p className="italic leading-relaxed">&ldquo;{lead.message}&rdquo;</p>
          </div>
        )}

        {/* ACTIVITY TIMELINE */}
        <div className="space-y-4 pt-4 border-t border-navy-100">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-navy">Activity Timeline</h4>
            <span className="text-[11px] text-navy-400">{activities.length} entries</span>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAddActivity} className="rounded-xl border border-navy-200 p-3 bg-white space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as any)}
                className="rounded-lg border border-navy-200 bg-slate-50 px-2 py-1 text-xs outline-none font-semibold text-navy-700"
              >
                <option value="note">Internal Note</option>
                <option value="call">Call Log</option>
                <option value="email">Email Summary</option>
                <option value="whatsapp">WhatsApp Log</option>
              </select>
              <input
                type="text"
                placeholder="Title (e.g. Discussed Lakefront plots)..."
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
                className="flex-1 rounded-lg border border-navy-200 px-2.5 py-1 text-xs outline-none focus:border-gold"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Detailed activity notes..."
              value={activityDesc}
              onChange={(e) => setActivityDesc(e.target.value)}
              className="w-full rounded-lg border border-navy-200 p-2 text-xs outline-none focus:border-gold"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !activityTitle.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-gold hover:bg-navy-800 disabled:opacity-40 transition"
              >
                <Send className="h-3 w-3" /> Log Activity
              </button>
            </div>
          </form>

          {/* Timeline Feed */}
          <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-navy-100 pl-8">
            {activities.map((act) => (
              <div key={act.id} className="relative group">
                <span className="absolute -left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy text-gold text-[10px] font-bold border-2 border-white shadow-xs">
                  {act.type === "call" ? "📞" : act.type === "whatsapp" ? "💬" : act.type === "stage_change" ? "🔄" : "📝"}
                </span>
                <div className="rounded-xl border border-navy-100 bg-slate-50/70 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-navy-900">{act.title}</span>
                    <span className="text-[10px] text-navy-400 font-mono">
                      {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {act.description && (
                    <p className="text-navy-600 mt-1 leading-relaxed">{act.description}</p>
                  )}
                  <span className="text-[10px] text-navy-400 block mt-1">Logged by: {act.actorName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
