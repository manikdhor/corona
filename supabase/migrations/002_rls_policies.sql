-- ============================================================
-- 002_rls_policies.sql
-- Corona Properties Limited - Row Level Security Policies
-- Granular permissions: Super Admin, Admin, Agent, Editor, Auditor
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_icons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.get_auth_admin_role()
RETURNS TEXT AS $$
DECLARE
    v_role TEXT;
BEGIN
    SELECT r.name INTO v_role
    FROM public.admin_users u
    JOIN public.roles r ON u.role_id = r.id
    WHERE u.auth_user_id = auth.uid()
    AND u.status = 'active'
    AND u.deleted_at IS NULL;

    RETURN COALESCE(v_role, 'public');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PUBLIC READ ACCESS (For frontend real estate visitors)
DROP POLICY IF EXISTS "Public can view published properties" ON public.properties;
CREATE POLICY "Public can view published properties" ON public.properties
    FOR SELECT USING (approval_status = 'Published' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Public can view property images" ON public.property_images;
CREATE POLICY "Public can view property images" ON public.property_images
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view property features" ON public.property_features;
CREATE POLICY "Public can view property features" ON public.property_features
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view amenities" ON public.amenities;
CREATE POLICY "Public can view amenities" ON public.amenities
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view active social links" ON public.social_links;
CREATE POLICY "Public can view active social links" ON public.social_links
    FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can view active custom scripts" ON public.custom_scripts;
CREATE POLICY "Public can view active custom scripts" ON public.custom_scripts
    FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts" ON public.blog_posts
    FOR SELECT USING (status = 'Published' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Public can view active agents" ON public.agents;
CREATE POLICY "Public can view active agents" ON public.agents
    FOR SELECT USING (is_active = TRUE AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Public can view seo meta" ON public.seo_meta;
CREATE POLICY "Public can view seo meta" ON public.seo_meta
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view active redirects" ON public.redirects;
CREATE POLICY "Public can view active redirects" ON public.redirects
    FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings" ON public.site_settings
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view custom icons" ON public.custom_icons;
CREATE POLICY "Public can view custom icons" ON public.custom_icons
    FOR SELECT USING (TRUE);

-- 2. PUBLIC INTAKE (Inbound leads from contact form & inquiries)
DROP POLICY IF EXISTS "Public can submit inbound leads" ON public.leads;
CREATE POLICY "Public can submit inbound leads" ON public.leads
    FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public can create initial lead activity" ON public.lead_activities;
CREATE POLICY "Public can create initial lead activity" ON public.lead_activities
    FOR INSERT WITH CHECK (TRUE);

-- 3. ADMIN & SUPER ADMIN FULL ACCESS (Via Service Role or Authenticated Staff)
DROP POLICY IF EXISTS "Staff full access on properties" ON public.properties;
CREATE POLICY "Staff full access on properties" ON public.properties
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Editor'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Editor'));

DROP POLICY IF EXISTS "Staff full access on property images" ON public.property_images;
CREATE POLICY "Staff full access on property images" ON public.property_images
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Editor'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Editor'));

DROP POLICY IF EXISTS "Staff full access on leads" ON public.leads;
CREATE POLICY "Staff full access on leads" ON public.leads
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Agent', 'Support'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Agent', 'Support'));

DROP POLICY IF EXISTS "Staff full access on lead activities" ON public.lead_activities;
CREATE POLICY "Staff full access on lead activities" ON public.lead_activities
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Agent', 'Support'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Agent', 'Support'));

DROP POLICY IF EXISTS "Staff full access on lead stages" ON public.lead_stages;
CREATE POLICY "Staff full access on lead stages" ON public.lead_stages
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin'));

DROP POLICY IF EXISTS "Staff full access on media library" ON public.media_library;
CREATE POLICY "Staff full access on media library" ON public.media_library
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Editor'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Editor'));

DROP POLICY IF EXISTS "Staff full access on social links" ON public.social_links;
CREATE POLICY "Staff full access on social links" ON public.social_links
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin'));

DROP POLICY IF EXISTS "Staff full access on seo meta" ON public.seo_meta;
CREATE POLICY "Staff full access on seo meta" ON public.seo_meta
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Editor'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Editor'));

DROP POLICY IF EXISTS "Staff full access on redirects" ON public.redirects;
CREATE POLICY "Staff full access on redirects" ON public.redirects
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin'));

DROP POLICY IF EXISTS "Staff full access on custom scripts" ON public.custom_scripts;
CREATE POLICY "Staff full access on custom scripts" ON public.custom_scripts
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin'));

DROP POLICY IF EXISTS "Staff full access on audit logs" ON public.audit_logs;
CREATE POLICY "Staff full access on audit logs" ON public.audit_logs
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Auditor'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin'));

DROP POLICY IF EXISTS "Staff full access on site settings" ON public.site_settings;
CREATE POLICY "Staff full access on site settings" ON public.site_settings
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin'));

DROP POLICY IF EXISTS "Staff full access on blog posts" ON public.blog_posts;
CREATE POLICY "Staff full access on blog posts" ON public.blog_posts
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Editor'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin', 'Editor'));

DROP POLICY IF EXISTS "Staff full access on roles & permissions" ON public.roles;
CREATE POLICY "Staff full access on roles & permissions" ON public.roles
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() = 'Super Admin')
    WITH CHECK (public.get_auth_admin_role() = 'Super Admin');

DROP POLICY IF EXISTS "Staff full access on admin users" ON public.admin_users;
CREATE POLICY "Staff full access on admin users" ON public.admin_users
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() = 'Super Admin')
    WITH CHECK (public.get_auth_admin_role() = 'Super Admin');

DROP POLICY IF EXISTS "Staff full access on saved views" ON public.saved_views;
CREATE POLICY "Staff full access on saved views" ON public.saved_views
    FOR ALL TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Staff full access on custom fields" ON public.custom_fields;
CREATE POLICY "Staff full access on custom fields" ON public.custom_fields
    FOR ALL TO authenticated
    USING (public.get_auth_admin_role() IN ('Super Admin', 'Admin'))
    WITH CHECK (public.get_auth_admin_role() IN ('Super Admin', 'Admin'));
