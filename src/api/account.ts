import type { Customer, Order, User } from "../types";
import { http } from "./http";

interface Session {
  token: string;
  user: User;
}

export const login = (v: { email: string; password: string }) =>
  http<Session>("/api/auth/login", { method: "POST", body: v });

export const register = (v: { name: string; email: string; password: string }) =>
  http<Session>("/api/auth/register", { method: "POST", body: v });

export const logout = () => http<void>("/api/auth/logout", { method: "POST", body: {} });

export interface NewOrder {
  customer: Customer;
  items: { productId: number; size: string; quantity: number }[];
}

export const placeOrder = (order: NewOrder) => http<Order>("/api/orders", { method: "POST", body: order });
export const fetchOrders = () => http<Order[]>("/api/orders");
export const fetchOrder = (id: string) => http<Order>(`/api/orders/${id}`);
