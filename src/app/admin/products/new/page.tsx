"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  UploadCloud, 
  Plus, 
  X, 
  Check, 
  Sparkles, 
  Package, 
  Eye, 
  ShieldCheck, 
  Tag, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  Sliders,
  Image as ImageIcon
} from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { FinishType } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";

const AVAILABLE_FINISHES: FinishType[] = [
  "Gold Bright PVD",
  "Black Chrome",
  "Black Matt",
  "Blush Gold PVD",
  "Chrome",
  "Matte Black",
  "Brushed Gold",
  "Rose Gold",
  "Graphite Grey",
  "Brushed Nickel",
  "White Ceramic",
  "Natural Cedar",
];

const PRESET_SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800",
];

export default function AdminNewProductPage() {
  const router = useRouter();

  // Form States
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Faucets");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [stockCount, setStockCount] = useState<number | "">(20);
  const [warranty, setWarranty] = useState("10-Year Swiss Cartridge Warranty");
  const [material, setMaterial] = useState("Solid Virgin DR Brass (Lead-Free)");
  const [flowRate, setFlowRate] = useState("6.2 L/min Aerated Stream");
  const [dimensions, setDimensions] = useState("240mm x 180mm x 55mm");
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([
    "Gold Bright PVD",
    "Black Chrome",
  ]);
  const [features, setFeatures] = useState<string[]>([
    "Swiss Kerox® Precision 35mm Ceramic Cartridge",
    "Multi-Layer PVD Finish with Ultra-Corrosion Resistance",
    "Integrated Neoperl® Aerator with Water-Saving Stream",
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [images, setImages] = useState<string[]>([PRESET_SAMPLE_IMAGES[0]]);
  const [customImageUrl, setCustomImageUrl] = useState("");

  // Badges
  const [isFeatured, setIsFeatured] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const toggleFinish = (finish: string) => {
    if (selectedFinishes.includes(finish)) {
      if (selectedFinishes.length > 1) {
        setSelectedFinishes(selectedFinishes.filter((f) => f !== finish));
      }
    } else {
      setSelectedFinishes([...selectedFinishes, finish]);
    }
  };

  const addFeature = () => {
    if (newFeatureInput.trim()) {
      setFeatures([...features, newFeatureInput.trim()]);
      setNewFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addImageFromUrl = () => {
    if (customImageUrl.trim() && !images.includes(customImageUrl.trim())) {
      setImages([...images, customImageUrl.trim()]);
      setCustomImageUrl("");
    }
  };

  const generateAutoSku = (name: string) => {
    const prefix = "PC-" + category.substring(0, 3).toUpperCase();
    const cleanName = name
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 3)
      .toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${cleanName || "ITM"}-${randomNum}`;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setProductName(val);
    if (!sku || sku.startsWith("PC-")) {
      setSku(generateAutoSku(val));
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessToast(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Product published successfully to live catalog!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40">
                Catalog Editor
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
              Add New Luxury Product
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold"
          >
            Cancel
          </Link>
          <button
            onClick={handlePublish}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-[#9b7842]/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? "Publishing SKU..." : "Publish Product"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form (2 Cols) + Live Preview (1 Col) */}
      <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#dec49a]" />
              Basic Product Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={handleNameChange}
                  placeholder="e.g. Celestial Wall-Hung Thermostatic Bath Spout"
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Master SKU Code *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="PC-FAC-CEL-401"
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs font-mono text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name} className="bg-stone-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Architectural Tagline / Short Pitch
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Minimalist Swiss architecture with diamond-cut aerated laminar flow"
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Detailed Description & Craftsmanship
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the brass composition, cartridge technology, ergonomic handle, and luxury finish layers..."
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 p-4 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Stock Inventory */}
          <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#dec49a]" />
              Pricing & Warehouse Stock
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Selling Price (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                  placeholder="24500"
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs font-bold text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  MRP / Original Price (₹)
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : "")}
                  placeholder="32000"
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Stock Units in Warehouse
                </label>
                <input
                  type="number"
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value ? Number(e.target.value) : "")}
                  placeholder="15"
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Available Luxury Finishes */}
          <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#dec49a]" />
              Available Bespoke Finishes ({selectedFinishes.length} selected)
            </h3>
            <p className="text-xs text-stone-400">
              Select which electroplated and PVD finishes will be selectable by clients.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {AVAILABLE_FINISHES.map((finish) => {
                const isSelected = selectedFinishes.includes(finish);
                return (
                  <button
                    type="button"
                    key={finish}
                    onClick={() => toggleFinish(finish)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left ${
                      isSelected
                        ? "bg-[#9b7842]/20 border-[#9b7842] text-white shadow-xs"
                        : "bg-stone-900/50 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-300"
                    }`}
                  >
                    <span>{finish}</span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#9b7842] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Specifications & Technical Details */}
          <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#dec49a]" />
              Engineering Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Body Material
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Manufacturer Warranty
                </label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Flow Rate / Pressure Rating
                </label>
                <input
                  type="text"
                  value={flowRate}
                  onChange={(e) => setFlowRate(e.target.value)}
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Physical Dimensions
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Bullet Features Builder */}
          <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#dec49a]" />
              Architectural Key Highlights
            </h3>

            <div className="space-y-2">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9b7842]" />
                    <span>{feat}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="p-1 text-stone-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="Type a new highlight bullet point and press add..."
                className="flex-1 bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors"
              >
                Add Highlight
              </button>
            </div>
          </div>

          {/* Section 6: Media Gallery */}
          <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#dec49a]" />
              Product Photography & Gallery
            </h3>

            {/* Current Images */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden aspect-square border border-stone-700 bg-stone-900"
                >
                  <img
                    src={imgUrl}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-[#9b7842] text-white px-2 py-0.5 rounded shadow">
                      Main Photo
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (images.length > 1) {
                        setImages(images.filter((_, i) => i !== idx));
                      }
                    }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Image URL */}
            <div className="flex gap-2">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Paste high-res image URL (Unsplash, Cloudinary, AWS S3)..."
                className="flex-1 bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={addImageFromUrl}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold"
              >
                Attach Photo
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Sticky Sidebar (1 Col) */}
        <div className="space-y-6">
          {/* Catalog Badges Widget */}
          <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Catalog Badges & Tags
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-900/60 border border-stone-800 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-white">Featured Collection</p>
                  <p className="text-[11px] text-stone-400">Display on home page hero carousel</p>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#9b7842] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-900/60 border border-stone-800 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-white">New Arrival</p>
                  <p className="text-[11px] text-stone-400">Mark with 'NEW' badge</p>
                </div>
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 accent-[#9b7842] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-900/60 border border-stone-800 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-white">Bestseller</p>
                  <p className="text-[11px] text-stone-400">Highlight as client favorite</p>
                </div>
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="w-4 h-4 accent-[#9b7842] rounded"
                />
              </label>
            </div>
          </div>

          {/* Live Storefront Preview Card */}
          <div className="sticky top-20 p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#dec49a]" />
                Live Card Preview
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Store Mock</span>
            </div>

            {/* Mock Card */}
            <div className="rounded-2xl overflow-hidden bg-white text-stone-900 shadow-md border border-stone-200">
              <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                <img
                  src={images[0] || PRESET_SAMPLE_IMAGES[0]}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                  {isNew && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#9b7842] text-white rounded-md shadow">
                      NEW
                    </span>
                  )}
                  {isBestseller && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-stone-900 text-white rounded-md shadow">
                      BESTSELLER
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#9b7842]">
                  {category}
                </span>
                <h4 className="text-sm font-bold text-stone-900 line-clamp-1">
                  {productName || "Product Name Example"}
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-2">
                  {tagline || "Architectural description tagline preview for luxury customers."}
                </p>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-900">
                      ₹{price ? Number(price).toLocaleString("en-IN") : "0"}
                    </span>
                    {originalPrice && (
                      <span className="text-[10px] text-stone-400 line-through ml-1.5">
                        ₹{Number(originalPrice).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-[#9b7842] bg-[#9b7842]/10 px-2 py-0.5 rounded">
                    {selectedFinishes.length} Finishes
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all"
            >
              {isSubmitting ? "Publishing..." : "Publish to Online Catalog"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
