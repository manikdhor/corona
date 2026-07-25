"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Maximize, ArrowUpRight, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Property } from "@/lib/data";

const statusColors: Record<Property["status"], string> = {
  Available: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  "New Launch": "bg-gold/15 text-gold-700 border-gold/30",
  "Almost Sold Out": "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Featured: "bg-navy/10 text-navy border-navy/20",
};

const typeColors: Record<Property["type"], string> = {
  Exclusive: "bg-gradient-to-r from-gold-300 to-gold-600 text-navy",
  Premium: "bg-navy text-cream",
  Standard: "bg-cream text-navy border border-navy/10",
  Investment: "bg-emerald-700 text-cream",
};

export default function PropertyCard({ property, index = 0 }: { property: Property; index?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1.5">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/properties/${property.slug}`}>
          <Image src={property.image} alt={property.title} fill
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-85" />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={cn("rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm", statusColors[property.status])}>
            {property.status}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={cn("rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider", typeColors[property.type])}>
            {property.type}
          </span>
        </div>

        <Link href={`/properties/${property.slug}`}
          className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-4 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 text-navy opacity-0 shadow-gold transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`View ${property.title}`}>
          <ArrowUpRight className="h-5 w-5" />
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-2xl font-bold text-cream font-serif">{property.price}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-xl font-bold text-navy transition-colors group-hover:text-gold-600">
          <Link href={`/properties/${property.slug}`}>{property.title}</Link>
        </h3>
        <div className="mt-2 flex items-center gap-2 text-sm text-navy-400">
          <MapPin className="h-4 w-4 text-gold" />
          {property.location}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-navy-50 pt-4">
          <div className="flex items-center gap-2 text-sm text-navy">
            <Maximize className="h-4 w-4 text-gold" />
            <span className="font-semibold">{property.size}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <BadgeCheck className="h-4 w-4" />
            RAJUK Approved
          </div>
        </div>
      </div>
      {/* Bottom gold accent on hover */}
      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}
