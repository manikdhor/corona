"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Filter,
  Download,
  SlidersHorizontal,
  Eye,
  CheckSquare,
  Square,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Plus,
  X,
  FileSpreadsheet,
  FileText,
  Maximize2,
  Minimize2,
  RefreshCw,
} from "lucide-react";

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface SavedView {
  id: string;
  name: string;
  search: string;
  sortKey: string;
  sortOrder: "asc" | "desc";
  hiddenColumns: string[];
  density: "compact" | "normal" | "relaxed";
}

interface DataTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[];
  data: T[];
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  onBulkDelete?: (ids: string[]) => void;
  onBulkStatusChange?: (ids: string[], newStatus: string) => void;
  statusOptions?: string[];
  entityName?: string;
  filterDrawerContent?: React.ReactNode;
  actionsSlot?: React.ReactNode;
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  title,
  subtitle,
  searchPlaceholder = "Search records...",
  searchFields,
  onBulkDelete,
  onBulkStatusChange,
  statusOptions = ["Available", "New Launch", "Almost Sold Out", "Featured"],
  entityName = "records",
  filterDrawerContent,
  actionsSlot,
}: DataTableProps<T>) {
  // Search state
  const [search, setSearch] = useState("");

  // Sort state
  const [sortKey, setSortKey] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Column visibility
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [showColumnPicker, setShowColumnPicker] = useState(false);

  // Row density: compact, normal, relaxed
  const [density, setDensity] = useState<"compact" | "normal" | "relaxed">("normal");

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAllMatching, setSelectAllMatching] = useState(false);

  // Filter drawer toggle
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Saved Views
  const [savedViews, setSavedViews] = useState<SavedView[]>([
    {
      id: "view-all",
      name: "Default All",
      search: "",
      sortKey: "",
      sortOrder: "asc",
      hiddenColumns: [],
      density: "normal",
    },
  ]);
  const [activeViewId, setActiveViewId] = useState("view-all");
  const [newViewName, setNewViewName] = useState("");
  const [showSaveViewModal, setShowSaveViewModal] = useState(false);

  // 1. FILTERING
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase();

    return data.filter((item) => {
      if (searchFields && searchFields.length > 0) {
        return searchFields.some((field) => {
          const val = (item as any)[field];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
        });
      }
      return Object.values(item).some((val) =>
        val !== undefined && val !== null && String(val).toLowerCase().includes(query)
      );
    });
  }, [data, search, searchFields]);

  // 2. SORTING
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = (a as any)[sortKey];
      const bVal = (b as any)[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return sortOrder === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortOrder]);

  // 3. PAGINATION
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  // Handle Sort Toggle
  const handleSort = (colId: string) => {
    if (sortKey === colId) {
      if (sortOrder === "asc") setSortOrder("desc");
      else {
        setSortKey("");
        setSortOrder("asc");
      }
    } else {
      setSortKey(colId);
      setSortOrder("asc");
    }
  };

  // Selection handlers
  const handleSelectPage = () => {
    const pageIds = paginatedData.map((d) => d.id);
    const allPageSelected = pageIds.every((id) => selectedIds.includes(id));

    if (allPageSelected) {
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
      setSelectAllMatching(false);
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
      setSelectAllMatching(false);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Export to CSV or Excel
  const handleExport = async (format: "csv" | "xlsx") => {
    const exportDataset = selectAllMatching
      ? sortedData
      : selectedIds.length > 0
      ? data.filter((d) => selectedIds.includes(d.id))
      : sortedData;

    try {
      const res = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: `${entityName}_export_${Date.now()}`,
          data: exportDataset,
          format,
        }),
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${entityName}_export_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert("Failed to export: " + err.message);
    }
  };

  // Saved Views Logic
  const handleSaveCurrentView = () => {
    if (!newViewName.trim()) return;
    const newView: SavedView = {
      id: `view-${Date.now()}`,
      name: newViewName.trim(),
      search,
      sortKey,
      sortOrder,
      hiddenColumns,
      density,
    };
    setSavedViews([...savedViews, newView]);
    setActiveViewId(newView.id);
    setNewViewName("");
    setShowSaveViewModal(false);
  };

  const handleApplyView = (view: SavedView) => {
    setActiveViewId(view.id);
    setSearch(view.search);
    setSortKey(view.sortKey);
    setSortOrder(view.sortOrder);
    setHiddenColumns(view.hiddenColumns);
    setDensity(view.density);
    setPage(1);
  };

  const visibleColumns = columns.filter((c) => !hiddenColumns.includes(c.id));

  // Density padding classes
  const cellPadding =
    density === "compact"
      ? "py-2 px-3 text-xs"
      : density === "relaxed"
      ? "py-4 px-4 text-sm"
      : "py-3 px-4 text-xs";

  return (
    <div className="space-y-4">
      {/* Header bar: Title & Actions Slot */}
      {(title || actionsSlot) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            {title && <h2 className="font-serif text-xl font-bold text-navy">{title}</h2>}
            {subtitle && <p className="text-xs text-navy-400 mt-0.5">{subtitle}</p>}
          </div>
          {actionsSlot && <div className="flex items-center gap-2">{actionsSlot}</div>}
        </div>
      )}

      {/* TOOLBAR CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-xs border border-navy-100">
        {/* Left: Search & Saved Views */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-navy-200 pl-9 pr-8 py-2 text-xs focus:border-gold focus:ring-1 focus:ring-gold outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-navy-400 hover:text-navy-900"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Saved Views Dropdown */}
          <div className="flex items-center gap-1.5">
            <Bookmark className="h-4 w-4 text-gold-700 shrink-0" />
            <select
              value={activeViewId}
              onChange={(e) => {
                const view = savedViews.find((v) => v.id === e.target.value);
                if (view) handleApplyView(view);
              }}
              className="rounded-xl border border-navy-200 bg-slate-50/50 px-2.5 py-2 text-xs font-medium text-navy-800 outline-none focus:border-gold"
            >
              {savedViews.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowSaveViewModal(true)}
              className="rounded-lg p-2 text-navy-400 hover:bg-navy-50 hover:text-navy-800"
              title="Save current view as preset"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right: Table Customization & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Drawer Toggle */}
          {filterDrawerContent && (
            <button
              type="button"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                showFilterDrawer
                  ? "border-gold bg-gold/10 text-navy font-semibold"
                  : "border-navy-200 text-navy-700 hover:bg-slate-50"
              }`}
            >
              <Filter className="h-3.5 w-3.5" /> Filters
            </button>
          )}

          {/* Row Density Switcher */}
          <div className="flex items-center rounded-xl bg-navy-50 p-1 text-xs">
            <button
              type="button"
              onClick={() => setDensity("compact")}
              className={`rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                density === "compact" ? "bg-white text-navy font-bold shadow-xs" : "text-navy-400"
              }`}
              title="Compact rows"
            >
              Compact
            </button>
            <button
              type="button"
              onClick={() => setDensity("normal")}
              className={`rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                density === "normal" ? "bg-white text-navy font-bold shadow-xs" : "text-navy-400"
              }`}
              title="Normal rows"
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setDensity("relaxed")}
              className={`rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                density === "relaxed" ? "bg-white text-navy font-bold shadow-xs" : "text-navy-400"
              }`}
              title="Relaxed rows"
            >
              Relaxed
            </button>
          </div>

          {/* Columns Visibility Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColumnPicker(!showColumnPicker)}
              className="flex items-center gap-1.5 rounded-xl border border-navy-200 px-3 py-2 text-xs font-medium text-navy-700 hover:bg-slate-50"
              title="Customize Columns"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Columns
            </button>

            {showColumnPicker && (
              <div className="absolute right-0 top-11 z-30 w-56 rounded-xl bg-white p-3 shadow-xl border border-navy-100">
                <div className="text-xs font-semibold text-navy mb-2 pb-1 border-b border-navy-50 flex items-center justify-between">
                  <span>Toggle Columns</span>
                  <button
                    type="button"
                    onClick={() => setShowColumnPicker(false)}
                    className="text-navy-400 hover:text-navy-900"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {columns.map((col) => {
                    const isVisible = !hiddenColumns.includes(col.id);
                    return (
                      <label
                        key={col.id}
                        className="flex items-center gap-2 text-xs text-navy-700 hover:bg-navy-50 p-1 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setHiddenColumns(hiddenColumns.filter((id) => id !== col.id));
                            } else {
                              setHiddenColumns([...hiddenColumns, col.id]);
                            }
                          }}
                          className="rounded border-navy-300 text-gold focus:ring-gold"
                        />
                        <span className="truncate">{col.header}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleExport("csv")}
              className="flex items-center gap-1.5 rounded-xl border border-navy-200 px-3 py-2 text-xs font-medium text-navy-700 hover:bg-slate-50"
              title="Export CSV"
            >
              <FileText className="h-3.5 w-3.5 text-navy-500" /> CSV
            </button>
            <button
              type="button"
              onClick={() => handleExport("xlsx")}
              className="flex items-center gap-1.5 rounded-xl border border-navy-200 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-slate-50"
              title="Export Excel"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> Excel
            </button>
          </div>
        </div>
      </div>

      {/* FILTER DRAWER AREA */}
      {showFilterDrawer && filterDrawerContent && (
        <div className="rounded-2xl bg-white p-4 border border-gold/30 shadow-xs animate-fade-down">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-navy-50">
            <span className="text-xs font-bold uppercase tracking-wider text-navy">
              Advanced Filter Panel
            </span>
            <button
              type="button"
              onClick={() => setShowFilterDrawer(false)}
              className="text-navy-400 hover:text-navy-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {filterDrawerContent}
        </div>
      )}

      {/* BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-navy px-4 py-2.5 text-white shadow-lg animate-fade-down">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy font-bold text-xs">
              {selectAllMatching ? sortedData.length : selectedIds.length}
            </span>
            <span className="text-xs font-medium">
              {selectAllMatching ? (
                <span>All {sortedData.length} matching {entityName} selected across all pages</span>
              ) : (
                <span>{selectedIds.length} selected on this page</span>
              )}
            </span>

            {/* Select All Across Entire Dataset Option */}
            {!selectAllMatching && sortedData.length > selectedIds.length && (
              <button
                type="button"
                onClick={() => setSelectAllMatching(true)}
                className="text-xs text-gold underline font-semibold hover:text-gold-300 ml-2"
              >
                Select all {sortedData.length} matching {entityName}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onBulkStatusChange && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    const idsToUpdate = selectAllMatching ? sortedData.map((d) => d.id) : selectedIds;
                    onBulkStatusChange(idsToUpdate, e.target.value);
                    setSelectedIds([]);
                    setSelectAllMatching(false);
                  }
                }}
                defaultValue=""
                className="rounded-lg bg-navy-800 text-xs px-2.5 py-1.5 text-white border border-navy-700 outline-none"
              >
                <option value="" disabled>
                  Bulk Change Status...
                </option>
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {onBulkDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${selectedIds.length} selected ${entityName}?`)) {
                    const idsToDelete = selectAllMatching ? sortedData.map((d) => d.id) : selectedIds;
                    onBulkDelete(idsToDelete);
                    setSelectedIds([]);
                    setSelectAllMatching(false);
                  }
                }}
                className="flex items-center gap-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition"
              >
                <Trash2 className="h-3.5 w-3.5" /> Bulk Delete
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setSelectedIds([]);
                setSelectAllMatching(false);
              }}
              className="text-xs text-navy-300 hover:text-white px-2 py-1"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* TABLE ELEMENT */}
      <div className="rounded-2xl border border-navy-100 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-navy-100 text-navy-700 sticky top-0 z-10">
              <tr>
                {/* Select All Checkbox */}
                <th className="w-10 px-4 py-3">
                  <button
                    type="button"
                    onClick={handleSelectPage}
                    className="flex items-center justify-center text-navy-500 hover:text-navy-900"
                  >
                    {paginatedData.length > 0 &&
                    paginatedData.every((d) => selectedIds.includes(d.id)) ? (
                      <CheckSquare className="h-4 w-4 text-gold-700" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>

                {visibleColumns.map((col) => (
                  <th
                    key={col.id}
                    style={{ width: col.width }}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-navy-600 select-none"
                  >
                    {col.sortable !== false ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.id)}
                        className="flex items-center gap-1 hover:text-navy-900 transition"
                      >
                        <span>{col.header}</span>
                        {sortKey === col.id ? (
                          sortOrder === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5 text-gold-700 stroke-[3]" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-gold-700 stroke-[3]" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3 w-3 text-navy-300 opacity-60" />
                        )}
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-navy-50 text-navy-800">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="py-12 text-center text-navy-400">
                    <p className="text-sm font-medium">No matching {entityName} found.</p>
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="mt-2 text-xs text-gold-700 underline font-semibold"
                      >
                        Clear search filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const isSelected = selectedIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`group transition hover:bg-slate-50/70 ${
                        isSelected ? "bg-gold/5" : ""
                      }`}
                    >
                      {/* Row selection */}
                      <td className="w-10 px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleSelectRow(row.id)}
                          className="flex items-center justify-center text-navy-400 hover:text-navy-900"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-gold-700" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                      {/* Columns */}
                      {visibleColumns.map((col) => (
                        <td key={col.id} className={cellPadding}>
                          {col.cell
                            ? col.cell(row)
                            : (row as any)[col.accessorKey || col.id]}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-navy-50 bg-slate-50/50 px-4 py-3 text-xs text-navy-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-navy-200 bg-white px-2 py-1 text-xs outline-none"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-navy-400 ml-2">
              Showing {(page - 1) * pageSize + 1} -{" "}
              {Math.min(page * pageSize, sortedData.length)} of {sortedData.length} records
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 bg-white text-navy hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-medium text-navy-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 bg-white text-navy hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SAVE VIEW MODAL */}
      {showSaveViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <h3 className="text-base font-serif font-bold text-navy">Save Table View</h3>
            <p className="text-xs text-navy-400 mt-1">
              Save current search query, sort settings, and column preferences for quick 1-click access.
            </p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="e.g. Hot leads this week"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSaveViewModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-navy-600 hover:bg-navy-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCurrentView}
                disabled={!newViewName.trim()}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-navy text-gold hover:bg-navy-800 disabled:opacity-40"
              >
                Save Preset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
