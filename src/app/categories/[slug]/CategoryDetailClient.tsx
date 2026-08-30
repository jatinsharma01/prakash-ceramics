"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { QuickViewModal } from "@/components/QuickViewModal";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/MotionWrappers";
import { 
  ChevronRight, 
  Sparkles
} from "lucide-react";

export default function CategoryDetailClient({ category }: { category: Category }) {
  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#151a22] pb-24">
      
      {/* Category Hero Banner */}
      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden border-b border-[#ede8df]">
        <div className="absolute inset-0 z-0">
          <ProductImage
            src={category.image}
            alt={`${category.name} by Parkash Ceramics`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-32 pb-16 text-center flex flex-col items-center">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-[#dec49a] mb-4 font-semibold"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/products" className="hover:text-white transition-colors">Categories</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold">{category.name}</span>
          </motion.nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-semibold text-white tracking-tight max-w-3xl mb-4"
          >
            {category.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm sm:text-base text-neutral-200 max-w-2xl font-normal leading-relaxed mb-6"
          >
            {category.description}
          </motion.p>

          {/* Tags */}
          {category.tags && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {category.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-xs font-semibold text-white backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-16">
        
        {/* Products in this Category */}
        <div className="mb-16">
          <MotionReveal direction="up" className="flex items-center justify-between mb-8 pb-4 border-b border-[#ede8df]">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-[#151a22]">
                {category.name} Collection
              </h2>
              <p className="text-xs text-[#6b7280] mt-1 font-medium">
                Precision engineered for residential villas, hotels, and luxury spaces.
              </p>
            </div>

            <span className="text-xs font-mono text-[#9b7842] font-semibold">
              {categoryProducts.length > 0 ? `${categoryProducts.length} Product Models` : "Custom Catalogue Models"}
            </span>
          </MotionReveal>

          {categoryProducts.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {categoryProducts.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <MotionReveal direction="scale" className="bg-white border border-[#dec49a] rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-md">
              <Sparkles className="w-10 h-10 text-[#9b7842] mx-auto mb-4" />
              <h3 className="text-xl font-serif font-semibold text-[#151a22] mb-2">
                Bespoke {category.name} Architectural Catalogue
              </h3>
              <p className="text-xs sm:text-sm text-[#6b7280] mb-6 leading-relaxed">
                We manufacture and supply custom {category.name.toLowerCase()} configurations tailored to your room blueprints and finish requirements. Contact our design concierge for complete CAD cut-sheets and volume pricing.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md"
                >
                  Request Custom Catalogue & Blueprint
                </Link>
                <Link
                  href="/contact"
                  className="bg-[#f7f5f0] hover:bg-[#ede8df] text-[#1c1815] border border-[#e5e0d8] text-xs font-semibold px-6 py-3.5 rounded-xl transition-colors"
                >
                  Book Showroom Consultation
                </Link>
              </div>
            </MotionReveal>
          )}
        </div>

        {/* Other Categories Explorer */}
        <div className="pt-16 border-t border-[#ede8df]">
          <MotionReveal direction="up" className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-serif font-semibold text-[#151a22]">
              Explore Other Bathroom Categories
            </h3>
            <Link
              href="/products"
              className="text-xs uppercase font-semibold text-[#9b7842] hover:text-[#543e20] transition-colors"
            >
              View All 16 Categories
            </Link>
          </MotionReveal>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 4).map((c) => (
              <StaggerItem key={c.id}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#e8e2d9] hover:border-[#9b7842] transition-all p-4 flex flex-col justify-end bg-white shadow-xs block"
                >
                  <ProductImage
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="relative z-10">
                    <span className="text-sm font-serif font-semibold text-white group-hover:text-[#dec49a] transition-colors block">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-neutral-300 font-medium">{c.itemCount} Designs</span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

      </div>

      <QuickViewModal />

    </div>
  );
}
