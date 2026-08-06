interface ReloadConfirmDialogProps {
  fileName: string;
  onReload: () => void;
  onIgnore: () => void;
}

export function ReloadConfirmDialog({
  fileName,
  onReload,
  onIgnore,
}: ReloadConfirmDialogProps) {
  return (
    <div className="dialog-overlay">
      <div className="dialog reload-dialog">
        <div className="dialog-header">
          <h2>文件已修改</h2>
        </div>
        <div className="dialog-body">
          <p>
            <strong>{fileName}</strong> 已被外部程序修改。
          </p>
          <p>是否重新加载？</p>
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn" onClick={onIgnore}>忽略</button>
          <button className="dialog-btn primary" onClick={onReload}>
            重新加载
          </button>
        </div>
      </div>
    </div>
  );
}
