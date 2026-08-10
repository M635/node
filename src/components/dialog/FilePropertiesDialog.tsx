import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { FileTab } from "../../types/file";

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
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  useEffect(() => {
    if (!tab.path) return;
    invoke<FileInfo>("get_file_info", { path: tab.path })
      .then(setFileInfo)
      .catch(() => {});
  }, [tab.path]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const lineCount = tab.content.split("\n").length;
  const wordCount = (tab.content.match(/\S+/g) || []).length;
  const charCount = tab.content.length;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog file-properties-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>文件属性</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="props-section">
            <h4>基本信息</h4>
            <div className="props-grid">
              <div className="prop-item">
                <span className="prop-label">文件名</span>
                <span className="prop-value">{tab.name}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">路径</span>
                <span className="prop-value" title={tab.path}>{tab.path || "(未命名)"}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">编码</span>
                <span className="prop-value">{tab.encoding}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">语言</span>
                <span className="prop-value">{tab.language}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">只读</span>
                <span className="prop-value">{tab.readonly ? "是" : "否"}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">大文件</span>
                <span className="prop-value">{tab.is_large_file ? "是" : "否"}</span>
              </div>
            </div>
          </div>

          <div className="props-section">
            <h4>内容统计</h4>
            <div className="props-grid">
              <div className="prop-item">
                <span className="prop-label">行数</span>
                <span className="prop-value">{lineCount.toLocaleString()}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">单词数</span>
                <span className="prop-value">{wordCount.toLocaleString()}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">字符数</span>
                <span className="prop-value">{charCount.toLocaleString()}</span>
              </div>
              <div className="prop-item">
                <span className="prop-label">字节大小</span>
                <span className="prop-value">{formatSize(new TextEncoder().encode(tab.content).length)}</span>
              </div>
            </div>
          </div>

          {fileInfo && (
            <div className="props-section">
              <h4>文件系统</h4>
              <div className="props-grid">
                <div className="prop-item">
                  <span className="prop-label">大小</span>
                  <span className="prop-value">{formatSize(fileInfo.size)}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">创建时间</span>
                  <span className="prop-value">{formatDate(fileInfo.created)}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">修改时间</span>
                  <span className="prop-value">{formatDate(fileInfo.modified)}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">访问时间</span>
                  <span className="prop-value">{formatDate(fileInfo.accessed)}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">权限</span>
                  <span className="prop-value">{fileInfo.readonly ? "只读" : "可读写"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
