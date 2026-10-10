"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  X, 
  Check, 
  Search, 
  Sparkles, 
  Image as ImageIcon, 
  Layers, 
  ExternalLink,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface GalleryImage {
  id: string;
  name: string;
  category: "Suites" | "Showroom" | "Atmosphere";
  url: string;
  theme?: string;
}

export const SUITE_GALLERY_IMAGES: GalleryImage[] = [
  // Architectural Suite Ensembles
  {
    id: "suite-gold-penthouse",
    name: "The Royal Penthouse Master Suite",
    category: "Suites",
    theme: "Gold Bright PVD",
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "suite-modern-villa-black",
    name: "The Modern Villa Minimal Suite",
    category: "Suites",
    theme: "Black Matt",
    url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "suite-nordic-spa-chrome",
    name: "The Scandinavian Nordic Spa Suite",
    category: "Suites",
    theme: "Chrome",
    url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "suite-rose-gold-haute",
    name: "The Boutique Rose Gold Haute Suite",
    category: "Suites",
    theme: "Blush Gold PVD",
    url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "suite-freestanding-tub-marble",
    name: "Calacatta Marble Freestanding Tub Suite",
    category: "Suites",
    theme: "Gold / Brass",
    url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "suite-alabaster-villa",
    name: "Alabaster Stone & Wood Architectural En-Suite",
    category: "Suites",
    theme: "Natural Stone",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "suite-emerald-sanctuary",
    name: "Emerald Tile & Brushed Brass Sanctuary",
    category: "Suites",
    theme: "Brushed Brass",
    url: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "suite-hydrotherapy-spa",
    name: "Dark Slate Hydrotherapy Shower Room",
    category: "Suites",
    theme: "Dark Slate & Chrome",
    url: "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "suite-warm-travertine",
    name: "Travertine Stone Spa & Deep Soak Bath",
    category: "Suites",
    theme: "Travertine Warm",
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600",
  },

  // Showroom & Category Visuals (from Cloudinary)
  {
    id: "cat-faucets",
    name: "Architectural Faucets & Mixers Showroom",
    category: "Showroom",
    url: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760648/parkash-ceramics/faucets.jpg",
  },
  {
    id: "cat-showers",
    name: "Rain & Hydrotherapy Showers Room",
    category: "Showroom",
    url: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760665/parkash-ceramics/showers.jpg",
  },
  {
    id: "cat-bathtubs",
    name: "Freestanding Architectural Bathtubs",
    category: "Showroom",
    url: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760643/parkash-ceramics/bathtub.jpg",
  },
  {
    id: "cat-whirlpool",
    name: "Whirlpool Hydro-Massage Bathtubs",
    category: "Showroom",
    url: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760673/parkash-ceramics/whirpoolbathtub.jpg",
  },
  {
    id: "cat-spas",
    name: "Outdoor Hydro-Sensory Spas & Hot Tubs",
    category: "Showroom",
    url: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760668/parkash-ceramics/spas.jpg",
  },
  {
    id: "cat-saunas",
    name: "Finnish Cedar Wood Saunas",
    category: "Showroom",
    url: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760658/parkash-ceramics/saunas.jpg",
  },
  {
    id: "cat-steambath",
    name: "Aroma Steam Bath Generator Rooms",
    category: "Showroom",
    url: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760670/parkash-ceramics/steambath.jpg",
  },
  {
    id: "cat-showerpanels",
    name: "Concealed Thermostatic Shower Panels",
    category: "Showroom",
    url: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760662/parkash-ceramics/showerpanels.jpg",
  },
  {
    id: "cat-sanitaryware",
    name: "Vitreous Ceramic Sanitaryware & Basins",
    category: "Showroom",
    url: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760655/parkash-ceramics/sanitaryware.jpg",
  },
  {
    id: "cat-thermostatic",
    name: "Swiss Kerox Thermostatic Mixer Valves",
    category: "Showroom",
    url: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760671/parkash-ceramics/thermostaticmixers.jpg",
  },
];

interface SuiteCoverGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUrl: string;
  onSelectImage: (url: string) => void;
}

export function SuiteCoverGalleryModal({
  isOpen,
  onClose,
  selectedUrl,
  onSelectImage,
}: SuiteCoverGalleryModalProps) {
  const [activeTab, setActiveTab] = useState<"All" | "Suites" | "Showroom" | "Custom">("All");
  const [search, setSearch] = useState("");
  const [customInput, setCustomInput] = useState("");

  if (!isOpen) return null;

  const filtered = SUITE_GALLERY_IMAGES.filter((img) => {
    const matchesTab = activeTab === "All" || img.category === activeTab;
    const matchesSearch =
      !search.trim() ||
      img.name.toLowerCase().includes(search.toLowerCase()) ||
      (img.theme && img.theme.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleApplyCustom = () => {
    if (customInput.trim()) {
      onSelectImage(customInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-[#121620] border border-stone-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9b7842]/20 border border-[#9b7842]/40 flex items-center justify-center text-[#dec49a]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                Choose Suite Cover Visual
              </h3>
              <p className="text-xs text-stone-400">
                Select high-resolution architectural suite visual for the left-side banner
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs & Search */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-[#0c0f17] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(["All", "Suites", "Showroom", "Custom"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#9b7842] text-white"
                    : "bg-[#141822] text-stone-400 hover:text-white border border-stone-800"
                }`}
              >
                {tab === "Custom" ? "Custom URL" : tab}
              </button>
            ))}
          </div>

          {activeTab !== "Custom" && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search images..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#141822] border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#9b7842]"
              />
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 scrollbar-thin">
          {activeTab === "Custom" ? (
            <div className="max-w-xl mx-auto py-8 space-y-5">
              <div className="p-4 rounded-2xl bg-[#0c0f17] border border-stone-800 space-y-3">
                <label className="block text-xs font-semibold text-stone-300">
                  Paste Custom Image URL (Cloudinary, Unsplash, CDN, etc.):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-4 py-2 bg-[#141822] border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#9b7842]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustom}
                    className="px-5 py-2 bg-[#9b7842] hover:bg-[#aa864e] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

              {customInput && (
                <div className="space-y-2">
                  <span className="text-xs text-stone-400">Live Preview:</span>
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-stone-800 bg-black">
                    <img
                      src={customInput}
                      alt="Custom visual"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {filtered.map((img) => {
                const isSelected = selectedUrl === img.url;
                return (
                  <div
                    key={img.id}
                    onClick={() => {
                      onSelectImage(img.url);
                      onClose();
                    }}
                    className={`group relative rounded-2xl overflow-hidden border transition-all cursor-pointer bg-[#0c0f17] ${
                      isSelected
                        ? "border-[#dec49a] ring-2 ring-[#dec49a]/40 shadow-lg"
                        : "border-stone-800 hover:border-stone-600 hover:scale-[1.01]"
                    }`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#dec49a] text-black flex items-center justify-center font-bold shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {img.theme && (
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black/70 text-[#dec49a] backdrop-blur-md border border-white/10">
                            {img.theme}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h5 className="text-xs font-semibold text-white group-hover:text-[#dec49a] transition-colors truncate">
                        {img.name}
                      </h5>
                      <span className="text-[10px] text-stone-400 capitalize block mt-0.5">
                        {img.category} Visual
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-[#0c0f17] flex items-center justify-between">
          <span className="text-xs text-stone-400 font-mono">
            {filtered.length} gallery visuals available
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
