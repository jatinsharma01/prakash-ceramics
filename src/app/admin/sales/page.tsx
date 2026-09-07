"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  ShieldCheck,
  Plus,
  Tag,
  Trash2,
  Power,
  X,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SaleCampaign {
  id: string;
  title: string;
  slug: string;
  bannerText: string;
  discountType: string;
  discountValue: number;
  targetCategory?: string | null;
  badgeText?: string | null;
  bannerImage?: string | null;
  startDate: string | Date;
  endDate?: string | Date | null;
  isActive: boolean;
}

export default function AdminSalesPage() {
  const [timeRange, setTimeRange] = useState<"monthly" | "quarterly" | "annual">("monthly");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [salesCampaigns, setSalesCampaigns] = useState<SaleCampaign[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Sale Form
  const [newTitle, setNewTitle] = useState("");
  const [newBannerText, setNewBannerText] = useState("");
  const [newDiscountType, setNewDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [newDiscountValue, setNewDiscountValue] = useState<number | "">(15);
  const [newCategory, setNewCategory] = useState("all");
  const [newBadge, setNewBadge] = useState("LIMITED TIME PROMO");
  const [newBannerImage, setNewBannerImage] = useState("https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchSalesAndStats = useCallback(async () => {
    try {
      const [salesRes, statsRes] = await Promise.all([
        fetch("/api/sales"),
        fetch("/api/stats"),
      ]);

      if (salesRes.ok) {
        const data = await salesRes.json();
        if (data.sales) setSalesCampaigns(data.sales);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load sales data", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesAndStats();
  }, [fetchSalesAndStats]);

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBannerText.trim() || !newDiscountValue) {
      showToast("Please fill in required sale campaign fields");
      return;
    }

    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          bannerText: newBannerText,
          discountType: newDiscountType,
          discountValue: Number(newDiscountValue),
          targetCategory: newCategory === "all" ? undefined : newCategory,
          badgeText: newBadge,
          bannerImage: newBannerImage,
        }),
      });

      if (res.ok) {
        showToast("Promotional campaign launched successfully!");
        setIsModalOpen(false);
        setNewTitle("");
        setNewBannerText("");
        fetchSalesAndStats();
      } else {
        showToast("Failed to create promotional sale");
      }
    } catch (err) {
      showToast("Error creating sale campaign");
    }
  };

  const handleToggleSale = async (id: string) => {
    try {
      const res = await fetch(`/api/sales/${id}`, { method: "PATCH" });
      if (res.ok) {
        setSalesCampaigns((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
        );
        showToast("Campaign status updated");
      }
    } catch (err) {
      showToast("Failed to toggle sale status");
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotional campaign?")) return;
    try {
      const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSalesCampaigns((prev) => prev.filter((s) => s.id !== id));
        showToast("Campaign removed successfully");
      }
    } catch (err) {
      showToast("Failed to delete campaign");
    }
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
              Financial Intelligence & Campaigns
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
            Sales, Revenue & Promotion Campaigns
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Live database audits of collections, seasonal promotional sales, and revenue margins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#9b7842]/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Sale Campaign</span>
          </button>
          <button
            onClick={() => showToast("Exporting Financial Audit (CSV)...")}
            className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-stone-700 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#dec49a]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 shadow-md">
          <span className="text-xs text-stone-300 font-medium">Gross Bookings Value</span>
          {isLoading ? (
            <div className="h-8 bg-stone-800 rounded animate-pulse w-32 mt-2" />
          ) : (
            <h3 className="text-2xl font-bold text-white mt-2">
              ₹{(stats?.totalRevenue || 0).toLocaleString("en-IN")}
            </h3>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {stats?.revenueGrowth || "+18.4%"}
            </span>
            <span className="text-stone-400">database orders</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 shadow-md">
          <span className="text-xs text-stone-300 font-medium">Orders Count</span>
          {isLoading ? (
            <div className="h-8 bg-stone-800 rounded animate-pulse w-20 mt-2" />
          ) : (
            <h3 className="text-2xl font-bold text-white mt-2">{stats?.totalOrders || 0}</h3>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {stats?.ordersGrowth || "+12.2%"}
            </span>
            <span className="text-stone-400">live records</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 shadow-md">
          <span className="text-xs text-stone-300 font-medium">Average Order Value (AOV)</span>
          {isLoading ? (
            <div className="h-8 bg-stone-800 rounded animate-pulse w-28 mt-2" />
          ) : (
            <h3 className="text-2xl font-bold text-white mt-2">
              ₹{(stats?.averageOrderValue || 0).toLocaleString("en-IN")}
            </h3>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {stats?.aovGrowth || "+5.3%"}
            </span>
            <span className="text-stone-400">high-ticket conversions</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 shadow-md">
          <span className="text-xs text-stone-300 font-medium">Active VIP Clients</span>
          {isLoading ? (
            <div className="h-8 bg-stone-800 rounded animate-pulse w-24 mt-2" />
          ) : (
            <h3 className="text-2xl font-bold text-white mt-2">
              {(stats?.activeCustomers || 0).toLocaleString("en-IN")}
            </h3>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {stats?.customersGrowth || "+8.7%"}
            </span>
            <span className="text-stone-400">Architect Network</span>
          </div>
        </div>
      </div>

      {/* Promotional Sales & Campaigns Management Section */}
      <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#dec49a]" />
              <h2 className="text-lg font-bold text-white">Active Promotional Sales & Flash Campaigns</h2>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Live campaigns displayed across client storefront headers and catalog deal banners.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9b7842]/20 hover:bg-[#9b7842]/30 text-[#dec49a] border border-[#9b7842]/40 text-xs font-semibold transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Promotion</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {salesCampaigns.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-stone-400 text-xs">
              No active promotional campaigns found. Click &quot;Launch Sale Campaign&quot; above to create one.
            </div>
          ) : (
            salesCampaigns.map((sale) => (
              <div
                key={sale.id}
                className={`p-5 rounded-xl border transition-all ${
                  sale.isActive
                    ? "bg-stone-900/80 border-[#9b7842]/40 shadow-lg shadow-black/40"
                    : "bg-stone-900/30 border-stone-800 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/30">
                        {sale.badgeText || "PROMOTION"}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sale.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-stone-800 text-stone-400"
                      }`}>
                        {sale.isActive ? "ACTIVE LIVE" : "PAUSED"}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base truncate">{sale.title}</h3>
                    <p className="text-xs text-stone-300 line-clamp-2">{sale.bannerText}</p>
                    <div className="flex items-center gap-4 text-[11px] text-stone-400 pt-2">
                      <span>Discount: <strong className="text-white">{sale.discountType === "percentage" ? `${sale.discountValue}%` : `₹${sale.discountValue}`}</strong></span>
                      {sale.targetCategory && <span>Category: <strong className="text-[#dec49a] capitalize">{sale.targetCategory}</strong></span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleSale(sale.id)}
                      className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        sale.isActive
                          ? "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                      }`}
                      title={sale.isActive ? "Pause Campaign" : "Activate Campaign"}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSale(sale.id)}
                      className="p-2 rounded-lg bg-stone-800 hover:bg-red-950/40 text-stone-400 hover:text-red-400 transition-all"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Monthly Revenue Bar Chart & Breakdown */}
      <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#dec49a]" />
              Annual Gross Revenue & Order Frequency Trajectory
            </h2>
            <p className="text-xs text-stone-300">
              Monthly consolidated luxury bathroom fittings and brassware billing (2026).
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-stone-900 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setTimeRange("monthly")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === "monthly" ? "bg-[#9b7842] text-white shadow" : "text-stone-300 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeRange("quarterly")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === "quarterly" ? "bg-[#9b7842] text-white shadow" : "text-stone-300 hover:text-white"
              }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setTimeRange("annual")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === "annual" ? "bg-[#9b7842] text-white shadow" : "text-stone-300 hover:text-white"
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* CSS Bar Chart */}
        <div className="h-64 pt-8 flex items-end justify-between gap-2 sm:gap-4 border-b border-stone-800/80 pb-3">
          {(stats?.monthlyRevenue || []).map((item: any) => {
            const maxRev = Math.max(...(stats?.monthlyRevenue || []).map((m: any) => m.revenue), 100000);
            const barHeight = Math.max(Math.round((item.revenue / maxRev) * 100), 8);

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow border border-stone-700 pointer-events-none whitespace-nowrap">
                  ₹{(item.revenue / 1000).toFixed(0)}k ({item.orders} ord)
                </div>

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
            {(stats?.regionalSales || []).map((reg: any) => (
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
            {(stats?.finishPreferences || []).map((f: any) => (
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

      {/* Modal: Launch Sale Campaign */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#181c26] border border-stone-700 rounded-2xl shadow-2xl p-6 z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#9b7842]/20 text-[#dec49a]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Launch Sale Campaign</h3>
                    <p className="text-xs text-stone-400">Creates a live promotion in PostgreSQL backend</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSale} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Campaign Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Festival Grand Hydro Suite Sale"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#9b7842]"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Banner Announcement Text</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 15% off across all luxury showers and mixers"
                    value={newBannerText}
                    onChange={(e) => setNewBannerText(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#9b7842]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Discount Type</label>
                    <select
                      value={newDiscountType}
                      onChange={(e: any) => setNewDiscountType(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#9b7842]"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Discount Value</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newDiscountValue}
                      onChange={(e) => setNewDiscountValue(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#9b7842]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Target Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#9b7842]"
                    >
                      <option value="all">All Categories</option>
                      <option value="faucets">Faucets & Brassware</option>
                      <option value="showers">Showers & Hydrotherapy</option>
                      <option value="cloud">Cloud & Wellness</option>
                      <option value="sanitaryware">Sanitaryware & Basins</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#9b7842]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white font-bold shadow-lg"
                  >
                    Launch Campaign
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
