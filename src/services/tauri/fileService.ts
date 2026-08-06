import { invoke } from "@tauri-apps/api/core";
import type { FileOpenResult, FileMeta, EncodingType } from "../../types/file";

export async function openFile(path: string): Promise<FileOpenResult> {
  return invoke<FileOpenResult>("open_file", { path });
}

export async function saveFile(
  path: string,
  content: string,
  encoding: string
): Promise<void> {
  await invoke("save_file", { path, content, encoding });
}

export async function saveFileAs(
  path: string,
  content: string,
  encoding: string
): Promise<void> {
  await invoke("save_file_as", { path, content, encoding });
}

export async function createFile(path: string): Promise<void> {
  await invoke("create_file", { path });
}

export async function getFileMeta(path: string): Promise<FileMeta> {
  return invoke<FileMeta>("get_file_meta", { path });
}

export async function detectEncoding(path: string): Promise<string> {
  return invoke<string>("detect_encoding", { path });
}

export async function convertEncoding(
  content: string,
  from: string,
  to: string
): Promise<string> {
  return invoke<string>("convert_encoding", {
    content,
    fromEncoding: from,
    toEncoding: to,
  });
}

export async function reloadWithEncoding(
  path: string,
  encoding: string
): Promise<string> {
  return invoke<string>("reload_with_encoding", { path, encoding });
}

export async function saveWithEncoding(
  path: string,
  content: string,
  encoding: string
): Promise<void> {
  await invoke("save_with_encoding", { path, content, encoding });
}

export async function getSupportedEncodings(): Promise<string[]> {
  return invoke<string[]>("get_supported_encodings");
}

export async function isLargeFile(path: string): Promise<boolean> {
  return invoke<boolean>("is_large_file", { path });
}

export async function countLines(path: string): Promise<number> {
  return invoke<number>("count_lines", { path });
}

export async function watchFile(path: string): Promise<void> {
  await invoke("watch_file", { path });
}

export async function unwatchFile(path: string): Promise<void> {
  await invoke("unwatch_file", { path });
}

export async function unwatchAll(): Promise<void> {
  await invoke("unwatch_all");
}

export function getEncodingLabel(encoding: EncodingType): string {
  return encoding;
}
