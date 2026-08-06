import { invoke } from "@tauri-apps/api/core";

export async function exportAsTxt(path: string, content: string): Promise<void> {
  await invoke("export_as_txt", { path, content });
}

export async function exportAsHtml(
  path: string,
  content: string,
  title: string
): Promise<void> {
  await invoke("export_as_html", { path, content, title });
}

export async function exportAsRtf(path: string, content: string): Promise<void> {
  await invoke("export_as_rtf", { path, content });
}
