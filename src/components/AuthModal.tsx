"use client";

import React, { useState } from "react";
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  Sparkles, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useUserAuth } from "@/context/UserAuthContext";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } = useUserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (authModalMode === "login") {
      const res = await login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.message || "Failed to sign in. Please verify your credentials.");
      } else {
        setSuccess("Signed in successfully!");
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
        setError(res.message || "Registration failed. Please check the details.");
      } else {
        setSuccess("Welcome to Parkash Ceramics! Your account is created.");
      }
    }
  };

  const fillDemo = () => {
    setEmail("client@parkash.com");
    setPassword("password123");
    setError(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md bg-white border border-[#e5e0d8] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/20 z-10 my-auto text-[#151a22]"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            type="button"
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f7f5f0] border border-[#e5e0d8] text-[#9b7842] text-[11px] font-bold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Client & Architect Portal</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#151a22]">
              {authModalMode === "login" ? "Welcome Back" : "Join Parkash Ceramics"}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {authModalMode === "login"
                ? "Sign in to track orders, manage addresses, and view projects"
                : "Create your personal profile for expedited delivery and project tracking"}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[#f5f1eb] p-1 rounded-xl mb-6 border border-[#e5e0d8]">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode("login");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authModalMode === "login"
                  ? "bg-white text-[#151a22] shadow-xs"
                  : "text-stone-500 hover:text-[#151a22]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode("register");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authModalMode === "register"
                  ? "bg-white text-[#151a22] shadow-xs"
                  : "text-stone-500 hover:text-[#151a22]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalMode === "register" && (
              <>
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikramaditya Singhania"
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#151a22] placeholder-stone-400 focus:outline-none focus:border-[#9b7842]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#151a22] placeholder-stone-400 focus:outline-none focus:border-[#9b7842]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@parkash.com"
                  className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#151a22] placeholder-stone-400 focus:outline-none focus:border-[#9b7842]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fbf9f7] border border-[#ded5cb] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#151a22] placeholder-stone-400 focus:outline-none focus:border-[#9b7842]"
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

            {/* Demo fill shortcut for Sign In */}
            {authModalMode === "login" && (
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={fillDemo}
                  className="text-[11px] font-medium text-[#9b7842] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Auto-fill Demo Account</span>
                </button>
                <span className="text-[11px] text-stone-400">client@parkash.com</span>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#1c1815] hover:bg-[#9b7842] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{authModalMode === "login" ? "Sign In to Account" : "Complete Registration"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer disclaimer */}
          <div className="text-center mt-5 pt-4 border-t border-stone-100 text-[11px] text-stone-400">
            Encrypted & protected for luxury clients & design professionals
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
