"use client";

import React, { useState } from "react";
import {
  Clock,
  Search,
  Filter,
  Eye,
  FileCode,
  X,
  User,
  ArrowRight,
  Shield,
} from "lucide-react";
import { adminStore, AuditLogItem } from "@/lib/admin/seed";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>(adminStore.getAuditLogs());
  const [search, setSearch] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("All");
  const [viewingLog, setViewingLog] = useState<AuditLogItem | null>(null);

  const filtered = logs.filter((log) => {
    if (selectedEntity !== "All" && log.entityType !== selectedEntity) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.actorEmail.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        (log.entityId && log.entityId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
          Security & Accountability
        </span>
        <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
          System Audit Trail & Change Logs
        </h1>
        <p className="text-xs text-navy-400">
          Immutable change history capturing every administrative mutation, old-to-new JSON diffs, author IP, and timestamps.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-3 shadow-xs border border-navy-100">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy-400" />
            <input
              type="text"
              placeholder="Search by actor, action, or entity ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-navy-200 pl-9 pr-4 py-2 text-xs focus:border-gold outline-none"
            />
          </div>

          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="rounded-xl border border-navy-200 bg-slate-50 px-3 py-2 text-xs font-medium text-navy-700 outline-none"
          >
            <option value="All">All Entities</option>
            <option value="property">Property</option>
            <option value="lead">Lead</option>
            <option value="media">Media</option>
            <option value="redirect">Redirect</option>
            <option value="settings">Settings</option>
          </select>
        </div>

        <span className="text-xs text-navy-400 font-medium">
          {filtered.length} audit events logged
        </span>
      </div>

      {/* LOGS TABLE */}
      <div className="rounded-2xl bg-white shadow-xs border border-navy-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 border-b border-navy-100 text-navy-600">
              <tr>
                <th className="py-3 px-4 font-bold uppercase">Timestamp</th>
                <th className="py-3 px-4 font-bold uppercase">Actor</th>
                <th className="py-3 px-4 font-bold uppercase">Action</th>
                <th className="py-3 px-4 font-bold uppercase">Entity</th>
                <th className="py-3 px-4 font-bold uppercase">Target ID</th>
                <th className="py-3 px-4 font-bold uppercase text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50 text-navy-800">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-mono text-[11px] text-navy-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-medium">
                      <User className="h-3.5 w-3.5 text-navy-400" />
                      <span className="truncate max-w-[180px]">{log.actorEmail}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        log.action.includes("CREATE")
                          ? "bg-emerald-50 text-emerald-700"
                          : log.action.includes("DELETE")
                          ? "bg-red-50 text-red-700"
                          : log.action.includes("STAGE")
                          ? "bg-purple-50 text-purple-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold uppercase text-[10px] text-navy-500">
                    {log.entityType}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-navy-600">
                    {log.entityId || "—"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setViewingLog(log)}
                      className="flex items-center gap-1 text-gold-700 font-semibold hover:underline ml-auto"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Diff
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON DIFF INSPECTION MODAL */}
      {viewingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="flex h-[75vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl border border-navy-100 overflow-hidden">
            <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4 bg-slate-50/70">
              <div>
                <h3 className="font-serif font-bold text-navy text-base">
                  Audit Diff: {viewingLog.action} on {viewingLog.entityType}
                </h3>
                <p className="text-xs text-navy-400">
                  By {viewingLog.actorEmail} &bull; {new Date(viewingLog.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingLog(null)}
                className="rounded-lg p-2 text-navy-400 hover:bg-navy-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden p-6 gap-4">
              {/* Old Values */}
              <div className="flex-1 flex flex-col rounded-xl border border-navy-100 bg-slate-50/60 p-4 overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 mb-2">
                  Previous State (Old Values)
                </span>
                <pre className="flex-1 overflow-auto font-mono text-[11px] text-navy-800 bg-white p-3 rounded-lg border border-navy-100">
                  {viewingLog.oldValues
                    ? JSON.stringify(viewingLog.oldValues, null, 2)
                    : "// No prior record (Initial Creation)"}
                </pre>
              </div>

              {/* New Values */}
              <div className="flex-1 flex flex-col rounded-xl border border-navy-100 bg-slate-50/60 p-4 overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-2">
                  New State (Committed Changes)
                </span>
                <pre className="flex-1 overflow-auto font-mono text-[11px] text-navy-800 bg-white p-3 rounded-lg border border-navy-100">
                  {viewingLog.newValues
                    ? JSON.stringify(viewingLog.newValues, null, 2)
                    : "// Record Purged"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
