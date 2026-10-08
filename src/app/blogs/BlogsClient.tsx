"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  User, 
  Sparkles, 
  Share2, 
  Eye, 
  Layers,
  ChevronRight
} from "lucide-react";
import { BlogPost } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";

function formatDate(date: string | Date | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

interface BlogsClientProps {
  initialBlogs: BlogPost[];
}

export default function BlogsClient({ initialBlogs }: BlogsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Material & Craft",
    "Architectural Trends",
    "Engineering & Craft",
    "Luxury Bathrooms",
    "Design Guides",
  ];

  const filteredBlogs = initialBlogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "All" ||
      blog.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = initialBlogs.find((b) => b.isFeatured) || initialBlogs[0];
  const gridPosts = filteredBlogs.filter((b) => !featuredPost || b.id !== featuredPost.id || searchQuery || selectedCategory !== "All");

  return (
    <div className="min-h-screen bg-[#faf8f6] text-[#151a22]">
      {/* Hero Banner (Styled identical to About page header) */}
      <div className="relative min-h-[55vh] flex items-center justify-center overflow-hidden border-b border-[#ede8df]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2400"
            alt="Prakash Ceramics Blogs & Architectural Journal"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-36 pb-20 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-[#f7f1e6] text-xs font-semibold uppercase tracking-widest mb-4 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dec49a]" />
            <span>Prakash Ceramics Blogs</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-6xl font-serif font-semibold text-white tracking-tight leading-tight mb-6 max-w-4xl"
          >
            Design Insights, Material Mastery &amp; Bath Sanctuary Ideas
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-lg text-neutral-200 max-w-2xl font-normal leading-relaxed mb-8"
          >
            In-depth guides crafted for architects, interior connoisseurs, and luxury villa homeowners seeking bespoke brassware, precision hydrotherapy, and timeless wellness.
          </motion.p>

          {/* Search bar inside hero matching the frosted glass look */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="w-4 h-4 text-white/70 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles on PVD finishes, rain showers, freestanding tubs..."
                className="w-full bg-white/15 backdrop-blur-md border border-white/30 text-xs sm:text-sm text-white placeholder-white/70 pl-11 pr-4 py-3.5 rounded-2xl focus:border-[#dec49a] focus:bg-white/25 focus:outline-hidden transition-all shadow-xl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/70 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Category Pills Filter */}
        <div className="flex items-center justify-between gap-4 border-b border-[#ede8df] pb-6 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#151a22] text-white shadow-md shadow-black/10"
                    : "bg-white text-stone-600 hover:text-stone-900 border border-[#e5e0d6] hover:border-[#9b7842]/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-stone-500 font-mono">
            Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? "Article" : "Articles"}
          </span>
        </div>

        {/* Featured Hero Article Banner (Shown when no search/filter active) */}
        {!searchQuery && selectedCategory === "All" && featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-white border border-[#ede8df] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image side */}
              <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[440px] overflow-hidden bg-stone-900">
                <Image
                  src={
                    featuredPost.coverImage ||
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1600"
                  }
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#9b7842] text-white shadow-lg">
                    Featured Story
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-stone-900 backdrop-blur-md shadow-lg">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              {/* Text side */}
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs text-stone-500 font-mono">
                    <span className="flex items-center gap-1.5" suppressHydrationWarning>
                      <Calendar className="w-3.5 h-3.5 text-[#9b7842]" />
                      {formatDate(featuredPost.publishedAt)}
                    </span>
                    {featuredPost.readTime && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#9b7842]" />
                        {featuredPost.readTime}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#151a22] leading-snug group-hover:text-[#9b7842] transition-colors">
                    <Link href={`/blogs/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-stone-600 leading-relaxed font-light line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#ede8df] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f0eae1] border border-[#dec49a] flex items-center justify-center text-xs font-bold text-[#6a5028] overflow-hidden">
                      {featuredPost.authorAvatar ? (
                        <img
                          src={featuredPost.authorAvatar}
                          alt={featuredPost.author}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#151a22]">{featuredPost.author}</div>
                      <div className="text-[10px] text-stone-500">{featuredPost.authorRole || "Architectural Contributor"}</div>
                    </div>
                  </div>

                  <Link
                    href={`/blogs/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9b7842] hover:text-[#543e20] transition-colors group/btn"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Articles Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#151a22] tracking-tight">
              {searchQuery || selectedCategory !== "All" ? "Search Results" : "Latest Editorial Articles"}
            </h3>
            <span className="text-xs text-stone-500 font-mono">Curated Collections</span>
          </div>

          {gridPosts.length === 0 ? (
            <div className="py-24 text-center rounded-3xl bg-white border border-[#ede8df] space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#9b7842]/10 text-[#9b7842] flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-serif font-bold text-stone-800">
                No matching articles found
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try searching for different keywords such as &quot;PVD&quot;, &quot;faucets&quot;, &quot;tubs&quot;, or &quot;wellness&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#151a22] text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.map((blog, idx) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="rounded-2xl bg-white border border-[#ede8df] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Thumbnail */}
                    <Link href={`/blogs/${blog.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-stone-900">
                      <Image
                        src={
                          blog.coverImage ||
                          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200"
                        }
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3.5 left-3.5">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-stone-900 backdrop-blur-md shadow-md">
                          {blog.category}
                        </span>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono">
                        <span className="flex items-center gap-1" suppressHydrationWarning>
                          <Calendar className="w-3.5 h-3.5 text-[#9b7842]" />
                          {formatDate(blog.publishedAt)}
                        </span>
                        {blog.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#9b7842]" />
                            {blog.readTime}
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-serif font-bold text-[#151a22] group-hover:text-[#9b7842] transition-colors leading-snug line-clamp-2">
                        <Link href={`/blogs/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h4>

                      <p className="text-xs text-stone-600 leading-relaxed font-light line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Footer card */}
                  <div className="px-6 pb-6 pt-3 border-t border-[#f2ede4] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#f0eae1] border border-[#dec49a] flex items-center justify-center text-[10px] font-bold text-[#6a5028] overflow-hidden">
                        {blog.authorAvatar ? (
                          <img
                            src={blog.authorAvatar}
                            alt={blog.author}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-stone-700">{blog.author}</span>
                    </div>

                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#9b7842] hover:text-[#6a5028] transition-colors group-hover:translate-x-0.5"
                    >
                      <span>Read</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>

        {/* Architect Consultation Callout Banner */}
        <section className="rounded-3xl bg-gradient-to-br from-[#121620] via-[#1c222c] to-[#121620] text-white p-8 sm:p-14 border border-[#dec49a]/30 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#9b7842]/20 to-transparent blur-2xl pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40">
              Architectural Advisory
            </span>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white">
              Bringing Architectural Articles to Life in Your Residence
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Have questions about plumbing schematics, thermostatic diverters, or coordinating bespoke PVD finishes across your villa? Connect with our senior bath consultants for complimentary layout guidance.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white text-xs font-bold px-6 py-3.5 rounded-full shadow-lg shadow-[#9b7842]/30 transition-all cursor-pointer"
              >
                <span>Book a Showroom Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-6 py-3.5 rounded-full border border-white/20 transition-all"
              >
                <span>Browse Products Catalog</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
