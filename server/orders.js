import crypto from "node:crypto";
import { HttpError } from "./errors.js";

export const FREE_SHIPPING_FROM = 100;
export const SHIPPING_FEE = 4.9;
const round = (n) => Math.round(n * 100) / 100;

/** Prices an order from the server catalog. Client-sent prices are never trusted. */
export function priceOrder(items, catalog) {
  if (!Array.isArray(items) || items.length === 0) throw new HttpError(400, "Your bag is empty.");

  const lines = items.map((item) => {
    const product = catalog.find((p) => p.id === Number(item.productId));
    if (!product) throw new HttpError(400, "One of the items is no longer available.");
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      throw new HttpError(400, "Quantity must be between 1 and 10.");
    }
    if (!product.sizes.includes(item.size)) {
      throw new HttpError(400, `Size ${item.size} is not available for ${product.name}.`);
    }
    return {
      productId: product.id,
      name: product.name,
      brand: product.brand,
      colorHex: product.colorHex,
      size: item.size,
      quantity,
      unitPrice: product.price,
    };
  });

  const subtotal = round(lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0));
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  return { lines, subtotal, shipping, total: round(subtotal + shipping) };
}

export function validateCustomer(customer = {}) {
  const errors = {};
  for (const field of ["name", "address", "city", "postcode", "country"]) {
    if (!String(customer[field] ?? "").trim()) errors[field] = "Required";
  }
  if (!/^\S+@\S+\.\S+$/.test(customer.email ?? "")) errors.email = "Enter a valid email";
  return errors;
}

const orders = [];

export function createOrder({ items, customer }, catalog, userId = null) {
  if (Object.keys(validateCustomer(customer)).length > 0) {
    throw new HttpError(400, "Please check your delivery details.");
  }
  const priced = priceOrder(items, catalog);
  const order = {
    id: `LN-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "Processing",
    userId,
    customer: Object.fromEntries(
      ["name", "email", "address", "city", "postcode", "country"].map((k) => [k, String(customer[k]).trim()]),
    ),
    ...priced,
  };
  orders.unshift(order);
  return order;
}

export const ordersForUser = (userId) => orders.filter((o) => o.userId === userId);
export const findOrder = (id) => orders.find((o) => o.id === id);
