"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Package,
  Layers,
  ArrowRight,
  Info,
  X,
  Loader2,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS } from "@/lib/products";

export interface PageSeoItem {
  id: string;
  path: string;
  pageName: string;
  title: string;
  description: string;
  keywords?: string | null;
  ogImage?: string | null;
  updatedAt?: string | Date;
}

export default function AdminSeoPage() {
  const [seos, setSeos] = useState<PageSeoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit / Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSeo, setEditingSeo] = useState<PageSeoItem | null>(null);
  const [formData, setFormData] = useState({
    path: "",
    pageName: "",
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
  });

  // Product SEO Live Demonstration state
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    PRODUCTS[0]?.id || ""
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadSeos = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/seo");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.seos)) {
          setSeos(data.seos);
        }
      }
    } catch (err) {
      console.error("Failed to load SEO tags:", err);
      showToast("Error loading page metadata");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSeos();
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductsList(data.products);
          setSelectedProductId((prev) => prev || data.products[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenEdit = (item: PageSeoItem) => {
    setEditingSeo(item);
    setFormData({
      path: item.path,
      pageName: item.pageName,
      title: item.title,
      description: item.description,
      keywords: item.keywords || "",
      ogImage: item.ogImage || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingSeo(null);
    setFormData({
      path: "/",
      pageName: "",
      title: "",
      description: "",
      keywords: "",
      ogImage: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.path.trim() || !formData.title.trim() || !formData.description.trim()) {
      alert("Page Path, Meta Title, and Meta Description are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || "Meta tags saved successfully!");
        setIsModalOpen(false);
        await loadSeos();
      } else {
        alert(data.message || "Failed to save meta tags.");
      }
    } catch (err: any) {
      alert(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (idOrPath: string, name: string) => {
    if (!confirm(`Are you sure you want to remove custom SEO configuration for "${name}"?`)) return;

    try {
      const res = await fetch(`/api/seo?path=${encodeURIComponent(idOrPath)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("SEO record deleted");
        await loadSeos();
      }
    } catch {
      showToast("Failed to delete record");
    }
  };

  const filteredSeos = seos.filter(
    (item) =>
      item.pageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProduct =
    productsList.find((p) => p.id === selectedProductId) || productsList[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c222c] via-[#141822] to-[#0c0e14] border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9b7842]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#dec49a] font-semibold uppercase tracking-wider mb-2">
              <Globe className="w-4 h-4" />
              <span>Search Engine Optimization & Social Previews</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Page SEO & Meta Tags Manager
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
              Add and edit the <strong>Meta Title</strong> and <strong>Meta Description</strong> for any page across the website.
              For all product pages, meta tags are <em>automatically derived directly from each product&apos;s title and description</em>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadSeos}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-all border border-stone-700 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#dec49a]" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleOpenNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9b7842] to-[#836433] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#9b7842]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Page Meta</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metric & Advisory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Configured Website Pages</p>
            <p className="text-2xl font-bold text-white mt-1">{seos.length} Pages</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">Stored in Database</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Product Catalog Pages</p>
            <p className="text-2xl font-bold text-[#dec49a] mt-1">{productsList.length} Products</p>
            <p className="text-[10px] text-[#dec49a]/80 mt-0.5 font-semibold">Direct Title & Description Sync</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#9b7842]/15 text-[#dec49a] border border-[#9b7842]/30">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Google SERP Snippet Standards</p>
            <p className="text-xs text-white font-bold mt-1">Title: 50–60 chars</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Description: 150–160 chars</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SPECIAL HIGHLIGHT: Product Pages Dynamic SEO Showcase */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#141822] border border-[#9b7842]/30 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#dec49a] px-2.5 py-1 rounded-md bg-[#9b7842]/15 border border-[#9b7842]/30 inline-block mb-1.5">
              Live Product Page SEO Engine
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[#dec49a]" />
              <span>Products Page SEO: Direct From Product Title & Description</span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Every individual product detail page (<code>/products/[slug]</code>) automatically generates its Meta Title and Meta Description directly from that product.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-medium shrink-0">Sample Product:</span>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="bg-[#1c222c] border border-stone-700 text-xs text-white px-3 py-2 rounded-xl focus:border-[#9b7842] focus:outline-hidden cursor-pointer"
            >
              {productsList.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} ({prod.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedProduct && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Left: Product Data Sources */}
            <div className="lg:col-span-6 space-y-3 bg-[#10141d] p-4 sm:p-5 rounded-2xl border border-stone-800/80">
              <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">
                Source Data Extracted From Product Object:
              </span>
              <div>
                <p className="text-[11px] text-stone-400 font-semibold">Product Title (Name):</p>
                <p className="text-xs text-white font-medium bg-stone-900 px-3 py-2 rounded-lg border border-stone-800 mt-1">
                  {selectedProduct.name}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-stone-400 font-semibold">Product Description:</p>
                <p className="text-xs text-stone-300 bg-stone-900 px-3 py-2 rounded-lg border border-stone-800 mt-1 leading-relaxed">
                  {selectedProduct.description || selectedProduct.tagline}
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#dec49a] pt-1">
                <span>Route: <code>/products/{selectedProduct.slug}</code></span>
                <Link
                  href={`/products/${selectedProduct.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 hover:underline font-semibold"
                >
                  <span>Open Live Product Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Right: Rendered Google Search Snippet */}
            <div className="lg:col-span-6 space-y-3 bg-[#10141d] p-4 sm:p-5 rounded-2xl border border-stone-800/80">
              <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">
                Google Search Result (SERP Snippet):
              </span>
              <div className="p-4 rounded-xl bg-white text-left font-sans shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-[#1c1815] flex items-center justify-center text-[9px] text-white font-bold">
                    P
                  </div>
                  <span className="text-xs text-stone-700">
                    parkashceramics.com › products › {selectedProduct.slug}
                  </span>
                </div>
                <h3 className="text-base text-[#1a0dab] font-medium hover:underline line-clamp-1">
                  {selectedProduct.name} | PARKASH CERAMICS
                </h3>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {selectedProduct.description || selectedProduct.tagline}
                </p>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                When you edit this product in the Admin Products section, the title and description on Google search previews update automatically!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Pages Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages by name, path (/about, /contact), or title..."
              className="w-full bg-[#141822] border border-stone-700 text-xs text-white placeholder-stone-400 pl-10 pr-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
            />
          </div>

          <span className="text-xs text-stone-400">
            Showing {filteredSeos.length} of {seos.length} configured pages
          </span>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#dec49a]" />
            <p className="text-xs text-stone-400">Loading page meta records...</p>
          </div>
        ) : filteredSeos.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#141822] border border-stone-800 text-center space-y-3">
            <Globe className="w-10 h-10 text-stone-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Page Records Found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              {searchQuery ? "No pages match your search query." : "Click \"Add Page Meta\" to configure meta tags for your pages."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSeos.map((item) => {
              const titleLength = item.title.length;
              const descLength = item.description.length;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl bg-[#141822] border border-stone-800 p-5 sm:p-6 space-y-4 hover:border-stone-700 transition-all shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-stone-800 text-[#dec49a]">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">
                            {item.pageName}
                          </h3>
                          <span className="font-mono text-xs text-[#dec49a] px-2 py-0.5 rounded-md bg-[#10141d] border border-stone-800 font-medium">
                            {item.path}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={item.path}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors border border-stone-700"
                        title="View page live"
                      >
                        <span>View Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#9b7842] hover:bg-[#836433] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Meta Tags</span>
                      </button>

                      {/* Allow delete only for custom paths */}
                      {!["/", "/products", "/about", "/contact", "/cart", "/wishlist"].includes(item.path) && (
                        <button
                          type="button"
                          onClick={() => handleDelete(item.path, item.pageName)}
                          className="p-2 rounded-xl text-stone-400 hover:text-red-400 hover:bg-red-950/20 transition-colors border border-stone-800 cursor-pointer"
                          title="Delete custom meta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left: Metadata Details */}
                    <div className="lg:col-span-7 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                          <span className="font-semibold text-stone-300">Meta Title:</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                            titleLength >= 40 && titleLength <= 65
                              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                              : "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                          }`}>
                            {titleLength} characters
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white bg-[#10141d] p-3 rounded-xl border border-stone-800/80">
                          {item.title}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                          <span className="font-semibold text-stone-300">Meta Description:</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                            descLength >= 120 && descLength <= 170
                              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                              : "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                          }`}>
                            {descLength} characters
                          </span>
                        </div>
                        <p className="text-xs text-stone-300 bg-[#10141d] p-3 rounded-xl border border-stone-800/80 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {item.keywords && (
                        <div>
                          <span className="text-[11px] text-stone-400 font-semibold block mb-1">Keywords:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.keywords.split(",").map((kw, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-900 text-[#dec49a] border border-stone-800"
                              >
                                {kw.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Google SERP Preview Card */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
                      <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                        Google Search Preview:
                      </span>
                      <div className="p-4 rounded-2xl bg-white text-left font-sans shadow-sm flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 rounded-full bg-[#1c1815] flex items-center justify-center text-[9px] text-white font-bold">
                            P
                          </div>
                          <span className="text-xs text-stone-700 truncate">
                            parkashceramics.com {item.path === "/" ? "" : `› ${item.path.replace("/", "")}`}
                          </span>
                        </div>
                        <h4 className="text-base text-[#1a0dab] font-medium hover:underline line-clamp-1 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#141822] border border-stone-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-stone-800 text-[#dec49a]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {editingSeo ? `Edit Meta Tags: ${editingSeo.pageName}` : "Add Page Meta Tags"}
                    </h3>
                    <p className="text-xs text-stone-400">
                      Configure meta title and description stored directly in the database.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      Page Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. About Us, Contact"
                      value={formData.pageName}
                      onChange={(e) => setFormData({ ...formData, pageName: e.target.value })}
                      className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-3.5 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      Route Path <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. /about, /contact"
                      value={formData.path}
                      disabled={!!editingSeo}
                      onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                      className={`w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-3.5 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden ${
                        editingSeo ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-300">
                      Meta Title <span className="text-red-400">*</span>
                    </label>
                    <span className={`text-[10px] font-mono ${
                      formData.title.length >= 40 && formData.title.length <= 65
                        ? "text-emerald-400 font-bold"
                        : "text-amber-400"
                    }`}>
                      {formData.title.length}/60 chars recommended
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Luxury Architectural Faucets & Bathware | PARKASH CERAMICS"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-3.5 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-300">
                      Meta Description <span className="text-red-400">*</span>
                    </label>
                    <span className={`text-[10px] font-mono ${
                      formData.description.length >= 120 && formData.description.length <= 170
                        ? "text-emerald-400 font-bold"
                        : "text-amber-400"
                    }`}>
                      {formData.description.length}/160 chars recommended
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide a compelling 150-160 character overview summarizing this page for search engines and social shares..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-3.5 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Keywords (Comma-separated, Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. luxury bathroom, faucets, freestanding tub, Swiss cartridges"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-3.5 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                {/* Live Google Search Preview in Modal */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                    Live Google Search Snippet Preview:
                  </span>
                  <div className="p-4 rounded-xl bg-white text-left font-sans shadow-sm border border-stone-300">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full bg-[#1c1815] flex items-center justify-center text-[9px] text-white font-bold">
                        P
                      </div>
                      <span className="text-xs text-stone-700 truncate">
                        parkashceramics.com {formData.path === "/" ? "" : `› ${formData.path.replace("/", "")}`}
                      </span>
                    </div>
                    <h4 className="text-base text-[#1a0dab] font-medium hover:underline line-clamp-1 leading-snug">
                      {formData.title || "Your Page Title Goes Here | PARKASH CERAMICS"}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {formData.description || "Your compelling meta description will appear here on Google search result pages..."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9b7842] to-[#836433] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Save Meta Tags</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
