"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  MessageSquareText,
  Search,
  Filter,
  Eye,
  Calendar,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  Sparkles,
  Loader2,
  RefreshCw,
  Trash2,
  Building,
  User,
  ArrowUpRight,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx } from "clsx";

export interface AdminEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  preferredDate?: string | null;
  message: string;
  source: string;
  status: "New" | "Contacted" | "Scheduled" | "Completed" | "Archived";
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/enquiries");
      if (res.ok) {
        const data = await res.json();
        if (data.enquiries && Array.isArray(data.enquiries)) {
          setEnquiries(data.enquiries);
        }
      }
    } catch (err) {
      console.error("Failed to load enquiries", err);
      showToast("Could not load enquiries from server");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  useEffect(() => {
    if (selectedEnquiry) {
      setAdminNotesInput(selectedEnquiry.adminNotes || "");
    }
  }, [selectedEnquiry]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchEnquiries();
  };

  const updateEnquiryStatus = async (id: string, newStatus: AdminEnquiry["status"]) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast(`Status updated to "${newStatus}"`);
      } else {
        showToast("Failed to update enquiry status");
      }
    } catch {
      showToast("Network error updating status");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/enquiries/${selectedEnquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: adminNotesInput }),
      });

      if (res.ok) {
        const data = await res.json();
        setEnquiries((prev) =>
          prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, adminNotes: adminNotesInput } : e))
        );
        setSelectedEnquiry((prev) => (prev ? { ...prev, adminNotes: adminNotesInput } : null));
        showToast("Admin notes saved successfully!");
      } else {
        showToast("Failed to save notes");
      }
    } catch {
      showToast("Network error saving notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this consultation enquiry?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry(null);
        }
        showToast("Enquiry deleted successfully");
      } else {
        showToast("Failed to delete enquiry");
      }
    } catch {
      showToast("Network error deleting enquiry");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered Enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.projectType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || e.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesSource =
        sourceFilter === "all" || e.source.toLowerCase() === sourceFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [enquiries, searchQuery, statusFilter, sourceFilter]);

  // Metrics
  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === "New").length;
  const scheduledCount = enquiries.filter((e) => e.status === "Scheduled").length;
  const contactedCount = enquiries.filter((e) => e.status === "Contacted").length;
  const completedCount = enquiries.filter((e) => e.status === "Completed").length;

  const getStatusBadge = (status: AdminEnquiry["status"]) => {
    switch (status) {
      case "New":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Contacted":
        return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "Scheduled":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Completed":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Archived":
        return "bg-stone-700/40 text-stone-400 border-stone-600/40";
      default:
        return "bg-stone-800 text-stone-300 border-stone-700";
    }
  };

  const getCleanPhone = (phone: string) => {
    return phone.replace(/[^0-9]/g, "");
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#1e2533] border border-[#dec49a]/40 text-[#dec49a] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium"
          >
            <CheckCircle2 className="w-4 h-4 text-[#dec49a]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-1.5 rounded-lg bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/30">
              <MessageSquareText className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-widest text-[#dec49a] font-bold">
              Inbound Leads & Walkthroughs
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Consultation Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Real-time appointment bookings and technical bathware inquiries from the live storefront.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 bg-stone-900/80 hover:bg-stone-800 text-stone-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-stone-700 transition-all disabled:opacity-50"
            title="Refresh from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#dec49a] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141822] border border-stone-800 hover:border-stone-700 transition-all">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Total Inquiries</span>
            <MessageSquareText className="w-4 h-4 text-stone-400" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {isLoading ? "-" : totalCount}
            </h3>
            <p className="text-[11px] text-stone-400 mt-1">All home & contact leads</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141822] border border-amber-900/40 hover:border-amber-700/50 transition-all">
          <div className="flex items-center justify-between text-amber-300 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              New / Pending
            </span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-amber-300 tracking-tight">
              {isLoading ? "-" : newCount}
            </h3>
            <p className="text-[11px] text-amber-400/80 mt-1">Awaiting concierge follow-up</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141822] border border-purple-900/40 hover:border-purple-700/50 transition-all">
          <div className="flex items-center justify-between text-purple-300 text-xs font-semibold">
            <span>Scheduled Tours</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-purple-300 tracking-tight">
              {isLoading ? "-" : scheduledCount}
            </h3>
            <p className="text-[11px] text-purple-400/80 mt-1">Confirmed showroom slots</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141822] border border-emerald-900/40 hover:border-emerald-700/50 transition-all">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-semibold">
            <span>Completed / Converted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-emerald-300 tracking-tight">
              {isLoading ? "-" : completedCount}
            </h3>
            <p className="text-[11px] text-emerald-400/80 mt-1">Consultation completed</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800 space-y-4">
        {/* Search Input & Source selector */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client name, phone, email, project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1017] border border-stone-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#9b7842]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-medium whitespace-nowrap">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-[#0d1017] border border-stone-700 text-xs text-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#9b7842]"
            >
              <option value="all">All Sources</option>
              <option value="Home Page Consultation">Home Page Consultation</option>
              <option value="Contact Page">Contact Page</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-stone-800/80 pt-3">
          {[
            { id: "all", label: "All Enquiries", count: totalCount },
            { id: "new", label: "New", count: newCount },
            { id: "contacted", label: "Contacted", count: contactedCount },
            { id: "scheduled", label: "Scheduled", count: scheduledCount },
            { id: "completed", label: "Completed", count: completedCount },
            { id: "archived", label: "Archived", count: enquiries.filter((e) => e.status === "Archived").length },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={clsx(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2",
                  active
                    ? "bg-[#9b7842] text-white shadow-md shadow-[#9b7842]/20"
                    : "text-stone-400 hover:text-white bg-stone-900/60 hover:bg-stone-800"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={clsx(
                    "text-[10px] px-1.5 py-0.2 rounded-md font-mono",
                    active ? "bg-black/30 text-white" : "bg-stone-800 text-stone-400"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enquiries Table / List */}
      <div className="rounded-2xl bg-[#141822] border border-stone-800 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-stone-400 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#dec49a]" />
            <span className="text-xs uppercase tracking-widest font-semibold">
              Loading Enquiries from Database...
            </span>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-16 text-center text-stone-400 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-stone-800/80 border border-stone-700 flex items-center justify-center text-stone-500 mb-3">
              <MessageSquareText className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">No enquiries found</h4>
            <p className="text-xs text-stone-400 max-w-sm">
              {searchQuery || statusFilter !== "all" || sourceFilter !== "all"
                ? "Try clearing your filters or search term to see more submissions."
                : "When clients submit the Home Page or Contact Page consultation forms, they will show up here instantly."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-[#0f131c] text-stone-400 uppercase tracking-wider text-[10px] font-semibold border-b border-stone-800">
                <tr>
                  <th className="px-5 py-3.5">Client & Contact</th>
                  <th className="px-5 py-3.5">Project Scope</th>
                  <th className="px-5 py-3.5">Preferred Date</th>
                  <th className="px-5 py-3.5">Source</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date Received</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredEnquiries.map((enquiry) => {
                  const initials = enquiry.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  const cleanPhone = getCleanPhone(enquiry.phone);

                  return (
                    <tr
                      key={enquiry.id}
                      className="hover:bg-stone-800/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedEnquiry(enquiry)}
                    >
                      {/* Client info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9b7842]/30 to-[#6a5028]/30 border border-[#dec49a]/30 text-[#dec49a] flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-white group-hover:text-[#dec49a] transition-colors">
                              {enquiry.name}
                            </p>
                            <p className="text-[11px] text-stone-400">{enquiry.phone}</p>
                            {enquiry.email && (
                              <p className="text-[10px] text-stone-400 truncate max-w-[180px]">
                                {enquiry.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Project Scope */}
                      <td className="px-5 py-4">
                        <div className="space-y-1 max-w-xs">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-stone-800 text-[#dec49a] border border-stone-700 text-[10px] font-semibold">
                            {enquiry.projectType}
                          </span>
                          <p className="text-[11px] text-stone-300 line-clamp-2">
                            {enquiry.message || "No specific notes provided"}
                          </p>
                        </div>
                      </td>

                      {/* Preferred Date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {enquiry.preferredDate ? (
                          <div className="flex items-center gap-1.5 text-stone-200">
                            <Calendar className="w-3.5 h-3.5 text-[#dec49a]" />
                            <span className="font-medium">{enquiry.preferredDate}</span>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">Immediate / Flexible</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border",
                            enquiry.source === "Home Page Consultation"
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                              : "bg-blue-500/10 text-blue-300 border-blue-500/20"
                          )}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{enquiry.source}</span>
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-5 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={enquiry.status}
                          onChange={(e) =>
                            updateEnquiryStatus(enquiry.id, e.target.value as AdminEnquiry["status"])
                          }
                          className={clsx(
                            "text-[11px] font-semibold rounded-lg px-2.5 py-1 border focus:outline-none transition-colors cursor-pointer",
                            getStatusBadge(enquiry.status)
                          )}
                        >
                          <option value="New" className="bg-[#141822] text-amber-300">
                            ● New
                          </option>
                          <option value="Contacted" className="bg-[#141822] text-sky-300">
                            ● Contacted
                          </option>
                          <option value="Scheduled" className="bg-[#141822] text-purple-300">
                            ● Scheduled
                          </option>
                          <option value="Completed" className="bg-[#141822] text-emerald-300">
                            ● Completed
                          </option>
                          <option value="Archived" className="bg-[#141822] text-stone-400">
                            ● Archived
                          </option>
                        </select>
                      </td>

                      {/* Date Received */}
                      <td className="px-5 py-4 whitespace-nowrap text-stone-400 text-[11px]">
                        {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        <span className="block text-[10px] text-stone-400 font-mono">
                          {new Date(enquiry.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Quick Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp button */}
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}?text=${encodeURIComponent(
                                `Hello ${enquiry.name}, thank you for contacting Parkash Ceramics regarding your ${enquiry.projectType} inquiry.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Phone Call */}
                          <a
                            href={`tel:${enquiry.phone}`}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-colors"
                            title="Call client"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          {/* View details */}
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Enquiry Details Modal */}
      <AnimatePresence>
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEnquiry(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-screen max-w-xl bg-[#121620] border-l border-stone-800 text-stone-200 shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-[#151a24]">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#dec49a] font-bold block mb-1">
                      Consultation Request Details
                    </span>
                    <h3 className="text-lg font-serif font-bold text-white">
                      {selectedEnquiry.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Status & Source Banner */}
                  <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">
                        Current Status
                      </span>
                      <div className="mt-1">
                        <select
                          value={selectedEnquiry.status}
                          onChange={(e) =>
                            updateEnquiryStatus(
                              selectedEnquiry.id,
                              e.target.value as AdminEnquiry["status"]
                            )
                          }
                          className={clsx(
                            "text-xs font-semibold rounded-lg px-3 py-1.5 border focus:outline-none cursor-pointer",
                            getStatusBadge(selectedEnquiry.status)
                          )}
                        >
                          <option value="New" className="bg-[#141822] text-amber-300">
                            ● New
                          </option>
                          <option value="Contacted" className="bg-[#141822] text-sky-300">
                            ● Contacted
                          </option>
                          <option value="Scheduled" className="bg-[#141822] text-purple-300">
                            ● Scheduled
                          </option>
                          <option value="Completed" className="bg-[#141822] text-emerald-300">
                            ● Completed
                          </option>
                          <option value="Archived" className="bg-[#141822] text-stone-400">
                            ● Archived
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">
                        Submitted Via
                      </span>
                      <span className="text-xs text-[#dec49a] font-medium block mt-1">
                        {selectedEnquiry.source}
                      </span>
                    </div>
                  </div>

                  {/* Direct Contact Actions */}
                  <div>
                    <span className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider block mb-2">
                      Direct Concierge Outreach
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {/* WhatsApp */}
                      <a
                        href={`https://wa.me/${getCleanPhone(selectedEnquiry.phone).startsWith("91") ? getCleanPhone(selectedEnquiry.phone) : "91" + getCleanPhone(selectedEnquiry.phone)}?text=${encodeURIComponent(
                          `Hello ${selectedEnquiry.name}, thank you for reaching out to Parkash Ceramics regarding your ${selectedEnquiry.projectType} consultation.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all flex flex-col items-center justify-center gap-1.5 text-center font-medium text-xs"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Phone */}
                      <a
                        href={`tel:${selectedEnquiry.phone}`}
                        className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition-all flex flex-col items-center justify-center gap-1.5 text-center font-medium text-xs"
                      >
                        <Phone className="w-4 h-4 text-blue-400" />
                        <span>Call Phone</span>
                      </a>

                      {/* Email */}
                      <a
                        href={`mailto:${selectedEnquiry.email}?subject=Parkash Ceramics Luxury Bath Consultation&body=Hello ${selectedEnquiry.name},`}
                        className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all flex flex-col items-center justify-center gap-1.5 text-center font-medium text-xs"
                      >
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span>Email</span>
                      </a>
                    </div>
                  </div>

                  {/* Client Details Card */}
                  <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800 space-y-3">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                      Client Information
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[10px]">Full Name</span>
                        <span className="text-white font-medium">{selectedEnquiry.name}</span>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[10px]">Phone Number</span>
                        <span className="text-white font-medium">{selectedEnquiry.phone}</span>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[10px]">Email Address</span>
                        <span className="text-white font-medium">
                          {selectedEnquiry.email || "Not specified"}
                        </span>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[10px]">Project Classification</span>
                        <span className="text-[#dec49a] font-medium">{selectedEnquiry.projectType}</span>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="text-stone-400 block text-[10px]">Preferred Tour / Consultation Date</span>
                        <span className="text-white font-medium">
                          {selectedEnquiry.preferredDate || "Immediate / Open Schedule"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Consultation Scope & Notes */}
                  <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800 space-y-2">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                      Client Message & Fittings of Interest
                    </span>
                    <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800/80 text-xs text-stone-200 leading-relaxed font-sans whitespace-pre-wrap">
                      {selectedEnquiry.message || "No specific fittings or notes were entered."}
                    </div>
                  </div>

                  {/* Internal Admin Notes */}
                  <div className="p-4 rounded-2xl bg-[#141822] border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#dec49a] uppercase tracking-wider block">
                        Internal Concierge Notes
                      </span>
                      <span className="text-[10px] text-stone-400">Private to admin</span>
                    </div>
                    <textarea
                      rows={3}
                      value={adminNotesInput}
                      onChange={(e) => setAdminNotesInput(e.target.value)}
                      placeholder="Add followup notes, architect requirements, showroom appointment time, quotation status..."
                      className="w-full bg-[#0d1017] border border-stone-700 rounded-xl p-3 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#9b7842] resize-none"
                    />
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={handleSaveNotes}
                        disabled={isSavingNotes}
                        className="bg-[#9b7842] hover:bg-[#aa864e] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isSavingNotes ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save Notes</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="text-[11px] text-stone-400 flex items-center justify-between px-1">
                    <span>
                      Received:{" "}
                      {new Date(selectedEnquiry.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                    <span>ID: {selectedEnquiry.id}</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 border-t border-stone-800 bg-[#151a24] flex items-center justify-between">
                  <button
                    onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Enquiry</span>
                  </button>

                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
