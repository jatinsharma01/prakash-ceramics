"use client";

import React, { useState } from "react";
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
  Filter
} from "lucide-react";
import { 
  ADMIN_STATS, 
  REVENUE_MONTHLY_DATA, 
  ADMIN_ORDERS, 
  CATEGORY_SALES_BREAKDOWN, 
  ADMIN_INVENTORY_ITEMS 
} from "@/lib/adminData";

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "1y">("30d");

  // Top 4 selling products
  const topProducts = ADMIN_INVENTORY_ITEMS.slice(0, 4);

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
                Live Sync: Today, Aug 30
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Executive Dashboard
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
              Real-time monitoring for luxury sanitaryware catalog, trade architect orders, inventory levels, and revenue performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#9b7842]/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
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
            <h3 className="text-2xl font-bold text-white tracking-tight">
              ₹{(ADMIN_STATS.totalRevenue / 100000).toFixed(2)} Lakhs
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {ADMIN_STATS.revenueGrowth}
              </span>
              <span className="text-stone-300">vs last month</span>
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
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {ADMIN_STATS.totalOrders}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {ADMIN_STATS.ordersGrowth}
              </span>
              <span className="text-stone-300">18 awaiting dispatch</span>
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
            <h3 className="text-2xl font-bold text-white tracking-tight">
              ₹{ADMIN_STATS.averageOrderValue.toLocaleString("en-IN")}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {ADMIN_STATS.aovGrowth}
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
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {ADMIN_STATS.activeCustomers}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {ADMIN_STATS.customersGrowth}
              </span>
              <span className="text-stone-300">142 Architect Studios</span>
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
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8">
              {REVENUE_MONTHLY_DATA.map((item) => {
                const maxRevenue = 900000;
                const heightPercent = Math.round((item.revenue / maxRevenue) * 100);

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
          </div>

          {/* Chart Footnote Highlights */}
          <div className="mt-6 pt-4 border-t border-stone-800/60 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[11px] text-stone-300">Peak Month</p>
              <p className="text-sm font-bold text-white mt-0.5">December (₹8.4L)</p>
            </div>
            <div>
              <p className="text-[11px] text-stone-300">Avg Monthly Run Rate</p>
              <p className="text-sm font-bold text-[#dec49a] mt-0.5">₹5.25 Lakhs</p>
            </div>
            <div>
              <p className="text-[11px] text-stone-300">Annual Projected</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">₹63.0 Lakhs</p>
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
              {CATEGORY_SALES_BREAKDOWN.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-300 font-medium">{cat.name}</span>
                    <span className="text-white font-semibold">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                      className="h-full rounded-full transition-all duration-700"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-stone-300">
                    <span>{cat.itemsSold} units sold</span>
                    <span>₹{(cat.revenue / 100000).toFixed(2)} L</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800/80 bg-stone-900/60 p-3.5 rounded-xl border border-stone-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Gold PVD Finishes Lead</p>
                <p className="text-stone-300 text-[11px]">34% of all brassware orders selected PVD Gold finish.</p>
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
              <p className="text-xs text-stone-300 mt-0.5">Latest high-end residential & commercial orders</p>
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
                {ADMIN_ORDERS.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-stone-800/40 transition-colors group">
                    <td className="py-3.5 font-mono font-medium text-[#dec49a]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5">
                      <p className="font-semibold text-white">{order.customer.name}</p>
                      <p className="text-[11px] text-stone-300">{order.customer.city}</p>
                    </td>
                    <td className="py-3.5 text-stone-300">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </td>
                    <td className="py-3.5 font-semibold text-white">
                      ₹{order.total.toLocaleString("en-IN")}
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
                        {order.fulfillmentStatus}
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
              {topProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.images[0]}
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
                      ₹{p.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-semibold">
                      {p.salesCount} sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="mt-6 pt-4 border-t border-stone-800/80 grid grid-cols-2 gap-2">
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
              <span>Architects</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
