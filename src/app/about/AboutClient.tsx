"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ProductImage } from "@/components/ProductImage";
import { 
  MotionReveal, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/MotionWrappers";
import { 
  ShieldCheck, 
  Award, 
  Layers, 
  Flame, 
  ArrowRight,
  MapPin,
  Clock
} from "lucide-react";

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#151a22] pb-24">
      
      {/* Hero Banner */}
      <div className="relative min-h-[55vh] flex items-center justify-center overflow-hidden border-b border-[#ede8df]">
        <div className="absolute inset-0 z-0">
          <ProductImage
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
            alt="Parkash Ceramics Design Studio & Heritage"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-32 pb-20 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-[#f7f1e6] text-xs font-semibold uppercase tracking-widest mb-4 backdrop-blur-md"
          >
            <Award className="w-3.5 h-3.5 text-[#dec49a]" />
            <span>Heritage & Engineering Excellence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-6xl font-serif font-semibold text-white tracking-tight leading-tight mb-6 max-w-4xl"
          >
            The Art & Engineering of Luxury Bathrooms
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-lg text-neutral-200 max-w-2xl font-normal leading-relaxed"
          >
            Parkash Ceramics was founded with a singular purpose: to elevate bathing from a daily routine into an architectural and sensory ritual of well-being.
          </motion.p>
        </div>
      </div>

      {/* Main Narrative & Story */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-20">
        
        {/* Section 1: Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-28">
          <MotionReveal direction="right">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9b7842] font-semibold block mb-3">
              Design Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#151a22] tracking-tight leading-tight mb-6">
              Precision Engineering Meets Timeless Materiality
            </h2>
            <p className="text-sm text-[#374151] leading-relaxed mb-4">
              At Parkash Ceramics, every curve, valve, and ceramic contour is sculpted with obsessive attention to fluid mechanics and tactile ergonomics. We believe luxury is not merely decorative — it is the effortless glide of a ceramic cartridge, the silent cascade of aerated rainfall, and the warmth of perfectly calibrated thermostatic water.
            </p>
            <p className="text-sm text-[#374151] leading-relaxed">
              Our products are specified across India’s most prestigious private villas, luxury penthouses, boutique wellness resorts, and commercial architectural landmarks.
            </p>
          </MotionReveal>

          <MotionReveal direction="left" className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#d8d2c6] shadow-xl bg-white">
            <ProductImage
              src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200"
              alt="Parkash Ceramics Architectural Bath Suite"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </MotionReveal>
        </div>

        {/* Section 2: Material Pillars */}
        <div className="mb-28">
          <MotionReveal direction="up" className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9b7842] font-semibold block mb-2">
              Uncompromising Materials
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#151a22] tracking-tight">
              Crafted From The World’s Finest Elements
            </h2>
          </MotionReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <motion.div whileHover={{ y: -6, scale: 1.02 }} className="bg-white border border-[#e8e2d9] rounded-3xl p-8 hover:border-[#9b7842] transition-colors shadow-sm h-full">
                <div className="p-3 rounded-2xl bg-[#9b7842]/10 text-[#9b7842] w-fit mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#151a22] mb-2">Lead-Free DR Brass</h3>
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  We forge our faucets exclusively from Dezincification-Resistant heavy brass. This prevents heavy metal leaching into drinking water and eliminates pitting and stress fractures under fluctuating municipal water chemistry.
                </p>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div whileHover={{ y: -6, scale: 1.02 }} className="bg-white border border-[#e8e2d9] rounded-3xl p-8 hover:border-[#9b7842] transition-colors shadow-sm h-full">
                <div className="p-3 rounded-2xl bg-[#9b7842]/10 text-[#9b7842] w-fit mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#151a22] mb-2">Physical Vapor Deposition (PVD)</h3>
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  Our Brushed Gold, Matte Black, and Rose Gold surfaces undergo vacuum chamber molecular bonding. The resulting diamond-hard finish is 10x more scratch-resistant than electroplating and withstands 480-hour salt spray testing.
                </p>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div whileHover={{ y: -6, scale: 1.02 }} className="bg-white border border-[#e8e2d9] rounded-3xl p-8 hover:border-[#9b7842] transition-colors shadow-sm h-full">
                <div className="p-3 rounded-2xl bg-[#9b7842]/10 text-[#9b7842] w-fit mb-6">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#151a22] mb-2">Vitreous Ceramic Glaze</h3>
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  Fired in tunnel kilns at 1280°C with UltraGlaze nano-coating. The vitrified non-porous ceramic surface repels bacteria, limescale, and staining agents with microscopic pore closure under 0.2 microns.
                </p>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Section 3: Showroom & Experience Tour */}
        <MotionReveal direction="up" className="bg-white rounded-3xl border border-[#e8e2d9] p-8 sm:p-14 overflow-hidden relative shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#9b7842] font-semibold block mb-3">
                Flagship Destination
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#151a22] tracking-tight mb-4">
                The Parkash Ceramics Experience Center
              </h2>
              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed mb-6">
                Explore fully plumbed live hydrotherapy showers, test pneumatic whirlpool bathtubs, and step inside real Canadian red cedar sauna cabins. Our senior project architects are on hand to review floor plans and recommend ideal rough-in placements.
              </p>

              <div className="space-y-3 text-xs text-[#4b5563] mb-8 font-medium">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#9b7842] shrink-0" />
                  <span>Flagship Experience Center, Marble Market & Bath Boulevard</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#9b7842] shrink-0" />
                  <span>Open Monday through Saturday (10:00 AM – 8:00 PM)</span>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-fit">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#9b7842] hover:bg-[#836433] text-white font-semibold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md transition-all group"
                >
                  <span>Schedule An Appointment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#d8d2c6] shadow-xl bg-white">
              <ProductImage
                src="https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&q=80&w=1000"
                alt="Parkash Ceramics Flagship Showroom Interior"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>
        </MotionReveal>

      </div>

    </div>
  );
}
