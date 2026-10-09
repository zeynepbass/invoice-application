import { App as AntApp, Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { useRegisterMutation } from "../../redux/apiSlice";
import { getErrorMessage } from "../../utils/errors";

const RegisterPage = () => {
  const { message } = AntApp.useApp();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const onFinish = async ({ username, email, password }) => {
    try {
      await register({ username, email, password }).unwrap();
      message.success("Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.");
      navigate("/login");
    } catch (error) {
      message.error(
        getErrorMessage(error, {
          400: "Bilgilerinizi kontrol edip tekrar deneyin.",
          409: "Bu e-posta adresiyle kayıtlı bir hesap var.",
        })
      );
    }
  };

  return (
    <AuthLayout
      title="Hesap oluşturun"
      description="Satış ve faturalarınızı yönetmeye başlayın."
      footer={
        <>
          Zaten hesabınız var mı?{" "}
          <Link to="/login" className="font-medium text-brand-700 hover:underline">
            Giriş yapın
          </Link>
        </>
      }
    >
      <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
        <Form.Item
          label="Kullanıcı adı"
          name="username"
          rules={[
            { required: true, message: "Kullanıcı adınızı girin." },
            { min: 2, max: 50, message: "Kullanıcı adı 2-50 karakter olmalı." },
          ]}
        >
          <Input autoComplete="username" />
        </Form.Item>
        <Form.Item
          label="E-posta"
          name="email"
          rules={[
            { required: true, message: "E-posta adresinizi girin." },
            { type: "email", message: "Geçerli bir e-posta adresi girin." },
          ]}
        >
          <Input autoComplete="email" placeholder="ornek@sirket.com" />
        </Form.Item>
        <Form.Item
          label="Şifre"
          name="password"
          rules={[
            { required: true, message: "Bir şifre belirleyin." },
            { min: 6, max: 72, message: "Şifre en az 6 karakter olmalı." },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          label="Şifre tekrar"
          name="passwordAgain"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Şifrenizi tekrar girin." },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                !value || getFieldValue("password") === value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Şifreler eşleşmiyor.")),
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isLoading}
          className="mt-2"
        >
          Kayıt ol
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default RegisterPage;
