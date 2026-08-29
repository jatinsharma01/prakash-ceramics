import { PRODUCTS } from "./products";

export interface PackageItem {
  name: string;
  role: string;
  finish: string;
  sku: string;
  price: number;
  image: string;
  productId?: string;
}

export interface BathroomPackage {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  badge: string;
  tagline: string;
  description: string;
  coverImage: string;
  finishTheme: string;
  idealFor: string;
  packagePrice: number;
  originalPrice: number;
  savings: number;
  items: PackageItem[];
}

export const BATHROOM_PACKAGES: BathroomPackage[] = [
  {
    id: "pkg-gold-penthouse",
    slug: "royal-penthouse-gold-suite",
    name: "The Royal Penthouse Suite",
    subtitle: "Complete 4-Piece Master Bath Ensemble in Gold Bright PVD",
    badge: "Most Popular Suite",
    tagline: "Uncompromising gold luxury engineered for master penthouse bathrooms and presidential suites.",
    description: "A cohesive, architecturally matched collection featuring tall vessel mixer, multi-function thermostatic rain shower, freestanding floor tub filler, and vitreous ceramic fixtures in radiant Gold Bright PVD.",
    coverImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200",
    finishTheme: "Gold Bright PVD",
    idealFor: "Master Bedrooms, Penthouse Suites & Luxury Villas",
    packagePrice: 71900,
    originalPrice: 84500,
    savings: 12600,
    items: [
      {
        name: "Single Lever Tall Boy (190mm)",
        role: "Countertop Vessel Basin Mixer",
        finish: "Gold Bright PVD",
        sku: "FUP-GBP-29005BPM",
        price: 10300,
        image: "/images/faucets/single-lever-tall-boy/0057108_single-lever-tall-boy-gold-bright-pvd_960.jpeg",
        productId: "prod-faucet-01"
      },
      {
        name: "Single Lever Basin Mixer",
        role: "Under-counter / Vanity Mixer",
        finish: "Gold Bright PVD",
        sku: "FUP-GBP-29011BPM",
        price: 9400,
        image: "/images/faucets/single-lever-basin/0057135_single-lever-basin-mixer-with-popup-waste-gold-bright-pvd_960.jpeg",
        productId: "prod-faucet-02"
      },
      {
        name: "Celestial 300mm Thermostatic Rain Shower",
        role: "Concealed 3-Flow Overhead Shower",
        finish: "Gold Bright PVD",
        sku: "SHW-GLD-THM-01",
        price: 36800,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Monarch Freestanding Bathtub Filler Spout",
        role: "Floor-Mounted High-Flow Spout",
        finish: "Gold Bright PVD",
        sku: "SPT-GLD-FLR-02",
        price: 28000,
        image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  {
    id: "pkg-matte-black-villa",
    slug: "modern-villa-matte-black-suite",
    name: "The Modern Villa Suite",
    subtitle: "Monolithic Architectural Matte Black 4-Piece Collection",
    badge: "Architect's Choice",
    tagline: "Bold, velvety matte black finishes for contemporary minimal villas and concrete interiors.",
    description: "Designed for stark contrast and modern minimalism. Features electroplated deep matte black tall faucet, concealed rainfall & waterfall shower system, wall mixer, and precision hardware.",
    coverImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200",
    finishTheme: "Black Matt",
    idealFor: "Modern Minimal Villas, Urban En-Suites & Lofts",
    packagePrice: 58900,
    originalPrice: 69200,
    savings: 10300,
    items: [
      {
        name: "Single Lever Tall Boy (190mm)",
        role: "Countertop Basin Mixer",
        finish: "Black Matt",
        sku: "FUP-BMT-29005BPM",
        price: 10300,
        image: "/images/faucets/single-lever-tall-boy/0057106_single-lever-tall-boy-black-matt_960.jpeg",
        productId: "prod-faucet-01"
      },
      {
        name: "Single Lever Basin Mixer",
        role: "Vanity Basin Faucet",
        finish: "Black Matt",
        sku: "FUP-BMT-29011BPM",
        price: 9400,
        image: "/images/faucets/single-lever-basin/0057133_single-lever-basin-mixer-with-popup-waste-black-matt_960.jpeg",
        productId: "prod-faucet-02"
      },
      {
        name: "Cascade Concealed Ceiling Shower & Mist Kit",
        role: "Concealed Thermostatic Diverter",
        finish: "Black Matt",
        sku: "SHW-BLK-CSD-02",
        price: 32500,
        image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Matte Black Linear Floor Drain & Accessory Set",
        role: "Architectural Trim & Hardware",
        finish: "Black Matt",
        sku: "ACC-BLK-SET-04",
        price: 17000,
        image: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  {
    id: "pkg-nordic-spa-chrome",
    slug: "scandinavian-nordic-spa-suite",
    name: "The Scandinavian Nordic Spa Suite",
    subtitle: "High-Gloss Mirror Chrome Hydrotherapy Ensemble",
    badge: "Hydro-Sensory Wellness",
    tagline: "Crisp mirror-chrome fixtures with air-injected wellness cascades and eco-aerated flows.",
    description: "Engineered for pure serenity and light-filled Scandinavian aesthetics. Includes Swiss cartridge basin mixer, air-infused rainfall showerhead with hand-spray, and ergonomic thermostatic control.",
    coverImage: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1200",
    finishTheme: "Chrome",
    idealFor: "Resort Bathrooms, Daylight En-Suites & Wellness Spas",
    packagePrice: 52400,
    originalPrice: 61800,
    savings: 9400,
    items: [
      {
        name: "Single Lever Tall Boy (190mm)",
        role: "Tall Vessel Basin Mixer",
        finish: "Chrome",
        sku: "FUP-CHM-29005BPM",
        price: 10300,
        image: "/images/faucets/single-lever-tall-boy/0059263_single-lever-tall-boy-chrome_960.jpeg",
        productId: "prod-faucet-01"
      },
      {
        name: "Single Lever Basin Mixer",
        role: "Countertop Basin Mixer",
        finish: "Chrome",
        sku: "FUP-CHM-29011BPM",
        price: 9400,
        image: "/images/faucets/single-lever-basin/0059261_single-lever-basin-mixer-with-popup-waste-chrome_960.jpeg",
        productId: "prod-faucet-02"
      },
      {
        name: "Hydro-Sensory 300mm Dual Air-Drop Shower",
        role: "Air-Injected Rain Showerhead",
        finish: "Chrome",
        sku: "SHW-CHM-HDS-03",
        price: 25900,
        image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Eco-Save Cascade Bath Spout & Diverter",
        role: "High-Flow Wall Spout",
        finish: "Chrome",
        sku: "SPT-CHM-CSD-01",
        price: 16200,
        image: "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  {
    id: "pkg-rose-gold-hospitality",
    slug: "boutique-rose-gold-master-suite",
    name: "The Boutique Rose Gold Suite",
    subtitle: "Warm Blush Gold PVD 4-Piece Haute Ensemble",
    badge: "Haute Hospitality",
    tagline: "Warm metallic luster for boutique hotels, designer vanity suites, and bespoke master bathrooms.",
    description: "A signature ensemble coated in multi-stage PVD Blush Gold that resists water spots and fingerprint oxidation. Features precision engineered mixers and touch thermostatic controls.",
    coverImage: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1200",
    finishTheme: "Blush Gold PVD",
    idealFor: "Boutique Hospitality, Designer Guest Baths & En-Suites",
    packagePrice: 65900,
    originalPrice: 77500,
    savings: 11600,
    items: [
      {
        name: "Single Lever Tall Boy (190mm)",
        role: "Tall Basin Mixer",
        finish: "Blush Gold PVD",
        sku: "FUP-BGP-29005BPM",
        price: 10300,
        image: "/images/faucets/single-lever-tall-boy/0057107_single-lever-tall-boy-blush-gold-pvd_960.jpeg",
        productId: "prod-faucet-01"
      },
      {
        name: "Single Lever Basin Mixer",
        role: "Vessel Basin Mixer",
        finish: "Blush Gold PVD",
        sku: "FUP-BGP-29011BPM",
        price: 9400,
        image: "/images/faucets/single-lever-basin/0057134_single-lever-basin-mixer-with-popup-waste-blush-gold-pvd_960.jpeg",
        productId: "prod-faucet-02"
      },
      {
        name: "Touch Pro Multi-Jet Rose Gold Shower Panel",
        role: "Concealed Diverter System",
        finish: "Blush Gold PVD",
        sku: "SHW-BGP-TCH-04",
        price: 38800,
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Rose Gold Concealed Wall Spout & Trim Kit",
        role: "Solid Forged Brass Spout",
        finish: "Blush Gold PVD",
        sku: "SPT-BGP-WLL-03",
        price: 19000,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"
      }
    ]
  }
];
