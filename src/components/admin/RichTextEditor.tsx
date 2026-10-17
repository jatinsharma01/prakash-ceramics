"use client";

import React, { useState, useRef } from "react";
import { 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Upload, 
  Eye, 
  Code, 
  Minus,
  Sparkles,
  HelpCircle,
  Check
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert markdown/HTML snippets at cursor
  const insertText = (before: string, after: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || defaultText;

    const replacement = `${before}${selected}${after}`;
    const nextValue = text.substring(0, start) + replacement + text.substring(end);

    onChange(nextValue);

    // Set cursor position after update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 10);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgressMsg("Uploading image to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        const altText = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const imageSnippet = `\n<figure class="my-6">\n  <img src="${data.url}" alt="${altText}" class="rounded-2xl border border-stone-800 shadow-xl w-full object-cover" />\n  <figcaption class="text-xs text-stone-400 mt-2 text-center italic font-mono">${altText}</figcaption>\n</figure>\n`;
        insertText(imageSnippet, "");
        setUploadProgressMsg("Image inserted!");
        setTimeout(() => setUploadProgressMsg(""), 2000);
      } else {
        alert(data.error || "Failed to upload image. Please try again.");
      }
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleInsertImageUrl = () => {
    const url = prompt("Enter image direct URL (https://...):");
    if (!url || !url.trim()) return;
    const caption = prompt("Enter optional image caption / description:") || "";
    const imageSnippet = `\n<figure class="my-6">\n  <img src="${url.trim()}" alt="${caption}" class="rounded-2xl border border-stone-800 shadow-xl w-full object-cover" />\n  ${caption ? `<figcaption class="text-xs text-stone-400 mt-2 text-center italic font-mono">${caption}</figcaption>` : ""}\n</figure>\n`;
    insertText(imageSnippet, "");
  };

  const handleInsertLink = () => {
    const url = prompt("Enter destination URL (e.g. /products or https://...):");
    if (!url) return;
    insertText(`<a href="${url}" class="text-[#dec49a] underline hover:text-[#f4e6d0]" target="_blank" rel="noopener noreferrer">`, "</a>", "link text");
  };

  return (
    <div className="rounded-2xl border border-stone-800 bg-[#141822] overflow-hidden shadow-inner flex flex-col">
      {/* Editor Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#191f2c] border-b border-stone-800/80">
        {/* Formatting controls */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertText("<h2>", "</h2>", "Section Heading")}
            title="Heading 2"
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("<h3>", "</h3>", "Sub-heading")}
            title="Heading 3"
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-stone-700/60 mx-1" />

          <button
            type="button"
            onClick={() => insertText("<strong>", "</strong>", "bold text")}
            title="Bold"
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("<em>", "</em>", "italic text")}
            title="Italic"
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("<blockquote class=\"border-l-4 border-[#9b7842] pl-4 italic my-4 text-[#dec49a]\">", "</blockquote>", "Quotation or design statement")}
            title="Quote"
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Quote className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-stone-700/60 mx-1" />

          <button
            type="button"
            onClick={() => insertText("<ul class=\"list-disc pl-6 space-y-1 my-3\">\n  <li>", "</li>\n  <li>Second key point</li>\n</ul>", "First key point")}
            title="Bulleted List"
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("<ol class=\"list-decimal pl-6 space-y-1 my-3\">\n  <li>", "</li>\n  <li>Step two</li>\n</ul>", "Step one")}
            title="Numbered List"
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("\n<hr class=\"my-8 border-stone-800\" />\n")}
            title="Horizontal Divider"
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleInsertLink}
            title="Insert Link"
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-stone-700/60 mx-1" />

          {/* Upload Image Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Upload Image into Article"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9b7842]/20 hover:bg-[#9b7842]/30 text-[#dec49a] border border-[#9b7842]/40 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={handleInsertImageUrl}
            title="Insert Image via Web URL"
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#121620] p-1 rounded-xl border border-stone-800">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "edit"
                ? "bg-[#9b7842] text-white shadow-xs"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "preview"
                ? "bg-[#9b7842] text-white shadow-xs"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {uploadProgressMsg && (
        <div className="px-4 py-1.5 bg-emerald-950/60 border-b border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-2">
          <Check className="w-3.5 h-3.5" />
          <span>{uploadProgressMsg}</span>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === "edit" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Write your article using headings, paragraphs, quotes, and images..."}
          rows={16}
          className="w-full bg-[#121620] text-stone-200 text-sm font-sans p-5 focus:outline-hidden focus:ring-1 focus:ring-[#9b7842] resize-y min-h-[360px] leading-relaxed"
        />
      ) : (
        <div className="p-6 bg-[#121620] min-h-[360px] overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4 text-stone-200 text-sm leading-relaxed prose prose-invert prose-headings:font-serif prose-headings:text-white prose-a:text-[#dec49a] prose-strong:text-white prose-blockquote:border-[#9b7842] prose-blockquote:text-[#dec49a]">
            {value ? (
              <div
                dangerouslySetInnerHTML={{ __html: value }}
                className="space-y-4"
              />
            ) : (
              <p className="text-stone-500 italic text-center py-12">
                No article content yet. Click &quot;Editor&quot; to begin writing your article or insert sample text.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Editor Footer / Quick hints */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#191f2c] border-t border-stone-800 text-[11px] text-stone-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#dec49a]" />
          <span>Supports rich HTML formatting &amp; direct Cloudinary image uploads</span>
        </div>
        <div>
          <span>{value ? value.split(/\s+/).filter(Boolean).length : 0} words</span>
          <span className="mx-2">•</span>
          <span>~{Math.max(1, Math.ceil((value ? value.split(/\s+/).filter(Boolean).length : 0) / 200))} min read</span>
        </div>
      </div>
    </div>
  );
}
