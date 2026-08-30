"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  DollarSign, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  BarChart3, 
  CreditCard, 
  MapPin, 
  Sparkles, 
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  ShieldCheck
} from "lucide-react";
import { 
  ADMIN_STATS, 
  REVENUE_MONTHLY_DATA, 
  CATEGORY_SALES_BREAKDOWN, 
  FINISH_PREFERENCE_DATA, 
  REGIONAL_SALES 
} from "@/lib/adminData";
import { motion, AnimatePresence } from "motion/react";

export default function AdminSalesPage() {
  const [timeRange, setTimeRange] = useState<"monthly" | "quarterly" | "annual">("monthly");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
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
              Financial Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
            Sales & Revenue Analytics
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Comprehensive audit of collections, regional luxury trade demand, and profit margins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Exporting Annual Financial Statement (PDF)...")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#9b7842]/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Audit Report</span>
          </button>
          <button
            onClick={() => showToast("Exporting Raw Transaction Logs (CSV)...")}
            className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-stone-700 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#dec49a]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Key Executive Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 shadow-md">
          <span className="text-xs text-stone-300 font-medium">Gross Bookings Value</span>
          <h3 className="text-2xl font-bold text-white mt-2">₹42,85,900</h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18.4%
            </span>
            <span className="text-stone-300">vs last period</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 shadow-md">
          <span className="text-xs text-stone-300 font-medium">Net Realized Revenue</span>
          <h3 className="text-2xl font-bold text-emerald-400 mt-2">₹38,90,450</h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-stone-300 font-medium">After trade discounts & taxes</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 shadow-md">
          <span className="text-xs text-stone-300 font-medium">Average Order Size</span>
          <h3 className="text-2xl font-bold text-white mt-2">₹23,290</h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +5.3%
            </span>
            <span className="text-stone-300">luxury multi-fixture</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 shadow-md">
          <span className="text-xs text-stone-300 font-medium">Payment Settlement Rate</span>
          <h3 className="text-2xl font-bold text-[#dec49a] mt-2">99.88%</h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-stone-300 font-medium">0.12% return/refund claim</span>
          </div>
        </div>
      </div>

      {/* Main Revenue Trajectory Chart */}
      <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800/80">
          <div>
            <h3 className="text-base font-bold text-white">
              Revenue Generation Trend (Calendar 2026)
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Consolidated sales figures across luxury bathroom fittings and architectural projects.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setTimeRange("monthly")}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === "monthly"
                  ? "bg-[#9b7842] text-white font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Monthly View
            </button>
            <button
              onClick={() => setTimeRange("quarterly")}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === "quarterly"
                  ? "bg-[#9b7842] text-white font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setTimeRange("annual")}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === "annual"
                  ? "bg-[#9b7842] text-white font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Annual YTD
            </button>
          </div>
        </div>

        {/* Visual Chart Bars */}
        <div className="h-72 flex items-end justify-between gap-2 sm:gap-4 pt-10">
          {REVENUE_MONTHLY_DATA.map((item) => {
            const maxRev = 900000;
            const barHeight = Math.round((item.revenue / maxRev) * 100);

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
              >
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-16 bg-[#1f2633] text-white text-[11px] py-1.5 px-3 rounded-xl border border-stone-700 shadow-xl pointer-events-none z-20 whitespace-nowrap">
                  <p className="font-bold text-[#dec49a]">
                    ₹{(item.revenue / 100000).toFixed(2)} Lakhs
                  </p>
                  <p className="text-[10px] text-stone-400">
                    {item.orders} Trade Orders • {item.visitors} Shoppers
                  </p>
                </div>

                {/* Bars */}
                <div className="w-full max-w-[42px] bg-stone-800/80 rounded-t-xl overflow-hidden flex flex-col justify-end transition-all group-hover:bg-stone-700/80">
                  <div
                    style={{ height: `${barHeight}%` }}
                    className="w-full bg-gradient-to-t from-[#836433] via-[#9b7842] to-[#dec49a] rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                  />
                </div>

                <span className="text-[11px] text-stone-300 group-hover:text-[#dec49a] transition-colors font-medium">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Regional & Market Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Regional Demand Distribution */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#dec49a]" />
              Top Regional Markets
            </h3>
            <span className="text-[10px] text-stone-300">By Orders</span>
          </div>

          <div className="space-y-3.5">
            {REGIONAL_SALES.map((reg) => (
              <div key={reg.region} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-medium">{reg.region}</span>
                  <span className="text-white font-bold">
                    ₹{(reg.revenue / 100000).toFixed(2)} L ({reg.share}%)
                  </span>
                </div>
                <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${reg.share}%` }}
                    className="bg-gradient-to-r from-[#9b7842] to-[#dec49a] h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Luxury Finish Preferences */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#dec49a]" />
              Finish Preference Share
            </h3>
            <span className="text-[10px] text-emerald-400 font-semibold">PVD Trend</span>
          </div>

          <div className="space-y-3.5">
            {FINISH_PREFERENCE_DATA.map((f) => (
              <div key={f.finish} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-medium">{f.finish}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{f.share}%</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {f.growth}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${f.share}%` }}
                    className="bg-gradient-to-r from-[#dec49a] to-[#836433] h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Payment Settlement Channels */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#dec49a]" />
              Payment Channels
            </h3>
            <span className="text-[10px] text-stone-300">Gateway Share</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Bank RTGS / Wire Transfer</p>
                <p className="text-[10px] text-stone-400">Direct architectural project settlement</p>
              </div>
              <span className="text-sm font-bold text-[#dec49a]">48%</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Credit Cards / Corporate</p>
                <p className="text-[10px] text-stone-400">Visa, Mastercard, Amex</p>
              </div>
              <span className="text-sm font-bold text-white">32%</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Instant UPI & QR Code</p>
                <p className="text-[10px] text-stone-400">Google Pay, PhonePe, Paytm</p>
              </div>
              <span className="text-sm font-bold text-emerald-400">20%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
