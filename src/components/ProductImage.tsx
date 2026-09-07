"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Sparkles, ImageOff } from "lucide-react";
import { clsx } from "clsx";

interface ProductImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  containerClassName?: string;
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000";

export function ProductImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackSrc = DEFAULT_FALLBACK,
  fill,
  width,
  height,
  priority = false,
  sizes,
  ...rest
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(typeof src === "string" ? src : DEFAULT_FALLBACK);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state if prop changes
  React.useEffect(() => {
    if (typeof src === "string" && src !== imgSrc && !hasError) {
      setImgSrc(src);
      setIsLoading(true);
    }
  }, [src, imgSrc, hasError]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      setIsLoading(false);
    }
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div
      className={clsx(
        "relative overflow-hidden bg-transparent",
        fill ? "w-full h-full" : "",
        containerClassName
      )}
    >
      {/* Loading Skeleton / Shimmer */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-r from-[#ede8df] via-[#f7f5f0] to-[#ede8df] animate-pulse">
          <div className="flex items-center gap-2 text-[#84786d] text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#9b7842]" />
            <span>Prakash Ceramics</span>
          </div>
        </div>
      )}

      {/* Fallback Display if both primary & secondary fail */}
      {hasError && imgSrc === fallbackSrc && (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-[#fbf9f5] text-[#84786d] p-4 text-center">
          <ImageOff className="w-8 h-8 text-[#b5aba0] mb-2" />
          <p className="text-xs uppercase tracking-wider font-semibold text-[#151a22]">Prakash Ceramics</p>
          <p className="text-[10px] text-[#84786d] mt-1">Premium Sanitaryware</p>
        </div>
      )}

      <Image
        src={imgSrc}
        alt={alt || "Prakash Ceramics Luxury Bathroom Product"}
        fill={fill}
        width={!fill ? width || 800 : undefined}
        height={!fill ? height || 800 : undefined}
        priority={priority}
        sizes={sizes || (fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined)}
        onError={handleError}
        onLoad={handleLoadingComplete}
        className={clsx(
          "transition-all duration-700 ease-out",
          isLoading ? "scale-105 blur-sm opacity-0" : "scale-100 blur-0 opacity-100",
          className
        )}
        {...rest}
      />
    </div>
  );
}
