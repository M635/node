use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Encoding {
    Utf8,
    Utf8Bom,
    Gbk,
    Gb2312,
    Utf16Le,
    Utf16Be,
    Ascii,
    Big5,
    ShiftJis,
    EucKr,
    Iso88591,
    Windows1252,
    Unknown,
}

impl Encoding {
    pub fn as_str(&self) -> &'static str {
        match self {
            Encoding::Utf8 => "UTF-8",
            Encoding::Utf8Bom => "UTF-8-BOM",
            Encoding::Gbk => "GBK",
            Encoding::Gb2312 => "GB2312",
            Encoding::Utf16Le => "UTF-16LE",
            Encoding::Utf16Be => "UTF-16BE",
            Encoding::Ascii => "ASCII",
            Encoding::Big5 => "Big5",
            Encoding::ShiftJis => "Shift-JIS",
            Encoding::EucKr => "EUC-KR",
            Encoding::Iso88591 => "ISO-8859-1",
            Encoding::Windows1252 => "Windows-1252",
            Encoding::Unknown => "Unknown",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s.to_uppercase().as_str() {
            "UTF-8" => Encoding::Utf8,
            "UTF-8-BOM" => Encoding::Utf8Bom,
            "GBK" => Encoding::Gbk,
            "GB2312" => Encoding::Gb2312,
            "UTF-16LE" => Encoding::Utf16Le,
            "UTF-16BE" => Encoding::Utf16Be,
            "ASCII" => Encoding::Ascii,
            "BIG5" => Encoding::Big5,
            "SHIFT-JIS" | "SHIFTJIS" => Encoding::ShiftJis,
            "EUC-KR" | "EUCKR" => Encoding::EucKr,
            "ISO-8859-1" | "ISO8859-1" => Encoding::Iso88591,
            "WINDOWS1" | "WINDOWS-1252" | "WINDOWS1252" => Encoding::Windows1252,
            _ => Encoding::Unknown,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileMeta {
    pub path: String,
    pub size: u64,
    pub encoding: Encoding,
    pub is_binary: bool,
    pub readonly: bool,
    pub line_count: u64,
    pub has_bom: bool,
    pub line_ending: LineEnding,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LineEnding {
    Lf,
    Crlf,
    Mixed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChunkInfo {
    pub chunk_index: u64,
    pub total_chunks: u64,
    pub start_offset: u64,
    pub end_offset: u64,
    pub line_start: u64,
    pub line_end: u64,
    pub content: String,
    pub has_more: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchResult {
    pub path: String,
    pub line_number: u64,
    pub line_content: String,
    pub match_start: usize,
    pub match_end: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchSummary {
    pub total_matches: u64,
    pub files_matched: u64,
    pub results: Vec<SearchResult>,
    pub truncated: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReplaceSummary {
    pub files_modified: u64,
    pub total_replacements: u64,
    pub modified_files: Vec<String>,
}
