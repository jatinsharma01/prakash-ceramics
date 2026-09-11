"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Check, 
  Sparkles, 
  Package, 
  ShieldCheck, 
  Tag, 
  Sliders,
  Image as ImageIcon,
  CheckCircle2,
  Flame,
  Award,
  Star,
  Plus,
  Palette
} from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { FinishType } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";

const AVAILABLE_FINISHES: FinishType[] = [
  "Gold Bright PVD",
  "Chrome",
  "Black Chrome",
  "Black Matt",
  "Blush Gold PVD",
  "Matte Black",
  "Brushed Gold",
  "Rose Gold",
  "Graphite Grey",
  "Brushed Nickel",
  "White Ceramic",
  "Natural Cedar",
];

export default function AdminNewProductPage() {
  const router = useRouter();

  // Form States
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Faucets");
  const [range, setRange] = useState("Fusion Prime");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [warranty, setWarranty] = useState("10 Years Comprehensive Warranty");
  const [material, setMaterial] = useState("Solid Virgin DR Brass (Lead-Free)");
  const [flowRate, setFlowRate] = useState("4.8 LPM at 3 Bar (Eco-Save)");
  const [dimensions, setDimensions] = useState("Standard Deck Mount");

  // Selected Finishes & Color Variants (Empty by default)
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([
    "Gold Bright PVD",
    "Chrome",
    "Black Chrome",
  ]);
  const [finishPrices, setFinishPrices] = useState<Record<string, number | "">>({});
  const [finishOfferPrices, setFinishOfferPrices] = useState<Record<string, number | "">>({});
  const [finishSkus, setFinishSkus] = useState<Record<string, string>>({});
  const [finishStocks, setFinishStocks] = useState<Record<string, number | "">>({});
  const [finishImages, setFinishImages] = useState<Record<string, string>>({});

  // Custom color input
  const [customColorInput, setCustomColorInput] = useState("");

  // Highlights
  const [features, setFeatures] = useState<string[]>([
    "Swiss Kerox® Precision 35mm Ceramic Cartridge rated for 500,000+ operations",
    "Multi-Layer Architectural Finish with Ultra-Corrosion Protection",
    "Integrated Neoperl® Aerator with Water-Saving Stream",
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState("");

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
      // Auto-generate code template for newly selected color
      if (!finishSkus[finish]) {
        const short = finish.substring(0, 3).toUpperCase();
        setFinishSkus((prev) => ({ ...prev, [finish]: `FUP-${short}-${Math.floor(10000 + Math.random() * 90000)}` }));
      }
    }
  };

  const handleFinishPriceChange = (finish: string, val: string) => {
    setFinishPrices((prev) => ({ ...prev, [finish]: val === "" ? "" : Number(val) }));
  };

  const handleFinishOfferPriceChange = (finish: string, val: string) => {
    setFinishOfferPrices((prev) => ({ ...prev, [finish]: val === "" ? "" : Number(val) }));
  };

  const handleFinishSkuChange = (finish: string, val: string) => {
    setFinishSkus((prev) => ({ ...prev, [finish]: val }));
  };

  const handleFinishStockChange = (finish: string, val: string) => {
    setFinishStocks((prev) => ({ ...prev, [finish]: val === "" ? "" : Number(val) }));
  };

  const handleFinishImageChange = (finish: string, val: string) => {
    setFinishImages((prev) => ({ ...prev, [finish]: val }));
  };

  const addCustomColor = () => {
    const color = customColorInput.trim();
    if (color && !selectedFinishes.includes(color)) {
      setSelectedFinishes([...selectedFinishes, color]);
      // Auto-generate SKU for custom color
      const short = color.substring(0, 3).toUpperCase();
      setFinishSkus((prev) => ({ ...prev, [color]: `FUP-${short}-${Math.floor(10000 + Math.random() * 90000)}` }));
      setCustomColorInput("");
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

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const cleanedFinishPrices: Record<string, number> = {};
      const cleanedFinishOfferPrices: Record<string, number> = {};
      const cleanedFinishSkus: Record<string, string> = {};
      const cleanedFinishStocks: Record<string, number> = {};
      const cleanedFinishImages: Record<string, string> = {};

      selectedFinishes.forEach((f) => {
        cleanedFinishPrices[f] = typeof finishPrices[f] === "number" ? (finishPrices[f] as number) : 0;
        cleanedFinishOfferPrices[f] = typeof finishOfferPrices[f] === "number" ? (finishOfferPrices[f] as number) : 0;
        cleanedFinishSkus[f] = finishSkus[f] || `${sku || "PC-ITM"}-${f.slice(0, 3).toUpperCase()}`;
        cleanedFinishStocks[f] = typeof finishStocks[f] === "number" ? (finishStocks[f] as number) : 15;
        if (finishImages[f]) cleanedFinishImages[f] = finishImages[f];
      });

      // Use offer prices for the base price (minimum offer price), fallback to MRP
      const offerValues = Object.values(cleanedFinishOfferPrices).filter((v) => v > 0);
      const mrpValues = Object.values(cleanedFinishPrices).filter((v) => v > 0);
      const computedBasePrice = offerValues.length > 0 ? Math.min(...offerValues) : (mrpValues.length > 0 ? Math.min(...mrpValues) : 9400);
      const computedOriginalPrice = mrpValues.length > 0 ? Math.min(...mrpValues) : undefined;
      const totalStock = Object.values(cleanedFinishStocks).reduce((a, b) => a + b, 0);

      const payload = {
        name: productName,
        sku: sku || generateAutoSku(productName),
        category,
        range,
        tagline: tagline || productName,
        description: description || tagline || productName,
        price: computedBasePrice,
        originalPrice: computedOriginalPrice,
        stockCount: totalStock || 20,
        isFeatured,
        isNew,
        isBestseller,
        finishes: selectedFinishes.length > 0 ? selectedFinishes : ["Chrome"],
        finishImages: cleanedFinishImages,
        finishPrices: cleanedFinishPrices,
        finishOfferPrices: cleanedFinishOfferPrices,
        finishSkus: cleanedFinishSkus,
        finishStocks: cleanedFinishStocks,
        images: Object.values(cleanedFinishImages),
        material,
        warranty,
        dimensions: dimensions || "Standard Luxury Fit",
        flowRate: flowRate || "4.8 LPM Eco-Aerated",
        features: features.length > 0 ? features : ["Crafted with high-precision engineering"],
        specs: {
          Range: range,
          Material: material,
          Warranty: warranty,
          Dimensions: dimensions,
          "Flow Rate": flowRate,
          finishPrices: cleanedFinishPrices,
          finishOfferPrices: cleanedFinishOfferPrices,
          finishSkus: cleanedFinishSkus,
          finishStocks: cleanedFinishStocks,
        },
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to publish product");
      }

      setSuccessToast(true);
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1200);
    } catch (err: any) {
      alert(err.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-24">
      {/* Toast Alert */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Product & color variants published successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40">
                Catalog Builder
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
              Add New Product
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePublish}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-[#9b7842]/30 transition-all cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSubmitting ? "Publishing to Database..." : "Publish Product"}</span>
        </button>
      </div>

      <form onSubmit={handlePublish} className="space-y-6">
        {/* Step 1: Basic Information */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-[#dec49a]" />
            1. Product Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={handleNameChange}
                placeholder="e.g. Single Lever Basin Mixer"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
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

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Design Range / Collection
              </label>
              <input
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="e.g. Fusion Prime"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Master Item Code / SKU *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. FUP-GBP-29011BPM"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs font-mono text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Tagline & Short Description
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Single Lever Basin Mixer without Popup Waste System with 450mm Long Braided Hoses"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Full Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe architectural features, durability, cartridge technology..."
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 p-4 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Available Finishes & Color Variants (With Direct Image Upload) */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#dec49a]" />
                2. Product Colors, Prices, Stock & Images
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Select colors for this product. Upload photos and set prices and item codes for each color card below.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40 rounded-full font-bold">
              {selectedFinishes.length} Colors Selected
            </span>
          </div>

          {/* Finish selector pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
            {AVAILABLE_FINISHES.map((finish) => {
              const isSelected = selectedFinishes.includes(finish);
              return (
                <button
                  type="button"
                  key={finish}
                  onClick={() => toggleFinish(finish)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
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

            {/* Custom Color Input */}
            <div className="col-span-2 sm:col-span-3 md:col-span-4 flex items-center gap-2 pt-1">
              <div className="flex items-center gap-2 flex-1">
                <div className="p-2.5 rounded-xl bg-stone-900/50 border border-stone-800 text-stone-400">
                  <Palette className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={customColorInput}
                  onChange={(e) => setCustomColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomColor();
                    }
                  }}
                  placeholder="Type a custom color name (e.g. Antique Copper, Ocean Blue)..."
                  className="flex-1 bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={addCustomColor}
                disabled={!customColorInput.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#9b7842]/20 hover:bg-[#9b7842]/30 text-[#dec49a] border border-[#9b7842]/40 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Custom Color
              </button>
            </div>
          </div>

          {/* Color Variant Matrix Cards */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Finish Color Cards ({selectedFinishes.length} Active Colors)
            </h4>

            <div className="space-y-4">
              {selectedFinishes.map((finish) => (
                <div
                  key={finish}
                  className="p-5 rounded-2xl bg-stone-900/90 border border-stone-700/80 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#9b7842]" />
                      <span className="font-bold text-white text-sm">{finish}</span>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">
                      Code: {finishSkus[finish] || "Not Set"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Item Code / SKU */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        Item Code / SKU *
                      </label>
                      <input
                        type="text"
                        value={finishSkus[finish] || ""}
                        onChange={(e) => handleFinishSkuChange(finish, e.target.value)}
                        placeholder="e.g. FUP-GBP-29011BPM"
                        className="w-full bg-[#141822] border border-stone-700 text-xs text-white px-3 py-2 rounded-xl font-mono focus:border-[#9b7842] focus:outline-hidden"
                      />
                    </div>

                    {/* MRP Price */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        MRP Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={finishPrices[finish] ?? ""}
                        onChange={(e) => handleFinishPriceChange(finish, e.target.value)}
                        placeholder="e.g. 11200"
                        className="w-full bg-[#141822] border border-stone-700 text-xs text-stone-300 font-bold px-3 py-2 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                      />
                    </div>

                    {/* Offer Price */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        Offer Price (₹)
                      </label>
                      <input
                        type="number"
                        value={finishOfferPrices[finish] ?? ""}
                        onChange={(e) => handleFinishOfferPriceChange(finish, e.target.value)}
                        placeholder="e.g. 9400"
                        className="w-full bg-[#141822] border border-stone-700 text-xs text-emerald-400 font-bold px-3 py-2 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                      />
                      {finishPrices[finish] && finishOfferPrices[finish] && Number(finishOfferPrices[finish]) < Number(finishPrices[finish]) && (
                        <span className="text-[10px] text-emerald-400 mt-0.5 block">
                          {Math.round(((Number(finishPrices[finish]) - Number(finishOfferPrices[finish])) / Number(finishPrices[finish])) * 100)}% off
                        </span>
                      )}
                    </div>

                    {/* Stock Count */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        Stock Count (Units)
                      </label>
                      <input
                        type="number"
                        value={finishStocks[finish] ?? 15}
                        onChange={(e) => handleFinishStockChange(finish, e.target.value)}
                        placeholder="e.g. 20"
                        className="w-full bg-[#141822] border border-stone-700 text-xs text-white px-3 py-2 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                      />
                    </div>

                    {/* Image Preview & Upload Button */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        Finish Photo
                      </label>
                      <div className="flex items-center gap-2">
                        {finishImages[finish] ? (
                          <div className="w-9 h-9 rounded-lg overflow-hidden border border-stone-700 shrink-0 bg-stone-950">
                            <img
                              src={finishImages[finish]}
                              alt={finish}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg border border-dashed border-stone-700 flex items-center justify-center text-stone-600 shrink-0 bg-stone-950/40">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}

                        <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#9b7842]/20 hover:bg-[#9b7842]/30 text-[#dec49a] border border-[#9b7842]/40 text-xs font-semibold transition-all truncate">
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {finishImages[finish] ? "Change Photo" : "Upload Image"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append("file", file);
                              try {
                                const res = await fetch("/api/upload", {
                                  method: "POST",
                                  body: formData,
                                });
                                const data = await res.json();
                                if (res.ok && data.url) {
                                  handleFinishImageChange(finish, data.url);
                                } else {
                                  alert(data.error || "Failed to upload image. Check server storage settings.");
                                }
                              } catch (err: any) {
                                alert(err.message || "Failed to upload image");
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Engineering Specifications */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#dec49a]" />
            3. Engineering Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
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
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
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
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
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
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
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

        {/* Step 4: Key Highlights & Features */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#dec49a]" />
            4. Architectural Key Highlights
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

          <div className="flex gap-2 pt-1">
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
              placeholder="Add key feature or bullet point..."
              className="flex-1 bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 px-4 py-2 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold"
            >
              Add Point
            </button>
          </div>
        </div>

        {/* Step 5: Badges & Showcase Settings */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#dec49a]" />
              5. Product Badges & Visibility
            </h3>
            <span className="text-xs text-stone-400">Manage tags & storefront promotional visibility</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Bestseller Toggle */}
            <div
              onClick={() => setIsBestseller(!isBestseller)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-3 ${
                isBestseller
                  ? "bg-[#9b7842]/20 border-[#9b7842] shadow-sm shadow-[#9b7842]/10"
                  : "bg-[#1c222c]/60 border-stone-800 hover:border-stone-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isBestseller ? "bg-[#9b7842] text-white" : "bg-stone-800 text-stone-400"}`}>
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Bestseller Product</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">Top-selling signature item</div>
                  </div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    isBestseller ? "bg-[#9b7842]" : "bg-stone-800 border border-stone-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isBestseller ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
              <p className="text-[11px] text-stone-400">
                Displays <span className="text-[#dec49a] font-semibold">Bestseller</span> badge and boosts ranking in recommendations.
              </p>
            </div>

            {/* Featured Toggle */}
            <div
              onClick={() => setIsFeatured(!isFeatured)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-3 ${
                isFeatured
                  ? "bg-[#9b7842]/20 border-[#9b7842] shadow-sm shadow-[#9b7842]/10"
                  : "bg-[#1c222c]/60 border-stone-800 hover:border-stone-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isFeatured ? "bg-[#9b7842] text-white" : "bg-stone-800 text-stone-400"}`}>
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Featured Product</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">Showcase on homepage</div>
                  </div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    isFeatured ? "bg-[#9b7842]" : "bg-stone-800 border border-stone-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isFeatured ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
              <p className="text-[11px] text-stone-400">
                Highlights product in curated architectural collections & catalog hero.
              </p>
            </div>

            {/* New Arrival Toggle */}
            <div
              onClick={() => setIsNew(!isNew)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-3 ${
                isNew
                  ? "bg-[#9b7842]/20 border-[#9b7842] shadow-sm shadow-[#9b7842]/10"
                  : "bg-[#1c222c]/60 border-stone-800 hover:border-stone-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isNew ? "bg-[#9b7842] text-white" : "bg-stone-800 text-stone-400"}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">New Arrival</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">New launch collection</div>
                  </div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    isNew ? "bg-[#9b7842]" : "bg-stone-800 border border-stone-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isNew ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
              <p className="text-[11px] text-stone-400">
                Displays <span className="text-[#dec49a] font-semibold">NEW</span> badge tag on product cards across the website.
              </p>
            </div>
          </div>
        </div>

        {/* Publish Action Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-stone-800">
          <Link
            href="/admin/products"
            className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-[#9b7842]/30 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? "Publishing to PostgreSQL..." : "Publish Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
