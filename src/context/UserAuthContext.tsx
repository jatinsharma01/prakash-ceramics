"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CustomerUserRecord, CustomerAddressRecord } from "@/lib/userDb";

interface AuthResponse {
  success: boolean;
  message?: string;
}

interface UserAuthContextType {
  user: CustomerUserRecord | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    city?: string;
    company?: string;
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<Pick<CustomerUserRecord, "name" | "phone" | "city" | "company" | "avatar">>) => Promise<AuthResponse>;
  addresses: CustomerAddressRecord[];
  refreshAddresses: () => Promise<void>;
  addAddress: (data: {
    fullName: string;
    phone: string;
    estateOrProject?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    label?: string;
    isDefault?: boolean;
  }) => Promise<AuthResponse>;
  updateAddressItem: (
    id: string,
    data: Partial<Omit<CustomerAddressRecord, "id" | "userId" | "createdAt">>
  ) => Promise<AuthResponse>;
  deleteAddressItem: (id: string) => Promise<AuthResponse>;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  authModalMode: "login" | "register";
  setAuthModalMode: (mode: "login" | "register") => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUserRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<CustomerAddressRecord[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      return;
    }
    try {
      const res = await fetch("/api/user/addresses");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.addresses)) {
          setAddresses(data.addresses);
        }
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
    }
  }, [user]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (user) {
      refreshAddresses();
    } else {
      setAddresses([]);
    }
  }, [user, refreshAddresses]);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Failed to sign in." };
      }
      setUser(data.user);
      setIsAuthModalOpen(false);
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error. Please try again." };
    }
  };

  const register = async (formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    city?: string;
    company?: string;
  }): Promise<AuthResponse> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Failed to register." };
      }
      setUser(data.user);
      setIsAuthModalOpen(false);
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      setAddresses([]);
    }
  };

  const updateProfile = async (
    data: Partial<Pick<CustomerUserRecord, "name" | "phone" | "city" | "company" | "avatar">>
  ): Promise<AuthResponse> => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, message: resData.message || "Failed to update profile." };
      }
      setUser((prev) => (prev ? { ...prev, ...resData.user } : resData.user));
      return { success: true, message: resData.message };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error." };
    }
  };

  const addAddress = async (data: {
    fullName: string;
    phone: string;
    estateOrProject?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    label?: string;
    isDefault?: boolean;
  }): Promise<AuthResponse> => {
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, message: resData.message || "Failed to save address." };
      }
      await refreshAddresses();
      return { success: true, message: resData.message };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error." };
    }
  };

  const updateAddressItem = async (
    id: string,
    data: Partial<Omit<CustomerAddressRecord, "id" | "userId" | "createdAt">>
  ): Promise<AuthResponse> => {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, message: resData.message || "Failed to update address." };
      }
      await refreshAddresses();
      return { success: true, message: resData.message };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error." };
    }
  };

  const deleteAddressItem = async (id: string): Promise<AuthResponse> => {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: "DELETE",
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, message: resData.message || "Failed to delete address." };
      }
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      return { success: true, message: resData.message };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error." };
    }
  };

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        addresses,
        refreshAddresses,
        addAddress,
        updateAddressItem,
        deleteAddressItem,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
}
