import { NextRequest, NextResponse } from "next/server";
import { getOrders, getProducts } from "@/lib/serverDb";

// In-memory set to track notifications that have been marked as read
const readNotificationIds = new Set<string>();

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recently";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // If timestamp is future due to slight server/client clock differences
  if (diffMs < 0) return "Just now";

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) {
    const mins = Math.max(1, Math.floor(diffSec / 60));
    return `${mins} min${mins > 1 ? "s" : ""} ago`;
  }
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (diffSec < 86400 * 2) {
    return "Yesterday";
  }
  if (diffSec < 86400 * 7) {
    const days = Math.floor(diffSec / 86400);
    return `${days} days ago`;
  }
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export interface NotificationItem {
  id: string;
  orderId?: string;
  orderNumber?: string;
  type: "order" | "warning" | "user" | "info";
  title: string;
  description: string;
  customerName?: string;
  customerCity?: string;
  amount?: number;
  itemCount?: number;
  fulfillmentStatus?: string;
  paymentStatus?: string;
  time: string;
  timestamp: string;
  unread: boolean;
  link?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10) || 5) : 5;
    const includeAlerts = searchParams.get("includeAlerts") !== "false";

    // 1. Fetch latest orders
    const allOrders = await getOrders();

    // Sort descending by date/createdAt if available
    const sortedOrders = [...allOrders].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date).getTime() || 0;
      const dateB = new Date(b.createdAt || b.date).getTime() || 0;
      return dateB - dateA;
    });

    const latestOrders = sortedOrders.slice(0, limit);

    // 2. Generate notifications for the latest orders
    const orderNotifications: NotificationItem[] = latestOrders.map((order) => {
      const id = `order-${order.id || order.orderNumber}`;
      const isHighValue = order.total >= 100000;
      const title = isHighValue ? "High Value Order Received" : "New Order Received";
      const description = `${order.customer.name || "A customer"} placed order #${order.orderNumber} for ₹${Number(order.total).toLocaleString("en-IN")}`;
      const dateValue = order.createdAt || order.date || new Date().toISOString();
      const time = formatRelativeTime(dateValue);

      return {
        id,
        orderId: order.id,
        orderNumber: order.orderNumber,
        type: "order",
        title,
        description,
        customerName: order.customer.name,
        customerCity: order.customer.city,
        amount: order.total,
        itemCount: order.items?.length || 1,
        fulfillmentStatus: order.fulfillmentStatus,
        paymentStatus: order.paymentStatus,
        time,
        timestamp: dateValue,
        unread: !readNotificationIds.has(id),
        link: `/admin/orders?search=${encodeURIComponent(order.orderNumber)}`,
      };
    });

    // 3. Optional supplementary system alerts (e.g. low inventory)
    const systemNotifications: NotificationItem[] = [];
    if (includeAlerts) {
      try {
        const products = await getProducts();
        const lowStock = products.filter((p) => p.stockCount !== undefined && p.stockCount <= 3);
        if (lowStock.length > 0) {
          const sample = lowStock[0];
          const stockId = `low-stock-${sample.id}`;
          systemNotifications.push({
            id: stockId,
            type: "warning",
            title: "Low Inventory Alert",
            description: `${sample.name} has only ${sample.stockCount} unit${sample.stockCount === 1 ? "" : "s"} remaining.`,
            amount: sample.price,
            itemCount: sample.stockCount || 1,
            time: "1 hour ago",
            timestamp: new Date().toISOString(),
            unread: !readNotificationIds.has(stockId),
            link: `/admin/products/${sample.id}/edit`,
          });
        }
      } catch (err) {
        console.warn("Could not load products for low stock alert:", err);
      }
    }

    // Combine notifications: latest order notifications first, then system alerts
    const allNotifications: NotificationItem[] = [...orderNotifications, ...systemNotifications];
    const unreadCount = allNotifications.filter((n) => n.unread).length;

    return NextResponse.json({
      success: true,
      count: allNotifications.length,
      unreadCount,
      notifications: allNotifications,
      latestOrders: latestOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: o.customer.name,
        total: o.total,
        date: o.date,
        fulfillmentStatus: o.fulfillmentStatus,
        itemsCount: o.items.length,
      })),
    });
  } catch (error: any) {
    console.error("GET /api/admin/notifications error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, id, ids } = body;

    if (action === "mark_all_read") {
      // Mark all current known notifications as read
      const allOrders = await getOrders();
      allOrders.forEach((o) => {
        readNotificationIds.add(`order-${o.id || o.orderNumber}`);
      });
      return NextResponse.json({
        success: true,
        message: "All notifications marked as read",
      });
    }

    if (action === "mark_read" && id) {
      readNotificationIds.add(id);
      return NextResponse.json({
        success: true,
        message: `Notification ${id} marked as read`,
      });
    }

    if (Array.isArray(ids)) {
      ids.forEach((i) => readNotificationIds.add(i));
      return NextResponse.json({
        success: true,
        message: `${ids.length} notifications marked as read`,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action or missing notification ID" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("POST /api/admin/notifications error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update notification status" },
      { status: 500 }
    );
  }
}
