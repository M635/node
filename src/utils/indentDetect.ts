export interface IndentInfo {
  useTabs: boolean;
  tabSize: number;
  insertSpaces: boolean;
}

export function detectIndent(content: string): IndentInfo {
  const lines = content.split("\n");
  let tabCount = 0;
  let spaceCount = 0;
  const spaceIndentCounts = new Map<number, number>();

  for (const line of lines) {
    const match = line.match(/^(\t+|\s+)/);
    if (!match) continue;
    const indent = match[1];
    if (indent.includes("\t")) {
      tabCount++;
    } else {
      spaceCount++;
      const indentLen = indent.length;
      if (indentLen > 0 && indentLen <= 8) {
        spaceIndentCounts.set(indentLen, (spaceIndentCounts.get(indentLen) || 0) + 1);
      }
    }
  }

  if (tabCount > spaceCount && tabCount > 0) {
    return { useTabs: true, tabSize: 4, insertSpaces: false };
  }

  let bestSize = 4;
  let bestCount = 0;
  for (const [size, count] of spaceIndentCounts) {
    if (count > bestCount) {
      bestCount = count;
      bestSize = size;
    }
  }

  if (bestSize === 2 || bestSize === 4 || bestSize === 8) {
    return { useTabs: false, tabSize: bestSize, insertSpaces: true };
  }

  return { useTabs: false, tabSize: 4, insertSpaces: true };
}
