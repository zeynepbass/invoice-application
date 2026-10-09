import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Button, Drawer } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { selectCartCount } from "../../redux/cartSlice";
import Brand from "../common/Brand";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = useSelector(selectCartCount);

  return (
    <div className="min-h-screen lg:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-raised"
      >
        İçeriğe geç
      </a>

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-white lg:block print:hidden">
        <Sidebar />
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-white px-4 lg:hidden print:hidden">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menüyü aç"
          />
          <Link to="/" aria-label="Satış ekranı">
            <Brand />
          </Link>
          <Link to="/cart" aria-label={`Sepet, ${cartCount} ürün`}>
            <Badge count={cartCount} size="small" color="#0f766e">
              <span className="flex h-9 w-9 items-center justify-center text-xl text-slate-700">
                <ShoppingCartOutlined />
              </span>
            </Badge>
          </Link>
        </header>

        <main
          id="main"
          className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          <Outlet />
        </main>
      </div>

      <Drawer
        placement="left"
        width={272}
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        <Sidebar onNavigate={() => setIsMenuOpen(false)} />
      </Drawer>
    </div>
  );
};

export default AppLayout;
