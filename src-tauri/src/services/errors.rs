//! 底层错误转中文友好提示。
//!
//! 原则：面向普通用户只展示中文提示；
//! 完整原始错误信息只写入调试日志（stderr），不直接展示给用户。

use std::fmt::Display;

/// 把底层错误映射为中文提示，并把原始错误写入调试日志。
pub fn friendly(context: &str, err: &dyn Display) -> String {
    let raw = err.to_string();
    eprintln!("[MarkPT][调试] {} 原始错误: {}", context, raw);
    map_known_error(&raw)
}

/// 把常见英文/系统错误文本映射为中文提示。
pub fn map_known_error(raw: &str) -> String {
    let lower = raw.to_lowercase();
    if lower.contains("not found") || lower.contains("no such file") || lower.contains("文件不存在")
    {
        return "文件或目录不存在".to_string();
    }
    if lower.contains("permission denied")
        || lower.contains("permission was denied")
        || lower.contains("read-only")
        || lower.contains("只读")
    {
        return "没有访问权限".to_string();
    }
    if lower.contains("already exists") || lower.contains("文件已存在") {
        return "文件或目录已存在".to_string();
    }
    if lower.contains("is a directory") {
        return "目标是一个目录，无法按文件处理".to_string();
    }
    if lower.contains("disk full")
        || lower.contains("no space left")
        || lower.contains("磁盘空间不足")
    {
        return "磁盘空间不足".to_string();
    }
    if lower.contains("invalid utf-8")
        || lower.contains("invalid utf8")
        || lower.contains("流中包含无效的 utf-8")
    {
        return "文件编码无法识别，请尝试按其他编码打开".to_string();
    }
    if lower.contains("文件名太长") || lower.contains("file name too long") {
        return "文件路径过长".to_string();
    }
    if lower.contains("broken pipe") {
        return "通信管道已断开".to_string();
    }
    "操作失败".to_string()
}
