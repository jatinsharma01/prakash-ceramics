"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
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
  Image as ImageIcon,
  Save,
  Trash2,
  AlertCircle
} from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { FinishType, Product } from "@/lib/types";
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Faucets");
  const [range, setRange] = useState("Fusion Prime");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">(9400);
  const [originalPrice, setOriginalPrice] = useState<number | "">(11200);
  const [sku, setSku] = useState("");
  const [stockCount, setStockCount] = useState<number | "">(20);
  const [warranty, setWarranty] = useState("10 Years Comprehensive Warranty");
  const [material, setMaterial] = useState("Solid Virgin DR Brass (Lead-Free)");
  const [flowRate, setFlowRate] = useState("4.8 LPM at 3 Bar (Eco-Save)");
  const [dimensions, setDimensions] = useState("Standard Deck Mount");

  // Finishes & Variants
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [finishPrices, setFinishPrices] = useState<Record<string, number | "">>({});
  const [finishSkus, setFinishSkus] = useState<Record<string, string>>({});
  const [finishStocks, setFinishStocks] = useState<Record<string, number | "">>({});
  const [finishImages, setFinishImages] = useState<Record<string, string>>({});

  // Highlights & Media
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState("");

  // Badges
  const [isFeatured, setIsFeatured] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch existing product
  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.success && data.product) {
          const p: Product = data.product;
          setProductName(p.name);
          setCategory(p.category);
          setRange(p.range || "Fusion Prime");
          setTagline(p.tagline || "");
          setDescription(p.description || "");
          setPrice(p.price);
          setOriginalPrice(p.originalPrice || "");
          setSku(p.sku);
          setStockCount(p.stockCount || 20);
          setWarranty(p.warranty || "10 Years Comprehensive Warranty");
          setMaterial(p.material || "Solid Virgin DR Brass");
          setFlowRate(p.flowRate || "4.8 LPM at 3 Bar");
          setDimensions(p.dimensions || "Standard Deck Mount");
          setSelectedFinishes(p.finishes || ["Chrome"]);
          setFeatures(p.features || []);
          setImages(p.images || []);
          setIsFeatured(!!p.isFeatured);
          setIsNew(!!p.isNew);
          setIsBestseller(!!p.isBestseller);

          // Populate variant maps
          if (p.finishPrices) setFinishPrices(p.finishPrices);
          if (p.finishSkus) setFinishSkus(p.finishSkus);
          if (p.finishStocks) setFinishStocks(p.finishStocks);
          if (p.finishImages) setFinishImages(p.finishImages);
        } else {
          setErrorMessage("Product not found");
        }
      } catch {
        setErrorMessage("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  const toggleFinish = (finish: string) => {
    if (selectedFinishes.includes(finish)) {
      if (selectedFinishes.length > 1) {
        setSelectedFinishes(selectedFinishes.filter((f) => f !== finish));
      }
    } else {
      setSelectedFinishes([...selectedFinishes, finish]);
      if (!finishSkus[finish]) {
        const short = finish.substring(0, 3).toUpperCase();
        setFinishSkus((prev) => ({ ...prev, [finish]: `FUP-${short}-${Math.floor(10000 + Math.random() * 90000)}` }));
      }
      if (!finishPrices[finish] && price) {
        setFinishPrices((prev) => ({ ...prev, [finish]: Number(price) }));
      }
      if (!finishStocks[finish]) {
        setFinishStocks((prev) => ({ ...prev, [finish]: 15 }));
      }
    }
  };

  const handleFinishPriceChange = (finish: string, val: string) => {
    setFinishPrices((prev) => ({ ...prev, [finish]: val === "" ? "" : Number(val) }));
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToastMessage(null);
    setErrorMessage(null);

    try {
      const cleanedFinishPrices: Record<string, number> = {};
      const cleanedFinishSkus: Record<string, string> = {};
      const cleanedFinishStocks: Record<string, number> = {};
      const cleanedFinishImages: Record<string, string> = {};

      selectedFinishes.forEach((f) => {
        cleanedFinishPrices[f] = typeof finishPrices[f] === "number" ? (finishPrices[f] as number) : Number(price) || 0;
        cleanedFinishSkus[f] = finishSkus[f] || `${sku || "PC-ITM"}-${f.slice(0, 3).toUpperCase()}`;
        cleanedFinishStocks[f] = typeof finishStocks[f] === "number" ? (finishStocks[f] as number) : 15;
        if (finishImages[f]) cleanedFinishImages[f] = finishImages[f];
      });

      const payload = {
        name: productName,
        sku,
        category,
        range,
        tagline,
        description,
        price: Number(price) || (cleanedFinishPrices[selectedFinishes[0]] || 9400),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        stockCount: Number(stockCount) || 20,
        isFeatured,
        isNew,
        isBestseller,
        finishes: selectedFinishes,
        finishImages: cleanedFinishImages,
        finishPrices: cleanedFinishPrices,
        finishSkus: cleanedFinishSkus,
        finishStocks: cleanedFinishStocks,
        images: images.length > 0 ? images : Object.values(cleanedFinishImages),
        material,
        warranty,
        dimensions,
        flowRate,
        features,
        specs: {
          Range: range,
          Material: material,
          Warranty: warranty,
          Dimensions: dimensions,
          "Flow Rate": flowRate,
          finishPrices: cleanedFinishPrices,
          finishSkus: cleanedFinishSkus,
          finishStocks: cleanedFinishStocks,
        },
      };

      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setToastMessage("Product & finish variants updated successfully in PostgreSQL!");
        setTimeout(() => {
          router.push("/admin/products");
          router.refresh();
        }, 1200);
      } else {
        setErrorMessage(data.message || "Failed to update product");
      }
    } catch {
      setErrorMessage("Network error updating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center text-[#dec49a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#9b7842] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
            Loading Product Editor...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl pb-20">
      {/* Toast alert */}
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

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-red-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
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
                Edit Catalog Item
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
              Edit {productName || "Product"}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUpdate}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] disabled:opacity-50 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-[#9b7842]/25 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Step 1: Basic Information */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-[#dec49a]" />
            1. General Product Details
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
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Single Lever Basin Mixer"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.name}>
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
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Master SKU Code
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. FUP-GBP-29011BPM"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl font-mono focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Tagline & Short Summary
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Single Lever Basin Mixer without Popup Waste System with 450mm Long Braided Hoses"
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Detailed Product Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe architectural features, durability, cartridge specs..."
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Available Finishes & Color Variants Card */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#dec49a]" />
                2. Color Finishes, Prices, Stock & Images
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Select colors for this product. For each color, set its individual price, item code, stock, and photo.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40 rounded-full font-bold">
              {selectedFinishes.length} Finishes Selected
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
          </div>

          {/* Individual Color Variant Cards */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Finish Variant Matrix ({selectedFinishes.length} Active Colors)
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        placeholder="e.g. 9400"
                        className="w-full bg-[#141822] border border-stone-700 text-xs text-emerald-400 font-bold px-3 py-2 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                      />
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
                          <div className="w-9 h-9 rounded-lg border border-dashed border-stone-700 flex items-center justify-center text-stone-600 shrink-0">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}

                        <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#9b7842]/20 hover:bg-[#9b7842]/30 text-[#dec49a] border border-[#9b7842]/40 text-xs font-semibold transition-all truncate">
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Upload Image</span>
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
                                if (data.url) {
                                  handleFinishImageChange(finish, data.url);
                                }
                              } catch {
                                alert("Failed to upload image");
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
                Flow Rate / Aerator Rating
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
                Dimensions / Spout Fit
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
            4. Key Architectural Highlights
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

        {/* Save button bar */}
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-[#9b7842]/25 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving to PostgreSQL..." : "Save Product Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
