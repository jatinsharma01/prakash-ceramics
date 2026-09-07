"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useEnquiry } from "@/context/EnquiryContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductImage } from "@/components/ProductImage";
import { CartIcon } from "@/components/CartIcon";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { 
  Trash2, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Heart,
  Plus,
  Minus
} from "lucide-react";
import { clsx } from "clsx";

export default function CartPage() {
  const { 
    enquiryList, 
    removeFromEnquiry, 
    updateQuantity, 
    clearEnquiry, 
    totalEstimatedValue, 
    totalItems
  } = useEnquiry();

  const { addToWishlist, isInWishlist } = useWishlist();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const discountAmount = promoApplied ? Math.round(totalEstimatedValue * 0.05) : 0;
  const finalTotal = totalEstimatedValue - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "PARKASH5" || promoCode.trim().toUpperCase() === "ARCHITECT") {
      setPromoApplied(true);
    }
  };

  const recommendedProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fbf9f7] text-[#151a22] pb-24">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-[#ede8df] pt-28 pb-4">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <nav className="flex items-center gap-2 text-xs text-[#6b7280]">
            <Link href="/" className="hover:text-[#151a22] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#151a22] font-semibold">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#ede8df]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#9b7842] font-bold block mb-1">
              Your Architectural Shortlist
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#151a22]">
              Shopping Cart ({totalItems})
            </h1>
          </div>

          {enquiryList.length > 0 && (
            <button
              type="button"
              onClick={clearEnquiry}
              className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
            >
              Clear Entire Cart
            </button>
          )}
        </div>

        {enquiryList.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-white border border-[#e5e0d8] shadow-sm flex items-center justify-center text-[#84786d] mx-auto mb-6">
              <CartIcon className="w-10 h-10 text-[#9b7842]" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#151a22] mb-2">
              Your Cart is Currently Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] mb-8 leading-relaxed">
              Explore our luxury faucets, hydrotherapy showers, bathtubs, and sanitaryware to start building your custom bathroom collection.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-md"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Main Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8">
            
            {/* Left: Products List (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              {enquiryList.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedFinish}`}
                  className="bg-white border border-[#ede8df] rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  {/* Thumbnail & Info */}
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#fbf9f5] border border-[#ede8df] shrink-0"
                    >
                      <ProductImage
                        src={
                          (item.product.finishImages && item.product.finishImages[item.selectedFinish]) ||
                          item.product.images[0]
                        }
                        alt={item.product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </Link>

                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-[#9b7842] tracking-wider block">
                        {item.product.range ? `${item.product.range} • ` : ""}{item.product.category}
                      </span>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="text-sm sm:text-base font-bold text-[#151a22] hover:text-[#9b7842] transition-colors line-clamp-1 block"
                      >
                        {item.product.name}
                      </Link>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#fbf9f5] text-[#5f4f42] font-semibold border border-[#ded5cb]">
                          {item.selectedFinish}
                        </span>
                        <span className="text-xs text-[#8c7764] font-mono">
                          Code: {item.product.sku}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Price & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#ede8df]">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-[#ded5cb] rounded-xl bg-[#fbf9f5] px-2 py-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.selectedFinish, item.quantity - 1)}
                        className="p-1.5 text-[#5f4f42] hover:text-[#151a22] font-bold cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#151a22]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.selectedFinish, item.quantity + 1)}
                        className="p-1.5 text-[#5f4f42] hover:text-[#151a22] font-bold cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Price */}
                    <div className="text-right min-w-24">
                      <span className="text-sm sm:text-base font-extrabold text-[#151a22] block">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-[#84786d]">
                        (₹{item.product.price.toLocaleString("en-IN")} each)
                      </span>
                    </div>

                    {/* Actions: Wishlist & Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => addToWishlist(item.product)}
                        className={clsx(
                          "p-2 rounded-xl border transition-colors cursor-pointer",
                          isInWishlist(item.product.id)
                            ? "bg-rose-50 border-rose-200 text-rose-600"
                            : "bg-white border-[#ded5cb] text-[#6b7280] hover:text-rose-600"
                        )}
                        title="Save to Wishlist"
                      >
                        <Heart className={clsx("w-4 h-4", isInWishlist(item.product.id) ? "fill-current" : "")} />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromEnquiry(item.product.id, item.selectedFinish)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove from Cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Guarantees Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="bg-white border border-[#ede8df] rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#9b7842]/10 text-[#9b7842]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#151a22]">10-15 Yr Warranty</h4>
                    <p className="text-[10px] text-[#84786d]">Authentic Swiss ceramic cartridges</p>
                  </div>
                </div>

                <div className="bg-white border border-[#ede8df] rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#9b7842]/10 text-[#9b7842]">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#151a22]">Free Insured Freight</h4>
                    <p className="text-[10px] text-[#84786d]">Pan-India door delivery included</p>
                  </div>
                </div>

                <div className="bg-white border border-[#ede8df] rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#9b7842]/10 text-[#9b7842]">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#151a22]">Technical Support</h4>
                    <p className="text-[10px] text-[#84786d]">CAD specs & plumber guidelines</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary (4 Cols) */}
            <div className="lg:col-span-4 bg-white border border-[#dec49a] rounded-3xl p-6 sm:p-8 shadow-sm h-fit space-y-6">
              <h3 className="text-lg font-serif font-bold text-[#151a22] border-b border-[#ede8df] pb-4">
                Order Summary
              </h3>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="text-xs font-bold text-[#374151] block">
                  Architect / Promo Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try PARKASH5"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    className="flex-1 bg-[#fbf9f5] border border-[#ded5cb] rounded-xl px-3 py-2 text-xs text-[#151a22] uppercase placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                  />
                  <button
                    type="submit"
                    disabled={promoApplied || !promoCode.trim()}
                    className="bg-[#1c1815] hover:bg-[#9b7842] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    {promoApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    ✓ 5% Architect Trade Discount applied!
                  </p>
                )}
              </form>

              {/* Cost Calculations */}
              <div className="space-y-3 text-xs border-t border-[#ede8df] pt-4">
                <div className="flex justify-between text-[#4b5563]">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-[#151a22]">₹{totalEstimatedValue.toLocaleString("en-IN")}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Trade Discount (5%)</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#4b5563]">
                  <span>Insured Shipping & Packaging</span>
                  <span className="text-emerald-600 font-semibold uppercase tracking-wider">FREE</span>
                </div>

                <div className="flex justify-between text-[#4b5563]">
                  <span>Applicable Taxes (GST 18%)</span>
                  <span className="text-[#84786d]">Included in MRP</span>
                </div>

                <div className="pt-4 border-t border-[#ede8df] flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-[#151a22] block">Total Amount</span>
                    <span className="text-[10px] text-[#84786d]">Inclusive of all taxes</span>
                  </div>
                  <span className="text-2xl font-serif font-extrabold text-[#151a22]">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Checkout Action */}
              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full bg-[#1c1815] hover:bg-[#9b7842] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/products"
                  className="text-xs text-[#84786d] hover:text-[#151a22] font-semibold underline underline-offset-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        )}

        {/* Recommended Products */}
        <div className="mt-20 pt-16 border-t border-[#ede8df]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#9b7842] font-bold block mb-1">
                Complementary Collections
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#151a22]">
                Architectural Recommendations
              </h3>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-wider text-[#9b7842] hover:text-[#5c4524] transition-colors"
            >
              View Full Catalogue
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommendedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
