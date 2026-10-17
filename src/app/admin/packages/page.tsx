"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  DollarSign,
  Package as PackageIcon,
  Loader2,
  Box,
  Eye,
  Check
} from "lucide-react";
import { BathroomPackage } from "@/lib/packages";
import { motion, AnimatePresence } from "motion/react";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<BathroomPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchPackages = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/packages");
      if (res.ok) {
        const data = await res.json();
        if (data.packages && Array.isArray(data.packages)) {
          setPackages(data.packages);
        }
      }
    } catch (err) {
      console.error("Failed to fetch packages", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
        showToast("Bathroom package deleted successfully.");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete package");
      }
    } catch (error) {
      console.error("Delete failed", error);
      alert("Error deleting package");
    } finally {
      setDeletingId(null);
    }
  };

  const themes = ["All", ...Array.from(new Set(packages.map((p) => p.finishTheme).filter(Boolean)))];

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      !searchQuery.trim() ||
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.finishTheme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTheme = selectedTheme === "All" || pkg.finishTheme === selectedTheme;
    return matchesSearch && matchesTheme;
  });

  const totalItemsCount = packages.reduce((acc, p) => acc + (p.items?.length || 0), 0);
  const avgSavings = packages.length > 0 
    ? Math.round(packages.reduce((acc, p) => acc + (p.savings || 0), 0) / packages.length)
    : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Toast */}
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Bundle Configurator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#9b7842]" />
            Curated Bathroom Suite Packages
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage multi-piece bathroom packages displayed on the homepage showcase with harmonized finishes and suite pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#packages"
            target="_blank"
            className="inline-flex items-center gap-2 bg-[#191f2c] hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-stone-800 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#dec49a]" />
            <span>View on Homepage</span>
          </Link>
          {packages.length >= 8 ? (
            <button
              disabled
              title="Maximum capacity of 8 suites reached. Edit or delete an existing suite to add another."
              className="inline-flex items-center gap-2 bg-stone-800 text-stone-500 text-xs font-bold px-5 py-2.5 rounded-xl border border-stone-800 cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Max 8 Suites Reached</span>
            </button>
          ) : (
            <Link
              href="/admin/packages/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-[#9b7842]/30 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Suite ({packages.length}/8)</span>
            </Link>
          )}
        </div>
      </div>

      {/* 8 Suites Max Notice */}
      {packages.length >= 8 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Suite Capacity Reached (8/8):</strong> You have configured the maximum allowed 8 bathroom packages. You can edit any existing package or delete one to free up a slot.
          </span>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Total Suites</span>
            <Layers className="w-4 h-4 text-[#dec49a]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {packages.length} <span className="text-sm font-normal text-stone-500">/ 8</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {packages.length >= 8 ? "Max capacity reached" : `${8 - packages.length} slots available`}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Included Fixtures</span>
            <PackageIcon className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-2">{totalItemsCount}</div>
          <div className="text-[11px] text-stone-400 mt-1">Included products</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Avg. Customer Savings</span>
            <Tag className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            ₹{avgSavings.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Per complete package</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Live on Homepage</span>
            <CheckCircle2 className="w-4 h-4 text-[#dec49a]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {packages.filter((p) => p.isActive !== false).length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Active suites tabbed</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by suite name, finish, or product..."
            className="w-full pl-10 pr-4 py-2 bg-[#0c0f17] border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#9b7842] transition-colors"
          />
        </div>

        {/* Theme Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTheme === theme
                  ? "bg-[#9b7842] text-white"
                  : "bg-[#0c0f17] text-stone-400 hover:text-white border border-stone-800"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Packages List */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#9b7842] animate-spin" />
          <p className="text-xs text-stone-400">Loading bathroom suite packages...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#141822] border border-stone-800 p-8">
          <Layers className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-serif font-bold text-white">No bathroom packages found</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedTheme !== "All"
              ? "Try clearing filters to see all suite packages."
              : "Get started by creating your first curated bathroom suite."}
          </p>
          <Link
            href="/admin/packages/new"
            className="mt-4 inline-flex items-center gap-2 bg-[#9b7842] hover:bg-[#aa864e] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Package</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-3xl bg-[#141822] border border-stone-800 overflow-hidden hover:border-stone-700 transition-all shadow-md"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left: Suite Hero Banner Preview */}
                <div className="lg:col-span-4 relative min-h-[260px] lg:min-h-full flex flex-col justify-between p-6 overflow-hidden">
                  <div className="absolute inset-0 z-0">
                    <img
                      src={pkg.coverImage}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                  </div>

                  {/* Badges on preview */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-[#dec49a] border border-white/20 backdrop-blur-md">
                      {pkg.finishTheme}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#9b7842] text-white shadow-sm">
                      Save ₹{pkg.savings?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Title on preview */}
                  <div className="relative z-10 pt-10">
                    <span className="text-[10px] uppercase tracking-widest text-[#dec49a] font-semibold block mb-1">
                      {pkg.badge || "Curated Suite"}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white leading-snug">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-2 font-light">
                      {pkg.description}
                    </p>
                    <div className="mt-3 text-[11px] text-[#dec49a] font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#dec49a]" />
                      <span className="truncate">{pkg.idealFor}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Bundled Items and Price / Actions */}
                <div className="lg:col-span-8 p-6 sm:p-7 flex flex-col justify-between space-y-6">
                  <div>
                    {/* Top Pricing and Status Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#dec49a]">
                          Suite Pricing
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-2xl font-serif font-bold text-white">
                            ₹{pkg.packagePrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-stone-500 line-through">
                            ₹{pkg.originalPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            Save ₹{pkg.savings.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/packages/${pkg.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer border border-stone-700"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#dec49a]" />
                          <span>Edit Suite</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeletingId(pkg.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors cursor-pointer border border-red-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* 4 Products Preview Grid */}
                    <div className="mt-5">
                      <div className="text-xs font-semibold text-stone-300 mb-3 flex items-center justify-between">
                        <span>4 Included Fixtures in this Suite:</span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {pkg.items?.length || 0} Products
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {pkg.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-[#0c0f17] border border-stone-800 flex items-center gap-3"
                          >
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-stone-800 flex items-center justify-center overflow-hidden shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              ) : (
                                <Box className="w-5 h-5 text-stone-600" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] uppercase font-bold text-[#dec49a] block truncate">
                                {item.role}
                              </span>
                              <h5 className="text-xs font-semibold text-white truncate">
                                {item.name}
                              </h5>
                              <div className="flex items-center justify-between text-[10px] text-stone-400 mt-0.5">
                                <span className="font-mono text-stone-400">{item.sku}</span>
                                <span className="text-stone-300 font-semibold">₹{item.price?.toLocaleString("en-IN")}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                    <span className="font-mono text-[11px]">
                      Slug: <span className="text-stone-300">{pkg.slug}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
                      <Check className="w-3.5 h-3.5" />
                      Live in Homepage Tab Selector
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141822] border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-serif font-bold text-white">Delete Bathroom Package?</h4>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  This suite will be permanently removed from the storefront homepage package tab selector.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deletingId)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer shadow-lg shadow-red-600/30"
                >
                  Yes, Delete Suite
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
