"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Building2, 
  Award, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  UserPlus, 
  Download, 
  ShieldCheck, 
  X, 
  MapPin, 
  DollarSign,
  Calendar
} from "lucide-react";
import { ADMIN_USERS, AdminUser } from "@/lib/adminData";
import { motion, AnimatePresence } from "motion/react";

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery) ||
        u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.company && u.company.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTier =
        tierFilter === "all" ||
        u.tier.toLowerCase().includes(tierFilter.toLowerCase());

      return matchesSearch && matchesTier;
    });
  }, [users, searchQuery, tierFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalClients = users.length;
  const vipCount = users.filter((u) => u.tier === "VIP Architect").length;
  const totalLTV = users.reduce((acc, curr) => acc + curr.totalSpent, 0);

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
              Trade Accounts & Homeowners
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
            Client & Architect Directory
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Manage certified architect accounts, commercial developers, and high-net-worth clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Exporting Architect Directory (CSV)...")}
            className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-stone-700 transition-all"
          >
            <Download className="w-4 h-4 text-[#dec49a]" />
            <span>Export Accounts</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-300">Registered Accounts</p>
            <p className="text-xl font-bold text-white mt-1">1,240 Clients</p>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-800 text-[#dec49a]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-300">VIP Architect Studios</p>
            <p className="text-xl font-bold text-amber-400 mt-1">142 Studios</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-300">Aggregate Client Spend</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              ₹{(totalLTV / 100000).toFixed(2)} Lakhs
            </p>
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
              placeholder="Search by client name, studio, email, or city..."
              className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 pl-10 pr-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
            />
          </div>

          {/* Tier Tabs */}
          <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs overflow-x-auto">
            <button
              onClick={() => setTierFilter("all")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                tierFilter === "all"
                  ? "bg-[#9b7842] text-white font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              All Accounts
            </button>
            <button
              onClick={() => setTierFilter("architect")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                tierFilter === "architect"
                  ? "bg-[#9b7842] text-white font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              VIP Architects
            </button>
            <button
              onClick={() => setTierFilter("contractor")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                tierFilter === "contractor"
                  ? "bg-[#9b7842] text-white font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Contractors
            </button>
            <button
              onClick={() => setTierFilter("homeowner")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                tierFilter === "homeowner"
                  ? "bg-[#9b7842] text-white font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Homeowners
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-[#141822] border border-stone-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-900/80 border-b border-stone-800 text-stone-300 font-semibold uppercase text-[10px] tracking-wider">
                <th className="p-4">Client Profile</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">City / Region</th>
                <th className="p-4">Account Tier</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    No client accounts match your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-800/40 transition-colors group">
                    {/* Profile */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#9b7842]/40 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white group-hover:text-[#dec49a] transition-colors">
                            {u.name}
                          </p>
                          {u.company && (
                            <p className="text-[11px] text-stone-400 truncate flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-stone-500" />
                              {u.company}
                            </p>
                          )}
                        </div>
                      </div>
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
                        Joined {new Date(u.joinedDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      </span>
                    </td>

                    {/* Tier */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.tier === "VIP Architect"
                            ? "bg-amber-500/15 text-[#dec49a] border border-[#9b7842]/40"
                            : u.tier === "Commercial Contractor"
                            ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                            : "bg-stone-800 text-stone-300 border border-stone-700"
                        }`}
                      >
                        {u.tier === "VIP Architect" && <Sparkles className="w-3 h-3 text-[#dec49a]" />}
                        {u.tier}
                      </span>
                    </td>

                    {/* Total Orders */}
                    <td className="p-4">
                      <p className="font-semibold text-white">{u.totalOrders} Orders</p>
                      <p className="text-[10px] text-stone-400">
                        Last on {u.lastOrderDate}
                      </p>
                    </td>

                    {/* Lifetime Spend */}
                    <td className="p-4">
                      <p className="font-bold text-white">
                        ₹{u.totalSpent.toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        A-Grade Volume
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-[#9b7842] text-stone-300 hover:text-white font-semibold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-[#141822] border border-stone-700 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6"
            >
              <div className="flex items-start justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#9b7842]/50"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{selectedUser.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/30">
                        {selectedUser.status}
                      </span>
                    </div>
                    {selectedUser.company && (
                      <p className="text-xs text-stone-400 mt-0.5">{selectedUser.company}</p>
                    )}
                    <p className="text-xs text-[#dec49a] font-semibold mt-1">
                      {selectedUser.tier}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
                <div>
                  <span className="text-stone-400">Total Projects Sourced</span>
                  <p className="text-base font-bold text-white mt-0.5">
                    {selectedUser.totalOrders} Orders
                  </p>
                </div>
                <div>
                  <span className="text-stone-400">Total Lifetime Value</span>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">
                    ₹{selectedUser.totalSpent.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span className="text-stone-400">Account Origin</span>
                  <p className="text-xs font-semibold text-stone-200 mt-0.5">
                    Member since {selectedUser.joinedDate}
                  </p>
                </div>
                <div>
                  <span className="text-stone-400">Regional HQ</span>
                  <p className="text-xs font-semibold text-stone-200 mt-0.5">
                    {selectedUser.city}, India
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900/40 border border-stone-800">
                  <div className="flex items-center gap-2 text-stone-300">
                    <Mail className="w-4 h-4 text-[#dec49a]" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <button
                    onClick={() => showToast(`Drafting enquiry email to ${selectedUser.email}`)}
                    className="text-[#dec49a] hover:underline font-semibold"
                  >
                    Compose
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900/40 border border-stone-800">
                  <div className="flex items-center gap-2 text-stone-300">
                    <Phone className="w-4 h-4 text-[#dec49a]" />
                    <span>{selectedUser.phone}</span>
                  </div>
                  <button
                    onClick={() => showToast(`Initiating call prompt to ${selectedUser.phone}`)}
                    className="text-[#dec49a] hover:underline font-semibold"
                  >
                    Call Client
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    showToast("Architect VIP trade pricing credentials dispatched!");
                  }}
                  className="px-4 py-2 rounded-xl bg-[#9b7842] hover:bg-[#836433] text-white text-xs font-bold shadow-md"
                >
                  Send Trade Catalog & Spec Book
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
