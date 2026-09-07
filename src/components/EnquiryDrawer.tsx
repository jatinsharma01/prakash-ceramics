"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useEnquiry } from "@/context/EnquiryContext";
import { ProductImage } from "./ProductImage";
import { CartIcon } from "./CartIcon";
import { 
  X, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Minus, 
  Truck
} from "lucide-react";
import Link from "next/link";

export function EnquiryDrawer() {
  const { 
    enquiryList, 
    isDrawerOpen, 
    setIsDrawerOpen, 
    removeFromEnquiry, 
    updateQuantity, 
    clearEnquiry, 
    totalEstimatedValue,
    totalItems
  } = useEnquiry();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white border-l border-[#dec49a] shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-[#ede8df] flex items-center justify-between bg-[#fcfbf9]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#9b7842]/10 text-[#9b7842]">
                    <CartIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#151a22] uppercase tracking-wider">
                      Shopping Cart
                    </h3>
                    <p className="text-xs text-[#84786d]">
                      {totalItems} {totalItems === 1 ? "fitting" : "fittings"} selected
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-[#6b7280] hover:text-[#151a22] hover:bg-[#f7f5f0] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Drawer Body: Products List */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {enquiryList.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-16"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#f7f5f0] border border-[#e5e0d8] flex items-center justify-center text-[#84786d] mb-4 shadow-xs">
                      <CartIcon className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h4 className="text-base font-bold text-[#151a22] mb-1">Your cart is empty</h4>
                    <p className="text-xs text-[#6b7280] max-w-xs mb-6 leading-relaxed">
                      Browse our bathroom collections and click "+ Cart" on any product to add fixtures to your shortlist.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-colors shadow-md cursor-pointer"
                    >
                      Explore Collections
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-[#ede8df] text-xs text-[#6b7280] font-medium">
                      <span>Selected Fittings ({totalItems})</span>
                      <button
                        type="button"
                        onClick={clearEnquiry}
                        className="text-red-600 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                      <AnimatePresence initial={false}>
                        {enquiryList.map((item) => (
                          <motion.div
                            key={`${item.product.id}-${item.selectedFinish}`}
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex gap-3 bg-[#faf8f5] border border-[#e8e2d9] p-3.5 rounded-2xl relative group shadow-2xs overflow-hidden"
                          >
                            {/* Product Thumbnail */}
                            <Link
                              href={`/products/${item.product.slug}`}
                              onClick={() => setIsDrawerOpen(false)}
                              className="relative w-18 h-18 rounded-xl overflow-hidden bg-white shrink-0 border border-[#e6ddd6]"
                            >
                              <ProductImage
                                src={
                                  (item.product.finishImages && item.product.finishImages[item.selectedFinish]) ||
                                  item.product.images[0]
                                }
                                alt={item.product.name}
                                fill
                                className="object-contain p-1.5"
                              />
                            </Link>

                            {/* Info */}
                            <div className="flex-1 min-w-0 pr-6 flex flex-col justify-between">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-[#9b7842] tracking-wider block truncate">
                                  {item.product.range ? `${item.product.range} • ` : ""}{item.product.category}
                                </span>
                                <Link
                                  href={`/products/${item.product.slug}`}
                                  onClick={() => setIsDrawerOpen(false)}
                                  className="text-xs font-bold text-[#1c1815] hover:text-[#9b7842] transition-colors truncate block"
                                >
                                  {item.product.name}
                                </Link>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#5f4f42] font-semibold border border-[#ded5cb]">
                                    {item.selectedFinish}
                                  </span>
                                  <span className="text-[10px] text-[#8c7764] font-mono">
                                    {item.product.sku}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#ede8df]">
                                <span className="text-xs font-extrabold text-[#151a22]">
                                  ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                                </span>

                                {/* Quantity control */}
                                <div className="flex items-center border border-[#ded5cb] rounded-xl bg-white px-1.5 py-0.5 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.product.id, item.selectedFinish, item.quantity - 1)}
                                    className="p-1 text-[#5f4f42] hover:text-[#1c1815] font-bold cursor-pointer"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center text-[11px] font-bold text-[#1c1815]">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.product.id, item.selectedFinish, item.quantity + 1)}
                                    className="p-1 text-[#5f4f42] hover:text-[#1c1815] font-bold cursor-pointer"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Remove */}
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => removeFromEnquiry(item.product.id, item.selectedFinish)}
                              className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Dispatch Assurance info */}
                    <div className="bg-[#fcfbf9] border border-[#ede8df] p-3.5 rounded-2xl flex items-center gap-2.5 text-xs text-[#6b7280]">
                      <Truck className="w-4 h-4 text-[#9b7842] shrink-0" />
                      <span className="text-[11px]">Free insured dispatch across India for all luxury fixtures.</span>
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer: View Cart & Checkout */}
              {enquiryList.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-[#ede8df] bg-white space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#84786d] block font-bold">
                        Subtotal ({totalItems} items)
                      </span>
                      <span className="text-[11px] text-neutral-400">*Free insured delivery included</span>
                    </div>
                    <span className="text-2xl font-serif font-extrabold text-[#151a22]">
                      ₹{totalEstimatedValue.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Link
                      href="/cart"
                      onClick={() => setIsDrawerOpen(false)}
                      className="w-full bg-[#f7f5f0] hover:bg-[#ede8df] text-[#1c1815] border border-[#ded5cb] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider text-center transition-colors shadow-2xs flex items-center justify-center"
                    >
                      View Cart
                    </Link>

                    <Link
                      href="/checkout"
                      onClick={() => setIsDrawerOpen(false)}
                      className="w-full bg-[#1c1815] hover:bg-[#9b7842] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider text-center transition-colors shadow-sm flex items-center justify-center gap-1.5 group"
                    >
                      <span>Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
