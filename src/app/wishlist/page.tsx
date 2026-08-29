"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useEnquiry } from "@/context/EnquiryContext";
import { ProductCard } from "@/components/ProductCard";
import { CartIcon } from "@/components/CartIcon";
import { 
  Heart, 
  Trash2, 
  Plus, 
  ArrowRight, 
  ChevronRight 
} from "lucide-react";

export default function WishlistPage() {
  const { 
    wishlist, 
    removeFromWishlist, 
    clearWishlist, 
    totalWishlistItems 
  } = useWishlist();

  const { addToEnquiry } = useEnquiry();

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => {
      addToEnquiry(product, product.finishes[0], 1);
    });
  };

  const totalWishlistValue = wishlist.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="min-h-screen bg-[#fbf9f7] text-[#151a22] pb-24">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-[#ede8df] pt-28 pb-4">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <nav className="flex items-center gap-2 text-xs text-[#6b7280]">
            <Link href="/" className="hover:text-[#151a22] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#151a22] font-semibold">Saved Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#ede8df]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#9b7842] font-bold block mb-1">
              Your Curated Favourites
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#151a22]">
              Saved Wishlist ({totalWishlistItems})
            </h1>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add All to Cart</span>
              </button>

              <button
                type="button"
                onClick={clearWishlist}
                className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {wishlist.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-white border border-[#e5e0d8] shadow-sm flex items-center justify-center text-[#84786d] mx-auto mb-6">
              <Heart className="w-10 h-10 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#151a22] mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mb-8 leading-relaxed">
              Click the heart icon on any faucet, bathtub, shower, or sanitaryware product to save it here for later.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-md"
            >
              <span>Browse Luxury Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="pt-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlist.map((product) => (
                <div key={product.id} className="relative group/card">
                  <ProductCard product={product} />

                  {/* Remove Button Overlay */}
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-12 z-30 p-2 rounded-full bg-white/90 hover:bg-white text-neutral-400 hover:text-red-600 shadow-md border border-[#ded5cb] transition-all hover:scale-110 cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom Action Card */}
            <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase font-bold text-[#9b7842] tracking-wider block mb-1">
                  Total Wishlist Estimated Value
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#151a22]">
                  ₹{totalWishlistValue.toLocaleString("en-IN")}
                </span>
                <p className="text-[11px] text-[#6b7280] mt-0.5">
                  Transfer saved fittings directly to your cart to proceed with booking or order quotation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddAllToCart}
                  className="flex-1 sm:flex-none bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CartIcon className="w-4 h-4" />
                  <span>Add All to Cart</span>
                </button>

                <Link
                  href="/cart"
                  className="flex-1 sm:flex-none bg-[#f7f5f0] hover:bg-[#ede8df] text-[#1c1815] border border-[#ded5cb] text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 group"
                >
                  <span>Go to Cart</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
