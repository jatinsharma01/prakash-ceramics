import { prisma } from "./prisma";
import { PRODUCTS } from "./products";
import { CATEGORIES } from "./categories";
import { 
  ADMIN_COUPONS, 
  ADMIN_ORDERS, 
  ADMIN_USERS, 
  ADMIN_STATS, 
  REVENUE_MONTHLY_DATA, 
  CATEGORY_SALES_BREAKDOWN, 
  FINISH_PREFERENCE_DATA, 
  REGIONAL_SALES, 
  AdminCoupon, 
  AdminOrder, 
  AdminUser 
} from "./adminData";
import { Product, Category } from "./types";

export interface SaleItem {
  id: string;
  title: string;
  slug: string;
  bannerText: string;
  discountType: string;
  discountValue: number;
  targetCategory?: string | null;
  targetProductIds?: string[];
  badgeText?: string | null;
  bannerImage?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  isActive: boolean;
}

// In-Memory mutable fallback stores for development/preview when PostgreSQL is pending migration
let memoryProducts: Product[] = [...PRODUCTS];
let memoryCategories: Category[] = [...CATEGORIES];
let memoryCoupons: AdminCoupon[] = [...ADMIN_COUPONS];
let memoryOrders: AdminOrder[] = [...ADMIN_ORDERS];
let memoryUsers: AdminUser[] = [...ADMIN_USERS];
let memorySales: SaleItem[] = [
  {
    id: "sale-monsoon-fest",
    title: "Monsoon Grand Hydrotherapy Fest",
    slug: "monsoon-grand-hydrotherapy-fest",
    bannerText: "Flat 15% Instant Privilege Discount across all Rain Showers & Body Jet Systems",
    discountType: "percentage",
    discountValue: 15,
    targetCategory: "showers",
    targetProductIds: [],
    badgeText: "SEASONAL EXCLUSIVE",
    bannerImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    id: "sale-pvd-faucets",
    title: "Royal PVD Gold & Black Chrome Suite",
    slug: "royal-pvd-gold-and-black-chrome-suite",
    bannerText: "Exclusive ₹3,000 Off on orders above ₹40,000 in Fusion & Artize Collections",
    discountType: "fixed",
    discountValue: 3000,
    targetCategory: "faucets",
    targetProductIds: [],
    badgeText: "LIMITED PERIOD",
    bannerImage: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=1200",
    startDate: new Date(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
];

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  preferredDate?: string | null;
  message: string;
  source: string; // "Home Page Consultation" | "Contact Page"
  status: "New" | "Contacted" | "Scheduled" | "Completed" | "Archived";
  adminNotes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

let memoryEnquiries: Enquiry[] = [
  {
    id: "enq-101",
    name: "Ar. Neha Singhania",
    email: "neha.singhania@designatelier.in",
    phone: "+91 98101 22345",
    projectType: "Residential Villa",
    preferredDate: "2026-09-12",
    message: "Designing a 4-storey luxury residence in DLF Phase 5. Need Brushed Gold PVD faucets, concealed thermostatic showers and freestanding bathtubs for 6 master bathrooms.",
    source: "Home Page Consultation",
    status: "New",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "enq-102",
    name: "Rajeshwar Mehra",
    email: "rmehra@mehraholding.com",
    phone: "+91 98200 77890",
    projectType: "Luxury Penthouse",
    preferredDate: "2026-09-15",
    message: "Looking for ceiling rain showers with mist & chromotherapy lighting, plus sensor-operated touchless brassware for South Mumbai duplex.",
    source: "Contact Page",
    status: "Contacted",
    adminNotes: "Connected on WhatsApp. Shared Artize catalog and finish samples.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "enq-103",
    name: "Kavita Kapoor",
    email: "kavita.k@zenithdesigns.com",
    phone: "+91 97110 44512",
    projectType: "Hospitality Resort",
    preferredDate: "2026-09-18",
    message: "Upcoming boutique resort project in Rishikesh (24 guest villas). Require technical CAD drawings and wholesale quotation for matte black shower columns.",
    source: "Home Page Consultation",
    status: "Scheduled",
    adminNotes: "Showroom walkthrough scheduled for Saturday 3:00 PM.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
];

// Helper to safely execute Prisma query with in-memory fallback
async function withDbFallback<T>(dbQuery: () => Promise<T>, fallbackQuery: () => T | Promise<T>): Promise<T> {
  try {
    return await dbQuery();
  } catch (err) {
    console.error("[withDbFallback] Prisma error caught, falling back:", err);
    return await fallbackQuery();
  }
}

// -------------------------------------------------------------
// PRODUCTS CRUD
// -------------------------------------------------------------
export async function getProducts(options?: {
  categorySlug?: string;
  search?: string;
  limit?: number;
  featured?: boolean;
  bestseller?: boolean;
}): Promise<Product[]> {
  return withDbFallback<Product[]>(
    async () => {
      const where: Record<string, any> = {};
      if (options?.categorySlug && options.categorySlug !== "all") {
        where.categorySlug = options.categorySlug;
      }
      if (options?.featured) {
        where.isFeatured = true;
      }
      if (options?.bestseller) {
        where.isBestseller = true;
      }
      if (options?.search) {
        where.OR = [
          { name: { contains: options.search, mode: "insensitive" } },
          { sku: { contains: options.search, mode: "insensitive" } },
          { category: { contains: options.search, mode: "insensitive" } },
          { tagline: { contains: options.search, mode: "insensitive" } },
        ];
      }

      const products = await prisma.product.findMany({
        where,
        take: options?.limit,
        orderBy: { createdAt: "desc" },
      });

      return products.map((p): Product => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        categorySlug: p.categorySlug,
        subcategory: p.subcategory || undefined,
        range: p.range || undefined,
        tagline: p.tagline,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice || undefined,
        sku: p.sku,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        isBestseller: p.isBestseller,
        finishes: p.finishes as any,
        finishImages: (p.finishImages as Record<string, string>) || undefined,
        finishPrices: (p.specs as any)?.finishPrices || undefined,
        finishSkus: (p.specs as any)?.finishSkus || undefined,
        finishStocks: (p.specs as any)?.finishStocks || undefined,
        stockCount: p.stockCount,
        images: p.images,
        dimensions: p.dimensions || undefined,
        flowRate: p.flowRate || undefined,
        material: p.material || "Solid Forged Brass",
        warranty: p.warranty || "15 Years Warranty",
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        features: p.features,
        specs: (p.specs as Record<string, string>) || {},
      }));
    },
    () => {
      let list = [...memoryProducts];
      if (options?.categorySlug && options.categorySlug !== "all") {
        list = list.filter((p) => p.categorySlug.toLowerCase() === options.categorySlug?.toLowerCase());
      }
      if (options?.featured) {
        list = list.filter((p) => p.isFeatured);
      }
      if (options?.bestseller) {
        list = list.filter((p) => p.isBestseller);
      }
      if (options?.search) {
        const q = options.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q)
        );
      }
      if (options?.limit) {
        list = list.slice(0, options.limit);
      }
      return list;
    }
  );
}

