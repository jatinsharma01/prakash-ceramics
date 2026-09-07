"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
  Flame,
  RotateCcw,
  Check,
  ArrowLeft
} from "lucide-react";
import { clsx } from "clsx";

interface BestsellersClientProps {
  initialProducts: Product[];
}

function BestsellersContent({ initialProducts }: BestsellersClientProps) {
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
    async function loadLiveBestsellers() {
      try {
        const res = await fetch("/api/products?bestseller=true", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            setProductsList(data.products);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic bestsellers:", err);
      }
    }
    loadLiveBestsellers();
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

  const activeCategoriesWithBestsellers = useMemo(() => {
    const slugs = new Set(productsList.map((p) => p.categorySlug));
    return CATEGORIES.filter((c) => slugs.has(c.slug));
  }, [productsList]);

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#151a22] pb-24">
      
      {/* Page Header */}
      <div className="bg-[#f7f5f0] border-b border-[#ede8df] pt-28 pb-12 sm:pb-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <MotionReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#9b7842] font-bold mb-2">
                <Flame className="w-3.5 h-3.5 text-[#9b7842]" />
                <span>OUR MOST LOVED</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-[#151a22] tracking-tight">
                Best Sellers Collection
              </h1>
              <p className="text-xs sm:text-sm text-[#6b7280] mt-2 max-w-2xl leading-relaxed">
                See the faucets, showers, bathtubs, and sanitaryware products our customers choose most for their homes and luxury architectural projects.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8c7764] hover:text-[#1c1815] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Catalog Products</span>
              </Link>
            </div>
          </MotionReveal>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8">
        
        {/* Category Pills Slider & Active Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ede8df]">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={clsx(
                "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                selectedCategory === "all"
                  ? "bg-[#1c1815] text-white shadow-sm"
                  : "bg-white border border-[#e5e0d8] text-[#4b5563] hover:border-[#9b7842]"
              )}
            >
              All Bestsellers ({productsList.length})
            </button>

            {activeCategoriesWithBestsellers.map((cat) => {
              const count = productsList.filter((p) => p.categorySlug === cat.slug).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={clsx(
                    "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                    selectedCategory === cat.slug
                      ? "bg-[#1c1815] text-white shadow-sm"
                      : "bg-white border border-[#e5e0d8] text-[#4b5563] hover:border-[#9b7842]"
                  )}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e5e0d8] text-xs font-semibold text-[#1c1815]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#9b7842]" />
              <span>Filters</span>
            </button>

            <span className="text-xs font-semibold text-[#6b7280]">
              Showing <span className="text-[#151a22] font-bold">{filteredProducts.length}</span> signature products
            </span>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-6">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bestsellers by name, model code, or style..."
              className="w-full bg-white border border-[#e5e0d8] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-white border border-[#e5e0d8] rounded-xl px-4 py-2.5 text-xs text-[#151a22] font-semibold focus:outline-none focus:border-[#9b7842]"
            >
              <option value="featured">Sort by: Featured & Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {(searchQuery || selectedCategory !== "all" || selectedFinishes.length > 0 || minPrice > 0 || maxPrice < 500000) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-2.5 rounded-xl bg-white border border-[#e5e0d8] text-neutral-500 hover:text-red-600 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center bg-white border border-[#ede8df] rounded-3xl p-8 max-w-xl mx-auto my-8 space-y-4">
            <Sparkles className="w-10 h-10 text-[#dec49a] mx-auto" />
            <h3 className="text-xl font-serif font-semibold text-[#151a22]">
              No Bestsellers Match Your Filter
            </h3>
            <p className="text-xs text-[#6b7280]">
              Try adjusting your search terms, price brackets, or clear filters to see all best-selling models.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1c1815] text-white text-xs font-semibold rounded-xl hover:bg-[#9b7842] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>

      {/* Global Quick View Modal */}
      <QuickViewModal />

    </div>
  );
}

export default function BestsellersClient({ initialProducts }: BestsellersClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#9b7842] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BestsellersContent initialProducts={initialProducts} />
    </Suspense>
  );
}
