"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { getProductsByCategory } from "@/lib/products";
import { ProductImage } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { useEnquiry } from "@/context/EnquiryContext";
import { useWishlist } from "@/context/WishlistContext";
import { FinishType } from "@/lib/types";
import { 
  ChevronRight, 
  Star, 
  Check, 
  Heart,
  ArrowRight
} from "lucide-react";
import { CartIcon } from "@/components/CartIcon";
import { clsx } from "clsx";
import { 
  getProductFinishGallery, 
  getProductPricing, 
  getProductFinishSku, 
  getProductFinishStock 
} from "@/lib/productUtils";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToEnquiry } = useEnquiry();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // 1. Derive gallery items directly from finishes and finishImages
  const galleryItems = React.useMemo(() => getProductFinishGallery(product), [product]);

  // Initial finish: first finish from finishes or gallery
  const initialFinish = (product.finishes && product.finishes[0]) || galleryItems[0]?.finish || ("Chrome" as FinishType);
  const [selectedFinish, setSelectedFinish] = useState<FinishType>(initialFinish);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const relatedProducts = getProductsByCategory(product.categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // Active finish image
  const activeImage = 
    (product.finishImages && product.finishImages[selectedFinish])
    || galleryItems.find((g) => g.finish === selectedFinish)?.image
    || galleryItems[0]?.image
    || "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760648/parkash-ceramics/faucets.jpg";

  // Per-finish pricing using finishPrices and finishOfferPrices
  const pricing = getProductPricing(product, selectedFinish);
  const activePrice = pricing.price;
  const activeMrp = pricing.mrp;
  const hasBothPrices = pricing.hasDiscount;
  const activeSku = getProductFinishSku(product, selectedFinish);
  const activeStock = getProductFinishStock(product, selectedFinish);

  const handleFinishSelect = (finish: FinishType) => {
    setSelectedFinish(finish);
  };

  const handleAdd = () => {
    const variantProduct: Product = {
      ...product,
      price: activePrice,
      originalPrice: activeMrp > activePrice ? activeMrp : undefined,
      sku: activeSku,
      images: [activeImage],
    };
    addToEnquiry(variantProduct, selectedFinish, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const getColorClass = (f: FinishType) => {
    switch (f) {
      case "Black Chrome":
        return "bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-950 border-neutral-600";
      case "Black Matt":
      case "Matte Black":
        return "bg-neutral-900 border-neutral-700";
      case "Gold Bright PVD":
        return "bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border-amber-400";
      case "Blush Gold PVD":
        return "bg-gradient-to-br from-rose-200 via-rose-300 to-amber-400 border-rose-300";
      case "Chrome":
        return "bg-gradient-to-br from-neutral-100 via-neutral-300 to-neutral-400 border-neutral-400";
      case "Brushed Gold":
        return "bg-[#c5a880] border-[#9b7842]";
      case "Rose Gold":
        return "bg-[#d49b80] border-[#b07d66]";
      case "Graphite Grey":
        return "bg-neutral-600 border-neutral-500";
      case "Brushed Nickel":
        return "bg-stone-400 border-stone-500";
      case "White Ceramic":
        return "bg-white border-neutral-300";
      case "Natural Cedar":
        return "bg-amber-800 border-amber-900";
      default:
        return "bg-neutral-300 border-neutral-400";
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#151a22] pb-24">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-[#ede8df] pt-28 pb-4">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <nav className="flex items-center gap-2 text-xs text-[#6b7280]">
            <Link href="/" className="hover:text-[#151a22] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/products" className="hover:text-[#151a22] transition-colors">Collections</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/categories/${product.categorySlug}`} className="hover:text-[#9b7842] transition-colors font-semibold">
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#151a22] font-semibold truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left: Multi-Angle Visual Gallery */}
          <div className="flex flex-col gap-4 sticky top-28">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#e8e2d9] bg-white shadow-lg">
              <ProductImage
                src={activeImage}
                alt={`${product.name} - ${selectedFinish}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnails mapped directly from finish images */}
            {galleryItems.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                {galleryItems.map((item, idx) => {
                  const isSelected = selectedFinish === item.finish;
                  return (
                    <button
                      key={item.finish || idx}
                      type="button"
                      onClick={() => handleFinishSelect(item.finish)}
                      className={clsx(
                        "relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-white shadow-xs cursor-pointer group text-left",
                        isSelected
                          ? "border-[#9b7842] ring-2 ring-[#9b7842]/30 scale-105 z-10"
                          : "border-[#e5e0d8] opacity-75 hover:opacity-100"
                      )}
                      title={`${item.finish} - ₹${(item.offerPrice || item.mrp || activePrice).toLocaleString("en-IN")}`}
                    >
                      <ProductImage
                        src={item.image}
                        alt={`${product.name} - ${item.finish}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="120px"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-1 pointer-events-none">
                        <p className="text-[9px] text-white font-medium truncate leading-tight">
                          {item.finish}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Specifications, Finishes & Actions */}
          <div className="flex flex-col">
            
            {/* Category, Range & SKU */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#9b7842] uppercase tracking-[0.2em] font-semibold">
                {product.range ? `${product.range} • ` : ""}{product.category} {product.subcategory && `• ${product.subcategory}`}
              </span>
              <span className="text-[#84786d] font-mono font-semibold">Code: {activeSku}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-[#151a22] tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Tagline */}
            <p className="text-sm text-[#6b7280] mt-2 mb-6">
              {product.tagline}
            </p>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 pb-6 border-b border-[#ede8df] text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold text-[#151a22]">{product.rating}</span>
              </div>
              <span className="text-neutral-300">|</span>
              <span className="text-[#6b7280]">{product.reviewsCount} verified architect specifications</span>
            </div>

            {/* Pricing Section */}
            <div className="py-6 border-b border-[#ede8df] flex items-start justify-between">
              <div>
                {hasBothPrices ? (
                  <>
                    {/* MRP row */}
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[10px] text-[#84786d] uppercase tracking-widest font-semibold">
                        MRP ({selectedFinish})
                      </span>
                      <span className="text-sm text-neutral-400 line-through font-medium">
                        ₹{activeMrp.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {/* Offer Price row */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] text-emerald-700 uppercase tracking-widest font-semibold">
                        Offer Price ({selectedFinish})
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3 mt-0.5">
                      <span className="text-3xl sm:text-4xl font-serif font-semibold text-[#151a22]">
                        ₹{activePrice.toLocaleString("en-IN")}
                      </span>
                      {pricing.discountPercent > 0 && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {pricing.discountPercent}% off
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] text-[#84786d] uppercase tracking-widest block mb-1 font-semibold">
                      {activeMrp > 0 ? `MRP (${selectedFinish})` : `Catalogue Price (${selectedFinish})`}
                    </span>
                    <span className="text-3xl sm:text-4xl font-serif font-semibold text-[#151a22]">
                      ₹{activePrice.toLocaleString("en-IN")}
                    </span>
                  </>
                )}
              </div>

              {activeStock > 0 ? (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full mt-2">
                  In Stock ({activeStock} units available)
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full mt-2">
                  Available on Order
                </span>
              )}
            </div>

            {/* Description */}
            <div className="py-6 border-b border-[#ede8df] text-xs sm:text-sm text-[#374151] leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Available Finishes with Color Dots */}
            <div className="py-6 border-b border-[#ede8df]">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1c1815] flex items-center gap-2 mb-3">
                <span>Architectural Finish:</span>
                <span className="text-[#8c7764] font-bold flex items-center gap-1.5">
                  <span className={clsx("w-3 h-3 rounded-full border inline-block shadow-2xs", getColorClass(selectedFinish))} />
                  {selectedFinish}
                </span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.finishes.map((finish) => (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => handleFinishSelect(finish)}
                    className={clsx(
                      "px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all shadow-xs cursor-pointer flex items-center gap-2",
                      selectedFinish === finish
                        ? "bg-[#1c1815] text-white border-[#1c1815] shadow-sm scale-105"
                        : "bg-white text-[#374151] border-[#e6ddd6] hover:bg-[#f7f5f0]"
                    )}
                  >
                    <span className={clsx("w-3.5 h-3.5 rounded-full border shadow-2xs shrink-0", getColorClass(finish))} />
                    <span>{finish}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Features Bullet List */}
            <div className="py-6 border-b border-[#ede8df]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1c1815] mb-4">
                Key Engineering Highlights
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#374151]">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9b7842] shrink-0 mt-2" />
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="py-8 space-y-3.5">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#ded5cb] rounded-2xl bg-[#f7f5f0] px-3 py-2 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-1 text-sm text-[#5f4f42] hover:text-[#1c1815] font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#1c1815]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-1 text-sm text-[#5f4f42] hover:text-[#1c1815] font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Quotation / Cart */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className={clsx(
                    "flex-1 py-3.5 px-5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer",
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-[#1c1815] hover:bg-[#9b7842] text-white hover:shadow-md"
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
                </button>

                {/* Wishlist Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={clsx(
                    "p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xs flex items-center justify-center",
                    isFavorited
                      ? "bg-rose-50 border-rose-300 text-rose-600"
                      : "bg-white border-[#ded5cb] text-[#4b5563] hover:text-rose-600 hover:bg-rose-50"
                  )}
                  title={isFavorited ? "Saved in Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={clsx("w-5 h-5", isFavorited ? "fill-rose-500 text-rose-500" : "")} />
                </button>
              </div>

              {/* Instant Checkout / Proceed to Cart */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  className="w-full bg-[#f7f5f0] hover:bg-[#ede8df] text-[#1c1815] border border-[#ded5cb] font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-2xs"
                >
                  <CartIcon className="w-4 h-4 text-[#9b7842]" />
                  <span>View Cart</span>
                </Link>

                <Link
                  href="/checkout"
                  onClick={() => addToEnquiry(product, selectedFinish, quantity)}
                  className="w-full bg-[#1c1815] hover:bg-[#9b7842] text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md group"
                >
                  <span>Instant Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Spec Table */}
            <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] space-y-3 shadow-sm">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#9b7842] mb-4">
                Technical Specifications Sheet
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col py-1.5 border-b border-[#ede8df]">
                  <span className="text-[#84786d] font-medium">Material Composition</span>
                  <span className="text-[#151a22] font-semibold">{product.material}</span>
                </div>
                <div className="flex flex-col py-1.5 border-b border-[#ede8df]">
                  <span className="text-[#84786d] font-medium">Warranty Coverage</span>
                  <span className="text-[#151a22] font-semibold">{product.warranty}</span>
                </div>
                {product.dimensions && (
                  <div className="flex flex-col py-1.5 border-b border-[#ede8df]">
                    <span className="text-[#84786d] font-medium">Dimensions</span>
                    <span className="text-[#151a22] font-semibold">{product.dimensions}</span>
                  </div>
                )}
                {product.flowRate && (
                  <div className="flex flex-col py-1.5 border-b border-[#ede8df]">
                    <span className="text-[#84786d] font-medium">Flow Rate</span>
                    <span className="text-[#151a22] font-semibold">{product.flowRate}</span>
                  </div>
                )}
                {Object.entries(product.specs || {})
                  .filter(([key, val]) => typeof val === "string" || typeof val === "number")
                  .map(([key, val]) => (
                    <div key={key} className="flex flex-col py-1.5 border-b border-[#ede8df]">
                      <span className="text-[#84786d] font-medium">{key}</span>
                      <span className="text-[#151a22] font-semibold">{String(val)}</span>
                    </div>
                  ))}
              </div>
            </div>

          </div>

        </div>

        {/* Related Products in this Category */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#ede8df]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-serif font-semibold text-[#151a22]">
                Complementary {product.category} Fixtures
              </h3>
              <Link
                href={`/categories/${product.categorySlug}`}
                className="text-xs uppercase font-semibold text-[#9b7842] hover:text-[#543e20] transition-colors"
              >
                View Category ({product.category})
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      <QuickViewModal />

    </div>
  );
}