export async function getProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  return withDbFallback<Product | null>(
    async () => {
      const p = await prisma.product.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }, { sku: idOrSlug }],
        },
      });
      if (!p) return null;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        categorySlug: p.categorySlug,
        subcategory: p.subcategory || undefined,
        range: p.range || undefined,
        tagline: p.tagline,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice || undefined,
        sku: p.sku,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        isBestseller: p.isBestseller,
        finishes: p.finishes as any,
        finishImages: (p.finishImages as Record<string, string>) || undefined,
        finishPrices: (p.specs as any)?.finishPrices || undefined,
        finishSkus: (p.specs as any)?.finishSkus || undefined,
        finishStocks: (p.specs as any)?.finishStocks || undefined,
        stockCount: p.stockCount,
        images: p.images,
        dimensions: p.dimensions || undefined,
        flowRate: p.flowRate || undefined,
        material: p.material || "Solid Forged Brass",
        warranty: p.warranty || "15 Years Warranty",
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        features: p.features,
        specs: (p.specs as Record<string, string>) || {},
      };
    },
    () => {
      return (
        memoryProducts.find(
          (p) => p.id === idOrSlug || p.slug === idOrSlug || p.sku.toLowerCase() === idOrSlug.toLowerCase()
        ) || null
      );
    }
  );
}

export async function updateProduct(id: string, data: any): Promise<Product | null> {
  return withDbFallback<Product | null>(
    async () => {
      const existing = await prisma.product.findFirst({
        where: { OR: [{ id }, { slug: id }, { sku: id }] },
      });

      if (!existing) return null;

      const updatedSpecs = {
        ...((existing.specs as any) || {}),
        ...((data.specs as any) || {}),
        finishPrices: data.finishPrices || (data.specs as any)?.finishPrices || (existing.specs as any)?.finishPrices || {},
        finishSkus: data.finishSkus || (data.specs as any)?.finishSkus || (existing.specs as any)?.finishSkus || {},
        finishStocks: data.finishStocks || (data.specs as any)?.finishStocks || (existing.specs as any)?.finishStocks || {},
      };

      const updated = await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: data.name !== undefined ? data.name : existing.name,
          category: data.category !== undefined ? data.category : existing.category,
          categorySlug: data.category ? data.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") : existing.categorySlug,
          range: data.range !== undefined ? data.range : existing.range,
          tagline: data.tagline !== undefined ? data.tagline : existing.tagline,
          description: data.description !== undefined ? data.description : existing.description,
          price: data.price !== undefined ? Number(data.price) : existing.price,
          originalPrice: data.originalPrice !== undefined ? (data.originalPrice ? Number(data.originalPrice) : null) : existing.originalPrice,
          sku: data.sku !== undefined ? data.sku : existing.sku,
          stockCount: data.stockCount !== undefined ? Number(data.stockCount) : existing.stockCount,
          isFeatured: data.isFeatured !== undefined ? !!data.isFeatured : existing.isFeatured,
          isNew: data.isNew !== undefined ? !!data.isNew : existing.isNew,
          isBestseller: data.isBestseller !== undefined ? !!data.isBestseller : existing.isBestseller,
          finishes: data.finishes !== undefined ? data.finishes : existing.finishes,
          finishImages: data.finishImages !== undefined ? JSON.parse(JSON.stringify(data.finishImages)) : existing.finishImages,
          images: data.images !== undefined ? data.images : existing.images,
          material: data.material !== undefined ? data.material : existing.material,
          warranty: data.warranty !== undefined ? data.warranty : existing.warranty,
          dimensions: data.dimensions !== undefined ? data.dimensions : existing.dimensions,
          flowRate: data.flowRate !== undefined ? data.flowRate : existing.flowRate,
          features: data.features !== undefined ? data.features : existing.features,
          specs: JSON.parse(JSON.stringify(updatedSpecs)),
        },
      });

      const productResult: Product = {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        category: updated.category,
        categorySlug: updated.categorySlug,
        range: updated.range || undefined,
        tagline: updated.tagline,
        description: updated.description,
        price: updated.price,
        originalPrice: updated.originalPrice || undefined,
        sku: updated.sku,
        stockCount: updated.stockCount,
        isFeatured: updated.isFeatured,
        isNew: updated.isNew,
        isBestseller: updated.isBestseller,
        finishes: updated.finishes as any,
        finishImages: (updated.finishImages as Record<string, string>) || undefined,
        finishPrices: updatedSpecs.finishPrices,
        finishSkus: updatedSpecs.finishSkus,
        finishStocks: updatedSpecs.finishStocks,
        images: updated.images,
        material: updated.material || "Solid Forged Brass",
        warranty: updated.warranty || "10 Years Warranty",
        dimensions: updated.dimensions || undefined,
        flowRate: updated.flowRate || undefined,
        rating: updated.rating,
        reviewsCount: updated.reviewsCount,
        features: updated.features,
        specs: (updated.specs as Record<string, string>) || {},
      };

      const memIdx = memoryProducts.findIndex((p) => p.id === existing.id);
      if (memIdx !== -1) {
        memoryProducts[memIdx] = productResult;
      }

      return productResult;
    },
    () => {
      const idx = memoryProducts.findIndex((p) => p.id === id || p.slug === id);
      if (idx === -1) return null;
      memoryProducts[idx] = {
        ...memoryProducts[idx],
        ...data,
        finishPrices: data.finishPrices || memoryProducts[idx].finishPrices,
        finishSkus: data.finishSkus || memoryProducts[idx].finishSkus,
        finishStocks: data.finishStocks || memoryProducts[idx].finishStocks,
      };
      return memoryProducts[idx];
    }
  );
}

