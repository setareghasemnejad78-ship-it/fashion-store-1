import { useWishlist } from "../store/wishlist";
import type { Product } from "../types";

const product: Product = {
  id: 1, name: "Tee", brand: "Basisco", category: "tops", price: 35, originalPrice: null,
  color: "White", colorHex: "#fff", sizes: ["M"], rating: 4, description: "",
};

describe("wishlist store", () => {
  beforeEach(() => useWishlist.setState({ items: [] }));

  it("toggles a product on and off", () => {
    useWishlist.getState().toggle(product);
    expect(useWishlist.getState().has(1)).toBe(true);
    useWishlist.getState().toggle(product);
    expect(useWishlist.getState().has(1)).toBe(false);
  });
});
