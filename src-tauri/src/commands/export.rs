use std::fs;

use crate::services::errors::friendly;

#[tauri::command]
pub fn export_as_txt(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content).map_err(|e| friendly("导出文件", &e))?;
    Ok(())
}

#[tauri::command]
pub fn export_as_html(path: String, content: String, title: String) -> Result<(), String> {
    let escaped = html_escape(&content);
    let html = format!(
        r#"<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>{}</title>
<style>
body {{ font-family: 'SF Mono', 'Menlo', 'Consolas', monospace; margin: 20px; background: #fff; color: #333; }}
pre {{ white-space: pre-wrap; word-wrap: break-word; tab-size: 4; }}
</style>
</head>
<body>
<pre>{}</pre>
</body>
</html>"#,
        html_escape(&title),
        escaped
    );

    fs::write(&path, html).map_err(|e| friendly("导出文件", &e))?;
    Ok(())
}

#[tauri::command]
pub fn export_as_rtf(path: String, content: String) -> Result<(), String> {
    let rtf_header = r"{\rtf1\ansi\deff0 {\fonttbl {\f0 Courier New;}} \f0\fs20 ";
    let mut rtf = String::from(rtf_header);

    for ch in content.chars() {
        match ch {
            '\\' => rtf.push_str("\\\\"),
            '{' => rtf.push_str("\\{"),
            '}' => rtf.push_str("\\}"),
            '\n' => rtf.push_str("\\line "),
            '\t' => rtf.push_str("\\tab "),
            c if (c as u32) > 127 => {
                rtf.push_str(&format!("\\u{}?", c as u32));
            }
            c => rtf.push(c),
        }
    }
    rtf.push_str("}");

    fs::write(&path, rtf).map_err(|e| friendly("导出文件", &e))?;
    Ok(())
}

fn html_escape(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&#39;")
}