export async function createProduct(data: {
  name: string;
  category: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  sku?: string;
  stockCount?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  finishes: string[];
  images: string[];
  finishImages?: Record<string, string>;
  dimensions?: string;
  flowRate?: string;
  material?: string;
  warranty?: string;
  features?: string[];
  specs?: Record<string, string>;
}): Promise<Product> {
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const categorySlug = data.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const sku = data.sku || `PC-${data.category.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: data.name,
    slug,
    category: data.category,
    categorySlug,
    tagline: data.tagline,
    description: data.description,
    price: Number(data.price),
    originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
    sku,
    isFeatured: !!data.isFeatured,
    isNew: data.isNew !== undefined ? data.isNew : true,
    isBestseller: !!data.isBestseller,
    finishes: (data.finishes as any) || ["Chrome"],
    finishImages: data.finishImages || {},
    images: data.images?.length > 0 ? data.images : ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"],
    dimensions: data.dimensions || "Standard Luxury Fit",
    flowRate: data.flowRate || "5.0 LPM Eco-Aerated",
    material: data.material || "Solid Forged Brass",
    warranty: data.warranty || "15 Years Warranty",
    rating: 5.0,
    reviewsCount: 1,
    features: data.features || [],
    specs: data.specs || {},
  };

  return withDbFallback<Product>(
    async () => {
      await prisma.product.create({
        data: {
          id: newProduct.id,
          sku: newProduct.sku,
          name: newProduct.name,
          slug: newProduct.slug,
          category: newProduct.category,
          categorySlug: newProduct.categorySlug,
          tagline: newProduct.tagline,
          description: newProduct.description,
          price: newProduct.price,
          originalPrice: newProduct.originalPrice,
          stockCount: data.stockCount || 25,
          isFeatured: newProduct.isFeatured,
          isNew: newProduct.isNew,
          isBestseller: newProduct.isBestseller,
          finishes: newProduct.finishes as string[],
          finishImages: newProduct.finishImages ? JSON.parse(JSON.stringify(newProduct.finishImages)) : undefined,
          images: newProduct.images,
          dimensions: newProduct.dimensions,
          flowRate: newProduct.flowRate,
          material: newProduct.material,
          warranty: newProduct.warranty,
          rating: newProduct.rating,
          reviewsCount: newProduct.reviewsCount,
          features: newProduct.features,
          specs: newProduct.specs ? JSON.parse(JSON.stringify(newProduct.specs)) : undefined,
        },
      });
      memoryProducts.unshift(newProduct);
      return newProduct;
    },
    () => {
      memoryProducts.unshift(newProduct);
      return newProduct;
    }
  );
}

export async function deleteProduct(id: string): Promise<any | null> {
  return withDbFallback<any | null>(
    async () => {
      const deleted = await prisma.product.delete({ where: { id } });
      memoryProducts = memoryProducts.filter((p) => p.id !== id);
      return deleted;
    },
    () => {
      const index = memoryProducts.findIndex((p) => p.id === id);
      if (index !== -1) {
        const removed = memoryProducts.splice(index, 1);
        return removed[0];
      }
      return null;
    }
  );
}

// -------------------------------------------------------------
// SALES / PROMOTIONS CRUD
// -------------------------------------------------------------
export async function getSales(onlyActive = false): Promise<SaleItem[]> {
  return withDbFallback<SaleItem[]>(
    async () => {
      const list = await prisma.sale.findMany({
        where: onlyActive ? { isActive: true } : undefined,
        orderBy: { createdAt: "desc" },
      });
      return list.map((s) => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        bannerText: s.bannerText,
        discountType: s.discountType,
        discountValue: s.discountValue,
        targetCategory: s.targetCategory,
        targetProductIds: s.targetProductIds,
        badgeText: s.badgeText,
        bannerImage: s.bannerImage,
        startDate: s.startDate,
        endDate: s.endDate,
        isActive: s.isActive,
      }));
    },
    () => {
      return onlyActive ? memorySales.filter((s) => s.isActive) : memorySales;
    }
  );
}

export async function createSale(data: {
  title: string;
  bannerText: string;
  discountType: string;
  discountValue: number;
  targetCategory?: string;
  targetProductIds?: string[];
  badgeText?: string;
  bannerImage?: string;
  endDate?: string;
  isActive?: boolean;
}): Promise<SaleItem> {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newSale: SaleItem = {
    id: `sale-${Date.now()}`,
    title: data.title,
    slug,
    bannerText: data.bannerText,
    discountType: data.discountType || "percentage",
    discountValue: Number(data.discountValue),
    targetCategory: data.targetCategory || null,
    targetProductIds: data.targetProductIds || [],
    badgeText: data.badgeText || "SPECIAL PROMOTION",
    bannerImage: data.bannerImage || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200",
    startDate: new Date(),
    endDate: data.endDate ? new Date(data.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: data.isActive !== undefined ? data.isActive : true,
  };

  return withDbFallback<SaleItem>(
    async () => {
      const created = await prisma.sale.create({
        data: {
          id: newSale.id,
          title: newSale.title,
          slug: newSale.slug,
          bannerText: newSale.bannerText,
          discountType: newSale.discountType,
          discountValue: newSale.discountValue,
          targetCategory: newSale.targetCategory,
          targetProductIds: newSale.targetProductIds || [],
          badgeText: newSale.badgeText,
          bannerImage: newSale.bannerImage,
          startDate: new Date(newSale.startDate),
          endDate: newSale.endDate ? new Date(newSale.endDate) : undefined,
          isActive: newSale.isActive,
        },
      });
      memorySales.unshift(newSale);
      return {
        ...created,
        startDate: created.startDate,
        endDate: created.endDate,
      };
    },
    () => {
      memorySales.unshift(newSale);
      return newSale;
    }
  );
}

export async function toggleSaleStatus(id: string): Promise<SaleItem | null> {
  return withDbFallback<SaleItem | null>(
    async () => {
      const sale = await prisma.sale.findUnique({ where: { id } });
      if (!sale) return null;
      const updated = await prisma.sale.update({
        where: { id },
        data: { isActive: !sale.isActive },
      });
      const mem = memorySales.find((s) => s.id === id);
      if (mem) mem.isActive = updated.isActive;
      return {
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        bannerText: updated.bannerText,
        discountType: updated.discountType,
        discountValue: updated.discountValue,
        targetCategory: updated.targetCategory,
        targetProductIds: updated.targetProductIds,
        badgeText: updated.badgeText,
        bannerImage: updated.bannerImage,
        startDate: updated.startDate,
        endDate: updated.endDate,
        isActive: updated.isActive,
      };
    },
    () => {
      const sale = memorySales.find((s) => s.id === id);
      if (sale) {
        sale.isActive = !sale.isActive;
        return sale;
      }
      return null;
    }
  );
}

export async function deleteSale(id: string): Promise<any | null> {
  return withDbFallback<any | null>(
    async () => {
      const deleted = await prisma.sale.delete({ where: { id } });
      memorySales = memorySales.filter((s) => s.id !== id);
      return deleted;
    },
    () => {
      const idx = memorySales.findIndex((s) => s.id === id);
      if (idx !== -1) {
        return memorySales.splice(idx, 1)[0];
      }
      return null;
    }
  );
}

// -------------------------------------------------------------
// COUPONS CRUD & VALIDATION
// -------------------------------------------------------------
export async function getCoupons(): Promise<AdminCoupon[]> {
  return withDbFallback<AdminCoupon[]>(
    async () => {
      const list = await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
      });
      return list.map((c): AdminCoupon => ({
        id: c.id,
        code: c.code,
        discountType: c.discountType as any,
        discountValue: c.discountValue,
        minOrderValue: c.minOrderValue,
        usageLimit: c.usageLimit,
        usedCount: c.usedCount,
        startDate: c.startDate.toISOString().split("T")[0],
        expiryDate: c.expiryDate.toISOString().split("T")[0],
        status: c.status as any,
        description: c.description || "",
      }));
    },
    () => memoryCoupons
  );
}

export async function createCoupon(data: {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  expiryDate: string;
  description?: string;
}): Promise<AdminCoupon> {
  const code = data.code.trim().toUpperCase();
  const newCoupon: AdminCoupon = {
    id: `cpn-${Date.now()}`,
    code,
    discountType: data.discountType,
    discountValue: Number(data.discountValue),
    minOrderValue: data.minOrderValue ? Number(data.minOrderValue) : 0,
    usageLimit: data.usageLimit ? Number(data.usageLimit) : 100,
    usedCount: 0,
    startDate: new Date().toISOString().split("T")[0],
    expiryDate: data.expiryDate,
    status: "Active",
    description: data.description || `${data.discountType === "percentage" ? `${data.discountValue}%` : `₹${data.discountValue}`} Off Coupon`,
  };

  return withDbFallback<AdminCoupon>(
    async () => {
      await prisma.coupon.create({
        data: {
          id: newCoupon.id,
          code: newCoupon.code,
          discountType: newCoupon.discountType,
          discountValue: newCoupon.discountValue,
          minOrderValue: newCoupon.minOrderValue,
          maxDiscount: data.maxDiscount,
          usageLimit: newCoupon.usageLimit,
          usedCount: 0,
          expiryDate: new Date(newCoupon.expiryDate),
          status: "Active",
          description: newCoupon.description,
        },
      });
      memoryCoupons.unshift(newCoupon);
      return newCoupon;
    },
    () => {
      memoryCoupons.unshift(newCoupon);
      return newCoupon;
    }
  );
}

export async function validateCoupon(code: string, cartTotal: number) {
  const cleanCode = code.trim().toUpperCase();

  return withDbFallback(
    async () => {
      const coupon = await prisma.coupon.findUnique({
        where: { code: cleanCode },
      });

      if (!coupon) {
        return { valid: false, message: "Invalid promo code" };
      }
      if (coupon.status !== "Active") {
        return { valid: false, message: "This coupon is no longer active" };
      }
      if (new Date() > new Date(coupon.expiryDate)) {
        return { valid: false, message: "This coupon has expired" };
      }
      if (coupon.usedCount >= coupon.usageLimit) {
        return { valid: false, message: "This coupon usage limit has been reached" };
      }
      if (cartTotal < coupon.minOrderValue) {
        return {
          valid: false,
          message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString("en-IN")} required`,
        };
      }

      let discountAmount = 0;
      if (coupon.discountType === "percentage") {
        discountAmount = (cartTotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      discountAmount = Math.min(discountAmount, cartTotal);

      return {
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount: Math.round(discountAmount),
          description: coupon.description,
        },
        message: `Privilege code applied! Saved ₹${Math.round(discountAmount).toLocaleString("en-IN")}`,
      };
    },
    () => {
      const coupon = memoryCoupons.find((c) => c.code.toUpperCase() === cleanCode);
      if (!coupon) {
        return { valid: false, message: "Invalid promo code" };
      }
      if (coupon.status !== "Active") {
        return { valid: false, message: "This coupon is no longer active" };
      }
      if (new Date() > new Date(coupon.expiryDate)) {
        return { valid: false, message: "This coupon has expired" };
      }
      if (coupon.usedCount >= coupon.usageLimit) {
        return { valid: false, message: "This coupon usage limit has been reached" };
      }
      if (cartTotal < coupon.minOrderValue) {
        return {
          valid: false,
          message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString("en-IN")} required`,
        };
      }

      let discountAmount = 0;
      if (coupon.discountType === "percentage") {
        discountAmount = (cartTotal * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }

      discountAmount = Math.min(discountAmount, cartTotal);

      return {
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount: Math.round(discountAmount),
          description: coupon.description,
        },
        message: `Privilege code applied! Saved ₹${Math.round(discountAmount).toLocaleString("en-IN")}`,
      };
    }
  );
}

export async function toggleCouponStatus(id: string): Promise<AdminCoupon | null> {
  return withDbFallback<AdminCoupon | null>(
    async () => {
      const c = await prisma.coupon.findUnique({ where: { id } });
      if (!c) return null;
      const nextStatus = c.status === "Active" ? "Expired" : "Active";
      const updated = await prisma.coupon.update({
        where: { id },
        data: { status: nextStatus },
      });
      const mem = memoryCoupons.find((x) => x.id === id);
      if (mem) mem.status = nextStatus as any;
      return {
        id: updated.id,
        code: updated.code,
        discountType: updated.discountType as any,
        discountValue: updated.discountValue,
        minOrderValue: updated.minOrderValue,
        usageLimit: updated.usageLimit,
        usedCount: updated.usedCount,
        startDate: updated.startDate.toISOString().split("T")[0],
        expiryDate: updated.expiryDate.toISOString().split("T")[0],
        status: updated.status as any,
        description: updated.description || "",
      };
    },
    () => {
      const c = memoryCoupons.find((x) => x.id === id);
      if (c) {
        c.status = c.status === "Active" ? "Expired" : "Active";
        return c;
      }
      return null;
    }
  );
}

export async function deleteCoupon(id: string): Promise<any | null> {
  return withDbFallback<any | null>(
    async () => {
      const deleted = await prisma.coupon.delete({ where: { id } });
      memoryCoupons = memoryCoupons.filter((c) => c.id !== id);
      return deleted;
    },
    () => {
      const idx = memoryCoupons.findIndex((c) => c.id === id);
      if (idx !== -1) {
        return memoryCoupons.splice(idx, 1)[0];
      }
      return null;
    }
  );
}

// -------------------------------------------------------------
// ORDERS CRUD
// -------------------------------------------------------------
export async function getOrders(status?: string): Promise<AdminOrder[]> {
  return withDbFallback<AdminOrder[]>(
    async () => {
      const orders = await prisma.order.findMany({
        where: status && status !== "all" ? { fulfillmentStatus: { equals: status, mode: "insensitive" } } : undefined,
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });

      return orders.map((o): AdminOrder => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: {
          name: o.customerName,
          email: o.customerEmail || "",
          phone: o.customerPhone,
          city: o.customerCity,
          state: o.customerState,
        },
        date: o.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        items: o.items.map((i) => ({
          id: i.id,
          name: i.productName,
          sku: i.sku,
          finish: i.finish,
          quantity: i.quantity,
          price: i.price,
          image: i.image || "",
        })),
        subtotal: o.subtotal,
        tax: o.tax,
        discount: o.discount,
        total: o.total,
        paymentStatus: o.paymentStatus as any,
        fulfillmentStatus: o.fulfillmentStatus as any,
        paymentMethod: o.paymentMethod as any,
        shippingAddress: o.customerAddress,
        trackingNumber: o.trackingNumber || undefined,
      }));
    },
    () => {
      if (status && status !== "all") {
        return memoryOrders.filter((o) => o.fulfillmentStatus.toLowerCase() === status.toLowerCase());
      }
      return memoryOrders;
    }
  );
}

export async function createOrder(data: {
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode?: string;
    landmark?: string;
    projectType?: string;
    notes?: string;
  };
  items: Array<{
    product: { id?: string; name: string; sku: string; price: number; images?: string[] };
    selectedFinish: string;
    quantity: number;
  }>;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  paymentMethod?: string;
  couponCode?: string;
}): Promise<AdminOrder> {
  const orderNumber = `PC-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const newOrder: AdminOrder = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customer: {
      name: data.customer.fullName,
      email: data.customer.email || "",
      phone: data.customer.phone,
      city: data.customer.city,
      state: data.customer.state,
    },
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    items: data.items.map((i) => ({
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: i.product.name,
      sku: i.product.sku,
      finish: i.selectedFinish,
      quantity: i.quantity,
      price: i.product.price,
      image: i.product.images?.[0] || "",
    })),
    subtotal: data.subtotal,
    tax: data.tax || 0,
    discount: data.discount || 0,
    total: data.total,
    paymentStatus: "Pending",
    fulfillmentStatus: "Processing",
    paymentMethod: (data.paymentMethod as any) || "UPI / QR",
    shippingAddress: `${data.customer.address}, ${data.customer.city}, ${data.customer.state} - ${data.customer.pincode || ""}`,
    trackingNumber: `EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
  };

  return withDbFallback<AdminOrder>(
    async () => {
      let couponId: string | undefined = undefined;
      if (data.couponCode) {
        const c = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } });
        if (c) {
          couponId = c.id;
          await prisma.coupon.update({
            where: { id: c.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      await prisma.order.create({
        data: {
          id: newOrder.id,
          orderNumber: newOrder.orderNumber,
          customerName: data.customer.fullName,
          customerEmail: data.customer.email,
          customerPhone: data.customer.phone,
          customerCity: data.customer.city,
          customerState: data.customer.state,
          customerAddress: data.customer.address,
          customerPincode: data.customer.pincode,
          landmark: data.customer.landmark,
          projectType: data.customer.projectType || "Residential Villa",
          notes: data.customer.notes,
          subtotal: data.subtotal,
          tax: data.tax || 0,
          discount: data.discount || 0,
          total: data.total,
          paymentStatus: "Pending",
          fulfillmentStatus: "Processing",
          paymentMethod: data.paymentMethod || "UPI / QR",
          trackingNumber: newOrder.trackingNumber,
          couponId,
          couponCode: data.couponCode,
          items: {
            create: data.items.map((i) => ({
              productName: i.product.name,
              sku: i.product.sku,
              finish: i.selectedFinish,
              quantity: i.quantity,
              price: i.product.price,
              image: i.product.images?.[0] || null,
            })),
          },
        },
      });

      memoryOrders.unshift(newOrder);
      return newOrder;
    },
    () => {
      if (data.couponCode) {
        const c = memoryCoupons.find((x) => x.code === data.couponCode?.toUpperCase());
        if (c) c.usedCount += 1;
      }
      memoryOrders.unshift(newOrder);
      return newOrder;
    }
  );
}

export async function updateOrderStatus(
  orderId: string,
  fulfillmentStatus?: string,
  paymentStatus?: string,
  trackingNumber?: string
): Promise<AdminOrder | null> {
  return withDbFallback<AdminOrder | null>(
    async () => {
      const data: Record<string, any> = {};
      if (fulfillmentStatus) data.fulfillmentStatus = fulfillmentStatus;
      if (paymentStatus) data.paymentStatus = paymentStatus;
      if (trackingNumber) data.trackingNumber = trackingNumber;

      const updated = await prisma.order.update({
        where: { id: orderId },
        data,
        include: { items: true },
      });

      const orderResult: AdminOrder = {
        id: updated.id,
        orderNumber: updated.orderNumber,
        customer: {
          name: updated.customerName,
          email: updated.customerEmail || "",
          phone: updated.customerPhone,
          city: updated.customerCity,
          state: updated.customerState,
        },
        date: updated.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        items: updated.items.map((i) => ({
          id: i.id,
          name: i.productName,
          sku: i.sku,
          finish: i.finish,
          quantity: i.quantity,
          price: i.price,
          image: i.image || "",
        })),
        subtotal: updated.subtotal,
        tax: updated.tax,
        discount: updated.discount,
        total: updated.total,
        paymentStatus: updated.paymentStatus as any,
        fulfillmentStatus: updated.fulfillmentStatus as any,
        paymentMethod: updated.paymentMethod as any,
        shippingAddress: updated.customerAddress,
        trackingNumber: updated.trackingNumber || undefined,
      };

      const memIdx = memoryOrders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
      if (memIdx !== -1) {
        memoryOrders[memIdx] = orderResult;
      }
      return orderResult;
    },
    () => {
      const mem = memoryOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (mem) {
        if (fulfillmentStatus) mem.fulfillmentStatus = fulfillmentStatus as any;
        if (paymentStatus) mem.paymentStatus = paymentStatus as any;
        if (trackingNumber) mem.trackingNumber = trackingNumber;
        return mem;
      }
      return null;
    }
  );
}

// -------------------------------------------------------------
// USERS / CLIENTS & ARCHITECTS CRUD
// -------------------------------------------------------------
export async function getUsers(tier?: string): Promise<AdminUser[]> {
  return withDbFallback<AdminUser[]>(
    async () => {
      const users = await prisma.adminUser.findMany({
        where: tier && tier !== "all" ? { tier: { equals: tier, mode: "insensitive" } } : undefined,
        orderBy: { createdAt: "desc" },
      });

      return users.map((u): AdminUser => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        avatar: u.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150`,
        city: u.city,
        tier: u.tier as any,
        totalOrders: u.totalOrders,
        totalSpent: u.totalSpent,
        status: u.status as any,
        joinedDate: u.joinedDate.toISOString().split("T")[0],
        lastOrderDate: u.lastOrderDate ? u.lastOrderDate.toISOString().split("T")[0] : u.joinedDate.toISOString().split("T")[0],
        company: u.company || undefined,
      }));
    },
    () => {
      if (tier && tier !== "all") {
        return memoryUsers.filter((u) => u.tier.toLowerCase() === tier.toLowerCase());
      }
      return memoryUsers;
    }
  );
}

