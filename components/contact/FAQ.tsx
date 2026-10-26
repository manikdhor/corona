"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminCategory } from "@/lib/admin/seed";

const DEFAULT_FAQS = [
  {
    q: "Are all Corona Properties plots fully documented?",
    a: "Yes, every single plot we sell comes with complete documentation and verified titles. We never list plots without proper paperwork — that's our core promise.",
    category: "Legal",
  },
  {
    q: "What payment plans do you offer?",
    a: "We offer flexible payment plans including installment options spread across 12-36 months, depending on the project. Many plots also qualify for bank financing through our partner banks. Contact us for project-specific plans.",
    category: "Financing",
  },
  {
    q: "Can non-resident Bangladeshis (NRBs) buy land from Corona Properties?",
    a: "Absolutely. We have extensive experience serving NRB clients worldwide. Our dedicated team handles remote verification, digital documentation, and secure transactions. We also offer property management services for overseas owners.",
    category: "NRB Services",
  },
  {
    q: "Do you provide legal verification for the plots?",
    a: "Yes, legal verification is included at no extra cost for every purchase. Our in-house legal team conducts thorough title verification, mutation checks, and ensures complete documentation before handover.",
    category: "Legal",
  },
  {
    q: "What happens after I purchase a plot?",
    a: "After purchase, we handle mutation, ownership transfer, and all documentation. You also receive lifetime after-sales support including construction advisory, resale assistance, and dedicated account management.",
    category: "Handover & Support",
  },
  {
    q: "Can I visit a plot before making a decision?",
    a: "Yes, we encourage site visits. Book a free site visit through our contact form or by calling us. Our team will arrange a guided tour, answer your questions, and help you evaluate the plot firsthand.",
    category: "Site Visits",
  },
];

export interface FAQProps {
  items?: {
    id?: string;
    question?: string;
    answer?: string;
    category?: string;
    q?: string;
    a?: string;
  }[];
  categories?: AdminCategory[];
}

export default function FAQ({ items, categories }: FAQProps) {
  const list = useMemo(
    () =>
      items && items.length > 0
        ? items.map((item) => ({
            q: item.question || item.q || "",
            a: item.answer || item.a || "",
            category: item.category || "General",
          }))
        : DEFAULT_FAQS,
    [items]
  );

  const [selectedCat, setSelectedCat] = useState("All");
  const [open, setOpen] = useState<number | null>(0);

  const categoryTabs = useMemo(() => {
    const distinctFromItems = Array.from(
      new Set(list.map((i) => i.category).filter(Boolean))
    );
    const activeCats = (categories || [])
      .filter((c) => c.isActive && distinctFromItems.includes(c.name))
      .map((c) => c.name);
    const merged = Array.from(new Set([...activeCats, ...distinctFromItems]));
    return merged.length > 1 ? ["All", ...merged] : [];
  }, [categories, list]);

  const filteredList = useMemo(() => {
    if (selectedCat === "All") return list;
    return list.filter((i) => i.category === selectedCat);
  }, [list, selectedCat]);

  return (
    <div className="mx-auto max-w-3xl">
      {categoryTabs.length > 1 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categoryTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCat(cat);
                setOpen(0);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                selectedCat === cat
                  ? "bg-gradient-gold text-navy shadow-gold"
                  : "bg-white text-navy hover:bg-navy-50 shadow-card"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {filteredList.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={cn(
                "overflow-hidden rounded-2xl border bg-white transition-all duration-300",
                isOpen ? "border-gold shadow-card" : "border-navy-50"
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left"
                aria-expanded={isOpen}
              >
                <span
                  className={cn(
                    "font-serif text-lg font-bold transition-colors",
                    isOpen ? "text-gold-600" : "text-navy"
                  )}
                >
                  {faq.q}
                </span>
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                    isOpen ? "bg-gradient-gold text-navy rotate-180" : "bg-navy-50 text-navy"
                  )}
                >
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-6 pb-6 leading-relaxed text-navy-400">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
