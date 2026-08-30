import { PRODUCTS } from "./products";
import { CATEGORIES } from "./categories";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    city: string;
    state: string;
  };
  date: string;
  items: {
    id: string;
    name: string;
    sku: string;
    finish: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: "Paid" | "Pending" | "Refunded" | "Failed";
  fulfillmentStatus: "Delivered" | "Processing" | "Shipped" | "Cancelled";
  paymentMethod: "UPI / QR" | "Credit Card" | "Net Banking" | "Bank Wire / RTGS";
  shippingAddress: string;
  trackingNumber?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  tier: "VIP Architect" | "Luxury Homeowner" | "Commercial Contractor" | "Retail Buyer";
  totalOrders: number;
  totalSpent: number;
  status: "Active" | "Inactive" | "VIP";
  joinedDate: string;
  lastOrderDate: string;
  company?: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Scheduled";
  description: string;
}

export const ADMIN_STATS = {
  totalRevenue: 4285900,
  revenueGrowth: "+18.4%",
  totalOrders: 184,
  ordersGrowth: "+12.2%",
  activeCustomers: 1240,
  customersGrowth: "+8.7%",
  averageOrderValue: 23290,
  aovGrowth: "+5.3%",
  conversionRate: "3.42%",
  lowStockItemsCount: 4,
};

export const REVENUE_MONTHLY_DATA = [
  { month: "Jan", revenue: 285000, orders: 14, visitors: 4200 },
  { month: "Feb", revenue: 310000, orders: 16, visitors: 4600 },
  { month: "Mar", revenue: 380000, orders: 19, visitors: 5100 },
  { month: "Apr", revenue: 420000, orders: 21, visitors: 5800 },
  { month: "May", revenue: 490000, orders: 24, visitors: 6400 },
  { month: "Jun", revenue: 450000, orders: 22, visitors: 6100 },
  { month: "Jul", revenue: 530000, orders: 27, visitors: 7200 },
  { month: "Aug", revenue: 610000, orders: 31, visitors: 8300 },
  { month: "Sep", revenue: 580000, orders: 29, visitors: 7900 },
  { month: "Oct", revenue: 690000, orders: 35, visitors: 9400 },
  { month: "Nov", revenue: 760000, orders: 38, visitors: 10200 },
  { month: "Dec", revenue: 840000, orders: 42, visitors: 11500 },
];

export const CATEGORY_SALES_BREAKDOWN = [
  { name: "Faucets & Brassware", percentage: 38, revenue: 1628000, itemsSold: 142, color: "#9b7842" },
  { name: "Showers & Hydrotherapy", percentage: 26, revenue: 1114000, itemsSold: 78, color: "#8c7764" },
  { name: "Luxury Bathtubs", percentage: 18, revenue: 771000, itemsSold: 22, color: "#dec49a" },
  { name: "Sanitaryware & Basins", percentage: 12, revenue: 514000, itemsSold: 94, color: "#5f4f42" },
  { name: "Sauna & Steam Systems", percentage: 6, revenue: 258900, itemsSold: 11, color: "#3d322a" },
];

export const FINISH_PREFERENCE_DATA = [
  { finish: "Gold Bright PVD", share: 34, growth: "+22%" },
  { finish: "Black Chrome / Matt", share: 28, growth: "+15%" },
  { finish: "Classic Chrome", share: 18, growth: "-4%" },
  { finish: "Rose Gold", share: 12, growth: "+9%" },
  { finish: "Graphite Grey", share: 8, growth: "+18%" },
];

export const REGIONAL_SALES = [
  { region: "Delhi NCR", orders: 68, revenue: 1580000, share: 37 },
  { region: "Mumbai & MMR", orders: 46, revenue: 1120000, share: 26 },
  { region: "Bengaluru", orders: 32, revenue: 780000, share: 18 },
  { region: "Punjab & Chandigarh", orders: 24, revenue: 540000, share: 13 },
  { region: "Hyderabad & Chennai", orders: 14, revenue: 265900, share: 6 },
];

