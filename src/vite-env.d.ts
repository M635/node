/// <reference types="vite/client" />

/** 由 vite.config.ts 注入的应用版本号（来源于 tauri.conf.json） */
declare const __APP_VERSION__: string;

declare module "*.css" {
  const content: string;
  export default content;
}
