import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types";

interface WishlistState {
  items: Product[];
  toggle: (product: Product) => void;
  has: (id: number) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) =>
        set((state) => ({
          items: state.items.some((p) => p.id === product.id)
            ? state.items.filter((p) => p.id !== product.id)
            : [...state.items, product],
        })),
      has: (id) => get().items.some((p) => p.id === id),
    }),
    { name: "linea-wishlist" },
  ),
);
