import { describe, it, expect } from "vitest";
import { products } from "./products.js";
import { queryProducts } from "./query.js";

describe("queryProducts", () => {
  it("filters by search text across name and brand", () => {
    const { items } = queryProducts(products, { q: "voss coat" });
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((p) => p.brand === "Atelier Voss" && p.category === "coats")).toBe(true);
  });

  it("filters by category, size and max price", () => {
    const { items } = queryProducts(products, { category: "shoes", size: "42", maxPrice: "100" });
    expect(items.map((p) => p.name)).toEqual(["Canvas Low Sneakers"]);
  });

  it("sorts by price ascending", () => {
    const { items } = queryProducts(products, { sort: "price-asc", pageSize: 48 });
    const prices = items.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("paginates and reports totals", () => {
    const page2 = queryProducts(products, { page: 2, pageSize: 10 });
    expect(page2.items).toHaveLength(products.length - 10);
    expect(page2.totalPages).toBe(2);
  });

  it("returns an empty list when nothing matches", () => {
    expect(queryProducts(products, { q: "zzzz" }).total).toBe(0);
  });
});
