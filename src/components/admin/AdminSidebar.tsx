"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  Users, 
  Tag, 
  TrendingUp, 
  Store, 
  ChevronRight, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  Sliders,
  Settings,
  Bell
} from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "motion/react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    badge: "12",
  },
  {
    label: "Add Product",
    href: "/admin/products/new",
    icon: PlusCircle,
    badge: "New",
    badgeColor: "bg-[#9b7842] text-white",
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    badge: "6 New",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  },
  {
    label: "Customers",
    href: "/admin/users",
    icon: Users,
    badge: "1.2k",
  },
  {
    label: "Coupons & Offers",
    href: "/admin/coupons",
    icon: Tag,
    badge: "4 Active",
  },
  {
    label: "Sales & Analytics",
    href: "/admin/sales",
    icon: TrendingUp,
    badge: null,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#12161f] text-stone-300 border-r border-stone-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-stone-800/80 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#dec49a] via-[#9b7842] to-[#6a5028] p-0.5 shadow-lg shadow-[#9b7842]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#12161f] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#dec49a]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-widest text-sm font-bold text-white uppercase">
                Parkash
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#9b7842]/20 text-[#dec49a] border border-[#9b7842]/30">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-sans tracking-wide">
              Ceramics & Sanitaryware
            </p>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Storefront Link */}
      <div className="px-4 py-3 border-b border-stone-800/60 bg-stone-900/40">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-800/60 hover:bg-stone-800 rounded-lg transition-all border border-stone-700/50 group"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#dec49a]" />
            <span>View Live Storefront</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        <div className="text-[10px] font-semibold text-stone-300 uppercase tracking-widest px-3 mb-2">
          Management Console
        </div>

        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={clsx(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group",
                active
                  ? "bg-gradient-to-r from-[#9b7842] to-[#836433] text-white shadow-md shadow-[#9b7842]/20 font-semibold"
                  : "text-stone-300 hover:text-white hover:bg-stone-800/60"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={clsx(
                    "w-4 h-4 transition-colors",
                    active ? "text-white" : "text-stone-300 group-hover:text-[#dec49a]"
                  )}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={clsx(
                    "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                    active
                      ? "bg-black/30 text-white"
                      : item.badgeColor || "bg-stone-800 text-stone-300 border border-stone-700"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* System Status Pill */}
      <div className="px-4 py-3 mx-4 mb-3 rounded-xl bg-stone-900/80 border border-stone-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-stone-300 font-medium">Catalog Sync Active</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">v2.4</span>
        </div>
        <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-[#dec49a] h-full w-[94%]" />
        </div>
      </div>

      {/* Admin Profile Footer */}
      <div className="p-4 border-t border-stone-800 bg-[#0d1017]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
              alt="Admin Avatar"
              className="w-9 h-9 rounded-xl object-cover border border-[#9b7842]/50"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0d1017]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              Gaurav Parkash
            </p>
            <p className="text-[10px] text-[#dec49a] truncate font-medium">
              Principal Administrator
            </p>
          </div>
          <div className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors">
            <ShieldCheck className="w-4 h-4 text-[#dec49a]" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Trigger button */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2.5 rounded-xl bg-[#12161f] text-white border border-stone-700 shadow-xl flex items-center gap-2"
          aria-label="Open Admin Menu"
        >
          <Menu className="w-5 h-5 text-[#dec49a]" />
          <span className="text-xs font-semibold">Menu</span>
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 shrink-0 z-40">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10"
            >
              {navContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
