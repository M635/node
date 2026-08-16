import { useEffect } from "react";
import { usePluginStore } from "../../stores/pluginStore";
import { useI18n } from "../../stores/i18nStore";

interface PluginManagerProps {
  onClose: () => void;
}

export function PluginManager({ onClose }: PluginManagerProps) {
  const { plugins, togglePlugin } = usePluginStore();
  const { t } = useI18n();

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
          <h2>{t("dialog.pluginManager")}</h2>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="plugin-list">
            {plugins.map((p) => (
              <div key={p.id} className={`plugin-item ${p.enabled ? "enabled" : "disabled"}`}>
                <div className="plugin-item-info">
                  <div className="plugin-item-header">
                    <span className="plugin-name">{t(`plugin.${p.id}.name`, undefined, p.name)}</span>
                    <span className="plugin-version">v{p.version}</span>
                  </div>
                  <div className="plugin-desc">{t(`plugin.${p.id}.desc`, undefined, p.description)}</div>
                  <div className="plugin-author">{t("plugin.author", { author: p.author })}</div>
                </div>
                <label className="plugin-toggle">
                  <input
                    type="checkbox"
                    checked={p.enabled}
                    onChange={() => togglePlugin(p.id)}
                  />
                  <span>{p.enabled ? t("plugin.enabled") : t("plugin.disabled")}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn primary" onClick={onClose}>{t("common.close")}</button>
        </div>
      </div>
    </div>
  );
}
