import { useEffect, useState, useRef } from "react";
import * as Monaco from "monaco-editor";
import { useI18n } from "../../stores/i18nStore";
import { useEscapeClose } from "../../hooks/useEscapeClose";

interface FunctionSymbol {
  name: string;
  line: number;
  type: "function" | "class" | "method" | "variable" | "interface" | "enum";
  detail?: string;
  indent: number;
  children: FunctionSymbol[];
}

interface FunctionListPanelProps {
  editor: Monaco.editor.ICodeEditor | null;
  onClose: () => void;
}

const FUNCTION_PATTERNS: Record<string, RegExp[]> = {
  javascript: [
    /^\s*(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(/,
    /^\s*(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(/,
    /^\s*(?:export\s+)?class\s+(\w+)/,
    /^\s*(\w+)\s*\([^)]*\)\s*\{/,
  ],
  typescript: [
    /^\s*(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*[<\(]/,
    /^\s*(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(/,
    /^\s*(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/,
    /^\s*(?:export\s+)?interface\s+(\w+)/,
    /^\s*(?:export\s+)?enum\s+(\w+)/,
    /^\s*(?:public|private|protected|static)?\s*(\w+)\s*\([^)]*\)\s*[:{]/,
  ],
  python: [
    /^\s*(?:async\s+)?def\s+(\w+)\s*\(/,
    /^\s*class\s+(\w+)\s*[\(:]/,
  ],
  rust: [
    /^\s*(?:pub\s+)?(?:async\s+)?fn\s+(\w+)\s*[<\(]/,
    /^\s*(?:pub\s+)?struct\s+(\w+)/,
    /^\s*(?:pub\s+)?enum\s+(\w+)/,
    /^\s*(?:pub\s+)?trait\s+(\w+)/,
    /^\s*impl\s+(?:<[^>]+>\s*)?(\w+)/,
  ],
  java: [
    /^\s*(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?class\s+(\w+)/,
    /^\s*(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?(?:void|int|String|boolean|double|float|long|char|\w+(?:<[^>]+>)?)\s+(\w+)\s*\(/,
    /^\s*(?:public|private|protected)?\s*interface\s+(\w+)/,
    /^\s*(?:public|private|protected)?\s*enum\s+(\w+)/,
  ],
  c: [
    /^\s*(?:static\s+)?(?:void|int|char|double|float|long|short|unsigned|size_t|\w+)\s+(\w+)\s*\(/,
    /^\s*struct\s+(\w+)/,
    /^\s*enum\s+(\w+)/,
    /^\s*typedef\s+(?:struct\s+)?\w+\s+(\w+)/,
  ],
  cpp: [
    /^\s*(?:\w+\s+)*(\w+)\s*\([^)]*\)\s*(?:const)?\s*\{/,
    /^\s*(?:template\s*<[^>]+>\s*)?class\s+(\w+)/,
    /^\s*(?:template\s*<[^>]+>\s*)?struct\s+(\w+)/,
    /^\s*enum\s+(?:class\s+)?(\w+)/,
    /^\s*namespace\s+(\w+)/,
  ],
  go: [
    /^\s*func\s+(?:\([^)]+\)\s+)?(\w+)\s*\(/,
    /^\s*type\s+(\w+)\s+(?:struct|interface)/,
    /^\s*type\s+(\w+)\s+/,
  ],
  ruby: [
    /^\s*def\s+(\w+)/,
    /^\s*class\s+(\w+)/,
    /^\s*module\s+(\w+)/,
  ],
  php: [
    /^\s*(?:public|private|protected)?\s*(?:static\s+)?function\s+(\w+)\s*\(/,
    /^\s*class\s+(\w+)/,
    /^\s*interface\s+(\w+)/,
  ],
  swift: [
    /^\s*func\s+(\w+)\s*\(/,
    /^\s*class\s+(\w+)/,
    /^\s*struct\s+(\w+)/,
    /^\s*enum\s+(\w+)/,
    /^\s*protocol\s+(\w+)/,
  ],
};

function buildTree(symbols: FunctionSymbol[]): FunctionSymbol[] {
  const root: FunctionSymbol[] = [];
  const stack: FunctionSymbol[] = [];

  for (const sym of symbols) {
    while (stack.length > 0 && stack[stack.length - 1].indent >= sym.indent) {
      stack.pop();
    }

    const isContainer = sym.type === "class" || sym.type === "interface" || sym.type === "enum";
    if (stack.length > 0 && isContainer === false) {
      stack[stack.length - 1].children.push(sym);
    } else {
      root.push(sym);
    }

    if (isContainer) {
      stack.push(sym);
    }
  }

  return root;
}

export function FunctionListPanel({ editor, onClose }: FunctionListPanelProps) {
  const { t } = useI18n();
  useEscapeClose(onClose);
  const [tree, setTree] = useState<FunctionSymbol[]>([]);
  const [filter, setFilter] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;
    const model = editor.getModel();
    if (!model) return;

    const language = model.getLanguageId();
    const patterns = FUNCTION_PATTERNS[language] || FUNCTION_PATTERNS.javascript;

    const result: FunctionSymbol[] = [];
    const lineCount = model.getLineCount();

    for (let i = 1; i <= lineCount; i++) {
      const line = model.getLineContent(i);
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          const name = match[1];
          let type: FunctionSymbol["type"] = "function";
          if (line.includes("class ") || line.includes("struct ")) type = "class";
          else if (line.includes("interface ") || line.includes("trait ") || line.includes("protocol ")) type = "interface";
          else if (line.includes("enum ")) type = "enum";
          else if (line.includes("namespace ") || line.includes("module ")) type = "class";
          const indent = line.length - line.trimStart().length;
          result.push({ name, line: i, type, indent, children: [], detail: t("fnList.line", { n: i }) });
          break;
        }
      }
    }

    setTree(buildTree(result));
  }, [editor, t]);

  const handleJump = (line: number) => {
    if (editor) {
      editor.revealLineInCenter(line);
      editor.setPosition({ lineNumber: line, column: 1 });
      editor.focus();
    }
  };

  const getIcon = (type: FunctionSymbol["type"]): string => {
    const icons: Record<string, string> = {
      function: "ƒ",
      class: "C",
      method: "m",
      variable: "v",
      interface: "I",
      enum: "E",
    };
    return icons[type] || "ƒ";
  };

  const flattenWithFilter = (nodes: FunctionSymbol[], filterText: string): { sym: FunctionSymbol; depth: number }[] => {
    const lower = filterText.toLowerCase();
    const result: { sym: FunctionSymbol; depth: number }[] = [];
    const walk = (nodes: FunctionSymbol[], depth: number) => {
      for (const node of nodes) {
        if (!filterText || node.name.toLowerCase().includes(lower)) {
          result.push({ sym: node, depth });
        }
        if (node.children.length > 0) {
          walk(node.children, depth + 1);
        }
      }
    };
    walk(nodes, 0);
    return result;
  };

  const flatList = flattenWithFilter(tree, filter);

  return (
    <div className="function-list-panel" ref={containerRef}>
      <div className="function-list-header">
        <h3>{t("dialog.functionList")}</h3>
        <input
          type="text"
          className="function-list-filter"
          placeholder={t("fnList.placeholder")}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          autoFocus
        />
        <button className="dialog-close" onClick={onClose}>×</button>
      </div>
      <div className="function-list-body">
        {flatList.length === 0 ? (
          <div className="function-list-empty">{t("fnList.empty")}</div>
        ) : (
          flatList.map(({ sym, depth }, idx) => (
            <div
              key={`${sym.line}-${idx}`}
              className="function-list-item"
              style={{ paddingLeft: `${12 + depth * 16}px` }}
              onClick={() => handleJump(sym.line)}
              title={sym.detail}
            >
              <span className={`function-icon icon-${sym.type}`}>{getIcon(sym.type)}</span>
              <span className="function-name">{sym.name}</span>
              <span className="function-line">{sym.line}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
