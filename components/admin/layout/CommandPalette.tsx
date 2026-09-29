"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  Users,
  Image as ImageIcon,
  Shield,
  Settings,
  Globe,
  Share2,
  FileText,
  Clock,
  ArrowRight,
  X,
  Building,
  UserCheck,
} from "lucide-react";
import { adminStore } from "@/lib/admin/seed";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const properties = adminStore.getProperties();
  const leads = adminStore.getLeads();
  const agents = adminStore.getAgents();

  const navItems = [
    { title: "Dashboard Overview", path: "/admin", icon: Home, group: "Navigation" },
    { title: "Properties & Enclaves", path: "/admin/properties", icon: Building, group: "Navigation" },
    { title: "Add New Property", path: "/admin/properties/new", icon: Building, group: "Quick Action" },
    { title: "Leads & Inquiries", path: "/admin/leads", icon: Users, group: "Navigation" },
    { title: "Kanban Pipeline Board", path: "/admin/leads/kanban", icon: Users, group: "Navigation" },
    { title: "Media Asset Library", path: "/admin/media", icon: ImageIcon, group: "Navigation" },
    { title: "Social Media Links", path: "/admin/social", icon: Share2, group: "Navigation" },
    { title: "SEO Suite & Meta Tags", path: "/admin/seo", icon: Globe, group: "Navigation" },
    { title: "301 Redirect Rules", path: "/admin/seo/redirects", icon: Globe, group: "Navigation" },
    { title: "Global Custom Scripts", path: "/admin/seo/scripts", icon: FileText, group: "Navigation" },
    { title: "RBAC Roles Matrix", path: "/admin/roles", icon: Shield, group: "Navigation" },
    { title: "System Audit Logs", path: "/admin/audit-logs", icon: Clock, group: "Navigation" },
    { title: "Branding & White-label", path: "/admin/settings", icon: Settings, group: "Navigation" },
  ];

  // Filter items based on query
  const filteredNav = navItems.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProperties = properties
    .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4);

  const filteredLeads = leads
    .filter((l) => l.name.toLowerCase().includes(query.toLowerCase()) || l.phone.includes(query) || l.email.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4);

  const handleSelect = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-navy-950/60 backdrop-blur-sm p-4 pt-20 animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-navy-100 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-navy-100 px-4 py-3 bg-slate-50/60">
          <Search className="h-5 w-5 text-gold-700 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, property, lead, or setting..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-navy-900 outline-none placeholder:text-navy-400"
          />
          <kbd className="hidden sm:inline-block rounded bg-navy-100 px-2 py-0.5 text-[10px] font-semibold text-navy-600">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Properties section */}
          {filteredProperties.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                Properties & Enclaves
              </p>
              <div className="space-y-0.5 mt-1">
                {filteredProperties.map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => handleSelect(`/admin/properties/${prop.id}`)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-navy-700 hover:bg-gold/10 hover:text-navy transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building className="h-4 w-4 text-navy-400" />
                      <span className="font-semibold text-xs text-navy-900">{prop.title}</span>
                      <span className="text-[11px] text-navy-400">({prop.location})</span>
                    </div>
                    <span className="text-[11px] font-semibold text-gold-700">{prop.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads section */}
          {filteredLeads.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                Inbound Leads
              </p>
              <div className="space-y-0.5 mt-1">
                {filteredLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => handleSelect(`/admin/leads?search=${encodeURIComponent(lead.name)}`)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-navy-700 hover:bg-gold/10 hover:text-navy transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="h-4 w-4 text-navy-400" />
                      <span className="font-semibold text-xs text-navy-900">{lead.name}</span>
                      <span className="text-[11px] text-navy-400">{lead.phone}</span>
                    </div>
                    <span className="text-[11px] font-medium text-navy-500">{lead.propertyTitle}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div>
            <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-400">
              Navigation & Modules
            </p>
            <div className="space-y-0.5 mt-1">
              {filteredNav.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-navy-700 hover:bg-navy-50 hover:text-navy-900 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="h-4 w-4 text-navy-400" />
                    <span className="font-medium text-xs">{item.title}</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-navy-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
