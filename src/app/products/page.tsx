"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { MotionReveal } from "@/components/MotionWrappers";
import { PRODUCTS } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { FinishType } from "@/lib/types";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  Sparkles,
  RotateCcw,
  Check
} from "lucide-react";
import { clsx } from "clsx";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedFinishes, setSelectedFinishes] = useState<FinishType[]>([]);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const ALL_FINISHES: FinishType[] = [
    "Black Chrome",
    "Gold Bright PVD",
    "Black Matt",
    "Blush Gold PVD",
    "Chrome",
    "Matte Black",
    "Brushed Gold",
    "Rose Gold",
    "Graphite Grey",
    "White Ceramic",
    "Natural Cedar"
  ];

  const handleToggleFinish = (finish: FinishType) => {
    setSelectedFinishes((prev) =>
      prev.includes(finish) ? prev.filter((f) => f !== finish) : [...prev, finish]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedFinishes([]);
    setMaxPrice(500000);
    setSortBy("featured");
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesTagline = p.tagline.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesTagline && !matchesSku) {
          return false;
        }
      }
      // Price filter
      if (p.price > maxPrice) {
        return false;
      }
      // Finish filter
      if (selectedFinishes.length > 0) {
        const hasMatchingFinish = selectedFinishes.some((f) => p.finishes.includes(f));
        if (!hasMatchingFinish) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, selectedFinishes, maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#151a22] pb-24">
      
      {/* Page Header */}
      <div className="bg-[#f7f5f0] border-b border-[#ede8df] pt-28 pb-12 sm:pb-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <MotionReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#9b7842] font-semibold block mb-2">
                Parkash Ceramics Master Catalogue
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-[#151a22] tracking-tight">
                Architectural Fittings & Suites
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#6b7280] max-w-md">
              Explore our range of faucets, rain showers, bathtubs, saunas, and sanitaryware. Filter by finish, category, or specifications.
            </p>
          </MotionReveal>

          {/* Quick Category Badges */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={clsx(
                "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shadow-xs cursor-pointer",
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] text-[#1c1815] border-[#ded5cb] shadow-sm font-semibold"
                  : "bg-white text-[#5f4f42] border-[#e6ddd6] hover:bg-[#F2ECE7]"
              )}
            >
              All Categories ({PRODUCTS.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={clsx(
                  "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shadow-xs cursor-pointer",
                  selectedCategory === cat.slug
                    ? "bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] text-[#1c1815] border-[#ded5cb] shadow-sm font-semibold"
                    : "bg-white text-[#5f4f42] border-[#e6ddd6] hover:bg-[#F2ECE7]"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container: Sidebar + Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-10">
        
        {/* Top Control Bar (Search, Mobile Filter Toggle, Sort) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#ede8df]">
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#e5e0d8] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842] shadow-xs"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-neutral-400 hover:text-[#151a22]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e5e0d8] rounded-xl text-xs font-semibold text-[#374151]"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6b7280] hidden sm:inline font-medium">Sort By:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-[#e5e0d8] rounded-xl px-3.5 py-2.5 text-xs text-[#151a22] font-semibold appearance-none pr-8 cursor-pointer focus:outline-none focus:border-[#9b7842] shadow-xs"
                >
                  <option value="featured">Featured / Signatures</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Architect Rating</option>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className={clsx(
            "lg:block space-y-6 bg-white border border-[#ede8df] rounded-3xl p-6 shadow-sm h-fit",
            mobileFilterOpen ? "block" : "hidden"
          )}>
            <div className="flex items-center justify-between pb-4 border-b border-[#ede8df]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#9b7842]" />
                <span className="text-xs uppercase tracking-widest text-[#151a22] font-bold">Filters</span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] text-[#9b7842] hover:text-[#6a5028] flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-semibold text-[#151a22] uppercase tracking-wider mb-3">
                Categories
              </h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={clsx(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left",
                    selectedCategory === "all"
                      ? "bg-[#9b7842] text-white font-semibold shadow-xs"
                      : "text-[#4b5563] hover:bg-[#f7f5f0]"
                  )}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] opacity-80">{PRODUCTS.length}</span>
                </button>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={clsx(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left",
                        isSelected
                          ? "bg-[#9b7842] text-white font-semibold shadow-xs"
                          : "text-[#4b5563] hover:bg-[#f7f5f0]"
                      )}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] opacity-80">{cat.itemCount}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Finishes Filter */}
            <div className="pt-4 border-t border-[#ede8df]">
              <h4 className="text-xs font-semibold text-[#151a22] uppercase tracking-wider mb-3">
                Architectural Finish
              </h4>
              <div className="space-y-2">
                {ALL_FINISHES.map((finish) => {
                  const isChecked = selectedFinishes.includes(finish);
                  return (
                    <button
                      key={finish}
                      type="button"
                      onClick={() => handleToggleFinish(finish)}
                      className="flex items-center justify-between w-full text-xs text-[#4b5563] hover:text-[#151a22] cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className={clsx(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all",
                          isChecked
                            ? "bg-[#9b7842] border-[#9b7842] text-white"
                            : "border-[#d8d2c6] bg-white"
                        )}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <span className={isChecked ? "font-semibold text-[#151a22]" : "font-medium"}>{finish}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="pt-4 border-t border-[#ede8df]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-[#151a22] uppercase tracking-wider">
                  Max Price
                </h4>
                <span className="text-xs font-semibold text-[#9b7842]">₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#9b7842] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#84786d] mt-1 font-medium">
                <span>₹5,000</span>
                <span>₹5,00,000+</span>
              </div>
            </div>

          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-[#e8e2d9] p-12 text-center shadow-sm"
              >
                <Sparkles className="w-10 h-10 text-[#9b7842] mx-auto mb-3" />
                <h3 className="text-lg font-serif font-semibold text-[#151a22] mb-1">No matching fittings found</h3>
                <p className="text-xs text-[#6b7280] max-w-sm mx-auto mb-6">
                  Try adjusting your search keywords, price filter, or selected finishes.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-[#9b7842] text-white font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl hover:bg-[#836433] transition-all shadow-md cursor-pointer"
                >
                  Reset All Filters
                </motion.button>
              </motion.div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4 text-xs text-[#6b7280] font-medium">
                  <span>Showing {filteredProducts.length} premium products</span>
                </div>

                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                >
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            )}
          </div>

        </div>

      </div>

      <QuickViewModal />

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbf9f5] text-center pt-32 text-[#84786d]">Loading Parkash Ceramics Catalogue...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
