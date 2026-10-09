import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <Result
    status="404"
    title="Sayfa bulunamadı"
    subTitle="Aradığınız sayfa taşınmış veya hiç var olmamış olabilir."
    extra={
      <Link to="/">
        <Button type="primary">Satış ekranına dön</Button>
      </Link>
    }
  />
);

export default NotFoundPage;
