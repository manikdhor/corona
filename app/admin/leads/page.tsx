"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Kanban,
  Trash2,
  Edit,
  Phone,
  Mail,
  UserCheck,
  AlertCircle,
  Sparkles,
  Calendar,
} from "lucide-react";
import DataTable, { ColumnDef } from "@/components/admin/table/DataTable";
import LeadDrawer from "@/components/admin/leads/LeadDrawer";
import { AdminLead } from "@/lib/admin/seed";
import {
  getLeadsAction,
  getStagesAction,
  getAgentsAction,
  deleteLeadAction,
  saveLeadAction,
  updateLeadStageAction,
} from "@/lib/admin/actions";

export default function LeadsTablePage() {
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [leadsData, stagesData, agentsData] = await Promise.all([
        getLeadsAction(),
        getStagesAction(),
        getAgentsAction(),
      ]);
      setLeads(leadsData);
      setStages(stagesData);
      setAgents(agentsData);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // Filter drawer states
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");

  // New Lead Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadBudget, setNewLeadBudget] = useState("BDT 1 Crore");
  const [newLeadMessage, setNewLeadMessage] = useState("");
  const [newLeadProperty, setNewLeadProperty] = useState("Maple Leaf Garden City");
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  // Check duplicate as user types phone or email
  const handlePhoneEmailChange = (phone: string, email: string) => {
    const isDup = leads.some(
      (l) =>
        (phone && l.phone.replace(/[^0-9]/g, "") === phone.replace(/[^0-9]/g, "")) ||
        (email && l.email.toLowerCase() === email.toLowerCase())
    );
    setDuplicateWarning(isDup);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone || !newLeadEmail) return;

    const res = await saveLeadAction({
      name: newLeadName,
      email: newLeadEmail,
      phone: newLeadPhone,
      source: "Manual Intake (Admin)",
      propertyTitle: newLeadProperty,
      stageId: "stage-1",
      budget: newLeadBudget,
      priority: "High",
      score: duplicateWarning ? 40 : 80,
      message: newLeadMessage,
      tags: duplicateWarning ? ["Duplicate Flag"] : ["Manual Intake"],
    });

    if (res.success) {
      await loadData();
      setShowAddModal(false);
      setNewLeadName("");
      setNewLeadEmail("");
      setNewLeadPhone("");
      setNewLeadMessage("");
      setDuplicateWarning(false);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    await Promise.all(ids.map((id) => deleteLeadAction(id)));
    await loadData();
  };

  const handleBulkStatusChange = async (ids: string[], newStageName: string) => {
    const stage = stages.find((s) => s.name === newStageName);
    if (stage) {
      await Promise.all(ids.map((id) => updateLeadStageAction(id, stage.id, "Admin")));
      await loadData();
    }
  };

  const filteredData = leads.filter((l) => {
    if (selectedStage !== "All" && l.stageId !== selectedStage) return false;
    if (selectedPriority !== "All" && l.priority !== selectedPriority) return false;
    return true;
  });

  const columns: ColumnDef<AdminLead>[] = [
    {
      id: "score",
      header: "Score",
      width: "80px",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-full ${
            row.score >= 80
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : row.score >= 60
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-navy-50 text-navy-600"
          }`}
        >
          <Sparkles className="h-3 w-3" /> {row.score}
        </span>
      ),
    },
    {
      id: "name",
      header: "Lead Prospect",
      cell: (row) => (
        <div
          onClick={() => setSelectedLeadId(row.id)}
          className="cursor-pointer space-y-0.5 hover:text-gold-700 transition"
        >
          <p className="font-bold text-navy text-xs">{row.name}</p>
          <p className="text-[11px] text-navy-400 font-mono">{row.source}</p>
        </div>
      ),
    },
    {
      id: "phone",
      header: "Contact Info",
      cell: (row) => (
        <div className="space-y-0.5">
          <a
            href={`tel:${row.phone}`}
            className="flex items-center gap-1.5 text-xs text-navy-800 font-semibold hover:text-gold-700"
          >
            <Phone className="h-3 w-3 text-gold-700" /> {row.phone}
          </a>
          <span className="flex items-center gap-1.5 text-[11px] text-navy-400 truncate max-w-[180px]">
            <Mail className="h-3 w-3" /> {row.email}
          </span>
        </div>
      ),
    },
    {
      id: "propertyTitle",
      header: "Target Property & Budget",
      cell: (row) => (
        <div>
          <p className="font-semibold text-xs text-navy-800 truncate max-w-[200px]">
            {row.propertyTitle || "Maple Leaf Garden City"}
          </p>
          <p className="text-[11px] font-bold text-gold-700">{row.budget}</p>
        </div>
      ),
    },
    {
      id: "stageId",
      header: "Pipeline Stage",
      cell: (row) => {
        const st = stages.find((s) => s.id === row.stageId);
        return (
          <span
            className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-xs"
            style={{ backgroundColor: st?.color || "#c9a96e" }}
          >
            {st?.name || "New"}
          </span>
        );
      },
    },
    {
      id: "priority",
      header: "Priority",
      cell: (row) => (
        <span
          className={`font-bold text-xs px-2 py-0.5 rounded-md ${
            row.priority === "Urgent"
              ? "bg-red-50 text-red-600 border border-red-200"
              : row.priority === "High"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-navy-50 text-navy-600"
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      id: "assignedAgentId",
      header: "Advisor",
      cell: (row) => {
        const ag = agents.find((a) => a.id === row.assignedAgentId);
        return (
          <span className="text-xs text-navy-700 font-medium">
            {ag?.name || "Unassigned"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      width: "90px",
      sortable: false,
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedLeadId(row.id)}
            className="p-1.5 rounded-lg text-navy-600 hover:bg-navy-50 hover:text-gold-700 transition"
            title="Inspect Lead"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={async () => {
              if (confirm(`Delete lead record for '${row.name}'?`)) {
                await deleteLeadAction(row.id);
                await loadData();
              }
            }}
            className="p-1.5 rounded-lg text-navy-400 hover:bg-red-50 hover:text-red-600 transition"
            title="Delete Lead"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Buyer Leads & Consultations"
        subtitle={`Unified multi-channel intake across Website, WhatsApp, and Visits (${leads.length} leads)`}
        columns={columns}
        data={filteredData}
        searchPlaceholder="Search leads by name, phone, or email..."
        searchFields={["name", "phone", "email", "propertyTitle", "message"]}
        entityName="leads"
        statusOptions={stages.map((s) => s.name)}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        actionsSlot={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/leads/kanban"
              className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
            >
              <Kanban className="h-4 w-4 text-gold-700" /> Kanban View
            </Link>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
            >
              <Plus className="h-4 w-4" /> Intake Lead
            </button>
          </div>
        }
        filterDrawerContent={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-navy-700 block mb-1">
                Pipeline Stage
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs outline-none focus:border-gold"
              >
                <option value="All">All Stages</option>
                {stages.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-700 block mb-1">
                Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs outline-none focus:border-gold"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        }
      />

      {/* LEAD INSPECTION DRAWER */}
      {selectedLeadId && (
        <LeadDrawer
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onUpdate={() => loadData()}
        />
      )}

      {/* NEW LEAD MODAL WITH DUPLICATE DETECTION */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <h3 className="text-lg font-serif font-bold text-navy">Intake New Buyer Lead</h3>
            <p className="text-xs text-navy-400 mt-0.5">
              Enter buyer details. Automated phone and email duplicate check runs live.
            </p>

            <form onSubmit={handleCreateLead} className="mt-4 space-y-3.5 text-xs">
              {duplicateWarning && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>
                    <strong>Duplicate Warning:</strong> A lead with this phone or email already exists in the system.
                  </span>
                </div>
              )}

              <div>
                <label className="font-semibold text-navy-700 block mb-1">Prospect Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Mahmudul Hasan"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-navy-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+880 1700 000000"
                    value={newLeadPhone}
                    onChange={(e) => {
                      setNewLeadPhone(e.target.value);
                      handlePhoneEmailChange(e.target.value, newLeadEmail);
                    }}
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-navy-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="buyer@domain.com"
                    value={newLeadEmail}
                    onChange={(e) => {
                      setNewLeadEmail(e.target.value);
                      handlePhoneEmailChange(newLeadPhone, e.target.value);
                    }}
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-navy-700 block mb-1">Target Property</label>
                  <input
                    type="text"
                    value={newLeadProperty}
                    onChange={(e) => setNewLeadProperty(e.target.value)}
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-navy-700 block mb-1">Budget Allocation</label>
                  <input
                    type="text"
                    value={newLeadBudget}
                    onChange={(e) => setNewLeadBudget(e.target.value)}
                    className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold font-bold text-gold-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-navy-700 block mb-1">Inquiry Notes / Specifics</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Inquired about Lakefront 10 Katha plot with private road access..."
                  value={newLeadMessage}
                  onChange={(e) => setNewLeadMessage(e.target.value)}
                  className="w-full rounded-xl border border-navy-200 p-2.5 outline-none focus:border-gold"
                />
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
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
