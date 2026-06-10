// ============================================================
// SUPPLIER TYPE
// ============================================================

export interface Supplier {
  id: string;
  name: string;
  city: string;
  country: string;
  rating: number;
  validated: boolean;
  productsCount: number;
  phone: string;
  email: string;
  logo: string;
}
