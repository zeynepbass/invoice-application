import { useSelector } from "react-redux";
import { selectCartTotals, TAX_RATE } from "../../redux/cartSlice";
import { formatCurrency } from "../../utils/format";

const CartSummary = () => {
  const { subTotal, tax, total } = useSelector(selectCartTotals);

  return (
    <dl className="tabular space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-slate-600">Ara toplam</dt>
        <dd className="font-medium">{formatCurrency(subTotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-600">KDV (%{TAX_RATE})</dt>
        <dd className="font-medium">{formatCurrency(tax)}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t pt-3">
        <dt className="text-base font-semibold">Genel toplam</dt>
        <dd className="text-xl font-semibold text-brand-800">
          {formatCurrency(total)}
        </dd>
      </div>
    </dl>
  );
};

export default CartSummary;
