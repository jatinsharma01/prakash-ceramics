"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Search, 
  Heart, 
  ChevronDown, 
  Sparkles, 
  ArrowRight 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CATEGORIES } from "@/lib/categories";
import { useEnquiry } from "@/context/EnquiryContext";
import { useWishlist } from "@/context/WishlistContext";
import { BrandLogo } from "./BrandLogo";
import { CartIcon } from "./CartIcon";
import { clsx } from "clsx";

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useEnquiry();
  const { totalWishlistItems } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Determine if page has a dark hero (like home, about, categories)
  const isDarkHeroPage = pathname === "/" || pathname.startsWith("/categories/") || pathname === "/about";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/products" },
    { name: "Inspiration & Lookbook", href: "/#lookbook" },
    { name: "About Heritage", href: "/about" },
  ];

  const isTransparent = !isScrolled && isDarkHeroPage;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent border-b border-white/10 py-5"
          : "bg-white/95 backdrop-blur-md border-b border-[#e8e2d9] shadow-sm py-3.5"
      )}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="group inline-flex items-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <BrandLogo isTransparent={isTransparent} size="md" />
            </motion.div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={clsx(
                "text-sm font-semibold transition-colors relative py-1",
                isTransparent
                  ? "text-white/90 hover:text-[#dec49a]"
                  : (pathname === "/" ? "text-[#9b7842]" : "text-[#374151] hover:text-[#9b7842]")
              )}
            >
              Home
              {pathname === "/" && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9b7842] rounded-full"
                />
              )}
            </Link>

            {/* Categories Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                type="button"
                className={clsx(
                  "flex items-center gap-1.5 text-sm font-semibold py-2 transition-colors cursor-pointer",
                  isTransparent
                    ? "text-white/90 hover:text-[#dec49a]"
                    : "text-[#374151] hover:text-[#9b7842]"
                )}
              >
                <span>Categories</span>
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 transition-transform duration-200",
                    megaMenuOpen ? "rotate-180 text-[#dec49a]" : ""
                  )}
                />
              </button>

              {/* Mega Dropdown Panel with AnimatePresence */}
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full -left-20 w-[840px] pt-2 z-50"
                  >
                    <div className="bg-white border border-[#e5e0d8] rounded-2xl p-6 shadow-2xl">
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#ede8df]">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#9b7842]" />
                          <span className="text-xs uppercase tracking-widest text-[#6a5028] font-semibold">
                            Explore All 16 Bathroom Categories
                          </span>
                        </div>
                        <Link
                          href="/products"
                          className="text-xs font-semibold text-[#9b7842] hover:text-[#543e20] flex items-center gap-1 transition-colors group"
                        >
                          <span>View Full Catalogue</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            className="group/item flex flex-col p-2.5 rounded-xl hover:bg-[#f7f5f0] transition-all border border-transparent hover:border-[#e5e0d8] hover:translate-y-[-1px]"
                          >
                            <span className="text-xs font-semibold text-[#1f2937] group-hover/item:text-[#9b7842] transition-colors truncate">
                              {cat.name}
                            </span>
                            <span className="text-[11px] text-[#6b7280] line-clamp-1 mt-0.5">
                              {cat.shortDescription}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/products"
              className={clsx(
                "text-sm font-semibold transition-colors relative py-1",
                isTransparent
                  ? "text-white/90 hover:text-[#dec49a]"
                  : (pathname === "/products" ? "text-[#9b7842]" : "text-[#374151] hover:text-[#9b7842]")
              )}
            >
              All Products
              {pathname === "/products" && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9b7842] rounded-full"
                />
              )}
            </Link>

            <Link
              href="/#lookbook"
              className={clsx(
                "text-sm font-semibold transition-colors",
                isTransparent
                  ? "text-white/90 hover:text-[#dec49a]"
                  : "text-[#374151] hover:text-[#9b7842]"
              )}
            >
              Lookbook
            </Link>

            <Link
              href="/about"
              className={clsx(
                "text-sm font-semibold transition-colors relative py-1",
                isTransparent
                  ? "text-white/90 hover:text-[#dec49a]"
                  : (pathname === "/about" ? "text-[#9b7842]" : "text-[#374151] hover:text-[#9b7842]")
              )}
            >
              About
              {pathname === "/about" && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9b7842] rounded-full"
                />
              )}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Trigger */}
            <div className="relative">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSearchOpen(!searchOpen)}
                className={clsx(
                  "p-2 rounded-full transition-colors cursor-pointer",
                  isTransparent
                    ? "text-white hover:text-[#dec49a] hover:bg-white/10"
                    : "text-[#4b5563] hover:text-[#151a22] hover:bg-[#f7f5f0]"
                )}
                aria-label="Search catalogue"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-[#e5e0d8] rounded-xl p-3 shadow-xl z-50"
                  >
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (searchQuery.trim()) {
                          window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                        }
                      }}
                    >
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search faucets, showers, tubs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#f7f5f0] border border-[#e5e0d8] rounded-lg pl-9 pr-4 py-2 text-xs text-[#151a22] placeholder-neutral-500 focus:outline-none focus:border-[#9b7842]"
                          autoFocus
                        />
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Link Button */}
            <Link
              href="/wishlist"
              className={clsx(
                "relative p-2.5 rounded-full transition-colors cursor-pointer",
                isTransparent
                  ? "text-white hover:text-rose-300 hover:bg-white/10"
                  : "text-[#4b5563] hover:text-rose-600 hover:bg-rose-50"
              )}
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Heart className={clsx("w-5 h-5", totalWishlistItems > 0 ? "fill-rose-500 text-rose-500" : "")} />
              </motion.div>
              {totalWishlistItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs"
                >
                  {totalWishlistItems}
                </motion.span>
              )}
            </Link>

            {/* Cart Link Button */}
            <Link
              href="/cart"
              className={clsx(
                "relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer shadow-xs",
                isTransparent
                  ? "bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm"
                  : "bg-[#1c1815] hover:bg-[#9b7842] text-white border border-transparent"
              )}
              title="Shopping Cart"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2">
                <CartIcon className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="bg-[#9b7842] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center -ml-0.5 shadow-xs"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Consult Architect CTA -> Links to /contact */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden md:block">
              <Link
                href="/contact"
                className={clsx(
                  "flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-full shadow-sm transition-all",
                  isTransparent
                    ? "bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] hover:from-white hover:to-[#ded5cb] text-[#1c1815] border border-[#e0d6cd]"
                    : "bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] hover:from-white hover:to-[#ded5cb] text-[#1c1815] border border-[#ded5cb] hover:shadow-md"
                )}
              >
                <span>Consult Architect</span>
              </Link>
            </motion.div>

            {/* Mobile Hamburger Toggle */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={clsx(
                "lg:hidden p-2 rounded-lg cursor-pointer",
                isTransparent ? "text-white hover:bg-white/10" : "text-[#374151] hover:text-[#1c1815] hover:bg-[#F2ECE7]"
              )}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with AnimatePresence */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden mt-4 pb-6 pt-2 border-t border-[#e6ddd6] bg-white rounded-2xl p-4 shadow-xl overflow-hidden"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 + 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="block px-3 py-2.5 rounded-lg text-base font-semibold text-[#1c1815] hover:bg-[#F2ECE7] hover:text-[#8c7764]"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-2 pb-1 border-t border-[#e6ddd6]">
                  <span className="text-[11px] uppercase tracking-widest text-[#8c7764] font-semibold px-3">
                    Popular Categories
                  </span>
                  <div className="grid grid-cols-2 gap-2 mt-2 px-1">
                    {CATEGORIES.slice(0, 8).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        className="text-xs font-medium text-[#4b5563] hover:text-[#1c1815] p-2 rounded bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] border border-[#ded5cb] truncate"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <Link
                    href="/contact"
                    className="w-full text-center bg-gradient-to-r from-[#fcfbf9] via-[#F2ECE7] to-[#e6ddd6] hover:from-white hover:to-[#ded5cb] text-[#1c1815] border border-[#ded5cb] font-semibold text-xs uppercase tracking-wider py-3 rounded-lg shadow-sm"
                  >
                    Consult Architect / Showroom Tour
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  );
}
