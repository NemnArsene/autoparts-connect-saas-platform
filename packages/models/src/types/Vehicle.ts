// ============================================================
// VEHICLE TYPE
// ============================================================

import type { Brand } from './Part';

export interface Vehicle {
  id: string;
  brand: Brand;
  model: string;
  year: number;
  plate: string;
  vin?: string;
  color: string;
}
