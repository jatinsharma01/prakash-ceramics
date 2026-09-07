"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProductImage } from "@/components/ProductImage";
import { MotionReveal } from "@/components/MotionWrappers";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building, 
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Residential Villa",
    preferredDate: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "Contact Page",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit consultation request");
      }

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "Residential Villa",
        preferredDate: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      console.error("Enquiry submission error:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again or call our showroom.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#151a22] pb-24">
      
      {/* Page Header */}
      <div className="bg-[#f7f5f0] border-b border-[#ede8df] pt-28 pb-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 text-center">
          <MotionReveal direction="up">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9b7842] font-semibold block mb-2">
              Flagship Experience Center & Architectural Support
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-[#151a22] tracking-tight mb-4">
              Connect With Our Bath Concierge
            </h1>
            <p className="text-xs sm:text-sm text-[#6b7280] max-w-xl mx-auto leading-relaxed">
              Visit our state-of-the-art live water experience center, consult with technical sanitaryware advisors, or request a custom architectural project quote.
            </p>
          </MotionReveal>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Cards & Info (5 Cols) */}
          <MotionReveal direction="right" className="lg:col-span-5 space-y-6">
            
            {/* Showroom Card */}
            <div className="bg-white border border-[#e8e2d9] rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#9b7842]/10 text-[#9b7842]">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-semibold text-[#151a22]">Flagship Showroom</h3>
                  <span className="text-xs text-[#9b7842] font-semibold">Live Plumbed Displays</span>
                </div>
              </div>

              <div className="space-y-4 text-xs text-[#4b5563]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#9b7842] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#151a22] block">Parkash Ceramics Experience Center</strong>
                    <p className="text-[#6b7280] mt-0.5">Plot No. 42, Marble Market Avenue, Main Bath Boulevard, New Delhi / NCR, India</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#9b7842] shrink-0" />
                  <div>
                    <p className="text-[#151a22] font-semibold">+91 70188 61957 (Showroom & WhatsApp)</p>
                    <p className="text-[#6b7280]">+91 70188 61957 (Direct Desk)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#9b7842] shrink-0" />
                  <div>
                    <p className="text-[#151a22] font-semibold">concierge@parkashceramics.com</p>
                    <p className="text-[#6b7280]">projects@parkashceramics.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-[#ede8df]">
                  <Clock className="w-4 h-4 text-[#9b7842] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#151a22] font-semibold">Monday – Saturday: 10:00 AM – 8:00 PM</p>
                    <p className="text-[#6b7280]">Sunday: By Exclusive Architect Appointment</p>
                  </div>
                </div>
              </div>

              {/* Call Showroom Desk */}
              <a
                href="tel:+917018861957"
                className="w-full mt-6 bg-[#1c1815] hover:bg-[#9b7842] text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call Showroom Reception</span>
              </a>
            </div>

            {/* Visual Showroom Preview */}
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-[#d8d2c6] shadow-sm bg-white">
              <ProductImage
                src="https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=1000"
                alt="Parkash Ceramics Showroom Master Bath Suite"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <span className="text-xs font-semibold text-white">Experience 16+ Live Product Zones</span>
              </div>
            </div>

          </MotionReveal>

          {/* Right Column: Appointment & Quote Request Form (7 Cols) */}
          <MotionReveal direction="left" id="consultation" className="lg:col-span-7">
            <div className="bg-white border border-[#dec49a] rounded-3xl p-8 sm:p-12 shadow-sm relative">
              
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#9b7842] font-semibold mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Private Consultation</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#151a22] mb-2">
                Book A Technical Bath Consultation
              </h2>
              <p className="text-xs sm:text-sm text-[#6b7280] mb-8">
                Fill in your project scope below. Our sanitaryware architects will prepare customized CAD specs and product samples.
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="submitted"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-emerald-50 border border-emerald-300 p-8 rounded-2xl text-center"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                    <h3 className="text-lg font-serif font-semibold text-emerald-900 mb-1">
                      Appointment Request Received
                    </h3>
                    <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
                      Thank you! A dedicated Parkash Ceramics luxury bath consultant will contact you via WhatsApp and phone to confirm your schedule.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#374151] block mb-1.5">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Vikramaditya Sharma"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#fbf9f5] border border-[#e5e0d8] rounded-xl px-4 py-3 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#374151] block mb-1.5">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 XXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-[#fbf9f5] border border-[#e5e0d8] rounded-xl px-4 py-3 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#374151] block mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@architecture.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#fbf9f5] border border-[#e5e0d8] rounded-xl px-4 py-3 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#374151] block mb-1.5">
                          Project Classification
                        </label>
                        <select
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full bg-[#fbf9f5] border border-[#e5e0d8] rounded-xl px-4 py-3 text-xs text-[#151a22] font-medium focus:outline-none focus:border-[#9b7842]"
                        >
                          <option value="Residential Villa">Residential Villa / Independent Bungalow</option>
                          <option value="Luxury Penthouse">Luxury Penthouse / High-Rise Apartment</option>
                          <option value="Hospitality Resort">Hospitality Resort / Boutique Hotel</option>
                          <option value="Commercial Landmark">Commercial Complex / Corporate Office</option>
                          <option value="Architectural Design Firm">Architect / Interior Design Practice</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#374151] block mb-1.5">
                        Preferred Tour / Consultation Date
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full bg-[#fbf9f5] border border-[#e5e0d8] rounded-xl px-4 py-3 text-xs text-[#151a22] focus:outline-none focus:border-[#9b7842]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#374151] block mb-1.5">
                        Project Notes / Specific Fittings of Interest
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Mention preferred finishes (e.g. Brushed Gold, Matte Black), number of bathrooms, ceiling heights, or hydrotherapy spa requirements..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#fbf9f5] border border-[#e5e0d8] rounded-xl p-4 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                      />
                    </div>

                    {errorMessage && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <motion.button
                      whileHover={isSubmitting ? {} : { scale: 1.01 }}
                      whileTap={isSubmitting ? {} : { scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] hover:from-white hover:to-[#ded5cb] disabled:opacity-60 text-[#1c1815] border border-[#ded5cb] font-semibold text-xs uppercase tracking-widest py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#8c7764]" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#8c7764]" />
                          <span>Submit Consultation Request</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </AnimatePresence>

            </div>
          </MotionReveal>

        </div>
      </div>

    </div>
  );
}
