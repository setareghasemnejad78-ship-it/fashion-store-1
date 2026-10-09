import type { Product, ProductFilters, ProductList } from "../types";
import { http } from "./http";

export function fetchProducts(filters: ProductFilters): Promise<ProductList> {
  const params = new URLSearchParams();
  (["q", "category", "size", "maxPrice", "sort"] as const).forEach((key) => {
    if (filters[key]) params.set(key, filters[key]);
  });
  if (filters.page > 1) params.set("page", String(filters.page));
  return http<ProductList>(`/api/products?${params}`);
}

export const fetchProduct = (id: string) => http<Product>(`/api/products/${id}`);
