"use server";

import { revalidatePath } from "next/cache";
import {
  adminStore,
  AdminProperty,
  AdminLead,
  LeadStage,
  LeadActivity,
  MediaItem,
  SocialLink,
  RedirectRule,
  CustomScript,
  AdminBlogPost,
  AdminTeamMember,
  AdminTestimonial,
  AdminService,
  AdminFaq,
  AdminPage,
  AdminSiteContent,
  AdminNavigation,
  Agent,
  AdminCategory,
  CategoryScope,
  CustomFieldDef,
} from "./seed";
import {
  propertySchema,
  leadSchema,
  seoMetaSchema,
  redirectSchema,
  customScriptSchema,
  socialLinkSchema,
  blogPostSchema,
  teamMemberSchema,
  testimonialSchema,
  serviceSchema,
  faqSchema,
  pageSchema,
} from "@/lib/validations/schemas";
import { sanitizeHtml, sanitizeSvg } from "./sanitize";
import { createAdminClient } from "@/lib/supabase/server";

// Helper to get supabase untyped client for flexible queries
function getDbClient(): any {
  return createAdminClient() as any;
}

// --- UUID & MAPPING HELPERS ---
function isUuid(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

const STAGE_ID_TO_UUID: Record<string, string> = {
  "stage-1": "10000000-0000-0000-0000-000000000001",
  "stage-2": "10000000-0000-0000-0000-000000000002",
  "stage-3": "10000000-0000-0000-0000-000000000003",
  "stage-4": "10000000-0000-0000-0000-000000000004",
  "stage-5": "10000000-0000-0000-0000-000000000005",
  "stage-6": "10000000-0000-0000-0000-000000000006",
  "stage-7": "10000000-0000-0000-0000-000000000007",
};

const STAGE_UUID_TO_ID: Record<string, string> = {
  "10000000-0000-0000-0000-000000000001": "stage-1",
  "10000000-0000-0000-0000-000000000002": "stage-2",
  "10000000-0000-0000-0000-000000000003": "stage-3",
  "10000000-0000-0000-0000-000000000004": "stage-4",
  "10000000-0000-0000-0000-000000000005": "stage-5",
  "10000000-0000-0000-0000-000000000006": "stage-6",
  "10000000-0000-0000-0000-000000000007": "stage-7",
};

const AGENT_ID_TO_UUID: Record<string, string> = {
  "agent-1": "40000000-0000-0000-0000-000000000001",
  "agent-2": "40000000-0000-0000-0000-000000000002",
  "agent-3": "40000000-0000-0000-0000-000000000003",
};

const AGENT_UUID_TO_ID: Record<string, string> = {
  "40000000-0000-0000-0000-000000000001": "agent-1",
  "40000000-0000-0000-0000-000000000002": "agent-2",
  "40000000-0000-0000-0000-000000000003": "agent-3",
};

function normalizeStageId(id?: string | null): string {
  if (!id) return "10000000-0000-0000-0000-000000000001";
  if (STAGE_ID_TO_UUID[id]) return STAGE_ID_TO_UUID[id];
  if (isUuid(id)) return id;
  return "10000000-0000-0000-0000-000000000001";
}

function normalizeAgentId(id?: string | null): string | null {
  if (!id) return null;
  if (AGENT_ID_TO_UUID[id]) return AGENT_ID_TO_UUID[id];
  if (isUuid(id)) return id;
  return null;
}

function mapDbPropertyToAdmin(row: any): AdminProperty {
  const gallery =
    Array.isArray(row.property_images) && row.property_images.length > 0
      ? row.property_images
          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((img: any) => img.url)
      : [row.featured_image || "/image-06.webp"];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleBn: row.title_bn,
    tagline: row.tagline,
    taglineBn: row.tagline_bn,
    location: row.location,
    area: row.area,
    price: row.price,
    priceValue: Number(row.price_value) || 0,
    type: row.type || "Exclusive",
    status: row.status || "Available",
    approvalStatus: row.approval_status || "Published",
    size: row.size,
    featuredImage: row.featured_image || "/image-06.webp",
    gallery: gallery.length > 0 ? gallery : ["/image-02.webp"],
    overview: row.overview || "",
    overviewBn: row.overview_bn || "",
    genesis: row.genesis || "",
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    features: Array.isArray(row.features) ? row.features : [],
    specs: Array.isArray(row.specs) ? row.specs : [],
    plotTypes: Array.isArray(row.plot_types) ? row.plot_types : [],
    totalPlots: row.total_plots,
    totalArea: row.total_area,
    roadPrimary: row.road_primary,
    roadSecondary: row.road_secondary,
    coordinates: row.coordinates || { lat: 23.86489, lng: 90.5647 },
    isFlagship: !!row.is_flagship,
    isFeatured: !!row.is_featured,
    assignedAgentId: AGENT_UUID_TO_ID[row.assigned_agent_id] || row.assigned_agent_id || "agent-1",
    customFieldValues: row.custom_field_values || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDbLeadToAdmin(row: any): AdminLead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    source: row.source || "Website Form",
    propertyId: row.property_id,
    propertyTitle: row.property_title,
    stageId: STAGE_UUID_TO_ID[row.stage_id] || row.stage_id || "stage-1",
    assignedAgentId: AGENT_UUID_TO_ID[row.assigned_agent_id] || row.assigned_agent_id || "agent-1",
    priority: row.priority || "Medium",
    budget: row.budget,
    budgetMin: Number(row.budget_min) || 0,
    budgetMax: Number(row.budget_max) || 0,
    preferredLocation: row.preferred_location,
    message: row.message,
    score: row.score || 50,
    tags: Array.isArray(row.tags) ? row.tags : ["New Lead"],
    nextFollowUp: row.next_follow_up,
    isDuplicate: !!row.is_duplicate,
    status: row.status || "Active",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDbSocialLink(row: any): SocialLink {
  return {
    id: row.id,
    platform: row.platform,
    label: row.label,
    url: row.url,
    iconName: row.icon_name || "Globe",
    openNewTab: !!row.open_new_tab,
    isActive: !!row.is_active,
    sortOrder: row.sort_order || 0,
  };
}

// --- SETTINGS HELPER (JSON STORE IN SUPABASE) ---
async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const supabase = getDbClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error || !data || data.value === null || data.value === undefined) {
      return fallback;
    }
    return data.value as T;
  } catch {
    return fallback;
  }
}

async function saveSetting<T>(key: string, value: T): Promise<boolean> {
  try {
    const supabase = getDbClient();
    const { error } = await supabase.from("site_settings").upsert(
      {
        key,
        value: value as any,
        updated_at: new Date().toISOString(),
        updated_by: "Admin",
      },
      { onConflict: "key" }
    );
    return !error;
  } catch {
    return false;
  }
}

// --- PROPERTIES ACTIONS ---
export async function getPropertiesAction(): Promise<AdminProperty[]> {
  try {
    const supabase = getDbClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*, property_images(*)")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return adminStore.getProperties();
    }
    return data.map(mapDbPropertyToAdmin);
  } catch (err) {
    console.error("Error fetching properties from Supabase:", err);
    return adminStore.getProperties();
  }
}

