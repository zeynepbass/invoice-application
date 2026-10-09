import { Button, Result } from "antd";

const ErrorState = ({
  title = "Veriler yüklenemedi",
  description = "Sunucuya ulaşılamadı. Lütfen tekrar deneyin.",
  onRetry,
}) => (
  <Result
    status="warning"
    title={title}
    subTitle={description}
    extra={
      onRetry && (
        <Button type="primary" onClick={onRetry}>
          Tekrar dene
        </Button>
      )
    }
  />
);

export default ErrorState;
