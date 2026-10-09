import { App as AntApp, Form, Input, InputNumber, Modal, Select } from "antd";
import {
  useAddProductMutation,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from "../../redux/apiSlice";
import { getErrorMessage } from "../../utils/errors";

const FORM_ID = "product-form";

const ProductFormModal = ({ open, product, onClose }) => {
  const { message } = AntApp.useApp();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isEditing = Boolean(product);

  const onFinish = async (values) => {
    try {
      if (isEditing) {
        await updateProduct({ id: product._id, ...values }).unwrap();
        message.success("Ürün güncellendi.");
      } else {
        await addProduct(values).unwrap();
        message.success("Ürün eklendi.");
      }
      onClose();
    } catch (error) {
      message.error(
        getErrorMessage(error, {
          400: "Ürün bilgilerini kontrol edip tekrar deneyin.",
          404: "Bu ürün artık mevcut değil.",
        })
      );
    }
  };

  return (
    <Modal
      title={isEditing ? "Ürünü düzenle" : "Yeni ürün"}
      open={open}
      onCancel={onClose}
      okText={isEditing ? "Güncelle" : "Ekle"}
      cancelText="Vazgeç"
      okButtonProps={{ htmlType: "submit", form: FORM_ID }}
      confirmLoading={isAdding || isUpdating}
      destroyOnHidden
    >
      <Form
        id={FORM_ID}
        layout="vertical"
        onFinish={onFinish}
        initialValues={product}
        preserve={false}
        className="pt-2"
      >
        <Form.Item
          name="title"
          label="Ürün adı"
          rules={[
            { required: true, whitespace: true, message: "Ürün adını girin." },
            { max: 80, message: "Ürün adı en fazla 80 karakter olabilir." },
          ]}
        >
          <Input placeholder="Örn. Filtre Kahve" />
        </Form.Item>
        <Form.Item
          name="img"
          label="Görsel adresi"
          extra="http(s) ile başlayan bir bağlantı veya /images/... yolu."
          rules={[
            { required: true, message: "Görsel adresini girin." },
            {
              pattern: /^(https?:\/\/|\/)\S+$/,
              message: "Geçerli bir görsel adresi girin.",
            },
          ]}
        >
          <Input placeholder="https://..." />
        </Form.Item>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Form.Item
            name="price"
            label="Fiyat"
            rules={[{ required: true, message: "Fiyatı girin." }]}
          >
            <InputNumber
              min={0}
              precision={2}
              decimalSeparator=","
              suffix="₺"
              className="w-full"
              placeholder="0,00"
            />
          </Form.Item>
          <Form.Item
            name="category"
            label="Kategori"
            rules={[{ required: true, message: "Bir kategori seçin." }]}
          >
            <Select
              showSearch
              placeholder="Kategori seçin"
              loading={isLoadingCategories}
              notFoundContent="Önce bir kategori ekleyin."
              options={categories.map((category) => ({
                value: category.title,
                label: category.title,
              }))}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
