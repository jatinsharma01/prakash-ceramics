import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { ADMIN_COUPONS, ADMIN_ORDERS, ADMIN_USERS } from "@/lib/adminData";

export async function POST() {
  try {
    console.log("Starting DB sync / seed...");

    // 1. Categories
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

    // 2. Products
    for (const prod of PRODUCTS) {
      await prisma.product.upsert({
        where: { sku: prod.sku },
        update: {
          name: prod.name,
          slug: prod.slug,
          category: prod.category,
          categorySlug: prod.categorySlug,
          tagline: prod.tagline,
          description: prod.description,
          price: prod.price,
          originalPrice: prod.originalPrice || null,
          stockCount: 25,
          isFeatured: prod.isFeatured ?? false,
          isNew: prod.isNew ?? false,
          isBestseller: prod.isBestseller ?? false,
          finishes: prod.finishes ?? [],
          images: prod.images ?? [],
          material: prod.material || "Solid Forged Brass",
          warranty: prod.warranty || "15 Years Warranty",
          rating: prod.rating ?? 4.9,
          reviewsCount: prod.reviewsCount ?? 15,
          features: prod.features ?? [],
        },
        create: {
          id: prod.id,
          sku: prod.sku,
          name: prod.name,
          slug: prod.slug,
          category: prod.category,
          categorySlug: prod.categorySlug,
          tagline: prod.tagline,
          description: prod.description,
          price: prod.price,
          originalPrice: prod.originalPrice || null,
          stockCount: 25,
          isFeatured: prod.isFeatured ?? false,
          isNew: prod.isNew ?? false,
          isBestseller: prod.isBestseller ?? false,
          finishes: prod.finishes ?? [],
          images: prod.images ?? [],
          material: prod.material || "Solid Forged Brass",
          warranty: prod.warranty || "15 Years Warranty",
          rating: prod.rating ?? 4.9,
          reviewsCount: prod.reviewsCount ?? 15,
          features: prod.features ?? [],
        },
      });
    }

    // 3. Coupons
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

    // 4. Users / Architects
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

    // 5. Initial Orders
    const existingOrdersCount = await prisma.order.count();
    if (existingOrdersCount === 0) {
      for (const ord of ADMIN_ORDERS) {
        await prisma.order.create({
          data: {
            id: ord.id,
            orderNumber: ord.orderNumber,
            customerName: ord.customer.name,
            customerEmail: ord.customer.email,
            customerPhone: ord.customer.phone,
            customerCity: ord.customer.city,
            customerState: ord.customer.state,
            customerAddress: ord.shippingAddress,
            subtotal: ord.subtotal,
            tax: ord.tax,
            discount: ord.discount,
            total: ord.total,
            paymentStatus: ord.paymentStatus,
            fulfillmentStatus: ord.fulfillmentStatus,
            paymentMethod: ord.paymentMethod,
            trackingNumber: ord.trackingNumber,
            items: {
              create: ord.items.map((it) => ({
                productName: it.name,
                sku: it.sku,
                finish: it.finish,
                quantity: it.quantity,
                price: it.price,
                image: it.image,
              })),
            },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Database populated with ${PRODUCTS.length} products, ${CATEGORIES.length} categories, ${ADMIN_COUPONS.length} coupons, and ${ADMIN_USERS.length} clients/architects.`,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}
