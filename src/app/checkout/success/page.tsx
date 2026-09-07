"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  MessageCircle, 
  Truck, 
  MapPin, 
  ArrowRight, 
  Printer, 
  Download,
  Building,
  Phone,
  Clock,
  Sparkles
} from "lucide-react";

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("pc_last_order");
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleResendWhatsApp = () => {
    if (!order) return;
    let message = `*PRAKASH CERAMICS — CONFIRMED ORDER & PROJECT DISPATCH*\n`;
    message += `*Order ID:* ${order.orderId}\n\n`;
    message += `*CLIENT & DELIVERY ADDRESS:*\n`;
    message += `• Name: ${order.customer?.fullName}\n`;
    message += `• Phone: ${order.customer?.phone}\n`;
    if (order.customer?.email) message += `• Email: ${order.customer?.email}\n`;
    message += `• Project Type: ${order.customer?.projectType}\n`;
    message += `• Delivery Address: ${order.customer?.address}\n`;
    message += `• City / State / PIN: ${order.customer?.city}, ${order.customer?.state} - ${order.customer?.pincode}\n`;
    if (order.customer?.landmark) message += `• Landmark: ${order.customer?.landmark}\n`;
    if (order.customer?.notes) message += `• Special Notes: ${order.customer?.notes}\n`;

    message += `\n*ORDERED FITTINGS & FIXTURES:*\n`;
    order.items?.forEach((item: any, idx: number) => {
      message += `${idx + 1}. *${item.product?.name}*\n   • Code: ${item.product?.sku}\n   • Finish: ${item.selectedFinish}\n   • Qty: ${item.quantity} x ₹${item.product?.price.toLocaleString("en-IN")} = ₹${(item.quantity * item.product?.price).toLocaleString("en-IN")}\n\n`;
    });

    message += `*TOTAL ORDER AMOUNT:* ₹${order.total?.toLocaleString("en-IN")}\n\n`;
    message += `Please confirm dispatch slot and provide official tax invoice.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919148003924?text=${encoded}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#fbf9f7] text-[#151a22] pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Success Banner */}
        <div className="bg-white border border-[#dec49a] rounded-3xl p-8 sm:p-12 text-center shadow-lg mb-8">
          <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-[#9b7842] font-bold block mb-2">
            Order Transmitted Successfully
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#151a22] mb-3">
            Thank You for Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#6b7280] max-w-lg mx-auto leading-relaxed">
            Your architectural project order has been logged and forwarded directly to the Prakash Ceramics Concierge desk on WhatsApp (+91 91480 03924).
          </p>

          <div className="mt-6 inline-flex items-center gap-2 bg-[#faf8f5] border border-[#ded5cb] px-5 py-2.5 rounded-full text-xs font-mono font-bold text-[#151a22]">
            <span>Order Reference:</span>
            <span className="text-[#9b7842]">{order?.orderId || "PC-914800"}</span>
          </div>

          <div className="mt-8 pt-8 border-t border-[#ede8df] flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleResendWhatsApp}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-[#25D366]/20 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Open in WhatsApp (+91 91480 03924)</span>
            </button>

            <Link
              href="/products"
              className="bg-[#1c1815] hover:bg-[#9b7842] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
            >
              Continue Exploring
            </Link>
          </div>
        </div>

        {/* Order Details Breakdown if available */}
        {order && (
          <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-base font-serif font-bold text-[#151a22] uppercase tracking-wider pb-4 border-b border-[#ede8df]">
              Order Summary & Delivery Location
            </h3>

            {/* Delivery Address Card */}
            <div className="bg-[#faf8f5] border border-[#ded5cb] p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#151a22]">
                <MapPin className="w-4 h-4 text-[#9b7842]" />
                <span>Destination Site:</span>
              </div>
              <p className="text-[#4b5563]">
                <strong>{order.customer?.fullName}</strong> ({order.customer?.phone})
              </p>
              <p className="text-[#4b5563]">
                {order.customer?.address}, {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
              </p>
              {order.customer?.projectType && (
                <p className="text-[#84786d]">
                  Project Type: {order.customer?.projectType}
                </p>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#84786d] block">
                Ordered Items ({order.items?.length || 0})
              </span>
              <div className="divide-y divide-[#ede8df] border border-[#ede8df] rounded-2xl overflow-hidden">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-white flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-[#151a22]">{item.product?.name}</h4>
                      <span className="text-[11px] text-[#6b7280]">
                        SKU: {item.product?.sku} • Finish: {item.selectedFinish} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-[#151a22]">
                      ₹{(item.product?.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-[#ede8df]">
                <span className="text-sm font-bold text-[#151a22]">Total Order Value</span>
                <span className="text-2xl font-serif font-extrabold text-[#151a22]">
                  ₹{order.total?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Concierge Desk Support */}
            <div className="bg-[#fcfbf9] border border-[#ede8df] p-4 rounded-2xl flex items-center justify-between text-xs text-[#6b7280]">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#9b7842]" />
                <span>Prakash Ceramics Concierge Dispatch Hub</span>
              </div>
              <span className="font-bold text-[#151a22]">+91 91480 03924</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
