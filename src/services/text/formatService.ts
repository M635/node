export class FormatService {
  static formatJSON(text: string, indent: number = 2): { result: string; error: string | null } {
    try {
      const parsed = JSON.parse(text);
      return { result: JSON.stringify(parsed, null, indent), error: null };
    } catch (e) {
      return { result: text, error: `JSON 解析错误: ${(e as Error).message}` };
    }
  }

  static validateJSON(text: string): { valid: boolean; error: string | null } {
    try {
      JSON.parse(text);
      return { valid: true, error: null };
    } catch (e) {
      return { valid: false, error: (e as Error).message };
    }
  }

  static formatXML(text: string): { result: string; error: string | null } {
    try {
      const result = formatXMLInternal(text);
      return { result, error: null };
    } catch (e) {
      return { result: text, error: `XML 格式化错误: ${(e as Error).message}` };
    }
  }

  static formatHTML(text: string): { result: string; error: string | null } {
    try {
      const result = formatHTMLInternal(text);
      return { result, error: null };
    } catch (e) {
      return { result: text, error: `HTML 格式化错误: ${(e as Error).message}` };
    }
  }

  static formatCSS(text: string): { result: string; error: string | null } {
    try {
      const result = formatCSSInternal(text);
      return { result, error: null };
    } catch (e) {
      return { result: text, error: `CSS 格式化错误: ${(e as Error).message}` };
    }
  }

  static formatSQL(text: string): { result: string; error: string | null } {
    try {
      const result = formatSQLInternal(text);
      return { result, error: null };
    } catch (e) {
      return { result: text, error: `SQL 格式化错误: ${(e as Error).message}` };
    }
  }

  static minifyJSON(text: string): { result: string; error: string | null } {
    try {
      const parsed = JSON.parse(text);
      return { result: JSON.stringify(parsed), error: null };
    } catch (e) {
      return { result: text, error: `JSON 解析错误: ${(e as Error).message}` };
    }
  }

  static formatByLanguage(language: string, text: string): { result: string; error: string | null } {
    switch (language.toLowerCase()) {
      case "json": return this.formatJSON(text);
      case "xml": return this.formatXML(text);
      case "html": return this.formatHTML(text);
      case "css": case "scss": case "less": return this.formatCSS(text);
      case "sql": return this.formatSQL(text);
      default: return { result: text, error: "不支持的语言格式化" };
    }
  }
}

function formatXMLInternal(xml: string): string {
  const PADDING = "  ";
  let formatted = "";
  let pad = 0;
  const reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, "$1\n$2$3");
  const lines = xml.split("\n");
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    let indent = 0;
    if (line.match(/^<\/\w/)) {
      pad -= 1;
    } else if (line.match(/^<\w[^>]*[^\/]>.*$/) && !line.match(/<\/\w/)) {
      indent = 1;
    }
    formatted += PADDING.repeat(Math.max(pad, 0)) + line + "\n";
    pad += indent;
  }
  return formatted.trim();
}

function formatHTMLInternal(html: string): string {
  const PADDING = "  ";
  let formatted = "";
  let pad = 0;
  const reg = /(>)(<)(\/*)/g;
  html = html.replace(reg, "$1\n$2$3");
  const lines = html.split("\n");
  const voidElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    let indent = 0;
    if (line.match(/^<\/\w/)) {
      pad -= 1;
    } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
      const tagName = line.match(/^<(\w+)/)?.[1]?.toLowerCase() || "";
      if (!voidElements.includes(tagName) && !line.match(/<\/\w/)) {
        indent = 1;
      }
    }
    formatted += PADDING.repeat(Math.max(pad, 0)) + line + "\n";
    pad += indent;
  }
  return formatted.trim();
}

function formatCSSInternal(css: string): string {
  const PADDING = "  ";
  let formatted = "";
  let pad = 0;
  css = css.replace(/\s*{\s*/g, " {\n").replace(/\s*}\s*/g, "\n}\n").replace(/\s*;\s*/g, ";\n").replace(/\s*:\s*/g, ": ");
  css = css.replace(/\n\s*\n/g, "\n");
  const lines = css.split("\n");
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (line.includes("}")) {
      pad = Math.max(0, pad - 1);
    }
    formatted += PADDING.repeat(pad) + line + "\n";
    if (line.includes("{") && !line.includes("}")) {
      pad += 1;
    }
  }
  return formatted.trim();
}

function formatSQLInternal(sql: string): string {
  const keywords = ["SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "AND", "OR", "NOT", "IN", "EXISTS", "GROUP", "ORDER", "BY", "HAVING", "LIMIT", "OFFSET", "UNION", "ALL", "AS", "SET", "VALUES", "INTO", "TABLE", "INDEX", "VIEW", "DISTINCT", "CASE", "WHEN", "THEN", "ELSE", "END", "IF", "BEGIN", "COMMIT", "ROLLBACK"];
  let formatted = sql.replace(/\s+/g, " ").trim();
  for (const kw of keywords) {
    const regex = new RegExp(`\\b${kw}\\b`, "gi");
    formatted = formatted.replace(regex, kw);
  }
  for (const kw of ["FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "VALUES", "SET", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "UNION ALL", "UNION"]) {
    const regex = new RegExp(`\\s${kw}\\s`, "gi");
    formatted = formatted.replace(regex, `\n${kw} `);
  }
  formatted = formatted.replace(/\s*,\s*/g, ",\n    ");
  return formatted.trim();
}
