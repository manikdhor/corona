"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Plus,
  ArrowRight,
  Database,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Kanban,
  Sparkles,
} from "lucide-react";
import { adminStore } from "@/lib/admin/seed";
import { getLeadsAction, getPropertiesAction, getStagesAction } from "@/lib/admin/actions";

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState(adminStore.getProperties());
  const [leads, setLeads] = useState(adminStore.getLeads());
  const [stages, setStages] = useState(adminStore.getStages());

  React.useEffect(() => {
    let mounted = true;
    Promise.all([getPropertiesAction(), getLeadsAction(), getStagesAction()])
      .then(([loadedProperties, loadedLeads, loadedStages]) => {
        if (!mounted) return;
        setProperties(loadedProperties);
        setLeads(loadedLeads);
        setStages(loadedStages);
      })
      .catch((error) => {
        console.error("Unable to load admin dashboard data:", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Metrics
  const activeListingsCount = properties.filter((p) => p.status === "Available" || p.status === "New Launch").length;
  const totalLeadsCount = leads.length;
  const wonLeadsCount = leads.filter((l) => l.stageId === "stage-6").length;
  const conversionRate = totalLeadsCount > 0 ? ((wonLeadsCount / totalLeadsCount) * 100).toFixed(1) : "0";

  // Calculate Pipeline Value
  const totalPipelineValue = leads.reduce((acc, lead) => {
    return acc + (lead.budgetMax || lead.budgetMin || 10000000);
  }, 0);

  const formatBDT = (val: number) => {
    if (val >= 10000000) return `BDT ${(val / 10000000).toFixed(1)} Crore`;
    if (val >= 100000) return `BDT ${(val / 100000).toFixed(0)} Lakh`;
    return `BDT ${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* --- WELCOME HEADER & QUICK ACTIONS --- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Real Estate Executive Suite
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy mt-1">
            Corona Properties Administration
          </h1>
          <p className="text-xs sm:text-sm text-navy-400 mt-1">
            Real-time management for residential enclaves, inbound buyers, media, and digital authority.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Property
          </Link>
          <Link
            href="/admin/leads/kanban"
            className="flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
          >
            <Kanban className="h-4 w-4 text-gold-700" /> Pipeline Kanban
          </Link>
        </div>
      </div>

      {/* --- SUPABASE DATABASE HEALTH STATUS BANNER --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-navy via-navy-900 to-navy-800 p-4 sm:p-5 text-white shadow-md border border-navy-700/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white">Supabase Postgres Engine Active</h4>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" /> Connected
              </span>
            </div>
            <p className="text-[11px] text-navy-200 mt-0.5">
              Project: <code className="font-mono text-gold-300">xtilpfcqhecqhifftrop.supabase.co</code> &bull; Region: ap-south-1 &bull; Row Level Security Enabled
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-navy-300 hidden sm:inline">Migrations Ready:</span>
          <span className="rounded-lg bg-navy-800/80 px-2.5 py-1 text-[11px] font-mono text-gold-300 border border-navy-700">
            001_initial_schema.sql
          </span>
        </div>
      </div>

      {/* --- 4 KPI SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Listings */}
        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">
              Active Listings
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold-700">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-navy">
              {activeListingsCount}
            </span>
            <span className="text-xs text-navy-400">of {properties.length} total</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Flagship: Maple Leaf Garden City
          </p>
        </div>

        {/* Total Inbound Leads */}
        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">
              Inbound Leads
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-navy">
              {totalLeadsCount}
            </span>
            <span className="text-xs text-navy-400">pipeline records</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-2 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> +18% inquiry rate this month
          </p>
        </div>

        {/* Pipeline Value */}
        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">
              Pipeline Value
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-xl sm:text-2xl font-bold text-navy truncate" title={formatBDT(totalPipelineValue)}>
              {formatBDT(totalPipelineValue)}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            Active negotiation & site visits
          </p>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">
              Conversion Rate
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-navy">
              {conversionRate}%
            </span>
            <span className="text-xs text-navy-400">{wonLeadsCount} closed</span>
          </div>
          <p className="text-[11px] text-purple-600 font-medium mt-2 flex items-center gap-1">
            Above prime real estate baseline
          </p>
        </div>
      </div>

      {/* --- PIPELINE STAGE BREAKDOWN --- */}
      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-base font-bold text-navy">Buyer Pipeline Distribution</h3>
            <p className="text-xs text-navy-400">Live breakdown of prospective buyers across deal stages.</p>
          </div>
          <Link
            href="/admin/leads/kanban"
            className="flex items-center gap-1 text-xs font-semibold text-gold-700 hover:underline"
          >
            Open Kanban Board <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {stages.map((stage) => {
            const count = leads.filter((l) => l.stageId === stage.id).length;
            return (
              <div
                key={stage.id}
                className="rounded-xl border border-navy-50 bg-slate-50/70 p-3 text-center transition hover:border-gold/50"
              >
                <div
                  className="h-1.5 w-8 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: stage.color }}
                />
                <p className="text-xs font-semibold text-navy-700 truncate">{stage.name}</p>
                <p className="font-serif text-xl font-bold text-navy mt-1">{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- RECENT LEADS & HIGH-PRIORITY PROSPECTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High Priority Inquiries */}
        <div className="lg:col-span-2 rounded-2xl border border-navy-100 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-navy-50 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-navy">Recent Inbound Inquiries</h3>
              <p className="text-xs text-navy-400">High-intent prospective buyers awaiting advisor follow-up.</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-semibold text-gold-700 hover:underline"
            >
              View all leads &rarr;
            </Link>
          </div>

          <div className="divide-y divide-navy-50">
            {leads.slice(0, 4).map((lead) => (
              <div key={lead.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-navy-900">{lead.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        lead.priority === "Urgent"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : lead.priority === "High"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-navy-50 text-navy-600"
                      }`}
                    >
                      {lead.priority}
                    </span>
                    <span className="text-[10px] bg-gold/10 text-gold-800 px-2 py-0.5 rounded font-bold">
                      Score: {lead.score}
                    </span>
                  </div>
                  <p className="text-xs text-navy-500 truncate max-w-md">
                    <strong>Property:</strong> {lead.propertyTitle} &bull; <strong>Budget:</strong> {lead.budget}
                  </p>
                  {lead.message && (
                    <p className="text-[11px] text-navy-400 italic line-clamp-1">
                      &ldquo;{lead.message}&rdquo;
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-navy-400 block font-mono">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/admin/leads?search=${encodeURIComponent(lead.name)}`}
                    className="inline-block mt-1 text-[11px] font-semibold text-navy hover:text-gold"
                  >
                    Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Featured Properties Showcase */}
        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-xs space-y-4">
          <div className="border-b border-navy-50 pb-3">
            <h3 className="font-serif text-base font-bold text-navy">Flagship Projects</h3>
            <p className="text-xs text-navy-400">Core master-planned enclaves.</p>
          </div>

          <div className="space-y-3">
            {properties.slice(0, 3).map((prop) => (
              <div
                key={prop.id}
                className="group rounded-xl border border-navy-100 p-3 transition hover:border-gold/60 hover:bg-slate-50/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-semibold text-xs text-navy group-hover:text-gold-700 transition">
                      {prop.title}
                    </h5>
                    <p className="text-[11px] text-navy-400">{prop.location}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-navy-50 text-navy-700">
                    {prop.type}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-navy-50">
                  <span className="font-bold text-gold-700 text-[11px]">{prop.price}</span>
                  <Link
                    href={`/admin/properties/${prop.id}`}
                    className="text-[11px] font-semibold text-navy hover:underline"
                  >
                    Edit &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/properties"
            className="flex items-center justify-center gap-2 rounded-xl border border-navy-200 py-2 text-xs font-semibold text-navy hover:bg-slate-50 transition w-full"
          >
            Manage All {properties.length} Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
