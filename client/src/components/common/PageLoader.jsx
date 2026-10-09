import { Spin } from "antd";

const PageLoader = ({ fullScreen = false }) => (
  <div
    className={`flex items-center justify-center ${
      fullScreen ? "min-h-screen" : "min-h-[50vh]"
    }`}
    role="status"
    aria-label="Yükleniyor"
  >
    <Spin size="large" />
  </div>
);

export default PageLoader;
