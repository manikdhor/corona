"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  CheckCircle,
  Eye,
  ArrowLeft,
  Sparkles,
  Building,
  Image as ImageIcon,
  Globe,
  Sliders,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  HeartPulse,
  Layout,
  FileText,
  Type,
  MapPin,
  Phone,
  Mail,
  Download,
} from "lucide-react";
import RichTextEditor from "@/components/admin/editor/RichTextEditor";
import ImageInput from "@/components/admin/media/ImageInput";
import FileUploadInput from "@/components/admin/media/FileUploadInput";
import GalleryManager from "@/components/admin/media/GalleryManager";
import IconPicker from "@/components/admin/icons/IconPicker";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { AdminProperty, AdminCategory, CustomFieldDef, adminStore } from "@/lib/admin/seed";
import {
  savePropertyAction,
  getCategoriesAction,
  getAgentsAction,
  getCustomFieldsAction,
} from "@/lib/admin/actions";

interface PropertyFormProps {
  initialData?: AdminProperty;
  isNew?: boolean;
}

export default function PropertyForm({ initialData, isNew = false }: PropertyFormProps) {
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "general" | "content" | "specs" | "amenities" | "portfolio" | "assets" | "headings" | "media" | "seo"
  >("general");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");

  // Form State
  const [formData, setFormData] = useState<Partial<AdminProperty>>({
    id: initialData?.id || `prop-${Date.now()}`,
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    titleBn: initialData?.titleBn || "",
    tagline: initialData?.tagline || "",
    taglineBn: initialData?.taglineBn || "",
    location: initialData?.location || "",
    area: initialData?.area || "Purbachal, Dhaka",
    price: initialData?.price || "BDT 35 Lakh - 2.5 Crore",
    priceValue: initialData?.priceValue || 35000000,
    type: initialData?.type || "Exclusive",
    status: initialData?.status || "Available",
    approvalStatus: initialData?.approvalStatus || "Published",
    size: initialData?.size || "5 Katha",
    featuredImage: initialData?.featuredImage || "/image-06.webp",
    gallery: initialData?.gallery || ["/image-02.webp", "/image-03.webp"],
    overview: initialData?.overview || "",
    overviewBn: initialData?.overviewBn || "",
    genesis: initialData?.genesis || "",
    highlights: initialData?.highlights || [
      "Master layout with complete legal documentation",
      "80 ft and 40 ft wide avenues",
      "Gated perimeter with 24/7 security and smart surveillance",
    ],
    features: initialData?.features || [
      "Individually titled residential plots",
      "Underground utility corridors (Power & City-Gas)",
      "Designated green belts, parks, and lakefront promenade",
    ],
    specs:
      initialData?.specs && initialData.specs.length > 0
        ? initialData.specs
        : [
            { label: "Total Plots", value: "2,504", icon: "Building" },
            { label: "Total Area", value: "~90 Acres", icon: "Trees" },
            { label: "Planning Authority", value: "Approved", icon: "ShieldCheck" },
            { label: "Arterial Roads", value: "80 ft / 40 ft", icon: "MapPin" },
          ],
    plotTypes:
      initialData?.plotTypes && initialData.plotTypes.length > 0
        ? initialData.plotTypes
        : [
            { label: "3 Katha Plot", badge: "Entry Luxury", size: "1,800 sq ft", katha: 3, priceNote: "Starting from BDT 35 Lakh" },
            { label: "5 Katha Plot", badge: "Most Popular", size: "3,600 sq ft", katha: 5, priceNote: "Starting from BDT 60 Lakh" },
            { label: "10 Katha Plot", badge: "Premium Choice", size: "7,200 sq ft", katha: 10, priceNote: "Starting from BDT 1.2 Crore" },
            { label: "20 Katha Plot", badge: "Luxury Estate", size: "14,400 sq ft", katha: 20, priceNote: "Custom pricing on request" },
          ],
    totalPlots: initialData?.totalPlots ?? 2504,
    totalArea: initialData?.totalArea || "Approximately 90 Acres",
    roadPrimary: initialData?.roadPrimary || "80 ft Wide Arterial Roads",
    roadSecondary: initialData?.roadSecondary || "40 ft Wide Access Roads",
    coordinates: initialData?.coordinates || { lat: 23.86489, lng: 90.5647 },
    isFlagship: initialData?.isFlagship || false,
    isFeatured: initialData?.isFeatured || true,
    assignedAgentId: initialData?.assignedAgentId || "agent-1",
    customFieldValues: {
      amenities:
        initialData?.customFieldValues?.amenities || [
          { id: "hospital", name: "Central Hospital", icon: "HeartPulse", description: "24/7 multispecialty hospital with emergency care" },
          { id: "mosque", name: "Grand Community Mosque", icon: "Landmark", description: "Handcrafted architecture for 200+ worshippers" },
          { id: "sports", name: "Indoor Sports Complex", icon: "Trophy", description: "Badminton, table tennis, and squash courts" },
          { id: "lake", name: "Signature Lake & Waterbody", icon: "Waves", description: "3-acre landscaped lagoon with promenade" },
          { id: "playground", name: "Children's Playgrounds", icon: "Trees", description: "Age-segregated, secured play zones" },
          { id: "commercial", name: "Premium Commercial High Street", icon: "Store", description: "Retail, café, and F&B corridor" },
          { id: "utilities", name: "Underground Utility Network", icon: "Zap", description: "Clean skyline with no overhead wires" },
          { id: "security", name: "Gated Perimeter & Smart Surveillance", icon: "ShieldCheck", description: "Biometric access points and 24/7 patrols" },
          { id: "fuel", name: "24/7 Fuel Station", icon: "Fuel", description: "CNG and Petrol station inside the community" },
          { id: "fitness", name: "Fitness & Lounge Facilities", icon: "Dumbbell", description: "Premium gymnasium and co-working spaces" },
        ],
      assets: {
        layoutPlan: initialData?.customFieldValues?.assets?.layoutPlan || "/Layout-Plan.pdf",
        brochure: initialData?.customFieldValues?.assets?.brochure || "/brochure-maple-leaf.pdf",
        brochureLabel: initialData?.customFieldValues?.assets?.brochureLabel || "Project Brochure",
        brochureFile: initialData?.customFieldValues?.assets?.brochureFile || "/brochure-maple-leaf.pdf",
        mapHref: initialData?.customFieldValues?.assets?.mapHref || "",
      },
      sectionHeadings: {
        overviewTitle: initialData?.customFieldValues?.sectionHeadings?.overviewTitle || "Overview",
        keyAssetsEyebrow: initialData?.customFieldValues?.sectionHeadings?.keyAssetsEyebrow || "Project Assets",
        keyAssetsTitle: initialData?.customFieldValues?.sectionHeadings?.keyAssetsTitle || "Key Documents & Maps",
        keyAssetsSubtitle: initialData?.customFieldValues?.sectionHeadings?.keyAssetsSubtitle || "Download or view essential project documents for your reference.",
        highlightsTitle: initialData?.customFieldValues?.sectionHeadings?.highlightsTitle || "Highlights",
        featuresTitle: initialData?.customFieldValues?.sectionHeadings?.featuresTitle || "Key Features",
        amenitiesEyebrow: initialData?.customFieldValues?.sectionHeadings?.amenitiesEyebrow || "World-Class Amenities",
        amenitiesTitle: initialData?.customFieldValues?.sectionHeadings?.amenitiesTitle || "Everything You Need",
        amenitiesSubtitle: initialData?.customFieldValues?.sectionHeadings?.amenitiesSubtitle || "A community is defined by what it offers its residents.",
        plotPortfolioTitle: initialData?.customFieldValues?.sectionHeadings?.plotPortfolioTitle || "Plot Portfolio",
        plotPortfolioSubtitle: initialData?.customFieldValues?.sectionHeadings?.plotPortfolioSubtitle || "Explore our range of premium residential and commercial plot sizes",
        storyTitle: initialData?.customFieldValues?.sectionHeadings?.storyTitle || "",
        storySubtitle: initialData?.customFieldValues?.sectionHeadings?.storySubtitle || "",
        contactTitle: initialData?.customFieldValues?.sectionHeadings?.contactTitle || "Interested in this project?",
        contactSubtitle: initialData?.customFieldValues?.sectionHeadings?.contactSubtitle || "Book a site visit or request a callback. Our team responds within 24 hours.",
        contactPhone: initialData?.customFieldValues?.sectionHeadings?.contactPhone || "+880 1711 500 000",
        contactEmail: initialData?.customFieldValues?.sectionHeadings?.contactEmail || "info@coronapropertiesbd.com",
        contactCtaText: initialData?.customFieldValues?.sectionHeadings?.contactCtaText || "Book Site Visit",
        contactCtaHref: initialData?.customFieldValues?.sectionHeadings?.contactCtaHref || "/contact",
        locationTitle: initialData?.customFieldValues?.sectionHeadings?.locationTitle || "Location",
      },
    },
  });

  // SEO State
  const [metaTitle, setMetaTitle] = useState(initialData?.title || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.tagline || "Corona Properties — Ultra Luxury Residential Plots in Bangladesh."
  );
  const [focusKeyword, setFocusKeyword] = useState("residential plots Dhaka");

  // Status message
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [agents, setAgents] = useState(adminStore.getAgents());
  const [typeCats, setTypeCats] = useState<AdminCategory[]>([]);
  const [statusCats, setStatusCats] = useState<AdminCategory[]>([]);
  const [areaCats, setAreaCats] = useState<AdminCategory[]>([]);
  const [amenityCats, setAmenityCats] = useState<AdminCategory[]>([]);
  const [customFieldDefs, setCustomFieldDefs] = useState<CustomFieldDef[]>([]);

  React.useEffect(() => {
    Promise.all([
      getCategoriesAction(),
      getAgentsAction(),
      getCustomFieldsAction(),
    ]).then(([cats, ags, cFields]) => {
      if (cats && cats.length > 0) {
        setTypeCats(cats.filter((c) => c.scope === "property_type" && c.isActive));
        setStatusCats(cats.filter((c) => c.scope === "property_status" && c.isActive));
        setAreaCats(cats.filter((c) => c.scope === "property_area" && c.isActive));
        setAmenityCats(cats.filter((c) => c.scope === "amenity" && c.isActive));
      }
      if (ags && ags.length > 0) setAgents(ags);
      if (cFields) setCustomFieldDefs(cFields);
    });
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updates: any = { title: val };
      if (isNew && !prev.slug) {
        updates.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      }
      return { ...prev, ...updates };
    });
  };

  const handleSave = async (publishStatus?: any) => {
    setErrorMsg("");
    setSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        ...formData,
        approvalStatus: publishStatus || formData.approvalStatus,
      };

      const result = await savePropertyAction(payload);
      if (!result.success) {
        setErrorMsg(result.error || "Failed to save property");
        setSaving(false);
        return;
      }

      setSaveSuccess(true);
      setSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000);

      router.refresh();

      if (isNew) {
        router.push(`/admin/properties/${result.property?.id}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
      setSaving(false);
    }
  };

  // --- HIGHLIGHTS HANDLERS ---
  const handleAddHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), "New landmark highlight"],
    }));
  };

  const handleUpdateHighlight = (idx: number, val: string) => {
    setFormData((prev) => {
      const copy = [...(prev.highlights || [])];
      copy[idx] = val;
      return { ...prev, highlights: copy };
    });
  };

  const handleRemoveHighlight = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== idx),
    }));
  };

  // --- FEATURES HANDLERS ---
  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), "New premium project feature"],
    }));
  };

  const handleUpdateFeature = (idx: number, val: string) => {
    setFormData((prev) => {
      const copy = [...(prev.features || [])];
      copy[idx] = val;
      return { ...prev, features: copy };
    });
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== idx),
    }));
  };

  // --- SPECS & STATS HANDLERS ---
  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...(prev.specs || []), { label: "New Metric", value: "Value", icon: "Sparkles" }],
    }));
  };

  const handleUpdateSpec = (idx: number, field: string, val: string) => {
    setFormData((prev) => {
      const copy = [...(prev.specs || [])];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, specs: copy };
    });
  };

  const handleRemoveSpec = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: (prev.specs || []).filter((_, i) => i !== idx),
    }));
  };

  // --- AMENITIES HANDLERS ---
  const amenitiesList: any[] = formData.customFieldValues?.amenities || [];
  const handleAddAmenity = () => {
    const newAmenity = {
      id: `amenity-${Date.now()}`,
      name: "New Amenity",
      icon: "Sparkles",
      description: "Description of luxury amenity",
    };
    setFormData((prev) => ({
      ...prev,
      customFieldValues: {
        ...prev.customFieldValues,
        amenities: [...(prev.customFieldValues?.amenities || []), newAmenity],
      },
    }));
  };

  const handleUpdateAmenity = (idx: number, field: string, val: string) => {
    setFormData((prev) => {
      const copy = [...(prev.customFieldValues?.amenities || [])];
      copy[idx] = { ...copy[idx], [field]: val };
      return {
        ...prev,
        customFieldValues: {
          ...prev.customFieldValues,
          amenities: copy,
        },
      };
    });
  };

  const handleRemoveAmenity = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      customFieldValues: {
        ...prev.customFieldValues,
        amenities: (prev.customFieldValues?.amenities || []).filter((_: any, i: number) => i !== idx),
      },
    }));
  };

  // --- PLOT TYPES HANDLERS ---
  const plotTypesList: any[] = formData.plotTypes || [];
  const handleAddPlotType = () => {
    const newPlot = {
      label: "5 Katha Plot",
      badge: "Exclusive",
      size: "3,600 sq ft",
      katha: 5,
      priceNote: "Starting price on request",
    };
    setFormData((prev) => ({
      ...prev,
      plotTypes: [...(prev.plotTypes || []), newPlot],
    }));
  };

  const handleUpdatePlotType = (idx: number, field: string, val: any) => {
    setFormData((prev) => {
      const copy = [...(prev.plotTypes || [])];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, plotTypes: copy };
    });
  };

  const handleRemovePlotType = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      plotTypes: (prev.plotTypes || []).filter((_: any, i: number) => i !== idx),
    }));
  };

  // --- ASSETS & HEADINGS HELPERS ---
  const assetsState = formData.customFieldValues?.assets || {};
  const handleUpdateAsset = (field: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      customFieldValues: {
        ...prev.customFieldValues,
        assets: {
          ...prev.customFieldValues?.assets,
          [field]: val,
        },
      },
    }));
  };

  const headingsState = formData.customFieldValues?.sectionHeadings || {};
  const handleUpdateHeading = (field: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      customFieldValues: {
        ...prev.customFieldValues,
        sectionHeadings: {
          ...prev.customFieldValues?.sectionHeadings,
          [field]: val,
        },
      },
    }));
  };

  const TABS = [
    { id: "general", label: "Core Details", icon: Building },
    { id: "content", label: "Story & Overview", icon: Sparkles },
    { id: "specs", label: "Stats & Highlights", icon: Sliders },
    { id: "amenities", label: "Amenities", icon: HeartPulse },
    { id: "portfolio", label: "Plot Portfolio", icon: Layout },
    { id: "assets", label: "Assets & Maps", icon: FileText },
    { id: "headings", label: "Section Headings", icon: Type },
    { id: "media", label: "Gallery & Photos", icon: ImageIcon },
    { id: "seo", label: "SEO & Meta", icon: Globe },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* TOP HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy-100 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-navy-200 text-navy-600 hover:bg-navy-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-navy">
                {isNew ? "Create New Property" : `Edit: ${formData.title}`}
              </h1>
              {formData.isFlagship && (
                <span className="rounded bg-gold px-2 py-0.5 text-[10px] font-black uppercase text-navy">
                  Flagship
                </span>
              )}
            </div>
            <p className="text-xs text-navy-400 mt-0.5">
              Slug: <code className="font-mono text-navy-700">/{formData.slug || "new-property"}</code>
            </p>
          </div>
        </div>

        {/* Save & Publish Buttons */}
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 animate-fade-in">
              <CheckCircle className="h-4 w-4" /> Saved successfully
            </span>
          )}
          {errorMsg && (
            <span className="flex items-center gap-1 text-xs font-semibold text-red-600 animate-fade-in max-w-xs truncate">
              <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
            </span>
          )}

          {!isNew && (
            <Link
              href={`/projects/${formData.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-navy-200 px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition"
            >
              <Eye className="h-3.5 w-3.5" /> View Public Page
            </Link>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("Draft")}
            className="rounded-xl border border-navy-300 px-3.5 py-2 text-xs font-semibold text-navy-800 hover:bg-slate-50 transition disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("Published")}
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" /> Save & Publish
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex overflow-x-auto border-b border-navy-100 bg-white rounded-2xl px-2 shadow-xs scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3.5 px-3.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                isActive
                  ? "border-navy text-navy font-bold"
                  : "border-transparent text-navy-400 hover:text-navy-700"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-gold" : "text-navy-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: CORE DETAILS */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 rounded-2xl bg-white p-6 shadow-xs border border-navy-100">
            <h3 className="font-serif text-base font-bold text-navy">Identity & Classification</h3>

            <div>
              <label className="text-xs font-semibold text-navy-700 block mb-1">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Maple Leaf Garden City"
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs focus:border-gold outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="maple-leaf-garden-city"
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-navy-700">
                    Area / Micro-location <span className="text-red-500">*</span>
                  </label>
                  <Link
                    href="/admin/categories"
                    className="text-[10px] font-semibold text-gold-700 hover:underline"
                  >
                    Manage Areas
                  </Link>
                </div>
                <input
                  type="text"
                  list="property-area-options"
                  value={formData.area || ""}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g. Purbachal Sector 4"
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
                />
                <datalist id="property-area-options">
                  {(areaCats.length > 0
                    ? areaCats.map((c) => c.name)
                    : ["Purbachal", "Gulshan", "Banani", "Baridhara", "Uttara", "Dhanmondi", "Bashundhara"]
                  ).map((areaName) => (
                    <option key={areaName} value={areaName} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-700 block mb-1">
                Full Address / Location String <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Purbachal, Dhaka — Bholabo Union"
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-700 block mb-1">
                Hero Tagline / Subtitle
              </label>
              <input
                type="text"
                value={formData.tagline || ""}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Where Maple Canopy Meets Bangladeshi Aspiration"
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">
                  Display Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. BDT 35 Lakh - 2.5 Crore"
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">
                  Typical / Base Size <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.size || ""}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g. 3, 5, 10 & 20 Katha"
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right sidebar options */}
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-xs border border-navy-100">
            <h3 className="font-serif text-base font-bold text-navy">Publishing Controls</h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-navy-700">Market Status</label>
                <Link
                  href="/admin/categories"
                  className="text-[10px] font-semibold text-gold-700 hover:underline"
                >
                  Manage Statuses
                </Link>
              </div>
              <select
                value={formData.status || "Available"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
              >
                {(statusCats.length > 0
                  ? Array.from(new Set([...statusCats.map((c) => c.name), formData.status || "Available"]))
                  : ["Available", "New Launch", "Almost Sold Out", "Featured", "Sold Out"]
                ).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-navy-700">Project Category</label>
                <Link
                  href="/admin/categories"
                  className="text-[10px] font-semibold text-gold-700 hover:underline"
                >
                  Manage Categories
                </Link>
              </div>
              <select
                value={formData.type || "Exclusive"}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
              >
                {(typeCats.length > 0
                  ? Array.from(new Set([...typeCats.map((c) => c.name), formData.type || "Exclusive"]))
                  : ["Exclusive", "Premium", "Standard", "Investment"]
                ).map((tp) => (
                  <option key={tp} value={tp}>
                    {tp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-700 block mb-1">Assigned Agent</label>
              <select
                value={formData.assignedAgentId || "agent-1"}
                onChange={(e) => setFormData({ ...formData, assignedAgentId: e.target.value })}
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
              >
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name} ({ag.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-navy-50">
              <label className="flex items-center gap-2 text-xs font-semibold text-navy-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFlagship || false}
                  onChange={(e) => setFormData({ ...formData, isFlagship: e.target.checked })}
                  className="rounded text-gold focus:ring-gold"
                />
                Flagship Project (Signature Banner)
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-navy-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured || false}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-gold focus:ring-gold"
                />
                Featured on Homepage
              </label>
            </div>

            {/* Featured Image Quick Slot */}
            <div className="pt-3 border-t border-navy-50">
              <ImageInput
                label="Primary Featured Cover / Hero"
                value={formData.featuredImage || ""}
                onChange={(url) => setFormData({ ...formData, featuredImage: url })}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW & BILINGUAL STORYTELLING */}
      {activeTab === "content" && (
        <div className="space-y-6 rounded-2xl bg-white p-6 shadow-xs border border-navy-100">
          <div className="flex items-center justify-between border-b border-navy-100 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-navy">
                Bilingual Storytelling & Overview
              </h3>
              <p className="text-xs text-navy-400">
                Write long-form description and the founding story behind the project.
              </p>
            </div>

            <div className="flex items-center rounded-xl bg-navy-50 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLangTab("en")}
                className={`px-3 py-1 rounded-lg transition ${
                  langTab === "en" ? "bg-navy text-gold shadow-xs" : "text-navy-500 hover:text-navy-900"
                }`}
              >
                English Version
              </button>
              <button
                type="button"
                onClick={() => setLangTab("bn")}
                className={`px-3 py-1 rounded-lg transition ${
                  langTab === "bn" ? "bg-navy text-gold shadow-xs" : "text-navy-500 hover:text-navy-900"
                }`}
              >
                বাংলা সংস্করণ
              </button>
            </div>
          </div>

          {langTab === "en" ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1.5">
                  Full Project Overview (English)
                </label>
                <RichTextEditor
                  content={formData.overview || ""}
                  onChange={(html) => setFormData({ ...formData, overview: html })}
                  placeholder="Describe the architectural concept, boulevards, security, lifestyle amenities..."
                  draftKey={`prop_${formData.slug}_en`}
                  minHeight="320px"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">
                  Genesis & Project Background (The Story Behind...)
                </label>
                <textarea
                  rows={4}
                  placeholder="The origin story behind this master enclave..."
                  value={formData.genesis || ""}
                  onChange={(e) => setFormData({ ...formData, genesis: e.target.value })}
                  className="w-full rounded-xl border border-navy-200 p-3 text-xs outline-none focus:border-gold"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">
                  প্রকল্পের শিরোনাম (বাংলা)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ম্যাপল লিফ গার্ডেন সিটি"
                  value={formData.titleBn || ""}
                  onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">
                  ট্যাগলাইন (বাংলা)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: কানাডার স্বপ্ন, বাংলাদেশের মাটিতে"
                  value={formData.taglineBn || ""}
                  onChange={(e) => setFormData({ ...formData, taglineBn: e.target.value })}
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1.5">
                  সম্পূর্ণ বিবরণ ও পরিচিতি (বাংলা)
                </label>
                <RichTextEditor
                  content={formData.overviewBn || ""}
                  onChange={(html) => setFormData({ ...formData, overviewBn: html })}
                  placeholder="প্রকল্পের বিস্তারিত সুযোগ সুবিধা এবং রূপরেখা লিখুন..."
                  draftKey={`prop_${formData.slug}_bn`}
                  minHeight="320px"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STATS, SPECS, HIGHLIGHTS & FEATURES */}
      {activeTab === "specs" && (
        <div className="space-y-6">
          {/* Key Stats Cards (Specs with Icon) */}
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-navy">Project Key Stats & Metrics</h3>
                <p className="text-xs text-navy-400">
                  Displayed as prominent metric cards with dynamic icons on the project page.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSpec}
                className="flex items-center gap-1 rounded-lg bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-gold hover:text-navy transition"
              >
                <Plus className="h-3.5 w-3.5" /> Add Stat Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(formData.specs || []).map((spec, idx) => (
                <div key={idx} className="relative rounded-xl border border-navy-100 p-4 space-y-3 bg-navy-50/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
                      Card #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="text-navy-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-navy-600 block mb-1">Icon</label>
                    <IconPicker
                      value={spec.icon || "Sparkles"}
                      onChange={(iconName) => handleUpdateSpec(idx, "icon", iconName)}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-navy-600 block mb-1">Value (e.g. 2,504)</label>
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                      className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs font-bold text-navy focus:border-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-navy-600 block mb-1">Label (e.g. Total Plots)</label>
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => handleUpdateSpec(idx, "label", e.target.value)}
                      className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs uppercase tracking-wider text-navy-600 focus:border-gold outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Highlights List */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-navy">Project Highlights</h3>
                  <p className="text-xs text-navy-400">Card-style bullet points with gold checkmarks.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="flex items-center gap-1 text-xs font-semibold text-gold-700 hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Point
                </button>
              </div>

              <div className="space-y-2">
                {(formData.highlights || []).map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-800 text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={hl}
                      onChange={(e) => handleUpdateHighlight(idx, e.target.value)}
                      className="flex-1 rounded-xl border border-navy-200 px-3 py-1.5 text-xs focus:border-gold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="p-1.5 text-navy-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features List */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-navy">Key Features</h3>
                  <p className="text-xs text-navy-400">Detailed master plan & infrastructure bullets.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="flex items-center gap-1 text-xs font-semibold text-gold-700 hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Feature
                </button>
              </div>

              <div className="space-y-2">
                {(formData.features || []).map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-gold-600" />
                    <input
                      type="text"
                      value={f}
                      onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                      className="flex-1 rounded-xl border border-navy-200 px-3 py-1.5 text-xs focus:border-gold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-1.5 text-navy-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Infrastructure Specs */}
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
            <h3 className="font-serif text-base font-bold text-navy">Infrastructure & Engineering Specs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">
                  Primary Arterial Road
                </label>
                <input
                  type="text"
                  placeholder="80 ft Wide Arterial Roads"
                  value={formData.roadPrimary || ""}
                  onChange={(e) => setFormData({ ...formData, roadPrimary: e.target.value })}
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">
                  Secondary Internal Road
                </label>
                <input
                  type="text"
                  placeholder="40 ft Wide Access Roads"
                  value={formData.roadSecondary || ""}
                  onChange={(e) => setFormData({ ...formData, roadSecondary: e.target.value })}
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">
                  Total Plots Count
                </label>
                <input
                  type="number"
                  placeholder="2504"
                  value={formData.totalPlots || ""}
                  onChange={(e) => setFormData({ ...formData, totalPlots: Number(e.target.value) })}
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">
                  Total Land Area
                </label>
                <input
                  type="text"
                  placeholder="Approximately 90 Acres"
                  value={formData.totalArea || ""}
                  onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
                />
              </div>
            </div>

            {customFieldDefs.length > 0 && (
              <div className="pt-4 border-t border-navy-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
                    Custom Property Attributes
                  </h4>
                  <Link
                    href="/admin/settings/custom-fields"
                    className="text-[10px] font-semibold text-gold-700 hover:underline"
                  >
                    Configure Custom Fields
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {customFieldDefs.map((field) => {
                    const fieldKey = field.key || field.name;
                    const currentVal = formData.customFieldValues?.[fieldKey] ?? "";
                    const setCustomVal = (val: any) =>
                      setFormData((prev) => ({
                        ...prev,
                        customFieldValues: {
                          ...prev.customFieldValues,
                          [fieldKey]: val,
                        },
                      }));
                    return (
                      <div key={field.id}>
                        <label className="text-xs font-semibold text-navy-700 block mb-1">
                          {field.label} {(field.isRequired || field.required) && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === "select" ? (
                          <select
                            value={currentVal}
                            onChange={(e) => setCustomVal(e.target.value)}
                            className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs focus:border-gold outline-none"
                          >
                            <option value="">Select {field.label}...</option>
                            {(field.options || []).map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "boolean" ? (
                          <label className="flex items-center gap-2 pt-2 text-xs text-navy-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(currentVal)}
                              onChange={(e) => setCustomVal(e.target.checked)}
                              className="rounded text-gold focus:ring-gold"
                            />
                            Yes / Enabled
                          </label>
                        ) : (
                          <input
                            type={field.type === "number" ? "number" : "text"}
                            value={currentVal}
                            onChange={(e) =>
                              setCustomVal(
                                field.type === "number" ? Number(e.target.value) : e.target.value
                              )
                            }
                            placeholder={field.label}
                            className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: WORLD-CLASS AMENITIES */}
      {activeTab === "amenities" && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-6">
          <div className="flex items-center justify-between border-b border-navy-100 pb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-navy">
                World-Class Amenities Manager ({amenitiesList.length})
              </h3>
              <p className="text-xs text-navy-400">
                Add, edit, or select icons from 200+ icons for each community facility.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddAmenity}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-3.5 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
            >
              <Plus className="h-4 w-4" /> Add Amenity
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenitiesList.map((a: any, idx: number) => (
              <div
                key={a.id || idx}
                className="relative rounded-2xl border border-navy-100 bg-white p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold-700">
                      <DynamicIcon name={a.icon} className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-bold text-navy">#{idx + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(idx)}
                    className="p-1 text-navy-400 hover:text-red-500 rounded transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-navy-600 block mb-1">
                    Amenity Name
                  </label>
                  <input
                    type="text"
                    value={a.name || ""}
                    onChange={(e) => handleUpdateAmenity(idx, "name", e.target.value)}
                    placeholder="e.g. Central Hospital"
                    className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-semibold text-navy-600">
                      Amenity Category
                    </label>
                    <Link
                      href="/admin/categories"
                      className="text-[10px] font-semibold text-gold-700 hover:underline"
                    >
                      Manage
                    </Link>
                  </div>
                  <select
                    value={a.category || ""}
                    onChange={(e) => handleUpdateAmenity(idx, "category", e.target.value)}
                    className="w-full rounded-xl border border-navy-200 px-2.5 py-1.5 text-xs text-navy focus:border-gold outline-none"
                  >
                    <option value="">General Facility</option>
                    {(amenityCats.length > 0
                      ? amenityCats.map((c) => c.name)
                      : [
                          "Civic & Healthcare",
                          "Sports & Recreation",
                          "Nature & Parks",
                          "Security & Utilities",
                          "Commercial & Retail",
                        ]
                    ).map((catName) => (
                      <option key={catName} value={catName}>
                        {catName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-navy-600 block mb-1">
                    Icon Selector
                  </label>
                  <IconPicker
                    value={a.icon || "Sparkles"}
                    onChange={(iconName) => handleUpdateAmenity(idx, "icon", iconName)}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-navy-600 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={a.description || ""}
                    onChange={(e) => handleUpdateAmenity(idx, "description", e.target.value)}
                    placeholder="e.g. 24/7 multispecialty emergency care..."
                    className="w-full rounded-xl border border-navy-200 p-2 text-xs text-navy-600 focus:border-gold outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PLOT PORTFOLIO */}
      {activeTab === "portfolio" && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-6">
          <div className="flex items-center justify-between border-b border-navy-100 pb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-navy">
                Plot Portfolio & Sizes ({plotTypesList.length})
              </h3>
              <p className="text-xs text-navy-400">
                Define available Katha plot sizes, badges, area in sq ft, and pricing tags.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPlotType}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-3.5 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
            >
              <Plus className="h-4 w-4" /> Add Plot Type
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plotTypesList.map((plot: any, idx: number) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy">
                    {plot.badge || "Standard"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePlotType(idx)}
                    className="p-1 text-navy-400 hover:text-red-500 rounded transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-navy-600 block mb-1">
                    Plot Title / Label
                  </label>
                  <input
                    type="text"
                    value={plot.label || ""}
                    onChange={(e) => handleUpdatePlotType(idx, "label", e.target.value)}
                    placeholder="e.g. 5 Katha Plot"
                    className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs font-bold text-navy focus:border-gold outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-navy-600 block mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={plot.badge || ""}
                      onChange={(e) => handleUpdatePlotType(idx, "badge", e.target.value)}
                      placeholder="e.g. Most Popular"
                      className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs focus:border-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-navy-600 block mb-1">
                      Katha (Numeric)
                    </label>
                    <input
                      type="number"
                      value={plot.katha || ""}
                      onChange={(e) => handleUpdatePlotType(idx, "katha", Number(e.target.value))}
                      placeholder="5"
                      className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-navy-600 block mb-1">
                      Size String
                    </label>
                    <input
                      type="text"
                      value={plot.size || ""}
                      onChange={(e) => handleUpdatePlotType(idx, "size", e.target.value)}
                      placeholder="e.g. 3,600 sq ft"
                      className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs focus:border-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-navy-600 block mb-1">
                      Price / Note
                    </label>
                    <input
                      type="text"
                      value={plot.priceNote || ""}
                      onChange={(e) => handleUpdatePlotType(idx, "priceNote", e.target.value)}
                      placeholder="On Request"
                      className="w-full rounded-xl border border-navy-200 px-3 py-1.5 text-xs focus:border-gold outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ASSETS & MAPS */}
      {activeTab === "assets" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-xs border border-navy-100">
            <h3 className="font-serif text-base font-bold text-navy">Project Downloads & Documents</h3>
            <p className="text-xs text-navy-400">
              Provide PDF links for master layouts and project brochures shown in the Key Assets card.
            </p>

            <FileUploadInput
              label="Layout Plan File / PDF URL"
              value={assetsState.layoutPlan || ""}
              onChange={(url) => handleUpdateAsset("layoutPlan", url)}
              placeholder="/Layout-Plan.pdf or https://..."
              helperText="Upload master layout PDF, CAD export or blueprint (max 25MB)"
            />

            <FileUploadInput
              label="Brochure Download URL"
              value={assetsState.brochure || ""}
              onChange={(url) => handleUpdateAsset("brochure", url)}
              placeholder="/brochure-maple-leaf.pdf or https://..."
              helperText="Upload official project brochure PDF (max 25MB)"
            />

            <div>
              <label className="text-xs font-semibold text-navy-700 block mb-1">
                Brochure Display Label
              </label>
              <input
                type="text"
                value={assetsState.brochureLabel || ""}
                onChange={(e) => handleUpdateAsset("brochureLabel", e.target.value)}
                placeholder="Project Brochure"
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
              />
            </div>

            <FileUploadInput
              label="Brochure Direct File / Secondary URL"
              value={assetsState.brochureFile || ""}
              onChange={(url) => handleUpdateAsset("brochureFile", url)}
              placeholder="/brochure-maple-leaf.pdf or https://..."
              helperText="Upload or link secondary downloadable brochure file"
            />
          </div>

          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-xs border border-navy-100">
            <h3 className="font-serif text-base font-bold text-navy">Interactive Maps & Coordinates</h3>
            <p className="text-xs text-navy-400">
              Configure coordinates and custom Google Maps embed URL for the project detail sidebar.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates?.lat || 23.86489}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordinates: {
                        lat: parseFloat(e.target.value) || 23.86489,
                        lng: formData.coordinates?.lng || 90.5647,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-700 block mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates?.lng || 90.5647}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordinates: {
                        lat: formData.coordinates?.lat || 23.86489,
                        lng: parseFloat(e.target.value) || 90.5647,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-700 block mb-1">
                Custom Google Maps Embed / View Link (Optional)
              </label>
              <input
                type="text"
                value={assetsState.mapHref || ""}
                onChange={(e) => handleUpdateAsset("mapHref", e.target.value)}
                placeholder="Leave blank to auto-generate from coordinates and project name"
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
              />
            </div>

            <div className="rounded-xl bg-navy-50/50 p-4 border border-navy-100 text-xs text-navy-600 space-y-1">
              <p className="font-semibold text-navy">Location Map Preview</p>
              <p className="text-navy-400">
                Visitors will see a 1-click &quot;Get Directions&quot; button and an embedded map pinned to this location.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SECTION HEADINGS & SIDEBAR CUSTOMIZER */}
      {activeTab === "headings" && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-6">
          <div className="border-b border-navy-100 pb-3">
            <h3 className="font-serif text-base font-bold text-navy">
              Dynamic Headings & Call-to-Action Customizer
            </h3>
            <p className="text-xs text-navy-400">
              Customize the section headers, subtitles, and sidebar contact details for this specific project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overview & Key Assets */}
            <div className="rounded-xl border border-navy-100 p-4 space-y-3 bg-navy-50/20">
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider">Overview & Assets</h4>
              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Overview Heading</label>
                <input
                  type="text"
                  value={headingsState.overviewTitle || ""}
                  onChange={(e) => handleUpdateHeading("overviewTitle", e.target.value)}
                  placeholder="Overview"
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Assets Eyebrow</label>
                <input
                  type="text"
                  value={headingsState.keyAssetsEyebrow || ""}
                  onChange={(e) => handleUpdateHeading("keyAssetsEyebrow", e.target.value)}
                  placeholder="Project Assets"
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Assets Title</label>
                <input
                  type="text"
                  value={headingsState.keyAssetsTitle || ""}
                  onChange={(e) => handleUpdateHeading("keyAssetsTitle", e.target.value)}
                  placeholder="Key Documents & Maps"
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Assets Subtitle</label>
                <input
                  type="text"
                  value={headingsState.keyAssetsSubtitle || ""}
                  onChange={(e) => handleUpdateHeading("keyAssetsSubtitle", e.target.value)}
                  placeholder="Download or view essential project documents..."
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>
            </div>

            {/* Highlights & Features */}
            <div className="rounded-xl border border-navy-100 p-4 space-y-3 bg-navy-50/20">
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider">Highlights & Amenities</h4>
              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Highlights Heading</label>
                <input
                  type="text"
                  value={headingsState.highlightsTitle || ""}
                  onChange={(e) => handleUpdateHeading("highlightsTitle", e.target.value)}
                  placeholder="Highlights"
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Key Features Heading</label>
                <input
                  type="text"
                  value={headingsState.featuresTitle || ""}
                  onChange={(e) => handleUpdateHeading("featuresTitle", e.target.value)}
                  placeholder="Key Features"
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Amenities Eyebrow</label>
                <input
                  type="text"
                  value={headingsState.amenitiesEyebrow || ""}
                  onChange={(e) => handleUpdateHeading("amenitiesEyebrow", e.target.value)}
                  placeholder="World-Class Amenities"
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Amenities Title</label>
                <input
                  type="text"
                  value={headingsState.amenitiesTitle || ""}
                  onChange={(e) => handleUpdateHeading("amenitiesTitle", e.target.value)}
                  placeholder="Everything You Need"
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Amenities Subtitle</label>
                <input
                  type="text"
                  value={headingsState.amenitiesSubtitle || ""}
                  onChange={(e) => handleUpdateHeading("amenitiesSubtitle", e.target.value)}
                  placeholder="A community is defined by what it offers its residents."
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>
            </div>

            {/* Portfolio, Story & Sidebar */}
            <div className="rounded-xl border border-navy-100 p-4 space-y-3 bg-navy-50/20">
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider">Portfolio & Contact Sidebar</h4>
              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Plot Portfolio Title</label>
                <input
                  type="text"
                  value={headingsState.plotPortfolioTitle || ""}
                  onChange={(e) => handleUpdateHeading("plotPortfolioTitle", e.target.value)}
                  placeholder="Plot Portfolio"
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Plot Portfolio Subtitle</label>
                <input
                  type="text"
                  value={headingsState.plotPortfolioSubtitle || ""}
                  onChange={(e) => handleUpdateHeading("plotPortfolioSubtitle", e.target.value)}
                  placeholder="Explore our range of premium residential plot sizes"
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Sidebar Card Title</label>
                <input
                  type="text"
                  value={headingsState.contactTitle || ""}
                  onChange={(e) => handleUpdateHeading("contactTitle", e.target.value)}
                  placeholder="Interested in this project?"
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Sidebar Direct Phone</label>
                <input
                  type="text"
                  value={headingsState.contactPhone || ""}
                  onChange={(e) => handleUpdateHeading("contactPhone", e.target.value)}
                  placeholder="+880 1711 500 000"
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-navy-600 block mb-1">Sidebar Direct Email</label>
                <input
                  type="text"
                  value={headingsState.contactEmail || ""}
                  onChange={(e) => handleUpdateHeading("contactEmail", e.target.value)}
                  placeholder="info@coronapropertiesbd.com"
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-navy-600 block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={headingsState.contactCtaText || ""}
                    onChange={(e) => handleUpdateHeading("contactCtaText", e.target.value)}
                    placeholder="Book Site Visit"
                    className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-navy-600 block mb-1">CTA Button Link</label>
                  <input
                    type="text"
                    value={headingsState.contactCtaHref || ""}
                    onChange={(e) => handleUpdateHeading("contactCtaHref", e.target.value)}
                    placeholder="/contact"
                    className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Similar Projects Section */}
            <div className="rounded-xl border border-navy-100 p-4 space-y-3 bg-navy-50/20 md:col-span-2 lg:col-span-3">
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
                Similar Projects Module (Bottom of Project Page)
              </h4>
              <p className="text-xs text-navy-400">
                Configure the section title, eyebrow, and optional subtitle for the related projects module shown to visitors.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-navy-600 block mb-1">Section Eyebrow</label>
                  <input
                    type="text"
                    value={headingsState.similarProjectsEyebrow || ""}
                    onChange={(e) => handleUpdateHeading("similarProjectsEyebrow", e.target.value)}
                    placeholder="You May Also Explore"
                    className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-navy-600 block mb-1">Section Title</label>
                  <input
                    type="text"
                    value={headingsState.similarProjectsTitle || ""}
                    onChange={(e) => handleUpdateHeading("similarProjectsTitle", e.target.value)}
                    placeholder="Similar Projects"
                    className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-navy-600 block mb-1">Section Subtitle (Optional)</label>
                  <input
                    type="text"
                    value={headingsState.similarProjectsSubtitle || ""}
                    onChange={(e) => handleUpdateHeading("similarProjectsSubtitle", e.target.value)}
                    placeholder="Explore our curated portfolio of landmark communities"
                    className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs focus:border-gold outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: GALLERY & PHOTOS */}
      {activeTab === "media" && (
        <div className="space-y-6 rounded-2xl bg-white p-6 shadow-xs border border-navy-100">
          <GalleryManager
            images={formData.gallery || []}
            onChange={(imgs) => setFormData({ ...formData, gallery: imgs })}
            featuredImage={formData.featuredImage}
            onSetFeatured={(url) => setFormData({ ...formData, featuredImage: url })}
          />
        </div>
      )}

      {/* TAB 9: SEO SUITE & SERP PREVIEW */}
      {activeTab === "seo" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 rounded-2xl bg-white p-6 shadow-xs border border-navy-100">
            <h3 className="font-serif text-base font-bold text-navy">SEO & Meta Directives</h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-navy-700">Meta Title</label>
                <span className="text-[11px] text-navy-400">{metaTitle.length} / 60 chars</span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-navy-700">Meta Description</label>
                <span className="text-[11px] text-navy-400">{metaDescription.length} / 160 chars</span>
              </div>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full rounded-xl border border-navy-200 p-3 text-xs focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-700 block mb-1">Focus Keyword</label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
              />
            </div>
          </div>

          {/* SERP Snippet Preview */}
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-xs border border-navy-100">
            <h3 className="font-serif text-base font-bold text-navy">Google SERP Snippet</h3>
            <div className="rounded-xl border border-navy-100 p-4 bg-slate-50 space-y-1">
              <p className="text-[11px] text-navy-500 font-mono">
                https://coronapropertiesbd.com/projects/{formData.slug || "example-project"}
              </p>
              <p className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer line-clamp-1">
                {metaTitle || `${formData.title} | Corona Properties`}
              </p>
              <p className="text-xs text-navy-600 line-clamp-2">
                {metaDescription || formData.tagline || "Discover luxury residential plots in Dhaka..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
