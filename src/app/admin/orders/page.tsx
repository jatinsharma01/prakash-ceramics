"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  Download,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  X,
  ChevronRight,
  Printer,
  Sparkles,
  PackageCheck,
  Loader2
} from "lucide-react";
import { AdminOrder } from "@/lib/adminData";
import { motion, AnimatePresence } from "motion/react";

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchOrders = React.useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      }
    } catch (err) {
      console.error("Failed to load orders from API", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("search") || params.get("q") || params.get("orderNumber");
      if (q) {
        setSearchQuery(q);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [modalTrackingInput, setModalTrackingInput] = useState("");

  React.useEffect(() => {
    if (selectedOrder) {
      setModalTrackingInput(selectedOrder.trackingNumber || "");
    }
  }, [selectedOrder]);

  const updateOrder = async (
    orderId: string,
    updates: {
      fulfillmentStatus?: string;
      paymentStatus?: string;
      trackingNumber?: string;
    }
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, ...updates } as AdminOrder : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, ...updates } as AdminOrder : null));
        }
        const updatedLabel = updates.paymentStatus
          ? `Payment status updated to ${updates.paymentStatus}`
          : updates.fulfillmentStatus
            ? `Fulfillment status updated to ${updates.fulfillmentStatus}`
            : "Tracking details saved";
        showToast(updatedLabel);
      } else {
        showToast("Failed to update order");
      }
    } catch (err) {
      showToast("Error updating order");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order: AdminOrder) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((i: any) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        order.fulfillmentStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const totalOrdersCount = orders.length;
  const processingCount = orders.filter((o) => o.fulfillmentStatus === "Processing").length;
  const shippedCount = orders.filter((o) => o.fulfillmentStatus === "Shipped").length;
  const deliveredCount = orders.filter((o) => o.fulfillmentStatus === "Delivered").length;

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
              Fulfillment & Dispatch
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
            Client Order Management
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Track luxury bathware dispatches, verified bank wires, and architect consignments.
          </p>
        </div>

        <button
          onClick={() => showToast("Exporting Orders Manifest (CSV)...")}
          className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-stone-700 transition-all self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-[#dec49a]" />
          <span>Export All Orders</span>
        </button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800">
          <p className="text-xs text-stone-300">Total Recorded Orders</p>
          <p className="text-xl font-bold text-white mt-1">{totalOrdersCount} Consignments</p>
        </div>
        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800">
          <p className="text-xs text-stone-300">Processing & Pack</p>
          <p className="text-xl font-bold text-amber-400 mt-1">{processingCount} Pending Dispatch</p>
        </div>
        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800">
          <p className="text-xs text-stone-300">In-Transit Freight</p>
          <p className="text-xl font-bold text-blue-400 mt-1">{shippedCount} On The Road</p>
        </div>
        <div className="p-4 rounded-xl bg-[#141822] border border-stone-800">
          <p className="text-xs text-stone-300">Successfully Delivered</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">{deliveredCount} Sites Completed</p>
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
              placeholder="Search by Order ID, customer, city, or product..."
              className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 pl-10 pr-4 py-2.5 rounded-xl focus:border-[#9b7842] focus:outline-hidden"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs overflow-x-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${statusFilter === "all"
                  ? "bg-[#9b7842] text-white font-semibold"
                  : "text-stone-400 hover:text-white"
                }`}
            >
              All ({totalOrdersCount})
            </button>
            <button
              onClick={() => setStatusFilter("processing")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${statusFilter === "processing"
                  ? "bg-amber-600 text-white font-semibold"
                  : "text-stone-400 hover:text-white"
                }`}
            >
              Processing ({processingCount})
            </button>
            <button
              onClick={() => setStatusFilter("shipped")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${statusFilter === "shipped"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-stone-400 hover:text-white"
                }`}
            >
              Shipped ({shippedCount})
            </button>
            <button
              onClick={() => setStatusFilter("delivered")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${statusFilter === "delivered"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-stone-400 hover:text-white"
                }`}
            >
              Delivered ({deliveredCount})
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#141822] border border-stone-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-900/80 border-b border-stone-800 text-stone-300 font-semibold uppercase text-[10px] tracking-wider">
                <th className="p-4">Order Details</th>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Items Summary</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-[#dec49a]" />
                      <p className="text-xs text-stone-400">Loading orders from database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    No orders match your filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-800/40 transition-colors group">
                    {/* Order ID & Date */}
                    <td className="p-4">
                      <p className="font-mono font-bold text-[#dec49a]">
                        {order.orderNumber}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {new Date(order.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <p className="font-semibold text-white">{order.customer.name}</p>
                      <p className="text-[11px] text-stone-400">
                        {order.customer.city}, {order.customer.state}
                      </p>
                      <p className="text-[10px] text-stone-500">{order.customer.phone}</p>
                    </td>

                    {/* Items Thumbnails & Count */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 overflow-hidden">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image}
                              alt={item.name}
                              className="inline-block w-8 h-8 rounded-lg object-cover ring-2 ring-[#141822] bg-stone-900"
                            />
                          ))}
                        </div>
                        <span className="text-stone-300 font-medium">
                          {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} pcs
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-4">
                      <p className="font-bold text-white">
                        ₹{order.total.toLocaleString("en-IN")}
                      </p>
                      {order.discount > 0 && (
                        <span className="text-[10px] text-emerald-400">
                          -₹{order.discount.toLocaleString("en-IN")} coupon
                        </span>
                      )}
                    </td>

                    {/* Payment */}
                    <td className="p-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updateOrder(order.id, { paymentStatus: e.target.value })}
                        className={`text-[10px] font-bold rounded-lg px-2 py-1 border transition-all cursor-pointer focus:outline-none ${order.paymentStatus === "Paid"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : order.paymentStatus === "Pending"
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              : order.paymentStatus === "Refunded"
                                ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                                : "bg-red-500/15 text-red-300 border-red-500/30"
                          }`}
                      >
                        <option value="Paid" className="bg-stone-900 text-emerald-300">Paid</option>
                        <option value="Pending" className="bg-stone-900 text-amber-300">Pending</option>
                        <option value="Refunded" className="bg-stone-900 text-purple-300">Refunded</option>
                        <option value="Failed" className="bg-stone-900 text-red-300">Failed</option>
                      </select>
                      <p className="text-[10px] text-stone-400 mt-1">
                        {order.paymentMethod}
                      </p>
                    </td>

                    {/* Fulfillment Status */}
                    <td className="p-4">
                      <select
                        value={order.fulfillmentStatus}
                        onChange={(e) => updateOrder(order.id, { fulfillmentStatus: e.target.value })}
                        className={`text-[10px] font-bold rounded-lg px-2.5 py-1 border transition-all cursor-pointer focus:outline-none ${order.fulfillmentStatus === "Delivered"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : order.fulfillmentStatus === "Shipped"
                              ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                              : order.fulfillmentStatus === "Processing"
                                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                : "bg-red-500/15 text-red-300 border-red-500/30"
                          }`}
                      >
                        <option value="Processing" className="bg-stone-900 text-amber-300">Processing</option>
                        <option value="Shipped" className="bg-stone-900 text-blue-300">Shipped</option>
                        <option value="Delivered" className="bg-stone-900 text-emerald-300">Delivered</option>
                        <option value="Cancelled" className="bg-stone-900 text-red-300">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-[#9b7842] text-stone-300 hover:text-white font-semibold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal / Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-3xl bg-[#141822] border border-stone-700 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#dec49a]">
                      {selectedOrder.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${selectedOrder.fulfillmentStatus === "Delivered"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                        }`}
                    >
                      {selectedOrder.fulfillmentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Placed on {new Date(selectedOrder.date).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast("Printing Tax Invoice...")}
                    className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                    title="Print Invoice"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Customer & Shipping Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800 text-xs">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-stone-400 mb-2">
                    Client Details
                  </h4>
                  <p className="font-semibold text-white text-sm">{selectedOrder.customer.name}</p>
                  <p className="text-stone-400 flex items-center gap-1.5 mt-1">
                    <Mail className="w-3.5 h-3.5 text-[#dec49a]" />
                    {selectedOrder.customer.email}
                  </p>
                  <p className="text-stone-400 flex items-center gap-1.5 mt-1">
                    <Phone className="w-3.5 h-3.5 text-[#dec49a]" />
                    {selectedOrder.customer.phone}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-stone-400 mb-2">
                    Delivery Address
                  </h4>
                  <p className="text-stone-300 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-[#dec49a] shrink-0 mt-0.5" />
                    <span>{selectedOrder.shippingAddress}</span>
                  </p>
                  {selectedOrder.trackingNumber && (
                    <p className="mt-2 text-stone-400 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-mono text-[11px] text-blue-300">
                        AWB: {selectedOrder.trackingNumber}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  Ordered Fixtures & Quantities
                </h4>
                <div className="divide-y divide-stone-800/80 border border-stone-800 rounded-2xl overflow-hidden bg-stone-900/40">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-stone-900 border border-stone-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{item.name}</p>
                          <p className="text-[11px] text-stone-400 font-mono">
                            SKU: {item.sku}
                          </p>
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-stone-800 text-[#dec49a] border border-stone-700 mt-1">
                            Finish: {item.finish}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-white">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {item.quantity} x ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 space-y-2 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Trade Promo / Voucher Discount</span>
                    <span>-₹{selectedOrder.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>GST (18% Ceramic & Brassware)</span>
                  <span>₹{selectedOrder.tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-bold text-white">
                  <span>Total Settled Amount</span>
                  <span className="text-[#dec49a]">
                    ₹{selectedOrder.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Management Controls: Payment, Fulfillment, Tracking */}
              <div className="pt-4 border-t border-stone-800 space-y-4">
                {/* Payment Status Control */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800">
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Payment Settlement Status:
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Method: {selectedOrder.paymentMethod || "Direct"} • Current:{" "}
                      <span className="font-semibold text-[#dec49a]">{selectedOrder.paymentStatus}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(["Paid", "Pending", "Refunded", "Failed"] as const).map((status) => {
                      const isActive = selectedOrder.paymentStatus === status;
                      const activeColors: Record<string, string> = {
                        Paid: "bg-emerald-600 text-white shadow-lg shadow-emerald-950/40",
                        Pending: "bg-amber-600 text-white shadow-lg shadow-amber-950/40",
                        Refunded: "bg-purple-600 text-white shadow-lg shadow-purple-950/40",
                        Failed: "bg-rose-600 text-white shadow-lg shadow-rose-950/40",
                      };
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateOrder(selectedOrder.id, { paymentStatus: status })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive
                              ? activeColors[status]
                              : "bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white"
                            }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fulfillment Status Control */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800">
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Fulfillment Logistics Status:
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Dispatched warehouse lifecycle:{" "}
                      <span className="font-semibold text-blue-300">{selectedOrder.fulfillmentStatus}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(["Processing", "Shipped", "Delivered", "Cancelled"] as const).map((status) => {
                      const isActive = selectedOrder.fulfillmentStatus === status;
                      const activeColors: Record<string, string> = {
                        Processing: "bg-amber-600 text-white shadow-lg shadow-amber-950/40",
                        Shipped: "bg-blue-600 text-white shadow-lg shadow-blue-950/40",
                        Delivered: "bg-emerald-600 text-white shadow-lg shadow-emerald-950/40",
                        Cancelled: "bg-stone-700 text-stone-200 shadow-lg",
                      };
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateOrder(selectedOrder.id, { fulfillmentStatus: status })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive
                              ? activeColors[status]
                              : "bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white"
                            }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Courier / AWB Tracking Number Input */}
                <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-white block mb-1">
                      AWB / Courier Tracking ID
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Truck className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={modalTrackingInput}
                          onChange={(e) => setModalTrackingInput(e.target.value)}
                          placeholder="e.g. BLUEDART-984210984"
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-[#9b7842]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateOrder(selectedOrder.id, { trackingNumber: modalTrackingInput })
                        }
                        className="px-3 py-1.5 bg-[#9b7842] hover:bg-[#866635] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                      >
                        Save Tracking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
