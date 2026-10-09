const StatCard = ({ title, value, icon }) => (
  <div className="surface flex items-center gap-4 p-5">
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-700"
      aria-hidden="true"
    >
      {icon}
    </span>
    <div className="min-w-0">
      <p className="text-sm text-slate-600">{title}</p>
      <p className="tabular mt-1 truncate text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  </div>
);

export default StatCard;
