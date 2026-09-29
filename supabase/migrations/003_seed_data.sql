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