export const ADMIN_ORDERS: AdminOrder[] = [
  {
    id: "ord-101",
    orderNumber: "PC-ORD-8942",
    customer: {
      name: "Ar. Raghav Malhotra",
      email: "raghav.malhotra@studiovista.in",
      phone: "+91 98112 34567",
      city: "New Delhi",
      state: "Delhi",
    },
    date: "2026-08-30T10:45:00Z",
    items: [
      {
        id: "p1",
        name: "Opulence Deck-Mounted Basin Mixer",
        sku: "PC-FAC-OPU-001",
        finish: "Gold Bright PVD",
        quantity: 2,
        price: 18500,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: "p3",
        name: "Aura Thermostatic Rain & Mist Shower Suite",
        sku: "PC-SHW-AUR-003",
        finish: "Gold Bright PVD",
        quantity: 1,
        price: 64900,
        image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=600",
      },
    ],
    subtotal: 101900,
    tax: 18342,
    discount: 10000,
    total: 110242,
    paymentStatus: "Paid",
    fulfillmentStatus: "Processing",
    paymentMethod: "Bank Wire / RTGS",
    shippingAddress: "Penthouse 1402, The Camellias, Golf Course Road, DLF Phase 5, Gurugram 122002",
    trackingNumber: "BLUEDART-8829104",
  },
  {
    id: "ord-102",
    orderNumber: "PC-ORD-8941",
    customer: {
      name: "Dr. Ananya Singhania",
      email: "ananya.singhania@apexhealth.org",
      phone: "+91 98201 88921",
      city: "Mumbai",
      state: "Maharashtra",
    },
    date: "2026-08-29T16:20:00Z",
    items: [
      {
        id: "p4",
        name: "Elysian Freestanding Monolith Bathtub",
        sku: "PC-TUB-ELY-004",
        finish: "White Ceramic",
        quantity: 1,
        price: 145000,
        image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: "p2",
        name: "Sleek Minimalist Floor-Standing Bath Spout",
        sku: "PC-FAC-SLK-002",
        finish: "Black Matt",
        quantity: 1,
        price: 32000,
        image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=600",
      },
    ],
    subtotal: 177000,
    tax: 31860,
    discount: 15000,
    total: 193860,
    paymentStatus: "Paid",
    fulfillmentStatus: "Shipped",
    paymentMethod: "Credit Card",
    shippingAddress: "Sea Face Villa #7, Worli Sea Face, Worli, Mumbai 400018",
    trackingNumber: "DELHIVERY-99201485",
  },
  {
    id: "ord-103",
    orderNumber: "PC-ORD-8940",
    customer: {
      name: "Vikramaditya Oberoi",
      email: "vikram@oberoiholdings.com",
      phone: "+91 99002 11445",
      city: "Bengaluru",
      state: "Karnataka",
    },
    date: "2026-08-29T11:15:00Z",
    items: [
      {
        id: "p5",
        name: "Lumina Smart Heated Wall-Hung Toilet",
        sku: "PC-SAN-LUM-005",
        finish: "White Ceramic",
        quantity: 3,
        price: 89000,
        image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=600",
      },
    ],
    subtotal: 267000,
    tax: 48060,
    discount: 25000,
    total: 290060,
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    paymentMethod: "Bank Wire / RTGS",
    shippingAddress: "Villa 22, Windmills of Your Mind, Whitefield, Bengaluru 560066",
    trackingNumber: "SAFEEX-5544120",
  },
  {
    id: "ord-104",
    orderNumber: "PC-ORD-8939",
    customer: {
      name: "Meera Sen Gupta",
      email: "meera.sen@designkolkata.com",
      phone: "+91 98300 45123",
      city: "Kolkata",
      state: "West Bengal",
    },
    date: "2026-08-28T14:30:00Z",
    items: [
      {
        id: "p1",
        name: "Opulence Deck-Mounted Basin Mixer",
        sku: "PC-FAC-OPU-001",
        finish: "Rose Gold",
        quantity: 1,
        price: 18500,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
      },
    ],
    subtotal: 18500,
    tax: 3330,
    discount: 0,
    total: 21830,
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    paymentMethod: "UPI / QR",
    shippingAddress: "A-4, Ballygunge Circular Road, Kolkata 700019",
    trackingNumber: "DTDC-3301948",
  },
  {
    id: "ord-105",
    orderNumber: "PC-ORD-8938",
    customer: {
      name: "Kapil Dev Sharma",
      email: "kapil.sharma@chandigarhspaces.in",
      phone: "+91 98140 77120",
      city: "Chandigarh",
      state: "Punjab",
    },
    date: "2026-08-27T09:10:00Z",
    items: [
      {
        id: "p3",
        name: "Aura Thermostatic Rain & Mist Shower Suite",
        sku: "PC-SHW-AUR-003",
        finish: "Black Chrome",
        quantity: 2,
        price: 64900,
        image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: "p2",
        name: "Sleek Minimalist Floor-Standing Bath Spout",
        sku: "PC-FAC-SLK-002",
        finish: "Black Chrome",
        quantity: 2,
        price: 32000,
        image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=600",
      },
    ],
    subtotal: 193800,
    tax: 34884,
    discount: 15000,
    total: 213684,
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    paymentMethod: "Credit Card",
    shippingAddress: "House 408, Sector 9-D, Chandigarh 160009",
    trackingNumber: "BLUEDART-7729104",
  },
  {
    id: "ord-106",
    orderNumber: "PC-ORD-8937",
    customer: {
      name: "Sameer Nambiar",
      email: "sameer.n@nambiargroup.com",
      phone: "+91 98450 33812",
      city: "Kochi",
      state: "Kerala",
    },
    date: "2026-08-26T18:05:00Z",
    items: [
      {
        id: "p6",
        name: "Nordic Hemlock Luxury Custom Steam Sauna",
        sku: "PC-WEL-SAU-006",
        finish: "Natural Cedar",
        quantity: 1,
        price: 245000,
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600",
      },
    ],
    subtotal: 245000,
    tax: 44100,
    discount: 20000,
    total: 269100,
    paymentStatus: "Pending",
    fulfillmentStatus: "Processing",
    paymentMethod: "Bank Wire / RTGS",
    shippingAddress: "Waterfront Estate, Marine Drive, Kochi 682011",
    trackingNumber: "SAFEEX-1099238",
  },
];

