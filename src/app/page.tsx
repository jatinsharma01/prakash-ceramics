"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ProductImage } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { 
  MotionReveal, 
  StaggerContainer, 
  StaggerItem, 
  PulseRadar 
} from "@/components/MotionWrappers";
import { CATEGORIES } from "@/lib/categories";
import { PRODUCTS, getFeaturedProducts } from "@/lib/products";
import { BATHROOM_PACKAGES, BathroomPackage } from "@/lib/packages";
import { useEnquiry } from "@/context/EnquiryContext";
import { CartIcon } from "@/components/CartIcon";
import { FinishType } from "@/lib/types";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Compass,
  Award,
  Eye,
  CheckCircle2,
  Layers,
  FileText,
  ShieldCheck,
  Droplets,
  ArrowUpRight,
  Send,
  Star
} from "lucide-react";
import { clsx } from "clsx";

const HERO_CONTENT = {
  badge: "The Architecture of Water",
  headline: "Sculptural Luxury For Discerning Bathrooms",
  subtitle: "Parkash Ceramics crafts architectural faucets, hydro-sensory rainfall showers, seamless bathtubs, and wellness sanctuaries engineered to perfection.",
  primaryCta: "Explore 2026 Collection",
  primaryHref: "/products",
  secondaryCta: "Consult Architect & Tour",
  secondaryHref: "/contact",
  videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-water-falling-from-a-luxury-shower-head-41617-large.mp4",
  posterImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2400"
};

