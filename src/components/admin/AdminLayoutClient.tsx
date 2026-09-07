"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            return;
          }
        }
        // If not authenticated, redirect to login
        setIsAuthenticated(false);
        router.push("/admin/login");
      } catch (err) {
        setIsAuthenticated(false);
        router.push("/admin/login");
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  // If login page, display full-screen login directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If checking auth, show clean luxury loader
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0a0d13] flex items-center justify-center text-[#dec49a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#9b7842] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs tracking-widest uppercase text-stone-400 font-semibold">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1017] text-stone-100 flex font-sans antialiased selection:bg-[#9b7842] selection:text-white">
      {/* Persistent Left Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0d1017]">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
