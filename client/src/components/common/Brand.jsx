import { APP_NAME } from "../../config/company";

const Brand = ({ inverted = false }) => (
  <span className="flex items-center gap-2.5">
    <img src="/favicon.svg" alt="" className="h-8 w-8" />
    <span
      className={`text-lg font-semibold tracking-tight ${
        inverted ? "text-white" : "text-slate-900"
      }`}
    >
      {APP_NAME}
    </span>
  </span>
);

export default Brand;
