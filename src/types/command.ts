import type { FileMeta, FileOpenResult, LargeFileInitResult, ChunkInfo, EncodingType } from "./file";

export interface SearchResult {
  path: string;
  line_number: number;
  line_content: string;
  match_start: number;
  match_end: number;
}

export interface SearchSummary {
  total_matches: number;
  files_matched: number;
  results: SearchResult[];
  truncated: boolean;
}

export interface CommandResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type OpenFileResult = FileOpenResult;
export type LargeFileResult = LargeFileInitResult;
export type ChunkResult = ChunkInfo;
export type FileMetaResult = FileMeta;
export type EncodingResult = EncodingType;
