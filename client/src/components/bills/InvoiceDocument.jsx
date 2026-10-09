import { forwardRef } from "react";
import { COMPANY } from "../../config/company";
import {
  formatCurrency,
  formatDate,
  getInvoiceNumber,
} from "../../utils/format";

const Party = ({ label, name, lines }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {label}
    </p>
    <p className="mt-2 font-semibold text-slate-900">{name}</p>
    {lines.map((line) => (
      <p key={line} className="text-sm text-slate-600">
        {line}
      </p>
    ))}
  </div>
);

const InvoiceDocument = forwardRef(({ bill }, ref) => {
  const taxRate = bill.subTotal
    ? Math.round((bill.tax / bill.subTotal) * 100)
    : 0;

  return (
    <article
      ref={ref}
      lang="tr"
      className="invoice-document rounded-xl border bg-white p-6 text-slate-900 sm:p-10"
    >
      <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="h-10 w-10" />
          <span className="text-xl font-semibold tracking-tight">
            {COMPANY.name}
          </span>
        </div>
        <div className="sm:text-right">
          <p className="text-2xl font-semibold tracking-tight">FATURA</p>
          <p className="tabular mt-1 text-sm text-slate-600">
            {getInvoiceNumber(bill)}
          </p>
        </div>
      </header>

      <section className="grid gap-6 py-6 sm:grid-cols-3">
        <Party
          label="Satıcı"
          name={COMPANY.name}
          lines={[COMPANY.address, COMPANY.phone, COMPANY.email]}
        />
        <Party
          label="Müşteri"
          name={bill.customerName}
          lines={[bill.customerPhoneNumber]}
        />
        <dl className="space-y-3 text-sm sm:text-right">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Fatura tarihi
            </dt>
            <dd className="mt-1 font-medium">{formatDate(bill.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ödeme yöntemi
            </dt>
            <dd className="mt-1 font-medium">{bill.paymentMode}</dd>
          </div>
        </dl>
      </section>

      <div className="overflow-x-auto">
        <table className="tabular w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-y bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-600">
              <th scope="col" className="w-10 px-3 py-2.5 font-semibold">
                #
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Ürün
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">
                Adet
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">
                Birim fiyat
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">
                Tutar
              </th>
            </tr>
          </thead>
          <tbody>
            {bill.cartItems.map((item, index) => (
              <tr key={item._id} className="border-b">
                <td className="px-3 py-3 text-slate-500">{index + 1}</td>
                <td className="px-3 py-3 font-medium">{item.title}</td>
                <td className="px-3 py-3 text-right">{item.quantity}</td>
                <td className="px-3 py-3 text-right">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-3 py-3 text-right font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="tabular ml-auto mt-6 w-full max-w-xs space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-600">Ara toplam</dt>
          <dd className="font-medium">{formatCurrency(bill.subTotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-600">KDV (%{taxRate})</dt>
          <dd className="font-medium">{formatCurrency(bill.tax)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t-2 border-slate-900 pt-3">
          <dt className="text-base font-semibold">Genel toplam</dt>
          <dd className="text-xl font-semibold">
            {formatCurrency(bill.totalAmount)}
          </dd>
        </div>
      </dl>

      <footer className="mt-10 border-t pt-4 text-xs text-slate-500">
        Bizi tercih ettiğiniz için teşekkür ederiz. Sorularınız için{" "}
        {COMPANY.email} adresinden bize ulaşabilirsiniz.
      </footer>
    </article>
  );
});

InvoiceDocument.displayName = "InvoiceDocument";

export default InvoiceDocument;
