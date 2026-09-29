-- ============================================================
-- 001_initial_schema.sql
-- Corona Properties Limited - Complete Database Schema
-- Modules: Properties, Leads, Media, RBAC, SEO, Settings, Audit
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. ROLES & PERMISSIONS
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_permissions_module_action UNIQUE (module, action)
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- 2. ADMIN USERS (Integrated with Supabase Auth or standalone admin roster)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    role_id UUID NOT NULL REFERENCES public.roles(id),
    avatar_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_secret TEXT,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 3. CATEGORIES & AMENITIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100) DEFAULT 'Building',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100) NOT NULL DEFAULT 'Trees',
    description TEXT,
    category VARCHAR(50) DEFAULT 'General',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.custom_icons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    svg_content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Custom',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. AGENTS
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'Senior Property Consultant',
    bio TEXT,
    avatar_url TEXT,
    active_leads_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 5. PROPERTIES & LISTINGS
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255),
    tagline VARCHAR(255),
    tagline_bn VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    area VARCHAR(100) NOT NULL,
    price VARCHAR(100) NOT NULL,
    price_value NUMERIC(15, 2) NOT NULL DEFAULT 0,
    type VARCHAR(50) NOT NULL DEFAULT 'Premium',
    status VARCHAR(50) NOT NULL DEFAULT 'Available',
    approval_status VARCHAR(50) NOT NULL DEFAULT 'Published',
    size VARCHAR(100) NOT NULL,
    featured_image TEXT NOT NULL,
    overview TEXT,
    overview_bn TEXT,
    genesis TEXT,
    highlights TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    specs JSONB DEFAULT '[]',
    plot_types JSONB DEFAULT '[]',
    total_plots INT DEFAULT 0,
    total_area VARCHAR(100),
    road_primary VARCHAR(100),
    road_secondary VARCHAR(100),
    coordinates JSONB NOT NULL DEFAULT '{"lat": 23.86489, "lng": 90.5647}',
    is_flagship BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    custom_field_values JSONB DEFAULT '{}',
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255) NOT NULL DEFAULT 'Property image',
    caption TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.property_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
    custom_name VARCHAR(150),
    custom_icon VARCHAR(100),
    sort_order INT NOT NULL DEFAULT 0
);

-- 6. LEAD MANAGEMENT & PIPELINE
CREATE TABLE IF NOT EXISTS public.lead_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(30) NOT NULL DEFAULT '#c9a96e',
    sort_order INT NOT NULL DEFAULT 0,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    source VARCHAR(100) NOT NULL DEFAULT 'Website Form',
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    property_title VARCHAR(255),
    stage_id UUID NOT NULL REFERENCES public.lead_stages(id),
    assigned_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    priority VARCHAR(30) NOT NULL DEFAULT 'Medium',
    budget VARCHAR(100),
    budget_min NUMERIC(15, 2) DEFAULT 0,
    budget_max NUMERIC(15, 2) DEFAULT 0,
    preferred_location VARCHAR(150),
    message TEXT,
    score INT NOT NULL DEFAULT 50,
    tags TEXT[] DEFAULT '{}',
    next_follow_up TIMESTAMPTZ,
    is_duplicate BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    actor_id UUID,
    actor_name VARCHAR(150) DEFAULT 'System',
    type VARCHAR(50) NOT NULL DEFAULT 'note', -- 'note', 'call', 'email', 'stage_change', 'whatsapp', 'visit'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    width INT,
    height INT,
    alt_text VARCHAR(255) NOT NULL DEFAULT 'Corona Properties Asset',
    usage_count INT NOT NULL DEFAULT 0,
    usage_references JSONB DEFAULT '[]',
    uploaded_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SOCIAL MEDIA LINKS
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    icon_name VARCHAR(100),
    custom_svg_id UUID REFERENCES public.custom_icons(id) ON DELETE SET NULL,
    open_new_tab BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SEO & DEVELOPER CONTROLS
