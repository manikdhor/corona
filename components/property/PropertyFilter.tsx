"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronUp } from "lucide-react";
import PropertyCard from "./PropertyCard";
import { PROPERTIES } from "@/lib/data";
import { cn } from "@/lib/utils";

const AREAS = ["All Areas", "Gulshan", "Banani", "Baridhara", "Uttara", "Dhanmondi", "Bashundhara"];
const TYPES = ["All Types", "Exclusive", "Premium", "Standard", "Investment"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function PropertyFilter() {
  const [area, setArea] = useState("All Areas");
  const [type, setType] = useState("All Types");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...PROPERTIES];

    if (area !== "All Areas") {
      result = result.filter((p) => p.area === area);
    }
    if (type !== "All Types") {
      result = result.filter((p) => p.type === type);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "price-high":
        result.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "newest":
        result.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      default:
        result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return result;
  }, [area, type, search, sort]);

  const resetFilters = () => {
    setArea("All Areas");
    setType("All Types");
    setSearch("");
    setSort("featured");
  };

  const hasFilters = area !== "All Areas" || type !== "All Types" || search;

  return (
    <div>
      {/* Desktop filter bar */}
      <div className="sticky top-20 z-30 -mx-5 mb-12 bg-cream/95 px-5 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:px-6 shadow-card md:block hidden">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or location..."
              className="w-full rounded-full border border-navy-100 bg-white py-3 pl-11 pr-4 text-sm text-navy placeholder:text-navy-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
          </div>

          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="rounded-full border border-navy-100 bg-white px-5 py-3 text-sm font-medium text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 cursor-pointer"
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-full border border-navy-100 bg-white px-5 py-3 text-sm font-medium text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 cursor-pointer"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-navy-100 bg-white px-5 py-3 text-sm font-medium text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>Sort: {o.label}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 rounded-full bg-navy-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-navy transition-colors hover:bg-navy-100"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-navy-400">
          <p>
            Showing <span className="font-bold text-navy">{filtered.length}</span> of{" "}
            {PROPERTIES.length} properties
          </p>
        </div>
      </div>

      {/* Mobile filter trigger */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setShowFilters(true)}
          className={cn(
            "flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-sm font-semibold transition-colors",
            hasFilters
              ? "border-gold bg-gold/5 text-gold"
              : "border-navy-100 bg-white text-navy"
          )}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {hasFilters ? "Filters Active" : "Filter Properties"}
          </span>
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile filter bottom sheet */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-navy-950/50 backdrop-blur-sm md:hidden"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-3xl bg-cream p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:hidden"
            >
              <div className="mb-4 h-1 w-12 rounded-full bg-navy-200 mx-auto" />
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-lg font-bold text-navy">Filters</h3>
                {hasFilters && (
                  <button onClick={resetFilters} className="text-xs font-semibold text-gold uppercase tracking-wider">
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Name or location..."
                      className="w-full rounded-xl border border-navy-100 bg-white py-3 pl-11 pr-4 text-sm text-navy placeholder:text-navy-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Area
                  </label>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {AREAS.map((a) => (
                      <button
                        key={a}
                        onClick={() => setArea(a)}
                        className={cn(
                          "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all",
                          area === a
                            ? "border-gold bg-gold text-navy"
                            : "border-navy-100 bg-white text-navy hover:border-gold"
                        )}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Type
                  </label>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={cn(
                          "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all",
                          type === t
                            ? "border-gold bg-gold text-navy"
                            : "border-navy-100 bg-white text-navy hover:border-gold"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Sort
                  </label>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {SORT_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => setSort(o.value)}
                        className={cn(
                          "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all",
                          sort === o.value
                            ? "border-gold bg-gold text-navy"
                            : "border-navy-100 bg-white text-navy hover:border-gold"
                        )}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="mt-6 w-full btn-gold"
              >
                Show {filtered.length} {filtered.length === 1 ? 'Property' : 'Properties'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-navy-200 bg-white py-20 text-center"
        >
          <SlidersHorizontal className="mx-auto h-12 w-12 text-navy-200" />
          <h3 className="mt-4 font-serif text-2xl font-bold text-navy">No Properties Found</h3>
          <p className="mt-2 text-navy-400">Try adjusting your filters or search terms.</p>
          <button
            onClick={resetFilters}
            className="mt-6 btn-gold"
          >
            Reset Filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
