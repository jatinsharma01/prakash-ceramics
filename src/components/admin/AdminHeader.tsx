"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ArrowUpRight,
  ShieldCheck,
  KeyRound,
  LogOut,
  X,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Loader2,
  PackageCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NotificationItem {
  id: string;
  orderId?: string;
  orderNumber?: string;
  title: string;
  description: string;
  time: string;
  type: "order" | "warning" | "user" | "info";
  unread: boolean;
  link?: string;
  amount?: number;
  customerName?: string;
  timestamp?: string;
}

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch latest 5 order notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications?limit=5");
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        // Retrieve locally stored read notification IDs
        let readSet = new Set<string>();
        try {
          const stored = localStorage.getItem("pc_read_notifications");
          if (stored) {
            readSet = new Set(JSON.parse(stored));
          }
        } catch {
          // ignore localStorage errors
        }

        const merged: NotificationItem[] = data.notifications.map((item: NotificationItem) => ({
          ...item,
          unread: item.unread && !readSet.has(item.id),
        }));
        setNotifications(merged);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 25 seconds for new incoming orders
    const timer = setInterval(fetchNotifications, 25000);
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  // Password Change Modal States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  const markAllAsRead = async () => {
    const allIds = notifications.map((n) => n.id);
    try {
      const stored = localStorage.getItem("pc_read_notifications");
      const prev = stored ? JSON.parse(stored) : [];
      const updated = Array.from(new Set([...prev, ...allIds]));
      localStorage.setItem("pc_read_notifications", JSON.stringify(updated));
    } catch {
      // ignore localStorage errors
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

    try {
      await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" }),
      });
    } catch {
      // ignore network errors for background mark
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (item.unread) {
      try {
        const stored = localStorage.getItem("pc_read_notifications");
        const prev = stored ? JSON.parse(stored) : [];
        if (!prev.includes(item.id)) {
          prev.push(item.id);
          localStorage.setItem("pc_read_notifications", JSON.stringify(prev));
        }
      } catch {
        // ignore localStorage errors
      }

      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
      );

      fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", id: item.id }),
      }).catch(() => {});
    }

    setShowNotifications(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 4) {
      setPasswordStatus({ type: "error", message: "Password must be at least 4 characters." });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin-parkash@gmail.com",
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setPasswordStatus({ type: "error", message: data.message || "Failed to update password." });
      } else {
        setPasswordStatus({ type: "success", message: "Password updated successfully in PostgreSQL!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordStatus(null);
        }, 2000);
      }
    } catch {
      setPasswordStatus({ type: "error", message: "Network error updating password." });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <>
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
          <div className="relative hidden md:block w-64 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SKUs, orders, clients..."
              className="w-full bg-[#1c222c] border border-stone-700 text-xs text-white placeholder-stone-400 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-[#9b7842] focus:ring-1 focus:ring-[#9b7842] transition-all"
            />
          </div>

          {/* Change Password Button */}
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-[#dec49a] border border-stone-700 text-xs font-semibold transition-all"
            title="Update Admin Password"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#dec49a]" />
            <span className="hidden sm:inline">Change Password</span>
          </button>

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
              onClick={() => {
                if (!showNotifications) {
                  fetchNotifications();
                }
                setShowNotifications(!showNotifications);
              }}
              className="relative p-2 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700/80 rounded-xl transition-all"
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

                    <div className="divide-y divide-stone-800/80 max-h-84 overflow-y-auto">
                      {isLoadingNotifications && notifications.length === 0 ? (
                        <div className="p-6 flex flex-col items-center justify-center gap-2 text-stone-400">
                          <Loader2 className="w-5 h-5 animate-spin text-[#dec49a]" />
                          <span className="text-xs">Loading order alerts...</span>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <PackageCheck className="w-7 h-7 text-stone-500 mx-auto mb-2 opacity-60" />
                          <p className="text-xs font-semibold text-stone-300">All caught up!</p>
                          <p className="text-[11px] text-stone-500 mt-0.5">No recent order notifications.</p>
                        </div>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleNotificationClick(item)}
                            className={`p-3.5 hover:bg-stone-800/70 transition-colors cursor-pointer relative group ${
                              item.unread ? "bg-[#1c222c]/70" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-lg shrink-0 mt-0.5 transition-transform group-hover:scale-105 ${
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
                                <div className="flex items-center justify-between gap-1">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <p className="text-xs font-semibold text-white truncate">
                                      {item.title}
                                    </p>
                                    {item.unread && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                                    )}
                                  </div>
                                  <span className="text-[10px] text-stone-500 shrink-0">
                                    {item.time}
                                  </span>
                                </div>
                                <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-3 bg-stone-900 border-t border-stone-800 text-center">
                      <Link
                        href="/admin/orders"
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-[#dec49a] hover:text-white font-medium inline-flex items-center gap-1.5 transition-colors"
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

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-stone-400 hover:text-red-400 hover:bg-red-950/30 border border-stone-700/80 rounded-xl transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#161a24] border border-stone-700 rounded-3xl shadow-2xl p-6 sm:p-7 z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/30">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Update Admin Password</h3>
                    <p className="text-xs text-stone-400">admin-parkash@gmail.com</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Alert */}
              {passwordStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    passwordStatus.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                  }`}
                >
                  {passwordStatus.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{passwordStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold block">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password (default: 123456)"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-3.5 pr-10 py-2.5 text-white placeholder-stone-400 focus:outline-none focus:border-[#9b7842]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-white"
                    >
                      {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold block">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-3.5 pr-10 py-2.5 text-white placeholder-stone-400 focus:outline-none focus:border-[#9b7842]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-white"
                    >
                      {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold block">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-400 focus:outline-none focus:border-[#9b7842]"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9b7842] to-[#836433] hover:from-[#aa864e] hover:to-[#92703a] disabled:opacity-50 text-white font-bold shadow-lg"
                  >
                    {isUpdatingPassword ? "Saving to PostgreSQL..." : "Update Password"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
