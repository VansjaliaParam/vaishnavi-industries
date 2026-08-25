// Product catalog for Vaishnavi Industries.
//
// Three top-level categories: Bath Accessories, Door Closer, Handles.
// Bath Accessories span three series - Afyon (AF-), Curio (CU-), Opula (OP-).
// Handles are grouped by type - Door Knobs, Wardrobe Handles, Zinc Handles.
// Product names come from the source folder each image was supplied in.
// Images live flat under /public/catalog/<modelNo>.jpg (model numbers are unique).

export type Category = "Bath Accessories" | "Door Closer" | "Handles";

export type Series = "Afyon" | "Curio" | "Opula";

export type HandleType = "Door Knobs" | "Wardrobe Handles" | "Zinc Handles";

// Secondary axis used by the catalog's contextual filter:
// series for Bath Accessories, handle type for Handles.
export type Collection = Series | HandleType;

export interface Product {
  id: string;
  name: string;
  modelNo: string;
  category: Category;
  /** Series (bath) or handle type - the product's collection within its category. */
  collection?: Collection;
  image: string;
  blurb?: string;
  featured?: boolean;
}

const img = (modelNo: string) => `/catalog/${modelNo}.jpg`;

// Bath Accessories - one entry per supplied image, series inferred from prefix.
type BathSpec = [name: string, models: [string, Series][]];

const BATH: BathSpec[] = [
  ["Soap Dish", [["AF-103", "Afyon"], ["CU-203", "Curio"], ["OP-303", "Opula"]]],
  ["Tumbler Holder", [["AF-106", "Afyon"], ["AF-119", "Afyon"], ["CU-206", "Curio"], ["OP-306", "Opula"]]],
  ["Double Soap Dish", [["AF-108", "Afyon"], ["CU-208", "Curio"], ["OP-308", "Opula"]]],
  ["Soap + Tumbler", [["AF-109", "Afyon"], ["CU-209", "Curio"], ["OP-309", "Opula"]]],
  ["Liquid Soap Dispenser", [["AF-107", "Afyon"], ["CU-207", "Curio"], ["OP-307", "Opula"]]],
  ["Napkin Ring", [["AF-104", "Afyon"], ["CU-204", "Curio"], ["OP-304", "Opula"], ["OP-320", "Opula"]]],
  ["Paper Holder", [["AF-112", "Afyon"], ["CU-212", "Curio"], ["OP-312", "Opula"]]],
  ["Robe Hook", [["AF-105", "Afyon"], ["CU-205", "Curio"], ["OP-305", "Opula"]]],
  ["Towel Rod", [["AF-102", "Afyon"], ["CU-202", "Curio"], ["OP-302", "Opula"], ["OP-321", "Opula"]]],
  ["Towel Rack", [["AF-101", "Afyon"], ["CU-201", "Curio"], ["OP-301", "Opula"]]],
  ["Soap + Liquid Dispenser", [["AF-110", "Afyon"], ["CU-210", "Curio"]]],
  ["Tumbler + Liquid Dispenser", [["AF-111", "Afyon"], ["CU-211", "Curio"], ["OP-310", "Opula"]]],
];

const bathProducts: Product[] = BATH.flatMap(([name, models]) =>
  models.map(([modelNo, series]) => ({
    id: modelNo.toLowerCase(),
    name,
    modelNo,
    category: "Bath Accessories" as const,
    collection: series,
    image: img(modelNo),
    blurb: `${name} from the ${series} series - SS-304 stainless steel, precision-finished.`,
  }))
);

const doorCloserProducts: Product[] = ["VD-101", "VD-102", "VD-103", "VD-104", "VD-105"].map(
  (modelNo) => ({
    id: modelNo.toLowerCase(),
    name: "Door Closer",
    modelNo,
    category: "Door Closer" as const,
    image: img(modelNo),
    blurb: "Hydraulic door closer engineered for smooth, controlled closing.",
  })
);

type HandleSpec = [type: HandleType, models: string[]];

const HANDLES: HandleSpec[] = [
  ["Door Knobs", ["N-106", "N-108", "N-109", "TP_09923"]],
  ["Wardrobe Handles", ["AL-62", "AL-63", "AL-64", "AL-66", "AL-68", "AL-70", "AL-71", "AL-72", "AL-73", "AL-74"]],
  ["Zinc Handles", ["V-1002", "V-1003", "V-1004", "V-1005", "V-1007", "V-1008"]],
];

const handleProducts: Product[] = HANDLES.flatMap(([type, models]) =>
  models.map((modelNo) => ({
    id: modelNo.toLowerCase(),
    name: type,
    modelNo,
    category: "Handles" as const,
    collection: type,
    image: img(modelNo),
    blurb: `${type} - machined and finished for a lasting, tactile grip.`,
  }))
);

// A hand-picked spread used for the home-page reel and highlights.
const FEATURED_MODELS = new Set([
  "AF-101", "CU-201", "OP-301", "AF-107", "OP-307", "AF-112",
  "OP-320", "VD-101", "VD-103", "AL-62", "AL-70", "V-1002", "V-1005", "N-106",
]);

export const products: Product[] = [
  ...bathProducts,
  ...doorCloserProducts,
  ...handleProducts,
].map((p) => (FEATURED_MODELS.has(p.modelNo) ? { ...p, featured: true } : p));

export const categories: Category[] = ["Bath Accessories", "Door Closer", "Handles"];

export const seriesList: Series[] = ["Afyon", "Curio", "Opula"];

export const handleTypes: HandleType[] = ["Door Knobs", "Wardrobe Handles", "Zinc Handles"];

/** The contextual second filter for a category: series for bath, type for handles. */
export function collectionsForCategory(
  cat: Category | "All"
): { label: string; options: Collection[] } {
  if (cat === "Bath Accessories") return { label: "Series", options: seriesList };
  if (cat === "Handles") return { label: "Type", options: handleTypes };
  return { label: "", options: [] };
}

export const getFeatured = () => products.filter((p) => p.featured);

export const getByCategory = (cat: Category) =>
  products.filter((p) => p.category === cat);

export const getById = (id: string) => products.find((p) => p.id === id);

export const filterProducts = ({
  category,
  collection,
  search,
}: {
  category?: Category | "All";
  collection?: Collection | "All";
  search?: string;
}) => {
  let list = products;
  if (category && category !== "All") list = list.filter((p) => p.category === category);
  if (collection && collection !== "All")
    list = list.filter((p) => p.collection === collection);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.modelNo.toLowerCase().includes(q) ||
        (p.collection?.toLowerCase().includes(q) ?? false)
    );
  }
  return list;
};
