"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PropertyForm from "@/components/admin/properties/PropertyForm";
import { getPropertyAction } from "@/lib/admin/actions";
import { AdminProperty } from "@/lib/admin/seed";
import { Loader2 } from "lucide-react";

export default function EditPropertyPage() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<AdminProperty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const prop = await getPropertyAction(id);
        if (isMounted) {
          setProperty(prop || null);
        }
      } catch {
        if (isMounted) setProperty(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="rounded-2xl border border-navy-100 bg-white p-12 text-center space-y-3">
        <h2 className="font-serif text-xl font-bold text-navy">Property Not Found</h2>
        <p className="text-xs text-navy-400">The requested property ID or slug &quot;{id}&quot; does not exist.</p>
      </div>
    );
  }

  return <PropertyForm initialData={property} isNew={false} />;
}
