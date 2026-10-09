import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { App as AntApp, Button, Empty, Form, Input, Modal, Popconfirm, Spin } from "antd";
import { useState } from "react";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../redux/apiSlice";
import { getErrorMessage } from "../../utils/errors";

const TITLE_RULES = [
  { required: true, whitespace: true, message: "Kategori adını girin." },
  { max: 40, message: "Kategori adı en fazla 40 karakter olabilir." },
];

const ERROR_MESSAGES = {
  400: "Kategori adını kontrol edip tekrar deneyin.",
  404: "Bu kategori artık mevcut değil.",
  409: "Bu isimde bir kategori zaten var.",
};

const CategoryManagerModal = ({ open, onClose }) => {
  const { message } = AntApp.useApp();
  const [addForm] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const run = async (request, successMessage) => {
    try {
      await request.unwrap();
      message.success(successMessage);
      return true;
    } catch (error) {
      message.error(getErrorMessage(error, ERROR_MESSAGES));
      return false;
    }
  };

  const handleAdd = async ({ title }) => {
    if (await run(addCategory({ title }), "Kategori eklendi.")) {
      addForm.resetFields();
    }
  };

  const handleUpdate = async ({ title }) => {
    if (
      await run(
        updateCategory({ id: editingId, title }),
        "Kategori güncellendi."
      )
    ) {
      setEditingId(null);
    }
  };

  const handleClose = () => {
    setEditingId(null);
    onClose();
  };

  return (
    <Modal
      title="Kategoriler"
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={addForm}
        onFinish={handleAdd}
        className="flex items-start gap-2 pt-2"
      >
        <Form.Item name="title" rules={TITLE_RULES} className="mb-4 flex-1">
          <Input placeholder="Yeni kategori adı" aria-label="Yeni kategori adı" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          icon={<PlusOutlined />}
          loading={isAdding}
        >
          Ekle
        </Button>
      </Form>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : categories.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Henüz kategori yok."
        />
      ) : (
        <ul className="max-h-80 divide-y divide-slate-200 overflow-y-auto rounded-lg border">
          {categories.map((category) => (
            <li key={category._id} className="px-3 py-2">
              {editingId === category._id ? (
                <Form
                  onFinish={handleUpdate}
                  initialValues={{ title: category.title }}
                  className="flex items-start gap-2"
                >
                  <Form.Item name="title" rules={TITLE_RULES} className="mb-0 flex-1">
                    <Input autoFocus aria-label="Kategori adı" />
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<CheckOutlined />}
                    loading={isUpdating}
                    aria-label="Kaydet"
                  />
                  <Button
                    icon={<CloseOutlined />}
                    onClick={() => setEditingId(null)}
                    aria-label="Vazgeç"
                  />
                </Form>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {category.title}
                  </span>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => setEditingId(category._id)}
                    aria-label={`${category.title} kategorisini düzenle`}
                  />
                  <Popconfirm
                    title="Kategori silinsin mi?"
                    description="Bu kategorideki ürünler silinmez."
                    okText="Sil"
                    cancelText="Vazgeç"
                    okButtonProps={{ danger: true }}
                    onConfirm={() =>
                      run(deleteCategory(category._id), "Kategori silindi.")
                    }
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      aria-label={`${category.title} kategorisini sil`}
                    />
                  </Popconfirm>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default CategoryManagerModal;
