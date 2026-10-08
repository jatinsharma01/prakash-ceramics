"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  Globe, 
  Image as ImageIcon, 
  BookOpen, 
  Sliders, 
  CheckCircle2, 
  Tag, 
  User, 
  Calendar,
  Layers,
  Eye,
  Info
} from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { motion, AnimatePresence } from "motion/react";

const BLOG_CATEGORIES = [
  "Material & Craft",
  "Architectural Trends",
  "Engineering & Craft",
  "Luxury Bathrooms",
  "Design Guides",
  "Case Studies",
  "Sanctuary & Wellness"
];

export default function AdminNewBlogPage() {
  const router = useRouter();

  // Basic Details
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState("Material & Craft");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Content
  const [content, setContent] = useState("");

  // Editorial Info
  const [author, setAuthor] = useState("Prakash Editorial Studio");
  const [authorRole, setAuthorRole] = useState("Senior Architectural Consultant");
  const [readTime, setReadTime] = useState("");
  const [tagsInput, setTagsInput] = useState("Luxury Bathroom, PVD Finishes, Interior Design");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // SEO Settings
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState(false);

  // Auto-generate slug and meta title from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setErrorMessage("");

    if (!isSlugManuallyEdited) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }

    if (!metaTitle || metaTitle === `${title} | Prakash Ceramics Journal`) {
      setMetaTitle(`${val} | Prakash Ceramics Journal`);
    }
  };

  // Auto calculate read time when content changes if not manually set
  useEffect(() => {
    if (content) {
      const words = content.split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(2, Math.ceil(words / 200));
      setReadTime(`${minutes} min read`);
    }
  }, [content]);

  // Handle Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setCoverImage(data.url);
      } else {
        alert(data.error || "Failed to upload cover photo.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload cover image");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Please enter an article title.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const finalContent = content.trim() || `<p>${excerpt.trim() || title.trim()}</p>`;
      const finalExcerpt = excerpt.trim() || (content ? content.replace(/<[^>]*>?/gm, "").substring(0, 240).trim() : "") || title.trim();

      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        category,
        excerpt: finalExcerpt,
        coverImage: coverImage.trim() || null,
        content: finalContent,
        author: author.trim() || "Prakash Editorial Studio",
        authorRole: authorRole.trim() || "Senior Architectural Consultant",
        readTime: readTime.trim() || "5 min read",
        tags,
        metaTitle: metaTitle.trim() || `${title.trim()} | Prakash Ceramics Journal`,
        metaDescription: metaDescription.trim() || finalExcerpt,
        keywords: keywords.trim() || tags.join(", "),
        isPublished,
        isFeatured,
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to create article");
      }

      setSuccessToast(true);
      setTimeout(() => {
        router.push("/admin/blogs");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-28">
      {/* Toast Alert */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Article published successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-stone-400 hover:text-white text-xs px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40">
                Editorial Studio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
              Create New Article
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-[#9b7842]/30 transition-all cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSubmitting ? "Publishing..." : isPublished ? "Publish Article" : "Save as Draft"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Article Essentials */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#dec49a]" />
            1. Article Essentials &amp; Cover Image
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. The Architectural Elegance of Matte Black PVD in Contemporary Master Suites"
                className="w-full bg-[#1c222c] border border-stone-700 text-sm text-white placeholder-stone-400 px-4 py-3 rounded-xl focus:border-[#9b7842] focus:outline-hidden font-serif"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                >
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-stone-900">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  URL Slug (Automatic)
                </label>
                <div className="flex items-center gap-1.5 bg-[#1c222c] border border-stone-700 rounded-xl px-3 py-2 text-xs font-mono text-stone-300">
                  <span className="text-stone-500">/blogs/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="article-slug"
                    className="flex-1 bg-transparent text-white focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Short Description / Excerpt (Card Summary)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  if (!metaDescription) setMetaDescription(e.target.value);
                }}
                placeholder="A compelling 2-line summary that appears on blog listing cards and social previews..."
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 p-3.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden leading-relaxed"
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Featured Cover Image (Hero Banner)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-2 flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="Upload image or paste direct image URL (https://...)"
                      className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 pl-3 pr-28 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden truncate"
                    />
                    <label className="absolute right-1 top-1 bottom-1 px-3 bg-[#9b7842]/20 hover:bg-[#9b7842]/30 text-[#dec49a] border border-[#9b7842]/40 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all">
                      <Upload className="w-3 h-3" />
                      <span>{isUploadingCover ? "Uploading..." : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {coverImage ? (
                  <div className="h-20 rounded-xl overflow-hidden border border-stone-700 bg-stone-900 relative group">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="h-20 rounded-xl border border-dashed border-stone-800 flex items-center justify-center text-stone-600 text-xs gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>No cover chosen</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Article Content Rich Text Editor */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#dec49a]" />
              2. Article Content &amp; Inline Images
            </h3>
            <span className="text-xs text-stone-400">
              Format text, add headings, blockquotes, and upload inline photos
            </span>
          </div>

          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Start writing your architectural article. Use Heading 2 (H2) for section headers, bullet lists for features, and the 'Upload Image' button in the toolbar to insert high-resolution photos into your story..."
          />
        </div>

        {/* Step 3: SEO Meta Titles & Description */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#dec49a]" />
              3. Search Engine Optimization (SEO)
            </h3>
            <span className="text-[11px] text-stone-400 font-mono">Google SERP Simulator</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Meta Title *
                </label>
                <span className="text-[10px] text-stone-400">{metaTitle.length} / 60 chars</span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="e.g. Master Ensuite Trends 2026 | Prakash Ceramics Design Journal"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Focus Keywords
                </label>
                <span className="text-[10px] text-stone-400">Comma separated</span>
              </div>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. luxury bathroom, PVD gold faucets, rain shower ceiling"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Meta Description *
                </label>
                <span className="text-[10px] text-stone-400">{metaDescription.length} / 160 chars</span>
              </div>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="A compelling, search-optimized snippet that searchers will read on Google search result pages..."
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 p-3 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Search Result Preview Card */}
          <div className="p-4 rounded-xl bg-[#0e1118] border border-stone-800 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
              Live Google Search Preview
            </span>
            <div className="text-xs text-emerald-400 font-mono truncate">
              https://prakashceramics.com/blogs/{slug || "article-url"}
            </div>
            <div className="text-sm font-semibold text-[#8ab4f8] hover:underline cursor-pointer truncate">
              {metaTitle || title || "Article Title | Prakash Ceramics Journal"}
            </div>
            <p className="text-xs text-stone-400 line-clamp-2">
              {metaDescription || excerpt || "Your article meta description will appear here as a snippet for Google search users."}
            </p>
          </div>
        </div>

        {/* Step 4: Editorial Credits & Visibility */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#dec49a]" />
            4. Author Credentials &amp; Publishing Options
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Author Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Ar. Vikram Singhania"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Author Role / Designation
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g. Senior Architectural Consultant"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Estimated Reading Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 6 min read"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Article Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. PVD Finishes, Luxury Bathroom, Villa Architecture"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Featured toggle */}
            <div
              onClick={() => setIsFeatured(!isFeatured)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                isFeatured
                  ? "bg-[#9b7842]/20 border-[#9b7842]"
                  : "bg-[#1c222c] border-stone-800 hover:border-stone-700"
              }`}
            >
              <div>
                <div className="text-xs font-bold text-white">Featured Article</div>
                <div className="text-[11px] text-stone-400 mt-0.5">Showcase prominently on top banner of blog page</div>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isFeatured ? "bg-[#9b7842]" : "bg-stone-800 border border-stone-700"}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isFeatured ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Published toggle */}
            <div
              onClick={() => setIsPublished(!isPublished)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                isPublished
                  ? "bg-emerald-950/40 border-emerald-700/60"
                  : "bg-[#1c222c] border-stone-800 hover:border-stone-700"
              }`}
            >
              <div>
                <div className="text-xs font-bold text-white">Publish Immediately</div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  {isPublished ? "Article will be visible to public right away" : "Save as draft (hidden from public)"}
                </div>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isPublished ? "bg-emerald-500" : "bg-stone-800 border border-stone-700"}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isPublished ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
          <Link
            href="/admin/blogs"
            className="px-5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white text-xs font-semibold"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] disabled:opacity-50 text-white font-bold text-xs px-8 py-3 rounded-xl shadow-lg shadow-[#9b7842]/30 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? "Publishing to Database..." : isPublished ? "Publish Article" : "Save Draft"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
