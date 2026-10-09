import {
  PlusOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Button, Empty, Input, Skeleton } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartPanel from "../components/cart/CartPanel";
import CategoryFilter, {
  ALL_CATEGORIES,
} from "../components/categories/CategoryFilter";
import CategoryManagerModal from "../components/categories/CategoryManagerModal";
import ErrorState from "../components/common/ErrorState";
import PageHeader from "../components/common/PageHeader";
import ProductCard from "../components/products/ProductCard";
import ProductFormModal from "../components/products/ProductFormModal";
import { useGetCategoriesQuery, useGetProductsQuery } from "../redux/apiSlice";
import { selectCartCount, selectCartTotals } from "../redux/cartSlice";
import { formatCurrency } from "../utils/format";
import { matchesSearch } from "../utils/search";

const SKELETON_COUNT = 8;

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const cartCount = useSelector(selectCartCount);
  const { total } = useSelector(selectCartTotals);

  const activeCategory = categories.some((item) => item.title === category)
    ? category
    : ALL_CATEGORIES;

  const visibleProducts = products.filter(
    (product) =>
      (activeCategory === ALL_CATEGORIES ||
        product.category === activeCategory) &&
      matchesSearch(search, product.title)
  );

  const renderProducts = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-products" aria-busy="true">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <div key={index} className="surface p-3">
              <Skeleton.Image active className="!h-28 !w-full" />
              <Skeleton active paragraph={{ rows: 1 }} className="mt-3" />
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return <ErrorState title="Ürünler yüklenemedi" onRetry={refetch} />;
    }

    if (products.length === 0) {
      return (
        <Empty className="surface py-16" description="Henüz ürün eklenmemiş.">
          <Button type="primary" onClick={() => setIsProductModalOpen(true)}>
            İlk ürünü ekle
          </Button>
        </Empty>
      );
    }

    if (visibleProducts.length === 0) {
      return (
        <Empty
          className="surface py-16"
          description="Aramanızla eşleşen ürün bulunamadı."
        >
          <Button
            onClick={() => {
              setSearch("");
              setCategory(ALL_CATEGORIES);
            }}
          >
            Filtreleri temizle
          </Button>
        </Empty>
      );
    }

    return (
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-products">
        {visibleProducts.map((product) => (
          <li key={product._id} className="flex">
            <div className="flex w-full flex-col [&>article]:flex-1">
              <ProductCard product={product} />
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 pb-20 xl:pb-0">
        <PageHeader
          title="Satış"
          description="Ürünleri sepete ekleyip siparişi oluşturun."
          actions={
            <>
              <Button
                icon={<TagsOutlined />}
                onClick={() => setIsCategoryModalOpen(true)}
              >
                Kategoriler
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsProductModalOpen(true)}
              >
                Ürün ekle
              </Button>
            </>
          }
        />

        <div className="mb-6 space-y-4">
          <Input
            size="large"
            allowClear
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Ürün ara"
            aria-label="Ürün ara"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-md"
          />
          <CategoryFilter
            categories={categories}
            value={activeCategory}
            onChange={setCategory}
          />
        </div>

        {renderProducts()}
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-8">
          <CartPanel />
        </div>
      </aside>

      {cartCount > 0 && (
        <Link
          to="/cart"
          className="fixed inset-x-4 bottom-4 z-10 flex items-center justify-between rounded-xl bg-brand-700 px-5 py-3.5 text-white shadow-raised xl:hidden"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <ShoppingCartOutlined className="text-lg" />
            Sepeti görüntüle ({cartCount})
          </span>
          <span className="tabular font-semibold">{formatCurrency(total)}</span>
        </Link>
      )}

      <ProductFormModal
        open={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
      <CategoryManagerModal
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
