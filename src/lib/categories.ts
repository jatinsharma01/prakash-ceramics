import { Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "cat-faucets",
    name: "Faucets",
    slug: "faucets",
    shortDescription: "Beautiful mixers for basins, showers and bathtubs.",
    description: "Beautiful mixers for basins, showers and bathtubs.",
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760648/parkash-ceramics/faucets.jpg",
    featured: true,
    itemCount: 42,
    tags: ["Basin Mixers", "Wall Mount", "Tall Basin", "Bath Mixers"]
  },
  {
    id: "cat-showers",
    name: "Showers",
    slug: "showers",
    shortDescription: "Rain showers, hand showers and complete shower systems.",
    description: "Rain showers, hand showers and complete shower systems.",
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760665/parkash-ceramics/showers.jpg",
    featured: true,
    itemCount: 38,
    tags: ["Rain Showers", "Hand Showers", "Shower Systems", "Overhead Cascade"]
  },
  {
    id: "cat-cloud",
    name: "Cloud",
    slug: "cloud",
    shortDescription: "Smart shower systems made for a better shower every day.",
    description: "Smart shower systems made for a better shower every day.",
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760644/parkash-ceramics/cloud.jpg",
    featured: true,
    itemCount: 16,
    tags: ["Smart Controls", "Rain Shower", "Body Jets", "Steam"]
  },
  {
    id: "cat-sanitaryware",
    name: "Sanitaryware",
    slug: "sanitaryware",
    shortDescription: "Toilets, basins and bathroom pieces made for modern homes.",
    description: "Toilets, basins and bathroom pieces made for modern homes.",
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760655/parkash-ceramics/sanitaryware.jpg",
    featured: true,
    itemCount: 54,
    tags: ["Wall-Hung WCs", "Tabletop Basins", "Vanity Sinks", "Bidet Suites"]
  },
  {
    id: "cat-thermostatic",
    name: "Thermostatic Mixers",
    slug: "thermostatic-mixers",
    shortDescription: "Instantaneous thermal balance with anti-scald safety mechanisms.",
    description: "Maintains your desired temperature within ±0.5°C using rapid bi-metallic wax cartridges with child-safe 38°C safety locks.",
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760671/parkash-ceramics/thermostaticmixers.jpg",
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
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760653/parkash-ceramics/heater.jpg",
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
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760673/parkash-ceramics/whirpoolbathtub.jpg",
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
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760643/parkash-ceramics/bathtub.jpg",
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
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760668/parkash-ceramics/spas.jpg",
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
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760658/parkash-ceramics/saunas.jpg",
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
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760660/parkash-ceramics/shower.jpg",
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
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760670/parkash-ceramics/steambath.jpg",
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
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760662/parkash-ceramics/showerpanels.jpg",
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
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760651/parkash-ceramics/flusing.jpg",
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
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760642/parkash-ceramics/accessries.jpg",
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
    image: "https://res.cloudinary.com/dtk1pspib/image/upload/v1788760666/parkash-ceramics/showervalves.jpg",
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
