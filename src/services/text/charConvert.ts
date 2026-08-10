export class CharConvert {
  static toFullWidth(text: string): string {
    return text.replace(/[\x20-\x7e]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0xfee0)).replace(/ /g, "\u3000");
  }

  static toHalfWidth(text: string): string {
    return text.replace(/[\uff00-\uff5e]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/\u3000/g, " ");
  }

  static removeNonPrintable(text: string): string {
    return text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "");
  }

  static normalizeNFC(text: string): string {
    return text.normalize("NFC");
  }

  static normalizeNFD(text: string): string {
    return text.normalize("NFD");
  }

  static normalizeNFKC(text: string): string {
    return text.normalize("NFKC");
  }

  static normalizeNFKD(text: string): string {
    return text.normalize("NFKD");
  }

  static showEol(text: string): string {
    return text.replace(/\r\n/g, "↵\r\n").replace(/\r/g, "↵\r").replace(/\n/g, "↵\n");
  }

  static hideEol(text: string): string {
    return text.replace(/↵/g, "");
  }

  static showWhitespace(text: string): string {
    return text.replace(/ /g, "·").replace(/\t/g, "→");
  }

  static hideWhitespace(text: string): string {
    return text.replace(/·/g, " ").replace(/→/g, "\t");
  }

  static detectIndentation(text: string): { usesTabs: boolean; usesSpaces: boolean; tabSize: number; mixed: boolean } {
    const lines = text.split("\n").slice(0, 100);
    let tabCount = 0;
    let spaceCount = 0;
    const spaceSequences: Record<number, number> = {};

    for (const line of lines) {
      const match = line.match(/^(\s+)/);
      if (!match) continue;
      const indent = match[1];
      if (indent.includes("\t")) tabCount++;
      if (indent.includes(" ")) {
        spaceCount++;
        const spaces = indent.replace(/\t/g, "");
        if (spaces.length > 0) {
          spaceSequences[spaces.length] = (spaceSequences[spaces.length] || 0) + 1;
        }
      }
    }

    let tabSize = 4;
    let maxCount = 0;
    for (const [size, count] of Object.entries(spaceSequences)) {
      if (count > maxCount) { maxCount = count; tabSize = parseInt(size); }
    }
    if (tabSize <= 1) tabSize = 4;

    const usesTabs = tabCount > 0;
    const usesSpaces = spaceCount > 0;
    const mixed = usesTabs && usesSpaces;

    return { usesTabs, usesSpaces, tabSize, mixed };
  }

  static toSnakeCase(text: string): string {
    return text.replace(/([A-Z])/g, "_$1").replace(/^_/, "").toLowerCase();
  }

  static toCamelCase(text: string): string {
    return text.replace(/_([a-z])/g, (_, c) => c.toUpperCase()).replace(/^([A-Z])/, (_, c) => c.toLowerCase());
  }

  static toPascalCase(text: string): string {
    const camel = this.toCamelCase(text);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }

  static toKebabCase(text: string): string {
    return text.replace(/([A-Z])/g, "-$1").replace(/^-/, "").toLowerCase().replace(/_/g, "-");
  }

  static toConstantCase(text: string): string {
    return this.toSnakeCase(text).toUpperCase();
  }

  static toDotCase(text: string): string {
    return this.toKebabCase(text).replace(/-/g, ".");
  }

  static toPathCase(text: string): string {
    return this.toKebabCase(text).replace(/-/g, "/");
  }
}
