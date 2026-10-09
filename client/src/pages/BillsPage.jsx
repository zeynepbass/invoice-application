import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Table } from "antd";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InvoiceModal from "../components/bills/InvoiceModal";
import PaymentTag from "../components/bills/PaymentTag";
import ErrorState from "../components/common/ErrorState";
import PageHeader from "../components/common/PageHeader";
import { useGetBillsQuery } from "../redux/apiSlice";
import { formatCurrency, formatDate, getInvoiceNumber } from "../utils/format";
import { matchesSearch } from "../utils/search";

const BillsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(
    location.state?.openBillId ?? null
  );

  const { data: bills = [], isLoading, isError, refetch } = useGetBillsQuery();

  const selectedBill = bills.find((bill) => bill._id === selectedId);
  const visibleBills = bills.filter((bill) =>
    matchesSearch(
      search,
      bill.customerName,
      bill.customerPhoneNumber,
      getInvoiceNumber(bill)
    )
  );

  const closeInvoice = () => {
    setSelectedId(null);
    if (location.state?.openBillId) {
      navigate(location.pathname, { replace: true });
    }
  };

  const columns = [
    {
      title: "Fatura no",
      key: "number",
      render: (_, bill) => (
        <span className="tabular font-medium">{getInvoiceNumber(bill)}</span>
      ),
    },
    {
      title: "Müşteri",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.localeCompare(b.customerName, "tr"),
    },
    {
      title: "Telefon",
      dataIndex: "customerPhoneNumber",
      responsive: ["lg"],
    },
    {
      title: "Tarih",
      dataIndex: "createdAt",
      responsive: ["sm"],
      render: formatDate,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Ödeme",
      dataIndex: "paymentMode",
      responsive: ["md"],
      render: (mode) => <PaymentTag mode={mode} />,
    },
    {
      title: "Tutar",
      dataIndex: "totalAmount",
      align: "right",
      render: (amount) => (
        <span className="tabular font-semibold">{formatCurrency(amount)}</span>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "",
      key: "action",
      align: "right",
      width: 56,
      render: (_, bill) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => setSelectedId(bill._id)}
          aria-label={`${getInvoiceNumber(bill)} numaralı faturayı görüntüle`}
          title="Faturayı görüntüle"
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Faturalar"
        description="Oluşturulan siparişlerin faturalarını görüntüleyin ve yazdırın."
      />

      {isError ? (
        <ErrorState title="Faturalar yüklenemedi" onRetry={refetch} />
      ) : (
        <div className="surface overflow-hidden">
          <div className="border-b p-4">
            <Input
              allowClear
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Müşteri, telefon veya fatura no ara"
              aria-label="Faturalarda ara"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={visibleBills}
            loading={isLoading}
            scroll={{ x: "max-content" }}
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            locale={{
              emptyText: (
                <Empty
                  description={
                    bills.length === 0
                      ? "Henüz fatura oluşturulmamış."
                      : "Aramanızla eşleşen fatura yok."
                  }
                >
                  {bills.length === 0 && (
                    <Link to="/">
                      <Button type="primary">Sipariş oluştur</Button>
                    </Link>
                  )}
                </Empty>
              ),
            }}
          />
        </div>
      )}

      <InvoiceModal bill={selectedBill} onClose={closeInvoice} />
    </>
  );
};

export default BillsPage;
