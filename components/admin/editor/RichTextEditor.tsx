"use client";

import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Youtube from "@tiptap/extension-youtube";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  MapPin,
  Table as TableIcon,
  Minus,
  Undo,
  Redo,
  Sparkles,
  Save,
  Check,
  Clock,
  Type,
  FileText,
  X,
} from "lucide-react";
import { sanitizeHtml } from "@/lib/admin/sanitize";

interface RichTextEditorProps {
  content: string;
  onChange?: (html: string) => void;
  onSaveDraft?: (html: string) => void;
  placeholder?: string;
  draftKey?: string;
  minHeight?: string;
  autoSaveInterval?: number; // ms, default 5000
}

export default function RichTextEditor({
  content,
  onChange,
  onSaveDraft,
  placeholder = "Start typing, or press '/' for commands...",
  draftKey,
  minHeight = "280px",
  autoSaveInterval = 5000,
}: RichTextEditorProps) {
  const [isSaved, setIsSaved] = useState(true);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Dialog states
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTarget, setLinkTarget] = useState("_blank");
  const [linkNofollow, setLinkNofollow] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [embedType, setEmbedType] = useState<"youtube" | "maps">("youtube");
  const [embedUrl, setEmbedUrl] = useState("");

  // Notion-style Slash command menu state
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");

  // Editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-gold underline hover:text-gold-400 transition-colors",
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-4 border border-navy-100 shadow-md",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: "rounded-xl overflow-hidden my-4 max-w-full aspect-video shadow-lg",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setIsSaved(false);
      if (onChange) {
        onChange(html);
      }

      // Check for '/' slash command trigger
      const text = editor.getText();
      const lastChar = text[text.length - 1];
      if (lastChar === "/") {
        setShowSlashMenu(true);
        setSlashQuery("");
      } else if (!text.includes("/")) {
        setShowSlashMenu(false);
      }
    },
  });

  // Auto-save drafts
  useEffect(() => {
    if (!draftKey || !editor) return;

    const interval = setInterval(() => {
      if (!isSaved) {
        const html = editor.getHTML();
        const clean = sanitizeHtml(html);
        if (typeof window !== "undefined") {
          localStorage.setItem(`editor_draft_${draftKey}`, clean);
        }
        setIsSaved(true);
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        if (onSaveDraft) onSaveDraft(clean);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [editor, isSaved, draftKey, autoSaveInterval, onSaveDraft]);

  // Sync content prop changes if external
  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) return null;

  // Reading metrics
  const words = editor.storage.characterCount.words();
  const characters = editor.storage.characterCount.characters();
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  // Toolbar Actions
  const applyLink = () => {
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .setLink({
          href: linkUrl,
          target: linkTarget,
          rel: linkNofollow ? "nofollow noopener noreferrer" : "noopener noreferrer",
        })
        .run();
    }
    setShowLinkModal(false);
    setLinkUrl("");
  };

  const applyImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt || "Listing visual" }).run();
      setShowImageModal(false);
      setImageUrl("");
      setImageAlt("");
    }
  };

  const applyEmbed = () => {
    if (!embedUrl) return;

    if (embedType === "youtube") {
      editor.commands.setYoutubeVideo({ src: embedUrl });
    } else if (embedType === "maps") {
      // Create clean sanitized iframe embed
      const cleanMapIframe = `<div class="aspect-video w-full my-4 rounded-xl overflow-hidden shadow-lg border border-navy-100"><iframe src="${embedUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe></div>`;
      editor.commands.insertContent(cleanMapIframe);
    }

    setShowEmbedModal(false);
    setEmbedUrl("");
  };

  const executeSlashItem = (action: () => void) => {
    action();
    setShowSlashMenu(false);
  };

  const slashCommands = [
    { label: "Heading 1", icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "Heading 2", icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Heading 3", icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "Bullet List", icon: List, action: () => editor.chain().focus().toggleBulletList().run() },
    { label: "Numbered List", icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "Checklist", icon: CheckSquare, action: () => editor.chain().focus().toggleTaskList().run() },
    { label: "Blockquote", icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "Insert Table", icon: TableIcon, action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    { label: "Embed YouTube", icon: Video, action: () => { setEmbedType("youtube"); setShowEmbedModal(true); } },
    { label: "Embed Google Map", icon: MapPin, action: () => { setEmbedType("maps"); setShowEmbedModal(true); } },
    { label: "Divider Line", icon: Minus, action: () => editor.chain().focus().setHorizontalRule().run() },
  ];

  return (
    <div className="relative rounded-xl border border-navy-100/80 bg-white shadow-sm overflow-hidden transition-all focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/30">
      {/* --- TOP TOOLBAR --- */}
      <div className="flex flex-wrap items-center gap-1 border-b border-navy-50 bg-slate-50/80 p-2 text-navy-600">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-navy-100 disabled:opacity-30 transition"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-navy-100 disabled:opacity-30 transition"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>

        <span className="h-4 w-px bg-navy-200 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded transition ${editor.isActive("heading", { level: 1 }) ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded transition ${editor.isActive("heading", { level: 2 }) ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded transition ${editor.isActive("heading", { level: 3 }) ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <span className="h-4 w-px bg-navy-200 mx-1" />

        {/* Text Formats */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition ${editor.isActive("bold") ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition ${editor.isActive("italic") ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded transition ${editor.isActive("underline") ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded transition ${editor.isActive("strike") ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <span className="h-4 w-px bg-navy-200 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition ${editor.isActive("bulletList") ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition ${editor.isActive("orderedList") ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1.5 rounded transition ${editor.isActive("taskList") ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Task List"
        >
          <CheckSquare className="h-4 w-4" />
        </button>

        <span className="h-4 w-px bg-navy-200 mx-1" />

        {/* Alignments */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1.5 rounded transition ${editor.isActive({ textAlign: "left" }) ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1.5 rounded transition ${editor.isActive({ textAlign: "center" }) ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1.5 rounded transition ${editor.isActive({ textAlign: "right" }) ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-1.5 rounded transition ${editor.isActive({ textAlign: "justify" }) ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </button>

        <span className="h-4 w-px bg-navy-200 mx-1" />

        {/* Quotes & Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded transition ${editor.isActive("blockquote") ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded transition ${editor.isActive("codeBlock") ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </button>

        <span className="h-4 w-px bg-navy-200 mx-1" />

        {/* Media & Embeds */}
        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          className={`p-1.5 rounded transition ${editor.isActive("link") ? "bg-navy-900 text-gold" : "hover:bg-navy-100"}`}
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="p-1.5 rounded hover:bg-navy-100 transition"
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => { setEmbedType("youtube"); setShowEmbedModal(true); }}
          className="p-1.5 rounded hover:bg-navy-100 transition"
          title="Embed YouTube Video"
        >
          <Video className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => { setEmbedType("maps"); setShowEmbedModal(true); }}
          className="p-1.5 rounded hover:bg-navy-100 transition"
          title="Embed Google Map"
        >
          <MapPin className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-1.5 rounded hover:bg-navy-100 transition"
          title="Insert Table"
        >
          <TableIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded hover:bg-navy-100 transition"
          title="Horizontal Line"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Notion Slash hint */}
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold-700 font-medium border border-gold/20">
            <Sparkles className="h-3 w-3" /> Type &apos;/&apos; for blocks
          </span>
          <span className="text-xs text-navy-400">
            {isSaved ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <Check className="h-3.5 w-3.5" /> Draft saved {lastSavedTime && `@ ${lastSavedTime}`}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600">
                <Save className="h-3.5 w-3.5 animate-pulse" /> Unsaved changes...
              </span>
            )}
          </span>
        </div>
      </div>

      {/* --- NOTION-STYLE FLOATING SLASH MENU --- */}
      {showSlashMenu && (
        <div className="absolute left-6 top-16 z-30 w-72 rounded-xl bg-white p-2 shadow-2xl border border-navy-100 animate-fade-in">
          <div className="flex items-center justify-between border-b border-navy-50 px-2 py-1.5 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-navy-400">Insert Block</span>
            <button
              type="button"
              onClick={() => setShowSlashMenu(false)}
              className="text-navy-400 hover:text-navy-900"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-0.5 text-sm">
            {slashCommands.map((cmd, i) => (
              <button
                key={i}
                type="button"
                onClick={() => executeSlashItem(cmd.action)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-navy-700 hover:bg-gold/10 hover:text-navy-900 transition"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-navy-50 text-navy-600">
                  <cmd.icon className="h-4 w-4" />
                </span>
                <span className="font-medium text-xs">{cmd.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- MAIN EDITOR CONTENT AREA --- */}
      <div className="p-4" style={{ minHeight }}>
        <EditorContent editor={editor} className="prose prose-navy max-w-none focus:outline-none min-h-[220px]" />
      </div>

      {/* --- BOTTOM METRICS BAR --- */}
      <div className="flex flex-wrap items-center justify-between border-t border-navy-50 bg-slate-50/60 px-4 py-2 text-xs text-navy-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Type className="h-3.5 w-3.5 text-navy-300" />
            <strong className="text-navy-700 font-semibold">{words}</strong> words
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-navy-300" />
            <strong className="text-navy-700 font-semibold">{characters}</strong> chars
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-navy-300" />
            ~{readingTimeMinutes} min read
          </span>
        </div>
        <div className="text-[11px] text-navy-400">
          ProseMirror &bull; Clean Sanitized HTML
        </div>
      </div>

      {/* --- LINK INSERT MODAL --- */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <h3 className="text-lg font-serif font-bold text-navy">Insert Link</h3>
            <p className="text-xs text-navy-400 mt-1">Specify destination URL, target window, and SEO attributes.</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-navy-700 block mb-1">URL</label>
                <input
                  type="url"
                  placeholder="https://coronaproperties.com/projects"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-navy-700">
                  <input
                    type="checkbox"
                    checked={linkTarget === "_blank"}
                    onChange={(e) => setLinkTarget(e.target.checked ? "_blank" : "_self")}
                    className="rounded border-navy-300 text-gold focus:ring-gold"
                  />
                  Open in new tab
                </label>
                <label className="flex items-center gap-2 text-xs text-navy-700">
                  <input
                    type="checkbox"
                    checked={linkNofollow}
                    onChange={(e) => setLinkNofollow(e.target.checked)}
                    className="rounded border-navy-300 text-gold focus:ring-gold"
                  />
                  Add rel=&quot;nofollow&quot;
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg text-navy-600 hover:bg-navy-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyLink}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-navy text-gold hover:bg-navy-800"
              >
                Apply Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- IMAGE INSERT MODAL --- */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <h3 className="text-lg font-serif font-bold text-navy">Insert Image into Editor</h3>
            <p className="text-xs text-navy-400 mt-1">Paste image URL or asset link with mandatory alt-text.</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-navy-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://... or /image-06.webp"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-navy-700 block mb-1">Alt Text (Accessibility & SEO)</label>
                <input
                  type="text"
                  placeholder="e.g. Maple Leaf Garden City central entrance"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg text-navy-600 hover:bg-navy-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyImage}
                disabled={!imageUrl}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-navy text-gold hover:bg-navy-800 disabled:opacity-40"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EMBED MODAL (YouTube / Maps) --- */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <h3 className="text-lg font-serif font-bold text-navy">
              {embedType === "youtube" ? "Embed YouTube Video" : "Embed Google Maps"}
            </h3>
            <p className="text-xs text-navy-400 mt-1">
              {embedType === "youtube"
                ? "Enter YouTube video URL (e.g. https://www.youtube.com/watch?v=...)"
                : "Paste Google Maps embed URL (https://www.google.com/maps/embed?...)"}
            </p>
            <div className="mt-4">
              <input
                type="url"
                placeholder={embedType === "youtube" ? "https://www.youtube.com/watch?v=..." : "https://www.google.com/maps/embed?..."}
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEmbedModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg text-navy-600 hover:bg-navy-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyEmbed}
                disabled={!embedUrl}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-navy text-gold hover:bg-navy-800 disabled:opacity-40"
              >
                Insert Embed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
