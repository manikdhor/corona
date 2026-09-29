"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  HeartPulse,
  Landmark,
  Trophy,
  Waves,
  Trees,
  Store,
  Zap,
  ShieldCheck,
  Fuel,
  Dumbbell,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { getActiveProject, mapAdminPropertyToProject } from "@/lib/projects";
import type { AdminProperty } from "@/lib/admin/seed";
import DynamicIcon from "@/components/ui/DynamicIcon";

interface ProjectShowcaseProps {
  adminProperties?: AdminProperty[];
}

export default function ProjectShowcase({ adminProperties }: ProjectShowcaseProps = {}) {
  const activeProject = getActiveProject();
  const flagshipAdmin =
    adminProperties?.find((p) => p.isFlagship || p.slug === activeProject.slug || p.slug === "maple-leaf-garden-city") ||
    adminProperties?.[0];
  const project = flagshipAdmin
    ? mapAdminPropertyToProject(flagshipAdmin, activeProject)
    : activeProject;

  return (
    <section id="project" className="section-padding relative overflow-hidden bg-cream">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/[0.05] blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-navy/[0.03] blur-3xl" />

      <div className="container-luxury relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow justify-center">Flagship Project</span>
            <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
              {project.name}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-navy-400">{project.subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {project.specs.map((spec) => (
              <div key={spec.label} className="rounded-xl border border-navy-50 bg-white p-5 text-center">
                {spec.icon && (
                  <div className="flex justify-center mb-1.5">
                    <DynamicIcon name={spec.icon} className="h-5 w-5 text-gold-600" />
                  </div>
                )}
                <p className="font-serif text-xl md:text-2xl font-bold text-gradient-gold">{spec.value}</p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.15em] text-navy-400">{spec.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6"
          >
            {project.amenities.slice(0, 6).map((amenity) => (
              <div key={amenity.id} className="flex items-center gap-2 text-sm text-navy">
                <DynamicIcon name={amenity.icon} className="h-4 w-4 text-gold" />
                <span className="font-medium">{amenity.name}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button href={`/projects/${project.slug}`} variant="gold" showArrow>
              Explore Project
            </Button>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-navy transition-colors hover:text-gold-600"
            >
              Book a Site Visit
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
