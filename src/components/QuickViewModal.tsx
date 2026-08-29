"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useEnquiry } from "@/context/EnquiryContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductImage } from "./ProductImage";
import { CartIcon } from "./CartIcon";
import { FinishType } from "@/lib/types";
import { 
  X, 
  Check, 
  Plus, 
  ExternalLink,
  Heart
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToEnquiry } = useEnquiry();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState<FinishType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = quickViewProduct ? isInWishlist(quickViewProduct.id) : false;
  const currentFinish = selectedFinish || (quickViewProduct?.finishes[0] || "Chrome");
  const activeImage = quickViewProduct ? (
    (selectedFinish && quickViewProduct.finishImages && quickViewProduct.finishImages[selectedFinish])
    || (quickViewProduct.finishImages && quickViewProduct.finishImages[currentFinish])
    || quickViewProduct.images[activeImageIndex] 
    || quickViewProduct.images[0]
  ) : "";

  const handleAddToCart = () => {
    if (!quickViewProduct) return;
    addToEnquiry(quickViewProduct, currentFinish, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
    }, 800);
  };

  const handleFinishChange = (finish: FinishType) => {
    setSelectedFinish(finish);
    if (quickViewProduct?.finishImages && quickViewProduct.finishImages[finish]) {
      const idx = quickViewProduct.images.indexOf(quickViewProduct.finishImages[finish]);
      if (idx !== -1) {
        setActiveImageIndex(idx);
      }
    }
  };

  const handleThumbnailClick = (idx: number) => {
    if (!quickViewProduct) return;
    setActiveImageIndex(idx);
    const imgUrl = quickViewProduct.images[idx];
    if (quickViewProduct.finishImages) {
      const matching = Object.entries(quickViewProduct.finishImages).find(([_, url]) => url === imgUrl);
      if (matching) {
        setSelectedFinish(matching[0] as FinishType);
      }
    }
  };

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl bg-white border border-[#dec49a] rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 hover:bg-white text-[#374151] hover:text-[#151a22] border border-[#e5e0d8] shadow-sm transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Left: Image Gallery */}
            <div className="w-full md:w-1/2 p-6 flex flex-col bg-[#fbf9f5] border-r border-[#ede8df]">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#e5e0d8] mb-4 bg-white shadow-sm">
                <ProductImage
                  src={activeImage}
                  alt={`${quickViewProduct.name} - ${currentFinish}`}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Thumbnails */}
              {quickViewProduct.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {quickViewProduct.images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleThumbnailClick(idx)}
                      className={clsx(
                        "relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all bg-white shadow-xs cursor-pointer",
                        activeImageIndex === idx
                          ? "border-[#9b7842] ring-2 ring-[#9b7842]/20 scale-105"
                          : "border-[#e5e0d8] opacity-70 hover:opacity-100"
                      )}
                    >
                      <ProductImage
                        src={img}
                        alt={`${quickViewProduct.name} angle ${idx + 1}`}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Actions */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between bg-white">
              <div>
                {/* Category & SKU */}
                <div className="flex items-center justify-between text-xs text-[#9b7842] mb-2 font-semibold">
                  <span className="uppercase tracking-widest">
                    {quickViewProduct.range ? `${quickViewProduct.range} • ` : ""}{quickViewProduct.category}
                  </span>
                  <span className="text-[#84786d] font-mono">Code: {quickViewProduct.sku}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#151a22] leading-tight">
                  {quickViewProduct.name}
                </h2>

                {/* Tagline */}
                <p className="text-xs text-[#6b7280] mt-1 mb-4">
                  {quickViewProduct.tagline}
                </p>

                {/* Pricing */}
                <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-[#ede8df] flex items-baseline justify-between mb-5">
                  <div>
                    <span className="text-[10px] text-[#84786d] uppercase tracking-wider block font-bold">MRP</span>
                    <span className="text-2xl font-bold text-[#151a22]">₹{quickViewProduct.price.toLocaleString("en-IN")}</span>
                  </div>
                  {quickViewProduct.originalPrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      ₹{quickViewProduct.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* Finishes Selector */}
                <div className="mb-5">
                  <label className="text-xs font-bold text-[#374151] block mb-2">
                    Select Finish: <span className="text-[#8c7764]">{currentFinish}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.finishes.map((finish) => (
                      <motion.button
                        key={finish}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleFinishChange(finish)}
                        className={clsx(
                          "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                          currentFinish === finish
                            ? "bg-[#1c1815] text-white border-[#1c1815] shadow-xs font-bold"
                            : "bg-[#fbf9f7] text-[#5f4f42] border-[#e6ddd6] hover:bg-[#F2ECE7]"
                        )}
                      >
                        {finish}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quick Specs */}
                <div className="space-y-2 text-xs text-[#4b5563] mb-6 bg-[#fbf9f7] p-3.5 rounded-xl border border-[#e6ddd6]">
                  <div className="flex items-center justify-between py-1 border-b border-[#e6ddd6]">
                    <span className="text-[#8c7764]">Material:</span>
                    <span className="text-[#1c1815] font-semibold">{quickViewProduct.material}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#e6ddd6]">
                    <span className="text-[#8c7764]">Warranty:</span>
                    <span className="text-[#1c1815] font-semibold">{quickViewProduct.warranty}</span>
                  </div>
                  {quickViewProduct.flowRate && (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[#8c7764]">Flow Rate:</span>
                      <span className="text-[#1c1815] font-semibold">{quickViewProduct.flowRate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#e6ddd6] space-y-3">
                <div className="flex items-center gap-2.5">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#ded5cb] rounded-xl bg-[#f7f5f0] px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 py-1 text-sm text-[#5f4f42] hover:text-[#1c1815] font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-[#1c1815]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2 py-1 text-sm text-[#5f4f42] hover:text-[#1c1815] font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Quotation / Cart */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleAddToCart}
                    className={clsx(
                      "flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer",
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#1c1815] hover:bg-[#9b7842] text-white"
                    )}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <CartIcon className="w-4 h-4" /> Add to Cart
                      </>
                    )}
                  </motion.button>

                  {/* Wishlist Toggle */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleWishlist(quickViewProduct)}
                    className={clsx(
                      "p-3 rounded-xl border transition-colors cursor-pointer shadow-2xs flex items-center justify-center",
                      isFavorited
                        ? "bg-rose-50 border-rose-300 text-rose-600"
                        : "bg-white border-[#ded5cb] text-[#4b5563] hover:text-rose-600 hover:bg-rose-50"
                    )}
                    title={isFavorited ? "Saved in Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className={clsx("w-4 h-4", isFavorited ? "fill-rose-500 text-rose-500" : "")} />
                  </motion.button>
                </div>

                <div className="text-center pt-2">
                  <Link
                    href={`/products/${quickViewProduct.slug}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="text-xs text-[#8c7764] hover:text-[#9b7842] inline-flex items-center gap-1.5 font-semibold group"
                  >
                    <span>View Full Technical Blueprint & CAD Specs</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
