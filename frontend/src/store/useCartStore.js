import { create } from "zustand";
import { persist } from "zustand/middleware";  // ← add this

const useCartStore = create(
  persist(                                      // ← wrap with persist
    (set, get) => ({
      // ─── STATE ─────────────────────────────
      cart: [],

      // ─── ACTIONS ───────────────────────────

      addToCart: (product) => {
        const existingProduct = get().cart.find(
          (item) => item.id === product.id
        );

        if (existingProduct) {
          set((state) => ({
            cart: state.cart.map((item) =>
              item.id === product.id
                ? { ...item, qty: item.qty + (product.qty ?? 1) }
                : item
            ),
          }));
          return;
        }

        set((state) => ({
          cart: [...state.cart, { ...product, qty: product.qty ?? 1 }],
        }));
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      increaseQty: (id) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item
          ),
        }));
      },

      decreaseQty: (id) => {
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === id ? { ...item, qty: item.qty - 1 } : item
            )
            .filter((item) => item.qty > 0),
        }));
      },

      setQty: (id, qty) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, qty } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      // ─── DERIVED VALUES ────────────────────

      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.qty,
          0
        );
      },

      getCartCount: () => {
        return get().cart.reduce(
          (total, item) => total + item.qty,
          0
        );
      },
    }),
    {
      name: "cart-storage",  // ← key in localStorage
    }
  )
);

export default useCartStore;