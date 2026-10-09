import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Empty, Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset, selectCartCount, selectCartItems } from "../../redux/cartSlice";
import CartItemRow from "./CartItemRow";
import CartSummary from "./CartSummary";

const CartPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const isEmpty = items.length === 0;

  return (
    <section
      className="surface flex max-h-[calc(100vh-4rem)] flex-col"
      aria-labelledby="cart-panel-title"
    >
      <header className="flex items-center justify-between border-b px-5 py-4">
        <h2 id="cart-panel-title" className="text-base font-semibold">
          Sepet
          {count > 0 && (
            <span className="ml-2 text-sm font-normal text-slate-500">
              {count} ürün
            </span>
          )}
        </h2>
        <Popconfirm
          title="Sepet temizlensin mi?"
          okText="Temizle"
          cancelText="Vazgeç"
          okButtonProps={{ danger: true }}
          onConfirm={() => dispatch(reset())}
          disabled={isEmpty}
        >
          <Button type="link" danger size="small" disabled={isEmpty}>
            Temizle
          </Button>
        </Popconfirm>
      </header>

      {isEmpty ? (
        <Empty
          className="px-5 py-10"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Sepetiniz boş. Eklemek için bir ürün seçin."
        />
      ) : (
        <ul className="flex-1 divide-y divide-slate-200 overflow-y-auto px-5">
          {items.map((item) => (
            <CartItemRow key={item._id} item={item} />
          ))}
        </ul>
      )}

      <footer className="border-t px-5 py-4">
        <CartSummary />
        <Button
          type="primary"
          size="large"
          block
          className="mt-4"
          icon={<ShoppingCartOutlined />}
          disabled={isEmpty}
          onClick={() => navigate("/cart")}
        >
          Siparişe devam et
        </Button>
      </footer>
    </section>
  );
};

export default CartPanel;
