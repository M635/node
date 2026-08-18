import { useEffect, useState, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useI18n } from "../../stores/i18nStore";
import { describeError } from "../../utils/errors";
import type { FileTab } from "../../types/file";
import { useEscapeClose } from "../../hooks/useEscapeClose";

interface FilePropertiesDialogProps {
  tab: FileTab;
  onClose: () => void;
}

interface FileInfo {
  size: number;
  created: number;
  modified: number;
  accessed: number;
  readonly: boolean;
  is_dir: boolean;
  is_file: boolean;
}

export function FilePropertiesDialog({ tab, onClose }: FilePropertiesDialogProps) {
  const { t } = useI18n();
  useEscapeClose(onClose);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  useEffect(() => {
    if (!tab.path) return;
    invoke<FileInfo>("get_file_info", { path: tab.path })
      .then(setFileInfo)
      .catch((err) => console.debug("[MarkPT][调试] 读取文件信息失败:", describeError(err)));
  }, [tab.path]);

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "—";
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const { lineCount, wordCount, charCount, byteSize } = useMemo(() => {
    const lines = tab.content.split("\n").length;
    const words = (tab.content.match(/\S+/g) || []).length;
    const chars = tab.content.length;
    const bytes = new TextEncoder().encode(tab.content).length;
    return { lineCount: lines, wordCount: words, charCount: chars, byteSize: bytes };
  }, [tab.content]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog file-properties-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{t("dialog.fileProps")}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="props-section">
            <h4>{t("props.basic")}</h4>
            <div className="props-grid">
              <div className="prop-item">
                <span className="prop-label">{t("props.fileName")}</span>
                <span className="prop-value">{tab.name}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">{t("props.path")}</span>
                <span className="prop-value" title={tab.path}>{tab.path || `(${t("common.unnamed")})`}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">{t("props.encoding")}</span>
                <span className="prop-value">{tab.encoding}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">{t("props.language")}</span>
                <span className="prop-value">{tab.language}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">{t("props.readonly")}</span>
                <span className="prop-value">{tab.readonly ? t("common.yes") : t("common.no")}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">{t("props.isLargeFile")}</span>
                <span className="prop-value">{tab.is_large_file ? t("common.yes") : t("common.no")}</span>
              </div>
            </div>
          </div>

          <div className="props-section">
            <h4>{t("props.contentStats")}</h4>
            <div className="props-grid">
              <div className="prop-item">
                <span className="prop-label">{t("stats.linesCount")}</span>
                <span className="prop-value">{lineCount.toLocaleString()}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">{t("stats.wordsCount")}</span>
                <span className="prop-value">{wordCount.toLocaleString()}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">{t("stats.charsCount")}</span>
                <span className="prop-value">{charCount.toLocaleString()}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">{t("props.byteSize")}</span>
                <span className="prop-value">{formatSize(byteSize)}</span>
              </div>
            </div>
          </div>

          {fileInfo && (
            <div className="props-section">
              <h4>{t("props.filesystem")}</h4>
              <div className="props-grid">
                <div className="prop-item">
                  <span className="prop-label">{t("props.size")}</span>
                  <span className="prop-value">{formatSize(fileInfo.size)}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">{t("props.created")}</span>
                  <span className="prop-value">{formatDate(fileInfo.created)}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">{t("props.modified")}</span>
                  <span className="prop-value">{formatDate(fileInfo.modified)}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">{t("props.accessed")}</span>
                  <span className="prop-value">{formatDate(fileInfo.accessed)}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">{t("props.permission")}</span>
                  <span className="prop-value">{fileInfo.readonly ? t("props.readonly") : t("props.readWrite")}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
