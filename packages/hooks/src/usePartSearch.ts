import { useMemo } from 'react';
import type { Part, PartFilters } from '@autoparts/models';

export function usePartSearch(parts: Part[], filters: PartFilters) {
  return useMemo(() => {
    let result = [...parts];

    // 1. Search query
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.ref.toLowerCase().includes(q) ||
          p.compatibleModels.some((m) => m.toLowerCase().includes(q))
      );
    }

    // 2. Categories
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter((p) => filters.categories!.includes(p.category));
    }

    // 3. Brands
    if (filters.brands && filters.brands.length > 0) {
      result = result.filter((p) => filters.brands!.includes(p.brand));
    }

    // 4. Max Price
    if (filters.priceMax !== undefined) {
      result = result.filter((p) => p.price <= filters.priceMax!);
    }

    // 5. In Stock
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // 6. Sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'pop':
        default:
          result.sort((a, b) => b.reviews - a.reviews);
          break;
      }
    }

    return result;
  }, [parts, filters]);
}
