import { prisma } from "./prisma";
import { getOrders } from "./serverDb";
import { AdminOrder } from "./adminData";

export interface CustomerUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  avatar?: string | null;
  city?: string | null;
  tier: string;
  company?: string | null;
  cart?: string | null;
  wishlist?: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface SyncSessionRecord {
  id: string;
  code: string;
  cart: string;
  wishlist: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface CustomerAddressRecord {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  estateOrProject?: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string | null;
  label: "Home" | "Office" | "Site / Villa" | string;
  isDefault: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

// In-Memory fallback store for demo/development when DB is not actively migrated
let memoryCustomerUsers: CustomerUserRecord[] = [
  {
    id: "cust-demo-jatin",
    name: "Jatin Sharma",
    email: "jatin@gmail.com",
    phone: "+91 98765 43210",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    city: "Delhi NCR",
    tier: "Privilege Client",
    company: "Sharma Living Concepts",
    createdAt: new Date("2026-09-01"),
  },
  {
    id: "cust-demo-1",
    name: "Rajesh Malhotra",
    email: "client@prakashceramic.com",
    phone: "+91 98101 23456",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    city: "New Delhi",
    tier: "Privilege Client",
    company: "Malhotra & Associates Architecture",
    createdAt: new Date("2026-08-15"),
  },
  {
    id: "cust-demo-2",
    name: "Ananya Deshmukh",
    email: "ananya.d@gmail.com",
    phone: "+91 98200 45678",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    city: "Mumbai",
    tier: "Privilege Client",
    company: "Deshmukh Heritage Estate",
    createdAt: new Date("2026-08-20"),
  },
];

let memoryCustomerAddresses: CustomerAddressRecord[] = [
  {
    id: "addr-demo-jatin-1",
    userId: "cust-demo-jatin",
    fullName: "Jatin Sharma",
    phone: "+91 98765 43210",
    estateOrProject: "DLF Phase 5 Luxury Penthouse",
    address: "Penthouse 14, Tower A, DLF Phase 5",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122009",
    landmark: "Near One Horizon Center",
    label: "Home",
    isDefault: true,
    createdAt: new Date("2026-09-01"),
  },
  {
    id: "addr-demo-1",
    userId: "cust-demo-1",
    fullName: "Rajesh Malhotra",
    phone: "+91 98101 23456",
    estateOrProject: "DLF The Camellias Luxury Residences",
    address: "Tower 4, Apt 1802, Golf Course Road",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122002",
    landmark: "Near Club House",
    label: "Home",
    isDefault: true,
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "addr-demo-2",
    userId: "cust-demo-1",
    fullName: "Rajesh Malhotra (Project Site)",
    phone: "+91 98101 23456",
    estateOrProject: "Magnolias Extension Villa Project",
    address: "Plot 42, Sector 28, Exclusive Villa Under Construction",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122009",
    landmark: "Behind Galleria Market",
    label: "Site / Villa",
    isDefault: false,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "addr-demo-3",
    userId: "cust-demo-2",
    fullName: "Ananya Deshmukh",
    phone: "+91 98200 45678",
    estateOrProject: "Worli Sea Face Heritage Estate",
    address: "Bungalow 7, Dr. Annie Besant Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400018",
    landmark: "Opposite Coast Guard HQ",
    label: "Home",
    isDefault: true,
    createdAt: new Date("2024-03-22"),
  },
];

async function withDbFallback<T>(dbQuery: () => Promise<T>, fallbackQuery: () => T | Promise<T>): Promise<T> {
  try {
    return await dbQuery();
  } catch {
    return await fallbackQuery();
  }
}

// -------------------------------------------------------------
// AUTHENTICATION & USER MANAGEMENT
// -------------------------------------------------------------

export async function findCustomerByEmail(emailInput: string): Promise<CustomerUserRecord | null> {
  const email = emailInput.trim().toLowerCase();
  return withDbFallback<CustomerUserRecord | null>(
    async () => {
      const user = await (prisma as any).customerUser.findUnique({
        where: { email },
      });
      if (!user) {
        const mem = memoryCustomerUsers.find((x) => x.email.toLowerCase() === email);
        return mem ? { ...mem } : null;
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        avatar: user.avatar,
        city: user.city,
        tier: user.tier,
        company: user.company,
        cart: user.cart || null,
        wishlist: user.wishlist || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },
    () => {
      const u = memoryCustomerUsers.find((x) => x.email.toLowerCase() === email);
      return u ? { ...u } : null;
    }
  );
}

export async function findCustomerById(id: string): Promise<CustomerUserRecord | null> {
  return withDbFallback<CustomerUserRecord | null>(
    async () => {
      const user = await (prisma as any).customerUser.findUnique({
        where: { id },
      });
      if (!user) {
        const mem = memoryCustomerUsers.find((x) => x.id === id);
        if (!mem) return null;
        const { password, ...safeUser } = mem;
        return safeUser as CustomerUserRecord;
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        city: user.city,
        tier: user.tier,
        company: user.company,
        cart: user.cart || null,
        wishlist: user.wishlist || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },
    () => {
      const u = memoryCustomerUsers.find((x) => x.id === id);
      if (!u) return null;
      const { password, ...safeUser } = u;
      return safeUser as CustomerUserRecord;
    }
  );
}

export async function createCustomer(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  city?: string;
  company?: string;
  tier?: string;
}): Promise<CustomerUserRecord> {
  const email = data.email.trim().toLowerCase();
  const id = `cust-${Date.now()}`;
  const newUser: CustomerUserRecord = {
    id,
    name: data.name.trim(),
    email,
    phone: data.phone.trim(),
    password: data.password.trim(),
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
    city: data.city?.trim() || "Delhi NCR",
    tier: data.tier || "Privilege Client",
    company: data.company?.trim() || null,
    createdAt: new Date(),
  };

  return withDbFallback<CustomerUserRecord>(
    async () => {
      const created = await (prisma as any).customerUser.create({
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          password: newUser.password!,
          avatar: newUser.avatar,
          city: newUser.city,
          tier: newUser.tier,
          company: newUser.company,
        },
      });
      memoryCustomerUsers.unshift(newUser);
      return {
        id: created.id,
        name: created.name,
        email: created.email,
        phone: created.phone,
        avatar: created.avatar,
        city: created.city,
        tier: created.tier,
        company: created.company,
        createdAt: created.createdAt,
      };
    },
    () => {
      memoryCustomerUsers.unshift(newUser);
      const { password, ...safeUser } = newUser;
      return safeUser as CustomerUserRecord;
    }
  );
}

export async function updateCustomer(
  id: string,
  data: Partial<Pick<CustomerUserRecord, "name" | "phone" | "city" | "company" | "avatar">>
): Promise<CustomerUserRecord | null> {
  return withDbFallback<CustomerUserRecord | null>(
    async () => {
      const updated = await (prisma as any).customerUser.update({
        where: { id },
        data,
      });
      const idx = memoryCustomerUsers.findIndex((u) => u.id === id);
      if (idx !== -1) {
        memoryCustomerUsers[idx] = { ...memoryCustomerUsers[idx], ...data };
      }
      return {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        avatar: updated.avatar,
        city: updated.city,
        tier: updated.tier,
        company: updated.company,
        createdAt: updated.createdAt,
      };
    },
    () => {
      const idx = memoryCustomerUsers.findIndex((u) => u.id === id);
      if (idx !== -1) {
        memoryCustomerUsers[idx] = { ...memoryCustomerUsers[idx], ...data };
        const { password, ...safe } = memoryCustomerUsers[idx];
        return safe as CustomerUserRecord;
      }
      return null;
    }
  );
}

// -------------------------------------------------------------
// ADDRESSES CRUD
// -------------------------------------------------------------

export async function getAddressesByUser(userId: string): Promise<CustomerAddressRecord[]> {
  return withDbFallback(
    async () => {
      const addresses = await (prisma as any).customerAddress.findMany({
        where: { userId },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      });
      return addresses;
    },
    () => {
      return memoryCustomerAddresses
        .filter((a) => a.userId === userId)
        .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
    }
  );
}

export async function createAddress(
  userId: string,
  data: {
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
  }
): Promise<CustomerAddressRecord> {
  const id = `addr-${Date.now()}`;
  const isFirst = memoryCustomerAddresses.filter((a) => a.userId === userId).length === 0;
  const isDefault = data.isDefault !== undefined ? data.isDefault : isFirst;

  const newAddr: CustomerAddressRecord = {
    id,
    userId,
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    estateOrProject: data.estateOrProject?.trim() || null,
    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    pincode: data.pincode.trim(),
    landmark: data.landmark?.trim() || null,
    label: data.label || "Home",
    isDefault,
    createdAt: new Date(),
  };

  return withDbFallback(
    async () => {
      if (isDefault) {
        await (prisma as any).customerAddress.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      const created = await (prisma as any).customerAddress.create({
        data: {
          id: newAddr.id,
          userId: newAddr.userId,
          fullName: newAddr.fullName,
          phone: newAddr.phone,
          estateOrProject: newAddr.estateOrProject,
          address: newAddr.address,
          city: newAddr.city,
          state: newAddr.state,
          pincode: newAddr.pincode,
          landmark: newAddr.landmark,
          label: newAddr.label,
          isDefault: newAddr.isDefault,
        },
      });

      if (isDefault) {
        memoryCustomerAddresses = memoryCustomerAddresses.map((a) =>
          a.userId === userId ? { ...a, isDefault: false } : a
        );
      }
      memoryCustomerAddresses.unshift(newAddr);
      return created;
    },
    () => {
      if (isDefault) {
        memoryCustomerAddresses = memoryCustomerAddresses.map((a) =>
          a.userId === userId ? { ...a, isDefault: false } : a
        );
      }
      memoryCustomerAddresses.unshift(newAddr);
      return newAddr;
    }
  );
}

export async function updateAddress(
  addressId: string,
  userId: string,
  data: Partial<Omit<CustomerAddressRecord, "id" | "userId" | "createdAt">>
): Promise<CustomerAddressRecord | null> {
  return withDbFallback(
    async () => {
      if (data.isDefault) {
        await (prisma as any).customerAddress.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      const updated = await (prisma as any).customerAddress.update({
        where: { id: addressId },
        data,
      });

      if (data.isDefault) {
        memoryCustomerAddresses = memoryCustomerAddresses.map((a) =>
          a.userId === userId ? { ...a, isDefault: false } : a
        );
      }
      const idx = memoryCustomerAddresses.findIndex((a) => a.id === addressId);
      if (idx !== -1) {
        memoryCustomerAddresses[idx] = { ...memoryCustomerAddresses[idx], ...data };
      }

      return updated;
    },
    () => {
      if (data.isDefault) {
        memoryCustomerAddresses = memoryCustomerAddresses.map((a) =>
          a.userId === userId ? { ...a, isDefault: false } : a
        );
      }
      const idx = memoryCustomerAddresses.findIndex((a) => a.id === addressId && a.userId === userId);
      if (idx !== -1) {
        memoryCustomerAddresses[idx] = { ...memoryCustomerAddresses[idx], ...data };
        return memoryCustomerAddresses[idx];
      }
      return null;
    }
  );
}

export async function deleteAddress(addressId: string, userId: string): Promise<boolean> {
  return withDbFallback(
    async () => {
      await (prisma as any).customerAddress.delete({
        where: { id: addressId },
      });
      memoryCustomerAddresses = memoryCustomerAddresses.filter((a) => a.id !== addressId);
      return true;
    },
    () => {
      const initialLength = memoryCustomerAddresses.length;
      memoryCustomerAddresses = memoryCustomerAddresses.filter(
        (a) => !(a.id === addressId && a.userId === userId)
      );
      return memoryCustomerAddresses.length < initialLength;
    }
  );
}

// -------------------------------------------------------------
// USER ORDERS QUERY
// -------------------------------------------------------------

export async function getUserOrders(userEmail: string, userPhone?: string): Promise<AdminOrder[]> {
  const allOrders = await getOrders();
  const emailLower = userEmail.trim().toLowerCase();
  const cleanPhone = userPhone ? userPhone.replace(/[^0-9]/g, "").slice(-10) : "";

  return allOrders.filter((o) => {
    const oEmail = o.customer.email ? o.customer.email.trim().toLowerCase() : "";
    const oPhone = o.customer.phone ? o.customer.phone.replace(/[^0-9]/g, "").slice(-10) : "";

    const emailMatch = oEmail && emailLower ? oEmail === emailLower : false;
    const phoneMatch = cleanPhone && oPhone ? oPhone === cleanPhone : false;

    // For demo customer account, link active orders for immediate live tracking preview
    if (emailLower === "client@prakashceramic.com" || emailLower === "client@parkash.com" || emailLower === "ananya.d@gmail.com") {
      if (
        o.orderNumber === "PC-ORD-8942" ||
        o.orderNumber === "PC-ORD-8941" ||
        o.orderNumber === "PC-ORD-822453" ||
        o.orderNumber === "PC-ORD-368675"
      ) {
        return true;
      }
    }

    return emailMatch || phoneMatch;
  });
}

// -------------------------------------------------------------
// ADMIN REGISTERED CUSTOMERS DIRECTORY
// -------------------------------------------------------------

export interface RegisteredCustomerAdminView {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  company?: string;
  status: "Active" | "Inactive";
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  addresses: CustomerAddressRecord[];
  orders?: AdminOrder[];
  cart?: any[];
  wishlist?: any[];
}

function parseJsonSafe(val: any, fallback: any[] = []): any[] {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export async function getAllCustomersForAdmin(): Promise<RegisteredCustomerAdminView[]> {
  const allOrders = await getOrders();

  return withDbFallback<RegisteredCustomerAdminView[]>(
    async () => {
      const dbUsers = await (prisma as any).customerUser.findMany({
        include: {
          addresses: {
            orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Merge with in-memory users if DB is empty or during transition
      const combinedMap = new Map<string, any>();
      for (const u of dbUsers) {
        combinedMap.set(u.email.toLowerCase(), {
          ...u,
          addresses: u.addresses || [],
        });
      }
      for (const m of memoryCustomerUsers) {
        if (!combinedMap.has(m.email.toLowerCase())) {
          combinedMap.set(m.email.toLowerCase(), {
            ...m,
            addresses: memoryCustomerAddresses.filter((a) => a.userId === m.id),
          });
        }
      }

      const mergedList = Array.from(combinedMap.values());

      return mergedList.map((c: any) => {
        const emailLower = c.email ? c.email.toLowerCase().trim() : "";
        const cleanPhone = c.phone ? c.phone.replace(/[^0-9]/g, "").slice(-10) : "";
        const nameLower = c.name ? c.name.toLowerCase().trim() : "";

        const customerOrders = allOrders.filter((o) => {
          const oEmail = o.customer.email ? o.customer.email.toLowerCase().trim() : "";
          const oPhone = o.customer.phone ? o.customer.phone.replace(/[^0-9]/g, "").slice(-10) : "";
          const oName = o.customer.name ? o.customer.name.toLowerCase().trim() : "";

          if (emailLower === "client@prakashceramic.com" || emailLower === "client@parkash.com" || emailLower === "ananya.d@gmail.com") {
            if (["PC-ORD-8942", "PC-ORD-8941", "PC-ORD-822453", "PC-ORD-368675"].includes(o.orderNumber)) return true;
          }
          const emailMatch = emailLower && oEmail === emailLower;
          const phoneMatch = cleanPhone && oPhone === cleanPhone;
          const nameMatch = nameLower && oName && (oName === nameLower || oName.includes(nameLower) || nameLower.includes(oName));

          return emailMatch || phoneMatch || nameMatch;
        });

        const totalOrders = customerOrders.length;
        const totalSpent = customerOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);
        const joinedDateStr = c.createdAt ? new Date(c.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
        const lastOrderDate = customerOrders.length > 0 ? customerOrders[0].date : joinedDateStr;

        return {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          avatar: c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
          city: c.city || (c.addresses?.[0]?.city) || "Delhi NCR",
          company: c.company || undefined,
          status: "Active",
          joinedDate: joinedDateStr,
          totalOrders,
          totalSpent,
          lastOrderDate,
          addresses: c.addresses || [],
          orders: customerOrders,
          cart: parseJsonSafe(c.cart),
          wishlist: parseJsonSafe(c.wishlist),
        };
      });
    },
    () => {
      return memoryCustomerUsers.map((c) => {
        const emailLower = c.email ? c.email.toLowerCase().trim() : "";
        const cleanPhone = c.phone ? c.phone.replace(/[^0-9]/g, "").slice(-10) : "";
        const nameLower = c.name ? c.name.toLowerCase().trim() : "";
        const userAddresses = memoryCustomerAddresses.filter((a) => a.userId === c.id);

        const customerOrders = allOrders.filter((o) => {
          const oEmail = o.customer.email ? o.customer.email.toLowerCase().trim() : "";
          const oPhone = o.customer.phone ? o.customer.phone.replace(/[^0-9]/g, "").slice(-10) : "";
          const oName = o.customer.name ? o.customer.name.toLowerCase().trim() : "";

          if (emailLower === "client@prakashceramic.com" || emailLower === "client@parkash.com" || emailLower === "ananya.d@gmail.com") {
            if (["PC-ORD-8942", "PC-ORD-8941", "PC-ORD-822453", "PC-ORD-368675"].includes(o.orderNumber)) return true;
          }
          const emailMatch = emailLower && oEmail === emailLower;
          const phoneMatch = cleanPhone && oPhone === cleanPhone;
          const nameMatch = nameLower && oName && (oName === nameLower || oName.includes(nameLower) || nameLower.includes(oName));

          return emailMatch || phoneMatch || nameMatch;
        });

        const totalOrders = customerOrders.length;
        const totalSpent = customerOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);
        const joinedDateStr = c.createdAt ? new Date(c.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
        const lastOrderDate = customerOrders.length > 0 ? customerOrders[0].date : joinedDateStr;

        return {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          avatar: c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
          city: c.city || (userAddresses[0]?.city) || "Delhi NCR",
          company: c.company || undefined,
          status: "Active",
          joinedDate: joinedDateStr,
          totalOrders,
          totalSpent,
          lastOrderDate,
          addresses: userAddresses,
          orders: customerOrders,
          cart: parseJsonSafe(c.cart),
          wishlist: parseJsonSafe(c.wishlist),
        };
      });
    }
  );
}

export async function deleteCustomerUser(id: string): Promise<boolean> {
  return withDbFallback(
    async () => {
      await (prisma as any).customerAddress.deleteMany({ where: { userId: id } });
      await (prisma as any).customerUser.delete({ where: { id } });
      memoryCustomerUsers = memoryCustomerUsers.filter((u) => u.id !== id);
      memoryCustomerAddresses = memoryCustomerAddresses.filter((a) => a.userId !== id);
      return true;
    },
    () => {
      const initLen = memoryCustomerUsers.length;
      memoryCustomerUsers = memoryCustomerUsers.filter((u) => u.id !== id);
      memoryCustomerAddresses = memoryCustomerAddresses.filter((a) => a.userId !== id);
      return memoryCustomerUsers.length < initLen;
    }
  );
}

export async function getCustomerForAdminById(id: string): Promise<RegisteredCustomerAdminView | null> {
  const all = await getAllCustomersForAdmin();
  return all.find((u) => u.id === id) || null;
}

// -------------------------------------------------------------
// CART & WISHLIST PERSISTENCE & CROSS-DEVICE SYNC
// -------------------------------------------------------------
let memorySyncSessions: SyncSessionRecord[] = [];

export async function saveUserCartAndWishlist(
  userId: string,
  data: { cart?: string; wishlist?: string }
): Promise<boolean> {
  return withDbFallback(
    async () => {
      const updates: any = {};
      if (data.cart !== undefined) updates.cart = data.cart;
      if (data.wishlist !== undefined) updates.wishlist = data.wishlist;

      try {
        await (prisma as any).customerUser.update({
          where: { id: userId },
          data: updates,
        });
      } catch {
        // Try by email if userId was an email or id not found
        await (prisma as any).customerUser.update({
          where: { email: userId.toLowerCase() },
          data: updates,
        });
      }

      const local = memoryCustomerUsers.find((u) => u.id === userId || u.email.toLowerCase() === userId.toLowerCase());
      if (local) {
        if (data.cart !== undefined) local.cart = data.cart;
        if (data.wishlist !== undefined) local.wishlist = data.wishlist;
      }
      return true;
    },
    () => {
      const local = memoryCustomerUsers.find((u) => u.id === userId || u.email.toLowerCase() === userId.toLowerCase());
      if (local) {
        if (data.cart !== undefined) local.cart = data.cart;
        if (data.wishlist !== undefined) local.wishlist = data.wishlist;
        return true;
      }
      return false;
    }
  );
}

export async function getUserCartAndWishlist(
  userId: string
): Promise<{ cart: string | null; wishlist: string | null }> {
  return withDbFallback(
    async () => {
      let user = await (prisma as any).customerUser.findUnique({
        where: { id: userId },
        select: { cart: true, wishlist: true },
      });
      if (!user) {
        user = await (prisma as any).customerUser.findUnique({
          where: { email: userId.toLowerCase() },
          select: { cart: true, wishlist: true },
        });
      }
      if (user) {
        return {
          cart: user.cart || null,
          wishlist: user.wishlist || null,
        };
      }
      const mem = memoryCustomerUsers.find((u) => u.id === userId || u.email.toLowerCase() === userId.toLowerCase());
      return {
        cart: mem?.cart || null,
        wishlist: mem?.wishlist || null,
      };
    },
    () => {
      const local = memoryCustomerUsers.find((u) => u.id === userId || u.email.toLowerCase() === userId.toLowerCase());
      return {
        cart: local?.cart || null,
        wishlist: local?.wishlist || null,
      };
    }
  );
}

const memoryGuestSessions = new Map<string, { cart?: string; wishlist?: string }>();

export async function saveGuestCartAndWishlist(
  guestId: string,
  data: { cart?: string; wishlist?: string }
): Promise<boolean> {
  return withDbFallback(
    async () => {
      const existing = await (prisma as any).syncSession.findUnique({
        where: { code: guestId },
      });
      if (existing) {
        await (prisma as any).syncSession.update({
          where: { code: guestId },
          data: {
            cart: data.cart !== undefined ? data.cart : existing.cart,
            wishlist: data.wishlist !== undefined ? data.wishlist : existing.wishlist,
          },
        });
      } else {
        await (prisma as any).syncSession.create({
          data: {
            id: `guest-${guestId}`,
            code: guestId,
            cart: data.cart || "[]",
            wishlist: data.wishlist || "[]",
          },
        });
      }
      const prev = memoryGuestSessions.get(guestId) || {};
      memoryGuestSessions.set(guestId, {
        cart: data.cart !== undefined ? data.cart : prev.cart,
        wishlist: data.wishlist !== undefined ? data.wishlist : prev.wishlist,
      });
      return true;
    },
    () => {
      const prev = memoryGuestSessions.get(guestId) || {};
      memoryGuestSessions.set(guestId, {
        cart: data.cart !== undefined ? data.cart : prev.cart,
        wishlist: data.wishlist !== undefined ? data.wishlist : prev.wishlist,
      });
      return true;
    }
  );
}

export async function getGuestCartAndWishlist(
  guestId: string
): Promise<{ cart: string | null; wishlist: string | null }> {
  return withDbFallback(
    async () => {
      const existing = await (prisma as any).syncSession.findUnique({
        where: { code: guestId },
      });
      if (existing) {
        return { cart: existing.cart, wishlist: existing.wishlist };
      }
      const mem = memoryGuestSessions.get(guestId);
      return { cart: mem?.cart || null, wishlist: mem?.wishlist || null };
    },
    () => {
      const mem = memoryGuestSessions.get(guestId);
      return { cart: mem?.cart || null, wishlist: mem?.wishlist || null };
    }
  );
}

export async function createSyncSession(
  cart: string,
  wishlist: string
): Promise<string> {
  // Generate friendly 6-digit numeric sync code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const newSession: SyncSessionRecord = {
    id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    code,
    cart,
    wishlist,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return withDbFallback(
    async () => {
      await (prisma as any).syncSession.upsert({
        where: { code },
        create: {
          id: newSession.id,
          code: newSession.code,
          cart: newSession.cart,
          wishlist: newSession.wishlist,
        },
        update: {
          cart: newSession.cart,
          wishlist: newSession.wishlist,
        },
      });
      memorySyncSessions = memorySyncSessions.filter((s) => s.code !== code);
      memorySyncSessions.push(newSession);
      return code;
    },
    () => {
      memorySyncSessions = memorySyncSessions.filter((s) => s.code !== code);
      memorySyncSessions.push(newSession);
      return code;
    }
  );
}

export async function loadSyncSession(
  code: string
): Promise<{ cart: string; wishlist: string } | null> {
  const cleanCode = code.trim().toUpperCase();
  return withDbFallback(
    async () => {
      const session = await (prisma as any).syncSession.findUnique({
        where: { code: cleanCode },
      });
      if (!session) {
        const mem = memorySyncSessions.find((s) => s.code.toUpperCase() === cleanCode);
        return mem ? { cart: mem.cart, wishlist: mem.wishlist } : null;
      }
      return { cart: session.cart, wishlist: session.wishlist };
    },
    () => {
      const mem = memorySyncSessions.find((s) => s.code.toUpperCase() === cleanCode);
      return mem ? { cart: mem.cart, wishlist: mem.wishlist } : null;
    }
  );
}



