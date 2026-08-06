import type * as Monaco from "monaco-editor";

const LANGUAGE_MAP: Record<string, string> = {
  txt: "plaintext",
  text: "plaintext",
  log: "plaintext",
  md: "markdown",
  markdown: "markdown",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  tsx: "typescript",
  json: "json",
  jsonc: "json",
  html: "html",
  htm: "html",
  xml: "xml",
  svg: "xml",
  css: "css",
  scss: "scss",
  sass: "scss",
  less: "less",
  py: "python",
  pyw: "python",
  rb: "ruby",
  php: "php",
  java: "java",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hpp: "cpp",
  hxx: "cpp",
  cs: "csharp",
  go: "go",
  rs: "rust",
  swift: "swift",
  kt: "kotlin",
  kts: "kotlin",
  scala: "scala",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  fish: "shell",
  bat: "bat",
  cmd: "bat",
  ps1: "powershell",
  sql: "sql",
  yaml: "yaml",
  yml: "yaml",
  toml: "ini",
  ini: "ini",
  conf: "ini",
  cfg: "ini",
  dockerfile: "dockerfile",
  makefile: "makefile",
  vue: "html",
  svelte: "html",
  graphql: "graphql",
  gql: "graphql",
  lua: "lua",
  r: "r",
  dart: "dart",
  pl: "perl",
  pm: "perl",
  clj: "clojure",
  ex: "elixir",
  exs: "elixir",
  erl: "erlang",
  fs: "fsharp",
  fsx: "fsharp",
  ml: "ocaml",
  nim: "nim",
  zig: "zig",
  v: "verilog",
  vh: "verilog",
  vhd: "vhdl",
  vhdl: "vhdl",
  asm: "asm",
  s: "asm",
  wasm: "wasm",
  proto: "proto",
  thrift: "thrift",
  dartboard: "plaintext",
  csv: "plaintext",
  tsv: "plaintext",
};

export function getLanguageFromPath(path: string): string {
  const filename = path.split(/[/\\]/).pop() || "";
  const lower = filename.toLowerCase();

  if (lower === "dockerfile" || lower.startsWith("dockerfile.")) {
    return "dockerfile";
  }
  if (lower === "makefile" || lower === "gnumakefile") {
    return "makefile";
  }
  if (lower === ".gitignore" || lower === ".dockerignore") {
    return "plaintext";
  }
  if (lower === ".bashrc" || lower === ".zshrc" || lower === ".profile") {
    return "shell";
  }

  const ext = lower.split(".").pop() || "";
  return LANGUAGE_MAP[ext] || "plaintext";
}

export function configureLanguages(monaco: typeof Monaco): void {
  monaco.languages.registerCompletionItemProvider("plaintext", {
    provideCompletionItems: () => ({ suggestions: [] }),
  });

  monaco.languages.setLanguageConfiguration("plaintext", {
    comments: { lineComment: "#" },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"', notIn: ["string"] },
      { open: "'", close: "'", notIn: ["string", "comment"] },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  });
}

export function getSupportedExtensions(): string[] {
  return Object.keys(LANGUAGE_MAP);
}
