"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  User, 
  Package, 
  MapPin, 
  Shield, 
  LogOut, 
  Sparkles, 
  ChevronRight, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Plus, 
  Edit2, 
  Trash2, 
  Phone, 
  Mail, 
  Building2, 
  AlertCircle, 
  ArrowRight,
  Heart,
  ShoppingBag,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useUserAuth } from "@/context/UserAuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useEnquiry } from "@/context/EnquiryContext";
import { AdminOrder } from "@/lib/adminData";
import { CustomerAddressRecord } from "@/lib/userDb";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";

  const { 
    user, 
    isLoading, 
    openAuthModal, 
    logout, 
    updateProfile, 
    addresses, 
    addAddress, 
    updateAddressItem, 
    deleteAddressItem 
  } = useUserAuth();

  const { totalWishlistItems } = useWishlist();
  const { totalItems } = useEnquiry();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Address modal state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    estateOrProject: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    label: "Home",
    isDefault: false,
  });
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  // Sync tab with URL if changed
  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    if (["overview", "orders", "addresses", "profile"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Load user orders
  useEffect(() => {
    if (!user) return;

    setProfileForm({
      name: user.name || "",
      phone: user.phone || "",
    });

    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch("/api/user/orders");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        }
      } catch (err) {
        console.error("Failed to load user orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Handle address form open
  const openNewAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user?.name || "",
      phone: user?.phone || "",
      estateOrProject: "",
      address: "",
      city: "Delhi NCR",
      state: "Delhi",
      pincode: "",
      landmark: "",
      label: "Home",
      isDefault: addresses.length === 0,
    });
    setAddressError(null);
    setAddressModalOpen(true);
  };

  const openEditAddressModal = (addr: CustomerAddressRecord) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      estateOrProject: addr.estateOrProject || "",
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      landmark: addr.landmark || "",
      label: addr.label,
      isDefault: addr.isDefault,
    });
    setAddressError(null);
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);
    setAddressSubmitting(true);

    if (editingAddressId) {
      const res = await updateAddressItem(editingAddressId, addressForm);
      setAddressSubmitting(false);
      if (res.success) {
        setAddressModalOpen(false);
      } else {
        setAddressError(res.message || "Failed to update address.");
      }
    } else {
      const res = await addAddress(addressForm);
      setAddressSubmitting(false);
      if (res.success) {
        setAddressModalOpen(false);
      } else {
        setAddressError(res.message || "Failed to add address.");
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(null);
    const res = await updateProfile(profileForm);
    setProfileSaving(false);
    if (res.success) {
      setProfileSuccess("Profile details updated successfully.");
      setTimeout(() => setProfileSuccess(null), 4000);
    }
  };

  // Helper for tracking steps
  const getFulfillmentProgress = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("delivered")) return 4;
    if (s.includes("shipped")) return 3;
    if (s.includes("processing") || s.includes("crafting")) return 2;
    return 1;
  };

  // Guest State Screen
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-[#fbf9f7] pt-36 pb-24 text-[#151a22]">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#ded5cb] flex items-center justify-center text-[#9b7842] mx-auto mb-4 shadow-sm">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
            Client Sign In Required
          </h1>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            Please sign in to view your orders, live transit tracking, saved project addresses, and exclusive privilege perks.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => openAuthModal("login")}
              className="bg-[#1c1815] hover:bg-[#9b7842] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Sign In to Account
            </button>
            <button
              onClick={() => openAuthModal("register")}
              className="bg-white hover:bg-stone-50 text-[#151a22] border border-[#ded5cb] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Create Account
            </button>
          </div>
          <div className="mt-8 pt-6 border-t border-stone-200 text-xs text-stone-400">
            <Link href="/" className="hover:text-[#9b7842] transition-colors">
              ← Return to Catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f7] text-[#151a22] pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-[#ede8df] pt-28 pb-4">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <nav className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-[#151a22] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#151a22] font-semibold">User Account Panel</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10">
        
        {/* Welcome Banner Card */}
        <div className="bg-gradient-to-r from-[#1c1815] via-[#2a2420] to-[#1c1815] rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#9b7842]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#9b7842] to-[#dec49a] text-[#1c1815] font-serif font-bold text-2xl flex items-center justify-center shadow-lg uppercase">
                {user?.name ? user.name.slice(0, 2) : "PC"}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#9b7842]/30 text-[#dec49a] border border-[#9b7842]/40">
                    {user?.tier || "Privilege Client"}
                  </span>
                  {user?.company && (
                    <span className="text-xs text-stone-300 hidden sm:inline">
                      • {user.company}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Welcome back, {user?.name}
                </h1>
                <p className="text-xs text-stone-300 mt-1 flex items-center gap-3">
                  <span>{user?.email}</span>
                  <span>•</span>
                  <span>{user?.phone}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-stone-300 hover:text-rose-300 border border-white/15 text-xs font-semibold transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-[#ede8df] pb-4 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Sparkles },
            { id: "orders", label: `My Orders (${orders.length})`, icon: Package },
            { id: "addresses", label: `Saved Addresses (${addresses.length})`, icon: MapPin },
            { id: "profile", label: "Profile & Settings", icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#1c1815] text-white shadow-md"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-[#ede8df]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#dec49a]" : "text-stone-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Orders</span>
                  <div className="p-2 rounded-xl bg-[#9b7842]/10 text-[#9b7842]">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#151a22]">{orders.length}</p>
                <span className="text-[11px] text-stone-400 mt-1 block">Recorded on your account</span>
              </div>

              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Shipments</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#151a22]">
                  {orders.filter((o) => o.fulfillmentStatus !== "Delivered" && o.fulfillmentStatus !== "Cancelled").length}
                </p>
                <span className="text-[11px] text-stone-400 mt-1 block">In production or in transit</span>
              </div>

              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Saved Addresses</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#151a22]">{addresses.length}</p>
                <span className="text-[11px] text-stone-400 mt-1 block">Quick checkout enabled</span>
              </div>

              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Wishlist Items</span>
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#151a22]">{totalWishlistItems}</p>
                <Link href="/wishlist" className="text-[11px] text-[#9b7842] hover:underline mt-1 block font-medium">
                  View saved collection →
                </Link>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#ede8df] mb-6">
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#151a22]">Recent Order Updates</h2>
                  <p className="text-xs text-stone-500">Track and view status of your recent project orders</p>
                </div>
                {orders.length > 0 && (
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-[#9b7842] hover:underline flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {ordersLoading ? (
                <div className="py-12 text-center text-xs text-stone-400">Loading order history...</div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-stone-700">No orders placed yet</p>
                  <p className="text-xs text-stone-400 mt-1 mb-4">
                    Explore our luxury catalogues and add fittings to your cart to checkout.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
                  >
                    <span>Browse Collections</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 2).map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-[#fbf9f7] border border-[#ede8df] hover:border-[#9b7842]/40 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ede8df]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#151a22] font-mono">{order.orderNumber}</span>
                            <span className="text-[11px] text-stone-400">• {order.date}</span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {order.items.length} {order.items.length === 1 ? "Item" : "Items"} • Total: ₹{order.total.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.fulfillmentStatus === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.fulfillmentStatus === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {order.fulfillmentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items thumbnails */}
                      <div className="flex items-center gap-3 pt-3 overflow-x-auto">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 shrink-0 bg-white p-2 rounded-xl border border-[#ede8df]">
                            <div className="w-10 h-10 rounded-lg bg-stone-100 relative overflow-hidden shrink-0">
                              {item.image ? (
                                <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-stone-400 m-auto" />
                              )}
                            </div>
                            <div className="max-w-[140px]">
                              <p className="text-[11px] font-semibold text-stone-800 truncate">{item.name}</p>
                              <p className="text-[10px] text-stone-500">{item.finish} • Qty {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Default Address & Concierge Callout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default Address Card */}
              <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Primary Delivery Address
                    </span>
                    <button
                      onClick={() => setActiveTab("addresses")}
                      className="text-xs font-bold text-[#9b7842] hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                  {addresses.length > 0 ? (
                    <div className="p-4 rounded-2xl bg-[#fbf9f7] border border-[#ede8df]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-[#151a22]">{addresses[0].fullName}</span>
                        <span className="text-[10px] uppercase font-bold bg-[#9b7842]/15 text-[#9b7842] px-2 py-0.5 rounded-md">
                          {addresses[0].label}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {addresses[0].address}, {addresses[0].city}, {addresses[0].state} - {addresses[0].pincode}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">Phone: {addresses[0].phone}</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#fbf9f7] border border-dashed border-[#ede8df] text-center">
                      <p className="text-xs text-stone-500 mb-2">No delivery addresses saved yet.</p>
                      <button
                        onClick={openNewAddressModal}
                        className="text-xs font-bold text-[#9b7842] hover:underline"
                      >
                        + Add First Address
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Concierge Card */}
              <div className="bg-gradient-to-br from-[#f7f5f0] to-[#ede8df] border border-[#ded5cb] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#9b7842]/15 text-[#9b7842] text-[10px] font-bold uppercase tracking-wider mb-3">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Direct Concierge</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#151a22] mb-1">
                    Architectural Order Assistance
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Have custom specification requests, rough-in plumbing questions, or dispatch scheduling queries? Speak directly with our master technicians.
                  </p>
                </div>
                <div className="mt-5">
                  <a
                    href="https://wa.me/919148003924?text=Hello%20Prakash%20Ceramics,%20I%20need%20assistance%20with%20my%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm"
                  >
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS & TRACKING */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="pb-4 border-b border-[#ede8df] mb-6">
                <h2 className="text-xl font-serif font-bold text-[#151a22]">Your Orders & Live Tracking</h2>
                <p className="text-xs text-stone-500">View real-time dispatch progress and delivery milestones</p>
              </div>

              {ordersLoading ? (
                <div className="py-16 text-center text-xs text-stone-400">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center">
                  <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-base font-semibold text-stone-700">No orders found</p>
                  <p className="text-xs text-stone-400 mt-1 mb-5">
                    Items ordered through our storefront with your email ({user?.email}) will automatically sync here.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors"
                  >
                    <span>Browse Luxury Catalogue</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const step = getFulfillmentProgress(order.fulfillmentStatus);
                    return (
                      <div
                        key={order.id}
                        className="bg-[#fcfbf9] border border-[#ede8df] rounded-2xl p-6 hover:shadow-md transition-all space-y-6"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ede8df]">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-[#151a22]">{order.orderNumber}</span>
                              <span className="text-xs text-stone-400">• Placed on {order.date}</span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Shipping to: {order.customer.name} ({order.shippingAddress})
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-stone-700">
                              ₹{order.total.toLocaleString("en-IN")}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.fulfillmentStatus === "Delivered"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : order.fulfillmentStatus === "Shipped"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}>
                              {order.fulfillmentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Visual Tracking Progress Stepper */}
                        <div className="bg-white p-5 rounded-2xl border border-[#ede8df]">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                              <Truck className="w-4 h-4 text-[#9b7842]" />
                              <span>Dispatch & Tracking Status</span>
                            </span>
                            {order.trackingNumber && (
                              <span className="text-xs font-mono text-stone-500">
                                AWB: <span className="font-bold text-[#151a22]">{order.trackingNumber}</span>
                              </span>
                            )}
                          </div>

                          {/* Stepper bar */}
                          <div className="relative flex items-center justify-between">
                            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-stone-200 z-0">
                              <div
                                className="h-full bg-[#9b7842] transition-all duration-500"
                                style={{
                                  width: step === 4 ? "100%" : step === 3 ? "66%" : step === 2 ? "33%" : "0%",
                                }}
                              />
                            </div>

                            {[
                              { label: "Order Confirmed", stepNum: 1 },
                              { label: "Crafting & Packing", stepNum: 2 },
                              { label: "Dispatched", stepNum: 3 },
                              { label: "Delivered", stepNum: 4 },
                            ].map((s) => {
                              const isCompleted = step >= s.stepNum;
                              return (
                                <div key={s.stepNum} className="relative z-10 flex flex-col items-center">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                      isCompleted
                                        ? "bg-[#9b7842] text-white shadow-sm"
                                        : "bg-white border-2 border-stone-300 text-stone-400"
                                    }`}
                                  >
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.stepNum}
                                  </div>
                                  <span className={`text-[10px] font-semibold mt-1.5 whitespace-nowrap ${
                                    isCompleted ? "text-[#151a22]" : "text-stone-400"
                                  }`}>
                                    {s.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="space-y-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                            Fittings & Materials in this Order ({order.items.length})
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#ede8df]"
                              >
                                <div className="w-14 h-14 rounded-lg bg-stone-100 relative overflow-hidden shrink-0">
                                  {item.image ? (
                                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                                  ) : (
                                    <Package className="w-6 h-6 text-stone-400 m-auto" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-[#151a22] truncate">{item.name}</p>
                                  <p className="text-[11px] text-stone-500">
                                    Finish: <span className="font-medium text-stone-800">{item.finish}</span> • SKU: {item.sku}
                                  </p>
                                  <p className="text-xs font-bold text-[#9b7842] mt-0.5">
                                    {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Footer & Help */}
                        <div className="pt-3 border-t border-[#ede8df] flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="text-stone-500">
                            <span>Payment: <strong className="text-stone-700">{order.paymentMethod}</strong> ({order.paymentStatus})</span>
                            {order.discount > 0 && (
                              <span className="ml-3 text-emerald-600 font-medium">
                                Saved: ₹{order.discount.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                          <a
                            href={`https://wa.me/919148003924?text=Hello%20Prakash%20Ceramics,%20inquiry%20regarding%20Order%20${encodeURIComponent(order.orderNumber)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#9b7842] hover:underline font-bold inline-flex items-center gap-1"
                          >
                            <span>Need dispatch update on WhatsApp</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SAVED ADDRESSES */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ede8df] mb-6">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#151a22]">Saved Project & Delivery Addresses</h2>
                  <p className="text-xs text-stone-500">
                    Store residence, office, and on-site villa delivery addresses for 1-click checkout
                  </p>
                </div>
                <button
                  onClick={openNewAddressModal}
                  className="inline-flex items-center gap-2 bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="py-16 text-center">
                  <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-base font-semibold text-stone-700">No saved addresses</p>
                  <p className="text-xs text-stone-400 mt-1 mb-5">
                    Save your primary residence or project site location to auto-fill at checkout.
                  </p>
                  <button
                    onClick={openNewAddressModal}
                    className="inline-flex items-center gap-2 bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Address</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        addr.isDefault
                          ? "bg-[#fcfbf9] border-[#9b7842] shadow-sm"
                          : "bg-white border-[#ede8df] hover:border-stone-400"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#9b7842] text-white">
                              Default
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-[#151a22] mt-2">{addr.fullName}</h3>
                        {addr.estateOrProject && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#9b7842] mt-1 bg-[#9b7842]/10 px-2.5 py-1 rounded-lg w-fit">
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{addr.estateOrProject}</span>
                          </div>
                        )}
                        <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                          {addr.address}
                        </p>
                        <p className="text-xs text-stone-600">
                          {addr.city}, {addr.state} - <strong className="font-mono">{addr.pincode}</strong>
                        </p>
                        {addr.landmark && (
                          <p className="text-[11px] text-stone-500 mt-1">Landmark: {addr.landmark}</p>
                        )}
                        <p className="text-xs text-stone-500 mt-2 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span>{addr.phone}</span>
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#ede8df] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditAddressModal(addr)}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-[#9b7842] hover:bg-stone-100 transition-colors cursor-pointer"
                            title="Edit Address"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAddressItem(addr.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {!addr.isDefault && (
                          <button
                            onClick={() => updateAddressItem(addr.id, { isDefault: true })}
                            className="text-[11px] font-bold text-[#9b7842] hover:underline cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE & SETTINGS */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl">
              <div className="pb-4 border-b border-[#ede8df] mb-6">
                <h2 className="text-xl font-serif font-bold text-[#151a22]">Profile & Personal Details</h2>
                <p className="text-xs text-stone-500">Manage your personal information and architectural preferences</p>
              </div>

              {profileSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{profileSuccess}</span>
                </motion.div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-[#151a22] focus:outline-none focus:border-[#9b7842]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Email Address (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full bg-stone-100 border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-stone-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-[#151a22] focus:outline-none focus:border-[#9b7842]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#f7f5f0] border border-[#ded5cb] text-xs text-stone-600 flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#9b7842] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#151a22] block mb-0.5">Project Destinations & Cities</span>
                    <span>City and real estate / villa project locations are stored and managed directly in your <strong>Saved Addresses</strong> tab for seamless checkout delivery.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="bg-[#1c1815] hover:bg-[#9b7842] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {profileSaving ? "Saving..." : "Save Profile Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Address Create / Edit Modal */}
      <AnimatePresence>
        {addressModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddressModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white border border-[#e5e0d8] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-auto text-[#151a22]"
            >
              <div className="pb-4 border-b border-[#ede8df] mb-5">
                <h3 className="text-lg font-serif font-bold text-[#151a22]">
                  {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
                </h3>
                <p className="text-xs text-stone-500">
                  Ensure accurate details for secure, damage-free transit of ceramics & brass fittings
                </p>
              </div>

              {addressError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addressError}</span>
                </div>
              )}

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 uppercase">Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      placeholder="e.g. Rajesh Malhotra"
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-3 py-2 text-xs text-[#151a22]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 uppercase">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      placeholder="+91 98101 23456"
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-3 py-2 text-xs text-[#151a22]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 uppercase">
                    Real Estate / Villa / Project Name (Optional)
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={addressForm.estateOrProject}
                      onChange={(e) => setAddressForm({ ...addressForm, estateOrProject: e.target.value })}
                      placeholder="e.g. DLF The Camellias / Palm Grove Estate / Villa 14"
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl pl-8 pr-3 py-2 text-xs text-[#151a22]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 uppercase">
                    Street Address / House / Plot No. *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                    placeholder="Tower 4, Apt 1802, DLF The Camellias, Golf Course Road"
                    className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-3 py-2 text-xs text-[#151a22]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 uppercase">City *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder="Gurugram"
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-3 py-2 text-xs text-[#151a22]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 uppercase">State *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      placeholder="Haryana"
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-3 py-2 text-xs text-[#151a22]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 uppercase">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      placeholder="122002"
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-3 py-2 text-xs text-[#151a22]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 uppercase">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={addressForm.landmark}
                      onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                      placeholder="Near Club House"
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-3 py-2 text-xs text-[#151a22]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 uppercase">Address Type</label>
                    <select
                      value={addressForm.label}
                      onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-3 py-2 text-xs text-[#151a22]"
                    >
                      <option value="Home">Home Residence</option>
                      <option value="Office">Studio / Office</option>
                      <option value="Site / Villa">Site / Villa Project</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 font-medium">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      className="rounded border-[#ded5cb] text-[#9b7842] focus:ring-[#9b7842]"
                    />
                    <span>Set as primary default delivery address</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ede8df]">
                  <button
                    type="button"
                    onClick={() => setAddressModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addressSubmitting}
                    className="bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {addressSubmitting ? "Saving..." : "Save Address"}
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

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbf9f7] pt-36 pb-24 text-center">
          <p className="text-xs text-stone-400">Loading your luxury client dashboard...</p>
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
