import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

const QuantityStepper = ({ value, label, onDecrease, onIncrease }) => (
  <div className="flex items-center gap-1" role="group" aria-label={`${label} adedi`}>
    <Button
      size="small"
      icon={<MinusOutlined />}
      onClick={onDecrease}
      disabled={value <= 1}
      aria-label="Adedi azalt"
    />
    <span className="tabular w-8 text-center text-sm font-semibold" aria-live="polite">
      {value}
    </span>
    <Button
      size="small"
      icon={<PlusOutlined />}
      onClick={onIncrease}
      aria-label="Adedi artır"
    />
  </div>
);

export default QuantityStepper;