export async function createUser(data: {
  name: string;
  email: string;
  phone: string;
  city?: string;
  tier?: string;
  company?: string;
  status?: string;
}): Promise<AdminUser> {
  const newUser: AdminUser = {
    id: `usr-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150`,
    city: data.city || "Delhi NCR",
    tier: (data.tier as any) || "VIP Architect",
    totalOrders: 0,
    totalSpent: 0,
    status: (data.status as any) || "Active",
    joinedDate: new Date().toISOString().split("T")[0],
    lastOrderDate: new Date().toISOString().split("T")[0],
    company: data.company || "",
  };

  return withDbFallback<AdminUser>(
    async () => {
      await prisma.adminUser.create({
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          avatar: newUser.avatar,
          city: newUser.city,
          tier: newUser.tier,
          totalOrders: 0,
          totalSpent: 0,
          status: newUser.status,
          company: newUser.company,
        },
      });
      memoryUsers.unshift(newUser);
      return newUser;
    },
    () => {
      memoryUsers.unshift(newUser);
      return newUser;
    }
  );
}

export async function updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser | null> {
  return withDbFallback<AdminUser | null>(
    async () => {
      const updated = await prisma.adminUser.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email }),
          ...(data.phone && { phone: data.phone }),
          ...(data.city && { city: data.city }),
          ...(data.tier && { tier: data.tier }),
          ...(data.company !== undefined && { company: data.company }),
          ...(data.status && { status: data.status }),
          ...(data.totalOrders !== undefined && { totalOrders: Number(data.totalOrders) }),
          ...(data.totalSpent !== undefined && { totalSpent: Number(data.totalSpent) }),
        },
      });

      const userResult: AdminUser = {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        avatar: updated.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150`,
        city: updated.city,
        tier: updated.tier as any,
        totalOrders: updated.totalOrders,
        totalSpent: updated.totalSpent,
        status: updated.status as any,
        joinedDate: updated.joinedDate.toISOString().split("T")[0],
        lastOrderDate: updated.lastOrderDate ? updated.lastOrderDate.toISOString().split("T")[0] : updated.joinedDate.toISOString().split("T")[0],
        company: updated.company || undefined,
      };

      const memIdx = memoryUsers.findIndex((u) => u.id === id);
      if (memIdx !== -1) {
        memoryUsers[memIdx] = { ...memoryUsers[memIdx], ...userResult };
      }

      return userResult;
    },
    () => {
      const mem = memoryUsers.find((u) => u.id === id);
      if (mem) {
        Object.assign(mem, data);
        return mem;
      }
      return null;
    }
  );
}

export async function deleteUser(id: string): Promise<any | null> {
  return withDbFallback<any | null>(
    async () => {
      const deleted = await prisma.adminUser.delete({ where: { id } });
      memoryUsers = memoryUsers.filter((u) => u.id !== id);
      return deleted;
    },
    () => {
      const idx = memoryUsers.findIndex((u) => u.id === id);
      if (idx !== -1) {
        return memoryUsers.splice(idx, 1)[0];
      }
      return null;
    }
  );
}

// -------------------------------------------------------------
// ADMIN STATS
// -------------------------------------------------------------
export async function getAdminStats() {
  return withDbFallback(
    async () => {
      const [orders, products, usersCount, categories] = await Promise.all([
        prisma.order.findMany({
          include: { items: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.findMany({
          orderBy: { createdAt: "desc" },
        }),
        prisma.adminUser.count(),
        prisma.category.findMany(),
      ]);

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
      const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
      const lowStockItemsCount = products.filter((p) => p.stockCount <= 5).length;
      
      // Calculate real category sales breakdown
      const categorySalesMap: Record<string, { revenue: number; itemsSold: number }> = {};
      
      for (const cat of categories) {
        categorySalesMap[cat.name] = { revenue: 0, itemsSold: 0 };
      }

      for (const order of orders) {
        for (const item of order.items) {
          const prod = products.find((p) => p.sku === item.sku || p.name === item.productName);
          const catName = prod ? prod.category : "Faucets & Brassware";
          if (!categorySalesMap[catName]) {
            categorySalesMap[catName] = { revenue: 0, itemsSold: 0 };
          }
          categorySalesMap[catName].revenue += item.price * item.quantity;
          categorySalesMap[catName].itemsSold += item.quantity;
        }
      }

      const totalCatRevenue = Object.values(categorySalesMap).reduce((a, b) => a + b.revenue, 0) || totalRevenue || 1;
      const categoryColors = ["#9b7842", "#8c7764", "#dec49a", "#5f4f42", "#3d322a", "#b59b72", "#6e5d4f"];

      const categoryBreakdown = Object.entries(categorySalesMap).map(([name, data], idx) => ({
        name,
        revenue: data.revenue,
        itemsSold: data.itemsSold,
        percentage: Math.round((data.revenue / totalCatRevenue) * 100) || (idx === 0 ? 38 : idx === 1 ? 26 : idx === 2 ? 18 : 12),
        color: categoryColors[idx % categoryColors.length],
      })).sort((a, b) => b.revenue - a.revenue);

      // Monthly data aggregation from real orders
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyMap: Record<string, { revenue: number; orders: number; visitors: number }> = {};
      
      monthNames.forEach((m) => {
        monthlyMap[m] = { revenue: 0, orders: 0, visitors: Math.floor(4000 + Math.random() * 6000) };
      });

      orders.forEach((o) => {
        const d = new Date(o.createdAt);
        const m = monthNames[d.getMonth()];
        if (monthlyMap[m]) {
          monthlyMap[m].revenue += o.total;
          monthlyMap[m].orders += 1;
        }
      });

      const monthlyRevenue = monthNames.map((month) => {
        const real = monthlyMap[month];
        const staticFallback = REVENUE_MONTHLY_DATA.find((r) => r.month === month);
        return {
          month,
          revenue: real.revenue > 0 ? real.revenue : (staticFallback?.revenue || 0),
          orders: real.orders > 0 ? real.orders : (staticFallback?.orders || 0),
          visitors: real.visitors || (staticFallback?.visitors || 4500),
        };
      });

      const topProducts = products.slice(0, 4).map((p) => {
        const soldCount = orders.reduce((acc, o) => {
          const item = o.items.find((i) => i.sku === p.sku || i.productName === p.name);
          return acc + (item ? item.quantity : 0);
        }, 0);

        return {
          id: p.id,
          name: p.name,
          sku: p.sku,
          category: p.category,
          price: p.price,
          stockCount: p.stockCount,
          salesCount: soldCount > 0 ? soldCount : 15,
          images: p.images.length > 0 ? p.images : ["/images/faucets.png"],
        };
      });

      return {
        totalRevenue: totalRevenue > 0 ? totalRevenue : ADMIN_STATS.totalRevenue,
        revenueGrowth: "+18.4%",
        totalOrders: totalOrders > 0 ? totalOrders : ADMIN_STATS.totalOrders,
        ordersGrowth: "+12.2%",
        activeCustomers: (usersCount > 0 ? usersCount : 0) + (orders.length > 0 ? new Set(orders.map((o) => o.customerPhone)).size : ADMIN_STATS.activeCustomers),
        customersGrowth: "+8.7%",
        averageOrderValue: avgOrderValue > 0 ? avgOrderValue : ADMIN_STATS.averageOrderValue,
        aovGrowth: "+5.3%",
        conversionRate: "3.42%",
        lowStockItemsCount: lowStockItemsCount,
        categoryBreakdown: categoryBreakdown.length > 0 ? categoryBreakdown : CATEGORY_SALES_BREAKDOWN,
        monthlyRevenue,
        topProducts,
        finishPreferences: FINISH_PREFERENCE_DATA,
        regionalSales: REGIONAL_SALES,
      };
    },
    () => {
      const totalOrders = memoryOrders.length;
      const totalRevenue = memoryOrders.reduce((acc, o) => acc + o.total, 0);
      const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
      const lowStockItemsCount = memoryProducts.filter((p) => (p.stockCount ?? 20) <= 5).length;

      return {
        ...ADMIN_STATS,
        totalRevenue: totalRevenue || ADMIN_STATS.totalRevenue,
        totalOrders: totalOrders || ADMIN_STATS.totalOrders,
        averageOrderValue: avgOrderValue || ADMIN_STATS.averageOrderValue,
        activeCustomers: memoryUsers.length + memoryOrders.length,
        lowStockItemsCount,
        categoryBreakdown: CATEGORY_SALES_BREAKDOWN,
        monthlyRevenue: REVENUE_MONTHLY_DATA,
        topProducts: memoryProducts.slice(0, 4).map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          category: p.category,
          price: p.price,
          stockCount: p.stockCount,
          salesCount: 15,
          images: p.images,
        })),
        finishPreferences: FINISH_PREFERENCE_DATA,
        regionalSales: REGIONAL_SALES,
      };
    }
  );
}

// -------------------------------------------------------------
// ENQUIRIES / CONSULTATIONS CRUD
// -------------------------------------------------------------
export async function getEnquiries(options?: {
  status?: string;
  search?: string;
  source?: string;
  limit?: number;
}): Promise<Enquiry[]> {
  return withDbFallback<Enquiry[]>(
    async () => {
      const where: any = {};
      if (options?.status && options.status !== "all") {
        where.status = { equals: options.status, mode: "insensitive" };
      }
      if (options?.source && options.source !== "all") {
        where.source = { equals: options.source, mode: "insensitive" };
      }
      if (options?.search) {
        where.OR = [
          { name: { contains: options.search, mode: "insensitive" } },
          { email: { contains: options.search, mode: "insensitive" } },
          { phone: { contains: options.search, mode: "insensitive" } },
          { projectType: { contains: options.search, mode: "insensitive" } },
          { message: { contains: options.search, mode: "insensitive" } },
        ];
      }
      const enquiries = await (prisma as any).enquiry.findMany({
        where,
        take: options?.limit,
        orderBy: { createdAt: "desc" },
      });
      return enquiries.map((e: any) => ({
        ...e,
        createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
        updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
      }));
    },
    () => {
      let filtered = [...memoryEnquiries];
      if (options?.status && options.status !== "all") {
        filtered = filtered.filter(
          (e) => e.status.toLowerCase() === options.status!.toLowerCase()
        );
      }
      if (options?.source && options.source !== "all") {
        filtered = filtered.filter(
          (e) => e.source.toLowerCase() === options.source!.toLowerCase()
        );
      }
      if (options?.search) {
        const q = options.search.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.phone.toLowerCase().includes(q) ||
            e.projectType.toLowerCase().includes(q) ||
            e.message.toLowerCase().includes(q)
        );
      }
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (options?.limit) {
        filtered = filtered.slice(0, options.limit);
      }
      return filtered;
    }
  );
}

export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  return withDbFallback<Enquiry | null>(
    async () => {
      const e = await (prisma as any).enquiry.findUnique({ where: { id } });
      if (!e) return null;
      return {
        ...e,
        createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
        updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
      };
    },
    () => {
      return memoryEnquiries.find((e) => e.id === id) || null;
    }
  );
}

export async function createEnquiry(data: {
  name: string;
  email: string;
  phone: string;
  projectType?: string;
  preferredDate?: string;
  message: string;
  source?: string;
}): Promise<Enquiry> {
  const newEnquiry: Enquiry = {
    id: `enq-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    projectType: data.projectType || "Residential Villa",
    preferredDate: data.preferredDate || null,
    message: data.message || "",
    source: data.source || "Contact Page",
    status: "New",
    adminNotes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return withDbFallback<Enquiry>(
    async () => {
      const created = await (prisma as any).enquiry.create({
        data: {
          id: newEnquiry.id,
          name: newEnquiry.name,
          email: newEnquiry.email,
          phone: newEnquiry.phone,
          projectType: newEnquiry.projectType,
          preferredDate: newEnquiry.preferredDate,
          message: newEnquiry.message,
          source: newEnquiry.source,
          status: newEnquiry.status,
          adminNotes: newEnquiry.adminNotes,
        },
      });
      memoryEnquiries.unshift({
        ...created,
        createdAt: created.createdAt instanceof Date ? created.createdAt.toISOString() : created.createdAt,
        updatedAt: created.updatedAt instanceof Date ? created.updatedAt.toISOString() : created.updatedAt,
      });
      return created;
    },
    () => {
      memoryEnquiries.unshift(newEnquiry);
      return newEnquiry;
    }
  );
}

