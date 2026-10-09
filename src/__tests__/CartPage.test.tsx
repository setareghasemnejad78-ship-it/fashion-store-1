import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CartPage from "../pages/CartPage";
import { useCart } from "../store/cart";

const line = { productId: 9, size: "M", name: "Heavyweight Tee", brand: "Basisco", price: 35, colorHex: "#eee", quantity: 1 };

const renderCart = () => render(<MemoryRouter><CartPage /></MemoryRouter>);

describe("CartPage", () => {
  beforeEach(() => useCart.setState({ lines: [] }));

  it("shows an empty state", () => {
    renderCart();
    expect(screen.getByText("Your bag is empty")).toBeInTheDocument();
  });

  it("changes quantity, unlocks free shipping and removes lines", async () => {
    useCart.setState({ lines: [line] });
    renderCart();
    expect(screen.getByText(/more for free shipping/)).toBeInTheDocument();

    const plus = screen.getByLabelText("Increase quantity of Heavyweight Tee");
    await userEvent.click(plus);
    await userEvent.click(plus);
    expect(screen.getByTestId("qty-9-M")).toHaveTextContent("3");
    expect(screen.getByText("Free")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(screen.getByText("Your bag is empty")).toBeInTheDocument();
  });
});
