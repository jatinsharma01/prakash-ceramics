"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { Product, FinishType, EnquiryItem } from "@/lib/types";
import { useUserAuth } from "@/context/UserAuthContext";

interface EnquiryContextType {
  enquiryList: EnquiryItem[];
  addToEnquiry: (product: Product, selectedFinish?: FinishType, quantity?: number) => void;
  removeFromEnquiry: (productId: string, finish: FinishType) => void;
  updateQuantity: (productId: string, finish: FinishType, newQuantity: number) => void;
  clearEnquiry: () => void;
  setEnquiryListDirectly: (items: EnquiryItem[]) => void;
  totalItems: number;
  totalEstimatedValue: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "pc_enquiry_cart";

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [enquiryList, setEnquiryList] = useState<EnquiryItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { user } = useUserAuth();

  const isLocalLoaded = useRef(false);
  const hasInitialSynced = useRef(false);
  const syncTimer = useRef<NodeJS.Timeout | null>(null);

  // Helper to save to local storage immediately
  const persistToLocalStorage = useCallback((items: EnquiryItem[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Error saving cart to localStorage:", e);
    }
  }, []);

  // 1. Initial Load: Read from localStorage immediately on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setEnquiryList(parsed);
        }
      }
    } catch (err) {
      console.warn("Failed to parse cart from localStorage:", err);
    } finally {
      isLocalLoaded.current = true;
    }
  }, []);

  // 2. Cross-Tab Synchronization via Storage Event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setEnquiryList(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 3. Server Sync: Fetch server cart from DB and merge with local cart
  // Runs whenever auth user state is settled or changes (login/logout/mount)
  useEffect(() => {
    let isCancelled = false;

    async function syncWithServer() {
      try {
        const res = await fetch("/api/user/sync");
        if (!res.ok || isCancelled) return;

        const data = await res.json();
        if (data.success && Array.isArray(data.cart)) {
          const serverCart: EnquiryItem[] = data.cart;

          setEnquiryList((currentLocal) => {
            // Merge logic: Combine server cart with any un-synced local items
            const combined: EnquiryItem[] = [...serverCart];

            for (const localItem of currentLocal) {
              if (!localItem?.product?.id) continue;

              const existingIndex = combined.findIndex(
                (c) =>
                  c.product?.id === localItem.product.id &&
                  c.selectedFinish === localItem.selectedFinish
              );

              if (existingIndex === -1) {
                combined.push(localItem);
              } else {
                // Keep the maximum quantity between server and local
                combined[existingIndex] = {
                  ...combined[existingIndex],
                  quantity: Math.max(combined[existingIndex].quantity || 1, localItem.quantity || 1),
                };
              }
            }

            // Immediately persist the merged result to localStorage
            persistToLocalStorage(combined);

            // If local had new items or higher quantities, push merged list back to DB
            const isDifferentFromServer =
              combined.length !== serverCart.length ||
              combined.some((item) => {
                const sItem = serverCart.find(
                  (s) => s.product?.id === item.product?.id && s.selectedFinish === item.selectedFinish
                );
                return !sItem || sItem.quantity !== item.quantity;
              });

            if (isDifferentFromServer) {
              fetch("/api/user/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart: combined }),
              }).catch(() => {});
            }

            return combined;
          });
        }
      } catch (err) {
        console.warn("Could not sync cart with database:", err);
      } finally {
        if (!isCancelled) {
          hasInitialSynced.current = true;
        }
      }
    }

    // Reset initial sync flag when user changes (e.g. login or switch account)
    hasInitialSynced.current = false;
    syncWithServer();

    return () => {
      isCancelled = true;
    };
  }, [user?.id, persistToLocalStorage]);

  // 4. Save to Database: Debounced POST when cart changes AFTER initial sync has completed
  useEffect(() => {
    if (!isLocalLoaded.current || !hasInitialSynced.current) return;

    // Always keep localStorage updated
    persistToLocalStorage(enquiryList);

    // Debounce server update to prevent unnecessary network requests
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: enquiryList }),
      }).catch((err) => {
        console.warn("Error persisting cart to database:", err);
      });
    }, 400);

    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [enquiryList, persistToLocalStorage]);

  // User Actions
  const addToEnquiry = (product: Product, selectedFinish?: FinishType, quantity = 1) => {
    const finish = selectedFinish || product.finishes?.[0] || "Chrome";
    setEnquiryList((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedFinish === finish
      );
      let updated: EnquiryItem[];
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
      } else {
        updated = [...prev, { product, selectedFinish: finish, quantity }];
      }
      persistToLocalStorage(updated);
      return updated;
    });
    setIsDrawerOpen(true);
  };

  const removeFromEnquiry = (productId: string, finish: FinishType) => {
    setEnquiryList((prev) => {
      const updated = prev.filter(
        (item) => !(item.product.id === productId && item.selectedFinish === finish)
      );
      persistToLocalStorage(updated);
      return updated;
    });
  };

  const updateQuantity = (productId: string, finish: FinishType, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromEnquiry(productId, finish);
      return;
    }
    setEnquiryList((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId && item.selectedFinish === finish
          ? { ...item, quantity: newQuantity }
          : item
      );
      persistToLocalStorage(updated);
      return updated;
    });
  };

  const clearEnquiry = () => {
    setEnquiryList([]);
    persistToLocalStorage([]);
    // Direct sync on clear
    fetch("/api/user/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: [] }),
    }).catch(() => {});
  };

  const setEnquiryListDirectly = (items: EnquiryItem[]) => {
    setEnquiryList(items);
    persistToLocalStorage(items);
    fetch("/api/user/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: items }),
    }).catch(() => {});
  };

  const totalItems = enquiryList.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalEstimatedValue = enquiryList.reduce(
    (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 1),
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
        setEnquiryListDirectly,
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
