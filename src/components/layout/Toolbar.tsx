import { useSettingStore } from "../../stores/settingStore";
import { useI18n } from "../../stores/i18nStore";
import {
  IconNew, IconOpen, IconSave, IconSaveAll, IconPrint,
  IconUndo, IconRedo, IconCut, IconCopy, IconPaste,
  IconFind, IconReplace, IconGotoLine,
  IconZoomIn, IconZoomOut, IconZoomReset, IconWordWrap, IconLineNumbers,
  IconCompare, IconCompareClear, IconSyncScroll, IconSettings,
} from "../common/Icons";

interface ToolbarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAll: () => void;
  onPrint: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onFind: () => void;
  onReplace: () => void;
  onGotoLine: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onToggleWordWrap: () => void;
  onToggleLineNumbers: () => void;
  onCompareStart: () => void;
  onCompareClear: () => void;
  onCompareSyncScroll: () => void;
  onSettings: () => void;
}

export function Toolbar({
  onNew, onOpen, onSave, onSaveAll, onPrint,
  onUndo, onRedo, onCut, onCopy, onPaste,
  onFind, onReplace, onGotoLine,
  onZoomIn, onZoomOut, onZoomReset, onToggleWordWrap, onToggleLineNumbers,
  onCompareStart, onCompareClear, onCompareSyncScroll,
  onSettings,
}: ToolbarProps) {
  const { wordWrap, showLineNumbers } = useSettingStore();
  const { t } = useI18n();

  return (
    <div className="main-toolbar">
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onNew} title={t("toolbar.new")}><IconNew /></button>
        <button className="toolbar-icon-btn" onClick={onOpen} title={t("toolbar.open")}><IconOpen /></button>
        <button className="toolbar-icon-btn" onClick={onSave} title={t("toolbar.save")}><IconSave /></button>
        <button className="toolbar-icon-btn" onClick={onSaveAll} title={t("toolbar.saveAll")}><IconSaveAll /></button>
        <button className="toolbar-icon-btn" onClick={onPrint} title={t("toolbar.print")}><IconPrint /></button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onUndo} title={t("toolbar.undo")}><IconUndo /></button>
        <button className="toolbar-icon-btn" onClick={onRedo} title={t("toolbar.redo")}><IconRedo /></button>
        <button className="toolbar-icon-btn" onClick={onCut} title={t("toolbar.cut")}><IconCut /></button>
        <button className="toolbar-icon-btn" onClick={onCopy} title={t("toolbar.copy")}><IconCopy /></button>
        <button className="toolbar-icon-btn" onClick={onPaste} title={t("toolbar.paste")}><IconPaste /></button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onFind} title={t("toolbar.find")}><IconFind /></button>
        <button className="toolbar-icon-btn" onClick={onReplace} title={t("toolbar.replace")}><IconReplace /></button>
        <button className="toolbar-icon-btn" onClick={onGotoLine} title={t("toolbar.gotoLine")}><IconGotoLine /></button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onZoomIn} title={t("toolbar.zoomIn")}><IconZoomIn /></button>
        <button className="toolbar-icon-btn" onClick={onZoomOut} title={t("toolbar.zoomOut")}><IconZoomOut /></button>
        <button className="toolbar-icon-btn" onClick={onZoomReset} title={t("toolbar.zoomReset")}><IconZoomReset /></button>
        <button className={`toolbar-icon-btn ${wordWrap ? "active" : ""}`} onClick={onToggleWordWrap} title={t("toolbar.wordWrap")}><IconWordWrap /></button>
        <button className={`toolbar-icon-btn ${showLineNumbers ? "active" : ""}`} onClick={onToggleLineNumbers} title={t("toolbar.lineNumbers")}><IconLineNumbers /></button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onCompareStart} title={t("toolbar.compare")}><IconCompare /></button>
        <button className="toolbar-icon-btn" onClick={onCompareClear} title={t("toolbar.compareClear")}><IconCompareClear /></button>
        <button className="toolbar-icon-btn" onClick={onCompareSyncScroll} title={t("toolbar.syncScroll")}><IconSyncScroll /></button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button className="toolbar-icon-btn" onClick={onSettings} title={t("toolbar.settings")}><IconSettings /></button>
      </div>
      <div className="toolbar-spacer" />
    </div>
  );
}
