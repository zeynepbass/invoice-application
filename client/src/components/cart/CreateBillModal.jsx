import { App as AntApp, Form, Input, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAddBillMutation } from "../../redux/apiSlice";
import { reset, selectCartItems } from "../../redux/cartSlice";
import { getErrorMessage } from "../../utils/errors";
import CartSummary from "./CartSummary";

const FORM_ID = "create-bill-form";
const PAYMENT_MODES = ["Nakit", "Kredi Kartı"];

const CreateBillModal = ({ open, onClose }) => {
  const { message } = AntApp.useApp();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const [addBill, { isLoading }] = useAddBillMutation();

  const onFinish = async (values) => {
    try {
      const bill = await addBill({
        ...values,
        cartItems: items.map(({ _id, quantity }) => ({ _id, quantity })),
      }).unwrap();

      dispatch(reset());
      message.success("Sipariş oluşturuldu, fatura hazır.");
      navigate("/bills", { state: { openBillId: bill._id } });
    } catch (error) {
      message.error(
        getErrorMessage(error, {
          400: "Sipariş bilgilerini kontrol edip tekrar deneyin.",
          409: "Sepetinizdeki bazı ürünler artık satışta değil. Sepeti güncelleyin.",
        })
      );
    }
  };

  return (
    <Modal
      title="Siparişi tamamla"
      open={open}
      onCancel={onClose}
      okText="Fatura oluştur"
      cancelText="Vazgeç"
      okButtonProps={{ htmlType: "submit", form: FORM_ID }}
      confirmLoading={isLoading}
      destroyOnHidden
    >
      <Form
        id={FORM_ID}
        layout="vertical"
        onFinish={onFinish}
        preserve={false}
        className="pt-2"
      >
        <Form.Item
          label="Müşteri adı"
          name="customerName"
          rules={[
            { required: true, whitespace: true, message: "Müşteri adını girin." },
            { min: 2, max: 80, message: "Müşteri adı 2-80 karakter olmalı." },
          ]}
        >
          <Input placeholder="Ad Soyad" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="Telefon"
          name="customerPhoneNumber"
          rules={[
            { required: true, message: "Telefon numarasını girin." },
            {
              pattern: /^\+?[\d\s()-]{10,20}$/,
              message: "Geçerli bir telefon numarası girin.",
            },
          ]}
        >
          <Input placeholder="05XX XXX XX XX" inputMode="tel" maxLength={20} />
        </Form.Item>
        <Form.Item
          label="Ödeme yöntemi"
          name="paymentMode"
          rules={[{ required: true, message: "Ödeme yöntemini seçin." }]}
        >
          <Select
            placeholder="Seçin"
            options={PAYMENT_MODES.map((mode) => ({ value: mode, label: mode }))}
          />
        </Form.Item>
      </Form>
      <div className="rounded-lg bg-slate-50 p-4">
        <CartSummary />
      </div>
    </Modal>
  );
};

export default CreateBillModal;
