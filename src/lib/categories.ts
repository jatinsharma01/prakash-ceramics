import { Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "cat-faucets",
    name: "Faucets",
    slug: "faucets",
    shortDescription: "Architectural precision & water-saving elegance for basins and countertops.",
    description: "Designed with Swiss-engineered ceramic cartridges, PVD surface coatings, and aerated laminar water flow for lasting luxury.",
    image: "/images/faucets.png",
    featured: true,
    itemCount: 42,
    tags: ["Basin Mixers", "Wall Mount", "Tall Basin", "Sensor Faucets"]
  },
  {
    id: "cat-showers",
    name: "Showers",
    slug: "showers",
    shortDescription: "Immersive deluge, cascading rain, and multi-flow hydrotherapy systems.",
    description: "Experience revitalizing hydro-sensations with self-cleaning silicone nozzles, overhead rainfall plates, and mist spray technology.",
    image: "/images/showers.png",
    featured: true,
    itemCount: 38,
    tags: ["Rain Showers", "Overhead Cascade", "Hand Showers", "Body Jets"]
  },
  {
    id: "cat-cloud",
    name: "Cloud",
    slug: "cloud",
    shortDescription: "Next-generation smart showering & intelligent ambient wellness spaces.",
    description: "Digital touchscreen controls, customizable thermal routines, chromotherapy lighting, and whisper-quiet cloud steam dispersion.",
    image: "/images/cloud.png",
    featured: true,
    itemCount: 16,
    tags: ["Smart Controls", "Chromotherapy", "Aroma Cloud", "Memory Presets"]
  },
  {
    id: "cat-sanitaryware",
    name: "Sanitaryware",
    slug: "sanitaryware",
    shortDescription: "Sculptural ceramic washbasins, rimless WCs, and bidet suites.",
    description: "Crafted from fine vitreous china with ultra-hygienic nano-glaze finish, silent pneumatic flushing, and slimline soft-close seats.",
    image: "/images/sanitaryware.png",
    featured: true,
    itemCount: 54,
    tags: ["Wall-Hung WCs", "Tabletop Basins", "Vanity Sinks", "Bidet Toilets"]
  },
  {
    id: "cat-thermostatic",
    name: "Thermostatic Mixers",
    slug: "thermostatic-mixers",
    shortDescription: "Instantaneous thermal balance with anti-scald safety mechanisms.",
    description: "Maintains your desired temperature within ±0.5°C using rapid bi-metallic wax cartridges with child-safe 38°C safety locks.",
    image: "/images/thermostaticmixers.png",
    featured: false,
    itemCount: 22,
    tags: ["Concealed Thermostats", "Exposed Bar Mixers", "Digital Thermostats"]
  },
  {
    id: "cat-water-heaters",
    name: "Water Heaters",
    slug: "water-heaters",
    shortDescription: "High-efficiency storage and instant water heating units.",
    description: "Titanium-enamelled inner tanks, smart digital thermostats, energy-saving PUF insulation, and multi-layer corrosion protection.",
    image: "/images/heater.png",
    featured: false,
    itemCount: 18,
    tags: ["Digital Storage", "Instant Heaters", "Solar Integrated"]
  },
  {
    id: "cat-whirlpool",
    name: "Whirlpool Bathtubs",
    slug: "whirlpool-bathtubs",
    shortDescription: "Hydro-massage water jets and effervescent air-bubble relaxation.",
    description: "Custom positioned targeted back/foot jets, variable speed silent water pumps, inline heaters, and mood-enhancing LED light baths.",
    image: "/images/whirpoolbathtub.png",
    featured: true,
    itemCount: 14,
    tags: ["Hydro Jets", "Air Spa", "Inline Heater", "Dual Seater"]
  },
  {
    id: "cat-bathtubs",
    name: "Bath Tubs",
    slug: "bath-tubs",
    shortDescription: "Freestanding acrylic and cast-stone ergonomic soaking tubs.",
    description: "Sculpted organic silhouettes with thermal heat-retention walls, seamless overflow integration, and stain-resistant gloss finishes.",
    image: "/images/bathtub.png",
    featured: true,
    itemCount: 26,
    tags: ["Freestanding", "Solid Surface", "Oval Soakers", "Drop-In"]
  },
  {
    id: "cat-spas",
    name: "Spas",
    slug: "spas",
    shortDescription: "Commercial and residential outdoor/indoor wellness hydro-spas.",
    description: "Multi-person ergonomic therapy lounges, ozone sanitation, thermal covers, and comprehensive all-weather cabinet engineering.",
    image: "/images/spas.png",
    featured: false,
    itemCount: 12,
    tags: ["Outdoor Hot Tubs", "Swim Spas", "Plunge Pools", "Multi-Seater"]
  },
  {
    id: "cat-saunas",
    name: "Saunas",
    slug: "saunas",
    shortDescription: "Finnish dry heat and full-spectrum infrared wellness cabins.",
    description: "Built using premium Canadian Hemlock and Red Cedar wood with Harvia heaters, tempered glass doors, and ergonomic seating.",
    image: "/images/saunas.png",
    featured: true,
    itemCount: 10,
    tags: ["Finnish Traditional", "Infrared Cabins", "Custom Built-in"]
  },
  {
    id: "cat-shower-enclosures",
    name: "Shower Enclosures",
    slug: "shower-enclosures",
    shortDescription: "Frameless 10mm toughened glass walk-ins, sliding & pivot enclosures.",
    description: "Constructed with nano-coated anti-limescale glass, solid brass hinges, magnetic seals, and ultra-slim architectural floor profiles.",
    image: "/images/shower.png",
    featured: false,
    itemCount: 30,
    tags: ["Frameless Walk-in", "Sliding Cubicles", "Corner Enclosures"]
  },
  {
    id: "cat-steam-bath",
    name: "Steam Bath Solutions",
    slug: "steam-bath-solutions",
    shortDescription: "High-output commercial & private residential steam generators.",
    description: "Rapid steam production in 60 seconds, automated descaling cycles, aromatherapy essence dispensers, and waterproof digital touch keypads.",
    image: "/images/steambath.png",
    featured: false,
    itemCount: 15,
    tags: ["Steam Generators", "Steam Doors", "Aromatherapy Modules"]
  },
  {
    id: "cat-shower-panels",
    name: "Shower Panels",
    slug: "shower-panels",
    shortDescription: "All-in-one stainless steel & glass hydro-massage shower columns.",
    description: "Integrated overhead deluge shower, multi-directional body jets, handheld wand, and built-in brass thermostatic controls.",
    image: "/images/showerpanels.png",
    featured: false,
    itemCount: 20,
    tags: ["Stainless Steel", "Tempered Glass", "Multi-Jet Columns"]
  },
  {
    id: "cat-flushing-systems",
    name: "Flushing Systems",
    slug: "flushing-systems",
    shortDescription: "Concealed cistern frames, pneumatic actuators, and electronic sensor plates.",
    description: "Space-saving in-wall cisterns tested to 400kg load capacity, acoustic insulation for silent refills, and dual-flush water efficiency.",
    image: "/images/flusing.png",
    featured: false,
    itemCount: 24,
    tags: ["Concealed Cisterns", "Touchless Sensor Plates", "Dual Flush Actuators"]
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    shortDescription: "Designer towel rails, heated warmers, soap dispensers, and robe hooks.",
    description: "Solid brass construction with identical PVD finish matching across faucets and shower systems for total aesthetic harmony.",
    image: "/images/accessries.png",
    featured: false,
    itemCount: 65,
    tags: ["Heated Towel Bars", "Brass Hooks", "Tumbler Holders", "Glass Shelves"]
  },
  {
    id: "cat-diverters",
    name: "Diverters & Shower Valves",
    slug: "diverters-shower-valves",
    shortDescription: "High-flow multi-outlet concealed diverters and mixing cartridges.",
    description: "Precision engineered brass concealed bodies with cartridge longevity tested over 500,000 operational cycles.",
    image: "/images/showervalves.png",
    featured: false,
    itemCount: 28,
    tags: ["3-Outlet Diverters", "Concealed Bodies", "Thermostatic Trims"]
  }
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug);
}

export function getAllCategories(): Category[] {
  return CATEGORIES;
}

export function getFeaturedCategories(): Category[] {
  return CATEGORIES.filter((cat) => cat.featured);
}
