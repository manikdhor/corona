"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building,
  Users,
  Image as ImageIcon,
  Share2,
  Globe,
  Shield,
  Clock,
  Settings,
  Search,
  Bell,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  SlidersHorizontal,
  LogOut,
  Sparkles,
  Layers,
  Kanban,
  FileCode,
  LayoutTemplate,
  Newspaper,
  UserCheck,
  MessageSquare,
  Briefcase,
  FileText,
  Compass,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CommandPalette from "@/components/admin/layout/CommandPalette";
import { adminLogoutAction, getAdminSessionAction } from "@/lib/admin/auth-actions";
import { AdminSession } from "@/lib/admin/auth-token";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminSession | null>(null);

  React.useEffect(() => {
    if (pathname !== "/admin/login") {
      getAdminSessionAction().then((sess) => {
        if (sess) setAdminUser(sess);
      });
    }
  }, [pathname]);

  const handleLogout = async () => {
    await adminLogoutAction();
    router.push("/admin/login");
    router.refresh();
  };

  // If on login page, render clean standalone view without dashboard navigation
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navSections = [
    {
      title: "Core Operations",
      links: [
        { label: "Dashboard", href: "/admin", icon: Home },
        { label: "Properties", href: "/admin/properties", icon: Building },
        { label: "Leads Table", href: "/admin/leads", icon: Users },
        { label: "Leads Kanban", href: "/admin/leads/kanban", icon: Kanban },
      ],
    },
    {
      title: "Website CMS",
      links: [
        { label: "Site Content", href: "/admin/content", icon: LayoutTemplate },
        { label: "Blog Posts", href: "/admin/blog", icon: Newspaper },
        { label: "Executive Team", href: "/admin/team", icon: UserCheck },
        { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
        { label: "Services", href: "/admin/services", icon: Briefcase },
        { label: "Pages & Legal", href: "/admin/pages", icon: FileText },
        { label: "Navigation Menus", href: "/admin/navigation", icon: Compass },
        { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      ],
    },
    {
      title: "Marketing & Security",
      links: [
        { label: "Social Links", href: "/admin/social", icon: Share2 },
        { label: "SEO & SERP", href: "/admin/seo", icon: Globe },
        { label: "301 Redirects", href: "/admin/seo/redirects", icon: SlidersHorizontal },
        { label: "Custom Scripts", href: "/admin/seo/scripts", icon: FileCode },
        { label: "RBAC & Roles", href: "/admin/roles", icon: Shield },
        { label: "Audit Logs", href: "/admin/audit-logs", icon: Clock },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  // Breadcrumbs calculation
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const breadcrumbs = pathSegments.map((seg, idx) => {
    const url = "/" + pathSegments.slice(0, idx + 1).join("/");
    const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
    return { url, label };
  });

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-navy-900 antialiased selection:bg-gold/30 selection:text-navy">
      {/* --- SIDEBAR FOR DESKTOP & MOBILE DRAWER --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-navy-100 bg-navy text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-navy-800">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-gold text-navy font-serif font-black text-sm shadow-sm">
              CP
            </span>
            <div>
              <span className="font-serif text-sm font-bold tracking-wide text-white block leading-tight">
                Corona Properties
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gold-300 font-semibold block">
                CMS & Backend
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-navy-300 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-navy-400">
                {section.title}
              </div>
              {section.links.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href) && !item.href.includes("kanban"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium transition ${
                      isActive
                        ? "bg-navy-800 text-gold font-bold shadow-xs border border-navy-700/60"
                        : "text-navy-200 hover:bg-navy-800/60 hover:text-white"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-gold" : "text-navy-300"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: User Profile & Public Site Link */}
        <div className="border-t border-navy-800 p-3 space-y-2 bg-navy-950/40">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-navy-200 hover:bg-navy-800 hover:text-gold transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-navy-400" />
              View Public Website
            </span>
            <span className="text-[10px] bg-navy-800 text-navy-300 px-1.5 py-0.5 rounded font-mono">
              Live
            </span>
          </Link>

          <div className="rounded-xl bg-navy-800/80 p-2.5 border border-navy-700/50 space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-gold text-navy font-bold text-xs shrink-0">
                {(adminUser?.name || "SA").slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-white">
                  {adminUser?.name || "Super Administrator"}
                </p>
                <p className="truncate text-[10px] text-gold-300">
                  {adminUser?.email || "admin@coronapropertiesltd.com"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900/80 hover:bg-rose-950/40 hover:text-rose-300 border border-navy-700/40 hover:border-rose-800/50 px-3 py-1.5 text-[11px] font-semibold text-navy-300 transition"
              title="End admin session"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN APP VIEWPORT --- */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-100 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
          {/* Left: Mobile hamburger & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-lg p-1.5 text-navy-600 hover:bg-navy-50"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb path */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-navy-400">
              <Link href="/admin" className="hover:text-navy-900 font-medium">
                Admin
              </Link>
              {breadcrumbs.slice(1).map((b, i) => (
                <React.Fragment key={b.url}>
                  <ChevronRight className="h-3 w-3 text-navy-300" />
                  <Link
                    href={b.url}
                    className={`hover:text-navy-900 ${
                      i === breadcrumbs.length - 2 ? "font-semibold text-navy-900" : ""
                    }`}
                  >
                    {b.label}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Right: Quick Search, Notifications, Language, Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button (Cmd+K) */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-navy-200 bg-slate-50/70 px-3 py-1.5 text-xs text-navy-500 hover:border-gold/60 hover:bg-white transition"
            >
              <Search className="h-3.5 w-3.5 text-navy-400" />
              <span className="hidden md:inline">Quick search or command...</span>
              <kbd className="rounded bg-navy-100 px-1.5 py-0.5 text-[10px] font-semibold text-navy-600">
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-navy-200 text-navy-600 hover:bg-slate-50 transition"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold ring-2 ring-white" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl bg-white p-4 shadow-2xl border border-navy-100 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-navy-50 pb-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-navy">
                      Notifications & Alerts
                    </span>
                    <span className="text-[10px] text-gold-700 font-semibold">2 New</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="rounded-xl bg-gold/10 p-2.5 border border-gold/20">
                      <p className="font-semibold text-navy-900">New Hot Lead Received</p>
                      <p className="text-[11px] text-navy-600 mt-0.5">
                        Kamal Hossain (Toronto NRI) requested a private tour for Maple Leaf Garden City.
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-navy-100">
                      <p className="font-semibold text-navy-900">Site Visit Scheduled</p>
                      <p className="text-[11px] text-navy-600 mt-0.5">
                        Dr. Arifa Sultana visit confirmed for Friday 10:00 AM.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-semibold text-navy-700 border border-navy-100">
              EN / বাংলা
            </span>

            {/* Quick Sign Out */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition shadow-xs"
              title="Sign Out of Admin Console"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-500" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
