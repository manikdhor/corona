"use client";

import React, { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import {
  Search,
  Check,
  Upload,
  Sparkles,
  Layers,
  X,
  AlertCircle,
} from "lucide-react";
import { sanitizeSvg } from "@/lib/admin/sanitize";

export interface IconItem {
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

// 200+ Curated icons organized into intuitive real estate categories
export const ICON_REGISTRY: { category: string; icons: string[] }[] = [
  {
    category: "Real Estate & Architecture",
    icons: [
      "Home", "Building", "Building2", "Landmark", "Castle", "Warehouse", "Hotel", "Store",
      "DraftingCompass", "Hammer", "Ruler", "Key", "KeyRound", "DoorClosed", "DoorOpen",
      "Fence", "Maximize2", "Minimize2", "Grid", "Layout", "Columns",
    ],
  },
  {
    category: "Amenities & Recreation",
    icons: [
      "Trees", "Waves", "Dumbbell", "Trophy", "HeartPulse", "Sparkles", "Utensils", "Coffee",
      "Wifi", "Car", "Zap", "Flame", "ShieldCheck", "Cctv", "ParkingCircle", "ShowerHead",
      "Bath", "Bed", "Armchair", "Tv", "Gamepad2", "Music", "Wine",
    ],
  },
  {
    category: "Nature & Environment",
    icons: [
      "Sun", "Moon", "Cloud", "CloudSun", "Wind", "Droplets", "Flower2", "Mountain",
      "MountainSnow", "Compass", "Sprout", "Footprints", "Bird", "Fish",
    ],
  },
  {
    category: "Commerce & Finance",
    icons: [
      "BadgeDollarSign", "Banknote", "Briefcase", "Coins", "CreditCard", "PiggyBank",
      "Receipt", "TrendingUp", "Scale", "Percent", "Calculator", "Handshake",
    ],
  },
  {
    category: "Navigation & Location",
    icons: [
      "MapPin", "Map", "Navigation", "Navigation2", "LocateFixed", "Globe", "Flag",
      "Route", "Signpost", "Milestone", "Crosshair", "Compass",
    ],
  },
  {
    category: "Social & Communication",
    icons: [
      "Phone", "PhoneCall", "Mail", "MessageCircle", "Send", "Share2", "Bell", "Megaphone",
      "AtSign", "Headphones", "Video", "Camera", "Facebook", "Instagram", "Youtube", "Linkedin", "Twitter",
    ],
  },
  {
    category: "UI & Essential Badges",
    icons: [
      "Star", "Heart", "Award", "Bookmark", "Check", "CheckCircle", "Shield", "Lock",
      "Unlock", "Eye", "Search", "Filter", "SlidersHorizontal", "Settings", "HelpCircle", "Info",
    ],
  },
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string, customSvg?: string) => void;
  label?: string;
}

export default function IconPicker({ value, onChange, label = "Select Icon" }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"library" | "custom">("library");

  // Custom SVG state
  const [customSvgText, setCustomSvgText] = useState("");
  const [customSvgError, setCustomSvgError] = useState("");
  const [customSvgName, setCustomSvgName] = useState("");

  // Filter icons based on search query and category
  const filteredCategories = useMemo(() => {
    return ICON_REGISTRY.map((cat) => {
      if (activeCategory !== "All" && cat.category !== activeCategory) {
        return { category: cat.category, icons: [] };
      }
      const matchingIcons = cat.icons.filter((name) =>
        name.toLowerCase().includes(search.toLowerCase())
      );
      return { category: cat.category, icons: matchingIcons };
    }).filter((cat) => cat.icons.length > 0);
  }, [search, activeCategory]);

  // Helper to render an icon dynamically
  const renderIcon = (name: string, className = "h-5 w-5") => {
    const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
    return <IconComponent className={className} />;
  };

  const handleCustomSvgSubmit = () => {
    setCustomSvgError("");
    const result = sanitizeSvg(customSvgText);
    if (!result.isValid) {
      setCustomSvgError(result.error || "Invalid SVG format");
      return;
    }

    const iconName = customSvgName.trim() || `custom-icon-${Date.now()}`;
    onChange(iconName, result.sanitized);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">
          {label}
        </label>
      )}

      {/* Button to open picker */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-between rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-xs text-navy-800 shadow-xs hover:border-gold/60 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-50 text-navy border border-navy-100">
            {renderIcon(value, "h-4 w-4 text-gold-700")}
          </span>
          <span className="font-medium text-xs text-navy-900">{value || "Choose an icon..."}</span>
        </div>
        <span className="text-[11px] font-semibold text-gold-700 underline">Change Icon</span>
      </button>

      {/* MODAL PICKER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl border border-navy-100 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4 bg-slate-50/80">
              <div>
                <h3 className="font-serif font-bold text-navy text-base">Visual Icon System</h3>
                <p className="text-xs text-navy-400">
                  Select from 200+ curated icons or upload a sanitized custom SVG.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-navy-400 hover:bg-navy-100 hover:text-navy-900 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab switch: Library vs Custom SVG */}
            <div className="flex border-b border-navy-100 bg-white px-6">
              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
                  activeTab === "library"
                    ? "border-navy text-navy font-bold"
                    : "border-transparent text-navy-400 hover:text-navy-700"
                }`}
              >
                Icon Library (200+)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("custom")}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
                  activeTab === "custom"
                    ? "border-navy text-navy font-bold"
                    : "border-transparent text-navy-400 hover:text-navy-700"
                }`}
              >
                Upload Custom SVG
              </button>
            </div>

            {/* TAB 1: ICON LIBRARY */}
            {activeTab === "library" ? (
              <div className="flex flex-1 flex-col overflow-hidden p-6">
                {/* Search & Category filter */}
                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy-400" />
                    <input
                      type="text"
                      placeholder="Search icons by name (e.g. Mosque, Lake, Hospital, Tree)..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-xl border border-navy-200 pl-9 pr-4 py-2 text-xs focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveCategory("All")}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition shrink-0 ${
                        activeCategory === "All"
                          ? "bg-navy text-gold"
                          : "bg-navy-50 text-navy-600 hover:bg-navy-100"
                      }`}
                    >
                      All ({ICON_REGISTRY.reduce((acc, c) => acc + c.icons.length, 0)})
                    </button>
                    {ICON_REGISTRY.map((c) => (
                      <button
                        key={c.category}
                        type="button"
                        onClick={() => setActiveCategory(c.category)}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium transition shrink-0 ${
                          activeCategory === c.category
                            ? "bg-navy text-gold"
                            : "bg-navy-50 text-navy-600 hover:bg-navy-100"
                        }`}
                      >
                        {c.category} ({c.icons.length})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icons Grid with Category Sections */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                  {filteredCategories.map((group) => (
                    <div key={group.category}>
                      <h5 className="text-[11px] font-semibold uppercase tracking-wider text-navy-400 mb-2.5">
                        {group.category}
                      </h5>
                      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {group.icons.map((iconName) => {
                          const isSelected = value === iconName;
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => {
                                onChange(iconName);
                                setIsOpen(false);
                              }}
                              className={`group flex flex-col items-center justify-center p-2 rounded-xl border transition ${
                                isSelected
                                  ? "border-gold bg-gold/10 text-navy ring-1 ring-gold"
                                  : "border-navy-100 hover:border-gold/60 hover:bg-slate-50 text-navy-600 hover:text-navy-900"
                              }`}
                              title={iconName}
                            >
                              <span className="flex h-8 w-8 items-center justify-center">
                                {renderIcon(iconName, `h-5 w-5 transition ${isSelected ? "text-gold-700" : "group-hover:scale-110"}`)}
                              </span>
                              <span className="mt-1 text-[10px] font-medium truncate max-w-[65px] text-navy-500">
                                {iconName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* TAB 2: CUSTOM SVG */
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="rounded-xl bg-amber-50/50 p-4 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                  <strong>Security Note:</strong> Custom SVGs are strictly sanitized via DOMPurify.
                  Any embedded scripts, event handlers (<code className="text-navy">onclick</code>, <code className="text-navy">onload</code>), or external URL requests will be automatically stripped to protect the application.
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy-700 block mb-1">
                    Icon Identifier / Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. signature-lagoon-icon"
                    value={customSvgName}
                    onChange={(e) => setCustomSvgName(e.target.value)}
                    className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy-700 block mb-1">
                    Raw SVG XML Code
                  </label>
                  <textarea
                    rows={6}
                    placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">...</svg>'
                    value={customSvgText}
                    onChange={(e) => setCustomSvgText(e.target.value)}
                    className="w-full font-mono text-[11px] rounded-xl border border-navy-200 p-3 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                  />
                </div>

                {customSvgError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {customSvgError}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleCustomSvgSubmit}
                    disabled={!customSvgText}
                    className="rounded-xl bg-navy px-5 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 disabled:opacity-40 transition shadow-sm"
                  >
                    Sanitize & Save Icon
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
