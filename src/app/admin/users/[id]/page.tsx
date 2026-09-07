"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Mail,
  Phone,
  Building2,
  Calendar,
  CreditCard,
  Truck,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Download,
  DollarSign,
  Package,
  Clock,
  Search,
  ChevronRight,
  UserCheck,
  Loader2,
  Sparkles,
  AlertCircle,
  ShoppingCart,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdminOrder } from "@/lib/adminData";
import { AdminUserAddress, AdminUser } from "../page";

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const userId = unwrappedParams.id;
  const router = useRouter();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "cart" | "wishlist" | "addresses" | "info">("orders");
  const [searchOrders, setSearchOrders] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync tab from URL query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (tabParam === "addresses" || tabParam === "orders" || tabParam === "info" || tabParam === "cart" || tabParam === "wishlist") {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        } else {
          showToast("Client account not found");
        }
      } catch (err) {
        console.error("Failed to load user details", err);
        showToast("Error loading client profile");
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      loadUser();
    }
  }, [userId]);

  const handleDeleteUser = async () => {
    if (!user) return;
    if (!confirm(`Are you sure you want to permanently delete "${user.name}"'s account?`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Client account removed successfully");
        setTimeout(() => {
          router.push("/admin/users");
        }, 800);
      } else {
        showToast("Failed to delete account");
      }
    } catch {
      showToast("Error deleting account");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!user || !user.orders) return [];
    return user.orders.filter((ord: AdminOrder) => {
      const matchesSearch =
        ord.orderNumber.toLowerCase().includes(searchOrders.toLowerCase()) ||
        ord.shippingAddress.toLowerCase().includes(searchOrders.toLowerCase()) ||
        ord.items.some((i) => i.name.toLowerCase().includes(searchOrders.toLowerCase()));

      const matchesStatus =
        orderStatusFilter === "all" ||
        ord.fulfillmentStatus.toLowerCase() === orderStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [user, searchOrders, orderStatusFilter]);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#dec49a]" />
        <p className="text-stone-300 text-sm font-medium tracking-wide">
          Retrieving client record, order ledger, and site addresses...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 rounded-3xl bg-[#141822] border border-stone-800 text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Client Account Not Found</h2>
        <p className="text-xs text-stone-400">
          The requested client record may have been removed or does not exist in the database.
        </p>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9b7842] text-white text-xs font-semibold hover:bg-[#836433] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Clients Directory</span>
        </Link>
      </div>
    );
  }

  const ordersCount = user.orders?.length ?? user.totalOrders ?? 0;
  const addressesCount = user.addresses?.length ?? 0;
  const avgOrderValue = ordersCount > 0 ? Math.round((user.totalSpent || 0) / ordersCount) : 0;

  const userCart = user.cart || [];
  const userWishlist = user.wishlist || [];
  const cartCount = userCart.length;
  const wishlistCount = userWishlist.length;
  const cartTotalValue = userCart.reduce((sum: number, item: any) => sum + ((item.product?.price || item.price || 0) * (item.quantity || 1)), 0);
  const wishlistTotalValue = userWishlist.reduce((sum: number, item: any) => sum + (item.price || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
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

      {/* Top Breadcrumbs & Back Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-stone-800 group-hover:bg-[#9b7842] transition-colors text-stone-300 group-hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          <span>Back to Clients Directory</span>
        </Link>

        <div className="flex items-center gap-2 text-stone-500 text-xs">
          <span>Directory</span>
          <ChevronRight className="w-3 h-3 text-stone-600" />
          <span className="text-[#dec49a] font-medium">{user.name}</span>
        </div>
      </div>

      {/* Hero Client Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#141822] border border-stone-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#9b7842]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-5">
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#9b7842]/60 shadow-lg shadow-black/40 shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {user.status || "Active"} Client
                </span>
                {(user.totalSpent || 0) > 100000 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40">
                    High Volume Client
                  </span>
                )}
              </div>

              {user.company && (
                <p className="text-xs sm:text-sm text-stone-300 font-medium flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#dec49a]" />
                  <span>{user.company}</span>
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 pt-1">
                <span className="flex items-center gap-1.5 text-stone-300">
                  <Mail className="w-3.5 h-3.5 text-[#dec49a]" />
                  <span>{user.email}</span>
                </span>
                <span className="flex items-center gap-1.5 text-stone-300">
                  <Phone className="w-3.5 h-3.5 text-[#dec49a]" />
                  <span>{user.phone}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  <span>{user.city}, India</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>Joined {user.joinedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Direct Actions */}
          <div className="flex flex-wrap items-center gap-2.5 pt-4 md:pt-0 border-t md:border-t-0 border-stone-800">
            <a
              href={`mailto:${user.email}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-[#9b7842] text-stone-200 hover:text-white font-semibold text-xs transition-all border border-stone-700"
            >
              <Mail className="w-3.5 h-3.5 text-[#dec49a]" />
              <span>Send Email</span>
            </a>
            <a
              href={`tel:${user.phone}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-[#9b7842] text-stone-200 hover:text-white font-semibold text-xs transition-all border border-stone-700"
            >
              <Phone className="w-3.5 h-3.5 text-[#dec49a]" />
              <span>Call Client</span>
            </a>
            <button
              type="button"
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/70 text-rose-300 font-semibold text-xs transition-all border border-rose-900/40 cursor-pointer"
              title="Delete account record"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial & Activity Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Total Orders Placed</p>
            <p className="text-2xl font-bold text-white mt-1">{ordersCount}</p>
            <p className="text-[10px] text-stone-400 mt-0.5">
              Last: {user.lastOrderDate || user.joinedDate}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Lifetime Spend</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              ₹{(user.totalSpent || 0).toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-emerald-400/80 mt-0.5 font-medium">
              Verified Purchases
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Saved Delivery Sites</p>
            <p className="text-2xl font-bold text-white mt-1">{addressesCount}</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Project Addresses</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#9b7842]/15 text-[#dec49a] border border-[#9b7842]/30">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Average Order Value</p>
            <p className="text-2xl font-bold text-[#dec49a] mt-1">
              ₹{avgOrderValue.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">Per Transaction</p>
          </div>
          <div className="p-3 rounded-2xl bg-stone-800 text-[#dec49a] border border-stone-700">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-[#141822] rounded-2xl border border-stone-800">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-gradient-to-r from-[#9b7842] to-[#836433] text-white shadow-lg shadow-[#9b7842]/20"
              : "text-stone-400 hover:text-white hover:bg-stone-800/60"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "orders" ? "bg-black/30 text-white" : "bg-stone-800 text-stone-300"
            }`}
          >
            {ordersCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cart")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "cart"
              ? "bg-gradient-to-r from-[#9b7842] to-[#836433] text-white shadow-lg shadow-[#9b7842]/20"
              : "text-stone-400 hover:text-white hover:bg-stone-800/60"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Active Cart</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "cart" ? "bg-black/30 text-white" : "bg-stone-800 text-stone-300"
            }`}
          >
            {cartCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("wishlist")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "wishlist"
              ? "bg-gradient-to-r from-[#9b7842] to-[#836433] text-white shadow-lg shadow-[#9b7842]/20"
              : "text-stone-400 hover:text-white hover:bg-stone-800/60"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "wishlist" ? "bg-black/30 text-white" : "bg-stone-800 text-stone-300"
            }`}
          >
            {wishlistCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("addresses")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "addresses"
              ? "bg-gradient-to-r from-[#9b7842] to-[#836433] text-white shadow-lg shadow-[#9b7842]/20"
              : "text-stone-400 hover:text-white hover:bg-stone-800/60"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Sites & Addresses</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "addresses" ? "bg-black/30 text-white" : "bg-stone-800 text-stone-300"
            }`}
          >
            {addressesCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "info"
              ? "bg-gradient-to-r from-[#9b7842] to-[#836433] text-white shadow-lg shadow-[#9b7842]/20"
              : "text-stone-400 hover:text-white hover:bg-stone-800/60"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Client Record</span>
        </button>
      </div>

      {/* TAB 1: CLIENT ORDERS VIEW */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {/* Sub-toolbar: Search & Status Filters */}
          <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchOrders}
                onChange={(e) => setSearchOrders(e.target.value)}
                placeholder="Search orders by Order Number, product name, or destination..."
                className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 pl-10 pr-4 py-2 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-stone-400 text-[11px] mr-1">Filter Status:</span>
              {["all", "processing", "shipped", "delivered"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                    orderStatusFilter === st
                      ? "bg-[#9b7842] text-white"
                      : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((ord: AdminOrder) => {
                const isDelivered = ord.fulfillmentStatus === "Delivered";
                const isShipped = ord.fulfillmentStatus === "Shipped";
                const isProcessing = ord.fulfillmentStatus === "Processing";

                return (
                  <div
                    key={ord.id}
                    className="rounded-3xl bg-[#141822] border border-stone-800 p-6 space-y-4 shadow-md hover:border-stone-700 transition-all"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-bold text-white tracking-wide">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-md bg-stone-800 text-stone-300 font-semibold border border-stone-700">
                            {ord.items?.length || 1} {ord.items?.length === 1 ? "Item" : "Items"}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-500" />
                          <span>
                            Ordered on{" "}
                            {isNaN(Date.parse(ord.date))
                              ? ord.date
                              : new Date(ord.date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            ord.paymentStatus === "Paid"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          Payment: {ord.paymentStatus}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isDelivered
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : isShipped
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {ord.fulfillmentStatus}
                        </span>

                        <div className="text-right sm:pl-2">
                          <p className="text-lg font-bold text-[#dec49a]">
                            ₹{ord.total.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <Link
                          href={`/admin/orders?search=${encodeURIComponent(ord.orderNumber)}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-[#9b7842] text-stone-200 hover:text-white font-semibold text-xs transition-colors border border-stone-700"
                          title="Manage in fulfillment orders panel"
                        >
                          <span>Manage Order</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Ordered Fixtures & Items Table */}
                    <div className="rounded-2xl bg-[#10141d] border border-stone-800/80 overflow-hidden">
                      <div className="divide-y divide-stone-800/60">
                        {ord.items.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-800/20 transition-colors"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <img
                                src={
                                  item.image ||
                                  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300"
                                }
                                alt={item.name}
                                className="w-14 h-14 rounded-xl object-cover bg-stone-900 border border-stone-700 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-white text-sm truncate">
                                  {item.name}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-400">
                                  <span className="px-2 py-0.5 rounded-md bg-stone-900 text-[#dec49a] border border-stone-800 font-medium">
                                    {item.finish}
                                  </span>
                                  {item.sku && (
                                    <span className="font-mono text-stone-500">
                                      SKU: {item.sku}
                                    </span>
                                  )}
                                  <span>•</span>
                                  <span className="text-stone-300">
                                    Qty: <strong className="text-white">{item.quantity}</strong>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-left sm:text-right shrink-0">
                              <p className="font-mono font-bold text-white text-sm">
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                              </p>
                              <p className="text-[11px] text-stone-400">
                                ₹{item.price.toLocaleString("en-IN")} each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Logistics & Payment Details Footer */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="p-3.5 rounded-xl bg-stone-900/50 border border-stone-800 flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#dec49a] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-stone-400 text-[11px] font-semibold uppercase">
                            Dispatched / Destination Address
                          </p>
                          <p className="text-stone-200 mt-0.5 font-medium leading-relaxed">
                            {ord.shippingAddress}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-900/50 border border-stone-800 flex items-start gap-2.5">
                        <CreditCard className="w-4 h-4 text-[#dec49a] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-stone-400 text-[11px] font-semibold uppercase">
                            Payment Details
                          </p>
                          <p className="text-stone-200 mt-0.5 font-medium">
                            {ord.paymentMethod || "Verified Gateway Transaction"}
                          </p>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            Status: <span className="text-emerald-400 font-semibold">{ord.paymentStatus}</span>
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-900/50 border border-stone-800 flex items-start gap-2.5">
                        <Truck className="w-4 h-4 text-[#dec49a] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-stone-400 text-[11px] font-semibold uppercase">
                            Logistics & Courier Consignment
                          </p>
                          {ord.trackingNumber ? (
                            <p className="font-mono text-blue-400 font-bold mt-0.5 flex items-center gap-1.5">
                              <span>AWB: {ord.trackingNumber}</span>
                            </p>
                          ) : (
                            <p className="text-stone-400 mt-0.5">
                              Direct Factory Logistics / Local Delivery
                            </p>
                          )}
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            Fulfillment: <span className="text-[#dec49a] font-semibold">{ord.fulfillmentStatus}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 rounded-3xl bg-[#141822] border border-stone-800 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-stone-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Purchase Orders Recorded</h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                {searchOrders || orderStatusFilter !== "all"
                  ? "No orders found matching your search and status filter."
                  : `${user.name} has not placed any luxury bathware or wellness orders through the portal yet.`}
              </p>
              {searchOrders && (
                <button
                  type="button"
                  onClick={() => setSearchOrders("")}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-white font-semibold cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB: ACTIVE CART VIEW */}
      {activeTab === "cart" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-[#141822] border border-stone-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#dec49a]" />
                <span>Live Database Cart ({cartCount} Items)</span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Current shopping cart fittings and quantities saved in the database for {user.name}.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-800 text-[#dec49a] border border-stone-700">
                Cart Total: <strong className="text-white ml-1">₹{cartTotalValue.toLocaleString("en-IN")}</strong>
              </span>
            </div>
          </div>

          {cartCount > 0 ? (
            <div className="rounded-2xl bg-[#141822] border border-stone-800 overflow-hidden divide-y divide-stone-800/80">
              {userCart.map((item: any, idx: number) => {
                const prod = item.product || item;
                const finish = item.selectedFinish || item.finish || prod.finishes?.[0] || "Chrome";
                const qty = item.quantity || 1;
                const unitPrice = prod.price || 0;
                const itemTotal = unitPrice * qty;
                const img = prod.images?.[0] || prod.image || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300";

                return (
                  <div
                    key={`${prod.id || idx}-${finish}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-800/20 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={img}
                        alt={prod.name || "Bath Fixture"}
                        className="w-16 h-16 rounded-xl object-cover bg-stone-900 border border-stone-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white text-sm truncate">
                            {prod.name || "Custom Architectural Fixture"}
                          </p>
                          {prod.category && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-medium">
                              {prod.category}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs text-stone-400">
                          <span className="px-2 py-0.5 rounded-md bg-stone-900 text-[#dec49a] border border-stone-800 font-medium">
                            Finish: {finish}
                          </span>
                          <span>•</span>
                          <span>
                            Quantity: <strong className="text-white">{qty}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Unit Price: <strong className="text-stone-300">₹{unitPrice.toLocaleString("en-IN")}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800">
                      <div className="text-left sm:text-right">
                        <p className="font-mono font-bold text-white text-base">
                          ₹{itemTotal.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          Line Total
                        </p>
                      </div>

                      {prod.id && (
                        <Link
                          href={`/products/${prod.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-[#9b7842] text-stone-300 hover:text-white text-xs font-semibold transition-all border border-stone-700"
                        >
                          <span>View Item</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 rounded-3xl bg-[#141822] border border-stone-800 text-center space-y-3">
              <ShoppingCart className="w-10 h-10 text-stone-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Cart is Currently Empty</h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                Whenever {user.name} adds bath fittings, bathtubs, or showers to their shopping cart on any device, they will automatically be stored in the database and appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB: SAVED WISHLIST VIEW */}
      {activeTab === "wishlist" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-[#141822] border border-stone-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <span>Saved Wishlist ({wishlistCount} Products)</span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Curated architectural fixtures and bathroom fittings saved to wishlist in database for {user.name}.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-800 text-rose-300 border border-stone-700">
                Wishlist Value: <strong className="text-white ml-1">₹{wishlistTotalValue.toLocaleString("en-IN")}</strong>
              </span>
            </div>
          </div>

          {wishlistCount > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userWishlist.map((prod: any, idx: number) => {
                const img = prod.images?.[0] || prod.image || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400";
                const price = prod.price || 0;

                return (
                  <div
                    key={prod.id || idx}
                    className="rounded-2xl bg-[#141822] border border-stone-800 p-4 flex flex-col justify-between space-y-3 hover:border-stone-700 transition-all shadow-md group"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                        <img
                          src={img}
                          alt={prod.name || "Product"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {prod.category && (
                          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-[#dec49a] backdrop-blur-xs border border-stone-700/50">
                            {prod.category}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold text-white text-sm line-clamp-1">
                          {prod.name || "Architectural Product"}
                        </h4>
                        <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                          {prod.tagline || prod.description || "Luxury precision bathroom fitting"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Price</span>
                        <span className="font-mono font-bold text-[#dec49a] text-sm">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {prod.id && (
                        <Link
                          href={`/products/${prod.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-[#9b7842] text-stone-300 hover:text-white text-xs font-semibold transition-all border border-stone-700"
                        >
                          <span>View Fitting</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 rounded-3xl bg-[#141822] border border-stone-800 text-center space-y-3">
              <Heart className="w-10 h-10 text-stone-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Wishlist is Currently Empty</h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                Whenever {user.name} saves any items to their wishlist by clicking the heart icon, they will automatically be stored in the database and appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED ADDRESSES VIEW */}
      {activeTab === "addresses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Saved Project & Delivery Sites</h3>
              <p className="text-xs text-stone-400">
                Architectural sites, residences, and project addresses registered under {user.name}&apos;s profile.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-800 text-[#dec49a] border border-stone-700">
              {addressesCount} Sites Recorded
            </span>
          </div>

          {user.addresses && user.addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((addr: AdminUserAddress, idx: number) => (
                <div
                  key={addr.id || idx}
                  className="rounded-3xl bg-[#141822] border border-stone-800 p-6 space-y-3 relative hover:border-stone-700 transition-all shadow-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-stone-800 text-[#dec49a] border border-stone-700">
                        {addr.label || "Delivery Site"}
                      </span>
                      {addr.isDefault && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Primary Default
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-stone-400">{addr.phone}</span>
                  </div>

                  {addr.estateOrProject && (
                    <div className="flex items-center gap-2 text-sm font-bold text-white pt-1">
                      <Building2 className="w-4 h-4 text-[#dec49a] shrink-0" />
                      <span>{addr.estateOrProject}</span>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5 text-xs text-stone-300 pt-1">
                    <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="leading-relaxed font-medium">{addr.address}</p>
                      {addr.landmark && (
                        <p className="text-[11px] text-stone-400">
                          Landmark: <span className="text-stone-300">{addr.landmark}</span>
                        </p>
                      )}
                      <p className="text-xs font-semibold text-stone-400">
                        {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                    </div>
                  </div>

                  {addr.fullName && (
                    <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                      <span>On-Site Contact:</span>
                      <span className="font-semibold text-white">{addr.fullName}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 rounded-3xl bg-[#141822] border border-stone-800 text-center space-y-3">
              <MapPin className="w-10 h-10 text-stone-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Saved Addresses Found</h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                This client has not recorded any delivery addresses or site locations in their account yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CLIENT ACCOUNT DETAILS */}
      {activeTab === "info" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#141822] border border-stone-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#dec49a]" />
              <span>Contact & Identity Credentials</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between">
                <span className="text-stone-400">Client Full Name</span>
                <span className="font-semibold text-white">{user.name}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between">
                <span className="text-stone-400">Primary Email Address</span>
                <span className="font-semibold text-white">{user.email}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between">
                <span className="text-stone-400">Direct Contact Phone</span>
                <span className="font-semibold text-white">{user.phone}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between">
                <span className="text-stone-400">Primary City / Region</span>
                <span className="font-semibold text-white">{user.city}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between">
                <span className="text-stone-400">Studio / Architectural Firm</span>
                <span className="font-semibold text-white">{user.company || "Individual Client"}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#141822] border border-stone-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#dec49a]" />
              <span>Account Status & Platform History</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between">
                <span className="text-stone-400">System Database ID</span>
                <span className="font-mono text-stone-300">{user.id}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between">
                <span className="text-stone-400">Account Standing</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {user.status} Verified Client
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between">
                <span className="text-stone-400">Registration Date</span>
                <span className="font-semibold text-white">{user.joinedDate}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between">
                <span className="text-stone-400">Latest Purchase Activity</span>
                <span className="font-semibold text-[#dec49a]">
                  {user.lastOrderDate || user.joinedDate}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-between">
                <span className="text-stone-400">Total Purchase Volume</span>
                <span className="font-bold text-emerald-400">
                  ₹{(user.totalSpent || 0).toLocaleString("en-IN")} ({ordersCount} Orders)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
