import {
  AppstoreOutlined,
  BarChartOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { App as AntApp, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  apiSlice,
  useGetMeQuery,
  useLogoutMutation,
} from "../../redux/apiSlice";
import { selectCartCount } from "../../redux/cartSlice";
import { getErrorMessage } from "../../utils/errors";
import { getInitials } from "../../utils/format";
import Brand from "../common/Brand";

const NAV_ITEMS = [
  { to: "/", label: "Satış", icon: <ShopOutlined />, end: true },
  { to: "/cart", label: "Sepet", icon: <ShoppingCartOutlined />, showCount: true },
  { to: "/bills", label: "Faturalar", icon: <FileTextOutlined /> },
  { to: "/customers", label: "Müşteriler", icon: <TeamOutlined /> },
  { to: "/statistic", label: "İstatistikler", icon: <BarChartOutlined /> },
  { to: "/products", label: "Ürünler", icon: <AppstoreOutlined /> },
];

const Sidebar = ({ onNavigate }) => {
  const { message, modal } = AntApp.useApp();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);
  const { data: user } = useGetMeQuery();
  const [logout] = useLogoutMutation();

  const confirmLogout = () => {
    modal.confirm({
      title: "Çıkış yapılsın mı?",
      content: "Oturumunuz kapatılacak. Sepetiniz bu cihazda saklanır.",
      okText: "Çıkış yap",
      cancelText: "Vazgeç",
      onOk: async () => {
        try {
          await logout().unwrap();
          navigate("/login");
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          message.error(getErrorMessage(error));
        }
      },
    });
  };

  return (
    <div className="flex h-full flex-col">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex h-16 items-center px-5"
        aria-label="Satış ekranı"
      >
        <Brand />
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Ana menü">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className="nav-link"
              >
                <span className="text-base" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.showCount && cartCount > 0 && (
                  <span
                    className="tabular rounded-full bg-brand-700 px-2 py-0.5 text-xs font-semibold text-white"
                    aria-label={`Sepette ${cartCount} ürün`}
                  >
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800"
            aria-hidden="true"
          >
            {getInitials(user?.username)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {user?.username}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={confirmLogout}
            aria-label="Çıkış yap"
            title="Çıkış yap"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
