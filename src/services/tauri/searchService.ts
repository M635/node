import { invoke } from "@tauri-apps/api/core";
import type { SearchSummary } from "../../types/command";

export async function findInFiles(
  directory: string,
  pattern: string,
  isRegex: boolean,
  caseSensitive: boolean,
  fileExtensions?: string[]
): Promise<SearchSummary> {
  return invoke<SearchSummary>("find_in_files", {
    directory,
    pattern,
    isRegex,
    caseSensitive,
    fileExtensions,
  });
}

export async function searchInFile(
  path: string,
  pattern: string,
  isRegex: boolean,
  caseSensitive: boolean
): Promise<SearchSummary> {
  return invoke<SearchSummary>("search_in_file", {
    path,
    pattern,
    isRegex,
    caseSensitive,
  });
}
