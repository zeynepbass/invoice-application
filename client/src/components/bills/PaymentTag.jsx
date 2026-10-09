import { CreditCardOutlined, WalletOutlined } from "@ant-design/icons";
import { Tag } from "antd";

const PAYMENT_STYLES = {
  Nakit: { color: "green", icon: <WalletOutlined /> },
  "Kredi Kartı": { color: "blue", icon: <CreditCardOutlined /> },
};

const PaymentTag = ({ mode }) => {
  const style = PAYMENT_STYLES[mode] || {};
  return (
    <Tag color={style.color} icon={style.icon} className="m-0">
      {mode}
    </Tag>
  );
};

export default PaymentTag;
