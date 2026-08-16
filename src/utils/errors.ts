import { useI18n } from "../stores/i18nStore";

/**
 * 把底层错误转换为面向用户的中文提示。
 * 原则：普通用户只看到中文提示；完整原始错误信息只写入调试日志。
 */
export function describeError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  const mapped = mapErrorMessage(raw);
  // 原始错误只进调试日志，不展示给用户
  if (raw && raw !== mapped) {
    console.debug("[MarkPT][调试] 原始错误:", raw);
  }
  return mapped;
}

/**
 * 常见英文/系统错误文本 → 中文提示映射。
 * 若后端已经返回中文提示（包含汉字），则直接使用。
 */
function mapErrorMessage(raw: string): string {
  const text = raw.trim();
  if (!text) return useI18n.getState().t("errors.unknown");

  // 后端已返回中文提示时直接使用
  if (/[\u4e00-\u9fa5]/.test(text)) {
    // 清理 Rust/JS 异常里常见的英文前缀，避免中文句子里夹杂英文术语
    return text
      .replace(/^Error:\s*/i, "错误：")
      .replace(/^TypeError:\s*/i, "类型错误：")
      .replace(/^RangeError:\s*/i, "范围错误：")
      .replace(/^ReferenceError:\s*/i, "引用错误：")
      .replace(/^SyntaxError:\s*/i, "语法错误：");
  }

  const lower = text.toLowerCase();
  if (lower.includes("not found") || lower.includes("no such file")) {
    return "文件或目录不存在";
  }
  if (lower.includes("permission denied") || lower.includes("permission was denied")) {
    return "没有访问权限";
  }
  if (lower.includes("already exists")) {
    return "文件或目录已存在";
  }
  if (lower.includes("is a directory")) {
    return "目标是一个目录，无法按文件处理";
  }
  if (lower.includes("disk full") || lower.includes("no space left")) {
    return "磁盘空间不足";
  }
  if (lower.includes("invalid utf-8") || lower.includes("invalid utf8")) {
    return "文件编码无法识别，请尝试按其他编码打开";
  }
  if (lower.includes("file name too long")) {
    return "文件路径过长";
  }
  if (lower.includes("broken pipe")) {
    return "通信管道已断开";
  }
  if (lower.includes("regex") || lower.includes("regular expression")) {
    return "正则表达式无效";
  }
  return useI18n.getState().t("errors.unknown");
}

/** 以弹窗形式展示友好错误（自动拼接上下文 + 中文原因）。 */
export function showError(
  contextKey: string,
  err: unknown,
  params?: Record<string, string | number>
): void {
  const { t } = useI18n.getState();
  const message = `${t(contextKey, params)}：${describeError(err)}`;
  alert(message);
}
