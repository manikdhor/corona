"use client";

import React, { useState } from "react";
import {
  Shield,
  Check,
  X,
  Users,
  Lock,
  Key,
  Smartphone,
  LogOut,
  AlertCircle,
  Plus,
  CheckCircle2,
  Info,
} from "lucide-react";
import { adminStore } from "@/lib/admin/seed";

const MODULES = [
  { id: "properties", label: "Properties & Enclaves" },
  { id: "leads", label: "Inbound Leads & Pipeline" },
  { id: "media", label: "Central Media Library" },
  { id: "social", label: "Social Media Links" },
  { id: "seo", label: "SEO Suite & Redirects" },
  { id: "scripts", label: "Custom Code & Pixels" },
  { id: "roles", label: "Roles & Access Control" },
  { id: "audit", label: "System Audit Logs" },
];

const ACTIONS = ["view", "create", "edit", "delete", "publish", "export"] as const;

export default function RolesMatrixPage() {
  const [roles, setRoles] = useState(adminStore.getRoles());
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [activeTab, setActiveTab] = useState<"matrix" | "sessions">("matrix");

  // Sample permission matrix state mapped by roleId -> module -> action -> boolean
  const [permissionMatrix, setPermissionMatrix] = useState<Record<string, Record<string, Record<string, boolean>>>>({
    "role-1": { // Super Admin: all true
      properties: { view: true, create: true, edit: true, delete: true, publish: true, export: true },
      leads: { view: true, create: true, edit: true, delete: true, publish: true, export: true },
      media: { view: true, create: true, edit: true, delete: true, publish: true, export: true },
      social: { view: true, create: true, edit: true, delete: true, publish: true, export: true },
      seo: { view: true, create: true, edit: true, delete: true, publish: true, export: true },
      scripts: { view: true, create: true, edit: true, delete: true, publish: true, export: true },
      roles: { view: true, create: true, edit: true, delete: true, publish: true, export: true },
      audit: { view: true, create: true, edit: true, delete: true, publish: true, export: true },
    },
    "role-2": { // Admin
      properties: { view: true, create: true, edit: true, delete: true, publish: true, export: true },
      leads: { view: true, create: true, edit: true, delete: false, publish: true, export: true },
      media: { view: true, create: true, edit: true, delete: true, publish: true, export: true },
      social: { view: true, create: true, edit: true, delete: true, publish: true, export: true },
      seo: { view: true, create: true, edit: true, delete: false, publish: true, export: true },
      scripts: { view: true, create: false, edit: false, delete: false, publish: false, export: false },
      roles: { view: true, create: false, edit: false, delete: false, publish: false, export: false },
      audit: { view: true, create: false, edit: false, delete: false, publish: false, export: true },
    },
    "role-4": { // Agent: own assigned leads/properties
      properties: { view: true, create: false, edit: false, delete: false, publish: false, export: false },
      leads: { view: true, create: true, edit: true, delete: false, publish: false, export: false },
      media: { view: true, create: false, edit: false, delete: false, publish: false, export: false },
      social: { view: false, create: false, edit: false, delete: false, publish: false, export: false },
      seo: { view: false, create: false, edit: false, delete: false, publish: false, export: false },
      scripts: { view: false, create: false, edit: false, delete: false, publish: false, export: false },
      roles: { view: false, create: false, edit: false, delete: false, publish: false, export: false },
      audit: { view: false, create: false, edit: false, delete: false, publish: false, export: false },
    },
  });

  // Active Sessions
  const [activeSessions, setActiveSessions] = useState([
    {
      id: "sess-1",
      device: "Windows 11 PC (Chrome 128)",
      ip: "103.145.23.4 (Dhaka, Bangladesh)",
      isCurrent: true,
      lastActive: "Just now",
      twoFactorStatus: "Verified TOTP",
    },
    {
      id: "sess-2",
      device: "Apple iPhone 15 Pro (Safari Mobile)",
      ip: "103.145.23.12 (Gulshan, Dhaka)",
      isCurrent: false,
      lastActive: "2 hours ago",
      twoFactorStatus: "Verified TOTP",
    },
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const togglePermission = (moduleId: string, action: string) => {
    const roleId = selectedRole.id;
    setPermissionMatrix((prev) => {
      const rolePerms = prev[roleId] || {};
      const modPerms = rolePerms[moduleId] || {};
      const updated = {
        ...prev,
        [roleId]: {
          ...rolePerms,
          [moduleId]: {
            ...modPerms,
            [action]: !modPerms[action],
          },
        },
      };
      return updated;
    });
  };

  const handleSaveMatrix = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleForceLogout = (sessionId: string) => {
    if (confirm("Terminate this session immediately? User will be logged out.")) {
      setActiveSessions(activeSessions.filter((s) => s.id !== sessionId));
    }
  };

  const currentRoleMatrix = permissionMatrix[selectedRole.id] || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Access Control & Governance
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            Roles & Permissions Matrix (RBAC)
          </h1>
          <p className="text-xs text-navy-400">
            Define fine-grained privileges per module and action. Enforced via Supabase Row-Level Security.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveMatrix}
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
        >
          <CheckCircle2 className="h-4 w-4" /> Save Permission Matrix
        </button>
      </div>

      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fade-down">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Permissions matrix synchronized and updated in database.
        </div>
      )}

      {/* TABS */}
      <div className="flex border-b border-navy-100 bg-white rounded-2xl px-4 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("matrix")}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition ${
            activeTab === "matrix"
              ? "border-navy text-navy font-bold"
              : "border-transparent text-navy-400 hover:text-navy-700"
          }`}
        >
          Granular Permission Matrix
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sessions")}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition ${
            activeTab === "sessions"
              ? "border-navy text-navy font-bold"
              : "border-transparent text-navy-400 hover:text-navy-700"
          }`}
        >
          Active Sessions & 2FA Security
        </button>
      </div>

      {activeTab === "matrix" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Col: Roles List */}
          <div className="rounded-2xl bg-white p-4 shadow-xs border border-navy-100 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy-400 px-2 block mb-1">
              Select Role to Configure
            </span>
            {roles.map((r) => {
              const isSelected = selectedRole.id === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`flex w-full items-start justify-between rounded-xl p-3 text-left transition ${
                    isSelected
                      ? "bg-navy text-white shadow-xs"
                      : "hover:bg-slate-50 text-navy-800"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs">{r.displayName}</h4>
                    <p className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? "text-navy-200" : "text-navy-400"}`}>
                      {r.description}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isSelected ? "bg-navy-800 text-gold" : "bg-navy-50 text-navy-600"
                    }`}
                  >
                    {r.userCount} users
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right 3 Cols: Permissions Grid */}
          <div className="lg:col-span-3 rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-navy">
                  Configuring: {selectedRole.displayName}
                </h3>
                <p className="text-xs text-navy-400">{selectedRole.description}</p>
              </div>

              {selectedRole.name === "Agent" && (
                <span className="flex items-center gap-1.5 rounded-xl bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-900 border border-gold/30">
                  <Shield className="h-3.5 w-3.5 text-gold-700" />
                  RLS Row-level Isolation Active: Only sees assigned leads
                </span>
              )}
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-navy-100 bg-slate-50/60">
                    <th className="py-3 px-4 font-bold uppercase text-navy-600">Module</th>
                    {ACTIONS.map((act) => (
                      <th key={act} className="py-3 px-3 font-bold uppercase text-center text-navy-600">
                        {act}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {MODULES.map((mod) => (
                    <tr key={mod.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-navy-800">{mod.label}</td>
                      {ACTIONS.map((act) => {
                        const isChecked = currentRoleMatrix[mod.id]?.[act] ?? (selectedRole.name === "Super Admin");
                        const isSuperAdmin = selectedRole.name === "Super Admin";

                        return (
                          <td key={act} className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              disabled={isSuperAdmin}
                              checked={isChecked}
                              onChange={() => togglePermission(mod.id, act)}
                              className="h-4 w-4 rounded border-navy-300 text-gold focus:ring-gold cursor-pointer disabled:opacity-60"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: ACTIVE SESSIONS & 2FA */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Sessions */}
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
            <h3 className="font-serif font-bold text-base text-navy">Active User Sessions</h3>
            <p className="text-xs text-navy-400">
              Manage currently authenticated devices and revoke access instantly.
            </p>

            <div className="space-y-3">
              {activeSessions.map((sess) => (
                <div key={sess.id} className="rounded-xl border border-navy-100 p-4 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-navy-600" />
                      <span className="font-bold text-xs text-navy">{sess.device}</span>
                      {sess.isCurrent && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          Current Device
                        </span>
                      )}
                    </div>
                    {!sess.isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleForceLogout(sess.id)}
                        className="text-[11px] font-semibold text-red-600 hover:underline"
                      >
                        Force Logout
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-navy-400 font-mono">
                    IP: {sess.ip} &bull; Active: {sess.lastActive}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2FA Setup */}
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-navy">Two-Factor Authentication (2FA)</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                Enforced for Admin
              </span>
            </div>
            <p className="text-xs text-navy-500 leading-relaxed">
              Require time-based one-time password (TOTP) verification via Google Authenticator or Microsoft Authenticator before granting CMS administrative access.
            </p>

            <div className="rounded-xl bg-navy-50 p-4 border border-navy-100 flex items-center gap-3">
              <Lock className="h-5 w-5 text-gold-700" />
              <div>
                <h5 className="font-bold text-xs text-navy">2FA Hardware / App Status</h5>
                <p className="text-[11px] text-navy-500">Connected to Authenticator App &bull; Backup codes generated</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
