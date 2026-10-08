"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Check, 
  Copy, 
  User, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  ChevronRight, 
  MessageCircle,
  BookmarkCheck,
  Building2,
  Compass,
  FileText
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

interface BlogDetailClientProps {
  blog: BlogPost;
  relatedBlogs: BlogPost[];
}

export default function BlogDetailClient({ blog, relatedBlogs }: BlogDetailClientProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== "undefined") {
      const text = encodeURIComponent(`${blog.title} — Read on Prakash Ceramics Journal:\n${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== "undefined") {
      const text = encodeURIComponent(`${blog.title} via @PrakashCeramics`);
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    }
  };

  const heroBackground =
    blog.coverImage ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2400";

  return (
    <div className="min-h-screen bg-[#faf8f6] text-[#151a22]">
      {/* Toast Alert */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 sm:right-8 z-50 bg-[#121620] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-[#9b7842]"
          >
            <Check className="w-4 h-4 text-[#dec49a]" />
            <span>Article link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* HERO SECTION: Cover Image as Background with Title on top   */}
      {/* ============================================================ */}
      <div className="relative w-full min-h-[64vh] sm:min-h-[72vh] lg:min-h-[76vh] flex flex-col justify-between overflow-hidden bg-[#0c0f17]">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBackground}
            alt={blog.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Multi-layered cinematic darkening for high contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-[#0c0f17]/70 to-[#0c0f17]/40" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0f17]/80 via-transparent to-transparent hidden md:block" />
        </div>

        {/* Top Breadcrumb & Back Bar (Inside Hero) */}
        <div className="relative z-10 w-full pt-28 sm:pt-32 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-200 hover:text-[#dec49a] px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all group cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to All Blogs</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-stone-300 font-mono backdrop-blur-md bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-stone-500">/</span>
              <Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link>
              <span className="text-stone-500">/</span>
              <span className="text-[#dec49a] font-medium truncate max-w-[180px] sm:max-w-xs">{blog.category}</span>
            </div>
          </div>
        </div>

        {/* Hero Title & Information Overlaid Above the Background Image */}
        <div className="relative z-10 w-full pb-14 sm:pb-18 pt-6 sm:pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div className="max-w-4xl space-y-6">
              {/* Category Pill & Meta Chips */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#9b7842]/35 text-[#f5ebd7] border border-[#dec49a]/40 backdrop-blur-md shadow-sm">
                  {blog.category}
                </span>
                <span
                  className="text-xs text-stone-300 flex items-center gap-1.5 font-mono bg-black/45 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm"
                  suppressHydrationWarning
                >
                  <Calendar className="w-3.5 h-3.5 text-[#dec49a]" />
                  {formatDate(blog.publishedAt)}
                </span>
                {blog.readTime && (
                  <span className="text-xs text-stone-300 flex items-center gap-1.5 font-mono bg-black/45 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-[#dec49a]" />
                    {blog.readTime}
                  </span>
                )}
                {blog.views ? (
                  <span className="text-xs text-stone-300 flex items-center gap-1.5 font-mono bg-black/45 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                    <Eye className="w-3.5 h-3.5 text-[#dec49a]" />
                    {blog.views} views
                  </span>
                ) : null}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-[1.14] tracking-tight drop-shadow-md">
                {blog.title}
              </h1>

              {/* Excerpt / Subtitle */}
              {blog.excerpt && (
                <p className="text-base sm:text-xl text-stone-200/95 font-light leading-relaxed border-l-2 border-[#dec49a] pl-4 italic max-w-3xl drop-shadow-sm">
                  {blog.excerpt}
                </p>
              )}

              {/* Author & Share Bar within Hero */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/15">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-white/10 border-2 border-[#dec49a] flex items-center justify-center text-sm font-bold text-[#dec49a] overflow-hidden shrink-0 backdrop-blur-md shadow-md">
                    {blog.authorAvatar ? (
                      <img
                        src={blog.authorAvatar}
                        alt={blog.author}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-[#dec49a]" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{blog.author}</div>
                    <div className="text-xs text-stone-300">{blog.authorRole || "Senior Architectural Contributor"}</div>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-300 font-medium mr-1 flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-[#dec49a]" />
                    Share:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    title="Copy Link"
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/25 border border-white/20 text-white backdrop-blur-md transition-all cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    title="Share on WhatsApp"
                    className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/30 text-emerald-300 backdrop-blur-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    title="Share on X / Twitter"
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/25 border border-white/20 text-white backdrop-blur-md transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleShareLinkedIn}
                    title="Share on LinkedIn"
                    className="p-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/35 border border-blue-400/30 text-blue-300 backdrop-blur-md transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* EXPANDED PAGE WIDTH CONTAINER: max-w-7xl Editorial Layout     */}
      {/* ============================================================ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Article Content (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            <article className="rounded-3xl bg-white border border-[#ede8df] p-6 sm:p-12 lg:p-14 shadow-xs">
              <div 
                className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:text-[#151a22] prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:font-bold prose-h3:text-xl prose-h3:mt-8 prose-h3:font-semibold prose-p:text-stone-700 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg prose-blockquote:border-l-4 prose-blockquote:border-[#9b7842] prose-blockquote:bg-[#faf7f2] prose-blockquote:p-5 sm:prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-[#543e20] prose-blockquote:italic prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-li:text-stone-700 prose-li:my-1 prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-[#ede8df] prose-a:text-[#9b7842] prose-a:underline hover:prose-a:text-[#543e20]"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Article Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[#ede8df]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-stone-500 mr-2">Tags:</span>
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[#f4f0e8] text-[#543e20] text-xs font-medium border border-[#e8e0d4]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Architectural Advisory Banner */}
              <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#121620] via-[#1a202c] to-[#121620] text-white space-y-4 border border-[#2d3748]/60 shadow-xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#dec49a]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#dec49a]">
                    Complimentary Specification Service
                  </span>
                </div>
                <h4 className="text-lg sm:text-2xl font-serif font-bold text-white leading-snug">
                  Interested in incorporating these finishes into your residential project?
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                  Our engineering team assists architects, builders, and homeowners with pressure balancing calculations, finish matching, and CAD specifications for luxury bathroom suites.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-[#9b7842] hover:bg-[#b08b50] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#9b7842]/20"
                  >
                    <span>Request Engineering Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/products"
                    className="text-xs text-stone-300 hover:text-white underline transition-colors"
                  >
                    Explore Product Catalog
                  </Link>
                </div>
              </div>
            </article>

            {/* Bottom In-Article Share Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#ede8df] shadow-xs">
              <div className="text-xs font-medium text-stone-600 text-center sm:text-left">
                Found this architectural insight valuable? Share it with your design team:
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#faf8f6] hover:bg-[#f0eae1] text-[#6a5028] border border-[#dec49a] text-xs font-semibold transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Editorial Sidebar (4 Columns) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            
            {/* Author Card */}
            <div className="rounded-3xl bg-white border border-[#ede8df] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#f4f0e8] border-2 border-[#dec49a] flex items-center justify-center text-base font-bold text-[#6a5028] overflow-hidden shrink-0">
                  {blog.authorAvatar ? (
                    <img
                      src={blog.authorAvatar}
                      alt={blog.author}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-[#9b7842]" />
                  )}
                </div>
                <div>
                  <div className="text-base font-serif font-bold text-[#151a22]">{blog.author}</div>
                  <div className="text-xs text-[#9b7842] font-medium">{blog.authorRole || "Senior Design Consultant"}</div>
                  <div className="text-[11px] text-stone-500 font-mono mt-0.5">Prakash Ceramics Editorial</div>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed border-t border-[#ede8df] pt-3">
                Curating cutting-edge architectural trends, sanitaryware technology, and wellness fixture innovations for premier residences across India.
              </p>
            </div>

            {/* Quick Consultation Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#faf8f5] to-[#f4eee6] border border-[#e5decb] p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9b7842]">
                <Building2 className="w-4 h-4 text-[#9b7842]" />
                <span>Trade &amp; Architecture Desk</span>
              </div>
              <h5 className="text-base font-serif font-bold text-[#151a22]">
                Need CAD drawings or physical finish samples?
              </h5>
              <p className="text-xs text-stone-600 leading-relaxed">
                Connect directly with our showroom specification advisors for bathroom layout consultations and bulk quotes.
              </p>
              <Link
                href="/contact"
                className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-[#121620] hover:bg-[#1a202c] text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
              >
                <span>Book Showroom Consultation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Category & Product Discovery */}
            <div className="rounded-3xl bg-white border border-[#ede8df] p-6 shadow-xs space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Explore Collections
              </h5>
              <div className="space-y-2 pt-1 text-xs">
                <Link
                  href="/products?category=Faucets"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf8f6] text-stone-700 hover:text-[#9b7842] transition-colors group"
                >
                  <span className="font-medium">Architectural Faucets &amp; Mixers</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-stone-400" />
                </Link>
                <Link
                  href="/products?category=Showers"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf8f6] text-stone-700 hover:text-[#9b7842] transition-colors group"
                >
                  <span className="font-medium">Hydrotherapy &amp; Rain Showers</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-stone-400" />
                </Link>
                <Link
                  href="/products?category=Bathtubs"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf8f6] text-stone-700 hover:text-[#9b7842] transition-colors group"
                >
                  <span className="font-medium">Freestanding &amp; Whirlpool Tubs</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-stone-400" />
                </Link>
                <Link
                  href="/products?category=Sanitaryware"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#faf8f6] text-stone-700 hover:text-[#9b7842] transition-colors group"
                >
                  <span className="font-medium">Premium Sanitaryware &amp; Basins</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-stone-400" />
                </Link>
              </div>
            </div>

          </aside>
        </div>

        {/* ============================================================ */}
        {/* RELATED ARTICLES: Full Width 3-Column Grid                   */}
        {/* ============================================================ */}
        {relatedBlogs.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#ede8df] space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#9b7842]">Editorial Archive</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#151a22] mt-1">
                  Related Architecture Stories
                </h3>
              </div>
              <Link
                href="/blogs"
                className="text-xs font-bold text-[#9b7842] hover:text-[#543e20] flex items-center gap-1.5 transition-colors group"
              >
                <span>View all articles</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedBlogs.map((item) => (
                <Link
                  key={item.id}
                  href={`/blogs/${item.slug}`}
                  className="rounded-3xl bg-white border border-[#ede8df] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                    <Image
                      src={
                        item.coverImage ||
                        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"
                      }
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-stone-900 backdrop-blur-md shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-stone-500 font-mono flex items-center gap-1.5 mb-2" suppressHydrationWarning>
                        <Calendar className="w-3 h-3 text-[#9b7842]" />
                        {formatDate(item.publishedAt)}
                      </div>
                      <h4 className="text-lg font-serif font-bold text-[#151a22] group-hover:text-[#9b7842] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      {item.excerpt && (
                        <p className="text-xs text-stone-600 line-clamp-2 font-light mt-1.5 leading-relaxed">
                          {item.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#ede8df] flex items-center justify-between text-xs text-[#9b7842] font-semibold">
                      <span>Read article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
