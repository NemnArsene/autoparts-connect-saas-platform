// ============================================================
// BRAND & PART TYPES
// Extracted from apps/web/src/data/seed.ts
// ============================================================

export type Brand =
  | 'Toyota' | 'Honda' | 'BMW' | 'Mercedes' | 'Audi'
  | 'Ford' | 'Nissan' | 'Peugeot' | 'Hyundai' | 'Kia';

export interface Part {
  id: string;
  ref: string;
  name: string;
  category: string;
  brand: Brand;
  compatibleModels: string[];
  price: number;
  oldPrice?: number;
  stock: number;
  supplierId: string;
  supplierName: string;
  image: string;
  rating: number;
  reviews: number;
  warranty: string;
  inStock: boolean;
  isNew: boolean;
  isPromo: boolean;
}

/** Filters accepted by the part search hook and service layer */
export interface PartFilters {
  query?: string;
  categories?: string[];
  brands?: Brand[];
  priceMax?: number;
  inStockOnly?: boolean;
  sort?: 'pop' | 'price-asc' | 'price-desc' | 'rating';
}
