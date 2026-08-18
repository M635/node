import { useState, useMemo } from "react";
import * as Monaco from "monaco-editor";
import { useI18n } from "../../stores/i18nStore";
import { useEscapeClose } from "../../hooks/useEscapeClose";

interface LanguageSelectorProps {
  currentLanguage: string;
  onSelect: (language: string) => void;
  onClose: () => void;
}

// 分组名使用 i18n 键，展示时再翻译
const LANGUAGE_GROUPS: { groupKey: string; languages: { id: string; name: string }[] }[] = [
  {
    groupKey: "lang.group.common",
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
    groupKey: "lang.group.frontend",
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
    groupKey: "lang.group.backend",
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
    groupKey: "lang.group.data",
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
    groupKey: "lang.group.script",
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
    groupKey: "lang.group.other",
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
  const { t } = useI18n();
  useEscapeClose(onClose);
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
          <h3>{t("dialog.languageSelector")}</h3>
          <input
            type="text"
            className="language-filter"
            placeholder={t("lang.searchPlaceholder")}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
          />
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="current-language">
            {t("lang.current", { language: currentLanguage })}
          </div>
          {filtered.map((g) => (
            <div key={g.groupKey} className="language-group">
              <h4>{t(g.groupKey)}</h4>
              <div className="language-items">
                {g.languages.map((l) => (
                  <button
                    key={`${g.groupKey}-${l.id}-${l.name}`}
                    className={`language-item ${l.id === currentLanguage ? "active" : ""}`}
                    onClick={() => { onSelect(l.id); onClose(); }}
                  >
                    {t(`lang.name.${l.id}`, undefined, l.name)}
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
