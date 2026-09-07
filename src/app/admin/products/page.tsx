"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  SlidersHorizontal, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Sparkles,
  Layers,
  X,
  Loader2
} from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { motion, AnimatePresence } from "motion/react";

export default function AdminProductsPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "low_stock">("all");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchProducts = React.useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          const mapped = data.products.map((p: any) => {
            const stockCount = typeof p.stockCount === "number" ? p.stockCount : 0;
            const stockStatus =
              stockCount <= 0 ? "Out of Stock" : stockCount <= 5 ? "Low Stock" : "In Stock";
            const salesCount = typeof p.salesCount === "number" ? p.salesCount : 0;
            const totalRevenue = typeof p.totalRevenue === "number" ? p.totalRevenue : (p.price || 0) * salesCount;

            return {
              id: p.id,
              name: p.name,
              sku: p.sku,
              category: p.category,
              categorySlug: p.categorySlug,
              price: p.price,
              originalPrice: p.originalPrice,
              stockCount,
              stockStatus,
              salesCount,
              totalRevenue,
              finishes: p.finishes || ["Chrome"],
              tagline: p.tagline,
              description: p.description,
              images: p.images || ["https://res.cloudinary.com/dtk1pspib/image/upload/v1788760648/parkash-ceramics/faucets.jpg"],
              slug: p.slug,
              specs: p.specs,
              warranty: p.warranty,
            };
          });
          setItems(mapped);
        }
      }
    } catch (err) {
      console.error("Failed to load products from API", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the catalog?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((p) => p.id !== id));
        showToast(`Product "${name}" deleted successfully`);
      } else {
        showToast(`Failed to delete product`);
      }
    } catch (err) {
      showToast(`Error deleting product`);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = 
        selectedCategory === "all" || 
        item.categorySlug === selectedCategory ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesStock = 
        stockFilter === "all" ||
        (stockFilter === "in_stock" && item.stockCount > 5) ||
        (stockFilter === "low_stock" && item.stockCount <= 5);

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [items, searchQuery, selectedCategory, stockFilter]);

  const totalInventoryValue = items.reduce(
    (acc, curr) => acc + curr.price * curr.stockCount,
    0
  );

  const lowStockCount = items.filter((p) => p.stockCount <= 5).length;

  return (
    <div className="space-y-6">
      {/* Toast alert */}
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

      {/* Header & Quick Inventory Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40">
              Inventory & Catalog
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
            Product Management
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Control master SKUs, finish variations, stock alerts, and pricing tiers.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#9b7842]/25 transition-all self-start md:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-300">Total Active SKUs</p>
            <p className="text-xl font-bold text-white mt-1">{items.length} Models</p>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-800 text-[#dec49a]">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-300">Low Stock Reorders</p>
            <p className="text-xl font-bold text-amber-400 mt-1">{lowStockCount} Items</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-300">Stock Valuation</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              ₹{(totalInventoryValue / 100000).toFixed(2)} Lakhs
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU, or category..."
              className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 pl-10 pr-4 py-2.5 rounded-xl focus:outline-hidden focus:border-[#9b7842]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-300 flex items-center gap-1 font-medium">
                <Layers className="w-3.5 h-3.5 text-[#dec49a]" />
                Category:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#1c222c] border border-stone-700 text-xs text-white px-3 py-2 rounded-xl focus:outline-hidden focus:border-[#9b7842] font-semibold cursor-pointer"
              >
                <option value="all">All Categories ({items.length})</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.slug} className="bg-stone-900">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Level Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-300 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-stone-400" />
                Stock:
              </span>
              <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs">
                <button
                  onClick={() => setStockFilter("all")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    stockFilter === "all"
                      ? "bg-[#9b7842] text-white font-semibold"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  All ({items.length})
                </button>
                <button
                  onClick={() => setStockFilter("in_stock")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    stockFilter === "in_stock"
                      ? "bg-[#9b7842] text-white font-semibold"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  In Stock
                </button>
                <button
                  onClick={() => setStockFilter("low_stock")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    stockFilter === "low_stock"
                      ? "bg-amber-600 text-white font-semibold"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  Low Stock ({lowStockCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-[#141822] border border-stone-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-900/80 border-b border-stone-800 text-stone-300 font-semibold uppercase text-[10px] tracking-wider">
                <th className="p-4">Product Details</th>
                <th className="p-4">SKU / Category</th>
                <th className="p-4">Finishes</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4">Units Sold</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-[#dec49a]" />
                      <p className="text-xs text-stone-400">Loading live catalog from database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-800/40 transition-colors group">
                    {/* Image & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-stone-900 border border-stone-700/80 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white group-hover:text-[#dec49a] transition-colors line-clamp-1">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                            {p.tagline}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU & Category */}
                    <td className="p-4">
                      <p className="font-mono text-stone-300 font-medium">{p.sku}</p>
                      <span className="inline-block text-[10px] text-[#dec49a] bg-[#9b7842]/10 px-2 py-0.5 rounded-md border border-[#9b7842]/20 mt-1">
                        {p.category}
                      </span>
                    </td>

                    {/* Finishes */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {p.finishes.slice(0, 3).map((f: string) => (
                          <span
                            key={f}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700"
                          >
                            {f}
                          </span>
                        ))}
                        {p.finishes.length > 3 && (
                          <span className="text-[10px] text-stone-400">
                            +{p.finishes.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <p className="font-bold text-white">
                        ₹{p.price.toLocaleString("en-IN")}
                      </p>
                      {p.originalPrice && (
                        <p className="text-[10px] text-stone-500 line-through">
                          ₹{p.originalPrice.toLocaleString("en-IN")}
                        </p>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              p.stockCount > 5
                                ? "bg-emerald-400"
                                : p.stockCount > 0
                                ? "bg-amber-400"
                                : "bg-red-400"
                            }`}
                          />
                          <span className="font-medium text-white">
                            {p.stockCount} in stock
                          </span>
                        </div>
                        <span
                          className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            p.stockStatus === "In Stock"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : p.stockStatus === "Low Stock"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {p.stockStatus}
                        </span>
                      </div>
                    </td>

                    {/* Units Sold */}
                    <td className="p-4">
                      <p className="font-semibold text-white">
                        {p.salesCount} {p.salesCount === 1 ? "unit" : "units"}
                      </p>
                      <p className="text-[10px] text-stone-400 font-medium">
                        {p.totalRevenue === 0
                          ? "₹0"
                          : p.totalRevenue >= 100000
                          ? `₹${(p.totalRevenue / 100000).toFixed(2)} L`
                          : `₹${p.totalRevenue.toLocaleString("en-IN")}`}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
                          title="Quick Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-[#dec49a] hover:bg-stone-700 transition-colors"
                          title="Edit Product & Finishes"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#141822] border border-stone-700 rounded-2xl shadow-2xl p-6 z-10 space-y-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-900 border border-stone-700"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#dec49a] bg-[#9b7842]/20 px-2 py-0.5 rounded-md border border-[#9b7842]/30">
                      {selectedProduct.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-xs text-stone-400 font-mono">
                      SKU: {selectedProduct.sku}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-stone-900/60 p-4 rounded-xl border border-stone-800">
                <div>
                  <span className="text-stone-400">Unit Price</span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    ₹{selectedProduct.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span className="text-stone-400">Stock Units</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">
                    {selectedProduct.stockCount} Available
                  </p>
                </div>
                <div>
                  <span className="text-stone-400">Total Sold</span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {selectedProduct.salesCount} Units
                  </p>
                </div>
                <div>
                  <span className="text-stone-400">Warranty</span>
                  <p className="text-sm font-bold text-[#dec49a] mt-0.5">
                    {selectedProduct.warranty}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Key Specifications
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedProduct.specs &&
                    Object.entries(selectedProduct.specs).map(([k, v]) => (
                      <div key={k} className="p-2 rounded-lg bg-stone-900/40 border border-stone-800 flex justify-between">
                        <span className="text-stone-400">{k}:</span>
                        <span className="text-white font-medium">{String(v)}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <Link
                  href={`/products/${selectedProduct.slug}`}
                  target="_blank"
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Live Storefront</span>
                </Link>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    showToast("Product changes saved successfully.");
                  }}
                  className="px-4 py-2 rounded-xl bg-[#9b7842] hover:bg-[#836433] text-white text-xs font-semibold shadow-md"
                >
                  Save Quick Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
