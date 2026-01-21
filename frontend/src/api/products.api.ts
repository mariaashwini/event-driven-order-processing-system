import { api } from './http';
import type { Product } from '../types/products';

/**
 * Get all products
 */
export const getProducts = (): Promise<Product[]> => {
  return api('/products');
};
