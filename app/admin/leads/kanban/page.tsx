"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Kanban,
  Table as TableIcon,
  Plus,
  Phone,
  Sparkles,
  DollarSign,
  Calendar,
  X,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import LeadDrawer from "@/components/admin/leads/LeadDrawer";
import { AdminLead, LeadStage } from "@/lib/admin/seed";
import { getLeadsAction, getStagesAction, updateLeadStageAction } from "@/lib/admin/actions";

export default function LeadsKanbanPage() {
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [stages, setStages] = useState<LeadStage[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [leadsData, stagesData] = await Promise.all([
        getLeadsAction(),
        getStagesAction(),
      ]);
      setLeads(leadsData);
      setStages(stagesData);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // New stage modal
  const [showAddStageModal, setShowAddStageModal] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState("#c9a96e");

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggingLeadId(leadId);
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain") || draggingLeadId;
    if (!leadId) return;

    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stageId } : l))
    );
    setDraggingLeadId(null);

    // Call server action
    await updateLeadStageAction(leadId, stageId, "Kanban Advisor");
    await loadData();
  };

  // Add custom stage
  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    const newStage: LeadStage = {
      id: `stage-${Date.now()}`,
      name: newStageName.trim(),
      slug: newStageName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      color: newStageColor,
      sortOrder: stages.length + 1,
      isSystem: false,
    };
    setStages((prev) => [...prev, newStage]);
    setNewStageName("");
    setShowAddStageModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Visual Deal Pipeline
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            Leads Kanban Board
          </h1>
          <p className="text-xs text-navy-400">
            Drag and drop prospects between stages to update deal progression and trigger automated advisory alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/leads"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
          >
            <TableIcon className="h-4 w-4 text-navy-500" /> Table View
          </Link>
          <button
            type="button"
            onClick={() => setShowAddStageModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Custom Stage
          </button>
        </div>
      </div>

      {/* KANBAN HORIZONTAL SCROLL BOARD */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start min-h-[70vh]">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stageId === stage.id);
          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className="flex w-72 shrink-0 flex-col rounded-2xl bg-slate-100/80 p-3 border border-navy-100/80 shadow-xs transition hover:border-gold/40"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <h3 className="font-bold text-xs text-navy-900 truncate">{stage.name}</h3>
                </div>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-navy font-bold text-[11px] shadow-xs">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards List in this Stage */}
              <div className="flex-1 space-y-2.5 min-h-[140px]">
                {stageLeads.length === 0 ? (
                  <div className="flex h-28 items-center justify-center rounded-xl border-2 border-dashed border-navy-200/60 text-center p-3">
                    <p className="text-[11px] text-navy-400">Drag deals here</p>
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className="group cursor-grab active:cursor-grabbing rounded-xl border border-navy-100 bg-white p-3.5 shadow-xs transition hover:shadow-md hover:border-gold/60 space-y-2 select-none"
                    >
                      {/* Card Header: Score & Priority */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            lead.priority === "Urgent"
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : lead.priority === "High"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-navy-50 text-navy-600"
                          }`}
                        >
                          {lead.priority}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-gold-700 bg-gold/10 px-2 py-0.5 rounded-full">
                          <Sparkles className="h-2.5 w-2.5" /> Score: {lead.score}
                        </span>
                      </div>

                      {/* Lead Title & Property */}
                      <div>
                        <h4 className="font-bold text-xs text-navy group-hover:text-gold-700 transition">
                          {lead.name}
                        </h4>
                        <p className="text-[11px] text-navy-500 font-medium truncate mt-0.5">
                          {lead.propertyTitle || "Maple Leaf Garden City"}
                        </p>
                      </div>

                      {/* Budget & Contact */}
                      <div className="flex items-center justify-between pt-2 border-t border-navy-50 text-[11px]">
                        <span className="font-bold text-gold-700">{lead.budget}</span>
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-navy-500 hover:text-gold-700 font-mono"
                        >
                          <Phone className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* LEAD DETAILS DRAWER */}
      {selectedLeadId && (
        <LeadDrawer
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onUpdate={() => loadData()}
        />
      )}

      {/* ADD CUSTOM STAGE MODAL */}
      {showAddStageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <h3 className="text-base font-serif font-bold text-navy">Add Pipeline Stage</h3>
            <p className="text-xs text-navy-400 mt-1">
              Add a custom deal stage to match your advisory pipeline workflow.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">
                  Stage Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Legal Deed Verification"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newStageColor}
                    onChange={(e) => setNewStageColor(e.target.value)}
                    className="h-8 w-14 rounded-lg border border-navy-200 p-0.5 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-navy-600">{newStageColor}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddStageModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-navy-600 hover:bg-navy-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddStage}
                disabled={!newStageName.trim()}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-navy text-gold hover:bg-navy-800 disabled:opacity-40"
              >
                Create Stage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
