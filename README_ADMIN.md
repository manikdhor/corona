# Corona Properties Limited — Production Admin Panel & CMS

A production-grade, high-performance administrative panel and CMS built specifically for **Corona Properties Limited**, empowering non-technical administrators to manage real estate enclaves, land listings, inbound buyer pipelines, digital assets, SEO authority, and team access.

---

## 🏛️ Architectural Overview & Tech Stack Choice

As required by the client brief, this admin panel is built with:
- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Design System:** Custom luxury aesthetic matching Corona Properties (Deep Navy `#0a1a3e` & Warm Champagne Gold `#c9a96e`), responsive drawers, dialogs, and shadcn/ui-inspired primitives
- **Database & Auth:** Supabase (Postgres 17, Row Level Security, Storage, Auth, Triggers)
- **Rich Text Editor:** Tiptap (ProseMirror-based) with custom extensions, embeds, and Notion-style slash commands
- **Data Tables:** Advanced table engine with server/client pagination, multi-column sorting, column show/hide, row density, bulk operations, saved views, and CSV/Excel export
- **Image Pipeline:** Dual-mode uploader (Upload with client-side WebP conversion & EXIF stripping, or External URL with HEAD request validation) + Central Media Library
- **Icon Engine:** 200+ visual Lucide icons organized by real estate categories + DOMPurify-sanitized custom SVG upload
- **API & Backend Layer:** Next.js Server Actions and Route Handlers utilizing `@supabase/ssr`

### Why Next.js Server Actions + Supabase SSR?
1. **Zero-Latency Co-location:** Eliminates external CORS overhead and separate server maintenance.
2. **Unified Type Safety:** Direct end-to-end TypeScript models from database tables down to UI forms.
3. **Resilient Hybrid Data Store:** Operates seamlessly with live reactive in-memory state and synchronizes with Supabase Postgres.
4. **Single-Artifact Deployment:** Deploys natively to Vercel or cPanel with Node.js selector using the standard `server.js` wrapper.

---

## 📦 Installed & Verified Modules

| Module | Route | Key Capabilities |
|---|---|---|
| **Executive Dashboard** | `/admin` | Real-time KPIs (Active listings, Leads, Pipeline Value, Conversion Rate), pipeline stage distribution, recent inquiries, Supabase health monitor |
| **Properties Management** | `/admin/properties` | Advanced data table with search, filters, inline status toggles, featured switch, bulk actions, and CSV/Excel export |
| **Property Editor (New/Edit)** | `/admin/properties/[id]` | Bilingual tabs (English & বাংলা), Tiptap editor, image pipeline, gallery manager with reordering, SEO SERP preview, infrastructure specs |
| **Leads Table** | `/admin/leads` | Multi-channel intake (Website, WhatsApp, Schedule Visit), duplicate check, search, and activity timeline drawer |
| **Leads Kanban Board** | `/admin/leads/kanban` | Interactive drag-and-drop deal progression across configurable pipeline stages with stage metrics |
| **Media Asset Library** | `/admin/media` | Searchable asset grid, usage tracking across active listings, alt-text editor for Google Image SEO, safe delete warning |
| **Social Links Manager** | `/admin/social` | 24+ platform presets (Facebook, WhatsApp, YouTube, etc.), visual icon picker, custom SVG, reordering, and live preview |
| **SEO & SERP Suite** | `/admin/seo` | Meta title & description defaults, Google SERP live snippet, robots.txt live editor, Schema.org JSON-LD graph |
| **301 Redirects & 404 Monitor** | `/admin/seo/redirects` | Permanent/temporary URL redirects, hit counter, 404 broken-link monitor with 1-click redirect creation |
| **Global Custom Scripts** | `/admin/seo/scripts` | Header `<head>` and `</body>` code injection for Google Analytics, GTM, Meta Pixel, and chat widgets |
| **RBAC Roles & Sessions** | `/admin/roles` | Granular permission matrix across modules and actions, agent row-level isolation, active sessions, and 2FA |
| **System Audit Trail** | `/admin/audit-logs` | Immutable audit log capturing actor, action, old-to-new JSON diffs, IP address, and timestamps |
| **Brand & System Settings** | `/admin/settings` | White-label branding (logos, taglines, addresses), public map coordinate config, and one-click JSON database backup |
| **Dynamic Custom Fields** | `/admin/settings/custom-fields` | Add arbitrary attributes (Text, Number, Dropdown, Boolean) to listings without altering database schemas |
| **Webhooks & Telegram** | `/admin/settings/webhooks` | Outgoing webhooks for n8n pipelines, Telegram advisory alerts, and test dispatch ping |
| **Global Command Palette** | `⌘K` or `Ctrl+K` | Instant fuzzy search across properties, leads, agents, and modules with keyboard navigation |

---

## 🔑 Environment Variables Configuration

Create or verify `.env.local` in the project root:

```env
# Supabase Postgres & Auth Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xtilpfcqhecqhifftrop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0aWxwZmNxaGVjcWhpZmZ0cm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MTc0NjAsImV4cCI6MjEwNTQ5MzQ2MH0.76pYQvln0KgL-_DcsJN-cAWEXMgnDtn3eD9g56Noemo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0aWxwZmNxaGVjcWhpZmZ0cm9wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTkxNzQ2MCwiZXhwIjoyMTA1NDkzNDYwfQ.JuWzS-59Xem9NmFbL_As0Th3dx9UFJa_etwNogxxH2w

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🗄️ Executing Supabase Migrations

The migrations are located in `supabase/migrations/`:
1. `001_initial_schema.sql`: 22 tables with UUID primary keys, foreign keys, constraints, full-text search indexes (`tsvector`), and auto-touch `updated_at` triggers.
2. `002_rls_policies.sql`: Row-Level Security policies enforcing public read, public lead submission, and staff granular privileges.
3. `003_seed_data.sql`: Production seed data including Maple Leaf Garden City flagship, Corona Lakeview Enclave, default pipeline stages, categories, amenities, agents, and branding settings.

### How to apply in Supabase Dashboard:
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard/project/xtilpfcqhecqhifftrop).
2. Open the **SQL Editor** tab from the left sidebar.
3. Open `supabase/migrations/001_initial_schema.sql`, copy all contents, paste into the SQL Editor, and click **Run**.
4. Repeat for `supabase/migrations/002_rls_policies.sql`.
5. Repeat for `supabase/migrations/003_seed_data.sql`.

---

## 🚀 Running Locally and Building for Production

### Development Server:
```bash
npm run dev
```
Access the public website at `http://localhost:3000` and the Admin CMS at `http://localhost:3000/admin`.

### Production Build:
```bash
npm run build
npm start
```
