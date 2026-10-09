import { describe, it, expect } from "vitest";
import { products } from "./products.js";
import { priceOrder, validateCustomer, createOrder, ordersForUser } from "./orders.js";
import { register, login } from "./auth.js";

const customer = {
  name: "Mia Keller", email: "mia@example.com", address: "Hauptstr. 1",
  city: "Berlin", postcode: "10115", country: "Germany",
};

describe("priceOrder", () => {
  it("charges shipping below the free-shipping threshold", () => {
    const r = priceOrder([{ productId: 9, size: "M", quantity: 1 }], products); // Heavyweight Tee, 35
    expect(r.subtotal).toBe(35);
    expect(r.shipping).toBe(4.9);
    expect(r.total).toBe(39.9);
  });

  it("ships free from 100 and multiplies by quantity", () => {
    const r = priceOrder([{ productId: 9, size: "M", quantity: 3 }], products);
    expect(r.subtotal).toBe(105);
    expect(r.shipping).toBe(0);
  });

  it("ignores any price sent by the client", () => {
    const r = priceOrder([{ productId: 9, size: "M", quantity: 1, price: 0.01 }], products);
    expect(r.lines[0].unitPrice).toBe(35);
  });

  it("rejects empty bags, unknown products, bad sizes and bad quantities", () => {
    expect(() => priceOrder([], products)).toThrow();
    expect(() => priceOrder([{ productId: 999, size: "M", quantity: 1 }], products)).toThrow();
    expect(() => priceOrder([{ productId: 9, size: "XXL", quantity: 1 }], products)).toThrow(/Size/);
    expect(() => priceOrder([{ productId: 9, size: "M", quantity: 0 }], products)).toThrow(/Quantity/);
  });
});

describe("validateCustomer", () => {
  it("accepts complete details", () => expect(validateCustomer(customer)).toEqual({}));
  it("flags missing fields and bad email", () => {
    const errors = validateCustomer({ ...customer, city: "", email: "nope" });
    expect(errors).toEqual({ city: "Required", email: "Enter a valid email" });
  });
});

describe("orders and auth", () => {
  it("links an order to the signed-in user", () => {
    const { user } = register({ name: "Mia", email: "orders@example.com", password: "password123" });
    createOrder({ items: [{ productId: 9, size: "M", quantity: 1 }], customer }, products, user.id);
    expect(ordersForUser(user.id)).toHaveLength(1);
  });

  it("rejects duplicate registration and wrong passwords", () => {
    register({ name: "A", email: "dupe@example.com", password: "password123" });
    expect(() => register({ name: "A", email: "DUPE@example.com", password: "password123" })).toThrow(/already exists/);
    expect(() => login({ email: "dupe@example.com", password: "wrong-password" })).toThrow(/incorrect/);
    expect(login({ email: "dupe@example.com", password: "password123" }).token).toBeTruthy();
  });
});
