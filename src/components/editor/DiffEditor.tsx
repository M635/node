import { DiffEditor } from "@monaco-editor/react";
import { useEditorStore } from "../../stores/editorStore";
import { getThemeName } from "../../services/monaco/themes";
import { useSettingStore } from "../../stores/settingStore";

interface DiffEditorViewProps {
  original: string;
  modified: string;
  language?: string;
}

export function DiffEditorView({
  original,
  modified,
  language = "plaintext",
}: DiffEditorViewProps) {
  const { isDark } = useEditorStore();
  const { fontSize, fontFamily, showLineNumbers } = useSettingStore();

  return (
    <div className="diff-editor-wrapper">
      <DiffEditor
        height="100%"
        width="100%"
        original={original}
        modified={modified}
        language={language}
        theme={getThemeName(isDark)}
        options={{
          readOnly: true,
          fontSize,
          fontFamily,
          lineNumbers: showLineNumbers ? "on" : "off",
          renderWhitespace: "boundary",
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          diffWordWrap: "on",
          originalEditable: false,
          renderIndicators: true,
          maxComputationTime: 5000,
          contextmenu: false,
        }}
      />
    </div>
  );
}
