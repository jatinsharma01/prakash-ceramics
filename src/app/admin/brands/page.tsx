"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Award,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  Globe,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import { Brand } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    logo: "",
    website: "",
    isFeatured: false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/brands");
      if (res.ok) {
        const data = await res.json();
        if (data.brands && Array.isArray(data.brands)) {
          setBrands(data.brands);
        }
      }
    } catch (err) {
      console.error("Failed to load brands:", err);
      showToast("Error loading brands.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openCreateModal = () => {
    setEditingBrand(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      logo: "",
      website: "",
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || "",
      logo: brand.logo || "",
      website: brand.website || "",
      isFeatured: !!brand.isFeatured,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingBrand ? prev.slug : generatedSlug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Brand name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingBrand) {
        // Edit existing brand
        const res = await fetch(`/api/brands/${editingBrand.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          showToast(`Brand "${formData.name}" updated successfully.`);
          closeModal();
          fetchBrands();
        } else {
          const err = await res.json();
          showToast(err.message || "Failed to update brand.");
        }
      } else {
        // Create new brand
        const res = await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          showToast(`Brand "${formData.name}" created successfully.`);
          closeModal();
          fetchBrands();
        } else {
          const err = await res.json();
          showToast(err.message || "Failed to create brand.");
        }
      }
    } catch (err) {
      console.error("Brand submit error:", err);
      showToast("An error occurred while saving the brand.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (brand.name.toLowerCase() === "jaquar") {
      alert("Jaquar is the system default brand and cannot be removed.");
      return;
    }

    if (!confirm(`Are you sure you want to delete brand "${brand.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/brands/${brand.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`Brand "${brand.name}" deleted.`);
        setBrands((prev) => prev.filter((b) => b.id !== brand.id));
      } else {
        showToast("Failed to delete brand.");
      }
    } catch (err) {
      console.error("Delete brand error:", err);
      showToast("Error deleting brand.");
    }
  };

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands;
    const q = searchQuery.toLowerCase();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.description && b.description.toLowerCase().includes(q))
    );
  }, [brands, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0e121a] text-stone-200 p-6 md:p-8 font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#1c222c] border border-[#9b7842]/50 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/60"
          >
            <CheckCircle2 className="w-5 h-5 text-[#dec49a]" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800/80">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#dec49a]/20 to-[#9b7842]/10 border border-[#9b7842]/30 text-[#dec49a]">
                <Award className="w-6 h-6 text-[#dec49a]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
                  Brand Management
                </h1>
                <p className="text-xs text-stone-400 mt-0.5">
                  Curate luxury bathroom sanitaryware, faucet manufacturers, and kitchen appliance partners.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dec49a] via-[#9b7842] to-[#836433] hover:from-[#e5cfac] hover:to-[#927039] text-[#12161f] font-bold text-xs shadow-lg shadow-[#9b7842]/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Brand</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141923] border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Total Brands
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">{brands.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-stone-800/80 flex items-center justify-center text-[#dec49a]">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#141923] border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Featured Partners
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {brands.filter((b) => b.isFeatured).length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#141923] border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Default Brand
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-[#dec49a]">Jaquar</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Primary
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-stone-800/80 flex items-center justify-center text-stone-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141923] p-4 rounded-2xl border border-stone-800">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name, slug, or keywords..."
              className="w-full bg-[#1b222f] border border-stone-700/80 text-xs text-white placeholder-stone-400 pl-10 pr-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden transition-all"
            />
          </div>

          <div className="text-xs text-stone-400">
            Showing <span className="font-bold text-white">{filteredBrands.length}</span> brands
          </div>
        </div>

        {/* Brand Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#dec49a]" />
            <p className="text-xs">Loading brands directory...</p>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="py-20 text-center bg-[#141923] rounded-2xl border border-stone-800/80 p-8">
            <Award className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Brands Found</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              No brand matched your query &quot;{searchQuery}&quot;. Clear your search or add a new brand.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-white transition-all"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBrands.map((brand) => {
              const isDefault = brand.name.toLowerCase() === "jaquar";
              const initials = brand.name.slice(0, 2).toUpperCase();

              return (
                <div
                  key={brand.id}
                  className="bg-[#141923] hover:bg-[#181e2b] border border-stone-800 hover:border-stone-700/80 rounded-2xl p-5 transition-all flex flex-col justify-between group shadow-lg shadow-black/20"
                >
                  <div>
                    {/* Brand Badge & Top Row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#dec49a]/20 via-[#9b7842]/10 to-stone-800/50 border border-[#9b7842]/30 flex items-center justify-center font-serif font-bold text-sm text-[#dec49a] shadow-inner shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-white group-hover:text-[#dec49a] transition-colors">
                              {brand.name}
                            </h3>
                            {isDefault && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Default
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400 font-mono">
                            /{brand.slug}
                          </span>
                        </div>
                      </div>

                      {brand.isFeatured && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0">
                          <Sparkles className="w-2.5 h-2.5" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed mt-2 min-h-[50px]">
                      {brand.description || "Luxury bathroom fittings & sanitaryware collection."}
                    </p>

                    {/* Website Link */}
                    {brand.website ? (
                      <div className="mt-3 pt-3 border-t border-stone-800/60">
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#dec49a] hover:text-white transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[180px]">
                            {brand.website.replace(/^https?:\/\//, "")}
                          </span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                        </a>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-stone-800/60 text-[11px] text-stone-400 italic">
                        No official website linked
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-5 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                    <Link
                      href={`/admin/products?brand=${encodeURIComponent(brand.name)}`}
                      className="text-[11px] text-stone-400 hover:text-[#dec49a] font-medium transition-colors cursor-pointer"
                      title={`View ${brand.name} products in catalog`}
                    >
                      {brand.itemCount ? `${brand.itemCount} ${brand.itemCount === 1 ? "Product" : "Products"}` : "0 Products"}
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(brand)}
                        className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer"
                        title="Edit Brand"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {!isDefault && (
                        <button
                          onClick={() => handleDelete(brand)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                          title="Delete Brand"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Brand Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#141923] border border-stone-700/80 rounded-2xl shadow-2xl p-6 sm:p-7 z-10 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#dec49a]/10 border border-[#dec49a]/20 text-[#dec49a]">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-serif">
                      {editingBrand ? `Edit Brand: ${editingBrand.name}` : "Add New Brand"}
                    </h2>
                    <p className="text-xs text-stone-400">
                      Configure brand credentials, identification, and official link.
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Jaquar, Essco, Futura, Franke"
                    className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Slug (URL identifier)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. jaquar"
                    className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white font-mono placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Highlight the brand's key specialties, quality standards, or warranty..."
                    className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 p-4 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Official Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://www.jaquar.com"
                    className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 accent-[#9b7842] rounded-sm cursor-pointer"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-medium text-stone-300 cursor-pointer">
                    Highlight as Featured Brand in catalog and home showcase
                  </label>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 rounded-xl border border-stone-700 text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#dec49a] via-[#9b7842] to-[#836433] hover:from-[#e5cfac] hover:to-[#927039] text-[#12161f] font-bold text-xs shadow-lg shadow-[#9b7842]/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingBrand ? "Save Changes" : "Create Brand"}</span>
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
