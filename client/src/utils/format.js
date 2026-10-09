const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
});

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const formatCurrency = (value) =>
  currencyFormatter.format(Number(value) || 0);

export const formatDate = (value) => dateFormatter.format(new Date(value));

export const getInvoiceNumber = (bill) => {
  const date = new Date(bill.createdAt).toISOString().slice(0, 10);
  return `INV-${date.replaceAll("-", "")}-${bill._id.slice(-6).toUpperCase()}`;
};

export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("tr-TR");