export async function getPropertyAction(idOrSlug: string): Promise<AdminProperty | undefined> {
  try {
    const supabase = getDbClient();
    let query = supabase.from("properties").select("*, property_images(*)");

    if (isUuid(idOrSlug)) {
      query = query.or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
    } else {
      query = query.eq("slug", idOrSlug);
    }

    const { data, error } = await query.maybeSingle();
    if (error || !data) {
      return adminStore.getPropertyById(idOrSlug);
    }
    return mapDbPropertyToAdmin(data);
  } catch {
    return adminStore.getPropertyById(idOrSlug);
  }
}

export async function savePropertyAction(formData: any) {
  let dataToValidate = formData;
  if (formData?.id) {
    const existing = await getPropertyAction(formData.id);
    if (existing) {
      dataToValidate = { ...existing, ...formData };
    }
  }

  const parsed = propertySchema.safeParse(dataToValidate);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    return { success: false, error: errorMsg };
  }

  const cleanOverview = sanitizeHtml(parsed.data.overview || "");
  const cleanOverviewBn = sanitizeHtml(parsed.data.overviewBn || "");

  try {
    const supabase = getDbClient();
    const now = new Date().toISOString();
    const propertyId = isUuid(formData.id) ? formData.id : crypto.randomUUID();

    const dbPayload: any = {
      slug: parsed.data.slug,
      title: parsed.data.title,
      title_bn: parsed.data.titleBn || null,
      tagline: parsed.data.tagline || null,
      tagline_bn: parsed.data.taglineBn || null,
      location: parsed.data.location,
      area: parsed.data.area,
      price: parsed.data.price,
      price_value: parsed.data.priceValue || 0,
      type: parsed.data.type || "Exclusive",
      status: parsed.data.status || "Available",
      approval_status: parsed.data.approvalStatus || "Published",
      size: parsed.data.size,
      featured_image: parsed.data.featuredImage || "/image-06.webp",
      overview: cleanOverview,
      overview_bn: cleanOverviewBn,
      genesis: parsed.data.genesis || null,
      highlights: parsed.data.highlights || [],
      features: parsed.data.features || [],
      specs: parsed.data.specs || [],
      plot_types: parsed.data.plotTypes || [],
      total_plots: parsed.data.totalPlots || 0,
      total_area: parsed.data.totalArea || null,
      road_primary: parsed.data.roadPrimary || null,
      road_secondary: parsed.data.roadSecondary || null,
      coordinates: parsed.data.coordinates || { lat: 23.86489, lng: 90.5647 },
      is_flagship: !!parsed.data.isFlagship,
      is_featured: !!parsed.data.isFeatured,
      assigned_agent_id: normalizeAgentId(parsed.data.assignedAgentId),
      custom_field_values: parsed.data.customFieldValues || {},
      updated_at: now,
    };

    let savedRow: any = null;

    if (isUuid(formData.id)) {
      const { data, error } = await supabase
        .from("properties")
        .update(dbPayload)
        .eq("id", formData.id)
        .select()
        .single();

      if (error) {
        const { data: inserted, error: insertErr } = await supabase
          .from("properties")
          .insert({ ...dbPayload, id: propertyId, created_at: now })
          .select()
          .single();
        if (insertErr) throw insertErr;
        savedRow = inserted;
      } else {
        savedRow = data;
      }
    } else {
      const { data, error } = await supabase
        .from("properties")
        .insert({ ...dbPayload, id: propertyId, created_at: now })
        .select()
        .single();
      if (error) throw error;
      savedRow = data;
    }

    // Update gallery in property_images
    if (Array.isArray(parsed.data.gallery) && parsed.data.gallery.length > 0) {
      await supabase.from("property_images").delete().eq("property_id", savedRow.id);
      const imagesToInsert = parsed.data.gallery.map((url: string, index: number) => ({
        property_id: savedRow.id,
        url,
        sort_order: index,
        is_featured: index === 0,
        alt_text: `${parsed.data.title} gallery image ${index + 1}`,
      }));
      await supabase.from("property_images").insert(imagesToInsert);
    }

    adminStore.saveProperty({
      ...parsed.data,
      id: savedRow.id,
      overview: cleanOverview,
      overviewBn: cleanOverviewBn,
    });

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath(`/properties/${parsed.data.slug}`);
    revalidatePath("/projects");
    revalidatePath(`/projects/${parsed.data.slug}`);
    revalidatePath("/");

    return { success: true, property: mapDbPropertyToAdmin(savedRow) };
  } catch (err: any) {
    console.error("Error saving property to Supabase:", err);
    return { success: false, error: err.message || "Failed to save property to database" };
  }
}

export async function deletePropertyAction(id: string) {
  try {
    const supabase = getDbClient();
    if (isUuid(id)) {
      await supabase.from("properties").delete().eq("id", id);
    } else {
      await supabase.from("properties").delete().eq("slug", id);
    }

    adminStore.deleteProperty(id);

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Error deleting property from Supabase:", err);
    adminStore.deleteProperty(id);
    return { success: true };
  }
}

export async function bulkUpdatePropertiesAction(ids: string[], updates: Partial<AdminProperty>) {
  try {
    const supabase = getDbClient();
    const validUuids = ids.filter(isUuid);
    const dbUpdates: any = { updated_at: new Date().toISOString() };

    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.approvalStatus !== undefined) dbUpdates.approval_status = updates.approvalStatus;
    if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;

    if (validUuids.length > 0) {
      await supabase.from("properties").update(dbUpdates).in("id", validUuids);
    }

    adminStore.bulkUpdateProperties(ids, updates);

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    return { success: true };
  } catch (err) {
    console.error("Error bulk updating properties:", err);
    return { success: false };
  }
}

// --- LEADS ACTIONS ---
export async function getLeadsAction(): Promise<AdminLead[]> {
  try {
    const supabase = getDbClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return adminStore.getLeads();
    }
    return data.map(mapDbLeadToAdmin);
  } catch {
    return adminStore.getLeads();
  }
}

export async function getStagesAction(): Promise<LeadStage[]> {
  try {
    const supabase = getDbClient();
    const { data, error } = await supabase
      .from("lead_stages")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return adminStore.getStages();
    }
    return data.map((s: any) => ({
      id: STAGE_UUID_TO_ID[s.id] || s.id,
      name: s.name,
      slug: s.slug,
      color: s.color,
      sortOrder: s.sort_order,
      isSystem: s.is_system,
    }));
  } catch {
    return adminStore.getStages();
  }
}

