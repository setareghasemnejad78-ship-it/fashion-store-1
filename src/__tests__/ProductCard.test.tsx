import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";

const base: Product = {
  id: 1,
  name: "Wool Overcoat",
  brand: "Atelier Voss",
  category: "coats",
  price: 249,
  originalPrice: null,
  color: "Charcoal",
  colorHex: "#3a3d42",
  sizes: ["M"],
  rating: 4.8,
  description: "",
};

const renderCard = (product: Product) =>
  render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>,
  );

describe("ProductCard", () => {
  it("shows name, brand and a link to the product page", () => {
    renderCard(base);
    expect(screen.getByText("Wool Overcoat")).toBeInTheDocument();
    expect(screen.getByText("Atelier Voss")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/product/1");
  });

  it("shows the sale tag and the original price when discounted", () => {
    renderCard({ ...base, price: 199, originalPrice: 249 });
    expect(screen.getByText("Sale")).toBeInTheDocument();
    expect(screen.getByText(/249/)).toBeInTheDocument();
  });

  it("does not show a sale tag for full-price items", () => {
    renderCard(base);
    expect(screen.queryByText("Sale")).not.toBeInTheDocument();
  });
});
