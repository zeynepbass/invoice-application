import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { App as AntApp, ConfigProvider } from "antd";
import trTR from "antd/locale/tr_TR";
import App from "./App";
import store from "./redux/store";
import { theme } from "./config/theme";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme} locale={trTR}>
        <AntApp>
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <App />
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
