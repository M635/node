import { useState, useMemo } from "react";

interface RegexTesterProps {
  onClose: () => void;
}

interface TestMatch {
  index: number;
  match: string;
  groups: string[];
}

export function RegexTester({ onClose }: RegexTesterProps) {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("");
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
      return result;
    } catch (e) {
      setError((e as Error).message);
      return [];
    }
  }, [pattern, flags, testText]);

  const highlightedText = useMemo(() => {
    if (!pattern || error || matches.length === 0) return testText;
    let result = "";
    let lastIndex = 0;
    for (const m of matches) {
      result += escapeHtml(testText.slice(lastIndex, m.index));
      result += `<mark>${escapeHtml(m.match)}</mark>`;
      lastIndex = m.index + m.match.length;
    }
    result += escapeHtml(testText.slice(lastIndex));
    return result;
  }, [pattern, error, matches, testText]);

  const commonPatterns = [
    { name: "邮箱", value: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
    { name: "URL", value: "https?://[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*" },
    { name: "IP地址", value: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
    { name: "手机号", value: "1[3-9]\\d{9}" },
    { name: "身份证", value: "\\d{17}[\\dXx]" },
    { name: "日期", value: "\\d{4}[-/]\\d{2}[-/]\\d{2}" },
    { name: "HTML标签", value: "<\\/?[a-zA-Z][^>]*>" },
    { name: "中文字符", value: "[\\u4e00-\\u9fa5]" },
  ];

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog regex-tester-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>正则表达式测试器</h3>
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
              placeholder="正则表达式..."
              autoFocus
            />
            <span className="regex-slash">/</span>
            <input
              type="text"
              className="regex-flags-input"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="flags"
            />
          </div>

          <div className="regex-common-patterns">
            {commonPatterns.map((p) => (
              <button key={p.name} className="btn btn-small btn-default" onClick={() => setPattern(p.value)}>
                {p.name}
              </button>
            ))}
          </div>

          {error && <div className="regex-error">错误: {error}</div>}

          <div className="regex-test-input">
            <h4>测试文本</h4>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="输入测试文本..."
              rows={6}
            />
          </div>

          <div className="regex-result">
            <h4>匹配结果 ({matches.length} 处)</h4>
            <div className="regex-highlight" dangerouslySetInnerHTML={{ __html: highlightedText }} />
          </div>

          {matches.length > 0 && (
            <div className="regex-matches-list">
              <h4>匹配详情</h4>
              {matches.slice(0, 50).map((m, idx) => (
                <div key={idx} className="regex-match-item">
                  <span className="match-index">#{idx + 1} (pos: {m.index})</span>
                  <span className="match-value">{m.match}</span>
                  {m.groups.length > 0 && (
                    <span className="match-groups">分组: {m.groups.map((g, i) => `$${i + 1}="${g}"`).join(", ")}</span>
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
