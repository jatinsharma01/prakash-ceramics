import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "../src/lib/products";
import { CATEGORIES } from "../src/lib/categories";
import { ADMIN_COUPONS, ADMIN_ORDERS, ADMIN_USERS } from "../src/lib/adminData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting PostgreSQL database seed for Parkash Ceramics...");

  // 1. Seed Categories
  console.log("📁 Seeding categories...");
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        shortDescription: cat.shortDescription,
        description: cat.description,
        image: cat.image,
        featured: cat.featured ?? false,
        itemCount: cat.itemCount ?? 0,
        tags: cat.tags ?? [],
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        shortDescription: cat.shortDescription,
        description: cat.description,
        image: cat.image,
        featured: cat.featured ?? false,
        itemCount: cat.itemCount ?? 0,
        tags: cat.tags ?? [],
      },
    });
  }

  // 2. Seed Products
  console.log("🛁 Cleaning old products & seeding luxury products...");
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});

  for (const prod of PRODUCTS) {
    const fullSpecs = {
      ...(prod.specs || {}),
      finishPrices: prod.finishPrices || {},
      finishSkus: prod.finishSkus || {},
    };

    await prisma.product.create({
      data: {
        id: prod.id,
        sku: prod.sku,
        name: prod.name,
        slug: prod.slug,
        category: prod.category,
        categorySlug: prod.categorySlug,
        subcategory: prod.subcategory || null,
        range: prod.range || null,
        tagline: prod.tagline,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice || null,
        stockCount: 25,
        isFeatured: prod.isFeatured ?? false,
        isNew: prod.isNew ?? false,
        isBestseller: prod.isBestseller ?? false,
        finishes: prod.finishes ?? [],
        finishImages: prod.finishImages ? JSON.parse(JSON.stringify(prod.finishImages)) : null,
        images: prod.images ?? [],
        dimensions: prod.dimensions || null,
        flowRate: prod.flowRate || null,
        material: prod.material || "Solid Forged Brass",
        warranty: prod.warranty || "15 Years Warranty",
        rating: prod.rating ?? 4.9,
        reviewsCount: prod.reviewsCount ?? 15,
        features: prod.features ?? [],
        specs: JSON.parse(JSON.stringify(fullSpecs)),
      },
    });
  }

  // 3. Seed Promotional Sales
  console.log("🏷️ Seeding promotional sales...");
  const sampleSales = [
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

  for (const sale of sampleSales) {
    await prisma.sale.upsert({
      where: { slug: sale.slug },
      update: {
        title: sale.title,
        bannerText: sale.bannerText,
        discountType: sale.discountType,
        discountValue: sale.discountValue,
        targetCategory: sale.targetCategory,
        badgeText: sale.badgeText,
        bannerImage: sale.bannerImage,
        isActive: sale.isActive,
        endDate: sale.endDate,
      },
      create: sale,
    });
  }

  // 4. Seed Coupons
  console.log("🎟️ Seeding discount coupons...");
  for (const coupon of ADMIN_COUPONS) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        expiryDate: new Date(coupon.expiryDate),
        status: coupon.status,
        description: coupon.description,
      },
      create: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        expiryDate: new Date(coupon.expiryDate),
        status: coupon.status,
        description: coupon.description,
      },
    });
  }

  // 5. Seed Users
  console.log("👤 Seeding admin customers & VIP users...");
  for (const user of ADMIN_USERS) {
    await prisma.adminUser.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        city: user.city,
        tier: user.tier,
        totalOrders: user.totalOrders,
        totalSpent: user.totalSpent,
        status: user.status,
        company: user.company || null,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        city: user.city,
        tier: user.tier,
        totalOrders: user.totalOrders,
        totalSpent: user.totalSpent,
        status: user.status,
        company: user.company || null,
      },
    });
  }

  // 6. Seed Orders & OrderItems
  console.log("📦 Seeding initial luxury orders...");
  for (const order of ADMIN_ORDERS) {
    await prisma.order.upsert({
      where: { orderNumber: order.orderNumber },
      update: {
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        customerCity: order.customer.city,
        customerState: order.customer.state,
        customerAddress: order.shippingAddress,
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        total: order.total,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        paymentMethod: order.paymentMethod,
        trackingNumber: order.trackingNumber || null,
      },
      create: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        customerCity: order.customer.city,
        customerState: order.customer.state,
        customerAddress: order.shippingAddress,
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        total: order.total,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        paymentMethod: order.paymentMethod,
        trackingNumber: order.trackingNumber || null,
        items: {
          create: order.items.map((item) => ({
            productName: item.name,
            sku: item.sku,
            finish: item.finish,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
        },
      },
    });
  }

  // 7. Seed Admin Login Account
  console.log("🔐 Seeding super admin account...");
  await prisma.adminAccount.upsert({
    where: { email: "admin-parkash@gmail.com" },
    update: {
      password: "123456",
      name: "Parkash Executive Admin",
      role: "Super Admin",
    },
    create: {
      email: "admin-parkash@gmail.com",
      password: "123456",
      name: "Parkash Executive Admin",
      role: "Super Admin",
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
