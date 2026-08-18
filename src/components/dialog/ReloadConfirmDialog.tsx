import { useI18n } from "../../stores/i18nStore";
import { useEscapeClose } from "../../hooks/useEscapeClose";

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
  const { t } = useI18n();
  useEscapeClose(onIgnore);

  return (
    <div className="dialog-overlay">
      <div className="dialog reload-dialog">
        <div className="dialog-header">
          <h2>{t("dialog.reloadConfirm")}</h2>
        </div>
        <div className="dialog-body">
          <p>
            <strong>{fileName}</strong> {t("dialog.reloadConfirmDesc")}
          </p>
          <p>{t("dialog.reloadConfirmAsk")}</p>
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn" onClick={onIgnore}>{t("dialog.ignore")}</button>
          <button className="dialog-btn primary" onClick={onReload}>
            {t("dialog.reload")}
          </button>
        </div>
      </div>
    </div>
  );
}
