"use client";

import React from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface BrandLogoProps {
  variant?: "dark" | "light" | "auto";
  isTransparent?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({
  variant = "auto",
  isTransparent = false,
  className,
  size = "md",
}: BrandLogoProps) {
  const isLightText = variant === "light" || (variant === "auto" && isTransparent);

  const imageSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10 sm:w-11 sm:h-11",
    lg: "w-12 h-12 sm:w-14 sm:h-14",
  };

  const titleSizes = {
    sm: "text-base tracking-[0.2em]",
    md: "text-lg sm:text-xl tracking-[0.22em]",
    lg: "text-2xl sm:text-3xl tracking-[0.22em]",
  };

  const subtitleSizes = {
    sm: "text-[8px] tracking-[0.38em]",
    md: "text-[9px] sm:text-[10px] tracking-[0.4em]",
    lg: "text-xs tracking-[0.42em]",
  };

  return (
    <div className={clsx("flex items-center gap-3 select-none", className)}>
      {/* Metallic PC Logo Mark */}
      <div className={clsx("relative shrink-0 transition-transform duration-300 group-hover:scale-105", imageSizes[size])}>
        <Image
          src="/pc-mark.png"
          alt="Prakash Ceramics Emblem"
          fill
          priority
          sizes="70px"
          className="object-contain"
        />
      </div>

      {/* Brand Typography (PRAKASH / CERAMICS) */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={clsx(
            "font-sans font-semibold uppercase transition-colors duration-300",
            titleSizes[size],
            isLightText
              ? "text-white group-hover:text-[#dec49a]"
              : "text-[#151a22] group-hover:text-[#9b7842]"
          )}
        >
          PRAKASH
        </span>
        <span
          className={clsx(
            "font-sans font-medium uppercase mt-1 transition-colors duration-300",
            subtitleSizes[size],
            isLightText
              ? "text-[#d5ccc0] group-hover:text-white"
              : "text-[#555f6d] group-hover:text-[#151a22]"
          )}
        >
          CERAMICS
        </span>
      </div>
    </div>
  );
}