export const ADMIN_USERS: AdminUser[] = [
  {
    id: "usr-1",
    name: "Ar. Raghav Malhotra",
    email: "raghav.malhotra@studiovista.in",
    phone: "+91 98112 34567",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    city: "New Delhi",
    tier: "VIP Architect",
    company: "Studio Vista Architecture",
    totalOrders: 14,
    totalSpent: 1245000,
    status: "VIP",
    joinedDate: "2025-03-15",
    lastOrderDate: "2026-08-30",
  },
  {
    id: "usr-2",
    name: "Dr. Ananya Singhania",
    email: "ananya.singhania@apexhealth.org",
    phone: "+91 98201 88921",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    city: "Mumbai",
    tier: "Luxury Homeowner",
    totalOrders: 3,
    totalSpent: 485000,
    status: "Active",
    joinedDate: "2025-07-20",
    lastOrderDate: "2026-08-29",
  },
  {
    id: "usr-3",
    name: "Vikramaditya Oberoi",
    email: "vikram@oberoiholdings.com",
    phone: "+91 99002 11445",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    city: "Bengaluru",
    tier: "Commercial Contractor",
    company: "Oberoi Infrastructure Ltd.",
    totalOrders: 8,
    totalSpent: 1680000,
    status: "VIP",
    joinedDate: "2025-01-10",
    lastOrderDate: "2026-08-29",
  },
  {
    id: "usr-4",
    name: "Meera Sen Gupta",
    email: "meera.sen@designkolkata.com",
    phone: "+91 98300 45123",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    city: "Kolkata",
    tier: "VIP Architect",
    company: "Sensory Interiors",
    totalOrders: 6,
    totalSpent: 390000,
    status: "Active",
    joinedDate: "2025-09-05",
    lastOrderDate: "2026-08-28",
  },
  {
    id: "usr-5",
    name: "Kapil Dev Sharma",
    email: "kapil.sharma@chandigarhspaces.in",
    phone: "+91 98140 77120",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    city: "Chandigarh",
    tier: "Commercial Contractor",
    company: "North Star Developers",
    totalOrders: 5,
    totalSpent: 520000,
    status: "Active",
    joinedDate: "2025-11-12",
    lastOrderDate: "2026-08-27",
  },
  {
    id: "usr-6",
    name: "Sameer Nambiar",
    email: "sameer.n@nambiargroup.com",
    phone: "+91 98450 33812",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    city: "Kochi",
    tier: "Luxury Homeowner",
    totalOrders: 2,
    totalSpent: 345000,
    status: "Active",
    joinedDate: "2026-02-18",
    lastOrderDate: "2026-08-26",
  },
  {
    id: "usr-7",
    name: "Tanya Chawla",
    email: "tanya.chawla@luxuryliving.com",
    phone: "+91 97110 55432",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    city: "Jaipur",
    tier: "Retail Buyer",
    totalOrders: 1,
    totalSpent: 32000,
    status: "Active",
    joinedDate: "2026-05-14",
    lastOrderDate: "2026-06-02",
  },
  {
    id: "usr-8",
    name: "Harshvardhan Goenka",
    email: "h.goenka@heritageestates.co",
    phone: "+91 98210 99887",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    city: "Ahmedabad",
    tier: "VIP Architect",
    company: "Goenka & Partners Architects",
    totalOrders: 9,
    totalSpent: 980000,
    status: "VIP",
    joinedDate: "2025-04-02",
    lastOrderDate: "2026-08-14",
  },
];