CREATE TABLE IF NOT EXISTS public.seo_meta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- 'property', 'page', 'blog', 'global'
    entity_id VARCHAR(100) NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    canonical_url TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image TEXT,
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    focus_keyword VARCHAR(150),
    robots_index BOOLEAN NOT NULL DEFAULT TRUE,
    robots_follow BOOLEAN NOT NULL DEFAULT TRUE,
    custom_json_ld TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_seo_entity UNIQUE (entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS public.redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_path VARCHAR(255) NOT NULL UNIQUE,
    target_path VARCHAR(255) NOT NULL,
    status_code INT NOT NULL DEFAULT 301,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    hit_count BIGINT NOT NULL DEFAULT 0,
    last_accessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.custom_scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    placement VARCHAR(30) NOT NULL DEFAULT 'head', -- 'head', 'body_end'
    code TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by VARCHAR(100) DEFAULT 'Super Admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. AUDIT LOGGING & SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id TEXT,
    actor_email VARCHAR(255),
    action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'LOGIN'
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}',
    updated_by VARCHAR(100),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255),
    excerpt TEXT,
    excerpt_bn TEXT,
    content TEXT NOT NULL,
    content_bn TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'Market Insights',
    author VARCHAR(150) NOT NULL DEFAULT 'Corona Research Desk',
    author_role VARCHAR(100) DEFAULT 'Editorial Team',
    image TEXT NOT NULL,
    read_time VARCHAR(50) DEFAULT '5 min read',
    status VARCHAR(50) NOT NULL DEFAULT 'Published',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.saved_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'default',
    module VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL DEFAULT 'property',
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(100) NOT NULL,
    field_type VARCHAR(50) NOT NULL DEFAULT 'text', -- 'text', 'number', 'select', 'boolean'
    options TEXT[] DEFAULT '{}',
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. INDEXES FOR PERFORMANCE & FULL-TEXT SEARCH
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_approval_status ON public.properties(approval_status);
CREATE INDEX IF NOT EXISTS idx_properties_price_value ON public.properties(price_value);
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON public.properties(assigned_agent_id);

