"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Layers, 
  Image as ImageIcon, 
  DollarSign, 
  Package as PackageIcon, 
  Plus, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Box,
  RefreshCw,
  Check,
  Percent,
  Upload,
  Loader2,
  X
} from "lucide-react";
import { PackageItem } from "@/lib/packages";
import { PRODUCTS } from "@/lib/products";
import { Product } from "@/lib/types";
import { getProductFinishGallery, FinishDetail } from "@/lib/productUtils";
import { SuiteCoverGalleryModal } from "@/components/admin/SuiteCoverGalleryModal";

const FINISH_COLOR_SWATCHES: Record<string, { bg: string; border?: string }> = {
  "Gold Bright PVD": { bg: "#E5B94E" },
  "Gold": { bg: "#E5B94E" },
  "Brushed Gold": { bg: "#D4AF37" },
  "Chrome": { bg: "#CBD5E1", border: "#94A3B8" },
  "Black Chrome": { bg: "#374151" },
  "Black Matt": { bg: "#18181B" },
  "Matte Black": { bg: "#18181B" },
  "Blush Gold PVD": { bg: "#E0A899" },
  "Rose Gold": { bg: "#C08081" },
  "Brushed Brass": { bg: "#B59458" },
  "Graphite Matte": { bg: "#334155" },
  "Graphite Grey": { bg: "#475569" },
  "White Ceramic": { bg: "#F8FAFC", border: "#CBD5E1" },
  "Natural Cedar": { bg: "#8B5A2B" },
};

