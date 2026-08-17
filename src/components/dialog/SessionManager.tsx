import { useState, useEffect, useCallback } from "react";
import { useI18n } from "../../stores/i18nStore";
import {
  listNamedSessions,
  deleteNamedSession,
  loadNamedSession,
  type SessionData,
} from "../../services/session/sessionService";

interface SessionManagerProps {
  onLoadSession: (data: SessionData) => void;
  onSaveCurrent: (name: string) => Promise<void>;
  onClose: () => void;
}

interface SessionInfo {
  name: string;
  saved_at: number;
  tab_count: number;
}

export function SessionManager({ onLoadSession, onSaveCurrent, onClose }: SessionManagerProps) {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await listNamedSessions();
    setSessions(list);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleSave = useCallback(async () => {
    if (!newName.trim()) return;
    await onSaveCurrent(newName.trim());
    setNewName("");
    await refresh();
  }, [newName, onSaveCurrent, refresh]);

  const handleLoad = useCallback(async (name: string) => {
    const data = await loadNamedSession(name);
    if (data) {
      onLoadSession(data);
      onClose();
    }
  }, [onLoadSession, onClose]);

  const handleDelete = useCallback(async (name: string) => {
    await deleteNamedSession(name);
    await refresh();
  }, [refresh]);

  const formatDate = (timestamp: number): string => {
    const d = new Date(timestamp);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog session-manager-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{t("session.manager")}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="session-save-row">
            <input
              type="text"
              className="session-name-input"
              placeholder={t("session.namePlaceholder")}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            />
            <button className="btn btn-primary" onClick={handleSave} disabled={!newName.trim()}>
              {t("session.saveCurrent")}
            </button>
          </div>
          <div className="session-list">
            {loading ? (
              <div className="session-loading">{t("common.loading")}</div>
            ) : sessions.length === 0 ? (
              <div className="session-empty">{t("session.noSessions")}</div>
            ) : (
              sessions.map((s) => (
                <div key={s.name} className="session-item">
                  <div className="session-item-info">
                    <span className="session-item-name">{s.name}</span>
                    <span className="session-item-meta">
                      {s.tab_count} {t("session.tabs")} · {formatDate(s.saved_at)}
                    </span>
                  </div>
                  <div className="session-item-actions">
                    <button className="btn btn-small" onClick={() => handleLoad(s.name)}>
                      {t("session.load")}
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(s.name)}>
                      {t("session.delete")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