export async function saveLeadAction(formData: any) {
  const parsed = leadSchema.safeParse(formData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    return { success: false, error: errorMsg };
  }

  try {
    const supabase = getDbClient();
    const leadId = isUuid(formData.id) ? formData.id : crypto.randomUUID();
    const now = new Date().toISOString();

    const dbLead: any = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      source: parsed.data.source || "Website Form",
      property_id: isUuid(parsed.data.propertyId) ? parsed.data.propertyId : null,
      property_title: parsed.data.propertyTitle || "Maple Leaf Garden City",
      stage_id: normalizeStageId(parsed.data.stageId),
      assigned_agent_id: normalizeAgentId(parsed.data.assignedAgentId),
      priority: parsed.data.priority || "Medium",
      budget: parsed.data.budget || null,
      message: parsed.data.message || null,
      score: parsed.data.score || 70,
      tags: parsed.data.tags || ["New Lead"],
      next_follow_up: parsed.data.nextFollowUp || null,
      preferred_location: parsed.data.preferredLocation || null,
      updated_at: now,
    };

    let savedRow: any = null;
    if (isUuid(formData.id)) {
      const { data, error } = await supabase
        .from("leads")
        .update(dbLead)
        .eq("id", formData.id)
        .select()
        .single();
      if (error) {
        const { data: inserted, error: insertErr } = await supabase
          .from("leads")
          .insert({ ...dbLead, id: leadId, created_at: now })
          .select()
          .single();
        if (insertErr) throw insertErr;
        savedRow = inserted;
      } else {
        savedRow = data;
      }
    } else {
      const { data, error } = await supabase
        .from("leads")
        .insert({ ...dbLead, id: leadId, created_at: now })
        .select()
        .single();
      if (error) throw error;
      savedRow = data;
    }

    adminStore.saveLead({ ...parsed.data, id: savedRow.id });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/leads/kanban");
    return { success: true, lead: mapDbLeadToAdmin(savedRow) };
  } catch (err: any) {
    console.error("Error saving lead:", err);
    return { success: false, error: err.message || "Failed to save lead" };
  }
}

export async function updateLeadStageAction(leadId: string, newStageId: string, actorName = "Admin") {
  try {
    const supabase = getDbClient();
    const stageUuid = normalizeStageId(newStageId);

    if (isUuid(leadId)) {
      await supabase
        .from("leads")
        .update({ stage_id: stageUuid, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      await supabase.from("lead_activities").insert({
        lead_id: leadId,
        actor_name: actorName,
        type: "stage_change",
        title: `Pipeline Stage Updated`,
        description: `Moved stage to ${newStageId}`,
      });
    }

    const updated = adminStore.updateLeadStage(leadId, newStageId, actorName);

    revalidatePath("/admin/leads");
    revalidatePath("/admin/leads/kanban");
    return { success: true, lead: updated };
  } catch (err) {
    console.error("Error updating lead stage:", err);
    const updated = adminStore.updateLeadStage(leadId, newStageId, actorName);
    return { success: true, lead: updated };
  }
}

export async function deleteLeadAction(id: string) {
  try {
    const supabase = getDbClient();
    if (isUuid(id)) {
      await supabase.from("leads").delete().eq("id", id);
    }
    adminStore.deleteLead(id);

    revalidatePath("/admin/leads");
    revalidatePath("/admin/leads/kanban");
    return { success: true };
  } catch (err) {
    console.error("Error deleting lead:", err);
    adminStore.deleteLead(id);
    return { success: true };
  }
}

export async function getLeadActivitiesAction(leadId: string) {
  try {
    const supabase = getDbClient();
    if (isUuid(leadId)) {
      const { data } = await supabase
        .from("lead_activities")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        return data.map((a: any) => ({
          id: a.id,
          leadId: a.lead_id,
          actorName: a.actor_name || "System",
          type: a.type,
          title: a.title,
          description: a.description,
          createdAt: a.created_at,
        }));
      }
    }
    return adminStore.getLeadActivities(leadId);
  } catch {
    return adminStore.getLeadActivities(leadId);
  }
}

export async function addLeadActivityAction(leadId: string, type: any, title: string, description?: string) {
  try {
    const supabase = getDbClient();
    if (isUuid(leadId)) {
      await supabase.from("lead_activities").insert({
        lead_id: leadId,
        actor_name: "Admin User",
        type,
        title,
        description: description || null,
      });
    }
  } catch (err) {
    console.error("Error logging activity:", err);
  }

  const activity = adminStore.addLeadActivity({
    leadId,
    actorName: "Admin User",
    type,
    title,
    description,
  });
  return { success: true, activity };
}

// --- SOCIAL LINKS ACTIONS ---
export async function getSocialLinksAction(): Promise<SocialLink[]> {
  try {
    const supabase = getDbClient();
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return adminStore.getSocialLinks();
    }
    return data.map(mapDbSocialLink);
  } catch {
    return adminStore.getSocialLinks();
  }
}

export async function saveSocialLinkAction(formData: any) {
  const parsed = socialLinkSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const supabase = getDbClient();
    const linkId = isUuid(formData.id) ? formData.id : crypto.randomUUID();
    const dbPayload = {
      id: linkId,
      platform: parsed.data.platform,
      label: parsed.data.label,
      url: parsed.data.url,
      icon_name: parsed.data.iconName || "Globe",
      open_new_tab: parsed.data.openNewTab !== false,
      is_active: parsed.data.isActive !== false,
      sort_order: parsed.data.sortOrder || 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("social_links")
      .upsert(dbPayload, { onConflict: "id" })
      .select()
      .single();

    if (error) throw error;

    adminStore.saveSocialLink({ id: data.id, ...parsed.data });

    revalidatePath("/admin/social");
    revalidatePath("/");
    return { success: true, link: mapDbSocialLink(data) };
  } catch (err: any) {
    console.error("Error saving social link:", err);
    return { success: false, error: err.message };
  }
}

export async function reorderSocialLinksAction(orderedIds: string[]) {
  try {
    const supabase = getDbClient();
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      if (isUuid(id)) {
        await supabase.from("social_links").update({ sort_order: i + 1 }).eq("id", id);
      }
    }
    adminStore.reorderSocialLinks(orderedIds);
    revalidatePath("/admin/social");
    revalidatePath("/");
    return { success: true };
  } catch {
    adminStore.reorderSocialLinks(orderedIds);
    return { success: true };
  }
}

export async function deleteSocialLinkAction(id: string) {
  try {
    const supabase = getDbClient();
    if (isUuid(id)) {
      await supabase.from("social_links").delete().eq("id", id);
    }
    adminStore.deleteSocialLink(id);
    revalidatePath("/admin/social");
    revalidatePath("/");
    return { success: true };
  } catch {
    adminStore.deleteSocialLink(id);
    return { success: true };
  }
}

// --- MEDIA LIBRARY ACTIONS ---
export async function getMediaAction(): Promise<MediaItem[]> {
  try {
    const savedMeta = await getSetting<MediaItem[]>("media_items", []);
    const supabase = getDbClient();
    const { data, error } = await supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (Array.isArray(savedMeta) && savedMeta.length > 0) {
        return savedMeta;
      }
      return adminStore.getMedia();
    }

    const metaMap = new Map<string, Partial<MediaItem>>();
    if (Array.isArray(savedMeta)) {
      savedMeta.forEach((sm) => {
        if (sm.id) metaMap.set(sm.id, sm);
        if (sm.url) metaMap.set(sm.url, sm);
      });
    }
    adminStore.getMedia().forEach((sm) => {
      if (!metaMap.has(sm.url)) metaMap.set(sm.url, sm);
    });

    return data.map((m: any) => {
      const extra = metaMap.get(m.id) || metaMap.get(m.url) || {};
      return {
        id: m.id,
        filename: m.filename,
        filePath: m.file_path,
        url: m.url,
        thumbnailUrl: m.thumbnail_url || m.url,
        mimeType: m.mime_type,
        sizeBytes: Number(m.size_bytes) || 0,
        width: m.width,
        height: m.height,
        title: extra.title || m.alt_text || m.filename,
        category: extra.category || "Residential",
        altText: m.alt_text || extra.altText || m.filename,
        usageCount: m.usage_count || 0,
        usageReferences: Array.isArray(m.usage_references) ? m.usage_references : [],
        createdAt: m.created_at,
      };
    });
  } catch {
    return adminStore.getMedia();
  }
}

