export * from './interfaces/IPartsService';
export * from './mock/MockPartsService';

// Default exports for the app to use
import { MockPartsService } from './mock/MockPartsService';

export const partsService = new MockPartsService();
