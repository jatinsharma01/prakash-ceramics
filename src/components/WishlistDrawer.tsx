"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWishlist } from "@/context/WishlistContext";
import { useEnquiry } from "@/context/EnquiryContext";
import { ProductImage } from "./ProductImage";
import { 
  X, 
  Trash2, 
  Heart, 
  Plus,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export function WishlistDrawer() {
  const { 
    wishlist, 
    isWishlistOpen, 
    setIsWishlistOpen, 
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

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsWishlistOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
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
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-semibold text-[#151a22] uppercase tracking-wider">
                      Saved Wishlist
                    </h3>
                    <p className="text-xs text-[#84786d]">
                      {totalWishlistItems} {totalWishlistItems === 1 ? "fitting" : "fittings"} saved
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-2 rounded-xl text-[#6b7280] hover:text-[#151a22] hover:bg-[#f7f5f0] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {wishlist.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-16"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#f7f5f0] border border-[#e5e0d8] flex items-center justify-center text-[#84786d] mb-4 shadow-xs">
                      <Heart className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h4 className="text-base font-semibold text-[#151a22] mb-1">Your wishlist is empty</h4>
                    <p className="text-xs text-[#6b7280] max-w-xs mb-6">
                      Save your favorite faucets, showers, and bathtubs by clicking the heart icon on any product.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsWishlistOpen(false)}
                      className="bg-[#1c1815] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-[#9b7842] transition-colors shadow-md cursor-pointer"
                    >
                      Explore Bathroom Fixtures
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-[#ede8df] text-xs text-[#6b7280] font-medium">
                      <span>Saved Architectural Items ({totalWishlistItems})</span>
                      <button
                        type="button"
                        onClick={clearWishlist}
                        className="text-red-600 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence initial={false}>
                        {wishlist.map((prod) => (
                          <motion.div
                            key={prod.id}
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex gap-3 bg-[#faf8f5] border border-[#e8e2d9] p-3.5 rounded-2xl relative group shadow-2xs overflow-hidden"
                          >
                            {/* Product Thumbnail */}
                            <Link
                              href={`/products/${prod.slug}`}
                              onClick={() => setIsWishlistOpen(false)}
                              className="relative w-18 h-18 rounded-xl overflow-hidden bg-white shrink-0 border border-[#e6ddd6]"
                            >
                              <ProductImage
                                src={prod.images[0]}
                                alt={prod.name}
                                fill
                                className="object-contain p-1.5"
                              />
                            </Link>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-[#9b7842] tracking-wider block truncate">
                                  {prod.range ? `${prod.range} • ` : ""}{prod.category}
                                </span>
                                <Link
                                  href={`/products/${prod.slug}`}
                                  onClick={() => setIsWishlistOpen(false)}
                                  className="text-xs font-bold text-[#151a22] hover:text-[#9b7842] transition-colors truncate block"
                                >
                                  {prod.name}
                                </Link>
                                <span className="text-[10px] text-[#6b7280] font-mono">
                                  Code: {prod.sku}
                                </span>
                              </div>

                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#ede8df]/80">
                                <span className="text-xs font-bold text-[#151a22]">
                                  ₹{prod.price.toLocaleString("en-IN")}
                                </span>

                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => {
                                    addToEnquiry(prod, prod.finishes[0], 1);
                                    setIsWishlistOpen(false);
                                  }}
                                  className="text-[10px] font-bold text-[#9b7842] hover:text-[#725424] bg-white border border-[#ded5cb] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs hover:bg-[#F2ECE7] transition-all cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>+ Quote</span>
                                </motion.button>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => removeFromWishlist(prod.id)}
                              className="absolute top-2.5 right-2.5 p-1 rounded-lg text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Remove from wishlist"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer */}
              {wishlist.length > 0 && (
                <div className="p-5 sm:p-6 bg-[#fcfbf9] border-t border-[#ede8df] space-y-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#6b7280]">Total Wishlist Value</span>
                    <span className="text-base font-extrabold text-[#151a22]">
                      ₹{wishlist.reduce((acc, p) => acc + p.price, 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={handleAddAllToCart}
                      className="w-full bg-[#1c1815] hover:bg-[#9b7842] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add All to Cart</span>
                    </motion.button>

                    <Link
                      href="/wishlist"
                      onClick={() => setIsWishlistOpen(false)}
                      className="w-full bg-[#f7f5f0] hover:bg-[#ede8df] text-[#1c1815] border border-[#ded5cb] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider text-center transition-colors shadow-2xs flex items-center justify-center gap-1 group"
                    >
                      <span>View Wishlist</span>
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
