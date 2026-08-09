import type * as Monaco from "monaco-editor";

export function registerKeybindings(
  monaco: typeof Monaco,
  editor: Monaco.editor.IStandaloneCodeEditor
): void {
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    window.dispatchEvent(new CustomEvent("markpt:save"));
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
    window.dispatchEvent(new CustomEvent("markpt:find"));
  });

  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
    () => {
      window.dispatchEvent(new CustomEvent("markpt:replace"));
    }
  );

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG, () => {
    window.dispatchEvent(new CustomEvent("markpt:goto-line"));
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
    window.dispatchEvent(new CustomEvent("markpt:toggle-bookmark"));
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyB, () => {
    window.dispatchEvent(new CustomEvent("markpt:next-bookmark"));
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyW, () => {
    window.dispatchEvent(new CustomEvent("markpt:close-tab"));
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyN, () => {
    window.dispatchEvent(new CustomEvent("markpt:new-file"));
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO, () => {
    window.dispatchEvent(new CustomEvent("markpt:open-file"));
  });

  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
    () => {
      window.dispatchEvent(new CustomEvent("markpt:find-in-files"));
    }
  );

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM, () => {
    window.dispatchEvent(new CustomEvent("markpt:toggle-macro"));
  });

  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyM,
    () => {
      window.dispatchEvent(new CustomEvent("markpt:play-macro"));
    }
  );

  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyD,
    () => {
      window.dispatchEvent(new CustomEvent("markpt:toggle-diff"));
    }
  );
}
