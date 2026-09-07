import type { Metadata } from "next";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Console | PARKASH CERAMICS Luxury Bathware",
  description: "Executive control panel for Parkash Ceramics inventory, orders, trade clients, discounts, and sales analytics.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
