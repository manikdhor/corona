# Corona Properties Limited — Ultra Premium Website

A premium, multi-page Next.js website for Corona Properties Limited, a residential land-selling company based in Dhaka, Bangladesh.

## 🎨 Design System
- **Color Palette:** Royal Gold (`#c9a96e`) & Deep Navy (`#0a1a3e`)
- **Typography:** Playfair Display + Cormorant Garamond (serif), Inter (sans)
- **Animations:** Framer Motion with luxury easing curves

## 🛠️ Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (custom theme)
- Framer Motion
- Lucide React (icons)

## 📄 Pages
1. **Home** (`/`) — Hero, About teaser, Featured properties, Why choose us, Process, Testimonials, CTA
2. **About Us** (`/about`) — Story, vision/mission, values, timeline, team
3. **Properties** (`/properties`) — Filterable listing grid
4. **Property Detail** (`/properties/[slug]`) — Gallery, amenities, contact form
5. **Services** (`/services`) — Service cards + process
6. **Gallery** (`/gallery`) — Filterable lightbox gallery
7. **Blog** (`/blog` + `/blog/[slug]`) — Listing + article pages
8. **Contact** (`/contact`) — Form, map, FAQ

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build && npm start
```

Visit `http://localhost:3000`

## 📁 Structure
```
app/              → Page routes (App Router)
components/       → Reusable components
  ├── layout/     → Navbar, Footer, TopBar, Preloader
  ├── ui/         → Button, SectionHeading, PageHero
  ├── home/       → Home page sections
  ├── property/   → Property cards & filters
  ├── gallery/    → Gallery grid
  └── contact/    → Contact form, FAQ
lib/              → Data, constants, utilities
```

## 📋 Company Info
- **Address:** Mar garden, House # 145, Flat # 704, Road # 3, Block A, Niketon, Gulshan 01, Dhaka 1212
- **Email:** cplcoronapropertiesltd@gmail.com
- **Phone:** +880 18 0575 9297

---
© 2026 Corona Properties Limited. All rights reserved.
