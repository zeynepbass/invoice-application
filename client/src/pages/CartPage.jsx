import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Empty, Popconfirm } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemRow from "../components/cart/CartItemRow";
import CartSummary from "../components/cart/CartSummary";
import CreateBillModal from "../components/cart/CreateBillModal";
import PageHeader from "../components/common/PageHeader";
import { reset, selectCartItems } from "../redux/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Sepet" />
        <Empty className="surface py-20" description="Sepetinizde ürün yok.">
          <Link to="/">
            <Button type="primary">Ürünlere göz at</Button>
          </Link>
        </Empty>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Sepet"
        description="Ürünleri kontrol edin, ardından siparişi tamamlayın."
        actions={
          <Link to="/">
            <Button icon={<ArrowLeftOutlined />}>Alışverişe devam et</Button>
          </Link>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="surface" aria-labelledby="cart-items-title">
          <header className="flex items-center justify-between border-b px-5 py-4">
            <h2 id="cart-items-title" className="text-base font-semibold">
              Ürünler
            </h2>
            <Popconfirm
              title="Sepet temizlensin mi?"
              okText="Temizle"
              cancelText="Vazgeç"
              okButtonProps={{ danger: true }}
              onConfirm={() => dispatch(reset())}
            >
              <Button type="link" danger size="small">
                Sepeti temizle
              </Button>
            </Popconfirm>
          </header>
          <ul className="divide-y divide-slate-200 px-5">
            {items.map((item) => (
              <CartItemRow key={item._id} item={item} />
            ))}
          </ul>
        </section>

        <section
          className="surface p-5 lg:sticky lg:top-8"
          aria-labelledby="order-summary-title"
        >
          <h2 id="order-summary-title" className="mb-4 text-base font-semibold">
            Sipariş özeti
          </h2>
          <CartSummary />
          <Button
            type="primary"
            size="large"
            block
            className="mt-5"
            onClick={() => setIsModalOpen(true)}
          >
            Siparişi tamamla
          </Button>
        </section>
      </div>

      <CreateBillModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default CartPage;
