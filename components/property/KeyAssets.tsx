"use client";

import Link from "next/link";
import Image from "next/image";
import type { ProjectAssets } from "@/lib/projects";
import {
  Download,
  ExternalLink,
  MapPin,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

interface KeyAsset {
  title: string;
  description: string;
  icon: "map" | "layout" | "brochure";
  viewHref?: string;
  downloadHref: string;
  downloadLabel: string;
  badge?: string;
  badgeColor?: string;
}

interface KeyAssetsProps {
  assets: ProjectAssets;
  mapCoordinates?: { lat: number; lng: number };
  mapHref?: string;
  className?: string;
}

const ASSET_ICONS = {
  map: MapPin,
  layout: FileSpreadsheet,
  brochure: FileText,
} as const;

function buildAssetList(props: KeyAssetsProps): KeyAsset[] {
  const { assets, mapCoordinates, mapHref } = props;

  const items: KeyAsset[] = [
    {
      title: "Location Map",
      description:
        "Interactive Google Maps view with project location, nearby landmarks, and connectivity.",
      icon: "map",
      viewHref:
        mapHref ||
        `https://www.google.com/maps?q=${mapCoordinates?.lat ?? 0},${mapCoordinates?.lng ?? 0}&z=14&output=embed`,
      downloadHref: mapHref || "#",
      downloadLabel: "Open in Maps",
      badge: "View",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    {
      title: "Layout Plan",
      description:
        "Approved master layout plan showing plot divisions, road networks, and amenities.",
      icon: "layout",
      viewHref: assets.layoutPlan,
      downloadHref: assets.layoutPlan,
      downloadLabel: "Download PDF",
      badge: "PDF",
      badgeColor: "bg-gold-50 text-gold-700 border-gold-200",
    },
  ];

  if (assets.brochure) {
    items.push({
      title: assets.brochureLabel || "Project Brochure",
      description:
        "Complete project brochure with specifications, amenities, pricing, and contact details.",
      icon: "brochure",
      viewHref: assets.brochure,
      downloadHref: assets.brochureFile || assets.brochure,
      downloadLabel: "Download Brochure",
      badge: "PDF",
      badgeColor: "bg-navy-50 text-navy-700 border-navy-100",
    });
  }

  return items;
}

export default function KeyAssets({ assets, mapCoordinates, mapHref, className = "" }: KeyAssetsProps) {
  const items = buildAssetList({ assets, mapCoordinates, mapHref });

  return (
    <div className={className}>
      <div className="mb-6">
        <span className="eyebrow">Project Assets</span>
        <h2 className="mt-4 font-serif text-display-sm font-bold text-navy">
          Key Documents & Maps
        </h2>
        <p className="mt-2 text-navy-400">
          Download or view essential project documents for your reference.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((asset) => {
          const Icon = ASSET_ICONS[asset.icon];
          return (
            <div
              key={asset.title}
              className="group relative flex flex-col rounded-2xl border border-navy-50 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 transition-colors group-hover:bg-navy/5">
                  <Icon className="h-6 w-6 text-gold-600" />
                </span>
                {asset.badge && (
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${asset.badgeColor}`}
                  >
                    {asset.badge}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg font-bold text-navy">{asset.title}</h3>
              <p className="mt-1.5 text-sm text-navy-400 flex-1">{asset.description}</p>

              <div className="mt-5 flex items-center gap-3">
                {asset.viewHref && asset.viewHref !== "#" && (
                  <Link
                    href={asset.viewHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-navy/10 bg-cream px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-navy transition-all hover:border-navy/20 hover:bg-white hover:text-gold-600"
                  >
                    View
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}
                <Link
                  href={asset.downloadHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-navy transition-all hover:shadow-gold hover:-translate-y-0.5"
                >
                  {asset.downloadLabel}
                  <Download className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
