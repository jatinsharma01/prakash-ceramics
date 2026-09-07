"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound 
} from "lucide-react";
import { motion } from "motion/react";
import { useUserAuth } from "@/context/UserAuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { user, login, register } = useUserAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (mode === "login") {
      const res = await login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.message || "Invalid credentials.");
      } else {
        setSuccess("Signed in successfully! Redirecting...");
        setTimeout(() => router.push("/account"), 600);
      }
    } else {
      const res = await register({
        name,
        email,
        phone,
        password,
      });
      setIsLoading(false);
      if (!res.success) {
        setError(res.message || "Registration failed.");
      } else {
        setSuccess("Welcome to Parkash Ceramics! Redirecting to dashboard...");
        setTimeout(() => router.push("/account"), 600);
      }
    }
  };

  const fillDemo = () => {
    setEmail("client@parkash.com");
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f7] pt-32 pb-20 flex flex-col justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-[#e5e0d8] rounded-3xl p-6 sm:p-8 shadow-xl text-[#151a22]"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f7f5f0] border border-[#e5e0d8] text-[#9b7842] text-[11px] font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Privilege Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#151a22]">
            {mode === "login" ? "Client Sign In" : "Create Account"}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Access your orders, track dispatches, and manage project addresses
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#f5f1eb] p-1 rounded-xl mb-6 border border-[#e5e0d8]">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "login" ? "bg-white text-[#151a22] shadow-xs" : "text-stone-500"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "register" ? "bg-white text-[#151a22] shadow-xs" : "text-stone-500"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 uppercase">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikramaditya Singhania"
                    className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#151a22]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 uppercase">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#151a22]"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-700 uppercase">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@parkash.com"
                className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#151a22]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-700 uppercase">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#151a22]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === "login" && (
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={fillDemo}
                className="text-[11px] font-medium text-[#9b7842] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3 h-3" />
                <span>Fill Demo (client@parkash.com)</span>
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#1c1815] hover:bg-[#9b7842] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === "login" ? "Sign In to Account" : "Register Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-stone-100">
          <Link href="/" className="text-xs text-stone-500 hover:text-[#9b7842] transition-colors">
            ← Return to Storefront
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
