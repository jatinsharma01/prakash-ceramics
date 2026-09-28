import { Product, FinishType } from "./types";

export interface FinishDetail {
  finish: FinishType;
  image: string;
  mrp: number;
  offerPrice: number;
  sku: string;
  stock: number;
}

export interface ProductPriceSummary {
  price: number;        // Active selling price (offer price if available, else MRP)
  mrp: number;          // Catalogue / MRP price
  hasDiscount: boolean; // true if mrp > price
  discountPercent: number;
  isStartingPrice?: boolean;
}

/**
 * Extracts the full finish gallery directly from `finishes` and `finishImages`.
 */
export function getProductFinishGallery(product: Product): FinishDetail[] {
  if (!product) return [];

  // Robustly derive all finish names from finishes, finishImages, finishPrices, finishOfferPrices
  const finishNames = Array.from(
    new Set([
      ...(Array.isArray(product.finishes) ? product.finishes : []),
      ...Object.keys(product.finishImages || {}),
      ...Object.keys(product.finishPrices || {}),
      ...Object.keys(product.finishOfferPrices || {}),
    ])
  ).filter((f) => typeof f === "string" && f.trim().length > 0);

  const gallery: FinishDetail[] = [];

  for (const finish of finishNames) {
    const img = product.finishImages?.[finish];
    const mrp = Number(product.finishPrices?.[finish]) || 0;
    const offerPrice = Number(product.finishOfferPrices?.[finish]) || 0;
    const sku = product.finishSkus?.[finish] || product.sku || "";
    const stock = product.finishStocks?.[finish] !== undefined
      ? Number(product.finishStocks[finish])
      : (product.stockCount || 0);

    const image = img || (product.images && product.images[0]) || "";

    if (image) {
      gallery.push({
        finish: finish as FinishType,
        image,
        mrp,
        offerPrice,
        sku,
        stock,
      });
    }
  }

  // Fallback if finishImages is empty (legacy support)
  if (gallery.length === 0 && product.images && product.images.length > 0) {
    product.images.forEach((img, idx) => {
      gallery.push({
        finish: (product.finishes?.[idx] || product.finishes?.[0] || "Standard") as FinishType,
        image: img,
        mrp: product.price || 0,
        offerPrice: product.price || 0,
        sku: product.sku || "",
        stock: product.stockCount || 0,
      });
    });
  }

  return gallery;
}

/**
 * Returns all display images for a product, prioritizing `finishImages`.
 */
export function getProductDisplayImages(product: Product): string[] {
  if (!product) return [];

  const finishImgs: string[] = [];

  // 1. In order of finishes array
  if (product.finishes && product.finishes.length > 0 && product.finishImages) {
    for (const f of product.finishes) {
      const img = product.finishImages[f];
      if (img && !finishImgs.includes(img)) {
        finishImgs.push(img);
      }
    }
  }

  // 2. Any additional images in finishImages map
  if (product.finishImages) {
    for (const img of Object.values(product.finishImages)) {
      if (img && !finishImgs.includes(img)) {
        finishImgs.push(img);
      }
    }
  }

  if (finishImgs.length > 0) {
    return finishImgs;
  }

  if (product.images && product.images.length > 0) {
    return product.images;
  }

  return ["https://res.cloudinary.com/dtk1pspib/image/upload/v1788760648/parkash-ceramics/faucets.jpg"];
}

/**
 * Computes the effective price for a product or for a specific finish using `finishPrices` and `finishOfferPrices`.
 */
export function getProductPricing(product: Product, selectedFinish?: string): ProductPriceSummary {
  if (!product) {
    return { price: 0, mrp: 0, hasDiscount: false, discountPercent: 0 };
  }

  // If a specific finish is selected
  if (selectedFinish) {
    const mrp = Number(product.finishPrices?.[selectedFinish]) || 0;
    const offerPrice = Number(product.finishOfferPrices?.[selectedFinish]) || 0;
    const price = offerPrice > 0 ? offerPrice : (mrp > 0 ? mrp : (product.price || 0));
    const effectiveMrp = mrp > 0 ? mrp : (product.originalPrice || 0);
    const hasDiscount = effectiveMrp > price;
    const discountPercent = hasDiscount ? Math.round(((effectiveMrp - price) / effectiveMrp) * 100) : 0;

    return {
      price,
      mrp: effectiveMrp,
      hasDiscount,
      discountPercent,
    };
  }

  // Default / overall product pricing for catalog / product cards
  const firstFinish =
    (product.finishes && product.finishes.length > 0 ? product.finishes[0] : undefined) ||
    Object.keys(product.finishImages || {})[0] ||
    Object.keys(product.finishPrices || {})[0];
  const allOfferPrices = product.finishOfferPrices
    ? Object.values(product.finishOfferPrices).map(Number).filter((p) => p > 0)
    : [];
  const allMrpPrices = product.finishPrices
    ? Object.values(product.finishPrices).map(Number).filter((p) => p > 0)
    : [];

  const primaryOfferPrice = firstFinish && product.finishOfferPrices?.[firstFinish]
    ? Number(product.finishOfferPrices[firstFinish])
    : (allOfferPrices.length > 0 ? Math.min(...allOfferPrices) : 0);

  const primaryMrp = firstFinish && product.finishPrices?.[firstFinish]
    ? Number(product.finishPrices[firstFinish])
    : (allMrpPrices.length > 0 ? Math.min(...allMrpPrices) : 0);

  const price = primaryOfferPrice > 0 ? primaryOfferPrice : (primaryMrp > 0 ? primaryMrp : (product.price || 0));
  const mrp = primaryMrp > 0 ? primaryMrp : (product.originalPrice || 0);
  const hasDiscount = mrp > price;
  const discountPercent = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return {
    price,
    mrp,
    hasDiscount,
    discountPercent,
    isStartingPrice: allOfferPrices.length > 1 || allMrpPrices.length > 1,
  };
}

/**
 * Returns the active finish SKU from `finishSkus` or falls back to base sku.
 */
export function getProductFinishSku(product: Product, finish?: string): string {
  if (finish && product.finishSkus && product.finishSkus[finish]) {
    return product.finishSkus[finish].trim();
  }
  return product.sku || "";
}

/**
 * Returns the active finish stock from `finishStocks` or falls back to base stockCount.
 */
export function getProductFinishStock(product: Product, finish?: string): number {
  if (finish && product.finishStocks && product.finishStocks[finish] !== undefined) {
    return Number(product.finishStocks[finish]);
  }
  return product.stockCount !== undefined ? Number(product.stockCount) : 0;
}