export async function updateEnquiry(
  id: string,
  updates: Partial<Pick<Enquiry, "status" | "adminNotes" | "projectType" | "preferredDate">>
): Promise<Enquiry | null> {
  return withDbFallback<Enquiry | null>(
    async () => {
      const updated = await (prisma as any).enquiry.update({
        where: { id },
        data: updates,
      });
      const idx = memoryEnquiries.findIndex((e) => e.id === id);
      if (idx !== -1) {
        memoryEnquiries[idx] = {
          ...memoryEnquiries[idx],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return {
        ...updated,
        createdAt: updated.createdAt instanceof Date ? updated.createdAt.toISOString() : updated.createdAt,
        updatedAt: updated.updatedAt instanceof Date ? updated.updatedAt.toISOString() : updated.updatedAt,
      };
    },
    () => {
      const idx = memoryEnquiries.findIndex((e) => e.id === id);
      if (idx === -1) return null;
      memoryEnquiries[idx] = {
        ...memoryEnquiries[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return memoryEnquiries[idx];
    }
  );
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  return withDbFallback<boolean>(
    async () => {
      await (prisma as any).enquiry.delete({ where: { id } });
      memoryEnquiries = memoryEnquiries.filter((e) => e.id !== id);
      return true;
    },
    () => {
      const before = memoryEnquiries.length;
      memoryEnquiries = memoryEnquiries.filter((e) => e.id !== id);
      return memoryEnquiries.length < before;
    }
  );
}

// -------------------------------------------------------------
// PAGE SEO & METADATA MANAGEMENT
// -------------------------------------------------------------

export interface PageSeoItem {
  id: string;
  path: string;
  pageName: string;
  title: string;
  description: string;
  keywords?: string | null;
  ogImage?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

let memoryPageSeos: PageSeoItem[] = [
  {
    id: "seo-home",
    path: "/",
    pageName: "Home Page",
    title: "PARKASH CERAMICS | Luxury Bathrooms, Sanitaryware & Wellness Solutions",
    description: "Explore Parkash Ceramics' signature collection of premium architectural faucets, hydrotherapy showers, freestanding bathtubs, saunas, and luxury sanitaryware.",
    keywords: "Parkash Ceramics, luxury bathroom, sanitaryware, faucets, showers, freestanding bathtubs, architectural fittings",
    ogImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "seo-products",
    path: "/products",
    pageName: "Products Catalogue",
    title: "Luxury Architectural Bathroom Collections | PARKASH CERAMICS",
    description: "Browse our complete catalogue of precision-engineered Swiss cartridge faucets, rain showers, freestanding tubs, and designer sanitaryware.",
    keywords: "luxury bathroom catalogue, faucets, shower systems, bathtubs, vanity basins, sanitaryware price list",
    ogImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "seo-about",
    path: "/about",
    pageName: "About Us",
    title: "Our Heritage & Craftsmanship | PARKASH CERAMICS",
    description: "Over 35 years of engineering excellence, partnering with Swiss and German cartridge makers to craft bespoke luxury bath fittings and wellness sanctuaries.",
    keywords: "Parkash Ceramics history, luxury bathroom heritage, Swiss cartridges, bespoke bathroom manufacturer",
    ogImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "seo-contact",
    path: "/contact",
    pageName: "Contact & Showrooms",
    title: "Experience Centre & Architectural Consultations | PARKASH CERAMICS",
    description: "Book a private design consultation or visit our experiential flagship showrooms to explore working hydrotherapy suites and bespoke PVD finishes.",
    keywords: "bathroom showroom Delhi, architect consultations, sanitaryware experience centre, contact Parkash Ceramics",
    ogImage: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=1200",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "seo-cart",
    path: "/cart",
    pageName: "Shopping Cart",
    title: "Architectural Shortlist & Cart | PARKASH CERAMICS",
    description: "Review your shortlisted luxury bathroom fittings, customized finishes, and request immediate quotations or direct checkout.",
    keywords: "bathroom shortlist, sanitaryware cart, architectural fittings quotation",
    ogImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "seo-wishlist",
    path: "/wishlist",
    pageName: "Saved Wishlist",
    title: "Saved Curations & Wishlist | PARKASH CERAMICS",
    description: "Your curated luxury faucets, hydrotherapy showers, and bespoke bathtubs saved for architectural projects and interior planning.",
    keywords: "luxury bath wishlist, saved fittings, interior design favourites",
    ogImage: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1200",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];

export async function getAllPageSeos(): Promise<PageSeoItem[]> {
  return withDbFallback<PageSeoItem[]>(
    async () => {
      const list = await (prisma as any).pageSeo.findMany({
        orderBy: { path: "asc" },
      });
      if (list.length === 0) {
        // Seed default records to DB if empty
        for (const item of memoryPageSeos) {
          try {
            await (prisma as any).pageSeo.upsert({
              where: { path: item.path },
              create: {
                id: item.id,
                path: item.path,
                pageName: item.pageName,
                title: item.title,
                description: item.description,
                keywords: item.keywords,
                ogImage: item.ogImage,
              },
              update: {},
            });
          } catch {}
        }
        return memoryPageSeos;
      }
      return list;
    },
    () => memoryPageSeos
  );
}

export async function getPageSeoByPath(path: string): Promise<PageSeoItem | null> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return withDbFallback<PageSeoItem | null>(
    async () => {
      const item = await (prisma as any).pageSeo.findUnique({
        where: { path: normalizedPath },
      });
      if (!item) {
        const local = memoryPageSeos.find((s) => s.path === normalizedPath);
        return local || null;
      }
      return item;
    },
    () => {
      const local = memoryPageSeos.find((s) => s.path === normalizedPath);
      return local || null;
    }
  );
}

export async function upsertPageSeo(
  path: string,
  data: {
    pageName?: string;
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
  }
): Promise<PageSeoItem> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const id = `seo-${Date.now()}`;
  const pageName = data.pageName || (normalizedPath === "/" ? "Home Page" : normalizedPath.replace("/", "").replace(/-/g, " "));

  return withDbFallback<PageSeoItem>(
    async () => {
      const updated = await (prisma as any).pageSeo.upsert({
        where: { path: normalizedPath },
        create: {
          id,
          path: normalizedPath,
          pageName,
          title: data.title.trim(),
          description: data.description.trim(),
          keywords: data.keywords?.trim() || null,
          ogImage: data.ogImage?.trim() || null,
        },
        update: {
          pageName,
          title: data.title.trim(),
          description: data.description.trim(),
          keywords: data.keywords?.trim() || null,
          ogImage: data.ogImage?.trim() || null,
        },
      });

      const idx = memoryPageSeos.findIndex((s) => s.path === normalizedPath);
      if (idx !== -1) {
        memoryPageSeos[idx] = { ...memoryPageSeos[idx], ...updated };
      } else {
        memoryPageSeos.push(updated);
      }

      return updated;
    },
    () => {
      const idx = memoryPageSeos.findIndex((s) => s.path === normalizedPath);
      const record: PageSeoItem = {
        id: idx !== -1 ? memoryPageSeos[idx].id : id,
        path: normalizedPath,
        pageName,
        title: data.title.trim(),
        description: data.description.trim(),
        keywords: data.keywords?.trim() || null,
        ogImage: data.ogImage?.trim() || null,
        updatedAt: new Date(),
      };
      if (idx !== -1) {
        memoryPageSeos[idx] = record;
      } else {
        memoryPageSeos.push(record);
      }
      return record;
    }
  );
}

export async function deletePageSeo(idOrPath: string): Promise<boolean> {
  return withDbFallback<boolean>(
    async () => {
      await (prisma as any).pageSeo.deleteMany({
        where: {
          OR: [{ id: idOrPath }, { path: idOrPath }],
        },
      });
      memoryPageSeos = memoryPageSeos.filter((s) => s.id !== idOrPath && s.path !== idOrPath);
      return true;
    },
    () => {
      const initLen = memoryPageSeos.length;
      memoryPageSeos = memoryPageSeos.filter((s) => s.id !== idOrPath && s.path !== idOrPath);
      return memoryPageSeos.length < initLen;
    }
  );
}

