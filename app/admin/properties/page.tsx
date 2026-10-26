"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  Building,
} from "lucide-react";
import DataTable, { ColumnDef } from "@/components/admin/table/DataTable";
import { AdminProperty, AdminCategory } from "@/lib/admin/seed";
import {
  getPropertiesAction,
  savePropertyAction,
  deletePropertyAction,
  bulkUpdatePropertiesAction,
  getCategoriesAction,
} from "@/lib/admin/actions";

export default function PropertiesListPage() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [typeCats, setTypeCats] = useState<AdminCategory[]>([]);
  const [statusCats, setStatusCats] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    try {
      const [data, allCats] = await Promise.all([
        getPropertiesAction(),
        getCategoriesAction(),
      ]);
      setProperties(data);
      setTypeCats(allCats.filter((c) => c.scope === "property_type" && c.isActive));
      setStatusCats(allCats.filter((c) => c.scope === "property_status" && c.isActive));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadProperties();
  }, []);

  // Filter Drawer State
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Quick inline status change
  const handleQuickStatusChange = async (id: string, newStatus: any) => {
    await savePropertyAction({ id, status: newStatus });
    await loadProperties();
  };

  // Quick toggle featured
  const handleToggleFeatured = async (id: string, current: boolean) => {
    await savePropertyAction({ id, isFeatured: !current });
    await loadProperties();
  };

  // Bulk Delete
  const handleBulkDelete = async (ids: string[]) => {
    await Promise.all(ids.map((id) => deletePropertyAction(id)));
    await loadProperties();
  };

  // Bulk Status Change
  const handleBulkStatusChange = async (ids: string[], newStatus: string) => {
    await bulkUpdatePropertiesAction(ids, { status: newStatus as any });
    await loadProperties();
  };

  // Applied filtered data with drawer filters
  const filteredData = properties.filter((p) => {
    if (selectedType !== "All" && p.type !== selectedType) return false;
    if (selectedStatus !== "All" && p.status !== selectedStatus) return false;
    if (featuredOnly && !p.isFeatured) return false;
    return true;
  });

  const typeOptions =
    typeCats.length > 0
      ? Array.from(new Set(["All", ...typeCats.map((c) => c.name), ...properties.map((p) => p.type).filter(Boolean)]))
      : ["All", "Exclusive", "Premium", "Standard", "Investment"];

  const statusOptionsList =
    statusCats.length > 0
      ? Array.from(new Set([...statusCats.map((c) => c.name), ...properties.map((p) => p.status).filter(Boolean)]))
      : ["Available", "New Launch", "Almost Sold Out", "Featured", "Sold Out"];

  const columns: ColumnDef<AdminProperty>[] = [
    {
      id: "featuredImage",
      header: "Visual",
      width: "80px",
      sortable: false,
      cell: (row) => (
        <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-navy-50 border border-navy-100">
          <Image
            src={row.featuredImage || "/image-06.webp"}
            alt={row.title}
            fill
            className="object-cover"
            sizes="80px"
            unoptimized={row.featuredImage?.startsWith("data:")}
          />
          {row.isFlagship && (
            <span className="absolute bottom-0 inset-x-0 bg-gold text-navy text-[8px] font-black text-center uppercase tracking-tighter">
              Flagship
            </span>
          )}
        </div>
      ),
    },
    {
      id: "title",
      header: "Property & Slug",
      cell: (row) => (
        <div className="space-y-0.5">
          <Link
            href={`/admin/properties/${row.id}`}
            className="font-bold text-navy hover:text-gold-700 transition"
          >
            {row.title}
          </Link>
          <p className="text-[11px] text-navy-400 font-mono truncate max-w-xs">
            /{row.slug} ({row.type})
          </p>
        </div>
      ),
    },
    {
      id: "location",
      header: "Location & Area",
      cell: (row) => (
        <div>
          <p className="font-medium text-navy-800">{row.location}</p>
          <p className="text-[11px] text-navy-400">{row.size}</p>
        </div>
      ),
    },
    {
      id: "price",
      header: "Price",
      accessorKey: "price",
      cell: (row) => (
        <span className="font-bold text-gold-700 text-xs">{row.price}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleQuickStatusChange(row.id, e.target.value)}
          className={`rounded-lg px-2.5 py-1 text-xs font-bold border outline-none cursor-pointer transition ${
            row.status === "Available"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : row.status === "New Launch"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : row.status === "Almost Sold Out"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-navy-50 text-navy-700 border-navy-200"
          }`}
        >
          {statusOptionsList.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      ),
    },
    {
      id: "isFeatured",
      header: "Featured",
      width: "90px",
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleToggleFeatured(row.id, row.isFeatured)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
            row.isFeatured
              ? "bg-gold/20 text-gold-800 border border-gold/40"
              : "text-navy-300 hover:text-navy-600 bg-slate-50 border border-navy-100"
          }`}
          title="Toggle featured status"
        >
          <Star className={`h-3.5 w-3.5 ${row.isFeatured ? "fill-gold-700 text-gold-700" : ""}`} />
          <span>{row.isFeatured ? "Yes" : "No"}</span>
        </button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      width: "120px",
      sortable: false,
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Link
            href={`/admin/properties/${row.id}`}
            className="p-1.5 rounded-lg text-navy-600 hover:bg-navy-50 hover:text-navy-900 transition"
            title="Edit Property"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <Link
            href={`/properties/${row.slug}`}
            target="_blank"
            className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50 hover:text-gold transition"
            title="Preview Live Page"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={async () => {
              if (confirm(`Delete '${row.title}'?`)) {
                await deletePropertyAction(row.id);
                await loadProperties();
              }
            }}
            className="p-1.5 rounded-lg text-navy-400 hover:bg-red-50 hover:text-red-600 transition"
            title="Delete Property"
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
        title="Properties & Enclaves"
        subtitle={`Manage master communities, residential plots, and investment opportunities (${properties.length} total)`}
        columns={columns}
        data={filteredData}
        searchPlaceholder="Search properties by title, location, or area..."
        searchFields={["title", "location", "area", "slug"]}
        entityName="properties"
        statusOptions={statusOptionsList}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        actionsSlot={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/categories"
              className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition"
            >
              Manage Categories
            </Link>
            <Link
              href="/admin/properties/new"
              className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Property
            </Link>
          </div>
        }
        filterDrawerContent={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-navy-700 block mb-1">
                Property Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs outline-none focus:border-gold"
              >
                {typeOptions.map((tp) => (
                  <option key={tp} value={tp}>
                    {tp === "All" ? "All Types" : tp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-700 block mb-1">
                Listing Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs outline-none focus:border-gold"
              >
                <option value="All">All Statuses</option>
                {statusOptionsList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-navy-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                  className="rounded border-navy-300 text-gold focus:ring-gold"
                />
                Show Featured Listings Only
              </label>
            </div>
          </div>
        }
      />
    </div>
  );
}
