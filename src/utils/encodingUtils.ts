import type { EncodingType } from "../types/file";

export const ENCODING_LIST: EncodingType[] = [
  "UTF-8",
  "UTF-8-BOM",
  "GBK",
  "GB2312",
  "UTF-16LE",
  "UTF-16BE",
  "ASCII",
];

export function isValidEncoding(encoding: string): encoding is EncodingType {
  return ENCODING_LIST.includes(encoding as EncodingType);
}

export function getEncodingDisplayName(encoding: EncodingType): string {
  const names: Record<EncodingType, string> = {
    "UTF-8": "UTF-8",
    "UTF-8-BOM": "UTF-8 (BOM)",
    GBK: "GBK",
    GB2312: "GB2312",
    "UTF-16LE": "UTF-16 LE",
    "UTF-16BE": "UTF-16 BE",
    ASCII: "ASCII",
    Unknown: "未知",
  };
  return names[encoding] || encoding;
}

export function canConvertTo(from: EncodingType, to: EncodingType): boolean {
  if (from === to) return false;
  if (from === "Unknown") return false;
  return true;
}

export function getEncodingPriority(encoding: EncodingType): number {
  const priorities: Record<EncodingType, number> = {
    "UTF-8": 1,
    "UTF-8-BOM": 2,
    ASCII: 3,
    GBK: 4,
    GB2312: 5,
    "UTF-16LE": 6,
    "UTF-16BE": 7,
    Unknown: 99,
  };
  return priorities[encoding] || 99;
}
