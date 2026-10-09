const NETWORK_MESSAGE =
  "Sunucuya ulaşılamıyor. Bağlantınızı kontrol edip tekrar deneyin.";
const DEFAULT_MESSAGE = "Bir şeyler yanlış gitti. Lütfen tekrar deneyin.";

export const getErrorMessage = (error, messagesByStatus = {}) => {
  if (error?.status === "FETCH_ERROR") {
    return NETWORK_MESSAGE;
  }
  return messagesByStatus[error?.status] || DEFAULT_MESSAGE;
};
