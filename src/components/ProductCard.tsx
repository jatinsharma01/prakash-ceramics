"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";
import { useEnquiry } from "@/context/EnquiryContext";
import { useWishlist } from "@/context/WishlistContext";
import { Eye, Check, Star, Heart } from "lucide-react";
import { CartIcon } from "./CartIcon";
import { clsx } from "clsx";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToEnquiry, setQuickViewProduct } = useEnquiry();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isFavorited = isInWishlist(product.id);

  // Smoothly cycle images while hovering over the card
  useEffect(() => {
    if (!isHovered || product.images.length <= 1) {
      setCurrentImageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isHovered, product.images.length]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToEnquiry(product, product.finishes[0], 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const activeImage = product.images[currentImageIndex] || product.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      whileHover={{ y: -6, transition: { duration: 0.28, ease: "easeOut" } }}
      className="group relative flex flex-col aspect-[2/3] min-h-[480px] sm:min-h-[520px] w-full bg-white border border-[#e8e2d9] hover:border-[#c5a880] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#9b7842]/15 transition-colors duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Hero Product Showcase Canvas (Smooth Crossfading Images on Hover) */}
      <Link href={`/products/${product.slug}`} className="absolute inset-0 block w-full h-full">
        {product.images.map((img, idx) => {
          const isCurrent = activeImage === img;
          return (
            <div
              key={img}
              className={clsx(
                "absolute inset-0 w-full h-full transition-all duration-700 ease-out",
                isCurrent
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-95 z-0 pointer-events-none"
              )}
            >
              <ProductImage
                src={img}
                alt={`${product.name} - view ${idx + 1}`}
                fill
                className="object-contain w-full h-full p-3 pt-6 pb-28 sm:p-4 sm:pt-8 sm:pb-30 group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          );
        })}
      </Link>

      {/* 2. Top Header Bar: Badges & Quick Actions */}
      <div className="relative z-20 flex items-start justify-between p-3 pointer-events-none">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {product.range && (
            <span className="bg-[#9b7842] text-white text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs border border-white/20">
              {product.range}
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#1c1815] text-[#F2ECE7] text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs border border-white/10">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#F2ECE7] text-[#1c1815] text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs border border-[#ded5cb]">
              New
            </span>
          )}
        </div>

        {/* Action Buttons (Wishlist & Quick View) */}
        <div className="flex items-center gap-1 pointer-events-auto">
          {/* Wishlist Heart */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleWishlistToggle}
            className={clsx(
              "p-1.5 transition-opacity duration-300 cursor-pointer",
              isFavorited
                ? "text-rose-600 opacity-100"
                : "text-[#1c1815] hover:text-rose-600 opacity-0 group-hover:opacity-100"
            )}
            title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
            aria-label="Wishlist"
          >
            <Heart className={clsx("w-4 h-4", isFavorited ? "fill-rose-500 text-rose-500" : "")} />
          </motion.button>

          {/* Quick View Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleQuickView}
            className="p-1.5 text-[#1c1815] hover:text-[#9b7842] opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            title="Quick View Product"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* 3. Floating Luxury Frosted Glass Info Dock pinned to bottom */}
      <motion.div 
        animate={{ y: isHovered ? -2 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3 sm:bottom-3 z-20 p-3 sm:p-3.5 bg-white/90 group-hover:bg-white/95 backdrop-blur-xl border border-white/80 group-hover:border-[#c5a880]/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] group-hover:shadow-[0_12px_36px_rgb(155,120,66,0.12)] transition-all duration-500 flex flex-col"
      >
        {/* Category / Range & Star Rating */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[10px] font-bold text-[#9b7842] uppercase tracking-wider truncate">
            {product.range ? `${product.range} • ${product.category}` : product.category}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold shrink-0">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[#1f2937]">{product.rating}</span>
          </div>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="group-hover:text-[#9b7842] transition-colors block">
          <h3 className="text-xs sm:text-sm font-bold text-[#151a22] leading-snug line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* SKU / Tagline */}
        <p className="text-[10px] sm:text-[11px] text-[#6b7280] line-clamp-1 mt-0.5 font-medium">
          {product.sku ? `Code: ${product.sku}` : product.tagline}
        </p>

        {/* Pricing & Cart Icon Button */}
        <div className="mt-2.5 pt-2 flex items-center justify-between border-t border-[#f0ece4]">
          <div className="flex flex-col">
            <span className="text-[8px] text-[#84786d] uppercase tracking-wider font-bold">Catalogue MRP</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs sm:text-sm font-extrabold text-[#151a22]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-neutral-400 line-through font-medium">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          {/* Cart Icon Button with spring animation */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
            onClick={handleAdd}
            className={clsx(
              "p-1.5 transition-colors flex items-center justify-center cursor-pointer",
              isAdded
                ? "text-emerald-600"
                : "text-[#151a22] hover:text-[#9b7842]"
            )}
            title="Add to Cart"
            aria-label="Add to Cart"
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </motion.div>
              ) : (
                <motion.div
                  key="bag"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                >
                  <CartIcon className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

      </motion.div>
    </motion.div>
  );
}