export const ADMIN_COUPONS: AdminCoupon[] = [
  {
    id: "c-1",
    code: "PARKASH10",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 25000,
    usageLimit: 200,
    usedCount: 142,
    startDate: "2026-01-01",
    expiryDate: "2026-12-31",
    status: "Active",
    description: "Welcome discount of 10% off for verified luxury project enquiries above ₹25,000.",
  },
  {
    id: "c-2",
    code: "ARCHITECTVIP",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 75000,
    usageLimit: 50,
    usedCount: 38,
    startDate: "2026-01-15",
    expiryDate: "2026-12-31",
    status: "Active",
    description: "Exclusive 15% trade concession for registered Architects & Interior Designers.",
  },
  {
    id: "c-3",
    code: "MONSOONSPA",
    discountType: "fixed",
    discountValue: 15000,
    minOrderValue: 150000,
    usageLimit: 30,
    usedCount: 19,
    startDate: "2026-06-01",
    expiryDate: "2026-09-30",
    status: "Active",
    description: "Flat ₹15,000 off on Bathtub and Hydrotherapy Shower Suite combinations.",
  },
  {
    id: "c-4",
    code: "GOLDENHOURS",
    discountType: "percentage",
    discountValue: 12,
    minOrderValue: 50000,
    usageLimit: 100,
    usedCount: 100,
    startDate: "2026-04-01",
    expiryDate: "2026-05-31",
    status: "Expired",
    description: "Flash promo code for Gold Bright PVD bathroom collections.",
  },
  {
    id: "c-5",
    code: "DIWALI2026",
    discountType: "percentage",
    discountValue: 18,
    minOrderValue: 100000,
    usageLimit: 150,
    usedCount: 0,
    startDate: "2026-10-15",
    expiryDate: "2026-11-20",
    status: "Scheduled",
    description: "Upcoming Festive Season privileged discount code for complete bathroom renovations.",
  },
];

export const ADMIN_INVENTORY_ITEMS = PRODUCTS.map((p, idx) => ({
  ...p,
  stockCount: [24, 18, 7, 3, 12, 4, 32, 15, 6, 2, 28, 9][idx % 12] || 15,
  stockStatus: (([24, 18, 7, 3, 12, 4, 32, 15, 6, 2, 28, 9][idx % 12] || 15) > 10
    ? "In Stock"
    : ([24, 18, 7, 3, 12, 4, 32, 15, 6, 2, 28, 9][idx % 12] || 15) > 0
    ? "Low Stock"
    : "Out of Stock") as "In Stock" | "Low Stock" | "Out of Stock",
  salesCount: [142, 78, 54, 22, 65, 11, 89, 44, 31, 18, 96, 37][idx % 12] || 25,
  totalRevenue: ([142, 78, 54, 22, 65, 11, 89, 44, 31, 18, 96, 37][idx % 12] || 25) * p.price,
}));