export default function NewPackagePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);
  const [existingPackagesCount, setExistingPackagesCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gallery Modal State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("Curated Bathroom Suite");
  const [finishTheme, setFinishTheme] = useState("Gold Bright PVD");
  const [idealFor, setIdealFor] = useState("Master Bedrooms, Penthouse Suites & Luxury Villas");
  const [description, setDescription] = useState("");
  
  // Fresh cover image (starts empty for user upload)
  const [coverImage, setCoverImage] = useState("");
  
  // Products in package (starts empty for fresh additions, up to 8 max)
  const [items, setItems] = useState<PackageItem[]>([]);

  // Product Ingestion Picker State (Step-by-step)
  const [selectedCatalogProductId, setSelectedCatalogProductId] = useState<string>("");
  const [selectedFinishDetail, setSelectedFinishDetail] = useState<FinishDetail | null>(null);
  const [customRole, setCustomRole] = useState<string>("");

  // Accurate Pricing State
  const [packagePrice, setPackagePrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [autoSyncPrice, setAutoSyncPrice] = useState<boolean>(true);

  // Load catalog products & packages count
  useEffect(() => {
    async function loadInitialData() {
      try {
        const prodRes = await fetch("/api/products");
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.products && Array.isArray(prodData.products) && prodData.products.length > 0) {
            setCatalogProducts(prodData.products);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic products, using fallback:", err);
      }

      try {
        const pkgRes = await fetch("/api/packages");
        if (pkgRes.ok) {
          const pkgData = await pkgRes.json();
          if (pkgData.packages && Array.isArray(pkgData.packages)) {
            setExistingPackagesCount(pkgData.packages.length);
          }
        }
      } catch (err) {
        console.warn("Could not load packages count:", err);
      }
    }

    loadInitialData();
  }, []);

  // Calculate total price of all items accurately
  const totalItemsPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [items]);

  // Keep originalPrice synced with sum of items when autoSyncPrice is active
  useEffect(() => {
    if (autoSyncPrice) {
      setOriginalPrice(totalItemsPrice);
      if (packagePrice === 0 && totalItemsPrice > 0) {
        // Default package price with ~15% discount
        setPackagePrice(Math.round(totalItemsPrice * 0.85));
      }
    }
  }, [totalItemsPrice, autoSyncPrice, packagePrice]);

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  };

  // Upload fresh cover image directly
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setCoverImage(data.url);
      } else {
        alert(data.error || "Failed to upload image. Please try again or paste a URL.");
      }
    } catch (err: any) {
      alert(err.message || "Upload failed. Please check network connection.");
    } finally {
      setIsUploadingCover(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Currently active product in the builder
  const activeProduct = useMemo(() => {
    return catalogProducts.find((p) => p.id === selectedCatalogProductId) || null;
  }, [catalogProducts, selectedCatalogProductId]);

  // Extract all color/finish options for the selected product
  const activeProductFinishes = useMemo(() => {
    return activeProduct ? getProductFinishGallery(activeProduct) : [];
  }, [activeProduct]);

  // When selectedCatalogProductId changes, initialize finish and role
  const handleSelectCatalogProduct = (productId: string) => {
    setSelectedCatalogProductId(productId);
    const prod = catalogProducts.find((p) => p.id === productId);
    if (!prod) {
      setSelectedFinishDetail(null);
      setCustomRole("");
      return;
    }

    const finishes = getProductFinishGallery(prod);
    setSelectedFinishDetail(finishes[0] || null);
    setCustomRole(prod.subcategory || prod.category || "Bathroom Fixture");
  };

  // Add the selected product with the chosen color option into the package
  const handleConfirmAddProduct = () => {
    if (!activeProduct) return;
    if (items.length >= 8) {
      alert("A package can have a maximum of 8 products.");
      return;
    }

    const chosenFinish = selectedFinishDetail?.finish || finishTheme;
    const chosenSku = selectedFinishDetail?.sku || activeProduct.sku;
    const chosenPrice = selectedFinishDetail?.offerPrice || selectedFinishDetail?.mrp || activeProduct.price;
    const chosenImage = selectedFinishDetail?.image || activeProduct.images?.[0] || "";

    const newFixture: PackageItem = {
      productId: activeProduct.id,
      name: activeProduct.name,
      role: customRole.trim() || activeProduct.subcategory || activeProduct.category || "Bathroom Fixture",
      finish: chosenFinish,
      sku: chosenSku,
      price: chosenPrice,
      image: chosenImage,
    };

    setItems((prev) => [...prev, newFixture]);

    // Reset picker for next product
    setSelectedCatalogProductId("");
    setSelectedFinishDetail(null);
    setCustomRole("");
  };

  // Modify individual item field in the added items list
  const handleItemChange = (index: number, field: keyof PackageItem, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: field === "price" ? Number(value) || 0 : value,
      };
      return next;
    });
  };

  // Change color variant of an already added item
  const handleSwitchItemFinish = (index: number, variant: FinishDetail) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        finish: variant.finish,
        sku: variant.sku || next[index].sku,
        image: variant.image || next[index].image,
        price: variant.offerPrice || variant.mrp || next[index].price,
      };
      return next;
    });
  };

  // Remove a product from the package
  const handleRemoveProduct = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Quick discount calculation buttons
  const handleApplyDiscountPreset = (percent: number) => {
    const discounted = Math.round(originalPrice * (1 - percent / 100));
    setPackagePrice(discounted);
  };

  // Accurate savings calculation
  const savings = Math.max(0, originalPrice - packagePrice);
  const discountPercent = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  // Group products by category for clean dropdown display
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    catalogProducts.forEach((p) => {
      const cat = p.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [catalogProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingPackagesCount >= 8) {
      setError("Maximum limit of 8 packages reached. You cannot create more than 8 packages. Please edit or delete an existing suite.");
      return;
    }
    if (!name.trim()) {
      setError("Please provide a package suite name.");
      return;
    }
    if (!coverImage.trim()) {
      setError("Please upload or provide a fresh suite hero cover visual.");
      return;
    }
    if (items.length === 0) {
      setError("Please add at least 1 product to the package using the product selector below.");
      return;
    }
    if (items.length > 8) {
      setError("A package can have a maximum of 8 products.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          subtitle: subtitle.trim() || undefined,
          badge: badge.trim() || "Curated Suite",
          tagline: name.trim(),
          description: description.trim(),
          coverImage: coverImage.trim(),
          finishTheme: items[0]?.finish || "Curated Suite",
          idealFor: idealFor.trim(),
          packagePrice: Number(packagePrice),
          originalPrice: Number(originalPrice),
          savings,
          items,
          isActive: true,
        }),
      });

      if (res.ok) {
        router.push("/admin/packages");
      } else {
        const err = await res.json();
        setError(err.message || "Failed to create package suite.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLimitReached = existingPackagesCount >= 8;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/packages"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Packages</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-mono">
            Suite Capacity: {existingPackagesCount} / 8 Max
          </span>
          {isLimitReached && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
              Limit Reached
            </span>
          )}
        </div>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40">
            Suite Configurator
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1 flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-[#9b7842]" />
          Create Curated Bathroom Suite
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Upload a fresh hero visual, select products from the catalog, choose their exact color options with live pricing, and bundle up to 8 fixtures.
        </p>
      </div>

      {/* Limit Warning Banner */}
      {isLimitReached && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Maximum 8 Suites Reached:</strong> You have 8 curated bathroom suites configured. Please return to the packages list to edit an existing suite or delete one before creating a new one.
            </span>
          </div>
          <Link
            href="/admin/packages"
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold shrink-0 transition-colors"
          >
            Manage Suites
          </Link>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ========================================================= */}
        {/* SECTION 1: SUITE DETAILS                                  */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-[#141822] border border-stone-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-800">
            <Sparkles className="w-4 h-4 text-[#dec49a]" />
            <h3 className="text-base font-serif font-bold text-white">1. Suite Identification</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Suite Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. The Royal Penthouse Suite"
                className="w-full px-4 py-2.5 bg-[#0c0f17] border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#9b7842] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                URL Slug <span className="text-stone-500 font-mono">(auto-generated)</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="royal-penthouse-gold-suite"
                className="w-full px-4 py-2.5 bg-[#0c0f17] border border-stone-800 rounded-xl text-xs text-stone-300 font-mono focus:outline-none focus:border-[#9b7842] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Badge / Tagline Accent
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Most Popular Suite, Architect's Choice"
                className="w-full px-4 py-2.5 bg-[#0c0f17] border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#9b7842]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Ideal For (Room / Space Type)
              </label>
              <input
                type="text"
                value={idealFor}
                onChange={(e) => setIdealFor(e.target.value)}
                placeholder="e.g. Master Bedrooms, Penthouse Suites & Luxury Villas"
                className="w-full px-4 py-2.5 bg-[#0c0f17] border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#9b7842]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Complete Architect-Matched Bathroom Ensemble"
                className="w-full px-4 py-2.5 bg-[#0c0f17] border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#9b7842]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Ideal For (Room / Space Type)
              </label>
              <input
                type="text"
                value={idealFor}
                onChange={(e) => setIdealFor(e.target.value)}
                placeholder="e.g. Master Bedrooms, Penthouse Suites & Luxury Villas"
                className="w-full px-4 py-2.5 bg-[#0c0f17] border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#9b7842]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Suite Architectural Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the harmonized design language, finishes, and craftsmanship included in this package..."
                className="w-full px-4 py-3 bg-[#0c0f17] border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#9b7842] leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: SUITE HERO COVER IMAGE (FRESH UPLOAD & PICKER) */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-[#141822] border border-stone-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4 text-[#dec49a]" />
              <div>
                <h3 className="text-base font-serif font-bold text-white">2. Suite Hero Cover Visual</h3>
                <p className="text-[11px] text-stone-400">Upload a fresh visual for this package banner, choose from gallery, or paste a URL.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4">
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />

              {/* Upload & Gallery Action Buttons */}
              <div className="p-4 rounded-2xl bg-[#0c0f17] border border-stone-800 space-y-3">
                <span className="block text-xs font-semibold text-stone-300">
                  Upload Fresh Cover Image <span className="text-red-400">*</span>
                </span>
                
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingCover}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isUploadingCover ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading Image...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload from Computer</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsGalleryOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-[#dec49a]" />
                    <span>Choose from Gallery</span>
                  </button>

                  {coverImage && (
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="p-2.5 rounded-xl bg-stone-900 hover:bg-red-500/20 text-stone-400 hover:text-red-400 border border-stone-800 transition-colors cursor-pointer"
                      title="Clear image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Image URL text input fallback */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Or Direct Image URL:
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-[#0c0f17] border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#9b7842]"
                />
              </div>
            </div>

            {/* Live Visual Preview */}
            <div className="md:col-span-5">
              <span className="text-[11px] font-semibold text-stone-400 block mb-2">
                Left-Side Banner Live Preview
              </span>
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-stone-800 bg-[#0c0f17]">
                {coverImage ? (
                  <>
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 p-5 flex flex-col justify-end">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#dec49a]">
                        {badge || "Curated Suite"}
                      </span>
                      <h5 className="text-base font-serif font-bold text-white truncate mt-0.5">
                        {name || "Your Suite Name"}
                      </h5>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15">
                        <span className="text-[10px] text-emerald-300 font-bold">
                          Save ₹{savings.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-stone-300">
                          {items.length} Fixtures Included
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-600 text-xs p-6 text-center gap-2">
                    <ImageIcon className="w-8 h-8 text-stone-700" />
                    <span>No cover image uploaded yet. Click &ldquo;Upload from Computer&rdquo; or select from gallery.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: SUITE PRICING & ACCURATE SAVINGS               */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-[#141822] border border-stone-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 text-[#dec49a]" />
              <div>
                <h3 className="text-base font-serif font-bold text-white">3. Suite Bundle Pricing & Calculations</h3>
                <p className="text-[11px] text-stone-400">Accurately calculate customer savings from included fixtures and their chosen color variants.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAutoSyncPrice(true);
                  setOriginalPrice(totalItemsPrice);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[#dec49a] hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Auto-Sum Fixtures: ₹{totalItemsPrice.toLocaleString("en-IN")}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Original Itemized Price (₹) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={0}
                  value={originalPrice}
                  onChange={(e) => {
                    setAutoSyncPrice(false);
                    setOriginalPrice(Number(e.target.value) || 0);
                  }}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-[#0c0f17] border border-stone-800 rounded-xl text-sm font-bold text-stone-200 focus:outline-none focus:border-[#9b7842]"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1.5">
                <span>Sum of {items.length} fixtures: ₹{totalItemsPrice.toLocaleString("en-IN")}</span>
                {autoSyncPrice ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Auto-Synced
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSyncPrice(true);
                      setOriginalPrice(totalItemsPrice);
                    }}
                    className="text-[#dec49a] underline cursor-pointer"
                  >
                    Re-sync
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Bundle Package Price (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={packagePrice}
                onChange={(e) => setPackagePrice(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-4 py-2.5 bg-[#0c0f17] border border-stone-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#9b7842]"
              />
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[10px] text-stone-400">Quick Discount:</span>
                {[10, 15, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleApplyDiscountPreset(pct)}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-stone-900 hover:bg-[#9b7842] text-stone-300 hover:text-white border border-stone-800 transition-colors cursor-pointer"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0f17] border border-stone-800 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-stone-400">Calculated Suite Savings</span>
              <div className="text-2xl font-bold text-emerald-400 mt-0.5">
                ₹{savings.toLocaleString("en-IN")}
              </div>
              <span className="text-xs text-emerald-400/90 font-semibold mt-0.5 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5" />
                <span>{discountPercent}% Suite Savings for Customer</span>
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: ADD PRODUCTS & COLOR VARIANTS (UP TO 8 MAX)     */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-[#141822] border border-stone-800 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-3">
            <div className="flex items-center gap-2.5">
              <PackageIcon className="w-4 h-4 text-[#dec49a]" />
              <div>
                <h3 className="text-base font-serif font-bold text-white">
                  4. Architect-Matched Products ({items.length} / 8 Max)
                </h3>
                <p className="text-[11px] text-stone-400">
                  Select a product from the dropdown, see its color options and prices appear, pick a color, and add it into the package.
                </p>
              </div>
            </div>

            <span className={`text-xs px-3 py-1 rounded-full font-mono font-bold border ${
              items.length >= 8
                ? "bg-red-500/20 text-red-300 border-red-500/30"
                : "bg-stone-900 text-[#dec49a] border-stone-800"
            }`}>
              {items.length} / 8 Products Added
            </span>
          </div>

          {/* STEP-BY-STEP PRODUCT SELECTOR BUILDER */}
          {items.length < 8 ? (
            <div className="p-6 rounded-2xl bg-[#0c0f17] border-2 border-dashed border-[#9b7842]/40 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#9b7842] text-white text-xs font-bold flex items-center justify-center">
                    +
                  </span>
                  <h4 className="text-sm font-serif font-bold text-white">
                    Add Product #{items.length + 1} to Package
                  </h4>
                </div>
                <span className="text-[11px] text-stone-400">
                  Step 1: Choose Product &rarr; Step 2: Pick Color Option &rarr; Step 3: Add
                </span>
              </div>

              {/* Step 1: All Products Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-300">
                  Step 1: Select Product from Catalog <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedCatalogProductId}
                  onChange={(e) => handleSelectCatalogProduct(e.target.value)}
                  className="w-full px-4 py-3 bg-[#141822] border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#9b7842] cursor-pointer"
                >
                  <option value="">-- Click here to select a product from catalog --</option>
                  {Object.entries(groupedProducts).map(([cat, prods]) => (
                    <optgroup key={cat} label={`📂 ${cat}`}>
                      {prods.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku}) — Base: ₹{p.price.toLocaleString("en-IN")}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Step 2: Product Selected -> Show Color Options & Prices */}
              {activeProduct && (
                <div className="p-4 rounded-xl bg-[#141822] border border-stone-800 space-y-4 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-stone-900 border border-stone-800 overflow-hidden shrink-0 flex items-center justify-center">
                        {selectedFinishDetail?.image || activeProduct.images?.[0] ? (
                          <img
                            src={selectedFinishDetail?.image || activeProduct.images?.[0]}
                            alt={activeProduct.name}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <Box className="w-5 h-5 text-stone-600" />
                        )}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{activeProduct.name}</h5>
                        <span className="text-[10px] text-stone-400 font-mono">Base SKU: {activeProduct.sku}</span>
                      </div>
                    </div>

                    <div className="w-full sm:w-64">
                      <label className="block text-[10px] font-semibold text-stone-400 mb-1">
                        Fixture Placement / Role:
                      </label>
                      <input
                        type="text"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        placeholder="e.g. Countertop Vessel Basin Mixer"
                        className="w-full px-3 py-1.5 bg-[#0c0f17] border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#9b7842]"
                      />
                    </div>
                  </div>

                  {/* Step 2 Color Options & Prices Display */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#dec49a] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Step 2: Choose Color / Finish Option with Price:</span>
                      </label>
                      <span className="text-[10px] text-stone-400">
                        {activeProductFinishes.length} color variants available
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {activeProductFinishes.map((f) => {
                        const isChosen = selectedFinishDetail?.finish === f.finish;
                        const swatch = FINISH_COLOR_SWATCHES[f.finish] || { bg: "#9b7842" };
                        const finishPrice = f.offerPrice || f.mrp || activeProduct.price;

                        return (
                          <button
                            key={f.finish}
                            type="button"
                            onClick={() => setSelectedFinishDetail(f)}
                            className={`p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                              isChosen
                                ? "bg-[#9b7842]/20 border-[#dec49a] ring-2 ring-[#dec49a]/40 text-white shadow-md scale-[1.01]"
                                : "bg-[#0c0f17] border-stone-800 text-stone-400 hover:text-white hover:border-stone-700"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className="w-4 h-4 rounded-full shrink-0 shadow-xs border border-white/20"
                                style={{ backgroundColor: swatch.bg }}
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate">{f.finish}</div>
                                <div className="text-[10px] text-stone-400 font-mono truncate">{f.sku}</div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-xs font-bold text-[#dec49a]">
                                ₹{finishPrice.toLocaleString("en-IN")}
                              </div>
                              {isChosen && (
                                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                                  <Check className="w-3 h-3" /> Selected
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Confirmation Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleConfirmAddProduct}
                      disabled={!selectedFinishDetail}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white text-xs font-bold transition-all shadow-lg shadow-[#9b7842]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        Add {activeProduct.name} ({selectedFinishDetail?.finish || "Selected Finish"} — ₹{(selectedFinishDetail?.offerPrice || selectedFinishDetail?.mrp || activeProduct.price).toLocaleString("en-IN")}) into Package
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#0c0f17] border border-stone-800 text-center text-xs text-stone-400">
              Maximum 8 products reached for this package. Remove a product below if you wish to add a different one.
            </div>
          )}

          {/* LIST OF ALREADY ADDED FIXTURES IN THIS PACKAGE */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <span>Products in this Package ({items.length})</span>
            </h4>

            {items.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0c0f17] border border-stone-800 text-center space-y-2">
                <Box className="w-8 h-8 text-stone-700 mx-auto" />
                <p className="text-xs text-stone-400 font-medium">No products added yet.</p>
                <p className="text-[11px] text-stone-500">
                  Use the product selector above to choose a product, pick its color option, and add it to your suite (up to 8 fixtures max).
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => {
                  const matchedProduct = catalogProducts.find(
                    (p) => p.id === item.productId || p.sku === item.sku || p.name === item.name
                  );
                  const finishGallery = matchedProduct ? getProductFinishGallery(matchedProduct) : [];

                  return (
                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-[#0c0f17] border border-stone-800 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#9b7842]/20 text-[#dec49a] text-[11px] font-bold flex items-center justify-center">
                            #{index + 1}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {item.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300">
                            {item.finish}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#dec49a]">
                            ₹{Number(item.price || 0).toLocaleString("en-IN")}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(index)}
                            className="p-1.5 rounded-lg bg-stone-900 hover:bg-red-500/20 text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove from package"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        {/* Thumbnail */}
                        <div className="sm:col-span-2 flex justify-center">
                          <div className="w-16 h-16 rounded-xl bg-white/5 border border-stone-800 overflow-hidden flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                            ) : (
                              <Box className="w-5 h-5 text-stone-600" />
                            )}
                          </div>
                        </div>

                        {/* Fields */}
                        <div className="sm:col-span-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-semibold text-stone-400 mb-1">
                              Role / Placement
                            </label>
                            <input
                              type="text"
                              value={item.role}
                              onChange={(e) => handleItemChange(index, "role", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#141822] border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#9b7842]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-stone-400 mb-1">
                              SKU Code
                            </label>
                            <input
                              type="text"
                              value={item.sku}
                              onChange={(e) => handleItemChange(index, "sku", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#141822] border border-stone-800 rounded-lg text-xs text-stone-300 font-mono focus:outline-none focus:border-[#9b7842]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-stone-400 mb-1">
                              Price (₹)
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={item.price}
                              onChange={(e) => handleItemChange(index, "price", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#141822] border border-stone-800 rounded-lg text-xs text-white font-bold focus:outline-none focus:border-[#9b7842]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Switch Color Option on already added item */}
                      {finishGallery.length > 1 && (
                        <div className="pt-2 border-t border-stone-800/80 flex items-center gap-2 overflow-x-auto">
                          <span className="text-[10px] text-stone-400 shrink-0">Switch Color:</span>
                          <div className="flex items-center gap-1.5">
                            {finishGallery.map((v) => {
                              const isSelected = item.finish.toLowerCase() === v.finish.toLowerCase();
                              const swatch = FINISH_COLOR_SWATCHES[v.finish] || { bg: "#9b7842" };
                              const variantPrice = v.offerPrice || v.mrp;

                              return (
                                <button
                                  key={v.finish}
                                  type="button"
                                  onClick={() => handleSwitchItemFinish(index, v)}
                                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                                    isSelected
                                      ? "bg-[#9b7842]/20 border-[#dec49a] text-white"
                                      : "bg-[#141822] border-stone-800 text-stone-400 hover:text-white"
                                  }`}
                                >
                                  <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: swatch.bg }}
                                  />
                                  <span>{v.finish}</span>
                                  {variantPrice > 0 && (
                                    <span className="text-[9px] text-stone-400 font-mono">
                                      ₹{variantPrice.toLocaleString("en-IN")}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-xs text-stone-400">
            {items.length} fixtures configured • Accurate original sum: ₹{totalItemsPrice.toLocaleString("en-IN")}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/packages"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 border border-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isLimitReached || items.length === 0}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white text-xs font-bold px-7 py-3 rounded-xl shadow-xl shadow-[#9b7842]/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Creating Suite..." : "Publish Suite to Storefront"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Gallery Modal */}
      <SuiteCoverGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        selectedUrl={coverImage}
        onSelectImage={(url) => setCoverImage(url)}
      />
    </div>
  );
}
