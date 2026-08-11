import { useEffect } from "react";
import { usePluginStore } from "../../stores/pluginStore";

interface PluginManagerProps {
  onClose: () => void;
}

export function PluginManager({ onClose }: PluginManagerProps) {
  const { plugins, togglePlugin } = usePluginStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog plugin-manager-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>插件管理</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="plugin-list">
            {plugins.map((p) => (
              <div key={p.id} className={`plugin-item ${p.enabled ? "enabled" : "disabled"}`}>
                <div className="plugin-item-info">
                  <div className="plugin-item-header">
                    <span className="plugin-name">{p.name}</span>
                    <span className="plugin-version">v{p.version}</span>
                  </div>
                  <div className="plugin-desc">{p.description}</div>
                  <div className="plugin-author">作者: {p.author}</div>
                </div>
                <label className="plugin-toggle">
                  <input
                    type="checkbox"
                    checked={p.enabled}
                    onChange={() => togglePlugin(p.id)}
                  />
                  <span>{p.enabled ? "已启用" : "已禁用"}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn primary" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
}
