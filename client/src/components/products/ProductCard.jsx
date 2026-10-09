import { PlusOutlined } from "@ant-design/icons";
import { App as AntApp, Button } from "antd";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";
import { formatCurrency } from "../../utils/format";
import ProductImage from "./ProductImage";

const ProductCard = ({ product }) => {
  const { message } = AntApp.useApp();
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addProduct(product));
    message.success({
      content: `${product.title} sepete eklendi.`,
      key: "cart-add",
      duration: 1.5,
    });
  };

  return (
    <article className="surface group flex flex-col overflow-hidden transition-shadow hover:shadow-raised">
      <ProductImage
        src={product.img}
        alt={product.title}
        className="aspect-[4/3] w-full"
      />
      <div className="flex flex-1 flex-col p-3">
        <p className="text-xs font-medium text-slate-500">{product.category}</p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900">
          {product.title}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="tabular text-base font-semibold text-slate-900">
            {formatCurrency(product.price)}
          </span>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            aria-label={`${product.title} ürününü sepete ekle`}
          />
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
