import DOMPurify from "isomorphic-dompurify";

const ALLOWED_IFRAME_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "player.vimeo.com",
  "vimeo.com",
  "www.google.com",
  "maps.google.com",
];

let hookRegistered = false;

function ensureHooks() {
  if (hookRegistered) return;
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName === "iframe") {
      const el = node as HTMLElement;
      const src = el.getAttribute("src") || "";
      try {
        const parsed = new URL(src);
        const isAllowed = ALLOWED_IFRAME_HOSTS.some(
          (host) => parsed.hostname === host || parsed.hostname.endsWith("." + host)
        );
        if (!isAllowed) {
          el.parentNode?.removeChild(el);
        }
      } catch {
        el.parentNode?.removeChild(el);
      }
    }
  });
  hookRegistered = true;
}

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  ensureHooks();

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "span", "div", "br", "hr",
      "strong", "b", "em", "i", "u", "s", "strike", "del",
      "ul", "ol", "li",
      "blockquote", "pre", "code",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tfoot", "tr", "th", "td",
      "iframe",
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel", "src", "alt", "title",
      "width", "height", "style", "class", "loading",
      "colspan", "rowspan", "border", "align",
      "frameborder", "allow", "allowfullscreen",
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  }) as string;
}

export function sanitizeSvg(svgContent: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!svgContent || typeof svgContent !== "string") {
    return { isValid: false, sanitized: "", error: "Empty SVG content" };
  }

  const trimmed = svgContent.trim();
  if (!trimmed.toLowerCase().startsWith("<svg") || !trimmed.toLowerCase().endsWith("</svg>")) {
    return { isValid: false, sanitized: "", error: "Content must start with <svg and end with </svg>" };
  }

  const sanitized = DOMPurify.sanitize(trimmed, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ["svg", "path", "circle", "rect", "polygon", "polyline", "line", "g", "defs", "linearGradient", "radialGradient", "stop"],
    FORBID_TAGS: ["script", "object", "embed", "foreignObject", "applet", "iframe", "style"],
    FORBID_ATTR: ["onload", "onclick", "onerror", "onmouseover", "onfocus", "onblur", "href", "xlink:href"],
  });

  if (!sanitized || sanitized.length < 10) {
    return { isValid: false, sanitized: "", error: "SVG contains forbidden elements or scripts" };
  }

  return { isValid: true, sanitized };
}