CREATE INDEX IF NOT EXISTS idx_leads_stage ON public.leads(stage_id);
CREATE INDEX IF NOT EXISTS idx_leads_agent ON public.leads(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON public.leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email_phone ON public.leads(email, phone);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- Search Indexes with pg_trgm
CREATE INDEX IF NOT EXISTS idx_properties_search ON public.properties USING gin (title gin_trgm_ops, location gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_leads_search ON public.leads USING gin (name gin_trgm_ops, email gin_trgm_ops, phone gin_trgm_ops);

-- 12. AUTO-TOUCH UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT DISTINCT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND column_name = 'updated_at'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_updated_at_%I ON public.%I', t, t);
        EXECUTE format('CREATE TRIGGER trg_updated_at_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t, t);
    END LOOP;
END;
$$;
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
-- ============================================================
-- 003_seed_data.sql
-- Corona Properties Limited - Complete Initial Seed Data
-- ============================================================

-- 1. SEED ROLES
INSERT INTO public.roles (id, name, display_name, description, is_system) VALUES
('00000000-0000-0000-0000-000000000001', 'Super Admin', 'Super Administrator', 'Complete unrestricted system access and user management', true),
('00000000-0000-0000-0000-000000000002', 'Admin', 'Administrator', 'Full access to content, listings, leads, and SEO settings', true),
('00000000-0000-0000-0000-000000000003', 'Editor', 'Content Editor', 'Can manage blog posts, pages, and property listings', false),
('00000000-0000-0000-0000-000000000004', 'Agent', 'Property Consultant', 'Can view listings and manage assigned leads', false),
('00000000-0000-0000-0000-000000000005', 'Marketing', 'Growth & Marketing', 'Access to leads, campaign tracking, and SEO meta', false),
('00000000-0000-0000-0000-000000000006', 'Support', 'Customer Support', 'Handles inbound inquiries, WhatsApp and callbacks', false),
('00000000-0000-0000-0000-000000000007', 'Auditor', 'Auditor / Read-Only', 'Read-only inspection of listings, logs, and analytics', false)
ON CONFLICT (name) DO NOTHING;

-- 2. SEED LEAD STAGES
INSERT INTO public.lead_stages (id, name, slug, color, sort_order, is_system) VALUES
('10000000-0000-0000-0000-000000000001', 'New', 'new', '#3b82f6', 1, true),
('10000000-0000-0000-0000-000000000002', 'Contacted', 'contacted', '#f59e0b', 2, true),
('10000000-0000-0000-0000-000000000003', 'Qualified', 'qualified', '#10b981', 3, true),
('10000000-0000-0000-0000-000000000004', 'Site Visit Scheduled', 'site-visit-scheduled', '#8b5cf6', 4, true),
('10000000-0000-0000-0000-000000000005', 'Negotiation', 'negotiation', '#ec4899', 5, true),
('10000000-0000-0000-0000-000000000006', 'Won', 'won', '#10b981', 6, true),
('10000000-0000-0000-0000-000000000007', 'Lost', 'lost', '#ef4444', 7, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, description, icon, sort_order) VALUES
('20000000-0000-0000-0000-000000000001', 'Master-Planned Communities', 'master-planned', 'Large-scale residential enclaves with dedicated infrastructure', 'Landmark', 1),
('20000000-0000-0000-0000-000000000002', 'Residential Plots', 'residential-plots', 'Individual premium housing plots ready for construction', 'Home', 2),
('20000000-0000-0000-0000-000000000003', 'Commercial High Street', 'commercial', 'High-street retail and commercial development plots', 'Store', 3),
('20000000-0000-0000-0000-000000000004', 'Lakefront Estates', 'lakefront', 'Scenic waterfront residential plots with pristine views', 'Waves', 4)
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED AMENITIES
INSERT INTO public.amenities (id, name, slug, icon, description, category) VALUES
('30000000-0000-0000-0000-000000000001', 'Central Hospital', 'hospital', 'HeartPulse', '24/7 multispecialty hospital with emergency trauma care', 'Healthcare'),
('30000000-0000-0000-0000-000000000002', 'Grand Community Mosque', 'mosque', 'Landmark', 'Handcrafted architecture accommodating 2,000+ worshippers', 'Civic'),
('30000000-0000-0000-0000-000000000003', 'Indoor Sports Complex', 'sports', 'Trophy', 'Badminton, table tennis, and squash courts', 'Recreation'),
('30000000-0000-0000-0000-000000000004', 'Signature Lake & Waterbody', 'lake', 'Waves', '3-acre landscaped lagoon with pedestrian promenade', 'Nature'),
('30000000-0000-0000-0000-000000000005', 'Children Playgrounds', 'playground', 'Trees', 'Age-segregated, rubber-floored secured play zones', 'Recreation'),
('30000000-0000-0000-0000-000000000006', 'Commercial High Street', 'commercial', 'Store', 'Retail, boutique supermarket, café, and dining strip', 'Commercial'),
('30000000-0000-0000-0000-000000000007', 'Underground Utility Network', 'utilities', 'Zap', 'Clean skyline with zero overhead wires (Power & Gas)', 'Infrastructure'),
('30000000-0000-0000-0000-000000000008', 'Gated Perimeter & Smart CCTV', 'security', 'ShieldCheck', 'Biometric access gates with 24/7 armed mobile patrols', 'Security'),
('30000000-0000-0000-0000-000000000009', '24/7 Fuel Station', 'fuel', 'Fuel', 'Integrated CNG, Octane, and EV charging points', 'Services'),
('30000000-0000-0000-0000-000000000010', 'Fitness & Executive Lounge', 'fitness', 'Dumbbell', 'State-of-the-art gym and private co-working lounge', 'Wellness')
ON CONFLICT (slug) DO NOTHING;

-- 5. SEED AGENTS
INSERT INTO public.agents (id, name, email, phone, role, bio, avatar_url, active_leads_count, is_active) VALUES
('40000000-0000-0000-0000-000000000001', 'Rafiqul Islam', 'rafiqul@coronaproperties.com', '+880 1805 759297', 'Director of Client Relations', 'Over 14 years specializing in high-value Purbachal and Gulshan land investments.', '/image-01.webp', 12, true),
('40000000-0000-0000-0000-000000000002', 'Nadia Chowdhury', 'nadia@coronaproperties.com', '+880 1711 223344', 'Senior Property Consultant', 'Expert in residential layout planning, titles, and NRI buyer advisory.', '/image-02.webp', 8, true),
('40000000-0000-0000-0000-000000000003', 'Tanvir Ahmed', 'tanvir@coronaproperties.com', '+880 1912 334455', 'Investment Portfolio Manager', 'Advises institutional investors and corporate clients on commercial land banking.', '/image-03.webp', 5, true)
ON CONFLICT (email) DO NOTHING;

-- 6. SEED FLAGSHIP & LUXURY PROPERTIES
INSERT INTO public.properties (
    id, slug, title, title_bn, tagline, tagline_bn, location, area, price, price_value,
    type, status, approval_status, size, featured_image, overview, overview_bn, genesis,
    highlights, features, total_plots, total_area, road_primary, road_secondary,
    is_flagship, is_featured, assigned_agent_id
) VALUES
(
    '50000000-0000-0000-0000-000000000001',
    'maple-leaf-garden-city',
    'Maple Leaf Garden City',
    'ম্যাপল লিফ গার্ডেন সিটি',
    'Where Maple Canopy Meets Bangladeshi Aspiration',
    'কানাডার স্বপ্ন, বাংলাদেশের মাটিতে',
    'Purbachal, Dhaka — Bholabo Union',
    'Purbachal, Dhaka',
    'BDT 35 Lakh - 2.5 Crore',
    35000000.00,
    'Exclusive',
    'Available',
    'Published',
    '3 to 20+ Katha',
    '/image-06.webp',
    'Maple Leaf Garden City is a meticulously master-planned residential enclave in Purbachal, Dhaka. Conceived by visionary Bangladeshi expatriates inspired by the serenity and architectural discipline of Toronto planned neighbourhoods.',
    'ম্যাপল লিফ গার্ডেন সিটি পূর্বাচল ঢাকার একটি অনন্য ও আধুনিক পরিকল্পিত আবাসিক প্রকল্প। কানাডার টরন্টোর উন্নত নাগরিক জীবনের আদলে তৈরি এই প্রকল্পটিতে রয়েছে বিশ্বমানের সব সুযোগ সুবিধা।',
    'The idea was born from a conviction: Can families in Bangladesh experience the same tranquility and urban discipline found in North Americas finest master communities?',
    ARRAY['Master layout with complete legal documentation', '80 ft and 40 ft wide avenues', 'Gated perimeter with 24/7 security and smart surveillance', 'Continuous maple tree canopy along pedestrian boulevards', 'Underground utility corridors for pristine skyline'],
    ARRAY['Over 2,504 individually titled residential plots', 'Wide tree-lined boulevards with pedestrian walkways', 'Underground electricity and city-gas connectivity', 'Modern sewage treatment and stormwater management', 'Designated green belts, community parklands, and lake'],
    2504,
    'Approximately 90 Acres',
    '80 ft Wide Arterial Roads',
    '40 ft Wide Access Roads',
    true,
    true,
    '40000000-0000-0000-0000-000000000001'
),
(
    '50000000-0000-0000-0000-000000000002',
    'corona-lakeview-enclave',
    'Corona Lakeview Enclave',
    'করোনা লেকভিউ এনক্লেভ',
    'Serene Waterfront Living in Gulshan Vicinity',
    'গুলশানের সন্নিকটে লেকের শান্ত পরিবেশ',
    'Gulshan-Badda Lake Corridor',
    'Gulshan Corridor',
    'BDT 1.2 Crore / Katha',
    120000000.00,
    'Premium',
    'Available',
    'Published',
    '5 & 10 Katha Plots',
    '/image-02.webp',
    'Prime waterfront plots with direct panorama over Gulshan lake. Strictly low-density zoning ensuring complete privacy and peerless capital appreciation.',
    'গুলশান লেকের তীরে মনোরম প্রাকৃতিক পরিবেশে অবস্থিত প্রিমিয়াম আবাসিক প্লট।',
    'Created for discerning homeowners who refuse to compromise on natural water views inside the metropolitan heart.',
    ARRAY['Direct lake frontage with private jetty option', 'South-facing orientation maximizing daylight and breeze', 'Ready for immediate foundation work with soil test reports certified'],
    ARRAY['24/7 perimeter security', 'Private access road restricted to residents', 'Pre-installed utility conduits'],
    48,
    '15 Acres',
    '60 ft Primary Avenue',
    '30 ft Internal Roads',
    false,
    true,
    '40000000-0000-0000-0000-000000000002'
)
ON CONFLICT (slug) DO NOTHING;

-- 7. SEED LEADS ACROSS PIPELINE
INSERT INTO public.leads (
    name, email, phone, source, property_title, stage_id, assigned_agent_id, priority, budget, score, message
) VALUES
('Eng. M. Rahman', 'm.rahman.eng@gmail.com', '+880 1819 123456', 'Property Page Inquiry', 'Maple Leaf Garden City', '10000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 'High', 'BDT 1.5 - 2.0 Crore', 92, 'Interested in 10 Katha plot with lake-facing orientation. Visit scheduled for upcoming Friday.'),
('Dr. Arifa Sultana', 'arifa.sultana@dmc.edu.bd', '+880 1712 987654', 'WhatsApp Direct', 'Maple Leaf Garden City', '10000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000002', 'High', 'BDT 70 - 90 Lakh', 85, 'Looking for 5 Katha residential plot near the community hospital zone.'),
('Fahim Shahriar', 'fahim.shahriar@techcorp.io', '+880 1911 556677', 'Website Consultation Form', 'Corona Lakeview Enclave', '10000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', 'Medium', 'BDT 1.2 Crore', 68, 'Checking installment payment structures and legal clearance on title deed.'),
('Kamal Hossain (Toronto NRI)', 'kamal.hossain@rogers.ca', '+1 416 555 0192', 'Schedule a Visit', 'Maple Leaf Garden City', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'High', 'BDT 2.5 Crore', 95, 'Visiting Dhaka next month. Wants private walkthrough of Phase 1 executive plots.')
ON CONFLICT DO NOTHING;

-- 8. SEED SOCIAL MEDIA LINKS
INSERT INTO public.social_links (platform, label, url, icon_name, sort_order, is_active) VALUES
('Facebook', 'Corona Properties Official', 'https://facebook.com/coronapropertiesltd', 'Facebook', 1, true),
('Instagram', 'Corona Luxury Living', 'https://instagram.com/coronaproperties', 'Instagram', 2, true),
('YouTube', 'Corona Properties Tours', 'https://youtube.com/@coronaproperties', 'Youtube', 3, true),
('WhatsApp', 'WhatsApp Concierge', 'https://wa.me/8801805759297', 'MessageCircle', 4, true),
('LinkedIn', 'Corona Properties Corporate', 'https://linkedin.com/company/corona-properties', 'Linkedin', 5, true),
('Phone', 'Direct Helpline', 'tel:+8801805759297', 'Phone', 6, true),
('Email', 'Concierge Desk', 'mailto:cplcoronapropertiesltd@gmail.com', 'Mail', 7, true)
ON CONFLICT DO NOTHING;

-- 9. SEED SITE SETTINGS
INSERT INTO public.site_settings (key, value, updated_by) VALUES
('branding', '{
    "company_name": "Corona Properties Limited",
    "short_name": "Corona Properties",
    "tagline": "Crafting Timeless Land Legacies",
    "tagline_bn": "সময়ের ঊর্ধ্বে ভূমির ঐতিহ্য",
    "logo_url": "/image-01.webp",
    "favicon_url": "/favicon.ico",
    "primary_color": "#0a1a3e",
    "accent_gold": "#c9a96e",
    "phone": "+880 1805 759297",
    "email": "cplcoronapropertiesltd@gmail.com",
    "address": "House # 145, Flat # 704, Road # 3, Block A, Niketon, Gulshan 01, Dhaka - 1212",
    "coordinates": {"lat": 23.7745, "lng": 90.4125}
}', 'Super Admin'),
('webhooks', '{
    "n8n_lead_webhook": "https://n8n.coronaproperties.com/webhook/new-lead",
    "telegram_bot_token": "",
    "telegram_chat_id": "",
    "enable_telegram_alerts": true,
    "enable_email_alerts": true
}', 'Super Admin')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