export default function HomePage() {
  const { addToEnquiry, setIsDrawerOpen } = useEnquiry();
  const featuredProducts = getFeaturedProducts();
  const [hoveredCategorySlug, setHoveredCategorySlug] = useState<string>("faucets");
  const [selectedPackageId, setSelectedPackageId] = useState<string>("pkg-gold-penthouse");
  const [packageAddedId, setPackageAddedId] = useState<string | null>(null);
  const [activeLookbookHotspot, setActiveLookbookHotspot] = useState<number | null>(null);

  const selectedPackage = BATHROOM_PACKAGES.find((p) => p.id === selectedPackageId) || BATHROOM_PACKAGES[0];

  const handleAddPackageToCart = (pkg: BathroomPackage) => {
    pkg.items.forEach((item) => {
      if (item.productId) {
        const found = PRODUCTS.find((p) => p.id === item.productId);
        if (found) {
          addToEnquiry(found, item.finish as FinishType, 1);
          return;
        }
      }
      const virtualProduct = PRODUCTS[0];
      if (virtualProduct) {
        addToEnquiry({
          ...virtualProduct,
          id: `pkg-item-${item.sku}`,
          name: item.name,
          sku: item.sku,
          price: item.price,
          category: item.role,
          images: [item.image]
        }, item.finish as FinishType, 1);
      }
    });

    setPackageAddedId(pkg.id);
    setTimeout(() => {
      setPackageAddedId(null);
      setIsDrawerOpen(true);
    }, 800);
  };

  // Showroom Booking Form State
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "Residential Villa",
    preferredDate: "",
    message: ""
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setBookingData({
        name: "",
        phone: "",
        email: "",
        projectType: "Residential Villa",
        preferredDate: "",
        message: ""
      });
    }, 4500);
  };

  // Horizontal category scroll container ref
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Scroll categories horizontally
  const handleCategoryScroll = (direction: "left" | "right") => {
    if (!categoryScrollRef.current) return;
    const scrollAmount = 480;
    categoryScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  // Lookbook hotspots data
  const lookbookHotspots = [
    {
      id: 1,
      top: "42%",
      left: "20%",
      title: "Single Lever Tall Boy",
      category: "Faucets • Black Chrome",
      price: "₹10,300",
      slug: "single-lever-tall-boy",
      image: "/images/faucets/single-lever-tall-boy/0057105_single-lever-tall-boy-black-chrome_960.jpeg"
    },
    {
      id: 2,
      top: "22%",
      left: "45%",
      title: "Celeste 400mm Rain Shower",
      category: "Showers • Air-Injection",
      price: "₹18,999",
      slug: "celeste-ultra-slim-rain-shower",
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      top: "65%",
      left: "60%",
      title: "Opulence Freestanding Soaking Bathtub",
      category: "Bath Tubs • Seamless Acrylic",
      price: "₹78,999",
      slug: "opulence-freestanding-soaking-bathtub",
      image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-[#faf8f5] to-white text-[#151a22]">

      {/* 1. HERO LUXURY BATH VIDEO & IMAGE SECTION WITH STAGGERED ENTRANCE */}
      <section className="relative min-h-screen h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Ambient Video Background with Image Fallback */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={HERO_CONTENT.posterImage}
            className="w-full h-full object-cover object-center scale-105"
          >
            <source src={HERO_CONTENT.videoUrl} type="video/mp4" />
          </video>
          {/* Crisp solid dark tint */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-32 sm:pt-36 pb-20 text-center flex flex-col items-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md mb-5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dec49a]" />
            <span className="text-xs uppercase tracking-[0.25em] text-white font-semibold">
              {HERO_CONTENT.badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-white tracking-tight leading-[1.12] max-w-4xl mb-5 drop-shadow-sm"
          >
            {HERO_CONTENT.headline}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base lg:text-lg text-neutral-100 max-w-2xl font-normal leading-relaxed mb-8 drop-shadow-xs"
          >
            {HERO_CONTENT.subtitle}
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
              <Link
                href={HERO_CONTENT.primaryHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] hover:from-white hover:via-[#f7f2ee] hover:to-[#ded5cb] text-[#1c1815] border border-[#ded5cb] font-semibold text-xs uppercase tracking-[0.2em] px-8 py-3.5 rounded-full shadow-lg transition-all"
              >
                <span>{HERO_CONTENT.primaryCta}</span>
                <ArrowRight className="w-4 h-4 text-[#8c7764]" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
              <Link
                href={HERO_CONTENT.secondaryHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md font-semibold text-xs uppercase tracking-[0.15em] px-7 py-3.5 rounded-full shadow-md transition-all"
              >
                <span>{HERO_CONTENT.secondaryCta}</span>
              </Link>
            </motion.div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-75 hover:opacity-100 transition-opacity"
        >
          <span className="text-[9px] uppercase tracking-widest text-white font-mono font-semibold">Scroll</span>
          <div className="w-3.5 h-6 rounded-full border border-white/50 flex items-start justify-center p-0.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1.5 rounded-full bg-[#dec49a]"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. ALL 16 CATEGORIES IN ONE CONTINUOUS HORIZONTAL EXPANDING LINE WITH SCROLL CONTROLS */}
      <section className="py-20 bg-gradient-to-b from-white via-[#faf8f6] to-white border-b border-[#ede8df] relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">

          {/* Section Header */}
          <MotionReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#9b7842] font-semibold mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>All 16 Collections</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#151a22] tracking-tight">
                Architectural Categories
              </h2>
            </div>

            {/* Scroll navigation controls */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
                <span>16 Signature Lines</span>
                <span className="w-1 h-1 rounded-full bg-[#d8d2c6]" />
                <Link
                  href="/products"
                  className="text-xs font-semibold uppercase tracking-wider text-[#9b7842] hover:text-[#6a5028] transition-colors"
                >
                  View All Products
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={() => handleCategoryScroll("left")}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] hover:from-white hover:to-[#ded5cb] text-[#1c1815] border border-[#ded5cb] flex items-center justify-center shadow-sm cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={() => handleCategoryScroll("right")}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] hover:from-white hover:to-[#ded5cb] text-[#1c1815] border border-[#ded5cb] flex items-center justify-center shadow-sm cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </MotionReveal>

          {/* HORIZONTAL CONTINUOUS LINE CONTAINER */}
          <div
            ref={categoryScrollRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {CATEGORIES.map((cat) => {
              const isHovered = hoveredCategorySlug === cat.slug;
              return (
                <motion.div
                  key={cat.id}
                  layout
                  onMouseEnter={() => setHoveredCategorySlug(cat.slug)}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={clsx(
                    "group relative rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between shrink-0 h-[480px] border shadow-md hover:shadow-2xl transition-all duration-500",
                    isHovered
                      ? "w-[560px] min-w-[560px] border-[#dec49a]/60 shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                      : "w-[280px] min-w-[280px] border-white/20 hover:border-[#dec49a]/40"
                  )}
                >
                  {/* Full Card Background Image with Gradient Overlay */}
                  <div className="absolute inset-0 z-0">
                    <ProductImage
                      src={cat.image}
                      alt={`${cat.name} by Parkash Ceramics`}
                      fill
                      className={clsx(
                        "object-cover transition-transform duration-700",
                        isHovered ? "scale-105" : "scale-100 group-hover:scale-105"
                      )}
                      sizes="600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 group-hover:from-black/95 group-hover:via-black/50 transition-all duration-500" />
                  </div>

                  {/* Top Bar: Count Pill & Quick Link */}
                  <div className="relative z-10 p-5 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 border border-white/20 text-[10px] font-mono font-semibold uppercase tracking-wider shadow-sm">
                      {cat.itemCount} Designs
                    </span>

                    <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className={clsx(
                          "w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-black border border-white/30 backdrop-blur-md flex items-center justify-center shadow-md transition-all",
                          isHovered ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                        )}
                        aria-label={`View ${cat.name}`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  </div>

                  {/* Bottom Text Content on top of the image */}
                  {isHovered ? (
                    /* EXPANDED HOVERED CARD CONTENT */
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                    >
                      <div>
                        <span className="text-xs uppercase tracking-[0.25em] text-[#dec49a] font-semibold block mb-1">
                          Collection Focus
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-white mb-2 leading-tight drop-shadow-sm">
                          {cat.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-200 line-clamp-3 mb-4 font-normal leading-relaxed">
                          {cat.description}
                        </p>

                        {/* Tag Chips */}
                        {cat.tags && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {cat.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[11px] px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-md border border-white/25 text-white/95 font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-fit">
                        <Link
                          href={`/categories/${cat.slug}`}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] hover:from-white hover:to-[#ded5cb] text-[#1c1815] font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-lg transition-all"
                        >
                          <span>Explore {cat.name} Series</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    </motion.div>
                  ) : (
                    /* COLLAPSED CARD CONTENT */
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="relative z-10 p-5 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                    >
                      <div>
                        <h3 className="text-xl font-serif font-semibold text-white leading-tight group-hover:text-[#dec49a] transition-colors drop-shadow-sm">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-neutral-300 font-normal line-clamp-2 mt-1.5 leading-relaxed">
                          {cat.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#dec49a] pt-3">
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. BEST SELLERS SHOWCASE */}
      <section className="py-24 bg-gradient-to-b from-white via-[#faf8f6] to-white relative">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">

          <MotionReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#9b7842] font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#9b7842]" />
                <span>Best Sellers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#1c1815] tracking-tight">
                Best Selling Collections
              </h2>
              <p className="text-xs sm:text-sm text-[#6b7280] mt-2 max-w-xl">
                Our most requested architectural faucets, hydro-sensory rainfall showers, and freestanding bathtubs specified by top architects and luxury homeowners.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#8c7764] hover:text-[#1c1815] transition-colors group"
            >
              <span>Explore All Best Sellers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </MotionReveal>

          {/* Product Grid (4 Columns) with Staggered Entrance */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>

        </div>
      </section>

      {/* LUXURY BATHROOM EDITORIAL BANNER: HYDRO-WELLNESS SANCTUARY */}
      <section className="relative w-full min-h-[500px] sm:min-h-[580px] overflow-hidden flex items-center border-y border-[#e6ddd6] my-0">
        <div className="absolute inset-0 z-0">
          <ProductImage
            src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2400"
            alt="Parkash Ceramics Luxury Hydrotherapy Master Bathroom"
            fill
            className="object-cover object-center"
            containerClassName="w-full h-full"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content on Image */}
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20 flex justify-start">
          <MotionReveal direction="right" className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#F2ECE7] text-xs font-semibold uppercase tracking-[0.2em] mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#F2ECE7]" />
              <span>Hydro-Sensory Wellness</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-white tracking-tight leading-[1.2] mb-4 drop-shadow-md">
              The Architecture of Pure Water
            </h2>

            <p className="text-sm sm:text-base text-neutral-200 font-light leading-relaxed mb-8 max-w-xl drop-shadow-sm">
              Air-infused overhead rainfalls and multi-flow body jets engineered to elevate daily bathing into a transformative spa ritual.
            </p>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-fit">
              <Link
                href="/categories/showers"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] hover:from-white hover:to-[#ded5cb] text-[#1c1815] border border-[#ded5cb] font-semibold text-xs uppercase tracking-[0.15em] px-8 py-4 rounded-full shadow-lg transition-all"
              >
                <span>Explore Shower Systems</span>
                <ArrowRight className="w-4 h-4 text-[#8c7764]" />
              </Link>
            </motion.div>
          </MotionReveal>
        </div>
      </section>

      {/* 4. INTERACTIVE LOOKBOOK & HOTSPOT SHOWCASE */}
      <section id="lookbook" className="py-24 bg-gradient-to-b from-white via-[#faf8f6] to-white border-b border-[#ede8df] relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">

          <MotionReveal direction="up" className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#dec49a] text-[#6a5028] text-xs font-semibold uppercase tracking-widest mb-3 shadow-xs">
              <Eye className="w-3.5 h-3.5 text-[#9b7842]" />
              <span>Architectural Inspiration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#151a22] tracking-tight mb-4">
              The Penthouse Villa Lookbook
            </h2>
            <p className="text-sm sm:text-base text-[#6b7280]">
              Click on the glowing hotspots to reveal individual Parkash Ceramics fittings integrated into this marble master bathroom.
            </p>
          </MotionReveal>

          {/* Interactive Lookbook Canvas */}
          <MotionReveal direction="scale" className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-[#d8d2c6] shadow-lg bg-black">
            <ProductImage
              src="https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=2400"
              alt="Parkash Ceramics Luxury Master Bathroom Suite Lookbook"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* Hotspot Pins */}
            {lookbookHotspots.map((spot) => (
              <div
                key={spot.id}
                style={{ top: spot.top, left: spot.left }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveLookbookHotspot(activeLookbookHotspot === spot.id ? null : spot.id)
                  }
                  className="relative group flex items-center justify-center cursor-pointer"
                  aria-label={`Inspect ${spot.title}`}
                >
                  <PulseRadar />
                  <motion.span
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-7 h-7 rounded-full bg-[#9b7842] text-white font-semibold text-xs flex items-center justify-center shadow-lg border-2 border-white"
                  >
                    +
                  </motion.span>
                </button>

                {/* Hotspot Popover Tooltip with AnimatePresence */}
                <AnimatePresence>
                  {activeLookbookHotspot === spot.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-10 left-1/2 -translate-x-1/2 w-64 bg-white border border-[#dec49a] rounded-2xl p-3.5 shadow-2xl z-30 text-left"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-[#f5f2eb]">
                        <ProductImage
                          src={spot.image}
                          alt={spot.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#9b7842] font-semibold">
                        {spot.category}
                      </span>
                      <h4 className="text-xs font-semibold text-[#151a22] mt-0.5 line-clamp-1">
                        {spot.title}
                      </h4>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#ede8df]">
                        <span className="text-xs font-semibold text-[#151a22]">{spot.price}</span>
                        <Link
                          href={`/products/${spot.slug}`}
                          className="text-[10px] uppercase font-semibold text-[#9b7842] hover:text-[#543e20] flex items-center gap-1 group"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </MotionReveal>

        </div>
      </section>

      {/* 5. CURATED BATHROOM PACKAGES & SUITE ENSEMBLES */}
      <section className="py-24 bg-gradient-to-b from-[#fbf9f7] via-white to-[#fbf9f7] relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">

          <MotionReveal direction="up" className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2ECE7] border border-[#ded5cb] text-[#8c7764] text-xs font-semibold uppercase tracking-widest mb-3 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-[#9b7842]" />
              <span>Complete Bathroom Packages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#151a22] tracking-tight mb-3">
              Curated Bathroom Suite Packages
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">
              Architect-designed complete bathroom bundles featuring harmonized finishes, tall basin mixers, high-flow rain showers, and matching luxury hardware — packaged with exclusive suite savings.
            </p>
          </MotionReveal>

          {/* Suite Selector Tabs with High-Contrast Active Highlight */}
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-10">
            {BATHROOM_PACKAGES.map((pkg) => {
              const isActive = selectedPackageId === pkg.id;
              return (
                <motion.button
                  key={pkg.id}
                  type="button"
                  whileHover={{ scale: isActive ? 1.03 : 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={clsx(
                    "relative px-6 py-3 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2",
                    isActive
                      ? "text-white border-[#1c1815] font-bold shadow-lg scale-[1.03]"
                      : "bg-white text-[#4b5563] border-[#ded5cb] hover:bg-[#F2ECE7] hover:text-[#1c1815] shadow-2xs"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePackageTab"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className="absolute inset-0 bg-[#1c1815] rounded-full -z-10 shadow-md"
                    />
                  )}
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#dec49a] shrink-0 animate-pulse" />
                  )}
                  <span>{pkg.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Active Package Showcase Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPackage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-[#ded5cb] rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left: Suite Hero Banner with full-bleed cover image and minimal overlay gradient */}
                <div className="lg:col-span-5 relative min-h-[460px] sm:min-h-[520px] lg:min-h-full flex flex-col justify-between p-7 sm:p-9 text-white overflow-hidden">
                  {/* Full-bleed background image */}
                  <div className="absolute inset-0 z-0 w-full h-full">
                    <ProductImage
                      src={selectedPackage.coverImage}
                      alt={selectedPackage.name}
                      fill
                      priority
                      className="object-cover object-center w-full h-full scale-105 transition-transform duration-700"
                      containerClassName="absolute inset-0 w-full h-full"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                    />
                    {/* Minimal sleek gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 z-10" />
                  </div>

                  {/* Top Badges */}
                  <div className="relative z-20 flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 text-[#dec49a] text-[11px] font-semibold backdrop-blur-md shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-[#dec49a]" />
                      <span>Curated Bathroom Suite Packages</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#9b7842] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      Save ₹{selectedPackage.savings.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Bottom Text content over image */}
                  <div className="relative z-20 pt-16">
                    <span className="text-[11px] uppercase tracking-[0.22em] text-[#dec49a] font-semibold block mb-1.5 drop-shadow-sm">
                      {selectedPackage.finishTheme} Ensemble
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mb-2 leading-tight drop-shadow-md">
                      {selectedPackage.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-200 line-clamp-3 mb-4 leading-relaxed font-normal drop-shadow-sm">
                      {selectedPackage.description}
                    </p>
                    <div className="text-[11px] text-[#dec49a] font-semibold flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 w-fit">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#dec49a]" />
                      <span>Ideal for: {selectedPackage.idealFor}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Bundled Products & Instant Order */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    {/* Header with Pricing */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-5 border-b border-[#ede8df] gap-3">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-[#9b7842] font-bold block">
                          Included in this Suite
                        </span>
                        <h4 className="text-base sm:text-lg font-serif font-bold text-[#151a22]">
                          4-Piece Architect-Matched Fixtures
                        </h4>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="flex items-baseline gap-2 sm:justify-end">
                          <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#151a22]">
                            ₹{selectedPackage.packagePrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-neutral-400 line-through">
                            ₹{selectedPackage.originalPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-600 font-bold block">
                          Includes All 4 Fixtures + Free Insured Freight
                        </span>
                      </div>
                    </div>

                    {/* Products Grid in this package */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
                      {selectedPackage.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-[#faf8f5] border border-[#e8e2d9] rounded-2xl p-3 flex items-center gap-3.5 hover:border-[#9b7842] transition-colors group"
                        >
                          <div className="relative w-16 h-16 rounded-xl bg-white border border-[#ede8df] overflow-hidden shrink-0">
                            <ProductImage
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain p-1 group-hover:scale-105 transition-transform"
                              sizes="64px"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] uppercase font-bold text-[#9b7842] tracking-wider block truncate">
                              {item.role}
                            </span>
                            <h5 className="text-xs font-bold text-[#151a22] group-hover:text-[#9b7842] transition-colors truncate">
                              {item.name}
                            </h5>
                            <div className="flex items-center justify-between text-[11px] text-[#6b7280] mt-1 pt-1 border-t border-[#ede8df]/60">
                              <span className="font-mono text-[10px] text-[#84786d]">{item.sku}</span>
                              <span className="font-bold text-[#151a22]">₹{item.price.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-4 border-t border-[#ede8df] flex flex-col sm:flex-row items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleAddPackageToCart(selectedPackage)}
                      className={clsx(
                        "w-full sm:flex-1 py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer",
                        packageAddedId === selectedPackage.id
                          ? "bg-emerald-600 text-white"
                          : "bg-[#1c1815] hover:bg-[#9b7842] text-white"
                      )}
                    >
                      {packageAddedId === selectedPackage.id ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Added Complete Suite to Cart!</span>
                        </>
                      ) : (
                        <>
                          <CartIcon className="w-4 h-4" />
                          <span>Add Complete Suite to Cart ({selectedPackage.items.length} Fixtures)</span>
                        </>
                      )}
                    </motion.button>

                    <Link
                      href="/contact"
                      className="w-full sm:w-auto bg-[#f7f5f0] hover:bg-[#ede8df] text-[#1c1815] border border-[#ded5cb] font-bold py-4 px-6 rounded-2xl text-xs uppercase tracking-wider text-center transition-colors shadow-2xs"
                    >
                      Consult Architect
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* 6. PLACED BANNER: 2026 MASTER SPECIFICATION STANDARD */}
      <section className="relative min-h-[560px] sm:min-h-[640px] lg:min-h-[700px] flex items-center bg-[#111620] text-white border-y border-white/10 overflow-hidden my-0">
        <div className="absolute inset-0 z-0">
          <ProductImage
            src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=2400"
            alt="Parkash Ceramics Architectural Benchmark"
            fill
            className="object-cover object-center"
            containerClassName="w-full h-full"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left Column: Architectural Proposition */}
            <MotionReveal direction="right" className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F2ECE7]/20 border border-[#F2ECE7]/40 text-[#F2ECE7] text-xs font-semibold uppercase tracking-widest">
                <Award className="w-3.5 h-3.5 text-[#F2ECE7]" />
                <span>2026 Master Specification Standard</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-white tracking-tight leading-tight">
                Engineered For Architectural Precision. Crafted For Timeless Living.
              </h2>

              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed max-w-2xl">
                Every Parkash Ceramics fixture undergoes 50-bar hydrodynamic pressure validation, Swiss ceramic cartridge cycle testing, and PVD molecular vacuum coating to exceed international hospitality and luxury residential standards.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] hover:from-white hover:to-[#ded5cb] text-[#1c1815] border border-[#ded5cb] font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all"
                  >
                    <FileText className="w-4 h-4 text-[#8c7764]" />
                    <span>Download 2026 Spec Book (PDF)</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/#consultation"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl backdrop-blur-md transition-colors"
                  >
                    <span>Request Architect Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F2ECE7]" />
                  </Link>
                </motion.div>
              </div>
            </MotionReveal>

            {/* Right Column: 4 Architectural Pillars Grid */}
            <StaggerContainer className="lg:col-span-5 grid grid-cols-2 gap-4">
              <StaggerItem>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} className="bg-black/40 border border-white/15 rounded-2xl p-5 backdrop-blur-md transition-shadow hover:border-[#dec49a]/40">
                  <div className="w-9 h-9 rounded-xl bg-[#9b7842]/30 border border-[#dec49a]/30 text-[#dec49a] flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-serif font-semibold text-white block">10-15 Yrs</span>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold mt-0.5 block">Full Warranty</span>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} className="bg-black/40 border border-white/15 rounded-2xl p-5 backdrop-blur-md transition-shadow hover:border-[#dec49a]/40">
                  <div className="w-9 h-9 rounded-xl bg-[#9b7842]/30 border border-[#dec49a]/30 text-[#dec49a] flex items-center justify-center mb-3">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-serif font-semibold text-white block">500,000+</span>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold mt-0.5 block">Cycle Cartridge Life</span>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} className="bg-black/40 border border-white/15 rounded-2xl p-5 backdrop-blur-md transition-shadow hover:border-[#dec49a]/40">
                  <div className="w-9 h-9 rounded-xl bg-[#9b7842]/30 border border-[#dec49a]/30 text-[#dec49a] flex items-center justify-center mb-3">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-serif font-semibold text-white block">100% PVD</span>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold mt-0.5 block">Molecular Vacuum Coat</span>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} className="bg-black/40 border border-white/15 rounded-2xl p-5 backdrop-blur-md transition-shadow hover:border-[#dec49a]/40">
                  <div className="w-9 h-9 rounded-xl bg-[#9b7842]/30 border border-[#dec49a]/30 text-[#dec49a] flex items-center justify-center mb-3">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-serif font-semibold text-white block">16 Lines</span>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold mt-0.5 block">Integrated Suites</span>
                </motion.div>
              </StaggerItem>
            </StaggerContainer>

          </div>
        </div>
      </section>

      {/* 7. CRAFTSMANSHIP & HERITAGE EDITORIAL */}
      <section className="py-24 bg-gradient-to-b from-white via-[#faf8f6] to-white relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Editorial Visual Collage */}
            <MotionReveal direction="right" className="grid grid-cols-2 gap-4 relative">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#e5e0d8] shadow-md bg-white">
                <ProductImage
                  src="https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80&w=1000"
                  alt="Parkash Ceramics Precision Faucet Engineering"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#e5e0d8] shadow-md mt-8 bg-white">
                <ProductImage
                  src="https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?auto=format&fit=crop&q=80&w=1000"
                  alt="Fine Vitreous Ceramic Vitrification"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Stat Badge */}
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                transition={{ duration: 0.25 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white border border-[#dec49a] rounded-2xl p-5 shadow-xl flex items-center gap-6 min-w-max"
              >
                <div>
                  <span className="text-2xl sm:text-3xl font-serif font-semibold text-[#151a22] block">500,000+</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#84786d] font-semibold">Tested Cycle Longevity</span>
                </div>
                <div className="h-8 w-px bg-[#ede8df]" />
                <div>
                  <span className="text-2xl sm:text-3xl font-serif font-semibold text-[#9b7842] block">10-15 Yrs</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#84786d] font-semibold">Comprehensive Warranty</span>
                </div>
              </motion.div>
            </MotionReveal>

            {/* Right Storytelling Content */}
            <MotionReveal direction="left" className="lg:pl-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#9b7842] font-semibold mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>The Parkash Ceramics Benchmark</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#151a22] tracking-tight leading-tight mb-6">
                Where Master Craftsmanship Meets Fluid Dynamics
              </h2>

              <p className="text-sm sm:text-base text-[#374151] leading-relaxed mb-6">
                For over two decades, Parkash Ceramics has supplied visionary architects, interior designers, and luxury homeowners with bathroom fixtures that transcend utility. We combine German ceramic cartridge precision, French thermostatic regulation, and Physical Vapor Deposition (PVD) to deliver surfaces that remain immaculate for a lifetime.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3.5">
                  <div className="p-1.5 rounded-lg bg-[#9b7842]/10 text-[#9b7842] mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-[#151a22]">Lead-Free Dezincification Resistant Brass</h4>
                    <p className="text-xs sm:text-sm text-[#6b7280]">Pure DR brass prevents heavy metal water contamination and eliminates internal corrosion.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-1.5 rounded-lg bg-[#9b7842]/10 text-[#9b7842] mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-[#151a22]">Tornado Rimless Ceramic Hygiene</h4>
                    <p className="text-xs sm:text-sm text-[#6b7280]">360-degree vortex centrifugal flush scrubs every millimeter without splashing or overspray.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-1.5 rounded-lg bg-[#9b7842]/10 text-[#9b7842] mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-[#151a22]">Architectural CAD & BIM Library</h4>
                    <p className="text-xs sm:text-sm text-[#6b7280]">Complete 3D Revit models, dimensional blueprints, and rough-in guides ready for specification.</p>
                  </div>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9b7842] hover:text-[#543e20] transition-colors group"
              >
                <span>Read Full Heritage & Material Journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </MotionReveal>

          </div>
        </div>
      </section>

      {/* 8. ARCHITECTURAL SHOWROOM CONSULTATION & LIVE WORKING DISPLAYS */}
      <section id="consultation" className="py-20 sm:py-24 bg-gradient-to-b from-white via-[#faf8f6] to-white border-t border-[#ede8df] relative scroll-mt-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <MotionReveal direction="up" className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9b7842] font-semibold block mb-2">
              Bespoke Concierge & Specification Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#151a22] tracking-tight mb-3">
              Experience Water in Motion
            </h2>
            <p className="text-xs sm:text-sm text-[#6b7280]">
              Schedule a 1-on-1 private tour at our flagship experience center, test live working hydro-jets, and consult with our senior sanitaryware specialists.
            </p>
          </MotionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Redesigned Consultation Form (7 Cols) */}
            <MotionReveal direction="right" className="lg:col-span-7 flex">
              <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-10 shadow-sm w-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-4 h-4 text-[#9b7842]" />
                    <span className="text-xs uppercase tracking-widest text-[#9b7842] font-bold">
                      Personalized Consultation
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-[#151a22] tracking-tight mb-2">
                    Book A Private Showroom Tour
                  </h3>
                  <p className="text-xs text-[#6b7280] mb-8">
                    Fill in your project details below to reserve an exclusive 1-on-1 walkthrough with live hydro-testing.
                  </p>

                  <AnimatePresence mode="wait">
                    {bookingSubmitted ? (
                      <motion.div
                        key="confirmed"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-emerald-50 border border-emerald-300 p-8 rounded-2xl text-center my-4"
                      >
                        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                        <h4 className="text-lg font-serif font-semibold text-emerald-900 mb-1">
                          Tour Request Confirmed
                        </h4>
                        <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                          Thank you! A dedicated Parkash Ceramics bath concierge will reach out via WhatsApp (+91 86288 05096) to confirm your schedule and prepare custom displays.
                        </p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleBookingSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-[#374151] block mb-1.5">
                              Your Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Vikramaditya Sharma"
                              value={bookingData.name}
                              onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                              className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-3 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842] focus:bg-white transition-colors"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#374151] block mb-1.5">
                              Phone / WhatsApp Number *
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="+91 98765 XXXXX"
                              value={bookingData.phone}
                              onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                              className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-3 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842] focus:bg-white transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-[#374151] block mb-1.5">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="name@architect.com"
                              value={bookingData.email}
                              onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                              className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-3 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842] focus:bg-white transition-colors"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#374151] block mb-1.5">
                              Project Classification
                            </label>
                            <select
                              value={bookingData.projectType}
                              onChange={(e) => setBookingData({ ...bookingData, projectType: e.target.value })}
                              className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-3 text-xs text-[#151a22] font-semibold focus:outline-none focus:border-[#9b7842] focus:bg-white transition-colors"
                            >
                              <option value="Residential Villa">Residential Villa / Bungalow</option>
                              <option value="Luxury Penthouse">Luxury Penthouse / High-Rise</option>
                              <option value="Hospitality Resort">Hospitality Resort / Hotel</option>
                              <option value="Commercial Landmark">Commercial Complex / Office</option>
                              <option value="Architectural Practice">Architect / Interior Practice</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-[#374151] block mb-1.5">
                            Preferred Tour Date
                          </label>
                          <input
                            type="date"
                            value={bookingData.preferredDate}
                            onChange={(e) => setBookingData({ ...bookingData, preferredDate: e.target.value })}
                            className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-3 text-xs text-[#151a22] focus:outline-none focus:border-[#9b7842] focus:bg-white transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-[#374151] block mb-1.5">
                            Specific Fittings or Requirements of Interest
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Mention preferred collections, finishes (e.g. Brushed Gold, Matte Black), rainfall shower sizes, or whirlpool spa requirements..."
                            value={bookingData.message}
                            onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                            className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl p-3.5 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842] focus:bg-white transition-colors resize-none"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full bg-[#1c1815] hover:bg-[#9b7842] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-3"
                        >
                          <Send className="w-4 h-4" />
                          <span>Schedule Private Showroom Tour</span>
                        </motion.button>
                      </form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </MotionReveal>

            {/* Right Column: Direct Full Interactive Map (5 Cols) */}
            <MotionReveal direction="left" className="lg:col-span-5 flex">
              <div className="relative w-full h-full min-h-[480px] sm:min-h-[540px] rounded-3xl overflow-hidden border border-[#e8e2d9] shadow-sm bg-[#faf8f5]">
                {/* Floating Directions Badge */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-[#e8e2d9] pointer-events-auto">
                    <span className="text-[10px] font-bold text-[#9b7842] uppercase tracking-wider block">Flagship Gallery</span>
                    <span className="text-xs font-bold text-[#151a22]">Bangalore / NCR Experience Center</span>
                  </div>

                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://maps.google.com/?q=Bengaluru%2C+Karnataka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white bg-[#1c1815] hover:bg-[#9b7842] px-3.5 py-2 rounded-xl shadow-md transition-colors pointer-events-auto"
                  >
                    <span>Directions</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </motion.a>
                </div>

                {/* Full Bleed Google Map Iframe */}
                <iframe
                  title="Parkash Ceramics Flagship Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.886539092!2d77.49085449760773!3d12.95395998811883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full min-h-[480px] sm:min-h-[540px]"
                />
              </div>
            </MotionReveal>

          </div>

        </div>
      </section>

      {/* Global Quick View Modal */}
      <QuickViewModal />

    </div>
  );
}
