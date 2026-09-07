"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { BrandLogo } from "./BrandLogo";
import { 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUpRight,
  Droplets,
  Award,
  Layers,
  LayoutDashboard
} from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#faf8f5] border-t border-[#ede8df] text-[#4b5563] relative overflow-hidden">
      
      {/* Brand Value Pillars */}
      <div className="border-b border-[#ede8df] bg-[#f4f0e8]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white border border-[#e2dcd0] text-[#9b7842] shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#151a22] uppercase tracking-wider">10-15 Year Warranty</h4>
                <p className="text-xs text-[#6b7280] mt-1">Swiss & German ceramic cartridges engineered for half a million cycles.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white border border-[#e2dcd0] text-[#9b7842] shrink-0 shadow-xs">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#151a22] uppercase tracking-wider">Eco-Save Aeration</h4>
                <p className="text-xs text-[#6b7280] mt-1">Air-injected water saving flow without compromising hydro-pressure.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white border border-[#e2dcd0] text-[#9b7842] shrink-0 shadow-xs">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#151a22] uppercase tracking-wider">Diamond PVD Finishes</h4>
                <p className="text-xs text-[#6b7280] mt-1">Vapor deposition finishes impervious to corrosion and salt spray.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white border border-[#e2dcd0] text-[#9b7842] shrink-0 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#151a22] uppercase tracking-wider">Architect Support</h4>
                <p className="text-xs text-[#6b7280] mt-1">Dedicated CAD spec sheets, 3D files, and on-site project consulting.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center group">
              <BrandLogo variant="dark" size="md" />
            </Link>

            <p className="text-xs text-[#6b7280] leading-relaxed max-w-sm">
              Prakash Ceramics is a benchmark purveyor of luxury sanitaryware, high-performance shower systems, freestanding soaking bathtubs, and wellness hydro-spas for discerning residences, hospitality resorts, and architectural landmarks.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-[#374151]">
                <MapPin className="w-4 h-4 text-[#9b7842] shrink-0" />
                <span>Flagship Experience Center, Marble Market & Bath Boulevard</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#374151]">
                <Phone className="w-4 h-4 text-[#9b7842] shrink-0" />
                <span>+91 91480 03924 (Direct Desk)</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#374151]">
                <Mail className="w-4 h-4 text-[#9b7842] shrink-0" />
                <span>sales@prakashceramic.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#374151]">
                <Clock className="w-4 h-4 text-[#9b7842] shrink-0" />
                <span>Mon – Sat: 10:00 AM – 8:00 PM (Sunday by Appointment)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories Part 1 */}
          <div>
            <h3 className="text-xs font-semibold text-[#151a22] uppercase tracking-widest mb-4">
              Bath & Shower
            </h3>
            <ul className="space-y-2.5 text-xs">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-[#555f6d] hover:text-[#9b7842] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#9b7842]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Categories Part 2 */}
          <div>
            <h3 className="text-xs font-semibold text-[#151a22] uppercase tracking-widest mb-4">
              Wellness & Sanitary
            </h3>
            <ul className="space-y-2.5 text-xs">
              {CATEGORIES.slice(8, 16).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-[#555f6d] hover:text-[#9b7842] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#9b7842]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Links & Catalogue Download */}
          <div>
            <h3 className="text-xs font-semibold text-[#151a22] uppercase tracking-widest mb-4">
              Consultation & Specs
            </h3>
            <ul className="space-y-2.5 text-xs mb-6">
              <li>
                <Link href="/products" className="text-[#555f6d] hover:text-[#9b7842] transition-colors">
                  Product Catalogue 2026
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#555f6d] hover:text-[#9b7842] transition-colors">
                  Our Design Philosophy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#555f6d] hover:text-[#9b7842] transition-colors">
                  Schedule Experience Tour
                </Link>
              </li>
              <li>
                <Link href="/contact#consultation" className="text-[#555f6d] hover:text-[#9b7842] transition-colors">
                  Architect Trade Enquiries
                </Link>
              </li>
            </ul>

            <div className="p-4 rounded-2xl bg-white border border-[#e5ded0] shadow-xs text-xs">
              <span className="font-semibold text-[#151a22] block mb-1">Architectural Spec Book</span>
              <p className="text-[11px] text-[#6b7280] mb-3">Download complete CAD & specification sheets.</p>
              <Link
                href="/products"
                className="inline-block w-full text-center bg-[#9b7842] hover:bg-[#836433] text-white font-semibold text-[11px] py-2 rounded-xl transition-all shadow-xs"
              >
                Download PDF (38 MB)
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright & Disclaimer */}
      <div className="border-t border-[#ede8df] py-6 bg-[#f0ede6]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6b7280]">
          <p>© {new Date().getFullYear()} PRAKASH CERAMICS. All Rights Reserved. Precision sanitaryware & luxury wellness.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#151a22] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#151a22] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#151a22] cursor-pointer">Warranty Terms</span>
            <span className="text-[#8a6833] font-semibold">ISO 9001 Certified Quality</span>
            <Link 
              href="/admin" 
              className="inline-flex items-center gap-1 text-[#9b7842] hover:text-[#151a22] font-semibold transition-colors bg-white/70 px-2.5 py-1 rounded-md border border-[#e2dcd0]"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
