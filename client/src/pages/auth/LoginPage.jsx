import { App as AntApp, Button, Form, Input } from "antd";
import { Link, Navigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { useGetMeQuery, useLoginMutation } from "../../redux/apiSlice";
import { getErrorMessage } from "../../utils/errors";

const LoginPage = () => {
  const { message } = AntApp.useApp();
  const location = useLocation();
  const { data: user, isError } = useGetMeQuery();
  const [login, { isLoading }] = useLoginMutation();

  if (user && !isError) {
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  const onFinish = async (values) => {
    try {
      await login(values).unwrap();
      message.success("Giriş başarılı.");
    } catch (error) {
      message.error(
        getErrorMessage(error, {
          400: "E-posta veya şifre hatalı.",
          401: "E-posta veya şifre hatalı.",
        })
      );
    }
  };

  return (
    <AuthLayout
      title="Tekrar hoş geldiniz"
      description="Devam etmek için hesabınıza giriş yapın."
      footer={
        <>
          Henüz hesabınız yok mu?{" "}
          <Link to="/register" className="font-medium text-brand-700 hover:underline">
            Kayıt olun
          </Link>
        </>
      }
    >
      <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
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
          rules={[{ required: true, message: "Şifrenizi girin." }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isLoading}
          className="mt-2"
        >
          Giriş yap
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default LoginPage;
