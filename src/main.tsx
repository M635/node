import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initClipboardListener } from "./stores/clipboardStore";
import "./styles/global.css";
import "./styles/mac-theme.css";

// 启动剪贴板历史监听（此前未初始化，剪贴板历史面板一直是空的）
initClipboardListener();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
