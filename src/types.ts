export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number | null;
  color: string;
  colorHex: string;
  sizes: string[];
  rating: number;
  description: string;
}

export interface ProductList {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  categories: string[];
}

export interface ProductFilters {
  q: string;
  category: string;
  size: string;
  maxPrice: string;
  sort: string;
  page: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Customer {
  name: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

export interface OrderLine {
  productId: number;
  name: string;
  brand: string;
  colorHex: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: string;
  customer: Customer;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
}
