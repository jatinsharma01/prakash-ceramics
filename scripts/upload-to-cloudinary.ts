/**
 * Bulk-upload all images from public/images/ to Cloudinary
 * and generate a URL mapping file.
 *
 * Usage:
 *   1. Set env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *   2. Run: npx tsx scripts/upload-to-cloudinary.ts
 *   3. It creates scripts/image-map.json with { "/images/file.jpg": "https://res.cloudinary.com/..." }
 *   4. Then run: npx tsx scripts/replace-image-urls.ts  to update source code
 */

import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";

// Configure from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const OUTPUT_MAP = path.join(process.cwd(), "scripts", "image-map.json");

// Cloudinary folder to organize uploads
const CLOUD_FOLDER = "parkash-ceramics";

async function getAllImages(dir: string): Promise<string[]> {
  const entries = fs.readdirSync(dir);
  const images: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      images.push(...(await getAllImages(fullPath)));
    } else if (/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(entry)) {
      images.push(fullPath);
    }
  }

  return images;
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("\n❌ Missing Cloudinary credentials!");
    console.error("Set these env vars before running:\n");
    console.error("  export CLOUDINARY_CLOUD_NAME=your_cloud_name");
    console.error("  export CLOUDINARY_API_KEY=your_api_key");
    console.error("  export CLOUDINARY_API_SECRET=your_api_secret");
    console.error("\nGet them from: https://console.cloudinary.com/settings/api-keys\n");
    process.exit(1);
  }

  console.log("\n🔍 Scanning public/images/ for images...\n");
  const images = await getAllImages(IMAGES_DIR);
  console.log(`Found ${images.length} images to upload.\n`);

  const mapping: Record<string, string> = {};
  let uploaded = 0;
  let failed = 0;

  for (const imagePath of images) {
    const relativePath = "/" + path.relative(path.join(process.cwd(), "public"), imagePath);
    const publicId = CLOUD_FOLDER + "/" + path.basename(imagePath, path.extname(imagePath));

    try {
      // Check if already uploaded (skip duplicates)
      if (mapping[relativePath]) {
        continue;
      }

      const result = await cloudinary.uploader.upload(imagePath, {
        public_id: publicId,
        overwrite: false,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      });

      mapping[relativePath] = result.secure_url;
      uploaded++;
      console.log(`  ✅ [${uploaded}/${images.length}] ${path.basename(imagePath)}`);
    } catch (err: any) {
      // If already exists, fetch the URL
      if (err?.http_code === 409 || err?.message?.includes("already exists")) {
        try {
          const existing = await cloudinary.api.resource(publicId);
          mapping[relativePath] = existing.secure_url;
          uploaded++;
          console.log(`  ♻️  [${uploaded}/${images.length}] ${path.basename(imagePath)} (already uploaded)`);
        } catch {
          failed++;
          console.error(`  ❌ [${uploaded + failed}/${images.length}] ${path.basename(imagePath)}: ${err.message}`);
        }
      } else {
        failed++;
        console.error(`  ❌ [${uploaded + failed}/${images.length}] ${path.basename(imagePath)}: ${err.message}`);
      }
    }
  }

  // Save mapping
  fs.writeFileSync(OUTPUT_MAP, JSON.stringify(mapping, null, 2));

  console.log(`\n✨ Done! ${uploaded} uploaded, ${failed} failed.`);
  console.log(`📄 URL mapping saved to: scripts/image-map.json`);
  console.log(`\n👉 Next step: run  npx tsx scripts/replace-image-urls.ts  to update source code\n`);
}

main().catch(console.error);
