"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutGrid,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  Sparkles,
  FolderTree,
  Tag,
  ImageIcon
} from "lucide-react";
import { Category } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    image: "",
    tags: "",
    featured: false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
      showToast("Error loading categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760648/parkash-ceramics/faucets.jpg",
      tags: "",
      featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      shortDescription: category.shortDescription || "",
      description: category.description || "",
      image: category.image || "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760648/parkash-ceramics/faucets.jpg",
      tags: Array.isArray(category.tags) ? category.tags.join(", ") : "",
      featured: !!category.featured,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
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
      slug: editingCategory ? prev.slug : generatedSlug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Category name is required.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      shortDescription: formData.shortDescription.trim() || `${formData.name} luxury collection.`,
      description: formData.description.trim() || formData.shortDescription.trim() || `${formData.name} fittings.`,
      image: formData.image.trim(),
      featured: formData.featured,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        // Edit existing category
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast(`Category "${payload.name}" updated successfully.`);
          closeModal();
          fetchCategories();
        } else {
          const err = await res.json();
          showToast(err.message || "Failed to update category.");
        }
      } else {
        // Create new category
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast(`Category "${payload.name}" created successfully.`);
          closeModal();
          fetchCategories();
        } else {
          const err = await res.json();
          showToast(err.message || "Failed to create category.");
        }
      }
    } catch (err) {
      console.error("Category submit error:", err);
      showToast("An error occurred while saving the category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete category "${category.name}"? Products in this category might be affected.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`Category "${category.name}" deleted.`);
        setCategories((prev) => prev.filter((c) => c.id !== category.id));
      } else {
        showToast("Failed to delete category.");
      }
    } catch (err) {
      console.error("Delete category error:", err);
      showToast("Error deleting category.");
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.shortDescription && c.shortDescription.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

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
                <LayoutGrid className="w-6 h-6 text-[#dec49a]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
                  Category Directory
                </h1>
                <p className="text-xs text-stone-400 mt-0.5">
                  Organize and expand your product departments across bathroom fittings, wellness & sanitaryware.
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
              <span>Add New Category</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141923] border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Total Departments
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">{categories.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-stone-800/80 flex items-center justify-center text-[#dec49a]">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#141923] border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Featured on Storefront
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {categories.filter((c) => c.featured).length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#141923] border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Catalog Integration
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-[#dec49a]">Live</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Synced
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-stone-800/80 flex items-center justify-center text-stone-400">
              <CheckCircle2 className="w-5 h-5" />
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
              placeholder="Search by category name, slug, or keywords..."
              className="w-full bg-[#1b222f] border border-stone-700/80 text-xs text-white placeholder-stone-400 pl-10 pr-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden transition-all"
            />
          </div>

          <div className="text-xs text-stone-400">
            Showing <span className="font-bold text-white">{filteredCategories.length}</span> categories
          </div>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#dec49a]" />
            <p className="text-xs">Loading categories directory...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-20 text-center bg-[#141923] rounded-2xl border border-stone-800/80 p-8">
            <LayoutGrid className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Categories Found</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              No department matched your query &quot;{searchQuery}&quot;. Clear your search or add a new category.
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
            {filteredCategories.map((cat) => {
              return (
                <div
                  key={cat.id || cat.slug}
                  className="bg-[#141923] hover:bg-[#181e2b] border border-stone-800 hover:border-stone-700/80 rounded-2xl overflow-hidden transition-all flex flex-col justify-between group shadow-lg shadow-black/20"
                >
                  <div>
                    {/* Category Image Header */}
                    <div className="relative h-40 w-full overflow-hidden bg-stone-900">
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141923] via-transparent to-black/30" />

                      {/* Featured Badge */}
                      {cat.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/80 text-black font-bold shadow-md flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Featured
                          </span>
                        </div>
                      )}

                      {/* Items Count Pill */}
                      <div className="absolute bottom-3 left-3">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-stone-200 border border-white/10">
                          {cat.itemCount ? `${cat.itemCount} Items` : "Active"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      {/* Name & Slug */}
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-sm text-white group-hover:text-[#dec49a] transition-colors">
                            {cat.name}
                          </h3>
                          <Link
                            href={`/categories/${cat.slug}`}
                            target="_blank"
                            className="text-stone-400 hover:text-white transition-colors"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">
                          /{cat.slug}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {cat.shortDescription || cat.description || "Luxury department collection."}
                      </p>

                      {/* Tags */}
                      {Array.isArray(cat.tags) && cat.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cat.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-2 py-0.5 rounded-md bg-stone-800/80 text-stone-300 border border-stone-700/50"
                            >
                              {tag}
                            </span>
                          ))}
                          {cat.tags.length > 3 && (
                            <span className="text-[9px] px-1.5 py-0.5 text-stone-400">
                              +{cat.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="p-4 pt-2 border-t border-stone-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 font-medium">
                      Storefront Category
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
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
              className="relative w-full max-w-lg bg-[#141923] border border-stone-700/80 rounded-2xl shadow-2xl p-6 sm:p-7 z-10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#dec49a]/10 border border-[#dec49a]/20 text-[#dec49a]">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-serif">
                      {editingCategory ? `Edit Category: ${editingCategory.name}` : "Add New Category"}
                    </h2>
                    <p className="text-xs text-stone-400">
                      Specify category department name, showcase image, and description.
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
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Faucets, Kitchen Sinks, Bathtubs"
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
                    placeholder="e.g. kitchen-sinks"
                    className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white font-mono placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="e.g. Beautiful mixers for basins, showers and bathtubs."
                    className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Detailed Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Extended overview of this product department..."
                    className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 p-4 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                    className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Subcategory Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g. Basin Mixers, Wall Mount, Bath Mixers"
                    className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="catFeatured"
                    checked={formData.featured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 accent-[#9b7842] rounded-sm cursor-pointer"
                  />
                  <label htmlFor="catFeatured" className="text-xs font-medium text-stone-300 cursor-pointer">
                    Showcase as Featured Category on Home Page scroll strip
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
                    <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
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
