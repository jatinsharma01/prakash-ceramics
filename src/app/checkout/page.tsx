"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEnquiry } from "@/context/EnquiryContext";
import { ProductImage } from "@/components/ProductImage";
import { 
  MapPin, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  MessageCircle, 
  ArrowRight,
  Building,
  User,
  Phone,
  Mail,
  FileText,
  Lock,
  Sparkles
} from "lucide-react";
import { clsx } from "clsx";
import { useUserAuth } from "@/context/UserAuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { enquiryList, totalEstimatedValue, totalItems, clearEnquiry } = useEnquiry();
  const { user, addresses, addAddress } = useUserAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    projectType: "Residential Villa / Master Bath",
    notes: "",
  });

  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | null>(null);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(false);

  // Autofill user details and default address
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        city: prev.city || user.city || "",
      }));

      if (addresses.length > 0 && !formData.address) {
        const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
        setSelectedSavedAddressId(defaultAddr.id);
        setFormData((prev) => ({
          ...prev,
          fullName: defaultAddr.fullName,
          phone: defaultAddr.phone,
          address: defaultAddr.address,
          city: defaultAddr.city,
          state: defaultAddr.state,
          pincode: defaultAddr.pincode,
          landmark: defaultAddr.landmark || "",
        }));
      }
    }
  }, [user, addresses]);

  const handleSelectSavedAddress = (addr: any) => {
    setSelectedSavedAddressId(addr.id);
    setFormData((prev) => ({
      ...prev,
      fullName: addr.fullName,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      landmark: addr.landmark || "",
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    description?: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, totalEstimatedValue - discountAmount);


  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponInput.trim(),
          cartTotal: totalEstimatedValue,
        }),
      });

      const data = await res.json();

      if (data.valid && data.coupon) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountAmount: data.coupon.discountAmount,
          description: data.coupon.description,
        });
        setCouponSuccess(data.message || "Privilege coupon applied successfully!");
      } else {
        setCouponError(data.message || "Invalid coupon code");
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError("Could not validate coupon code");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponSuccess(null);
    setCouponError(null);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderNumber = `PC-${Date.now().toString().slice(-6)}`;

    // 1. Persist to Backend PostgreSQL Database
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          customer: formData,
          items: enquiryList,
          subtotal: totalEstimatedValue,
          discount: discountAmount,
          total: finalTotal,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
          paymentMethod: "UPI / QR",
        }),
      });

      if (saveAddressToProfile && user && formData.address) {
        addAddress({
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark || undefined,
          label: "Site / Villa",
          isDefault: addresses.length === 0,
        });
      }
    } catch (err) {
      console.warn("Backend order sync note:", err);
    }

    // Save order data to sessionStorage for success page
    const orderData = {
      orderId: orderNumber,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      customer: formData,
      items: enquiryList,
      total: finalTotal,
      subtotal: totalEstimatedValue,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
    };

    try {
      sessionStorage.setItem("pc_last_order", JSON.stringify(orderData));
    } catch {
      // ignore
    }

    // Format WhatsApp message
    let message = `*PRAKASH CERAMICS — CONFIRMED ORDER & PROJECT DISPATCH*\n`;
    message += `*Order ID:* ${orderData.orderId}\n\n`;
    message += `*CLIENT & DELIVERY ADDRESS:*\n`;
    message += `• Name: ${formData.fullName}\n`;
    message += `• Phone: ${formData.phone}\n`;
    if (formData.email) message += `• Email: ${formData.email}\n`;
    message += `• Project Type: ${formData.projectType}\n`;
    message += `• Delivery Address: ${formData.address}\n`;
    message += `• City / State / PIN: ${formData.city}, ${formData.state} - ${formData.pincode}\n`;
    if (formData.landmark) message += `• Landmark: ${formData.landmark}\n`;
    if (formData.notes) message += `• Special Notes: ${formData.notes}\n`;

    message += `\n*ORDERED FITTINGS & FIXTURES (${totalItems} items):*\n`;
    enquiryList.forEach((item, idx) => {
      message += `${idx + 1}. *${item.product.name}*\n   • Code: ${item.product.sku}\n   • Finish: ${item.selectedFinish}\n   • Qty: ${item.quantity} x ₹${item.product.price.toLocaleString("en-IN")} = ₹${(item.quantity * item.product.price).toLocaleString("en-IN")}\n\n`;
    });

    if (appliedCoupon) {
      message += `*Catalogue Subtotal:* ₹${totalEstimatedValue.toLocaleString("en-IN")}\n`;
      message += `*Privilege Voucher (${appliedCoupon.code}):* -₹${discountAmount.toLocaleString("en-IN")}\n`;
    }
    message += `*TOTAL PAYABLE AMOUNT:* ₹${finalTotal.toLocaleString("en-IN")}\n\n`;
    message += `Please confirm dispatch slot and provide official tax invoice.`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/919148003924?text=${encoded}`;

    // Open WhatsApp in new tab and redirect to success page
    window.open(waUrl, "_blank");

    setTimeout(() => {
      clearEnquiry();
      router.push("/checkout/success");
    }, 600);
  };

  if (enquiryList.length === 0) {
    return (
      <div className="min-h-screen bg-[#fbf9f7] pt-32 pb-24 text-center">
        <div className="max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#ded5cb] flex items-center justify-center text-[#9b7842] mx-auto mb-4 shadow-xs">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#151a22] mb-2">No Items in Cart to Checkout</h1>
          <p className="text-xs text-[#6b7280] mb-6">
            Please add fittings to your cart before proceeding to checkout.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#1c1815] hover:bg-[#9b7842] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f7] text-[#151a22] pb-24">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-[#ede8df] pt-28 pb-4">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <nav className="flex items-center gap-2 text-xs text-[#6b7280]">
            <Link href="/" className="hover:text-[#151a22] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/cart" className="hover:text-[#151a22] transition-colors">Cart</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#151a22] font-semibold">Delivery Address & Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12">
        
        {/* Page Header */}
        <div className="pb-8 border-b border-[#ede8df] mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9b7842] font-bold block mb-1">
            Step 2 of 3 • Secure Order
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#151a22]">
            Delivery Address & Checkout
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Delivery Address Form (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Contact Info Card */}
            <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#ede8df]">
                <div className="p-2 rounded-xl bg-[#9b7842]/10 text-[#9b7842]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#151a22] uppercase tracking-wider">
                    1. Contact Information
                  </h3>
                  <p className="text-xs text-[#84786d]">We will send order confirmation & invoice here</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#374151] block mb-1.5">
                    Full Name / Firm Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Rahul Sharma / Studio Design"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#374151] block mb-1.5">
                    WhatsApp / Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#374151] block mb-1.5">
                    Email Address (For Tax Invoice)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. client@domain.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address Card */}
            <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#ede8df]">
                <div className="p-2 rounded-xl bg-[#9b7842]/10 text-[#9b7842]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#151a22] uppercase tracking-wider">
                    2. Project Site / Delivery Address
                  </h3>
                  <p className="text-xs text-[#84786d]">Where should we dispatch these fixtures?</p>
                </div>
              </div>

              {/* Saved Addresses Quick Selector */}
              {user && addresses.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#f7f5f0] border border-[#ede8df] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#151a22] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#9b7842]" />
                      <span>Choose From Your Saved Addresses:</span>
                    </span>
                    <Link href="/account?tab=addresses" className="text-[11px] text-[#9b7842] font-semibold hover:underline">
                      Manage
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {addresses.map((addr) => {
                      const isSelected = selectedSavedAddressId === addr.id;
                      return (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-white border-[#9b7842] shadow-xs ring-1 ring-[#9b7842]"
                              : "bg-white/70 border-[#ded5cb] hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#151a22] truncate">{addr.fullName}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 uppercase">
                              {addr.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                            {addr.address}, {addr.city}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#374151] block mb-1.5">
                    Street Address, Building, House / Villa No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="e.g. Villa 14, Palm Grove Enclave, Sector 45"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#374151] block mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. New Delhi"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#374151] block mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      placeholder="e.g. Delhi / NCR"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#374151] block mb-1.5">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="e.g. 110001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#374151] block mb-1.5">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="e.g. Near Grand Hotel / Metro Station"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#374151] block mb-1.5">
                      Project Scale / Type
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-[#151a22] focus:outline-none focus:border-[#9b7842]"
                    >
                      <option value="Residential Villa / Master Bath">Residential Villa / Master Bath</option>
                      <option value="Luxury Penthouse / Apartment">Luxury Penthouse / Apartment</option>
                      <option value="Commercial Resort / Hotel">Commercial Resort / Hotel</option>
                      <option value="Architect & Interior Design Firm">Architect & Interior Firm</option>
                    </select>
                  </div>
                </div>

                {user && (
                  <div className="pt-2 border-t border-[#ede8df]">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 font-medium">
                      <input
                        type="checkbox"
                        checked={saveAddressToProfile}
                        onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                        className="rounded border-[#ded5cb] text-[#9b7842] focus:ring-[#9b7842]"
                      />
                      <span>Save this address to my account for future orders</span>
                    </label>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-[#374151] block mb-1.5">
                    Special Delivery Instructions / Finish Preferences (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="e.g. Require matched batch PVD finishes; dispatch by next Tuesday..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-4 py-2.5 text-xs text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Dispatch & Guarantee Information */}
            <div className="bg-gradient-to-br from-[#faf8f5] to-white border border-[#ded5cb] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white border border-[#e5e0d8] text-[#9b7842] shadow-xs">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#151a22] uppercase tracking-wider">
                    Direct Insured Dispatch from Parkash Ceramics
                  </h4>
                  <p className="text-[11px] text-[#6b7280]">
                    All ceramic fixtures and PVD fittings are shipped in multi-layer foam crates.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-[#8c7764] shrink-0">
                <Lock className="w-4 h-4" />
                <span>Zero Risk Guaranteed</span>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 sticky top-28">
            <h3 className="text-base font-serif font-bold text-[#151a22] uppercase tracking-wider pb-4 border-b border-[#ede8df]">
              Items In This Order ({totalItems})
            </h3>

            {/* Mini Items Preview */}
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {enquiryList.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedFinish}`}
                  className="flex gap-3 items-center bg-[#faf8f5] p-2.5 rounded-2xl border border-[#ede8df]"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-[#e5e0d8]">
                    <ProductImage
                      src={
                        (item.product.finishImages && item.product.finishImages[item.selectedFinish]) ||
                        item.product.images[0]
                      }
                      alt={item.product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-[#151a22] truncate">
                      {item.product.name}
                    </h5>
                    <span className="text-[10px] text-[#6b7280] block">
                      Qty: {item.quantity} • Finish: {item.selectedFinish}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#151a22] shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Promo Code Box */}
            <div className="pt-4 border-t border-[#ede8df] space-y-2">
              <label className="text-[11px] font-bold text-[#151a22] uppercase tracking-wider block">
                Privilege Promo Code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="min-w-0">
                    <span className="font-mono font-bold text-emerald-800 tracking-wider">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-[10px] text-emerald-600 block">
                      Saved ₹{appliedCoupon.discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700 underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. LUXURY10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#fbf9f7] border border-[#ded5cb] rounded-xl px-3 py-2 text-xs font-mono tracking-wider text-[#151a22] placeholder-neutral-400 focus:outline-none focus:border-[#9b7842]"
                  />
                  <button
                    type="button"
                    disabled={isValidatingCoupon || !couponInput.trim()}
                    onClick={handleApplyCoupon}
                    className="bg-[#1c1815] hover:bg-[#9b7842] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    {isValidatingCoupon ? "..." : "Apply"}
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-[10px] text-red-600 font-semibold">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-[10px] text-emerald-600 font-semibold">{couponSuccess}</p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs pt-4 border-t border-[#ede8df]">
              <div className="flex justify-between text-[#4b5563]">
                <span>Catalogue Total</span>
                <span className="font-bold text-[#151a22]">₹{totalEstimatedValue.toLocaleString("en-IN")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Privilege Concession ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-[#4b5563]">
                <span>Insured Packaging & Freight</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-[#4b5563]">
                <span>GST (18%)</span>
                <span className="text-[#84786d]">Included</span>
              </div>
              <div className="pt-3 border-t border-[#ede8df] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#151a22]">Total Payable</span>
                <span className="text-2xl font-serif font-extrabold text-[#151a22]">
                  ₹{finalTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Submit & Send to WhatsApp Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/25 hover:scale-[1.02] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Place Order & Send to WhatsApp (+91 91480 03924)</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#84786d] text-center">
              <ShieldCheck className="w-4 h-4 text-[#9b7842]" />
              <span>Official WhatsApp Quotation & Confirmation Desk</span>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
