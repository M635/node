use crate::models::file_meta::Encoding;
use chardetng::EncodingDetector;

pub fn detect_encoding(bytes: &[u8]) -> Encoding {
    if bytes.is_empty() {
        return Encoding::Utf8;
    }

    if bytes.starts_with(&[0xEF, 0xBB, 0xBF]) {
        return Encoding::Utf8Bom;
    }
    if bytes.starts_with(&[0xFF, 0xFE]) {
        return Encoding::Utf16Le;
    }
    if bytes.starts_with(&[0xFE, 0xFF]) {
        return Encoding::Utf16Be;
    }

    let mut detector = EncodingDetector::new();
    detector.feed(bytes, true);
    let guessed = detector.guess(None, true);

    let canonical = guessed.name();
    match canonical {
        "utf-8" => Encoding::Utf8,
        "gbk" | "gb18030" => Encoding::Gbk,
        "gb2312" => Encoding::Gb2312,
        "utf-16le" => Encoding::Utf16Le,
        "utf-16be" => Encoding::Utf16Be,
        "windows-1252" | "ascii" | "us-ascii" => {
            if bytes.iter().all(|&b| b < 0x80) {
                Encoding::Ascii
            } else {
                Encoding::Utf8
            }
        }
        _ => Encoding::Utf8,
    }
}

pub fn decode_bytes(bytes: &[u8], encoding: &Encoding) -> String {
    let enc: &'static encoding_rs::Encoding = match encoding {
        Encoding::Utf8 | Encoding::Utf8Bom | Encoding::Ascii | Encoding::Unknown => {
            encoding_rs::UTF_8
        }
        Encoding::Gbk | Encoding::Gb2312 => encoding_rs::GBK,
        Encoding::Utf16Le => encoding_rs::UTF_16LE,
        Encoding::Utf16Be => encoding_rs::UTF_16BE,
        Encoding::Big5 => encoding_rs::BIG5,
        Encoding::ShiftJis => encoding_rs::SHIFT_JIS,
        Encoding::EucKr => encoding_rs::EUC_KR,
        Encoding::Iso88591 => encoding_rs::WINDOWS_1252,
        Encoding::Windows1252 => encoding_rs::WINDOWS_1252,
    };

    let source = if matches!(encoding, Encoding::Utf8Bom) && bytes.len() >= 3 {
        &bytes[3..]
    } else {
        bytes
    };

    let (cow, _, _) = enc.decode(source);
    cow.into_owned()
}

pub fn encode_string(text: &str, encoding: &Encoding) -> Vec<u8> {
    let enc: &'static encoding_rs::Encoding = match encoding {
        Encoding::Utf8 | Encoding::Utf8Bom | Encoding::Ascii | Encoding::Unknown => {
            encoding_rs::UTF_8
        }
        Encoding::Gbk | Encoding::Gb2312 => encoding_rs::GBK,
        Encoding::Utf16Le => encoding_rs::UTF_16LE,
        Encoding::Utf16Be => encoding_rs::UTF_16BE,
        Encoding::Big5 => encoding_rs::BIG5,
        Encoding::ShiftJis => encoding_rs::SHIFT_JIS,
        Encoding::EucKr => encoding_rs::EUC_KR,
        Encoding::Iso88591 => encoding_rs::WINDOWS_1252,
        Encoding::Windows1252 => encoding_rs::WINDOWS_1252,
    };

    let (cow, _, _) = enc.encode(text);
    let mut result = cow.into_owned();

    if matches!(encoding, Encoding::Utf8Bom) {
        let mut bom = vec![0xEF, 0xBB, 0xBF];
        bom.extend(result);
        result = bom;
    }

    result
}

pub fn is_binary(bytes: &[u8]) -> bool {
    if bytes.is_empty() {
        return false;
    }
    let check_len = bytes.len().min(8192);
    let sample = &bytes[..check_len];
    let null_count = sample.iter().filter(|&&b| b == 0).count();
    null_count > check_len / 10
}
