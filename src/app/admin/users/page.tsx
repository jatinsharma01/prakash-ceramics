"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Mail,
  Phone,
  Building2,
  Eye,
  CheckCircle2,
  UserPlus,
  Download,
  ShieldCheck,
  X,
  MapPin,
  DollarSign,
  Calendar,
  Trash2,
  Loader2,
  Plus,
  ShoppingBag,
  Truck,
  ExternalLink,
  ShoppingCart,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdminOrder } from "@/lib/adminData";

export interface AdminUserAddress {
  id: string;
  fullName: string;
  phone: string;
  estateOrProject?: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string | null;
  label: string;
  isDefault: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: "Active" | "Inactive";
  joinedDate: string;
  lastOrderDate?: string;
  company?: string;
  addresses?: AdminUserAddress[];
  orders?: AdminOrder[];
  cart?: any[];
  wishlist?: any[];
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "with-orders" | "with-addresses">("all");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New User Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCity, setNewCity] = useState("Delhi NCR");
  const [newCompany, setNewCompany] = useState("");
  const [newStatus, setNewStatus] = useState<AdminUser["status"]>("Active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        }
      }
    } catch (err) {
      console.error("Failed to load registered users from API", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPhone.trim()) {
      showToast("Please fill in Name, Email, and Phone");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim(),
          phone: newPhone.trim(),
          city: newCity,
          company: newCompany.trim() || undefined,
          status: newStatus,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUsers((prev) => [data.user, ...prev]);
        }
        setIsCreateModalOpen(false);
        setNewName("");
        setNewEmail("");
        setNewPhone("");
        setNewCompany("");
        showToast("Client account created in database successfully!");
      } else {
        const errData = await res.json();
        showToast(errData.message || "Failed to create account");
      }
    } catch (err) {
      showToast("Error creating account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove registered account for "${name}"?`)) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        showToast(`Account for "${name}" deleted`);
      } else {
        showToast("Failed to delete account");
      }
    } catch (err) {
      showToast("Error deleting account");
    }
  };

  const exportToCSV = () => {
    if (users.length === 0) {
      showToast("No registered client data available to export");
      return;
    }
    const headers = ["Name", "Email", "Phone", "City", "Company", "Total Orders", "Total Spent (INR)", "Addresses Count", "Joined Date"];
    const rows = users.map((u) => [
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.phone}"`,
      `"${u.city}"`,
      `"${u.company || ""}"`,
      u.totalOrders,
      u.totalSpent,
      u.addresses?.length || 0,
      `"${u.joinedDate}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `parkash_registered_clients_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Client directory exported successfully!");
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery) ||
        u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.company && u.company.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter =
        filterType === "all" ||
        (filterType === "with-orders" && (u.totalOrders || 0) > 0) ||
        (filterType === "with-addresses" && (u.addresses?.length || 0) > 0);

      return matchesSearch && matchesFilter;
    });
  }, [users, searchQuery, filterType]);

  const totalClients = users.length;
  const clientsWithOrders = users.filter((u) => (u.totalOrders || 0) > 0).length;
  const totalLTV = users.reduce((acc, curr) => acc + (curr.totalSpent || 0), 0);

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
              Registered Clients & Architects
            </span>
            <span className="text-stone-400 text-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Live Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
            Registered Clients Directory
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Live database of customers who registered on the website, along with their saved project addresses and order history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#9b7842]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Client Account</span>
          </button>
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-stone-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#dec49a]" />
            <span>Export Accounts</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-300">Registered Accounts</p>
            {isLoading ? (
              <div className="h-6 bg-stone-800 rounded animate-pulse w-24 mt-1" />
            ) : (
              <p className="text-xl font-bold text-white mt-1">{totalClients} Registered</p>
            )}
          </div>
          <div className="p-2.5 rounded-xl bg-stone-800 text-[#dec49a]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-300">Clients with Orders</p>
            {isLoading ? (
              <div className="h-6 bg-stone-800 rounded animate-pulse w-24 mt-1" />
            ) : (
              <p className="text-xl font-bold text-amber-400 mt-1">{clientsWithOrders} Active Buyers</p>
            )}
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-300">Aggregate Client Spend</p>
            {isLoading ? (
              <div className="h-6 bg-stone-800 rounded animate-pulse w-28 mt-1" />
            ) : (
              <p className="text-xl font-bold text-emerald-400 mt-1">
                ₹{totalLTV >= 100000 ? `${(totalLTV / 100000).toFixed(2)} Lakhs` : totalLTV.toLocaleString("en-IN")}
              </p>
            )}
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email, phone, or city..."
              className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 pl-10 pr-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
            />
          </div>

          {/* Quick Segment Filter Buttons */}
          <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${filterType === "all"
                  ? "bg-[#9b7842] text-white font-semibold"
                  : "text-stone-400 hover:text-white"
                }`}
            >
              All Clients ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("with-addresses")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${filterType === "with-addresses"
                  ? "bg-[#9b7842] text-white font-semibold"
                  : "text-stone-400 hover:text-white"
                }`}
            >
              With Saved Addresses
            </button>
            <button
              type="button"
              onClick={() => setFilterType("with-orders")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${filterType === "with-orders"
                  ? "bg-[#9b7842] text-white font-semibold"
                  : "text-stone-400 hover:text-white"
                }`}
            >
              With Orders ({clientsWithOrders})
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-[#141822] border border-stone-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#dec49a]" />
              <p className="text-xs text-stone-400">Loading registered clients from database...</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-900/80 border-b border-stone-800 text-stone-300 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="p-4">Client Profile</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">City / Region</th>
                  <th className="p-4">Saved Addresses</th>
                  <th className="p-4">Live Cart & Wishlist</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4">Lifetime Spend</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-stone-400">
                      No registered clients found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const addressesCount = u.addresses?.length || 0;
                    return (
                      <tr key={u.id} className="hover:bg-stone-800/40 transition-colors group">
                        {/* Profile */}
                        <td className="p-4">
                          <Link href={`/admin/users/${u.id}`} className="flex items-center gap-3 group/client">
                            <img
                              src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                              alt={u.name}
                              className="w-10 h-10 rounded-xl object-cover border border-[#9b7842]/40 group-hover/client:border-[#dec49a] transition-colors shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-white group-hover/client:text-[#dec49a] transition-colors">
                                {u.name}
                              </p>
                              {u.company && (
                                <p className="text-[11px] text-stone-400 truncate flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-stone-500" />
                                  {u.company}
                                </p>
                              )}
                            </div>
                          </Link>
                        </td>

                        {/* Contact */}
                        <td className="p-4">
                          <p className="text-white font-medium">{u.email}</p>
                          <p className="text-[11px] text-stone-400">{u.phone}</p>
                        </td>

                        {/* City */}
                        <td className="p-4 text-stone-300">
                          <p className="font-medium text-white">{u.city}</p>
                          <span className="text-[10px] text-stone-500">
                            Joined {u.joinedDate}
                          </span>
                        </td>

                        {/* Saved Addresses Count Badge */}
                        <td className="p-4">
                          <Link
                            href={`/admin/users/${u.id}?tab=addresses`}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                              addressesCount > 0
                                ? "bg-[#9b7842]/15 text-[#dec49a] border border-[#9b7842]/30 hover:bg-[#9b7842]/25"
                                : "bg-stone-800 text-stone-400 border border-stone-700 hover:text-stone-200"
                            }`}
                            title="Click to view client project addresses"
                          >
                            <MapPin className="w-3 h-3 text-[#dec49a]" />
                            <span>{addressesCount > 0 ? `${addressesCount} Saved` : "None"}</span>
                          </Link>
                        </td>

                        {/* Live Database Cart & Saved Wishlist Badges */}
                        <td className="p-4">
                          <div className="flex flex-col gap-1.5">
                            <Link
                              href={`/admin/users/${u.id}?tab=cart`}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold w-fit transition-all ${
                                (u.cart?.length || 0) > 0
                                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
                                  : "bg-stone-900 text-stone-500 border border-stone-800 hover:text-stone-400"
                              }`}
                              title="View client database cart"
                            >
                              <ShoppingCart className="w-3 h-3 text-amber-400" />
                              <span>Cart: {u.cart?.length || 0}</span>
                            </Link>

                            <Link
                              href={`/admin/users/${u.id}?tab=wishlist`}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold w-fit transition-all ${
                                (u.wishlist?.length || 0) > 0
                                  ? "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25"
                                  : "bg-stone-900 text-stone-500 border border-stone-800 hover:text-stone-400"
                              }`}
                              title="View client saved wishlist"
                            >
                              <Heart className="w-3 h-3 text-rose-400" />
                              <span>Wishlist: {u.wishlist?.length || 0}</span>
                            </Link>
                          </div>
                        </td>

                        {/* Total Orders - Clickable to View Orders */}
                        <td className="p-4">
                          <Link
                            href={`/admin/users/${u.id}?tab=orders`}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                              (u.totalOrders || 0) > 0
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                                : "bg-stone-800 text-stone-400 border border-stone-700 hover:text-stone-200"
                            }`}
                            title="Click to view client orders page"
                          >
                            <ShoppingBag className="w-3 h-3 text-amber-400" />
                            <span>{u.totalOrders || 0} Orders</span>
                          </Link>
                          <p className="text-[10px] text-stone-400 mt-1">
                            Last: {u.lastOrderDate || u.joinedDate}
                          </p>
                        </td>

                        {/* Lifetime Spend */}
                        <td className="p-4">
                          <p className="font-bold text-white">
                            ₹{(u.totalSpent || 0).toLocaleString("en-IN")}
                          </p>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            {(u.totalSpent || 0) > 100000 ? "Active Volume" : "Verified Client"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/users/${u.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-[#9b7842] text-stone-200 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                              title="Open client orders and details page"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="p-1.5 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 transition-colors cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create User Modal */}
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
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/30">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Add New Client Account</h3>
                    <p className="text-xs text-stone-400">Register a new client directly into the database</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Ar. Rahul Mehta"
                    className="w-full bg-[#1c222c] border border-stone-700 text-white rounded-xl px-3.5 py-2.5 focus:border-[#9b7842] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="rahul@studiomehta.com"
                      className="w-full bg-[#1c222c] border border-stone-700 text-white rounded-xl px-3.5 py-2.5 focus:border-[#9b7842] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+91 98123 45678"
                      className="w-full bg-[#1c222c] border border-stone-700 text-white rounded-xl px-3.5 py-2.5 focus:border-[#9b7842] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1.5">City / Region</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="e.g. Delhi NCR, Mumbai"
                      className="w-full bg-[#1c222c] border border-stone-700 text-white rounded-xl px-3.5 py-2.5 focus:border-[#9b7842] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1.5">Studio / Company (Optional)</label>
                    <input
                      type="text"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      placeholder="e.g. Mehta Design Studio"
                      className="w-full bg-[#1c222c] border border-stone-700 text-white rounded-xl px-3.5 py-2.5 focus:border-[#9b7842] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1.5">Account Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-[#1c222c] border border-stone-700 text-white rounded-xl px-3.5 py-2.5 focus:border-[#9b7842] focus:outline-hidden"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white font-bold shadow-lg shadow-[#9b7842]/20 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save to Database</span>
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
