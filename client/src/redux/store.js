import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import cartReducer, { saveCart } from "./cartSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

let persistedCart = store.getState().cart;
store.subscribe(() => {
  const { cart } = store.getState();
  if (cart !== persistedCart) {
    persistedCart = cart;
    saveCart(cart);
  }
});

export default store;
