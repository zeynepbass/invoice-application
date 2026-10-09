import reducer, {
  addProduct,
  decrease,
  increase,
  removeItem,
  reset,
  selectCartCount,
  selectCartTotals,
} from "./cartSlice";

const apple = { _id: "1", title: "Elma", img: "/a.png", price: 10, category: "Meyve" };
const bread = { _id: "2", title: "Ekmek", img: "/b.png", price: 5.5, category: "Fırın" };

const build = (...actions) =>
  actions.reduce(reducer, { cartItems: [] });

describe("cartSlice", () => {
  it("adds a product once and bumps the quantity on repeat", () => {
    const state = build(addProduct(apple), addProduct(apple), addProduct(bread));

    expect(state.cartItems).toHaveLength(2);
    expect(state.cartItems[0].quantity).toBe(2);
  });

  it("never decreases below one", () => {
    const state = build(addProduct(apple), increase("1"), decrease("1"), decrease("1"));

    expect(state.cartItems[0].quantity).toBe(1);
  });

  it("removes a single item and resets the cart", () => {
    const removed = build(addProduct(apple), addProduct(bread), removeItem("1"));
    expect(removed.cartItems.map((item) => item._id)).toEqual(["2"]);

    expect(reducer(removed, reset()).cartItems).toEqual([]);
  });

  it("derives count and totals from the items", () => {
    const cart = build(addProduct(apple), addProduct(apple), addProduct(bread));
    const totals = selectCartTotals({ cart });

    expect(selectCartCount({ cart })).toBe(3);
    expect(totals.subTotal).toBeCloseTo(25.5);
    expect(totals.tax).toBeCloseTo(2.04);
    expect(totals.total).toBeCloseTo(27.54);
  });
});
