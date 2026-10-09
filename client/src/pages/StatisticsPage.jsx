import {
  AppstoreOutlined,
  FileDoneOutlined,
  TeamOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Area, Pie } from "@ant-design/plots";
import { Empty } from "antd";
import { useMemo } from "react";
import ErrorState from "../components/common/ErrorState";
import PageHeader from "../components/common/PageHeader";
import PageLoader from "../components/common/PageLoader";
import StatCard from "../components/statistics/StatCard";
import {
  useGetBillsQuery,
  useGetMeQuery,
  useGetProductsQuery,
} from "../redux/apiSlice";
import { formatCurrency, formatDate } from "../utils/format";

const CHART_HEIGHT = 300;
const PAYMENT_COLORS = ["#0f766e", "#f59e0b", "#6366f1"];

const sumBy = (bills, getKey) => {
  const totals = new Map();
  for (const bill of bills) {
    const key = getKey(bill);
    totals.set(key, (totals.get(key) || 0) + bill.totalAmount);
  }
  return totals;
};

const buildStatistics = (bills) => {
  const daily = sumBy(bills, (bill) => bill.createdAt.slice(0, 10));
  const payments = sumBy(bills, (bill) => bill.paymentMode);

  return {
    revenue: bills.reduce((sum, bill) => sum + bill.totalAmount, 0),
    customerCount: new Set(bills.map((bill) => bill.customerPhoneNumber)).size,
    dailyRevenue: [...daily.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, total]) => ({ date: formatDate(date), total })),
    paymentSplit: [...payments.entries()].map(([type, value]) => ({
      type,
      value,
    })),
  };
};

const ChartCard = ({ title, children }) => (
  <section className="surface min-w-0 p-5">
    <h2 className="mb-4 text-base font-semibold">{title}</h2>
    {children}
  </section>
);

const StatisticsPage = () => {
  const { data: user } = useGetMeQuery();
  const {
    data: bills = [],
    isLoading: isLoadingBills,
    isError,
    refetch,
  } = useGetBillsQuery();
  const { data: products = [], isLoading: isLoadingProducts } =
    useGetProductsQuery();

  const statistics = useMemo(() => buildStatistics(bills), [bills]);

  if (isLoadingBills || isLoadingProducts) {
    return <PageLoader />;
  }

  if (isError) {
    return <ErrorState title="İstatistikler yüklenemedi" onRetry={refetch} />;
  }

  const areaConfig = {
    data: statistics.dailyRevenue,
    xField: "date",
    yField: "total",
    height: CHART_HEIGHT,
    smooth: true,
    color: "#0f766e",
    areaStyle: { fill: "l(270) 0:#ffffff 1:#0f766e" },
    point: { size: 3 },
    yAxis: { label: { formatter: (value) => formatCurrency(value) } },
    tooltip: {
      formatter: ({ total }) => ({ name: "Ciro", value: formatCurrency(total) }),
    },
  };

  const pieConfig = {
    data: statistics.paymentSplit,
    angleField: "value",
    colorField: "type",
    height: CHART_HEIGHT,
    radius: 0.9,
    innerRadius: 0.66,
    color: PAYMENT_COLORS,
    label: false,
    legend: { position: "bottom" },
    tooltip: {
      formatter: ({ type, value }) => ({
        name: type,
        value: formatCurrency(value),
      }),
    },
    statistic: {
      title: false,
      content: {
        style: { fontSize: "16px", fontWeight: 600 },
        content: formatCurrency(statistics.revenue),
      },
    },
  };

  return (
    <>
      <PageHeader
        title="İstatistikler"
        description={`Hoş geldiniz, ${user?.username}. Satışlarınızın güncel özeti.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Toplam ciro"
          value={formatCurrency(statistics.revenue)}
          icon={<WalletOutlined />}
        />
        <StatCard
          title="Toplam satış"
          value={bills.length}
          icon={<FileDoneOutlined />}
        />
        <StatCard
          title="Toplam müşteri"
          value={statistics.customerCount}
          icon={<TeamOutlined />}
        />
        <StatCard
          title="Toplam ürün"
          value={products.length}
          icon={<AppstoreOutlined />}
        />
      </div>

      {bills.length === 0 ? (
        <Empty
          className="surface mt-6 py-16"
          description="Grafikler ilk siparişten sonra burada görünecek."
        />
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <ChartCard title="Günlük ciro">
            <Area {...areaConfig} />
          </ChartCard>
          <ChartCard title="Ödeme yöntemine göre ciro">
            <Pie {...pieConfig} />
          </ChartCard>
        </div>
      )}
    </>
  );
};

export default StatisticsPage;
