"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { MotionReveal } from "@/components/MotionWrappers";
import { CATEGORIES } from "@/lib/categories";
import { FinishType, Product } from "@/lib/types";
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

interface ProductsClientProps {
  initialProducts: Product[];
}

function ProductsContent({ initialProducts }: ProductsClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedFinishes, setSelectedFinishes] = useState<FinishType[]>([]);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [minInput, setMinInput] = useState<string>("0");
  const [maxInput, setMaxInput] = useState<string>("500000");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync if initialProducts changes or fetch fresh on mount
  React.useEffect(() => {
    setProductsList(initialProducts);
  }, [initialProducts]);

  React.useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            setProductsList(data.products);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic products:", err);
      }
    }
    loadLiveProducts();
  }, []);

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

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinInput(val);
    const parsed = parseInt(val.replace(/,/g, ""), 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setMinPrice(parsed);
    }
  };

  const handleMinInputBlur = () => {
    const parsed = parseInt(minInput.replace(/,/g, ""), 10);
    if (isNaN(parsed) || parsed < 0) {
      setMinPrice(0);
      setMinInput("0");
    } else if (parsed > maxPrice) {
      setMinPrice(maxPrice);
      setMinInput(maxPrice.toString());
    } else {
      setMinPrice(parsed);
      setMinInput(parsed.toString());
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMaxInput(val);
    const parsed = parseInt(val.replace(/,/g, ""), 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setMaxPrice(parsed);
    }
  };

  const handleMaxInputBlur = () => {
    const parsed = parseInt(maxInput.replace(/,/g, ""), 10);
    if (isNaN(parsed) || parsed <= 0) {
      setMaxPrice(500000);
      setMaxInput("500000");
    } else if (parsed < minPrice) {
      setMaxPrice(minPrice);
      setMaxInput(minPrice.toString());
    } else {
      setMaxPrice(parsed);
      setMaxInput(parsed.toString());
    }
  };

  const handleSetPreset = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setMinInput(min.toString());
    setMaxInput(max.toString());
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedFinishes([]);
    setMinPrice(0);
    setMaxPrice(500000);
    setMinInput("0");
    setMaxInput("500000");
    setSortBy("featured");
  };

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      // Category filter
      if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesTagline = p.tagline?.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesTagline && !matchesSku) {
          return false;
        }
      }
      // Price filter (Min and Max)
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }
      // Finish filter
      if (selectedFinishes.length > 0) {
        const hasMatchingFinish = selectedFinishes.some((f) => p.finishes?.includes(f));
        if (!hasMatchingFinish) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [productsList, selectedCategory, searchQuery, selectedFinishes, minPrice, maxPrice, sortBy]);

  const getCategoryCount = (slug: string) => {
    return productsList.filter((p) => p.categorySlug === slug).length;
  };

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
              All Categories ({productsList.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = getCategoryCount(cat.slug);
              return (
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
                  {cat.name} {count > 0 && `(${count})`}
                </button>
              );
            })}
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
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer",
                    selectedCategory === "all"
                      ? "bg-[#9b7842] text-white font-semibold shadow-xs"
                      : "text-[#4b5563] hover:bg-[#f7f5f0]"
                  )}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] opacity-80">{productsList.length}</span>
                </button>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  const count = getCategoryCount(cat.slug);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={clsx(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer",
                        isSelected
                          ? "bg-[#9b7842] text-white font-semibold shadow-xs"
                          : "text-[#4b5563] hover:bg-[#f7f5f0]"
                      )}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] opacity-80">{count}</span>
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

            {/* Price Range Filter */}
            <div className="pt-4 border-t border-[#ede8df]">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-semibold text-[#151a22] uppercase tracking-wider">
                  Price Range
                </h4>
                {(minPrice > 0 || maxPrice < 500000) && (
                  <button
                    type="button"
                    onClick={() => handleSetPreset(0, 500000)}
                    className="text-[10px] text-[#9b7842] hover:text-[#7d5f30] font-semibold transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Min & Max User Editable Inputs */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#fbf9f5] border border-[#d8d2c6] focus-within:border-[#9b7842] focus-within:bg-white rounded-xl p-2 transition-all">
                  <label className="text-[10px] uppercase font-bold text-[#84786d] block mb-0.5">
                    Min Price
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-[#9b7842]">₹</span>
                    <input
                      type="number"
                      value={minInput}
                      onChange={handleMinInputChange}
                      onBlur={handleMinInputBlur}
                      placeholder="0"
                      min="0"
                      step="1000"
                      className="w-full bg-transparent text-xs font-bold text-[#151a22] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-[#fbf9f5] border border-[#d8d2c6] focus-within:border-[#9b7842] focus-within:bg-white rounded-xl p-2 transition-all">
                  <label className="text-[10px] uppercase font-bold text-[#84786d] block mb-0.5">
                    Max Price
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-[#9b7842]">₹</span>
                    <input
                      type="number"
                      value={maxInput}
                      onChange={handleMaxInputChange}
                      onBlur={handleMaxInputBlur}
                      placeholder="500000"
                      min="0"
                      step="1000"
                      className="w-full bg-transparent text-xs font-bold text-[#151a22] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Range Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="5000"
                  value={Math.min(maxPrice, 500000)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= minPrice) {
                      setMaxPrice(val);
                      setMaxInput(val.toString());
                    }
                  }}
                  className="w-full accent-[#9b7842] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span>₹0</span>
                  <span className="font-semibold text-[#9b7842]">
                    ₹{minPrice.toLocaleString("en-IN")} – ₹{maxPrice.toLocaleString("en-IN")}
                  </span>
                  <span>₹500k+</span>
                </div>
              </div>

              {/* Quick Range Presets */}
              <div className="mt-3 pt-2.5 border-t border-[#ede8df]/80">
                <span className="text-[10px] uppercase tracking-wider text-[#84786d] font-bold block mb-1.5">
                  Popular Ranges
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { label: "All", min: 0, max: 500000 },
                    { label: "< ₹25k", min: 0, max: 25000 },
                    { label: "₹25k–₹1L", min: 25000, max: 100000 },
                    { label: "₹1L–₹2.5L", min: 100000, max: 250000 },
                    { label: "₹2.5L+", min: 250000, max: 500000 },
                  ].map((preset) => {
                    const isSelected = minPrice === preset.min && maxPrice === preset.max;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleSetPreset(preset.min, preset.max)}
                        className={clsx(
                          "px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all border cursor-pointer",
                          isSelected
                            ? "bg-[#9b7842] text-white border-[#9b7842] shadow-2xs"
                            : "bg-[#fbf9f5] hover:bg-[#ede8df] text-[#4b5563] border-[#e5e0d8]"
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            
            {/* Header info */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs text-[#6b7280]">
                Showing <strong className="text-[#151a22]">{filteredProducts.length}</strong> premium products
              </span>

              {/* Active Filter Pills */}
              {(selectedCategory !== "all" || selectedFinishes.length > 0 || searchQuery || minPrice > 0 || maxPrice < 500000) && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 bg-[#ede8df] text-[#1c1815] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      {CATEGORIES.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                      <button type="button" onClick={() => setSelectedCategory("all")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedFinishes.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1 bg-[#9b7842]/15 text-[#9b7842] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      {f}
                      <button type="button" onClick={() => handleToggleFinish(f)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-[#ede8df] text-[#1c1815] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      &quot;{searchQuery}&quot;
                      <button type="button" onClick={() => setSearchQuery("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(minPrice > 0 || maxPrice < 500000) && (
                    <span className="inline-flex items-center gap-1 bg-[#9b7842]/15 text-[#9b7842] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      ₹{minPrice.toLocaleString("en-IN")} – ₹{maxPrice.toLocaleString("en-IN")}
                      <button type="button" onClick={() => handleSetPreset(0, 500000)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#ede8df] rounded-3xl p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#f7f5f0] flex items-center justify-center mx-auto text-[#9b7842]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-serif font-semibold text-[#151a22]">
                  No matching architectural products found
                </h3>
                <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
                  Try adjusting your search keywords, clearing selected finish filters, or expanding the price range slider.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 bg-[#9b7842] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm hover:bg-[#836433] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </main>

        </div>
      </div>

      <QuickViewModal />

    </div>
  );
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center text-xs text-stone-500">Loading catalog...</div>}>
      <ProductsContent initialProducts={initialProducts} />
    </Suspense>
  );
}
