"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Are all Corona Properties plots fully approved?",
    a: "Yes, every single plot we sell comes with full approval and clear legal documentation. We never list plots without verified titles and proper approvals — that's our core promise.",
  },
  {
    q: "What payment plans do you offer?",
    a: "We offer flexible payment plans including installment options spread across 12-36 months, depending on the project. Many plots also qualify for bank financing through our partner banks. Contact us for project-specific plans.",
  },
  {
    q: "Can non-resident Bangladeshis (NRBs) buy land from Corona Properties?",
    a: "Absolutely. We have extensive experience serving NRB clients worldwide. Our dedicated team handles remote verification, digital documentation, and secure transactions. We also offer property management services for overseas owners.",
  },
  {
    q: "Do you provide legal verification for the plots?",
    a: "Yes, legal verification is included at no extra cost for every purchase. Our in-house legal team conducts thorough title verification, mutation checks, and ensures complete documentation before handover.",
  },
  {
    q: "What happens after I purchase a plot?",
    a: "After purchase, we handle mutation, ownership transfer, and all documentation. You also receive lifetime after-sales support including construction advisory, resale assistance, and dedicated account management.",
  },
  {
    q: "Can I visit a plot before making a decision?",
    a: "Yes, we encourage site visits. Book a free site visit through our contact form or by calling us. Our team will arrange a guided tour, answer your questions, and help you evaluate the plot firsthand.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-4">
        {FAQS.map((faq, i) => {
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
                <span className={cn(
                  "font-serif text-lg font-bold transition-colors",
                  isOpen ? "text-gold-600" : "text-navy"
                )}>
                  {faq.q}
                </span>
                <span className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                  isOpen ? "bg-gradient-gold text-navy rotate-180" : "bg-navy-50 text-navy"
                )}>
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
