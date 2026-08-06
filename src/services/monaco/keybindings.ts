import type * as Monaco from "monaco-editor";

export function registerKeybindings(
  monaco: typeof Monaco,
  editor: Monaco.editor.IStandaloneCodeEditor
): void {
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    window.dispatchEvent(new CustomEvent("macpad:save"));
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
    window.dispatchEvent(new CustomEvent("macpad:find"));
  });

  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
    () => {
      window.dispatchEvent(new CustomEvent("macpad:replace"));
    }
  );

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG, () => {
    window.dispatchEvent(new CustomEvent("macpad:goto-line"));
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
    window.dispatchEvent(new CustomEvent("macpad:toggle-bookmark"));
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyB, () => {
    window.dispatchEvent(new CustomEvent("macpad:next-bookmark"));
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyW, () => {
    window.dispatchEvent(new CustomEvent("macpad:close-tab"));
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyN, () => {
    window.dispatchEvent(new CustomEvent("macpad:new-file"));
  });

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO, () => {
    window.dispatchEvent(new CustomEvent("macpad:open-file"));
  });

  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
    () => {
      window.dispatchEvent(new CustomEvent("macpad:find-in-files"));
    }
  );

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM, () => {
    window.dispatchEvent(new CustomEvent("macpad:toggle-macro"));
  });

  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyM,
    () => {
      window.dispatchEvent(new CustomEvent("macpad:play-macro"));
    }
  );

  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyD,
    () => {
      window.dispatchEvent(new CustomEvent("macpad:toggle-diff"));
    }
  );
}
