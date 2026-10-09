import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: number;
  size: string;
  quantity: number;
  name: string;
  brand: string;
  price: number;
  colorHex: string;
}

interface CartState {
  lines: CartLine[];
  add: (item: Omit<CartLine, "quantity">) => void;
  setQuantity: (productId: number, size: string, quantity: number) => void;
  remove: (productId: number, size: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

const MAX_QTY = 10;
const same = (l: CartLine, productId: number, size: string) => l.productId === productId && l.size === size;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (item) =>
        set((state) => {
          const existing = state.lines.find((l) => same(l, item.productId, item.size));
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l === existing ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + 1) } : l,
              ),
            };
          }
          return { lines: [...state.lines, { ...item, quantity: 1 }] };
        }),
      setQuantity: (productId, size, quantity) =>
        set((state) => ({
          lines:
            quantity < 1
              ? state.lines.filter((l) => !same(l, productId, size))
              : state.lines.map((l) =>
                  same(l, productId, size) ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l,
                ),
        })),
      remove: (productId, size) =>
        set((state) => ({ lines: state.lines.filter((l) => !same(l, productId, size)) })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    }),
    { name: "linea-cart" },
  ),
);
