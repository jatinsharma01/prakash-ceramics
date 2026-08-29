"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, FinishType, EnquiryItem } from "@/lib/types";

interface EnquiryContextType {
  enquiryList: EnquiryItem[];
  addToEnquiry: (product: Product, selectedFinish?: FinishType, quantity?: number) => void;
  removeFromEnquiry: (productId: string, finish: FinishType) => void;
  updateQuantity: (productId: string, finish: FinishType, newQuantity: number) => void;
  clearEnquiry: () => void;
  totalItems: number;
  totalEstimatedValue: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [enquiryList, setEnquiryList] = useState<EnquiryItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pc_enquiry_cart");
      if (saved) {
        setEnquiryList(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pc_enquiry_cart", JSON.stringify(enquiryList));
    } catch {
      // ignore
    }
  }, [enquiryList]);

  const addToEnquiry = (product: Product, selectedFinish?: FinishType, quantity = 1) => {
    const finish = selectedFinish || product.finishes[0] || "Chrome";
    setEnquiryList((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedFinish === finish
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, selectedFinish: finish, quantity }];
    });
    setIsDrawerOpen(true);
  };

  const removeFromEnquiry = (productId: string, finish: FinishType) => {
    setEnquiryList((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedFinish === finish)
      )
    );
  };

  const updateQuantity = (productId: string, finish: FinishType, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromEnquiry(productId, finish);
      return;
    }
    setEnquiryList((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedFinish === finish
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearEnquiry = () => {
    setEnquiryList([]);
  };

  const totalItems = enquiryList.reduce((acc, item) => acc + item.quantity, 0);
  const totalEstimatedValue = enquiryList.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <EnquiryContext.Provider
      value={{
        enquiryList,
        addToEnquiry,
        removeFromEnquiry,
        updateQuantity,
        clearEnquiry,
        totalItems,
        totalEstimatedValue,
        isDrawerOpen,
        setIsDrawerOpen,
        quickViewProduct,
        setQuickViewProduct,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error("useEnquiry must be used within an EnquiryProvider");
  }
  return context;
}
