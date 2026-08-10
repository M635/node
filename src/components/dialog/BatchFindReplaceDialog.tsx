import { useState, useCallback } from "react";
import { useFileStore } from "../../stores/fileStore";

interface BatchFindReplaceProps {
  onClose: () => void;
}

interface BatchRule {
  id: string;
  find: string;
  replace: string;
  enabled: boolean;
}

export function BatchFindReplace({ onClose }: BatchFindReplaceProps) {
  const { tabs } = useFileStore();
  const [rules, setRules] = useState<BatchRule[]>([
    { id: "1", find: "", replace: "", enabled: true },
  ]);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [isRegex, setIsRegex] = useState(false);
  const [scope, setScope] = useState<"current" | "all">("current");
  const [results, setResults] = useState<string[]>([]);

  const addRule = useCallback(() => {
    setRules((prev) => [...prev, { id: String(Date.now()), find: "", replace: "", enabled: true }]);
  }, []);

  const removeRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRule = useCallback((id: string, updates: Partial<BatchRule>) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const handleExecute = useCallback(() => {
    const activeRules = rules.filter((r) => r.enabled && r.find);
    if (activeRules.length === 0) return;

    const targetTabs = scope === "all" ? tabs : tabs.filter((t) => t.id === useFileStore.getState().activeTabId);
    const summary: string[] = [];

    for (const tab of targetTabs) {
      let content = tab.content;
      let totalReplacements = 0;

      for (const rule of activeRules) {
        const flags = caseSensitive ? "g" : "gi";
        let regex: RegExp;
        try {
          regex = isRegex
            ? new RegExp(rule.find, flags)
            : new RegExp(rule.find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
        } catch {
          continue;
        }
        const matches = content.match(regex);
        const count = matches ? matches.length : 0;
        content = content.replace(regex, rule.replace);
        totalReplacements += count;
      }

      if (totalReplacements > 0) {
        useFileStore.getState().updateContent(tab.id, content);
        summary.push(`${tab.name}: ${totalReplacements} 处替换`);
      }
    }

    setResults(summary.length > 0 ? summary : ["未找到匹配"]);
  }, [rules, caseSensitive, isRegex, scope, tabs]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog batch-find-replace-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>批量查找替换</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="batch-rules">
            <div className="batch-rules-header">
              <span>启用</span>
              <span>查找</span>
              <span>替换为</span>
              <span>操作</span>
            </div>
            {rules.map((rule) => (
              <div key={rule.id} className="batch-rule-row">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
                />
                <input
                  type="text"
                  value={rule.find}
                  onChange={(e) => updateRule(rule.id, { find: e.target.value })}
                  placeholder="查找..."
                />
                <input
                  type="text"
                  value={rule.replace}
                  onChange={(e) => updateRule(rule.id, { replace: e.target.value })}
                  placeholder="替换为..."
                />
                <button className="btn btn-small" onClick={() => removeRule(rule.id)}>删除</button>
              </div>
            ))}
            <button className="btn btn-small btn-default" onClick={addRule}>+ 添加规则</button>
          </div>

          <div className="batch-options">
            <label>
              <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
              区分大小写
            </label>
            <label>
              <input type="checkbox" checked={isRegex} onChange={(e) => setIsRegex(e.target.checked)} />
              正则表达式
            </label>
            <label>
              范围:
              <select value={scope} onChange={(e) => setScope(e.target.value as "current" | "all")}>
                <option value="current">当前文档</option>
                <option value="all">所有文档</option>
              </select>
            </label>
          </div>

          <div className="batch-actions">
            <button className="btn btn-primary" onClick={handleExecute}>执行批量替换</button>
          </div>

          {results.length > 0 && (
            <div className="batch-results">
              <h4>结果</h4>
              {results.map((r, idx) => (
                <div key={idx} className="batch-result-item">{r}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
