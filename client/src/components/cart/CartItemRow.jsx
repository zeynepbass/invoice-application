import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useDispatch } from "react-redux";
import { decrease, increase, removeItem } from "../../redux/cartSlice";
import { formatCurrency } from "../../utils/format";
import ProductImage from "../products/ProductImage";
import QuantityStepper from "./QuantityStepper";

const CartItemRow = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <li className="flex items-center gap-3 py-3">
      <ProductImage src={item.img} className="h-14 w-14 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">
          {item.title}
        </p>
        <p className="tabular text-xs text-slate-500">
          {formatCurrency(item.price)} / adet
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <QuantityStepper
            value={item.quantity}
            label={item.title}
            onDecrease={() => dispatch(decrease(item._id))}
            onIncrease={() => dispatch(increase(item._id))}
          />
          <span className="tabular text-sm font-semibold text-slate-900">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
      <Popconfirm
        title="Ürün sepetten çıkarılsın mı?"
        okText="Çıkar"
        cancelText="Vazgeç"
        okButtonProps={{ danger: true }}
        onConfirm={() => dispatch(removeItem(item._id))}
      >
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          aria-label={`${item.title} ürününü sepetten çıkar`}
        />
      </Popconfirm>
    </li>
  );
};

export default CartItemRow;
