import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { App as AntApp, Button, Empty, Input, Popconfirm, Table, Tag } from "antd";
import { useState } from "react";
import CategoryManagerModal from "../components/categories/CategoryManagerModal";
import ErrorState from "../components/common/ErrorState";
import PageHeader from "../components/common/PageHeader";
import ProductFormModal from "../components/products/ProductFormModal";
import ProductImage from "../components/products/ProductImage";
import { useDeleteProductMutation, useGetProductsQuery } from "../redux/apiSlice";
import { getErrorMessage } from "../utils/errors";
import { formatCurrency } from "../utils/format";
import { matchesSearch } from "../utils/search";

const ProductsPage = () => {
  const { message } = AntApp.useApp();
  const [search, setSearch] = useState("");
  const [formState, setFormState] = useState({ open: false, product: null });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const visibleProducts = products.filter((product) =>
    matchesSearch(search, product.title, product.category)
  );

  const openForm = (product = null) => setFormState({ open: true, product });
  const closeForm = () => setFormState((state) => ({ ...state, open: false }));

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      message.success("Ürün silindi.");
    } catch (error) {
      message.error(
        getErrorMessage(error, { 404: "Bu ürün zaten silinmiş." })
      );
    }
  };

  const columns = [
    {
      title: "Ürün",
      dataIndex: "title",
      render: (title, product) => (
        <div className="flex items-center gap-3">
          <ProductImage
            src={product.img}
            className="h-11 w-11 shrink-0 rounded-lg"
          />
          <span className="font-medium">{title}</span>
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title, "tr"),
    },
    {
      title: "Kategori",
      dataIndex: "category",
      responsive: ["sm"],
      render: (category) => <Tag className="m-0">{category}</Tag>,
      sorter: (a, b) => a.category.localeCompare(b.category, "tr"),
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      align: "right",
      render: (price) => (
        <span className="tabular font-semibold">{formatCurrency(price)}</span>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "",
      key: "actions",
      align: "right",
      width: 104,
      render: (_, product) => (
        <div className="flex justify-end gap-1">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openForm(product)}
            aria-label={`${product.title} ürününü düzenle`}
            title="Düzenle"
          />
          <Popconfirm
            title="Ürün silinsin mi?"
            description="Bu işlem geri alınamaz."
            okText="Sil"
            cancelText="Vazgeç"
            okButtonProps={{ danger: true }}
            placement="topRight"
            onConfirm={() => handleDelete(product._id)}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label={`${product.title} ürününü sil`}
              title="Sil"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Ürünler"
        description="Ürün kataloğunu ve kategorileri yönetin."
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
              onClick={() => openForm()}
            >
              Ürün ekle
            </Button>
          </>
        }
      />

      {isError ? (
        <ErrorState title="Ürünler yüklenemedi" onRetry={refetch} />
      ) : (
        <div className="surface overflow-hidden">
          <div className="border-b p-4">
            <Input
              allowClear
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Ürün veya kategori ara"
              aria-label="Ürünlerde ara"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={visibleProducts}
            loading={isLoading}
            scroll={{ x: "max-content" }}
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            locale={{
              emptyText: (
                <Empty
                  description={
                    products.length === 0
                      ? "Henüz ürün eklenmemiş."
                      : "Aramanızla eşleşen ürün yok."
                  }
                />
              ),
            }}
          />
        </div>
      )}

      <ProductFormModal
        open={formState.open}
        product={formState.product}
        onClose={closeForm}
      />
      <CategoryManagerModal
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </>
  );
};

export default ProductsPage;
