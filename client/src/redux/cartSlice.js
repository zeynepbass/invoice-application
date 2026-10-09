import { createSelector, createSlice } from "@reduxjs/toolkit";

export const TAX_RATE = 8;

const STORAGE_KEY = "cart";

const loadCartItems = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored?.cartItems) ? stored.cartItems : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Storage can be unavailable (private mode, quota); the cart still works in memory.
  }
};

const findItem = (state, id) =>
  state.cartItems.find((item) => item._id === id);

const cartSlice = createSlice({
  name: "cart",
  initialState: () => ({ cartItems: loadCartItems() }),
  reducers: {
    addProduct: (state, { payload }) => {
      const existing = findItem(state, payload._id);
      if (existing) {
        existing.quantity += 1;
        return;
      }
      state.cartItems.push({
        _id: payload._id,
        title: payload.title,
        img: payload.img,
        price: payload.price,
        category: payload.category,
        quantity: 1,
      });
    },
    increase: (state, { payload }) => {
      const item = findItem(state, payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrease: (state, { payload }) => {
      const item = findItem(state, payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeItem: (state, { payload }) => {
      state.cartItems = state.cartItems.filter((item) => item._id !== payload);
    },
    reset: (state) => {
      state.cartItems = [];
    },
  },
});

export const selectCartItems = (state) => state.cart.cartItems;

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((count, item) => count + item.quantity, 0)
);

export const selectCartTotals = createSelector(selectCartItems, (items) => {
  const subTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = (subTotal * TAX_RATE) / 100;
  return { subTotal, tax, total: subTotal + tax };
});

export const { addProduct, increase, decrease, removeItem, reset } =
  cartSlice.actions;
export default cartSlice.reducer;
