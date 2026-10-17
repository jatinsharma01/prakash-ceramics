export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isFeatured?: boolean;
  itemCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  featured?: boolean;
  itemCount?: number;
  tags?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type FinishType = 
  | "Black Chrome"
  | "Gold Bright PVD"
  | "Black Matt"
  | "Blush Gold PVD"
  | "Chrome"
  | "Matte Black"
  | "Brushed Gold"
  | "Rose Gold"
  | "Graphite Grey"
  | "Brushed Nickel"
  | "White Ceramic"
  | "Natural Cedar"
  | (string & {});

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand?: string;
  subcategory?: string;
  range?: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  sku: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  finishes: FinishType[];
  finishImages?: Record<string, string>;
  finishPrices?: Record<string, number>;
  finishOfferPrices?: Record<string, number>;
  finishSkus?: Record<string, string>;
  finishStocks?: Record<string, number>;
  stockCount?: number;
  images: string[];
  dimensions?: string;
  flowRate?: string;
  material: string;
  warranty: string;
  rating: number;
  reviewsCount: number;
  features: string[];
  specs: Record<string, string>;
  technicalDrawings?: string[];
  salesCount?: number;
  totalRevenue?: number;
}

export interface EnquiryItem {
  product: Product;
  selectedFinish: FinishType;
  quantity: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  images?: string[];
  category: string;
  author: string;
  authorRole?: string | null;
  authorAvatar?: string | null;
  readTime?: string | null;
  tags?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  views?: number;
  publishedAt: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type { PackageItem, BathroomPackage } from "./packages";
