"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Brand, Product } from "@/lib/types";
import { INITIAL_BRANDS } from "@/lib/brands";
import { ProductCard } from "@/components/ProductCard";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/MotionWrappers";
import {
  ChevronRight,
  Sparkles,
  Award,
  Globe,
  ExternalLink,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  PackageOpen,
  MapPin
} from "lucide-react";
import { clsx } from "clsx";

interface BrandDetailClientProps {
  brand: Brand;
  initialProducts?: Product[];
}

export default function BrandDetailClient({
  brand,
  initialProducts = [],
}: BrandDetailClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [allBrands, setAllBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high">("featured");

  // Fetch live products for this brand
  useEffect(() => {
    async function loadBrandProducts() {
      try {
        const res = await fetch(`/api/products?brand=${encodeURIComponent(brand.name)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.products)) {
            setProducts(data.products);
          }
        }
      } catch (err) {
        console.warn("Could not load live brand products:", err);
      }
    }
    loadBrandProducts();
  }, [brand.name]);

  // Fetch all brands for footer explorer
  useEffect(() => {
    async function loadAllBrands() {
      try {
        const res = await fetch("/api/brands");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.brands) && data.brands.length > 0) {
            setAllBrands(data.brands);
          }
        }
      } catch (err) {
        console.warn("Could not load brands list:", err);
      }
    }
    loadAllBrands();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tagline && p.tagline.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, searchQuery, sortBy]);

  const brandInitials = brand.name.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#151a22] pb-24">
      {/* Brand Hero Banner */}
      <div className="relative bg-[#12161f] text-white border-b border-[#2a2f3a] overflow-hidden pt-32 pb-20">
        {/* Background ambient accents */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#9b7842_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#9b7842]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#dec49a]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-[#dec49a] mb-6 font-semibold"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            <Link href="/brands" className="hover:text-white transition-colors">Brands</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-white font-semibold">{brand.name}</span>
          </motion.nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start sm:items-center gap-5">
              {/* Brand Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#dec49a]/25 via-[#9b7842]/15 to-stone-800/80 border border-[#9b7842]/40 flex items-center justify-center font-serif font-bold text-2xl sm:text-3xl text-[#dec49a] shadow-2xl shrink-0">
                {brandInitials}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] px-2.5 py-1 rounded-full bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/30 flex items-center gap-1.5">
                    <Award className="w-3 h-3 text-[#dec49a]" />
                    Authorized Brand Partner
                  </span>
                  {brand.name.toLowerCase() === "jaquar" && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Flagship Manufacturer
                    </span>
                  )}
                  {brand.isFeatured && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
                  {brand.name}
                </h1>

                <p className="text-sm text-stone-300 mt-2 max-w-2xl leading-relaxed">
                  {brand.description ||
                    `Premium sanitaryware, bathroom faucets, and luxury fixtures manufactured by ${brand.name}.`}
                </p>
              </div>
            </div>

            {/* Right Action: Official Website */}
            {brand.website && (
              <div className="shrink-0">
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all hover:scale-[1.02] shadow-lg"
                >
                  <Globe className="w-4 h-4 text-[#dec49a]" />
                  <span>Visit {brand.name} Website</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-10">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#ede8df]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#9b7842]">
              {brand.name} Collection
            </span>
            <span className="text-xs text-[#6b7280]">
              • {products.length} {products.length === 1 ? "Product" : "Products"} in Catalogue
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder={`Search in ${brand.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#e5e0d8] rounded-xl pl-9 pr-3 py-2 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            </div>

            {/* Sort Select */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#e5e0d8] rounded-xl px-3 py-2 text-xs text-[#151a22] font-semibold appearance-none pr-8 cursor-pointer focus:outline-none focus:border-[#9b7842]"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="pt-8">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((prod) => (
                <StaggerItem key={prod.id}>
                  <ProductCard product={prod} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        ) : (
          <div className="py-20 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#ede8df]/60 border border-[#ded5cb] flex items-center justify-center mx-auto text-[#9b7842] mb-4">
              <PackageOpen className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#151a22]">
              {searchQuery ? `No matching products found for "${searchQuery}"` : `No online products listed under ${brand.name} yet`}
            </h3>
            <p className="text-xs text-[#6b7280] mt-2 leading-relaxed">
              {searchQuery
                ? "Try clearing your search query or exploring our full catalog."
                : `We carry complete offline catalogs and custom luxury orders for ${brand.name}. Contact our design desk or visit our showroom for price lists and technical specifications.`}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Link
                href="/products"
                className="px-5 py-2.5 rounded-xl bg-[#1c1815] text-white text-xs font-semibold hover:bg-black transition-all"
              >
                Browse All Products
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-white border border-[#ded5cb] text-[#1c1815] text-xs font-semibold hover:bg-[#f7f5f0] transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#9b7842]" />
                Contact Showroom
              </Link>
            </div>
          </div>
        )}

        {/* Other Brands Explorer Section */}
        <div className="mt-24 pt-12 border-t border-[#ede8df]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#9b7842] block">
                Brand Portfolio
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#151a22] mt-0.5">
                Explore Other Luxury Brands
              </h2>
            </div>
            <Link
              href="/brands"
              className="text-xs font-semibold text-[#9b7842] hover:text-[#543e20] flex items-center gap-1 group"
            >
              <span>View All Brands</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {allBrands
              .filter((b) => b.slug !== brand.slug)
              .slice(0, 4)
              .map((b) => (
                <Link
                  key={b.id || b.slug}
                  href={`/brands/${b.slug}`}
                  className="group p-4 rounded-2xl bg-white border border-[#e5e0d8] hover:border-[#9b7842]/40 hover:shadow-lg transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#f7f5f0] border border-[#ded5cb] text-[#836433] flex items-center justify-center font-serif font-bold text-xs shrink-0 group-hover:bg-[#9b7842] group-hover:text-white transition-colors">
                    {b.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#1f2937] group-hover:text-[#9b7842] transition-colors truncate">
                      {b.name}
                    </p>
                    <span className="text-[10px] text-[#6b7280] block truncate">
                      View Collection →
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
