import type * as Monaco from "monaco-editor";
import type { ContextMenuItem } from "../../components/common/ContextMenu";
import { clipboardWrite, clipboardRead } from "../../utils/clipboard";
import { useSearchStore } from "../../stores/searchStore";
import { EditOperations } from "./editOperations";

type TFunc = (key: string) => string;

export function buildEditorContextMenu(opts: {
  editor: Monaco.editor.IStandaloneCodeEditor;
  monaco: typeof Monaco;
  t: TFunc;
  readonly?: boolean;
}): ContextMenuItem[] {
  const { editor, monaco, t, readonly = false } = opts;
  const mod = /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "Cmd" : "Ctrl";
  const focus = () => editor.focus();
  const sel = editor.getSelection();
  const hasSelection = !!sel && !sel.isEmpty();

  const doCopy = async () => {
    const s = editor.getSelection();
    if (!s) return;
    const text = editor.getModel()?.getValueInRange(s) || "";
    if (text) await clipboardWrite(text);
    focus();
  };
  const doCut = async () => {
    const s = editor.getSelection();
    if (!s) return;
    const model = editor.getModel();
    if (!model) return;
    const text = model.getValueInRange(s);
    if (text) {
      await clipboardWrite(text);
      editor.executeEdits("cut", [{ range: s, text: "" }]);
    }
    focus();
  };
  const doPaste = async () => {
    const text = await clipboardRead();
    if (!text) return;
    const s = editor.getSelection();
    if (!s) return;
    editor.executeEdits("paste", [{ range: s, text, forceMoveMarkers: true }]);
    focus();
  };
  const selectAll = () => {
    const model = editor.getModel();
    if (model) editor.setSelection(new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount()) + 1));
    focus();
  };
  const run = (fn: () => void) => () => { fn(); focus(); };

  const items: ContextMenuItem[] = [
    { label: t("monaco.cut"), shortcut: `${mod}+X`, onClick: doCut, disabled: readonly || !hasSelection },
    { label: t("monaco.copy"), shortcut: `${mod}+C`, onClick: doCopy, disabled: !hasSelection },
    { label: t("monaco.paste"), shortcut: `${mod}+V`, onClick: doPaste, disabled: readonly },
    { label: "", onClick: () => {}, divider: true },
    { label: t("search.find"), shortcut: `${mod}+F`, onClick: run(() => useSearchStore.getState().toggleSearchPanel()) },
    { label: t("search.replace"), shortcut: `${mod}+H`, onClick: run(() => useSearchStore.getState().toggleReplacePanel()), disabled: readonly },
    { label: t("toolbar.gotoLine").replace(/ \([^)]*\)$/, ""), shortcut: `${mod}+G`, onClick: run(() => window.dispatchEvent(new CustomEvent("markpt:goto-line"))) },
    { label: "", onClick: () => {}, divider: true },
    { label: t("action.toggleComment"), shortcut: `${mod}+/`, onClick: run(() => EditOperations.toggleLineComment(editor, monaco)), disabled: readonly },
    { label: t("action.formatDocument"), onClick: run(() => { editor.getAction("editor.action.formatDocument")?.run(); }), disabled: readonly },
    { label: t("action.deleteLine"), onClick: run(() => EditOperations.deleteCurrentLine(editor, monaco)), disabled: readonly },
    { label: t("action.duplicateLine"), onClick: run(() => EditOperations.duplicateCurrentLine(editor)), disabled: readonly },
    { label: "", onClick: () => {}, divider: true },
    { label: t("action.toUpperCase"), onClick: run(() => EditOperations.toUpperCase(editor)), disabled: readonly || !hasSelection },
    { label: t("action.toLowerCase"), onClick: run(() => EditOperations.toLowerCase(editor)), disabled: readonly || !hasSelection },
    { label: t("action.trimTrailing"), onClick: run(() => EditOperations.trimTrailingWhitespace(editor)), disabled: readonly },
    { label: "", onClick: () => {}, divider: true },
    { label: t("tt.base64Encode"), onClick: run(() => {
      const s = editor.getSelection(); if (!s) return;
      const text = editor.getModel()?.getValueInRange(s) || "";
      const encoded = btoa(unescape(encodeURIComponent(text)));
      editor.executeEdits("base64-encode", [{ range: s, text: encoded }]);
    }), disabled: readonly || !hasSelection },
    { label: t("tt.base64Decode"), onClick: run(() => {
      const s = editor.getSelection(); if (!s) return;
      const text = editor.getModel()?.getValueInRange(s) || "";
      try { const decoded = decodeURIComponent(escape(atob(text))); editor.executeEdits("base64-decode", [{ range: s, text: decoded }]); } catch {}
    }), disabled: readonly || !hasSelection },
    { label: t("tt.urlEncode"), onClick: run(() => {
      const s = editor.getSelection(); if (!s) return;
      const text = editor.getModel()?.getValueInRange(s) || "";
      editor.executeEdits("url-encode", [{ range: s, text: encodeURIComponent(text) }]);
    }), disabled: readonly || !hasSelection },
    { label: t("tt.urlDecode"), onClick: run(() => {
      const s = editor.getSelection(); if (!s) return;
      const text = editor.getModel()?.getValueInRange(s) || "";
      try { editor.executeEdits("url-decode", [{ range: s, text: decodeURIComponent(text) }]); } catch {}
    }), disabled: readonly || !hasSelection },
    { label: t("tt.htmlEntityEncode"), onClick: run(() => {
      const s = editor.getSelection(); if (!s) return;
      const text = editor.getModel()?.getValueInRange(s) || "";
      const encoded = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      editor.executeEdits("html-encode", [{ range: s, text: encoded }]);
    }), disabled: readonly || !hasSelection },
    { label: t("tt.htmlEntityDecode"), onClick: run(() => {
      const s = editor.getSelection(); if (!s) return;
      const text = editor.getModel()?.getValueInRange(s) || "";
      const textarea = document.createElement("textarea");
      textarea.innerHTML = text;
      editor.executeEdits("html-decode", [{ range: s, text: textarea.value }]);
    }), disabled: readonly || !hasSelection },
    { label: t("action.formatJson"), onClick: run(() => {
      const s = editor.getSelection(); if (!s) return;
      const text = editor.getModel()?.getValueInRange(s) || "";
      try { const parsed = JSON.parse(text); editor.executeEdits("format-json", [{ range: s, text: JSON.stringify(parsed, null, 2) }]); } catch {}
    }), disabled: readonly || !hasSelection },
    { label: "", onClick: () => {}, divider: true },
    { label: t("dialog.insertDateTime"), onClick: run(() => {
      const now = new Date();
      const text = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      const pos = editor.getPosition();
      if (pos) editor.executeEdits("insert-datetime", [{ range: new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column), text }]);
    }), disabled: readonly },
    { label: t("action.selectAll"), shortcut: `${mod}+A`, onClick: selectAll },
  ];
  return items;
}
