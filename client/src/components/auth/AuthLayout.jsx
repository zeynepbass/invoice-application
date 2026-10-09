import {
  AppstoreOutlined,
  PrinterOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Brand from "../common/Brand";

const HIGHLIGHTS = [
  {
    icon: <AppstoreOutlined />,
    title: "Ürün ve kategori yönetimi",
    text: "Kataloğunuzu tek ekrandan ekleyin, düzenleyin, silin.",
  },
  {
    icon: <ShoppingCartOutlined />,
    title: "Hızlı sipariş",
    text: "Ürünleri sepete ekleyin, KDV dahil tutarı anında görün.",
  },
  {
    icon: <PrinterOutlined />,
    title: "Yazdırılabilir fatura",
    text: "Her sipariş için fatura oluşturun ve tek tıkla yazdırın.",
  },
];

const AuthLayout = ({ title, description, children, footer }) => (
  <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
    <main className="flex items-center justify-center bg-white px-6 py-10">
      <div className="w-full max-w-sm">
        <Brand />
        <h1 className="mt-10 text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mb-8 mt-2 text-sm text-slate-600">{description}</p>
        {children}
        <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>
      </div>
    </main>

    <aside className="hidden flex-col justify-center bg-gradient-to-br from-brand-800 to-brand-900 px-16 text-white lg:flex">
      <p className="text-sm font-medium uppercase tracking-widest text-brand-200">
        Satış ve fatura yönetimi
      </p>
      <p className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-tight">
        Siparişten faturaya, tek bir akışta.
      </p>
      <ul className="mt-12 max-w-md space-y-6">
        {HIGHLIGHTS.map((item) => (
          <li key={item.title} className="flex gap-4">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg"
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <span>
              <span className="block font-medium">{item.title}</span>
              <span className="mt-1 block text-sm text-brand-100">
                {item.text}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  </div>
);

export default AuthLayout;
