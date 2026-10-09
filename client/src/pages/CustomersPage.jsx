import { SearchOutlined } from "@ant-design/icons";
import { Empty, Input, Table } from "antd";
import { useMemo, useState } from "react";
import ErrorState from "../components/common/ErrorState";
import PageHeader from "../components/common/PageHeader";
import { useGetBillsQuery } from "../redux/apiSlice";
import { formatCurrency, formatDate } from "../utils/format";
import { matchesSearch } from "../utils/search";

const groupByCustomer = (bills) => {
  const customers = new Map();

  for (const bill of bills) {
    const key = `${bill.customerPhoneNumber}|${bill.customerName}`;
    const customer = customers.get(key) || {
      key,
      name: bill.customerName,
      phone: bill.customerPhoneNumber,
      orderCount: 0,
      totalSpent: 0,
      lastOrderAt: bill.createdAt,
    };

    customer.orderCount += 1;
    customer.totalSpent += bill.totalAmount;
    if (new Date(bill.createdAt) > new Date(customer.lastOrderAt)) {
      customer.lastOrderAt = bill.createdAt;
    }
    customers.set(key, customer);
  }

  return [...customers.values()];
};

const columns = [
  {
    title: "Müşteri",
    dataIndex: "name",
    render: (name) => <span className="font-medium">{name}</span>,
    sorter: (a, b) => a.name.localeCompare(b.name, "tr"),
  },
  { title: "Telefon", dataIndex: "phone" },
  {
    title: "Sipariş",
    dataIndex: "orderCount",
    align: "right",
    responsive: ["sm"],
    sorter: (a, b) => a.orderCount - b.orderCount,
  },
  {
    title: "Son sipariş",
    dataIndex: "lastOrderAt",
    responsive: ["md"],
    render: formatDate,
    sorter: (a, b) => new Date(a.lastOrderAt) - new Date(b.lastOrderAt),
  },
  {
    title: "Toplam harcama",
    dataIndex: "totalSpent",
    align: "right",
    render: (amount) => (
      <span className="tabular font-semibold">{formatCurrency(amount)}</span>
    ),
    sorter: (a, b) => a.totalSpent - b.totalSpent,
  },
];

const CustomersPage = () => {
  const [search, setSearch] = useState("");
  const { data: bills = [], isLoading, isError, refetch } = useGetBillsQuery();

  const customers = useMemo(() => groupByCustomer(bills), [bills]);
  const visibleCustomers = customers.filter((customer) =>
    matchesSearch(search, customer.name, customer.phone)
  );

  return (
    <>
      <PageHeader
        title="Müşteriler"
        description="Sipariş veren müşteriler ve sipariş geçmişlerinin özeti."
      />

      {isError ? (
        <ErrorState title="Müşteriler yüklenemedi" onRetry={refetch} />
      ) : (
        <div className="surface overflow-hidden">
          <div className="border-b p-4">
            <Input
              allowClear
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="İsim veya telefon ara"
              aria-label="Müşterilerde ara"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table
            rowKey="key"
            columns={columns}
            dataSource={visibleCustomers}
            loading={isLoading}
            scroll={{ x: "max-content" }}
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            locale={{
              emptyText: (
                <Empty
                  description={
                    customers.length === 0
                      ? "Henüz müşteri yok. İlk siparişle birlikte burada listelenir."
                      : "Aramanızla eşleşen müşteri yok."
                  }
                />
              ),
            }}
          />
        </div>
      )}
    </>
  );
};

export default CustomersPage;
