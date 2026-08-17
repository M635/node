use crate::models::file_meta::Encoding;
use crate::services::encoding_detect;
use crate::services::errors::friendly;

#[tauri::command]
pub fn detect_encoding(path: String) -> Result<String, String> {
    let bytes = std::fs::read(&path).map_err(|e| friendly("读取文件", &e))?;
    let sample = if bytes.len() > 8192 {
        &bytes[..8192]
    } else {
        &bytes
    };
    let encoding = encoding_detect::detect_encoding(sample);
    Ok(encoding.as_str().to_string())
}

#[tauri::command]
pub fn convert_encoding(
    content: String,
    from_encoding: String,
    to_encoding: String,
) -> Result<String, String> {
    let from = Encoding::from_str(&from_encoding);
    let to = Encoding::from_str(&to_encoding);

    let bytes = encoding_detect::encode_string(&content, &from);
    let decoded = encoding_detect::decode_bytes(&bytes, &to);
    Ok(decoded)
}

#[tauri::command]
pub fn reload_with_encoding(path: String, encoding: String) -> Result<String, String> {
    let bytes = std::fs::read(&path).map_err(|e| friendly("读取文件", &e))?;
    let enc = Encoding::from_str(&encoding);
    Ok(encoding_detect::decode_bytes(&bytes, &enc))
}

#[tauri::command]
pub fn save_with_encoding(path: String, content: String, encoding: String) -> Result<(), String> {
    let enc = Encoding::from_str(&encoding);
    let bytes = encoding_detect::encode_string(&content, &enc);
    std::fs::write(&path, bytes).map_err(|e| friendly("保存文件", &e))?;
    Ok(())
}

#[tauri::command]
pub fn get_supported_encodings() -> Vec<String> {
    vec![
        "UTF-8".to_string(),
        "UTF-8-BOM".to_string(),
        "GBK".to_string(),
        "GB2312".to_string(),
        "Big5".to_string(),
        "Shift-JIS".to_string(),
        "EUC-KR".to_string(),
        "UTF-16LE".to_string(),
        "UTF-16BE".to_string(),
        "ISO-8859-1".to_string(),
        "Windows-1252".to_string(),
        "ASCII".to_string(),
    ]
}
