"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Tag, 
  Plus, 
  Copy, 
  Check, 
  Calendar, 
  Percent, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  X, 
  Trash2, 
  Sliders,
  Scissors
} from "lucide-react";
import { ADMIN_COUPONS, AdminCoupon } from "@/lib/adminData";
import { motion, AnimatePresence } from "motion/react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>(ADMIN_COUPONS);
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "scheduled">("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Coupon Form States
  const [newCode, setNewCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number | "">(10);
  const [minOrderValue, setMinOrderValue] = useState<number | "">(50000);
  const [usageLimit, setUsageLimit] = useState<number | "">(100);
  const [expiryDate, setExpiryDate] = useState("2026-12-31");
  const [description, setDescription] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    showToast(`Coupon code ${code} copied to clipboard!`);
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === "Active" ? "Expired" : "Active";
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
    showToast("Coupon status updated!");
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    const newCoupon: AdminCoupon = {
      id: `c-${Date.now()}`,
      code: newCode.toUpperCase().replace(/\s+/g, ""),
      discountType,
      discountValue: Number(discountValue) || 10,
      minOrderValue: Number(minOrderValue) || 0,
      usageLimit: Number(usageLimit) || 100,
      usedCount: 0,
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: expiryDate || "2026-12-31",
      status: "Active",
      description: description || "Promotional concession code for luxury bathware.",
    };

    setCoupons([newCoupon, ...coupons]);
    setIsCreateModalOpen(false);
    showToast(`Created new promo code: ${newCoupon.code}`);

    // Reset Form
    setNewCode("");
    setDescription("");
  };

  const generateRandomCode = () => {
    const prefixes = ["LUXURY", "PARKASH", "DESIGN", "VILLA", "BATH"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const val = discountType === "percentage" ? discountValue || 15 : "OFF";
    const num = Math.floor(100 + Math.random() * 900);
    setNewCode(`${prefix}${val}`);
  };

  const filteredCoupons = coupons.filter((c) => {
    if (filter === "active") return c.status === "Active";
    if (filter === "expired") return c.status === "Expired";
    if (filter === "scheduled") return c.status === "Scheduled";
    return true;
  });

  const totalDiscountsRedeemed = coupons.reduce((acc, curr) => acc + curr.usedCount, 0);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40">
              Promotions & Vouchers
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
            Coupons & Trade Concessions
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Create and monitor promotional discount vouchers for projects, showrooms, and VIP architects.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#9b7842]/25 transition-all self-start md:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Promo Code</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800">
          <p className="text-xs text-stone-300">Active Coupons</p>
          <p className="text-xl font-bold text-white mt-1">
            {coupons.filter((c) => c.status === "Active").length} Codes Live
          </p>
        </div>
        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800">
          <p className="text-xs text-stone-300">Total Redemptions</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {totalDiscountsRedeemed} Uses
          </p>
        </div>
        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800">
          <p className="text-xs text-stone-300">Highest Volume Code</p>
          <p className="text-xl font-bold text-[#dec49a] mt-1 font-mono">
            PARKASH10
          </p>
        </div>
        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800">
          <p className="text-xs text-stone-300">Concession Value Granted</p>
          <p className="text-xl font-bold text-blue-400 mt-1">
            ₹3.85 Lakhs
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs w-fit">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === "all"
              ? "bg-[#9b7842] text-white font-semibold"
              : "text-stone-400 hover:text-white"
          }`}
        >
          All ({coupons.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === "active"
              ? "bg-emerald-600 text-white font-semibold"
              : "text-stone-400 hover:text-white"
          }`}
        >
          Active ({coupons.filter((c) => c.status === "Active").length})
        </button>
        <button
          onClick={() => setFilter("expired")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === "expired"
              ? "bg-stone-700 text-white font-semibold"
              : "text-stone-400 hover:text-white"
          }`}
        >
          Expired ({coupons.filter((c) => c.status === "Expired").length})
        </button>
        <button
          onClick={() => setFilter("scheduled")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === "scheduled"
              ? "bg-blue-600 text-white font-semibold"
              : "text-stone-400 hover:text-white"
          }`}
        >
          Scheduled ({coupons.filter((c) => c.status === "Scheduled").length})
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon) => {
          const usagePercent = Math.min(
            100,
            Math.round((coupon.usedCount / coupon.usageLimit) * 100)
          );

          return (
            <div
              key={coupon.id}
              className="relative rounded-2xl bg-[#141822] border border-stone-800 p-6 flex flex-col justify-between shadow-md hover:border-stone-700 transition-all group overflow-hidden"
            >
              {/* Ticket Cutout Deco */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0d1017] border-r border-stone-800" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0d1017] border-l border-stone-800" />

              <div>
                {/* Header: Discount Badge & Status */}
                <div className="flex items-center justify-between pb-4 border-b border-dashed border-stone-800">
                  <span className="text-xl font-bold text-white flex items-center gap-1">
                    {coupon.discountType === "percentage" ? (
                      <>
                        <span className="text-2xl text-[#dec49a]">
                          {coupon.discountValue}%
                        </span>
                        <span className="text-xs uppercase text-stone-400">Off</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl text-emerald-400">
                          ₹{coupon.discountValue.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs uppercase text-stone-400">Flat</span>
                      </>
                    )}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      coupon.status === "Active"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : coupon.status === "Scheduled"
                        ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        : "bg-stone-800 text-stone-400 border border-stone-700"
                    }`}
                  >
                    {coupon.status}
                  </span>
                </div>

                {/* Promo Code Box */}
                <div className="my-4 p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-white tracking-widest">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => copyToClipboard(coupon.code)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-[#9b7842] text-stone-300 hover:text-white transition-colors"
                    title="Copy Code"
                  >
                    {copiedCode === coupon.code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-stone-300 line-clamp-2">
                  {coupon.description}
                </p>

                {/* Terms / Min Order */}
                <div className="mt-4 pt-3 border-t border-stone-800/80 space-y-1.5 text-[11px] text-stone-300">
                  <div className="flex justify-between">
                    <span>Min Order Spend:</span>
                    <span className="text-white font-medium">
                      ₹{coupon.minOrderValue.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Until:</span>
                    <span className="text-stone-300">
                      {new Date(coupon.expiryDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Usage Bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-[10px] text-stone-300">
                    <span>Redemptions</span>
                    <span>
                      {coupon.usedCount} / {coupon.usageLimit} ({usagePercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${usagePercent}%` }}
                      className={`h-full rounded-full ${
                        usagePercent >= 90
                          ? "bg-amber-500"
                          : "bg-gradient-to-r from-[#9b7842] to-emerald-400"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleCouponStatus(coupon.id)}
                  className="text-stone-300 hover:text-white font-medium"
                >
                  {coupon.status === "Active" ? "Pause Voucher" : "Re-activate"}
                </button>
                <button
                  onClick={() => {
                    setCoupons(coupons.filter((c) => c.id !== coupon.id));
                    showToast(`Deleted coupon ${coupon.code}`);
                  }}
                  className="text-red-400 hover:text-red-300 text-[11px]"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Coupon Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#141822] border border-stone-700 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6"
            >
              <div className="flex items-start justify-between pb-4 border-b border-stone-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#dec49a]" />
                    Create Promo Coupon
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Generate discount vouchers for trade campaigns
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-stone-300">
                      Coupon Code *
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="text-[#dec49a] hover:underline text-[11px]"
                    >
                      Generate Auto Code
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="e.g. LUXURY2026"
                    className="w-full bg-[#1c222c] border border-stone-700 font-mono text-sm font-bold text-white placeholder-stone-500 px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1.5">
                      Discount Type
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full bg-[#1c222c] border border-stone-700 text-white px-3 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                    >
                      <option value="percentage">Percentage (% Off)</option>
                      <option value="fixed">Flat Amount (₹ Off)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300 mb-1.5">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      required
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value ? Number(e.target.value) : "")}
                      placeholder={discountType === "percentage" ? "15" : "10000"}
                      className="w-full bg-[#1c222c] border border-stone-700 font-bold text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1.5">
                      Minimum Cart Order (₹)
                    </label>
                    <input
                      type="number"
                      value={minOrderValue}
                      onChange={(e) => setMinOrderValue(e.target.value ? Number(e.target.value) : "")}
                      placeholder="50000"
                      className="w-full bg-[#1c222c] border border-stone-700 text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300 mb-1.5">
                      Usage Limit (Total)
                    </label>
                    <input
                      type="number"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value ? Number(e.target.value) : "")}
                      placeholder="100"
                      className="w-full bg-[#1c222c] border border-stone-700 text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-[#1c222c] border border-stone-700 text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    Description & Terms
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Exclusive concession for DLF Villa project bathroom fittings"
                    className="w-full bg-[#1c222c] border border-stone-700 text-white px-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 hover:text-white font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white font-bold shadow-lg"
                  >
                    Launch Coupon
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
