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
  PackageCheck
} from "lucide-react";
import { ADMIN_ORDERS, AdminOrder } from "@/lib/adminData";
import { motion, AnimatePresence } from "motion/react";

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>(ADMIN_ORDERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        order.fulfillmentStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateOrderStatus = (orderId: string, newStatus: AdminOrder["fulfillmentStatus"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, fulfillmentStatus: newStatus } : null));
    }
    showToast(`Order status updated to ${newStatus}`);
  };

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
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                statusFilter === "all"
                  ? "bg-[#9b7842] text-white font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              All ({totalOrdersCount})
            </button>
            <button
              onClick={() => setStatusFilter("processing")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                statusFilter === "processing"
                  ? "bg-amber-600 text-white font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Processing ({processingCount})
            </button>
            <button
              onClick={() => setStatusFilter("shipped")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                statusFilter === "shipped"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Shipped ({shippedCount})
            </button>
            <button
              onClick={() => setStatusFilter("delivered")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                statusFilter === "delivered"
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
              {filteredOrders.length === 0 ? (
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
                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                      <p className="text-[10px] text-stone-400 mt-1">
                        {order.paymentMethod}
                      </p>
                    </td>

                    {/* Fulfillment Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
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
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        selectedOrder.fulfillmentStatus === "Delivered"
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

              {/* Update Fulfillment Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-stone-800">
                <span className="text-xs font-medium text-stone-400">
                  Update Fulfillment Workflow:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, "Processing")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      selectedOrder.fulfillmentStatus === "Processing"
                        ? "bg-amber-600 text-white"
                        : "bg-stone-800 text-stone-300 hover:text-white"
                    }`}
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, "Shipped")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      selectedOrder.fulfillmentStatus === "Shipped"
                        ? "bg-blue-600 text-white"
                        : "bg-stone-800 text-stone-300 hover:text-white"
                    }`}
                  >
                    Shipped
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, "Delivered")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      selectedOrder.fulfillmentStatus === "Delivered"
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-800 text-stone-300 hover:text-white"
                    }`}
                  >
                    Delivered
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
