import { PrismaClient } from "@prisma/client";
import { INITIAL_BRANDS } from "../src/lib/brands";
import { CATEGORIES } from "../src/lib/categories";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 System setup: Ensuring admin credentials, categories, and brands...");

  // 1. Brands (Essential Taxonomy)
  console.log("🏷️ Setting up brands...");
  for (const b of INITIAL_BRANDS) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        description: b.description,
        website: b.website,
        isFeatured: b.isFeatured ?? false,
      },
      create: {
        id: b.id,
        name: b.name,
        slug: b.slug,
        description: b.description,
        website: b.website,
        isFeatured: b.isFeatured ?? false,
        itemCount: 0,
      },
    });
  }

  // 2. Categories (Essential Taxonomy)
  console.log("📁 Setting up categories...");
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        shortDescription: cat.shortDescription,
        description: cat.description,
        image: cat.image,
        featured: cat.featured ?? false,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        shortDescription: cat.shortDescription,
        description: cat.description,
        image: cat.image,
        featured: cat.featured ?? false,
        itemCount: 0,
        tags: cat.tags ?? [],
      },
    });
  }

  // 3. Super Admin Login Account
  console.log("🔐 Ensuring super admin account exists...");
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

  console.log("✅ Setup completed without injecting any fake data!");
}

main()
  .catch((e) => {
    console.error("❌ Setup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
