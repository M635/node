import { useState, useCallback } from "react";
import { useFileStore } from "../../stores/fileStore";
import { useI18n } from "../../stores/i18nStore";

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
  const { t } = useI18n();
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
        } catch (err) {
          console.debug("[MarkPT][调试] 批量替换正则无效:", err);
          continue;
        }
        const matches = content.match(regex);
        const count = matches ? matches.length : 0;
        content = content.replace(regex, rule.replace);
        totalReplacements += count;
      }

      if (totalReplacements > 0) {
        useFileStore.getState().updateContent(tab.id, content);
        summary.push(t("batch.replacements", { name: tab.name, count: totalReplacements }));
      }
    }

    setResults(summary.length > 0 ? summary : [t("search.noMatch")]);
  }, [rules, caseSensitive, isRegex, scope, tabs, t]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog batch-find-replace-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{t("dialog.batchFindReplace")}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="batch-rules">
            <div className="batch-rules-header">
              <span>{t("batch.enabled")}</span>
              <span>{t("batch.find")}</span>
              <span>{t("batch.replaceWith")}</span>
              <span>{t("batch.actions")}</span>
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
                  placeholder={t("search.placeholder")}
                />
                <input
                  type="text"
                  value={rule.replace}
                  onChange={(e) => updateRule(rule.id, { replace: e.target.value })}
                  placeholder={t("search.replacePlaceholder")}
                />
                <button className="btn btn-small" onClick={() => removeRule(rule.id)}>{t("common.delete")}</button>
              </div>
            ))}
            <button className="btn btn-small btn-default" onClick={addRule}>{t("batch.addRule")}</button>
          </div>

          <div className="batch-options">
            <label>
              <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
              {t("search.caseSensitive")}
            </label>
            <label>
              <input type="checkbox" checked={isRegex} onChange={(e) => setIsRegex(e.target.checked)} />
              {t("search.regex")}
            </label>
            <label>
              {t("batch.scope")}
              <select value={scope} onChange={(e) => setScope(e.target.value as "current" | "all")}>
                <option value="current">{t("batch.currentDoc")}</option>
                <option value="all">{t("batch.allDocs")}</option>
              </select>
            </label>
          </div>

          <div className="batch-actions">
            <button className="btn btn-primary" onClick={handleExecute}>{t("batch.execute")}</button>
          </div>

          {results.length > 0 && (
            <div className="batch-results">
              <h4>{t("batch.result")}</h4>
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
