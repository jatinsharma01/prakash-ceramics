"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Bell, 
  Plus, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Calendar,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const NOTIFICATIONS = [
  {
    id: "n-1",
    title: "High Value Order Received",
    description: "Ar. Raghav Malhotra placed order #PC-ORD-8942 for ₹1,10,242",
    time: "10 mins ago",
    type: "order",
    unread: true,
  },
  {
    id: "n-2",
    title: "Low Inventory Alert",
    description: "Lumina Smart Heated Wall-Hung Toilet has only 3 units remaining.",
    time: "1 hour ago",
    type: "warning",
    unread: true,
  },
  {
    id: "n-3",
    title: "New VIP Architect Registered",
    description: "Goenka & Partners Architects joined the wholesale trade portal.",
    time: "4 hours ago",
    type: "user",
    unread: false,
  },
];

export function AdminHeader() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1 && segments[0] === "admin") {
      return [{ label: "Dashboard", href: "/admin" }];
    }

    return segments.map((seg, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      let label = seg.charAt(0).toUpperCase() + seg.slice(1);
      if (seg === "admin") label = "Console";
      if (seg === "new") label = "New Product";
      return { label, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-30 bg-[#12161f]/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Breadcrumbs & Page title */}
      <div className="flex items-center gap-2 text-xs pl-12 lg:pl-0">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb.href}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-stone-600" />}
              {isLast ? (
                <span className="font-semibold text-white bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-stone-400 hover:text-[#dec49a] transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Center & Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKUs, orders, clients..."
            className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 pl-9 pr-4 py-2 rounded-xl focus:outline-hidden focus:border-[#9b7842] focus:ring-1 focus:ring-[#9b7842] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-stone-700 hover:bg-stone-600 text-stone-300 px-1.5 py-0.5 rounded"
            >
              ESC
            </button>
          )}
        </div>

        {/* Quick Add Product Button */}
        <Link
          href="/admin/products/new"
          className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-[#9b7842]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-stone-300 hover:text-white bg-stone-850 hover:bg-stone-800 border border-stone-700/80 rounded-xl transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-[#12161f] text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#161b24] border border-stone-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-stone-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Activity Alerts
                      </h4>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/40 px-2 py-0.5 rounded-full font-semibold">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-[#dec49a] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-stone-800/80 max-h-80 overflow-y-auto">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 hover:bg-stone-800/50 transition-colors ${
                          item.unread ? "bg-[#1c222c]/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                              item.type === "warning"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : item.type === "order"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            }`}
                          >
                            {item.type === "warning" ? (
                              <AlertTriangle className="w-3.5 h-3.5" />
                            ) : item.type === "order" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-white truncate">
                                {item.title}
                              </p>
                              <span className="text-[10px] text-stone-500">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-stone-900 border-t border-stone-800 text-center">
                    <Link
                      href="/admin/orders"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-[#dec49a] hover:text-white font-medium inline-flex items-center gap-1"
                    >
                      <span>View all order history</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
