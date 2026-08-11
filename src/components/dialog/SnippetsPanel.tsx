import { useState, useEffect } from "react";
import { useSnippetStore, type Snippet } from "../../stores/snippetStore";

interface SnippetsPanelProps {
  onClose: () => void;
}

export function SnippetsPanel({ onClose }: SnippetsPanelProps) {
  const { snippets, addSnippet, removeSnippet } = useSnippetStore();
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<Snippet | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = filter
    ? snippets.filter((s) => s.trigger.includes(filter) || s.description.includes(filter))
    : snippets;

  const handleSave = () => {
    if (!editing?.trigger || !editing?.body) return;
    addSnippet({ ...editing, id: editing.id || `snippet-${Date.now()}` });
    setEditing(null);
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog snippets-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>代码片段</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="snippets-toolbar">
            <input
              type="text"
              className="snippets-filter"
              placeholder="过滤..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button className="dialog-btn" onClick={() => setEditing({ id: "", trigger: "", description: "", body: "", language: "" })}>
              新增
            </button>
          </div>
          {editing ? (
            <div className="snippet-editor">
              <div className="snippet-edit-row">
                <label>触发词</label>
                <input value={editing.trigger} onChange={(e) => setEditing({ ...editing, trigger: e.target.value })} />
              </div>
              <div className="snippet-edit-row">
                <label>描述</label>
                <input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="snippet-edit-row">
                <label>语言</label>
                <input value={editing.language || ""} onChange={(e) => setEditing({ ...editing, language: e.target.value })} placeholder="留空=所有语言" />
              </div>
              <div className="snippet-edit-row">
                <label>内容</label>
                <textarea
                  value={editing.body}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  rows={6}
                  placeholder="使用 ${1:placeholder} 语法"
                />
              </div>
              <div className="snippet-edit-actions">
                <button className="dialog-btn primary" onClick={handleSave}>保存</button>
                <button className="dialog-btn" onClick={() => setEditing(null)}>取消</button>
              </div>
            </div>
          ) : (
            <div className="snippets-list">
              {filtered.map((s) => (
                <div key={s.id} className="snippet-item">
                  <div className="snippet-item-info">
                    <span className="snippet-trigger">{s.trigger}</span>
                    <span className="snippet-desc">{s.description}</span>
                    {s.language && <span className="snippet-lang">{s.language}</span>}
                  </div>
                  <button className="snippet-delete" onClick={() => removeSnippet(s.id)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn primary" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
}
