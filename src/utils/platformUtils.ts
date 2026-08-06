export function isMacOS(): boolean {
  if (typeof navigator !== "undefined") {
    return navigator.platform.toLowerCase().includes("mac");
  }
  return false;
}

export function isWindows(): boolean {
  if (typeof navigator !== "undefined") {
    return navigator.platform.toLowerCase().includes("win");
  }
  return false;
}

export function isLinux(): boolean {
  if (typeof navigator !== "undefined") {
    return navigator.platform.toLowerCase().includes("linux");
  }
  return false;
}

export function getModifierKey(): string {
  return isMacOS() ? "Cmd" : "Ctrl";
}

export function getAltKey(): string {
  return isMacOS() ? "Option" : "Alt";
}

export function normalizeLineEndings(text: string, to: "lf" | "crlf"): string {
  if (to === "lf") {
    return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n/g, "\r\n");
}

export function detectLineEnding(text: string): "lf" | "crlf" | "mixed" {
  const hasCrlf = text.includes("\r\n");
  const hasLf = text.includes("\n") && !hasCrlf;
  const hasBareLf = text.replace("\r\n", "").includes("\n");

  if (hasCrlf && hasBareLf) return "mixed";
  if (hasCrlf) return "crlf";
  if (hasLf || hasBareLf) return "lf";
  return "lf";
}

export function getPathSeparator(): string {
  return isWindows() ? "\\" : "/";
}

export function joinPath(...parts: string[]): string {
  const sep = getPathSeparator();
  return parts.join(sep).replace(new RegExp(`${sep}${sep}+`, "g"), sep);
}
