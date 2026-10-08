"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  ExternalLink, 
  Calendar, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Layers,
  TrendingUp,
  FileText,
  Loader2
} from "lucide-react";
import { BlogPost } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        if (data.blogs && Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        }
      }
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        showToast("Article deleted successfully");
      } else {
        alert("Failed to delete article");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete article");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (blog: BlogPost) => {
    try {
      const newStatus = !blog.isPublished;
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newStatus }),
      });

      if (res.ok) {
        setBlogs((prev) =>
          prev.map((b) => (b.id === blog.id ? { ...b, isPublished: newStatus } : b))
        );
        showToast(`Article marked as ${newStatus ? "Published" : "Draft"}`);
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory =
      selectedCategory === "All" || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalViews = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const publishedCount = blogs.filter((b) => b.isPublished).length;
  const draftCount = blogs.length - publishedCount;

  return (
    <div className="space-y-8 max-w-7xl pb-24">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40">
              Content &amp; Editorial Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[#9b7842]" />
            Articles &amp; Architecture Journal
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Publish design guides, material deep-dives, trends, and SEO articles for Prakash Ceramics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blogs"
            target="_blank"
            className="inline-flex items-center gap-2 bg-[#191f2c] hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-stone-800 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#dec49a]" />
            <span>View Public Blog</span>
          </Link>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-[#9b7842]/30 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Total Articles</span>
            <FileText className="w-4 h-4 text-[#dec49a]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{blogs.length}</div>
          <div className="text-[11px] text-stone-400 mt-1">In catalog repository</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Published Live</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{publishedCount}</div>
          <div className="text-[11px] text-stone-400 mt-1">Visible on storefront</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Drafts</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">{draftCount}</div>
          <div className="text-[11px] text-stone-400 mt-1">Work in progress</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Cumulative Reads</span>
            <TrendingUp className="w-4 h-4 text-[#dec49a]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{totalViews.toLocaleString()}</div>
          <div className="text-[11px] text-stone-400 mt-1">Client page views</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, excerpt, author..."
            className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 pl-10 pr-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["All", "Material & Craft", "Architectural Trends", "Engineering & Craft", "Luxury Bathrooms"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#9b7842] text-white shadow-xs"
                  : "bg-[#1c222c] text-stone-400 hover:text-stone-200 border border-stone-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs List */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#9b7842] animate-spin mx-auto" />
          <p className="text-xs text-stone-400">Loading editorial articles...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/30 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-white">No articles found</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== "All"
                ? "Try clearing filters to see all articles."
                : "Create your very first luxury design article with images and SEO settings."}
            </p>
          </div>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 bg-[#9b7842] text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="p-5 rounded-2xl bg-[#141822] border border-stone-800 hover:border-stone-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Cover thumbnail */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shrink-0 relative">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-600 bg-stone-900">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  )}
                  {blog.isFeatured && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#9b7842] text-[9px] font-bold text-white shadow-xs">
                      ★ Featured
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#dec49a] bg-[#9b7842]/20 px-2 py-0.5 rounded-md border border-[#9b7842]/30">
                      {blog.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(blog)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                        blog.isPublished
                          ? "bg-emerald-950/70 text-emerald-300 border border-emerald-800/60"
                          : "bg-stone-800 text-stone-400 border border-stone-700"
                      }`}
                    >
                      {blog.isPublished ? "● Published" : "○ Draft"}
                    </button>
                    {blog.readTime && (
                      <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {blog.readTime}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-serif font-bold text-white truncate group-hover:text-[#dec49a] transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-stone-400 line-clamp-1 max-w-2xl">
                    {blog.excerpt || "No summary provided."}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-stone-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-stone-400" />
                      {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-stone-400" />
                      {blog.views || 0} views
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <Link
                  href={`/blogs/${blog.slug}`}
                  target="_blank"
                  className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition-colors"
                  title="View on Live Storefront"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <Link
                  href={`/admin/blogs/${blog.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#9b7842]/20 hover:bg-[#9b7842]/30 text-[#dec49a] border border-[#9b7842]/40 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Article</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(blog.id, blog.title)}
                  disabled={deletingId === blog.id}
                  className="p-2 rounded-xl bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-900/40 hover:text-red-200 transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete Article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