export async function addMediaItemAction(item: {
  filename: string;
  filePath: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  title?: string;
  category?: string;
  altText: string;
}) {
  let finalUrl = item.url;
  let finalSize = item.sizeBytes;
  let finalMime = item.mimeType;

  // If a data URL was passed, upload it to Supabase Storage bucket "media"
  if (item.url && item.url.startsWith("data:")) {
    try {
      const matches = item.url.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        finalMime = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        finalSize = buffer.length;
        const ext = finalMime.split("/")[1] || "webp";
        const storageFilename = `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

        const supabaseAdmin = createAdminClient();
        try {
          await supabaseAdmin.storage.createBucket("media", { public: true, fileSizeLimit: 10485760 });
        } catch {}

        const { data: uploadRes, error: uploadErr } = await supabaseAdmin.storage
          .from("media")
          .upload(storageFilename, buffer, {
            contentType: finalMime,
            upsert: true,
          });

        if (!uploadErr && uploadRes) {
          const { data: pubData } = supabaseAdmin.storage.from("media").getPublicUrl(uploadRes.path || storageFilename);
          if (pubData?.publicUrl) {
            finalUrl = pubData.publicUrl;
          }
        }
      }
    } catch (uploadException) {
      console.error("Storage upload exception in addMediaItemAction:", uploadException);
    }
  }

  const normalizedItem = {
    ...item,
    url: finalUrl,
    thumbnailUrl: item.thumbnailUrl && !item.thumbnailUrl.startsWith("data:") ? item.thumbnailUrl : finalUrl,
    sizeBytes: finalSize,
    mimeType: finalMime,
    title: item.title || item.altText || item.filename,
    category: item.category || "Residential",
  };

  try {
    const supabase = getDbClient();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("media_library")
      .insert({
        id,
        filename: normalizedItem.filename,
        file_path: normalizedItem.filePath,
        url: normalizedItem.url,
        thumbnail_url: normalizedItem.thumbnailUrl || normalizedItem.url,
        mime_type: normalizedItem.mimeType,
        size_bytes: normalizedItem.sizeBytes,
        width: normalizedItem.width,
        height: normalizedItem.height,
        alt_text: normalizedItem.altText,
        usage_count: 0,
        usage_references: [],
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (!error && data) {
      const created: MediaItem = {
        id: data.id,
        ...normalizedItem,
        usageCount: 0,
        usageReferences: [],
        createdAt: data.created_at,
      };
      adminStore.addMediaItem(created);
      const currentList = await getMediaAction();
      const merged = [created, ...currentList.filter((m) => m.id !== created.id)];
      await saveSetting("media_items", merged);
      revalidatePath("/admin/media");
      revalidatePath("/gallery");
      return { success: true, media: created };
    }
  } catch (err) {
    console.error("Error adding media item to Supabase:", err);
  }

  const created = adminStore.addMediaItem({
    ...normalizedItem,
    usageCount: 0,
    usageReferences: [],
  });
  const currentList = await getSetting<MediaItem[]>("media_items", adminStore.getMedia());
  await saveSetting("media_items", [created, ...currentList.filter((m) => m.id !== created.id)]);
  revalidatePath("/admin/media");
  revalidatePath("/gallery");
  return { success: true, media: created };
}

export async function deleteMediaAction(id: string) {
  try {
    const supabase = getDbClient();
    if (isUuid(id)) {
      await supabase.from("media_library").delete().eq("id", id);
    }
  } catch (err) {
    console.error("Error deleting media from Supabase:", err);
  }
  const deleted = adminStore.deleteMediaItem(id);
  const currentList = await getSetting<MediaItem[]>("media_items", adminStore.getMedia());
  await saveSetting(
    "media_items",
    currentList.filter((m) => m.id !== id)
  );
  revalidatePath("/admin/media");
  revalidatePath("/gallery");
  return { success: deleted };
}

export async function updateMediaAltAction(id: string, altText: string) {
  return updateMediaItemAction(id, { altText });
}

export async function updateMediaItemAction(
  id: string,
  updates: { title?: string; category?: string; altText?: string }
) {
  try {
    const supabase = getDbClient();
    if (isUuid(id) && updates.altText !== undefined) {
      await supabase.from("media_library").update({ alt_text: updates.altText }).eq("id", id);
    }
  } catch (err) {
    console.error("Error updating media item:", err);
  }
  const updated = adminStore.updateMediaItem(id, updates);
  const currentList = await getMediaAction();
  const nextList = currentList.map((m) => (m.id === id ? { ...m, ...updates } : m));
  await saveSetting("media_items", nextList);
  revalidatePath("/admin/media");
  revalidatePath("/gallery");
  return { success: true, media: updated || nextList.find((m) => m.id === id) };
}

// --- REDIRECTS ACTIONS ---
export async function getRedirectsAction(): Promise<RedirectRule[]> {
  try {
    const supabase = getDbClient();
    const { data } = await supabase.from("redirects").select("*").order("created_at", { ascending: false });
    if (data && data.length > 0) {
      return data.map((r: any) => ({
        id: r.id,
        sourcePath: r.source_path,
        targetPath: r.target_path,
        statusCode: r.status_code,
        isActive: !!r.is_active,
        hitCount: Number(r.hit_count) || 0,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    }
  } catch {}
  return adminStore.getRedirects();
}

export async function saveRedirectAction(formData: any) {
  const parsed = redirectSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  try {
    const supabase = getDbClient();
    const id = isUuid(formData.id) ? formData.id : crypto.randomUUID();
    const { data } = await supabase
      .from("redirects")
      .upsert(
        {
          id,
          source_path: parsed.data.sourcePath,
          target_path: parsed.data.targetPath,
          status_code: parsed.data.statusCode || 301,
          is_active: parsed.data.isActive !== false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    adminStore.saveRedirect({ id, ...parsed.data });
    revalidatePath("/admin/seo/redirects");
    return { success: true, redirect: data };
  } catch (err: any) {
    const saved = adminStore.saveRedirect({ id: formData.id, ...parsed.data });
    revalidatePath("/admin/seo/redirects");
    return { success: true, redirect: saved };
  }
}

export async function deleteRedirectAction(id: string) {
  try {
    const supabase = getDbClient();
    if (isUuid(id)) {
      await supabase.from("redirects").delete().eq("id", id);
    }
  } catch {}
  const deleted = adminStore.deleteRedirect(id);
  revalidatePath("/admin/seo/redirects");
  return { success: deleted };
}

// --- CUSTOM SCRIPTS ACTIONS ---
export async function getCustomScriptsAction(): Promise<CustomScript[]> {
  try {
    const supabase = getDbClient();
    const { data } = await supabase.from("custom_scripts").select("*").order("created_at", { ascending: false });
    if (data && data.length > 0) {
      return data.map((c: any) => ({
        id: c.id,
        name: c.name,
        placement: c.placement,
        code: c.code,
        isActive: !!c.is_active,
        createdBy: c.created_by || "Admin",
        createdAt: c.created_at,
      }));
    }
  } catch {}
  return adminStore.getCustomScripts();
}

export async function saveCustomScriptAction(formData: any) {
  const parsed = customScriptSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  try {
    const supabase = getDbClient();
    const id = isUuid(formData.id) ? formData.id : crypto.randomUUID();
    const { data } = await supabase
      .from("custom_scripts")
      .upsert(
        {
          id,
          name: parsed.data.name,
          placement: parsed.data.placement,
          code: parsed.data.code,
          is_active: parsed.data.isActive !== false,
          created_by: "Admin",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    adminStore.saveCustomScript({ id, ...parsed.data });
    revalidatePath("/admin/seo/scripts");
    return { success: true, script: data };
  } catch (err: any) {
    const saved = adminStore.saveCustomScript({ id: formData.id, ...parsed.data });
    revalidatePath("/admin/seo/scripts");
    return { success: true, script: saved };
  }
}

export async function deleteCustomScriptAction(id: string) {
  try {
    const supabase = getDbClient();
    if (isUuid(id)) {
      await supabase.from("custom_scripts").delete().eq("id", id);
    }
  } catch {}
  const deleted = adminStore.deleteCustomScript(id);
  revalidatePath("/admin/seo/scripts");
  return { success: deleted };
}

// --- AUDIT & ROLES & AGENTS & SETTINGS ---
export async function getAuditLogsAction() {
  try {
    const supabase = getDbClient();
    const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100);
    if (data && data.length > 0) {
      return data.map((row: any) => ({
        id: row.id,
        actorId: row.actor_id,
        actorEmail: row.actor_email || "superadmin@coronaproperties.com",
        action: row.action,
        entityType: row.entity_type,
        entityId: row.entity_id,
        oldValues: row.old_values,
        newValues: row.new_values,
        ipAddress: row.ip_address,
        createdAt: row.created_at,
      }));
    }
  } catch {}
  return adminStore.getAuditLogs();
}

export async function getRolesAction() {
  try {
    const supabase = getDbClient();
    const { data } = await supabase.from("roles").select("*");
    if (data && data.length > 0) {
      return data.map((r: any) => ({
        id: r.id,
        name: r.name,
        displayName: r.display_name || r.name,
        description: r.description || "",
        isSystem: !!r.is_system,
        userCount: r.user_count || 1,
      }));
    }
  } catch {}
  return adminStore.getRoles();
}

export async function getAgentsAction(): Promise<Agent[]> {
  try {
    const savedAgents = await getSetting<Agent[]>("agents_list", []);
    if (Array.isArray(savedAgents) && savedAgents.length > 0) {
      return savedAgents;
    }
    const supabase = getDbClient();
    const { data } = await supabase.from("agents").select("*");
    if (data && data.length > 0) {
      return data.map((a: any) => ({
        id: AGENT_UUID_TO_ID[a.id] || a.id,
        name: a.name,
        email: a.email,
        phone: a.phone,
        role: a.role,
        bio: a.bio || "",
        avatarUrl: a.avatar_url || "/image-01.webp",
        activeLeadsCount: a.active_leads_count || 0,
        isActive: !!a.is_active,
      }));
    }
  } catch {}
  return adminStore.getAgents();
}

export async function saveAgentAction(agentData: Partial<Agent> & { name: string; email: string; phone: string }) {
  const saved = adminStore.saveAgent(agentData);
  const currentList = await getAgentsAction();
  const idx = currentList.findIndex((a) => a.id === saved.id);
  const nextList = idx >= 0 ? currentList.map((a) => (a.id === saved.id ? saved : a)) : [...currentList, saved];
  await saveSetting("agents_list", nextList);
  revalidatePath("/admin/leads");
  revalidatePath("/admin/team");
  return { success: true, agent: saved };
}

export async function deleteAgentAction(id: string) {
  adminStore.deleteAgent(id);
  const currentList = await getAgentsAction();
  await saveSetting(
    "agents_list",
    currentList.filter((a) => a.id !== id)
  );
  revalidatePath("/admin/leads");
  return { success: true };
}

export async function getSettingsAction(): Promise<any> {
  const base = adminStore.getSettings();
  const savedBranding = await getSetting("branding", base.branding);
  const branding = { ...base.branding, ...(savedBranding || {}) };
  const webhooks = await getSetting("webhooks", base.webhooks);
  const mapConfig = await getSetting("mapConfig", base.mapConfig);
  const seo = await getSetting("seo", null);
  const rolePermissions = await getSetting("role_permissions", null);

  // Normalized `company` object so Navbar, Footer, TopBar, BottomNav, and Contact page always stay in sync with `branding`
  const company = {
    name: branding.companyName || "Corona Properties Limited",
    shortName: branding.shortName || "Corona Properties",
    tagline: branding.tagline || "Crafting Timeless Land Legacies",
    taglineBn: branding.taglineBn || "",
    about:
      branding.description ||
      "Bangladesh's premier residential land developer. Crafting legacies through premium plots, transparent transactions, and enduring value since 2015.",
    description:
      branding.description ||
      "Bangladesh's premier residential land developer. Crafting legacies through premium plots, transparent transactions, and enduring value since 2015.",
    logo: branding.logoUrl || "/image-01.webp",
    favicon: branding.faviconUrl || "/favicon.ico",
    phone: branding.phone || "+880 1805 759297",
    whatsapp: branding.whatsapp || (branding.phone || "8801805759297").replace(/[^0-9]/g, ""),
    email: branding.email || "cplcoronapropertiesltd@gmail.com",
    address: branding.address || "House # 145, Flat # 704, Road # 3, Block A, Niketon, Gulshan 01, Dhaka - 1212",
    hours: branding.hours || "Saturday – Thursday: 9:00 AM – 6:00 PM | Friday: Closed",
    ctaText: branding.headerCtaText || "Book a Visit",
    ctaLink: branding.headerCtaLink || "/contact",
    mapEmbedUrl: branding.mapEmbedUrl || "",
    directionsUrl: branding.directionsUrl || "https://maps.google.com/?q=Niketon+Gulshan+1+Dhaka+1212",
  };

  return { ...base, branding, company, webhooks, mapConfig, seo, rolePermissions };
}

export async function updateSettingsAction(key: string, value: any) {
  await saveSetting(key, value);
  adminStore.updateSettings(key, value);
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/about");
  revalidatePath("/privacy-policy");
  revalidatePath("/terms-and-conditions");
  revalidatePath("/refund-policy");
  revalidatePath("/disclaimer");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/seo");
  return { success: true, settings: await getSettingsAction() };
}

export async function validateAndSanitizeSvgAction(svgText: string) {
  return sanitizeSvg(svgText);
}

// --- PUBLIC INQUIRY INTAKE ACTION ---
export async function submitLeadInquiryAction(formData: {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  propertyTitle?: string;
  source?: string;
}) {
  const leadData = {
    name: formData.name.trim(),
    phone: formData.phone.trim(),
    email: formData.email?.trim() || `inquiry_${Date.now()}@coronaclient.com`,
    source: formData.source || "Website Form",
    propertyTitle: formData.propertyTitle || "General Inquiry",
    message: formData.message || "",
    stageId: "stage-1",
    priority: "High" as const,
    budget: "Contact for Budget",
    score: 85,
    tags: ["Website Capture", formData.propertyTitle ? "Property Inquiry" : "Consultation"],
  };

  const parsed = leadSchema.safeParse(leadData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { success: false, error: errorMsg };
  }

  const result = await saveLeadAction(parsed.data);
  return { success: result.success, leadId: result.lead?.id };
}

// --- BLOG ACTIONS ---
export async function getBlogPostsAction(): Promise<AdminBlogPost[]> {
  try {
    const supabase = getDbClient();
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data && data.length > 0) {
      return data.map((b: any) => ({
        id: b.id,
        slug: b.slug,
        title: b.title,
        titleBn: b.title_bn,
        excerpt: b.excerpt || "",
        excerptBn: b.excerpt_bn,
        content: b.content,
        contentBn: b.content_bn,
        category: b.category,
        author: b.author,
        authorRole: b.author_role,
        image: b.image,
        readTime: b.read_time,
        status: b.status,
        publishedAt: b.published_at,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      }));
    }
  } catch {}
  return adminStore.getBlogPosts();
}

export async function getBlogPostAction(idOrSlug: string) {
  try {
    const supabase = getDbClient();
    const query = isUuid(idOrSlug)
      ? supabase.from("blog_posts").select("*").or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      : supabase.from("blog_posts").select("*").eq("slug", idOrSlug);
    const { data } = await query.maybeSingle();
    if (data) return data;
  } catch {}
  return adminStore.getBlogPostByIdOrSlug(idOrSlug);
}

export async function saveBlogPostAction(formData: any) {
  const parsed = blogPostSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const cleanContent = sanitizeHtml(parsed.data.content);
  const cleanContentBn = parsed.data.contentBn ? sanitizeHtml(parsed.data.contentBn) : null;
  const postPayload = {
    ...parsed.data,
    content: cleanContent,
    contentBn: cleanContentBn,
  };

  try {
    const supabase = getDbClient();
    const id = isUuid(formData.id) ? formData.id : crypto.randomUUID();
    await supabase.from("blog_posts").upsert({
      id,
      slug: parsed.data.slug,
      title: parsed.data.title,
      title_bn: parsed.data.titleBn || null,
      excerpt: parsed.data.excerpt || null,
      excerpt_bn: parsed.data.excerptBn || null,
      content: cleanContent,
      content_bn: cleanContentBn,
      category: parsed.data.category || "Market Insights",
      author: parsed.data.author || "Corona Research Desk",
      author_role: parsed.data.authorRole || "Editorial Team",
      image: parsed.data.image,
      read_time: parsed.data.readTime || "5 min read",
      status: parsed.data.status || "Published",
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error saving blog post to DB:", err);
  }

  const saved = adminStore.saveBlogPost({ id: formData.id, ...postPayload });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true, post: saved };
}

export async function deleteBlogPostAction(id: string) {
  try {
    const supabase = getDbClient();
    if (isUuid(id)) {
      await supabase.from("blog_posts").delete().eq("id", id);
    }
  } catch {}
  const deleted = adminStore.deleteBlogPost(id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: deleted };
}

// --- TEAM MEMBERS CRUD (STORED IN SUPABASE SITE_SETTINGS) ---
export async function getTeamMembersAction(): Promise<AdminTeamMember[]> {
  const members = await getSetting<AdminTeamMember[]>("team_members", adminStore.getTeamMembers());
  return members.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function getTeamMemberAction(id: string) {
  const members = await getTeamMembersAction();
  return members.find((m) => m.id === id);
}

export async function saveTeamMemberAction(formData: any) {
  const parsed = teamMemberSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const members = await getTeamMembersAction();
  const id = formData.id || `team-${Date.now()}`;
  const now = new Date().toISOString();
  const memberIndex = members.findIndex((m) => m.id === id);

  const updatedMember: AdminTeamMember = {
    id,
    name: parsed.data.name,
    role: parsed.data.role,
    bio: parsed.data.bio,
    image: parsed.data.image,
    sortOrder: parsed.data.sortOrder || (memberIndex >= 0 ? members[memberIndex].sortOrder : members.length + 1),
    createdAt: memberIndex >= 0 ? members[memberIndex].createdAt : now,
  };

  if (memberIndex >= 0) {
    members[memberIndex] = updatedMember;
  } else {
    members.push(updatedMember);
  }

  await saveSetting("team_members", members);
  adminStore.saveTeamMember(updatedMember);

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/about");
  return { success: true, member: updatedMember };
}

export async function deleteTeamMemberAction(id: string) {
  const members = await getTeamMembersAction();
  const filtered = members.filter((m) => m.id !== id);
  await saveSetting("team_members", filtered);
  adminStore.deleteTeamMember(id);

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/about");
  return { success: true };
}

export async function reorderTeamMembersAction(ids: string[]) {
  const members = await getTeamMembersAction();
  ids.forEach((id, index) => {
    const member = members.find((m) => m.id === id);
    if (member) member.sortOrder = index + 1;
  });
  await saveSetting("team_members", members);
  adminStore.reorderTeamMembers(ids);

  revalidatePath("/admin/team");
  revalidatePath("/team");
  return { success: true };
}

// --- TESTIMONIALS ACTIONS (STORED IN SUPABASE SITE_SETTINGS) ---
export async function getTestimonialsAction(): Promise<AdminTestimonial[]> {
  return getSetting<AdminTestimonial[]>("testimonials", adminStore.getTestimonials());
}

export async function saveTestimonialAction(formData: any) {
  const parsed = testimonialSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const items = await getTestimonialsAction();
  const id = formData.id || `test-${Date.now()}`;
  const now = new Date().toISOString();
  const idx = items.findIndex((t) => t.id === id);

  const updated: AdminTestimonial = {
    id,
    name: parsed.data.name,
    role: parsed.data.role,
    quote: parsed.data.quote,
    rating: parsed.data.rating || 5,
    image: parsed.data.image,
    isActive: parsed.data.isActive !== false,
    createdAt: idx >= 0 ? items[idx].createdAt : now,
  };

  if (idx >= 0) {
    items[idx] = updated;
  } else {
    items.unshift(updated);
  }

  await saveSetting("testimonials", items);
  adminStore.saveTestimonial(updated);

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true, testimonial: updated };
}

export async function deleteTestimonialAction(id: string) {
  const items = await getTestimonialsAction();
  const filtered = items.filter((t) => t.id !== id);
  await saveSetting("testimonials", filtered);
  adminStore.deleteTestimonial(id);

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

// --- SERVICES ACTIONS (STORED IN SUPABASE SITE_SETTINGS) ---
export async function getServicesAction(): Promise<AdminService[]> {
  const services = await getSetting<AdminService[]>("services", adminStore.getServices());
  return services.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function saveServiceAction(formData: any) {
  const parsed = serviceSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const services = await getServicesAction();
  const id = formData.id || `srv-${Date.now()}`;
  const idx = services.findIndex((s) => s.id === id);

  const updated: AdminService = {
    id,
    title: parsed.data.title,
    iconName: parsed.data.iconName,
    description: parsed.data.description,
    features: parsed.data.features || [],
    sortOrder: parsed.data.sortOrder || (idx >= 0 ? services[idx].sortOrder : services.length + 1),
  };

  if (idx >= 0) {
    services[idx] = updated;
  } else {
    services.push(updated);
  }

  await saveSetting("services", services);
  adminStore.saveService(updated);

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true, service: updated };
}

export async function deleteServiceAction(id: string) {
  const services = await getServicesAction();
  const filtered = services.filter((s) => s.id !== id);
  await saveSetting("services", filtered);
  adminStore.deleteService(id);

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

// --- FAQS ACTIONS (STORED IN SUPABASE SITE_SETTINGS) ---
export async function getFaqsAction(): Promise<AdminFaq[]> {
  const faqs = await getSetting<AdminFaq[]>("faqs", adminStore.getFaqs());
  return faqs.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function saveFaqAction(formData: any) {
  const parsed = faqSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const faqs = await getFaqsAction();
  const id = formData.id || `faq-${Date.now()}`;
  const idx = faqs.findIndex((f) => f.id === id);

  const updated: AdminFaq = {
    id,
    question: parsed.data.question,
    answer: parsed.data.answer,
    category: parsed.data.category,
    sortOrder: parsed.data.sortOrder || (idx >= 0 ? faqs[idx].sortOrder : faqs.length + 1),
  };

  if (idx >= 0) {
    faqs[idx] = updated;
  } else {
    faqs.push(updated);
  }

  await saveSetting("faqs", faqs);
  adminStore.saveFaq(updated);

  revalidatePath("/admin/content");
  revalidatePath("/contact");
  return { success: true, faq: updated };
}

export async function deleteFaqAction(id: string) {
  const faqs = await getFaqsAction();
  const filtered = faqs.filter((f) => f.id !== id);
  await saveSetting("faqs", filtered);
  adminStore.deleteFaq(id);

  revalidatePath("/admin/content");
  revalidatePath("/contact");
  return { success: true };
}

// --- PAGES ACTIONS (STORED IN SUPABASE PAGES TABLE) ---
export async function getPagesAction(): Promise<AdminPage[]> {
  try {
    const supabase = getDbClient();
    const { data } = await supabase.from("pages").select("*");
    if (data && data.length > 0) {
      return data.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        content: p.content || "",
        isPublished: !!p.is_published,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));
    }
  } catch {}
  return adminStore.getPages();
}

export async function getPageAction(slug: string): Promise<AdminPage | undefined> {
  try {
    const supabase = getDbClient();
    const { data } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
    if (data) {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        content: data.content || "",
        isPublished: !!data.is_published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  } catch {}
  return adminStore.getPageBySlug(slug);
}

export async function savePageAction(formData: any) {
  const parsed = pageSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const supabase = getDbClient();
    const id = isUuid(formData.id) ? formData.id : crypto.randomUUID();
    const now = new Date().toISOString();

    await supabase.from("pages").upsert({
      id,
      slug: parsed.data.slug,
      title: parsed.data.title,
      content: parsed.data.content,
      is_published: parsed.data.isPublished !== false,
      updated_at: now,
    });
  } catch (err) {
    console.error("Error saving page to DB:", err);
  }

  const saved = adminStore.savePage({
    id: formData.id,
    ...parsed.data,
    lastUpdated: parsed.data.lastUpdated || undefined,
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/${parsed.data.slug}`);
  return { success: true, page: saved };
}

export async function deletePageAction(id: string) {
  try {
    const supabase = getDbClient();
    if (isUuid(id)) {
      await supabase.from("pages").delete().eq("id", id);
    }
  } catch {}
  const deleted = adminStore.deletePage(id);
  revalidatePath("/admin/pages");
  return { success: deleted };
}

// --- SITE CONTENT ACTIONS (STORED IN SUPABASE SITE_SETTINGS) ---
export async function getSiteContentAction(): Promise<AdminSiteContent> {
  const defaults = adminStore.getSiteContent();
  const saved = await getSetting<Partial<AdminSiteContent>>("site_content", {});
  return {
    ...defaults,
    ...(saved || {}),
    hero: { ...defaults.hero, ...(saved?.hero || {}) },
    aboutTeaser: { ...defaults.aboutTeaser, ...(saved?.aboutTeaser || {}) },
    genesis: { ...defaults.genesis, ...(saved?.genesis || {}) },
    whyChooseUs: { ...defaults.whyChooseUs, ...(saved?.whyChooseUs || {}) },
    process: { ...defaults.process, ...(saved?.process || {}) },
    ctaBanner: { ...defaults.ctaBanner, ...(saved?.ctaBanner || {}) },
    corporateGroup: {
      ...defaults.corporateGroup,
      ...(saved?.corporateGroup || {}),
      whoWeAre: {
        ...defaults.corporateGroup.whoWeAre!,
        ...(saved?.corporateGroup?.whoWeAre || {}),
      },
      ethos: {
        ...defaults.corporateGroup.ethos!,
        ...(saved?.corporateGroup?.ethos || {}),
      },
      foundingPioneer: {
        ...defaults.corporateGroup.foundingPioneer,
        ...(saved?.corporateGroup?.foundingPioneer || {}),
      },
    },
    executiveMessages: {
      mdMessage: {
        ...defaults.executiveMessages!.mdMessage,
        ...(saved?.executiveMessages?.mdMessage || {}),
      },
      chairmanMessage: {
        ...defaults.executiveMessages!.chairmanMessage,
        ...(saved?.executiveMessages?.chairmanMessage || {}),
      },
    },
    coreValues: { ...defaults.coreValues!, ...(saved?.coreValues || {}) },
    journey: { ...defaults.journey!, ...(saved?.journey || {}) },
    visionMission: { ...defaults.visionMission!, ...(saved?.visionMission || {}) },
    leadCapture: { ...defaults.leadCapture!, ...(saved?.leadCapture || {}) },
    aboutPage: { ...defaults.aboutPage!, ...(saved?.aboutPage || {}) },
    projectsPage: { ...defaults.projectsPage!, ...(saved?.projectsPage || {}) },
    propertiesPage: { ...defaults.propertiesPage!, ...(saved?.propertiesPage || {}) },
    servicesPage: { ...defaults.servicesPage!, ...(saved?.servicesPage || {}) },
    teamPage: { ...defaults.teamPage!, ...(saved?.teamPage || {}) },
    galleryPage: { ...defaults.galleryPage!, ...(saved?.galleryPage || {}) },
    blogPage: { ...defaults.blogPage!, ...(saved?.blogPage || {}) },
    contactPage: { ...defaults.contactPage!, ...(saved?.contactPage || {}) },
  };
}

export async function updateSiteContentAction(section: string, data: any) {
  const currentContent = await getSiteContentAction();
  const updatedContent = {
    ...currentContent,
    [section]: data,
  };

  await saveSetting("site_content", updatedContent);
  adminStore.updateSiteContent(section as any, data);

  revalidatePath("/admin/content");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/corona-group");
  revalidatePath("/projects");
  revalidatePath("/properties");
  revalidatePath("/services");
  revalidatePath("/team");
  revalidatePath("/gallery");
  revalidatePath("/blog");
  revalidatePath("/contact");
  return { success: true, content: updatedContent };
}

// --- NAVIGATION ACTIONS (STORED IN SUPABASE SITE_SETTINGS) ---
export async function getNavigationAction(): Promise<AdminNavigation> {
  const defaults = adminStore.getNavigation();
  const saved = await getSetting<Partial<AdminNavigation>>("navigation", {});
  return {
    header: saved?.header && saved.header.length > 0 ? saved.header : defaults.header,
    footer: {
      company: saved?.footer?.company || defaults.footer.company,
      services: saved?.footer?.services || defaults.footer.services,
      support: saved?.footer?.support || defaults.footer.support,
      legal: saved?.footer?.legal || defaults.footer.legal,
    },
    categories: saved?.categories && saved.categories.length > 0 ? saved.categories : defaults.categories,
  };
}

export async function updateNavigationAction(navData: any) {
  await saveSetting("navigation", navData);
  adminStore.updateNavigation(navData);

  revalidatePath("/admin/navigation");
  revalidatePath("/", "layout");
  return { success: true, navigation: navData };
}

// --- UNIFIED CATEGORIES ACTIONS ---
export async function getCategoriesAction(scope?: CategoryScope | string): Promise<AdminCategory[]> {
  const all = await getSetting<AdminCategory[]>("categories", adminStore.getCategories());
  const list = Array.isArray(all) && all.length > 0 ? all : adminStore.getCategories();
  const filtered = scope ? list.filter((c) => c.scope === scope) : list;
  return [...filtered].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function saveCategoryAction(
  catData: Partial<AdminCategory> & { name: string; scope: CategoryScope }
) {
  if (!catData.name?.trim()) {
    return { success: false, error: "Category name is required" };
  }

  const all = await getCategoriesAction();
  const savedInStore = adminStore.saveCategory({
    ...catData,
    name: catData.name.trim(),
  });

  const idx = all.findIndex((c) => c.id === savedInStore.id);
  const updatedList =
    idx >= 0
      ? all.map((c) => (c.id === savedInStore.id ? savedInStore : c))
      : [...all, savedInStore];

  await saveSetting("categories", updatedList);

  revalidatePath("/admin/categories");
  revalidatePath("/admin/properties");
  revalidatePath("/admin/media");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/content");
  revalidatePath("/admin/services");
  revalidatePath("/properties");
  revalidatePath("/projects");
  revalidatePath("/gallery");
  revalidatePath("/blog");
  revalidatePath("/contact");
  revalidatePath("/services");

  return { success: true, category: savedInStore };
}

export async function deleteCategoryAction(id: string) {
  const all = await getCategoriesAction();
  adminStore.deleteCategory(id);
  const updatedList = all.filter((c) => c.id !== id);
  await saveSetting("categories", updatedList);

  revalidatePath("/admin/categories");
  revalidatePath("/properties");
  revalidatePath("/gallery");
  revalidatePath("/blog");
  revalidatePath("/contact");
  return { success: true };
}

export async function reorderCategoriesAction(ids: string[]) {
  const all = await getCategoriesAction();
  adminStore.reorderCategories(ids);
  const updatedList = all.map((cat) => {
    const pos = ids.indexOf(cat.id);
    return pos >= 0 ? { ...cat, sortOrder: pos + 1 } : cat;
  });
  await saveSetting("categories", updatedList);
  revalidatePath("/admin/categories");
  revalidatePath("/properties");
  revalidatePath("/gallery");
  revalidatePath("/blog");
  revalidatePath("/contact");
  return { success: true };
}

// --- CUSTOM FIELDS ACTIONS ---
export async function getCustomFieldsAction(): Promise<CustomFieldDef[]> {
  const saved = await getSetting<CustomFieldDef[]>("custom_fields", adminStore.getCustomFields());
  return Array.isArray(saved) && saved.length > 0 ? saved : adminStore.getCustomFields();
}

export async function saveCustomFieldAction(
  fieldData: Partial<CustomFieldDef> & { label: string; type: CustomFieldDef["type"] }
) {
  const all = await getCustomFieldsAction();
  const saved = adminStore.saveCustomField(fieldData);
  const idx = all.findIndex((f) => f.id === saved.id);
  const next = idx >= 0 ? all.map((f) => (f.id === saved.id ? saved : f)) : [...all, saved];
  await saveSetting("custom_fields", next);
  revalidatePath("/admin/settings/custom-fields");
  revalidatePath("/admin/properties");
  return { success: true, field: saved };
}

export async function deleteCustomFieldAction(id: string) {
  const all = await getCustomFieldsAction();
  adminStore.deleteCustomField(id);
  await saveSetting(
    "custom_fields",
    all.filter((f) => f.id !== id)
  );
  revalidatePath("/admin/settings/custom-fields");
  revalidatePath("/admin/properties");
  return { success: true };
}

// --- LEAD DETAILS & CUSTOM STAGES ACTIONS ---
export async function getLeadDetailsAction(leadId: string) {
  const leads = await getLeadsAction();
  const lead = leads.find((l) => l.id === leadId) || adminStore.getLeadById(leadId) || null;
  let activities: LeadActivity[] = adminStore.getLeadActivities(leadId);

  try {
    if (isUuid(leadId)) {
      const supabase = getDbClient();
      const { data } = await supabase
        .from("lead_activities")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        activities = data.map((a: any) => ({
          id: a.id,
          leadId: a.lead_id,
          actorName: a.actor_name || "Advisor",
          type: a.type || "note",
          title: a.title,
          description: a.description,
          createdAt: a.created_at,
        }));
      }
    }
  } catch {}

  return { lead, activities };
}

export async function saveStageAction(stageData: Partial<LeadStage> & { name: string }) {
  const saved = adminStore.saveStage(stageData);
  try {
    if (isUuid(saved.id)) {
      const supabase = getDbClient();
      await supabase.from("lead_stages").upsert({
        id: saved.id,
        name: saved.name,
        slug: saved.slug,
        color: saved.color,
        sort_order: saved.sortOrder,
        is_system: saved.isSystem,
      });
    }
  } catch {}
  revalidatePath("/admin/leads");
  revalidatePath("/admin/leads/kanban");
  return { success: true, stage: saved };
}
