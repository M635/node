import { useState, useMemo } from "react";
import * as Monaco from "monaco-editor";

interface LanguageSelectorProps {
  currentLanguage: string;
  onSelect: (language: string) => void;
  onClose: () => void;
}

const LANGUAGE_GROUPS: { group: string; languages: { id: string; name: string }[] }[] = [
  {
    group: "常用",
    languages: [
      { id: "plaintext", name: "纯文本" },
      { id: "markdown", name: "Markdown" },
      { id: "javascript", name: "JavaScript" },
      { id: "typescript", name: "TypeScript" },
      { id: "python", name: "Python" },
      { id: "java", name: "Java" },
      { id: "c", name: "C" },
      { id: "cpp", name: "C++" },
      { id: "csharp", name: "C#" },
      { id: "go", name: "Go" },
      { id: "rust", name: "Rust" },
      { id: "php", name: "PHP" },
      { id: "ruby", name: "Ruby" },
      { id: "swift", name: "Swift" },
      { id: "kotlin", name: "Kotlin" },
      { id: "sql", name: "SQL" },
      { id: "html", name: "HTML" },
      { id: "css", name: "CSS" },
      { id: "json", name: "JSON" },
      { id: "xml", name: "XML" },
      { id: "yaml", name: "YAML" },
      { id: "shell", name: "Shell" },
      { id: "dockerfile", name: "Dockerfile" },
    ],
  },
  {
    group: "前端",
    languages: [
      { id: "javascript", name: "JavaScript" },
      { id: "typescript", name: "TypeScript" },
      { id: "jsx", name: "JSX" },
      { id: "tsx", name: "TSX" },
      { id: "html", name: "HTML" },
      { id: "css", name: "CSS" },
      { id: "scss", name: "SCSS" },
      { id: "less", name: "Less" },
      { id: "vue", name: "Vue" },
      { id: "svelte", name: "Svelte" },
    ],
  },
  {
    group: "后端",
    languages: [
      { id: "java", name: "Java" },
      { id: "kotlin", name: "Kotlin" },
      { id: "scala", name: "Scala" },
      { id: "go", name: "Go" },
      { id: "rust", name: "Rust" },
      { id: "python", name: "Python" },
      { id: "ruby", name: "Ruby" },
      { id: "php", name: "PHP" },
      { id: "csharp", name: "C#" },
      { id: "dart", name: "Dart" },
    ],
  },
  {
    group: "数据",
    languages: [
      { id: "json", name: "JSON" },
      { id: "xml", name: "XML" },
      { id: "yaml", name: "YAML" },
      { id: "toml", name: "TOML" },
      { id: "ini", name: "INI" },
      { id: "csv", name: "CSV" },
      { id: "sql", name: "SQL" },
      { id: "graphql", name: "GraphQL" },
    ],
  },
  {
    group: "脚本",
    languages: [
      { id: "shell", name: "Shell/Bash" },
      { id: "powershell", name: "PowerShell" },
      { id: "perl", name: "Perl" },
      { id: "lua", name: "Lua" },
      { id: "r", name: "R" },
      { id: "javascript", name: "JavaScript" },
      { id: "python", name: "Python" },
    ],
  },
  {
    group: "其他",
    languages: [
      { id: "plaintext", name: "纯文本" },
      { id: "markdown", name: "Markdown" },
      { id: "dockerfile", name: "Dockerfile" },
      { id: "makefile", name: "Makefile" },
      { id: "vim", name: "Vim Script" },
      { id: "latex", name: "LaTeX" },
      { id: "assembly", name: "Assembly" },
      { id: "fortran", name: "Fortran" },
      { id: "pascal", name: "Pascal" },
      { id: "cobol", name: "COBOL" },
    ],
  },
];

export function LanguageSelector({ currentLanguage, onSelect, onClose }: LanguageSelectorProps) {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    if (!filter) return LANGUAGE_GROUPS;
    return LANGUAGE_GROUPS.map((g) => ({
      ...g,
      languages: g.languages.filter((l) => l.name.toLowerCase().includes(filter.toLowerCase()) || l.id.toLowerCase().includes(filter.toLowerCase())),
    })).filter((g) => g.languages.length > 0);
  }, [filter]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog language-selector-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>选择语言</h3>
          <input
            type="text"
            className="language-filter"
            placeholder="搜索语言..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
          />
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="current-language">
            当前: <strong>{currentLanguage}</strong>
          </div>
          {filtered.map((g) => (
            <div key={g.group} className="language-group">
              <h4>{g.group}</h4>
              <div className="language-items">
                {g.languages.map((l) => (
                  <button
                    key={`${g.group}-${l.id}-${l.name}`}
                    className={`language-item ${l.id === currentLanguage ? "active" : ""}`}
                    onClick={() => { onSelect(l.id); onClose(); }}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
