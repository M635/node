export class TextTransform {
  static toBase64(text: string): string {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  static fromBase64(text: string): string {
    try {
      const binary = atob(text);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const decoder = new TextDecoder();
      return decoder.decode(bytes);
    } catch {
      return "无效的 Base64 字符串";
    }
  }

  static urlEncode(text: string): string {
    return encodeURIComponent(text);
  }

  static urlDecode(text: string): string {
    try {
      return decodeURIComponent(text);
    } catch {
      return "无效的 URL 编码字符串";
    }
  }

  static rot13(text: string): string {
    return text.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    });
  }

  static toHex(text: string): string {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join(" ");
  }

  static fromHex(text: string): string {
    const hex = text.replace(/\s/g, "");
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }

  static md5(text: string): string {
    return md5Hash(text);
  }

  static sha256(text: string): Promise<string> {
    return sha256Hash(text);
  }

  static eolConvert(text: string, target: "lf" | "crlf" | "cr"): string {
    const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    if (target === "lf") return normalized;
    if (target === "crlf") return normalized.replace(/\n/g, "\r\n");
    return normalized.replace(/\n/g, "\r");
  }

  static tabsToSpaces(text: string, tabSize: number): string {
    return text.replace(/\t/g, " ".repeat(tabSize));
  }

  static spacesToTabs(text: string, tabSize: number): string {
    const spaces = " ".repeat(tabSize);
    return text.replace(new RegExp(spaces, "g"), "\t");
  }

  static removeTrailingWhitespace(text: string): string {
    return text.split("\n").map((line) => line.replace(/\s+$/, "")).join("\n");
  }

  static removeLeadingWhitespace(text: string): string {
    return text.split("\n").map((line) => line.replace(/^\s+/, "")).join("\n");
  }

  static removeAllWhitespace(text: string): string {
    return text.replace(/\s/g, "");
  }

  static collapseWhitespace(text: string): string {
    return text.replace(/\s+/g, " ");
  }

  static reverseText(text: string): string {
    return text.split("").reverse().join("");
  }

  static reverseLines(text: string): string {
    return text.split("\n").reverse().join("\n");
  }

  static addLineNumberPrefix(text: string, startLine: number = 1): string {
    return text.split("\n").map((line, i) => `${startLine + i}: ${line}`).join("\n");
  }

  static removeLineNumberPrefix(text: string): string {
    return text.split("\n").map((line) => line.replace(/^\d+:\s/, "")).join("\n");
  }

  static countLines(text: string): number {
    return text.split("\n").length;
  }

  static countWords(text: string): number {
    return (text.match(/\S+/g) || []).length;
  }

  static countChars(text: string, includeSpaces: boolean = true): number {
    return includeSpaces ? text.length : text.replace(/\s/g, "").length;
  }
}

async function sha256Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function md5Hash(text: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  return md5ArrayBuffer(bytes);
}

