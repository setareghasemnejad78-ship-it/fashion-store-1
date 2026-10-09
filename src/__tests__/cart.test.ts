import { useCart } from "../store/cart";

const coat = { productId: 3, size: "M", name: "Wool Overcoat", brand: "Atelier Voss", price: 249, colorHex: "#3a3d42" };

describe("cart store", () => {
  beforeEach(() => useCart.setState({ lines: [] }));

  it("adds a new line with quantity 1", () => {
    useCart.getState().add(coat);
    expect(useCart.getState().lines).toEqual([{ ...coat, quantity: 1 }]);
  });

  it("increments quantity for the same product and size", () => {
    useCart.getState().add(coat);
    useCart.getState().add(coat);
    expect(useCart.getState().count()).toBe(2);
    expect(useCart.getState().lines).toHaveLength(1);
  });

  it("keeps different sizes as separate lines", () => {
    useCart.getState().add(coat);
    useCart.getState().add({ ...coat, size: "L" });
    expect(useCart.getState().lines).toHaveLength(2);
  });

  it("removes a line when quantity drops below 1 and caps quantity at 10", () => {
    useCart.getState().add(coat);
    useCart.getState().setQuantity(3, "M", 99);
    expect(useCart.getState().lines[0].quantity).toBe(10);
    useCart.getState().setQuantity(3, "M", 0);
    expect(useCart.getState().lines).toHaveLength(0);
  });

  it("calculates the subtotal", () => {
    useCart.getState().add(coat);
    useCart.getState().add(coat);
    expect(useCart.getState().subtotal()).toBe(498);
  });
});
