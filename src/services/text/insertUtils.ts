export class InsertUtils {
  static dateTime(format: "short" | "long" | "iso" | "time" | "date" | "custom" = "short", customFormat?: string): string {
    const now = new Date();
    switch (format) {
      case "short":
        return now.toLocaleString();
      case "long":
        return now.toLocaleString(undefined, {
          year: "numeric", month: "long", day: "numeric",
          hour: "2-digit", minute: "2-digit", second: "2-digit",
        });
      case "iso":
        return now.toISOString();
      case "time":
        return now.toLocaleTimeString();
      case "date":
        return now.toLocaleDateString();
      case "custom":
        if (customFormat) return formatCustomDate(now, customFormat);
        return now.toLocaleString();
      default:
        return now.toLocaleString();
    }
  }

  static specialCharacters(): { name: string; char: string; category: string }[] {
    return [
      { name: "换行符", char: "\n", category: "控制" },
      { name: "制表符", char: "\t", category: "控制" },
      { name: "回车符", char: "\r", category: "控制" },
      { name: "空格", char: " ", category: "控制" },
      { name: "不间断空格", char: "\u00A0", category: "控制" },
      { name: "零宽空格", char: "\u200B", category: "控制" },
      { name: "左箭头", char: "←", category: "箭头" },
      { name: "右箭头", char: "→", category: "箭头" },
      { name: "上箭头", char: "↑", category: "箭头" },
      { name: "下箭头", char: "↓", category: "箭头" },
      { name: "双左箭头", char: "⇐", category: "箭头" },
      { name: "双右箭头", char: "⇒", category: "箭头" },
      { name: "双上箭头", char: "⇑", category: "箭头" },
      { name: "双下箭头", char: "⇓", category: "箭头" },
      { name: "度", char: "°", category: "数学" },
      { name: "±", char: "±", category: "数学" },
      { name: "×", char: "×", category: "数学" },
      { name: "÷", char: "÷", category: "数学" },
      { name: "≈", char: "≈", category: "数学" },
      { name: "≠", char: "≠", category: "数学" },
      { name: "≤", char: "≤", category: "数学" },
      { name: "≥", char: "≥", category: "数学" },
      { name: "∞", char: "∞", category: "数学" },
      { name: "√", char: "√", category: "数学" },
      { name: "∑", char: "∑", category: "数学" },
      { name: "∏", char: "∏", category: "数学" },
      { name: "∫", char: "∫", category: "数学" },
      { name: "π", char: "π", category: "数学" },
      { name: "©", char: "©", category: "符号" },
      { name: "®", char: "®", category: "符号" },
      { name: "™", char: "™", category: "符号" },
      { name: "€", char: "€", category: "货币" },
      { name: "£", char: "£", category: "货币" },
      { name: "¥", char: "¥", category: "货币" },
      { name: "¢", char: "¢", category: "货币" },
      { name: "①", char: "①", category: "数字" },
      { name: "②", char: "②", category: "数字" },
      { name: "③", char: "③", category: "数字" },
      { name: "④", char: "④", category: "数字" },
      { name: "⑤", char: "⑤", category: "数字" },
      { name: "⑥", char: "⑥", category: "数字" },
      { name: "⑦", char: "⑦", category: "数字" },
      { name: "⑧", char: "⑧", category: "数字" },
      { name: "⑨", char: "⑨", category: "数字" },
      { name: "⑩", char: "⑩", category: "数字" },
      { name: "★", char: "★", category: "图形" },
      { name: "☆", char: "☆", category: "图形" },
      { name: "●", char: "●", category: "图形" },
      { name: "○", char: "○", category: "图形" },
      { name: "◆", char: "◆", category: "图形" },
      { name: "◇", char: "◇", category: "图形" },
      { name: "■", char: "■", category: "图形" },
      { name: "□", char: "□", category: "图形" },
      { name: "▲", char: "▲", category: "图形" },
      { name: "△", char: "△", category: "图形" },
      { name: "▼", char: "▼", category: "图形" },
      { name: "▽", char: "▽", category: "图形" },
      { name: "✓", char: "✓", category: "图形" },
      { name: "✗", char: "✗", category: "图形" },
      { name: "♥", char: "♥", category: "图形" },
      { name: "♦", char: "♦", category: "图形" },
      { name: "♣", char: "♣", category: "图形" },
      { name: "♠", char: "♠", category: "图形" },
    ];
  }

  static colorToHex(r: number, g: number, b: number): string {
    return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
  }

  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const match = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!match) return null;
    return {
      r: parseInt(match[1], 16),
      g: parseInt(match[2], 16),
      b: parseInt(match[3], 16),
    };
  }

  static rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
}

function formatCustomDate(date: Date, format: string): string {
  const replacements: Record<string, string> = {
    "YYYY": String(date.getFullYear()),
    "MM": String(date.getMonth() + 1).padStart(2, "0"),
    "DD": String(date.getDate()).padStart(2, "0"),
    "HH": String(date.getHours()).padStart(2, "0"),
    "mm": String(date.getMinutes()).padStart(2, "0"),
    "ss": String(date.getSeconds()).padStart(2, "0"),
    "SSS": String(date.getMilliseconds()).padStart(3, "0"),
  };
  let result = format;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(key, "g"), value);
  }
  return result;
}
