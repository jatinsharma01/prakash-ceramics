import { Product } from "./types";

export const PRODUCTS: Product[] = [
  // FAUCETS
  {
    id: "prod-faucet-01",
    name: "Single Lever Tall Boy",
    slug: "single-lever-tall-boy",
    category: "Faucets",
    categorySlug: "faucets",
    subcategory: "Tall Basin Mixers",
    range: "Fusion Prime",
    tagline: "Single Lever Tall Boy with 190mm Extension Body & 600mm Long Braided Hoses",
    description: "Single Lever Tall Boy with 190mm Extension Body Fixed Spout without Popup Waste System with 600mm Long Braided Hoses",
    price: 10300,
    originalPrice: 12500,
    sku: "FUP-BCH-29005BPM",
    isFeatured: true,
    isBestseller: true,
    finishes: ["Black Chrome", "Black Matt", "Blush Gold PVD", "Gold Bright PVD", "Chrome"],
    finishImages: {
      "Black Chrome": "/images/faucets/single-lever-tall-boy/0057105_single-lever-tall-boy-black-chrome_960.jpeg",
      "Black Matt": "/images/faucets/single-lever-tall-boy/0057106_single-lever-tall-boy-black-matt_960.jpeg",
      "Blush Gold PVD": "/images/faucets/single-lever-tall-boy/0057107_single-lever-tall-boy-blush-gold-pvd_960.jpeg",
      "Gold Bright PVD": "/images/faucets/single-lever-tall-boy/0057108_single-lever-tall-boy-gold-bright-pvd_960.jpeg",
      "Chrome": "/images/faucets/single-lever-tall-boy/0059263_single-lever-tall-boy-chrome_960.jpeg",
    },
    images: [
      "/images/faucets/single-lever-tall-boy/0057105_single-lever-tall-boy-black-chrome_960.jpeg",
      "/images/faucets/single-lever-tall-boy/0057108_single-lever-tall-boy-gold-bright-pvd_960.jpeg",
      "/images/faucets/single-lever-tall-boy/0057106_single-lever-tall-boy-black-matt_960.jpeg",
      "/images/faucets/single-lever-tall-boy/0057107_single-lever-tall-boy-blush-gold-pvd_960.jpeg",
      "/images/faucets/single-lever-tall-boy/0059263_single-lever-tall-boy-chrome_960.jpeg",
    ],
    dimensions: "190mm Extension Tall Body x Fixed Spout",
    flowRate: "5.0 LPM at 3 Bar (Eco-Aerated Flow)",
    material: "Forged DR Brass with Ceramic Disc Cartridge",
    warranty: "10 Years Comprehensive Warranty",
    rating: 4.9,
    reviewsCount: 46,
    features: [
      "190mm Extension Body specifically designed for vessel and countertop washbasins",
      "Fixed Spout design without Popup Waste System",
      "Supplied with 600mm Long Stainless Steel Braided Hoses",
      "Fusion Prime precision ceramic disc cartridge rated for 500,000+ smooth cycles",
      "Multi-layered diamond-grade PVD and electroplated finish protection"
    ],
    specs: {
      "Range": "Fusion Prime",
      "Code": "FUP-BCH-29005BPM",
      "Extension Body": "190 mm",
      "Spout Type": "Fixed Spout",
      "Waste System": "Without Popup Waste System",
      "Braided Hoses": "600 mm Long Braided Hoses",
      "MRP": "₹ 10,300.00",
      "Mounting Type": "Single Hole Deck Mount"
    }
  },
  {
    id: "prod-faucet-02",
    name: "Single Lever Basin Mixer",
    slug: "single-lever-basin-mixer",
    category: "Faucets",
    categorySlug: "faucets",
    subcategory: "Basin Mixers",
    range: "Fusion Prime",
    tagline: "Single Lever Basin Mixer without Popup Waste System with 450mm Long Braided Hoses",
    description: "Single Lever Basin Mixer without Popup Waste System with 450mm Long Braided Hoses",
    price: 9400,
    originalPrice: 11200,
    sku: "FUP-GBP-29011BPM",
    isFeatured: true,
    isNew: true,
    finishes: ["Gold Bright PVD", "Black Chrome", "Black Matt", "Blush Gold PVD", "Chrome"],
    finishImages: {
      "Gold Bright PVD": "/images/faucets/single-lever-basin/0057135_single-lever-basin-mixer-with-popup-waste-gold-bright-pvd_960.jpeg",
      "Black Chrome": "/images/faucets/single-lever-basin/0057132_single-lever-basin-mixer-with-popup-waste-black-chrome_960.jpeg",
      "Black Matt": "/images/faucets/single-lever-basin/0057133_single-lever-basin-mixer-with-popup-waste-black-matt_960.jpeg",
      "Blush Gold PVD": "/images/faucets/single-lever-basin/0057134_single-lever-basin-mixer-with-popup-waste-blush-gold-pvd_960.jpeg",
      "Chrome": "/images/faucets/single-lever-basin/0059261_single-lever-basin-mixer-with-popup-waste-chrome_960.jpeg",
    },
    images: [
      "/images/faucets/single-lever-basin/0057135_single-lever-basin-mixer-with-popup-waste-gold-bright-pvd_960.jpeg",
      "/images/faucets/single-lever-basin/0057132_single-lever-basin-mixer-with-popup-waste-black-chrome_960.jpeg",
      "/images/faucets/single-lever-basin/0057133_single-lever-basin-mixer-with-popup-waste-black-matt_960.jpeg",
      "/images/faucets/single-lever-basin/0057134_single-lever-basin-mixer-with-popup-waste-blush-gold-pvd_960.jpeg",
      "/images/faucets/single-lever-basin/0059261_single-lever-basin-mixer-with-popup-waste-chrome_960.jpeg",
    ],
    dimensions: "Standard Deck Mount Basin Mixer",
    flowRate: "4.8 LPM at 3 Bar (Eco-Save)",
    material: "Lead-free DR Solid Brass & Ceramic Disc Valve",
    warranty: "10 Years Comprehensive Warranty",
    rating: 4.9,
    reviewsCount: 38,
    features: [
      "Single Lever precision ceramic disc cartridge with ultra-smooth gliding control",
      "Without Popup Waste System",
      "Supplied with 450mm Long Stainless Steel Braided Hoses",
      "High-durability PVD Gold Bright & architectural finishes",
      "Integrated honeycomb aerator for soft splash-free laminar stream"
    ],
    specs: {
      "Range": "Fusion Prime",
      "Code": "FUP-GBP-29011BPM",
      "Spout Type": "Fixed Spout with Aerator",
      "Waste System": "Without Popup Waste System",
      "Braided Hoses": "450 mm Long Braided Hoses",
      "MRP": "₹ 9,400.00 (Inclusive of all taxes)",
      "Mounting Type": "Single Hole Deck Mount"
    }
  },

  // SHOWERS
  {
    id: "prod-shower-01",
    name: "Celeste 400mm Ultra-Slim Rain Shower",
    slug: "celeste-ultra-slim-rain-shower",
    category: "Showers",
    categorySlug: "showers",
    subcategory: "Rain Showers",
    tagline: "Mirror-finish 304 stainless steel rainfall shower with air-injection",
    description: "Immerse yourself in gentle drenching rain. The Celeste 400mm shower plate uses pressurized air-injection to generate plumper, softer droplets while conserving up to 30% water.",
    price: 18999,
    originalPrice: 22999,
    sku: "PC-SHW-CEL-01",
    isFeatured: true,
    isBestseller: true,
    finishes: ["Chrome", "Matte Black", "Brushed Gold", "Rose Gold"],
    images: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "400mm x 400mm x 2mm Edge Thickness",
    flowRate: "12.5 LPM with Air-Intake Boost",
    material: "AISI 304 Surgical Grade Stainless Steel",
    warranty: "10 Years Warranty",
    rating: 5.0,
    reviewsCount: 42,
    features: [
      "224 precision-molded self-clearing silicone jets",
      "Laser-welded seamless unibody structure prevents bursting",
      "Swivel ball joint with 360-degree tilt tension control",
      "Includes ceiling/wall mount 300mm brass arm"
    ],
    specs: {
      "Mounting": "Ceiling / Wall Mount Flange",
      "Nozzle Material": "Medical-Grade Silicone",
      "Min Pressure": "1.5 Bar",
      "Connection": "G 1/2 Standard Thread"
    }
  },
  {
    id: "prod-shower-02",
    name: "HydroVortex Multi-Jet Shower Column",
    slug: "hydrovortex-multi-jet-shower-column",
    category: "Showers",
    categorySlug: "showers",
    subcategory: "Shower Columns",
    tagline: "Thermostatic shower system with waterfall, rain, and lumbar body jets",
    description: "A total shower upgrade without breaking internal walls. Features an integrated thermostatic cartridge, 3 invigorating body spray nozzles, and an ergonomic baton hand shower.",
    price: 28499,
    originalPrice: 34000,
    sku: "PC-SHW-VOR-02",
    isFeatured: true,
    finishes: ["Matte Black", "Chrome", "Brushed Gold"],
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "1200mm (H) x 200mm (W) x 450mm (Projection)",
    flowRate: "14 LPM at 3 Bar",
    material: "Brushed Aluminum & Solid Brass Manifold",
    warranty: "7 Years Comprehensive Warranty",
    rating: 4.9,
    reviewsCount: 19,
    features: [
      "Safety 38°C thermostatic temperature lock",
      "Independently switchable multi-flow divert keys",
      "Anti-twist 1.5m silicone shower hose",
      "High-pressure adjustable body massage jets"
    ],
    specs: {
      "Inlet Spacing": "150mm ± 15mm with S-Connectors",
      "Thermostat Brand": "Vernet France Cartridge",
      "Surface Finish": "Anodized Matte Shield",
      "Body Jet Count": "3 Swivel Clusters"
    }
  },

  // CLOUD / SMART WELLNESS
  {
    id: "prod-cloud-01",
    name: "Nimbus Smart Cloud Wellness Suite",
    slug: "nimbus-smart-cloud-wellness-suite",
    category: "Cloud",
    categorySlug: "cloud",
    subcategory: "Smart Showers",
    tagline: "Digital touchscreen shower system with chromotherapy and steam control",
    description: "Step into the future of personal bathing. The Nimbus Cloud system synchronizes thermostatic precision, aroma mist infusion, and customizable ambient light spectrums via a glass digital console.",
    price: 145000,
    originalPrice: 168000,
    sku: "PC-CLD-NIM-01",
    isFeatured: true,
    isNew: true,
    finishes: ["Matte Black", "Chrome", "Brushed Gold"],
    images: [
      "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "500mm x 500mm Overhead Plate + 7-inch Touch Interface",
    flowRate: "16 LPM Multi-Zone Controlled",
    material: "Tempered Corning Glass, Marine Brass, Stainless 316",
    warranty: "5 Years Full Electronic & Mechanical Warranty",
    rating: 5.0,
    reviewsCount: 11,
    features: [
      "IPX7 Waterproof capacitive touch glass controller",
      "Integrated RGBW chromotherapy LED halo ring with 12 presets",
      "Essential oils aroma-diffuser capsule slot",
      "Bluetooth audio integration with waterproof high-fidelity transducers"
    ],
    specs: {
      "Voltage": "220V-240V AC 50Hz (Isolated Low-Voltage Supply)",
      "Digital Outlets": "4 Electronically Controlled Valves",
      "Max Presets": "6 User Profiles with Memory",
      "App Control": "Wi-Fi Connected Mobile Companion App"
    }
  },

  // SANITARYWARE
  {
    id: "prod-sanitary-01",
    name: "Vero Rimless Wall-Hung WC with Bidet",
    slug: "vero-rimless-wall-hung-wc",
    category: "Sanitaryware",
    categorySlug: "sanitaryware",
    subcategory: "Water Closets",
    tagline: "Tornado-flush rimless ceramic toilet with UF soft-close slim seat",
    description: "Engineered for spotless hygiene and whisper-quiet operation. The Vero features a dual vortex tornado flush and a nano-crystalline glaze that actively repels stains and bacteria.",
    price: 24999,
    originalPrice: 29999,
    sku: "PC-SAN-VER-01",
    isFeatured: true,
    isBestseller: true,
    finishes: ["White Ceramic", "Matte Black", "Graphite Grey"],
    images: [
      "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "540mm (D) x 360mm (W) x 350mm (H)",
    material: "Vitreous China with UltraGlaze Nano Coating",
    warranty: "12 Years Ceramic Guarantee",
    rating: 4.9,
    reviewsCount: 65,
    features: [
      "Rimless bowl geometry leaves zero hidden gaps for bacteria",
      "UF Urea-Formaldehyde heavy-duty anti-scratch quick-release seat",
      "Dual flush efficiency: 3 Liters Half Flush / 4.5 Liters Full Flush",
      "Tested load capacity of over 450 kg"
    ],
    specs: {
      "Mounting": "Wall-Mounted on Concealed Frame",
      "Trap Type": "P-Trap 180mm rough-in",
      "Flushing": "Tornado 360 Vortex Flush",
      "Hinge Type": "Stainless Steel Top-Fix Soft Close"
    }
  },
  {
    id: "prod-sanitary-02",
    name: "Calacatta Fluted Countertop Vessel Basin",
    slug: "calacatta-fluted-countertop-vessel-basin",
    category: "Sanitaryware",
    categorySlug: "sanitaryware",
    subcategory: "Washbasins",
    tagline: "Architectural fluted ceramic vessel sink with satin matte finish",
    description: "An exquisite statement piece for luxury powder rooms and master suites. The fluted exterior ridges contrast harmoniously against the smooth, easy-to-clean inner bowl basin.",
    price: 11499,
    originalPrice: 14500,
    sku: "PC-SAN-CAL-02",
    isFeatured: true,
    finishes: ["White Ceramic", "Matte Black", "Graphite Grey"],
    images: [
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "420mm (Dia) x 135mm (H)",
    material: "Fine Fireclay Ceramic",
    warranty: "10 Years Ceramic Warranty",
    rating: 4.8,
    reviewsCount: 31,
    features: [
      "Ultra-thin 5mm precision rim edge engineering",
      "Matches with Parkash Ceramics pop-up ceramic waste domes",
      "Resistant to cosmetics, thermal shock, and scratches",
      "Flat base for rock-solid silicone countertop installation"
    ],
    specs: {
      "Installation": "Countertop Vessel",
      "Drain Hole": "Standard 45mm",
      "Overflow": "Without Overflow (requires free-flow waste)",
      "Finish": "Satin Velvet Glaze"
    }
  },

  // BATHTUBS & FREESTANDING
  {
    id: "prod-bath-01",
    name: "Opulence Freestanding Soaking Bathtub",
    slug: "opulence-freestanding-soaking-bathtub",
    category: "Bath Tubs",
    categorySlug: "bath-tubs",
    subcategory: "Freestanding Tubs",
    tagline: "Ergonomic double-ended seamless acrylic luxury bath",
    description: "A sanctuary of peace in your bathroom. Hand-buffed high-density sanitary acrylic reinforced with multi-strand fibreglass retains water heat up to 40% longer for extended deep soaks.",
    price: 78999,
    originalPrice: 95000,
    sku: "PC-BAT-OPU-01",
    isFeatured: true,
    isBestseller: true,
    finishes: ["White Ceramic", "Matte Black"],
    images: [
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "1700mm (L) x 800mm (W) x 600mm (H)",
    material: "Sanitary Grade Cast Lucite Acrylic with Resin Core",
    warranty: "10 Years Structural Warranty",
    rating: 5.0,
    reviewsCount: 28,
    features: [
      "Integrated chrome slotted overflow and click-clack waste included",
      "Concealed adjustable stainless steel leveling frame base",
      "Seamless monobloc joint — zero visible seams",
      "Ergonomic sloped backrests for single or couple bathing"
    ],
    specs: {
      "Water Capacity": "260 Liters",
      "Dry Weight": "48 kg",
      "Heat Retention Index": "Grade A+ Insulated Core",
      "Waste Diameter": "50mm Push Clicker"
    }
  },

  // WHIRLPOOL BATHTUBS
  {
    id: "prod-whirlpool-01",
    name: "Serenade Hydro-Whirlpool Spa Tub",
    slug: "serenade-hydro-whirlpool-spa-tub",
    category: "Whirlpool Bathtubs",
    categorySlug: "whirlpool-bathtubs",
    subcategory: "Whirlpools",
    tagline: "16-Jet hydrotherapy spa tub with inline heating and chromotherapy",
    description: "Rejuvenate your body with pulsating hydro-massage. Featuring 8 directional lumbar micro-jets, 8 powerful side vortex jets, an inline thermostat to keep water warm, and underwater LED chromotherapy.",
    price: 135000,
    originalPrice: 158000,
    sku: "PC-WHL-SER-01",
    isFeatured: true,
    finishes: ["White Ceramic"],
    images: [
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "1800mm (L) x 900mm (W) x 650mm (H)",
    material: "Reinforced PMMA Acrylic with Steel Sub-Structure",
    warranty: "5 Years Pump & Electronics, 10 Years Tub Body",
    rating: 4.9,
    reviewsCount: 15,
    features: [
      "1.5 HP ultra-quiet German-designed water pump with dry-run protection",
      "1.5 kW constant-temperature inline water heater",
      "Pneumatic fingertip controls with air-venturi flow regulator",
      "Ozone self-cleaning and pipe disinfection cycle"
    ],
    specs: {
      "Jets Count": "16 Total (8 Hydro + 8 Micro-Lumbar)",
      "Power Supply": "230V / 16A Dedicated Line",
      "Tub Shape": "Rectangular Drop-In / Freestanding Apron",
      "Lighting": "7-Color Mood LED Multi-Zone"
    }
  },

  // SAUNAS
  {
    id: "prod-sauna-01",
    name: "Nordic Haven Finnish Cedar Sauna",
    slug: "nordic-haven-finnish-cedar-sauna",
    category: "Saunas",
    categorySlug: "saunas",
    subcategory: "Traditional Saunas",
    tagline: "Authentic Canadian Western Red Cedar 4-person sauna cabin",
    description: "Bring traditional Scandinavian thermal wellness into your home. Made with sustainably harvested Red Cedar that releases natural aromatic resins, complete with an 8kW Harvia stone heater and 8mm glass front.",
    price: 320000,
    originalPrice: 380000,
    sku: "PC-SAU-NOR-01",
    isFeatured: true,
    finishes: ["Natural Cedar"],
    images: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "2000mm (W) x 1800mm (D) x 2100mm (H)",
    material: "FSC Grade-A Canadian Red Cedar & Tempered Glass",
    warranty: "5 Years Cabin & 3 Years Heater Warranty",
    rating: 5.0,
    reviewsCount: 8,
    features: [
      "Includes 8kW Harvia Finnish stainless steel stone stove",
      "Traditional wooden bucket, ladle, thermo-hygrometer, and sand timer",
      "Dimmable backrest warm LED ambient lighting",
      "Double-tier ergonomic bench layout with headrest pillows"
    ],
    specs: {
      "Capacity": "3-4 Persons Comfortably",
      "Heating Time": "75°C - 90°C in ~30 Minutes",
      "Power Connection": "400V 3-Phase / 230V Single Phase",
      "Glass Type": "8mm Heat-Strengthened Safety Glass"
    }
  },

  // SPAS
  {
    id: "prod-spa-01",
    name: "Elysium 5-Person Outdoor Hydrotherapy Spa",
    slug: "elysium-5-person-hydrotherapy-spa",
    category: "Spas",
    categorySlug: "spas",
    subcategory: "Outdoor Spas",
    tagline: "38-Jet insulated hydrotherapy lounger with Balboa control system",
    description: "Engineered for supreme hydro-relaxation under the stars. The Elysium features an ergonomic captain's lounge chair, 4 therapeutic bucket seats, multi-point foot reflexology jets, and UV water purification.",
    price: 490000,
    originalPrice: 550000,
    sku: "PC-SPA-ELY-01",
    isFeatured: false,
    finishes: ["White Ceramic", "Graphite Grey"],
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "2200mm x 2200mm x 920mm",
    material: "Aristech Acrylic USA Shell + Synthetic Weatherproof Cabinet",
    warranty: "10 Years Shell, 5 Years Plumbing, 3 Years Balboa Electronics",
    rating: 4.9,
    reviewsCount: 6,
    features: [
      "USA Balboa TP600 Digital Spa Control Pack with 3kW Heater",
      "Dual 3.0 HP High-Performance 2-Speed Massage Pumps",
      "Built-in Ozone Generator + 100% Micro-Filtration Core",
      "Thermal Lock Insulated Heavy-Duty Winter Cover Included"
    ],
    specs: {
      "Capacity": "5 Persons (1 Lounger + 4 Seats)",
      "Total Jets": "38 Hydro Massage Jets (Stainless Steel)",
      "Water Volume": "1,150 Liters",
      "Dry Weight": "340 kg"
    }
  },

  // SHOWER ENCLOSURES
  {
    id: "prod-enclosure-01",
    name: "Panorama Frameless Walk-In Enclosure",
    slug: "panorama-frameless-walk-in-enclosure",
    category: "Shower Enclosures",
    categorySlug: "shower-enclosures",
    subcategory: "Walk-In Enclosures",
    tagline: "10mm Toughened safety glass with EasyClean nano-coating",
    description: "Create an open, airy master shower sanctuary. The Panorama 10mm glass enclosure comes with minimalist wall support bars and matte black or brushed brass hardware for a truly bespoke finish.",
    price: 34999,
    originalPrice: 42000,
    sku: "PC-ENC-PAN-01",
    isFeatured: true,
    finishes: ["Matte Black", "Brushed Gold", "Chrome"],
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "1200mm (W) x 2000mm (H) x 10mm (Thick Glass)",
    material: "10mm EN 12150-1 Toughened Glass & Solid Forged Brass Brackets",
    warranty: "10 Years Hardware Guarantee",
    rating: 4.8,
    reviewsCount: 22,
    features: [
      "EnduroShield permanent nano-coating repels limescale & soap scum",
      "Includes 1000mm ceiling/wall stainless stabilizing arm (cut to size)",
      "Ultra-low profile floor drip deflector seal",
      "Universal Left or Right-hand entrance installation"
    ],
    specs: {
      "Glass Type": "10mm Ultra-Clear Low Iron Glass",
      "Adjustment Range": "1180mm - 1200mm for out-of-true walls",
      "Hardware Finish": "PVD Coated Solid Brass",
      "Height": "2000mm Standard Height"
    }
  },

  // STEAM BATH SOLUTIONS
  {
    id: "prod-steam-01",
    name: "VaporMax Commercial & Home Steam Generator",
    slug: "vapormax-home-steam-generator",
    category: "Steam Bath Solutions",
    categorySlug: "steam-bath-solutions",
    subcategory: "Steam Generators",
    tagline: "9kW Instant steam generator with touchscreen control & aroma well",
    description: "Transforms any tiled shower enclosure into an invigorating Turkish steam hammam in under 60 seconds with automated drain descaling and digital thermal profiling.",
    price: 88999,
    originalPrice: 105000,
    sku: "PC-STM-VAP-01",
    isFeatured: false,
    finishes: ["Chrome", "Matte Black"],
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "450mm x 180mm x 380mm (Generator Unit)",
    material: "AISI 316 Stainless Steel Boiler Tank",
    warranty: "5 Years Warranty",
    rating: 4.9,
    reviewsCount: 14,
    features: [
      "RapidSteam™ boiler reaches full vapor output in 55 seconds",
      "Auto-Drain and power-flush cycle cleans sediment automatically",
      "Includes waterproof in-shower slimline glass touch keypad",
      "Aromatherapy steam outlet with essential oil reservoir well"
    ],
    specs: {
      "Power Rating": "9.0 kW (Suits rooms up to 10-14 m³)",
      "Electrical": "415V 3-Phase or 230V Single Phase 40A",
      "Steam Pipe": "3/4 inch Brass Steam Fitting",
      "Operating Temp": "35°C - 55°C Digital Setpoint"
    }
  },

  // THERMOSTATIC MIXERS & VALVES
  {
    id: "prod-thermo-01",
    name: "ThermaTouch 3-Outlet Concealed Thermostat",
    slug: "thermatouch-3-outlet-concealed-thermostat",
    category: "Thermostatic Mixers",
    categorySlug: "thermostatic-mixers",
    subcategory: "Concealed Mixers",
    tagline: "Push-button intuitive 3-function thermostatic valve trim",
    description: "Simultaneously control your overhead rain shower, hand shower, and body jets at the push of a tactile button with instant automatic temperature safety compensation.",
    price: 26999,
    originalPrice: 32500,
    sku: "PC-THM-TCH-01",
    isFeatured: true,
    finishes: ["Matte Black", "Brushed Gold", "Chrome", "Graphite Grey"],
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "150mm x 200mm Faceplate x 70mm Depth",
    flowRate: "28 LPM at 3 Bar High Flow",
    material: "Lead-Free DR Brass Body & Vernet Thermostatic Element",
    warranty: "10 Years Cartridge Guarantee",
    rating: 5.0,
    reviewsCount: 33,
    features: [
      "Individual on/off push buttons with rotary volume regulator",
      "Anti-scald 38°C safety button with child safety lock",
      "High-flow manifold capable of running 2 or 3 outlets concurrently",
      "Solid brass installation rough-in box with protective dust cover"
    ],
    specs: {
      "Number of Outlets": "3 Independent Outlets",
      "Temperature Range": "20°C - 50°C",
      "Rough-in Depth": "68mm - 85mm Adjustable",
      "Valves": "Push Button Ceramic Core"
    }
  },

  // FLUSHING SYSTEMS
  {
    id: "prod-flush-01",
    name: "PneumoPro Concealed In-Wall Cistern Frame",
    slug: "pneumopro-concealed-in-wall-cistern-frame",
    category: "Flushing Systems",
    categorySlug: "flushing-systems",
    subcategory: "Concealed Cisterns",
    tagline: "Heavy-duty 400kg load-bearing frame with acoustic foam insulation",
    description: "Designed for all standard wall-hung toilets. Built with an anti-corrosion powder-coated steel frame, acoustic insulation jacket for near-silent filling, and pneumatic actuation cable.",
    price: 12999,
    originalPrice: 15500,
    sku: "PC-FLU-PNE-01",
    isFeatured: false,
    finishes: ["Matte Black", "Brushed Gold", "Chrome"],
    images: [
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "1150mm (H) x 500mm (W) x 120mm (Slim Depth)",
    material: "High-Grade Structural Steel & High-Density Polyethylene Tank",
    warranty: "15 Years Tank & Frame Guarantee",
    rating: 4.8,
    reviewsCount: 45,
    features: [
      "Slim 120mm profile fits inside standard bathroom drywall partitions",
      "Dual flush volume adjustable from 3L / 6L to 2.5L / 4.5L",
      "Tested to withstand static loads exceeding 400 kg",
      "Tool-free maintenance access through actuator plate aperture"
    ],
    specs: {
      "Installation Type": "In-Wall Stud or Wet Wall Framing",
      "Adjustable Height": "0 - 200 mm Telescopic Feet",
      "Acoustic Class": "Class 1 Silent Fill (under 18 dB)",
      "Tank Capacity": "9 Liters Max Reserve"
    }
  },

  // ACCESSORIES
  {
    id: "prod-acc-01",
    name: "Linear Heated Towel Warmer Rail",
    slug: "linear-heated-towel-warmer-rail",
    category: "Accessories",
    categorySlug: "accessories",
    subcategory: "Towel Warmers",
    tagline: "Hardwired stainless steel dry electric towel warmer with timer",
    description: "Enjoy warm, dry fluffy towels after every bath. Features 8 evenly spaced horizontal heating bars, low energy dry wire heating technology, and an integrated 2/4/6 hour touch timer switch.",
    price: 16499,
    originalPrice: 19999,
    sku: "PC-ACC-TOW-01",
    isFeatured: true,
    finishes: ["Matte Black", "Brushed Gold", "Chrome"],
    images: [
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "800mm (H) x 500mm (W) x 100mm (Depth)",
    material: "Grade 304 Stainless Steel",
    warranty: "5 Years Electrical & Finish Guarantee",
    rating: 4.9,
    reviewsCount: 27,
    features: [
      "Rapid 10-minute warm up to safe 55°C constant temperature",
      "Low 85W energy consumption — costs pennies to run",
      "IP55 waterproof rating for safe installation near bathtubs/showers",
      "Concealed in-wall wiring kit or exposed plug-in option included"
    ],
    specs: {
      "Power Rating": "85 Watts / 230V AC",
      "Bars Count": "8 Round Horizontal Crossbars",
      "IP Rating": "IP55 Splashproof",
      "Finish": "PVD Electroplated"
    }
  },

  // WATER HEATERS
  {
    id: "prod-heater-01",
    name: "ThermaSmart 25L Digital Storage Water Heater",
    slug: "thermasmart-25l-digital-water-heater",
    category: "Water Heaters",
    categorySlug: "water-heaters",
    subcategory: "Storage Heaters",
    tagline: "Titanium enamelled tank with digital smart temperature display",
    description: "Built to withstand high pressure up to 8 Bar in high-rise luxury apartments. Features glass-lined incoloy heating elements, smart timer programming, and thick high-density PUF insulation.",
    price: 15499,
    originalPrice: 18999,
    sku: "PC-HTR-THM-01",
    isFeatured: false,
    finishes: ["White Ceramic", "Matte Black"],
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&q=80&w=1000"
    ],
    dimensions: "440mm (Dia) x 510mm (H)",
    material: "Titanium Glass Enamel Steel Inner Tank",
    warranty: "7 Years Tank, 3 Years Element, 2 Years Comprehensive",
    rating: 4.8,
    reviewsCount: 39,
    features: [
      "BEE 5-Star rated energy efficiency with eco-smart mode",
      "8 Bar rated pressure suitable for high-rise buildings and pressure pumps",
      "Digital LED temp display with wireless remote control",
      "Sacrificial magnesium anode rod protects against hard water scale"
    ],
    specs: {
      "Capacity": "25 Liters",
      "Power Wattage": "2000W / 230V 50Hz",
      "Max Pressure": "8.0 Bar (0.8 MPa)",
      "Thermostat Type": "Capillary High-Precision Cut-off"
    }
  }
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}