function md5ArrayBuffer(bytes: Uint8Array): string {
  const s: number[] = [];
  for (let i = 0; i < 64; i++) {
    s[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
  }

  const words: number[] = [];
  const len = bytes.length;
  for (let i = 0; i < len * 8; i += 8) {
    words[i >> 5] |= (bytes[i / 8] || 0) << (i % 32);
  }
  words[len * 8 >> 5] |= 0x80 << (len * 8 % 32);
  words[(((len + 8) >>> 6) + 1) * 16 - 2] = len * 8;

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let i = 0; i < words.length; i += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d;

    a = ff(a, b, c, d, words[i], s[0], 7);
    d = ff(d, a, b, c, words[i + 1], s[1], 12);
    c = ff(c, d, a, b, words[i + 2], s[2], 17);
    b = ff(b, c, d, a, words[i + 3], s[3], 22);
    a = ff(a, b, c, d, words[i + 4], s[4], 7);
    d = ff(d, a, b, c, words[i + 5], s[5], 12);
    c = ff(c, d, a, b, words[i + 6], s[6], 17);
    b = ff(b, c, d, a, words[i + 7], s[7], 22);
    a = ff(a, b, c, d, words[i + 8], s[8], 7);
    d = ff(d, a, b, c, words[i + 9], s[9], 12);
    c = ff(c, d, a, b, words[i + 10], s[10], 17);
    b = ff(b, c, d, a, words[i + 11], s[11], 22);
    a = ff(a, b, c, d, words[i + 12], s[12], 7);
    d = ff(d, a, b, c, words[i + 13], s[13], 12);
    c = ff(c, d, a, b, words[i + 14], s[14], 17);
    b = ff(b, c, d, a, words[i + 15], s[15], 22);

    a = gg(a, b, c, d, words[i + 1], s[16], 5);
    d = gg(d, a, b, c, words[i + 6], s[17], 9);
    c = gg(c, d, a, b, words[i + 11], s[18], 14);
    b = gg(b, c, d, a, words[i], s[19], 20);
    a = gg(a, b, c, d, words[i + 5], s[20], 5);
    d = gg(d, a, b, c, words[i + 10], s[21], 9);
    c = gg(c, d, a, b, words[i + 15], s[22], 14);
    b = gg(b, c, d, a, words[i + 4], s[23], 20);
    a = gg(a, b, c, d, words[i + 9], s[24], 5);
    d = gg(d, a, b, c, words[i + 14], s[25], 9);
    c = gg(c, d, a, b, words[i + 3], s[26], 14);
    b = gg(b, c, d, a, words[i + 8], s[27], 20);
    a = gg(a, b, c, d, words[i + 13], s[28], 5);
    d = gg(d, a, b, c, words[i + 2], s[29], 9);
    c = gg(c, d, a, b, words[i + 7], s[30], 14);
    b = gg(b, c, d, a, words[i + 12], s[31], 20);

    a = hh(a, b, c, d, words[i + 5], s[32], 4);
    d = hh(d, a, b, c, words[i + 8], s[33], 11);
    c = hh(c, d, a, b, words[i + 11], s[34], 16);
    b = hh(b, c, d, a, words[i + 14], s[35], 23);
    a = hh(a, b, c, d, words[i + 1], s[36], 4);
    d = hh(d, a, b, c, words[i + 4], s[37], 11);
    c = hh(c, d, a, b, words[i + 7], s[38], 16);
    b = hh(b, c, d, a, words[i + 10], s[39], 23);
    a = hh(a, b, c, d, words[i + 13], s[40], 4);
    d = hh(d, a, b, c, words[i], s[41], 11);
    c = hh(c, d, a, b, words[i + 3], s[42], 16);
    b = hh(b, c, d, a, words[i + 6], s[43], 23);
    a = hh(a, b, c, d, words[i + 9], s[44], 4);
    d = hh(d, a, b, c, words[i + 12], s[45], 11);
    c = hh(c, d, a, b, words[i + 15], s[46], 16);
    b = hh(b, c, d, a, words[i + 2], s[47], 23);

    a = ii(a, b, c, d, words[i], s[48], 6);
    d = ii(d, a, b, c, words[i + 7], s[49], 10);
    c = ii(c, d, a, b, words[i + 14], s[50], 15);
    b = ii(b, c, d, a, words[i + 5], s[51], 21);
    a = ii(a, b, c, d, words[i + 12], s[52], 6);
    d = ii(d, a, b, c, words[i + 3], s[53], 10);
    c = ii(c, d, a, b, words[i + 10], s[54], 15);
    b = ii(b, c, d, a, words[i + 1], s[55], 21);
    a = ii(a, b, c, d, words[i + 8], s[56], 6);
    d = ii(d, a, b, c, words[i + 15], s[57], 10);
    c = ii(c, d, a, b, words[i + 6], s[58], 15);
    b = ii(b, c, d, a, words[i + 13], s[59], 21);
    a = ii(a, b, c, d, words[i + 4], s[60], 6);
    d = ii(d, a, b, c, words[i + 11], s[61], 10);
    c = ii(c, d, a, b, words[i + 2], s[62], 15);
    b = ii(b, c, d, a, words[i + 9], s[63], 21);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }

  return [a, b, c, d].map((n) => {
    const bytes = [];
    for (let i = 0; i < 4; i++) {
      bytes[i] = (n >>> (i * 8)) & 0xff;
    }
    return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  }).join("");
}

function add(x: number, y: number): number {
  return (x + y) & 0xffffffff;
}

function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
  a = add(add(a, q), add(x, t));
  return add((a << s) | (a >>> (32 - s)), b);
}

function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return cmn((b & c) | (~b & d), a, b, x, s, t);
}

function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return cmn((b & d) | (c & ~d), a, b, x, s, t);
}

function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
}
