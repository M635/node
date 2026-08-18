import { useState, useMemo } from "react";
import { useI18n } from "../../stores/i18nStore";
import { useEscapeClose } from "../../hooks/useEscapeClose";

interface RegexTesterProps {
  onClose: () => void;
}

interface TestMatch {
  index: number;
  match: string;
  groups: string[];
}

export function RegexTester({ onClose }: RegexTesterProps) {
  const { t } = useI18n();
  useEscapeClose(onClose);
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("");
  const [invalid, setInvalid] = useState(false);

  const matches = useMemo<TestMatch[]>(() => {
    if (!pattern) return [];
    try {
      const regex = new RegExp(pattern, flags);
      const result: TestMatch[] = [];
      let match;
      let count = 0;
      while ((match = regex.exec(testText)) !== null && count < 1000) {
        result.push({
          index: match.index,
          match: match[0],
          groups: match.slice(1).map((g) => g || ""),
        });
        if (match.index === regex.lastIndex) regex.lastIndex++;
        count++;
      }
      setInvalid(false);
      return result;
    } catch (e) {
      // 原始错误仅进调试日志，界面只展示中文提示
      console.debug("[MarkPT][调试] 正则表达式无效:", e);
      setInvalid(true);
      return [];
    }
  }, [pattern, flags, testText]);

  const highlightedText = useMemo(() => {
    if (!pattern || invalid || matches.length === 0) return testText;
    let result = "";
    let lastIndex = 0;
    for (const m of matches) {
      result += escapeHtml(testText.slice(lastIndex, m.index));
      result += `<mark>${escapeHtml(m.match)}</mark>`;
      lastIndex = m.index + m.match.length;
    }
    result += escapeHtml(testText.slice(lastIndex));
    return result;
  }, [pattern, invalid, matches, testText]);

  const commonPatterns = [
    { key: "regex.patternEmail", value: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
    { key: "regex.patternUrl", value: "https?://[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*" },
    { key: "regex.patternIp", value: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
    { key: "regex.patternPhone", value: "1[3-9]\\d{9}" },
    { key: "regex.patternIdCard", value: "\\d{17}[\\dXx]" },
    { key: "regex.patternDate", value: "\\d{4}[-/]\\d{2}[-/]\\d{2}" },
    { key: "regex.patternHtmlTag", value: "<\\/?[a-zA-Z][^>]*>" },
    { key: "regex.patternChinese", value: "[\\u4e00-\\u9fa5]" },
  ];

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog regex-tester-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{t("dialog.regexTester")}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="regex-pattern-row">
            <span className="regex-slash">/</span>
            <input
              type="text"
              className="regex-pattern-input"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t("regex.placeholder")}
              autoFocus
            />
            <span className="regex-slash">/</span>
            <input
              type="text"
              className="regex-flags-input"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder={t("regex.flags")}
            />
          </div>

          <div className="regex-common-patterns">
            {commonPatterns.map((p) => (
              <button key={p.key} className="btn btn-small btn-default" onClick={() => setPattern(p.value)}>
                {t(p.key)}
              </button>
            ))}
          </div>

          {invalid && <div className="regex-error">{t("regex.invalid")}</div>}

          <div className="regex-test-input">
            <h4>{t("regex.testText")}</h4>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder={t("regex.testTextPlaceholder")}
              rows={6}
            />
          </div>

          <div className="regex-result">
            <h4>{t("regex.matchResult", { count: matches.length })}</h4>
            <div className="regex-highlight" dangerouslySetInnerHTML={{ __html: highlightedText }} />
          </div>

          {matches.length > 0 && (
            <div className="regex-matches-list">
              <h4>{t("regex.details")}</h4>
              {matches.slice(0, 50).map((m, idx) => (
                <div key={idx} className="regex-match-item">
                  <span className="match-index">#{idx + 1} (pos: {m.index})</span>
                  <span className="match-value">{m.match}</span>
                  {m.groups.length > 0 && (
                    <span className="match-groups">{t("regex.groups")}: {m.groups.map((g, i) => `$${i + 1}="${g}"`).join(", ")}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
