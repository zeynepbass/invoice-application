export const ALL_CATEGORIES = "Tümü";

const CategoryFilter = ({ categories, value, onChange }) => {
  const titles = [
    ALL_CATEGORIES,
    ...categories
      .map((category) => category.title)
      .filter((title) => title !== ALL_CATEGORIES),
  ];

  return (
    <div
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      role="group"
      aria-label="Kategoriye göre filtrele"
    >
      {titles.map((title) => {
        const isActive = title === value;
        return (
          <button
            key={title}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(title)}
            className={`shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-brand-700 bg-brand-700 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {title}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
