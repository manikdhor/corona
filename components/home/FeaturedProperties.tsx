"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import PropertyCard from "@/components/property/PropertyCard";
import { getFeaturedProperties } from "@/lib/data";

export default function FeaturedProperties() {
  const featured = getFeaturedProperties();

  return (
    <section className="section-padding bg-navy-50/40 relative overflow-hidden">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/[0.05] blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-navy/[0.03] blur-3xl" />

      <div className="container-luxury relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <SectionHeading eyebrow="Featured Listings" title="Signature Land Collections"
            subtitle="Handpicked residential plots in Bangladesh's most prestigious locations — each one a rare opportunity."
            align="left" className="md:max-w-2xl" />
          <Link href="/properties"
            className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-navy transition-colors hover:text-gold-600 shrink-0">
            View All Properties
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="mt-16 text-center">
          <p className="text-navy-400 mb-4">Can't find what you're looking for? We have exclusive off-market listings.</p>
          <Link href="/contact"
            className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-600 transition-colors hover:text-navy">
            Contact Our Specialists
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
