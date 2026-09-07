"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { Product } from "@/lib/types";
import { useUserAuth } from "@/context/UserAuthContext";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  setWishlistDirectly: (items: Product[]) => void;
  totalWishlistItems: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "pc_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { user } = useUserAuth();

  const isLocalLoaded = useRef(false);
  const hasInitialSynced = useRef(false);
  const syncTimer = useRef<NodeJS.Timeout | null>(null);

  // Helper to persist to localStorage immediately
  const persistToLocalStorage = useCallback((items: Product[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Error saving wishlist to localStorage:", e);
    }
  }, []);

  // 1. Initial Load from localStorage on mount (instant display)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch (err) {
      console.warn("Failed to parse wishlist from localStorage:", err);
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
            setWishlist(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 3. User Cross-Device Sync: Fetch server wishlist from database and merge
  useEffect(() => {
    let isCancelled = false;

    async function syncWithServer() {
      try {
        const res = await fetch("/api/user/sync");
        if (!res.ok || isCancelled) return;

        const data = await res.json();
        if (data.success && Array.isArray(data.wishlist)) {
          const serverWishlist: Product[] = data.wishlist;

          setWishlist((currentLocal) => {
            // Merge: combine server items with local items without duplicate IDs
            const existingIds = new Set(serverWishlist.map((p) => p.id));
            const combined = [...serverWishlist];

            for (const localItem of currentLocal) {
              if (localItem?.id && !existingIds.has(localItem.id)) {
                combined.push(localItem);
                existingIds.add(localItem.id);
              }
            }

            // Immediately persist the merged result to localStorage
            persistToLocalStorage(combined);

            // If local had items not yet in the server database, push combined list back
            if (combined.length !== serverWishlist.length) {
              fetch("/api/user/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wishlist: combined }),
              }).catch(() => {});
            }

            return combined;
          });
        }
      } catch (err) {
        console.warn("Could not sync wishlist with database:", err);
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

  // 4. Save to Database: Debounced POST when wishlist changes AFTER initial sync has completed
  useEffect(() => {
    if (!isLocalLoaded.current || !hasInitialSynced.current) return;

    // Always keep localStorage updated
    persistToLocalStorage(wishlist);

    // Debounce server update to prevent unnecessary network requests
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlist }),
      }).catch((err) => {
        console.warn("Error persisting wishlist to database:", err);
      });
    }, 400);

    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [wishlist, persistToLocalStorage]);

  // User Actions
  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      const updated = [...prev, product];
      persistToLocalStorage(updated);
      return updated;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      persistToLocalStorage(updated);
      return updated;
    });
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      const updated = exists
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product];
      persistToLocalStorage(updated);
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    persistToLocalStorage([]);
    // Direct sync on clear
    fetch("/api/user/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wishlist: [] }),
    }).catch(() => {});
  };

  const setWishlistDirectly = (items: Product[]) => {
    setWishlist(items);
    persistToLocalStorage(items);
    fetch("/api/user/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wishlist: items }),
    }).catch(() => {});
  };

  const totalWishlistItems = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        setWishlistDirectly,
        totalWishlistItems,
        isWishlistOpen,
        setIsWishlistOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
