"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Maximize2, ArrowUpRight, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";

const statusStyles: Record<Project["status"], string> = {
  available: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  launching: "bg-gold/15 text-gold-700 border-gold/30",
  "almost-sold": "bg-rose-500/15 text-rose-700 border-rose-500/30",
  completed: "bg-navy/10 text-navy border-navy/20",
};

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/projects/${project.slug}`}>
          <Image
            src={project.heroImage}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-85" />

        <div className="absolute top-4 left-4">
          <span className={cn("rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm", statusStyles[project.status])}>
            {project.status.replace("-", " ")}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-serif text-xl font-bold text-cream group-hover:text-gold-champagne transition-colors">
            <Link href={`/projects/${project.slug}`}>{project.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-cream/80 line-clamp-1">{project.tagline}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-cream/70">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            {project.location}
          </div>
        </div>

        <Link
          href={`/projects/${project.slug}`}
          className="absolute bottom-5 right-5 flex h-11 w-11 translate-y-4 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 text-navy opacity-0 shadow-gold transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`View ${project.name}`}
        >
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="p-6">
        <p className="text-sm text-navy-400 line-clamp-2">{project.subtitle}</p>
        <div className="mt-5 flex items-center justify-between border-t border-navy-50 pt-4">
          <div className="flex items-center gap-2 text-sm text-navy">
            <Maximize2 className="h-4 w-4 text-gold" />
            <span className="font-semibold">{project.totalPlots.toLocaleString()} Plots</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <BadgeCheck className="h-4 w-4" />
            RAJUK Approved
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}
