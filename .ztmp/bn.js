const fs = require('fs');
// Build Navbar via template with backtick-safe content
const raw = String.raw;
const t = (s) => s;

const header = t('"use client";\n\nimport { useEffect, useState } from "react";\nimport Link from "next/link";\nimport { usePathname } from "next/navigation";\nimport Image from "next/image";\nimport { motion, AnimatePresence } from "framer-motion";\nimport { Menu, X, ChevronRight, Phone, Diamond } from "lucide-react";\nimport { NAV_LINKS, SITE_CONFIG, CONTACT_INFO } from "@/lib/constants";\nimport { cn } from "@/lib/utils";\n\nexport default function Navbar() {\n  const [scrolled, setScrolled] = useState(false);\n  const [mobileOpen, setMobileOpen] = useState(false);\n  const pathname = usePathname();\n\n  useEffect(() => {\n    const onScroll = () => setScrolled(window.scrollY > 50);\n    window.addEventListener("scroll", onScroll, { passive: true });\n    onScroll();\n    return () => window.removeEventListener("scroll", onScroll);\n  }, []);\n\n  useEffect(() => { setMobileOpen(false); }, [pathname]);\n\n  useEffect(() => {\n    document.body.style.overflow = mobileOpen ? "hidden" : "";\n    return () => { document.body.style.overflow = ""; };\n  }, [mobileOpen]);\n\n  const isActive = (href) => href === "/" ? pathname === "/" : pathname.startsWith(href);\n');
fs.writeFileSync('.ztmp/h.txt', header);
console.log('header ok');
