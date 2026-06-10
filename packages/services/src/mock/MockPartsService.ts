import type { IPartsService } from '../interfaces/IPartsService';
import type { Part, PartFilters } from '@autoparts/models';
import { PARTS } from '@autoparts/models';

export class MockPartsService implements IPartsService {
  async getAll(filters?: PartFilters): Promise<Part[]> {
    let result = [...PARTS];

    if (filters) {
      if (filters.categories?.length) {
        result = result.filter(p => filters.categories!.includes(p.category));
      }
      if (filters.brands?.length) {
        result = result.filter(p => filters.brands!.includes(p.brand));
      }
      if (filters.inStockOnly) {
        result = result.filter(p => p.inStock);
      }
      if (filters.priceMax !== undefined) {
        result = result.filter(p => p.price <= filters.priceMax!);
      }
    }

    return result;
  }

  async getById(id: string): Promise<Part | null> {
    return PARTS.find((p) => p.id === id) || null;
  }

  async search(query: string): Promise<Part[]> {
    const q = query.toLowerCase();
    return PARTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.ref.toLowerCase().includes(q)
    );
  }
}
