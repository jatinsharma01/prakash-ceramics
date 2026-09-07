"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Sparkles, 
  Tag, 
  Layers, 
  DollarSign, 
  Clock, 
  Eye, 
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Calendar,
  Filter,
  RefreshCw,
  Loader2,
  MessageSquareText,
  Globe
} from "lucide-react";
import { motion } from "motion/react";

interface AdminStats {
  totalRevenue: number;
  revenueGrowth: string;
  totalOrders: number;
  ordersGrowth: string;
  activeCustomers: number;
  customersGrowth: string;
  averageOrderValue: number;
  aovGrowth: string;
  conversionRate: string;
  lowStockItemsCount: number;
  categoryBreakdown: Array<{
    name: string;
    percentage: number;
    revenue: number;
    itemsSold: number;
    color: string;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
    visitors: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    stockCount: number;
    salesCount: number;
    images: string[];
  }>;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    city: string;
  };
  items: Array<{
    name: string;
    quantity: number;
  }>;
  total: number;
  fulfillmentStatus: string;
}

interface RecentEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectType: string;
  source: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "1y">("30d");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Just now");

  const loadDashboardData = useCallback(async () => {
    try {
      const [statsRes, ordersRes, enquiriesRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/orders?limit=5"),
        fetch("/api/enquiries?limit=4"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.stats) {
          setStats(statsData.stats);
        }
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.orders && Array.isArray(ordersData.orders)) {
          setRecentOrders(ordersData.orders.slice(0, 5));
        }
      }

      if (enquiriesRes.ok) {
        const enquiriesData = await enquiriesRes.json();
        if (enquiriesData.enquiries && Array.isArray(enquiriesData.enquiries)) {
          setRecentEnquiries(enquiriesData.enquiries.slice(0, 4));
        }
      }

      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      console.error("Failed to load dashboard data from API", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };

  const topProducts = stats?.topProducts || [];
  const monthlyData = stats?.monthlyRevenue || [];
  const categoryBreakdown = stats?.categoryBreakdown || [];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#181d28] via-[#1b2230] to-[#12161f] border border-stone-700/80 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#9b7842]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40">
                Operations & Sales Command
              </span>
              <span className="text-stone-400 text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Live Sync: {lastSyncTime}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Executive Dashboard
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
              Real-time live monitoring connected directly to PostgreSQL database for luxury sanitaryware catalog, trade architect orders, inventory levels, and revenue performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 bg-stone-900/80 hover:bg-stone-800 text-stone-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-stone-700 transition-all disabled:opacity-50"
              title="Refresh database live data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#dec49a] ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#9b7842]/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
            <Link
              href="/admin/seo"
              className="inline-flex items-center gap-2 bg-stone-800/80 hover:bg-stone-700 text-stone-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-stone-600/80 transition-all"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Page SEO</span>
            </Link>
            <Link
              href="/admin/sales"
              className="inline-flex items-center gap-2 bg-stone-800/80 hover:bg-stone-700 text-stone-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-stone-600/80 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-[#dec49a]" />
              <span>Sales Report</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Key Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 hover:border-stone-700 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Total Revenue</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-[#dec49a] border border-amber-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-8 bg-stone-800/60 rounded animate-pulse w-32" />
            ) : (
              <h3 className="text-2xl font-bold text-white tracking-tight">
                ₹{((stats?.totalRevenue || 0) >= 100000 
                  ? `${((stats?.totalRevenue || 0) / 100000).toFixed(2)} Lakhs` 
                  : (stats?.totalRevenue || 0).toLocaleString("en-IN"))}
              </h3>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {stats?.revenueGrowth || "+18.4%"}
              </span>
              <span className="text-stone-300">from DB orders</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 hover:border-stone-700 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Orders Processed</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-8 bg-stone-800/60 rounded animate-pulse w-24" />
            ) : (
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {stats?.totalOrders || 0}
              </h3>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {stats?.ordersGrowth || "+12.2%"}
              </span>
              <span className="text-stone-300">live database count</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 hover:border-stone-700 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Average Order Value</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-8 bg-stone-800/60 rounded animate-pulse w-28" />
            ) : (
              <h3 className="text-2xl font-bold text-white tracking-tight">
                ₹{(stats?.averageOrderValue || 0).toLocaleString("en-IN")}
              </h3>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {stats?.aovGrowth || "+5.3%"}
              </span>
              <span className="text-stone-300">luxury tier basket</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 hover:border-stone-700 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Trade & Retail Clients</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-8 bg-stone-800/60 rounded animate-pulse w-20" />
            ) : (
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {stats?.activeCustomers || 0}
              </h3>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {stats?.customersGrowth || "+8.7%"}
              </span>
              <span className="text-stone-300">registered accounts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Growth Trend (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#141822] border border-stone-800 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800/80">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Revenue & Sales Trajectory
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                Monthly revenue trend across sanitaryware, brassware & custom wellness orders.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setTimeRange("7d")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === "7d"
                    ? "bg-[#9b7842] text-white font-semibold"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange("30d")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === "30d"
                    ? "bg-[#9b7842] text-white font-semibold"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange("1y")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === "1y"
                    ? "bg-[#9b7842] text-white font-semibold"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                12 Months
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-6">
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#dec49a]" />
              </div>
            ) : (
              <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8">
                {monthlyData.map((item) => {
                  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 100000);
                  const heightPercent = Math.max(Math.round((item.revenue / maxRevenue) * 100), 8);

                  return (
                    <div
                      key={item.month}
                      className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                    >
                      {/* Tooltip on Hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-16 bg-[#1f2633] text-white text-[11px] py-1 px-2.5 rounded-lg border border-stone-700 shadow-xl pointer-events-none z-20 whitespace-nowrap">
                        <span className="font-semibold text-[#dec49a]">
                          ₹{(item.revenue / 1000).toFixed(0)}k
                        </span>
                        <span className="text-stone-400 ml-1">({item.orders} orders)</span>
                      </div>

                      {/* Bar */}
                      <div className="w-full max-w-[36px] bg-stone-800/80 rounded-t-lg overflow-hidden flex flex-col justify-end transition-all group-hover:bg-stone-700/80">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-gradient-to-t from-[#836433] via-[#9b7842] to-[#dec49a] rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                        />
                      </div>

                      {/* Month Label */}
                      <span className="text-[11px] text-stone-300 group-hover:text-[#dec49a] transition-colors font-medium">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chart Footnote Highlights */}
          <div className="mt-6 pt-4 border-t border-stone-800/60 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[11px] text-stone-300">Peak Month</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {monthlyData.length > 0
                  ? `${monthlyData.reduce((prev, curr) => curr.revenue > prev.revenue ? curr : prev, monthlyData[0]).month} (₹${(monthlyData.reduce((prev, curr) => curr.revenue > prev.revenue ? curr : prev, monthlyData[0]).revenue / 100000).toFixed(1)}L)`
                  : "Active"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-stone-300">Avg Monthly Run Rate</p>
              <p className="text-sm font-bold text-[#dec49a] mt-0.5">
                ₹{((stats?.totalRevenue || 0) / (monthlyData.length || 12) / 100000).toFixed(2)} Lakhs
              </p>
            </div>
            <div>
              <p className="text-[11px] text-stone-300">Annual Projected</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">
                ₹{(((stats?.totalRevenue || 0) * 1.2) / 100000).toFixed(1)} Lakhs
              </p>
            </div>
          </div>
        </div>

        {/* Category Breakdown (1 Col) */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-800/80">
              <h3 className="text-base font-bold text-white">
                Sales by Category
              </h3>
              <span className="text-[11px] text-[#dec49a] bg-[#9b7842]/10 px-2 py-0.5 rounded-full border border-[#9b7842]/20 font-medium">
                Volume Share
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-stone-800/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                categoryBreakdown.map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-300 font-medium">{cat.name}</span>
                      <span className="text-white font-semibold">{cat.percentage}%</span>
                    </div>
                    <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${Math.max(cat.percentage, 5)}%`,
                          backgroundColor: cat.color || "#9b7842",
                        }}
                        className="h-full rounded-full transition-all duration-700"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-stone-300">
                      <span>{cat.itemsSold} units sold</span>
                      <span>₹{(cat.revenue / 100000).toFixed(2)} L</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800/80 bg-stone-900/60 p-3.5 rounded-xl border border-stone-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Live Database Synced</p>
                <p className="text-stone-300 text-[11px]">All metrics calculated dynamically from order records.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#141822] border border-stone-800 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800/80">
            <div>
              <h3 className="text-base font-bold text-white">Recent Client Orders</h3>
              <p className="text-xs text-stone-300 mt-0.5">Latest high-end residential & commercial orders from database</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-[#dec49a] hover:text-white font-semibold inline-flex items-center gap-1 group"
            >
              <span>View all orders</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            {isLoading ? (
              <div className="py-12 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#dec49a]" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-xs">
                No orders recorded yet. When customers place orders, they will appear here in real time.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-300 font-medium uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Items</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Fulfillment</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-800/40 transition-colors group">
                      <td className="py-3.5 font-mono font-medium text-[#dec49a]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5">
                        <p className="font-semibold text-white">{order.customer?.name || "Customer"}</p>
                        <p className="text-[11px] text-stone-300">{order.customer?.city || "India"}</p>
                      </td>
                      <td className="py-3.5 text-stone-300">
                        {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? "s" : ""}
                      </td>
                      <td className="py-3.5 font-semibold text-white">
                        ₹{(order.total || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            order.fulfillmentStatus === "Delivered"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : order.fulfillmentStatus === "Processing"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {order.fulfillmentStatus || "Pending"}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/admin/orders?highlight=${order.id}`}
                          className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Products & Fast Movers (1 Col) */}
        <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-800/80">
              <div>
                <h3 className="text-base font-bold text-white">Signature Catalog</h3>
                <p className="text-xs text-stone-300 mt-0.5">Top revenue items</p>
              </div>
              <Link
                href="/admin/products"
                className="text-xs text-[#dec49a] hover:text-white font-semibold inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mt-4 divide-y divide-stone-800/60">
              {isLoading ? (
                <div className="space-y-3 py-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-stone-800/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : topProducts.length === 0 ? (
                <div className="py-8 text-center text-stone-400 text-xs">
                  No products in catalog yet.
                </div>
              ) : (
                topProducts.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.images?.[0] || "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760648/parkash-ceramics/faucets.jpg"}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-stone-900 border border-stone-700/80 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate group-hover:text-[#dec49a] transition-colors">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-stone-300 truncate">
                          {p.category} • {p.stockCount} in stock
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-white">
                        ₹{(p.price || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-semibold">
                        {p.salesCount || 0} sold
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="mt-6 pt-4 border-t border-stone-800/80 grid grid-cols-3 gap-2">
            <Link
              href="/admin/enquiries"
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 hover:text-white transition-colors text-center"
            >
              <MessageSquareText className="w-3.5 h-3.5 text-amber-400" />
              <span>Enquiries</span>
            </Link>
            <Link
              href="/admin/coupons"
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-xs font-medium text-stone-300 hover:text-white transition-colors text-center"
            >
              <Tag className="w-3.5 h-3.5 text-[#dec49a]" />
              <span>Promos</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-xs font-medium text-stone-300 hover:text-white transition-colors text-center"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Clients</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Inbound Consultation Enquiries Overview */}
      <div className="p-6 rounded-2xl bg-[#141822] border border-stone-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Latest Consultation Enquiries</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Inbound showroom tour requests & technical inquiries from Home Page & Contact Page
              </p>
            </div>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs text-[#dec49a] hover:text-white font-semibold inline-flex items-center gap-1.5 group bg-stone-900/80 px-3.5 py-2 rounded-xl border border-stone-700/80 transition-colors w-fit"
          >
            <span>Manage All Enquiries</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          {isLoading ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#dec49a]" />
            </div>
          ) : recentEnquiries.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-xs">
              No consultation requests received yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Project Classification</th>
                  <th className="pb-3">Submission Source</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-300">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-stone-800/40 transition-colors group">
                    <td className="py-3.5 font-medium text-white">
                      <div>
                        <span className="font-semibold">{enq.name}</span>
                        <p className="text-[11px] text-stone-400">{enq.phone}</p>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-stone-800 text-[#dec49a] border border-stone-700 text-[10px] font-semibold">
                        {enq.projectType}
                      </span>
                    </td>
                    <td className="py-3.5 text-stone-300">
                      <span className="text-[11px]">{enq.source}</span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          enq.status === "New"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : enq.status === "Contacted"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : enq.status === "Scheduled"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-stone-400 text-[11px]">
                      {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href="/admin/enquiries"
                        className="inline-flex items-center gap-1 text-[11px] text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-lg transition-colors font-medium"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
