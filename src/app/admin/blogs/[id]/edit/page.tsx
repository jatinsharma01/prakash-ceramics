"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  Globe, 
  Image as ImageIcon, 
  BookOpen, 
  CheckCircle2, 
  User, 
  Loader2,
  Trash2,
  ExternalLink
} from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { motion, AnimatePresence } from "motion/react";
import { BlogPost } from "@/lib/types";

const BLOG_CATEGORIES = [
  "Material & Craft",
  "Architectural Trends",
  "Engineering & Craft",
  "Luxury Bathrooms",
  "Design Guides",
  "Case Studies",
  "Sanctuary & Wellness"
];

export default function AdminEditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Material & Craft");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Content
  const [content, setContent] = useState("");

  // Editorial Info
  const [author, setAuthor] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [readTime, setReadTime] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // SEO Settings
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (res.ok && data.blog) {
          const b: BlogPost = data.blog;
          setTitle(b.title || "");
          setSlug(b.slug || "");
          setCategory(b.category || "Material & Craft");
          setExcerpt(b.excerpt || "");
          setCoverImage(b.coverImage || "");
          setContent(b.content || "");
          setAuthor(b.author || "Prakash Editorial Studio");
          setAuthorRole(b.authorRole || "Senior Architectural Consultant");
          setReadTime(b.readTime || "5 min read");
          setTagsInput(Array.isArray(b.tags) ? b.tags.join(", ") : "");
          setIsPublished(Boolean(b.isPublished));
          setIsFeatured(Boolean(b.isFeatured));
          setMetaTitle(b.metaTitle || "");
          setMetaDescription(b.metaDescription || "");
          setKeywords(b.keywords || "");
        } else {
          setLoadError(data.message || "Article not found");
        }
      } catch (err: any) {
        setLoadError(err.message || "Failed to load article");
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [id]);

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

  const handleUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      alert("Please provide an article title");
      return;
    }

    setIsSubmitting(true);

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

      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update article");
      }

      setSuccessToast(true);
      setTimeout(() => {
        router.push("/admin/blogs");
        router.refresh();
      }, 1200);
    } catch (err: any) {
      alert(err.message || "Failed to update article");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#9b7842] animate-spin mx-auto" />
        <p className="text-xs text-stone-400">Loading article editor...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-red-400">{loadError}</p>
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </div>
    );
  }

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
            <span>Article updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

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
                Article Editor
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1 truncate max-w-xl">
              Edit: {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {slug && (
            <Link
              href={`/blogs/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white text-xs font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-[#9b7842]/30 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? "Updating..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Step 1: Article Essentials */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#dec49a]" />
            1. Article Essentials &amp; Cover Photo
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
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1c222c] border border-stone-700 text-sm text-white px-4 py-3 rounded-xl focus:border-[#9b7842] focus:outline-hidden font-serif"
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
                  URL Slug
                </label>
                <div className="flex items-center gap-1.5 bg-[#1c222c] border border-stone-700 rounded-xl px-3 py-2 text-xs font-mono text-stone-300">
                  <span className="text-stone-500">/blogs/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
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
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white p-3.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden leading-relaxed"
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
                      placeholder="Paste image URL or click upload"
                      className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white pl-3 pr-28 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden truncate"
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

        {/* Step 2: Content Editor */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#dec49a]" />
              2. Article Content &amp; Inline Images
            </h3>
            <span className="text-xs text-stone-400">
              Format text, add quotes, and upload inline photos
            </span>
          </div>

          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your article content here..."
          />
        </div>

        {/* Step 3: SEO Meta Settings */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#dec49a]" />
              3. Search Engine Optimization (SEO)
            </h3>
            <span className="text-[11px] text-stone-400 font-mono">Google SERP Preview</span>
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
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
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
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
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
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white p-3 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
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

        {/* Step 4: Editorial Details */}
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
                <div className="text-[11px] text-stone-400 mt-0.5">Showcase on top banner of blog page</div>
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
                <div className="text-xs font-bold text-white">Published Status</div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  {isPublished ? "Article is live on public storefront" : "Draft (hidden from public)"}
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
            <span>{isSubmitting ? "Saving Changes..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
