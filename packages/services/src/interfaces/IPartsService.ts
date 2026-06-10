import type { Part, PartFilters } from '@autoparts/models';

export interface IPartsService {
  getAll(filters?: PartFilters): Promise<Part[]>;
  getById(id: string): Promise<Part | null>;
  search(query: string): Promise<Part[]>;
}
