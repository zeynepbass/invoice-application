import { PrinterOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getInvoiceNumber } from "../../utils/format";
import InvoiceDocument from "./InvoiceDocument";

const InvoiceModal = ({ bill, onClose }) => {
  const documentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => documentRef.current,
    documentTitle: bill ? getInvoiceNumber(bill) : undefined,
  });

  return (
    <Modal
      title="Fatura"
      open={Boolean(bill)}
      onCancel={onClose}
      width={860}
      destroyOnHidden
      footer={[
        <Button key="close" onClick={onClose}>
          Kapat
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
        >
          Yazdır
        </Button>,
      ]}
    >
      {bill && <InvoiceDocument ref={documentRef} bill={bill} />}
    </Modal>
  );
};

export default InvoiceModal;
