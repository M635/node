import { useState, useCallback } from "react";
import { TextTransform } from "../../services/text/textTransform";

interface TextTransformDialogProps {
  content: string;
  onApply: (result: string) => void;
  onClose: () => void;
}

type TransformType =
  | "base64-encode" | "base64-decode"
  | "url-encode" | "url-decode"
  | "rot13" | "hex-encode" | "hex-decode"
  | "reverse-text" | "reverse-lines"
  | "remove-whitespace" | "collapse-whitespace"
  | "add-line-numbers" | "remove-line-numbers";

const TRANSFORM_LABELS: Record<TransformType, string> = {
  "base64-encode": "Base64 编码",
  "base64-decode": "Base64 解码",
  "url-encode": "URL 编码",
  "url-decode": "URL 解码",
  "rot13": "ROT13",
  "hex-encode": "转十六进制",
  "hex-decode": "十六进制转文本",
  "reverse-text": "反转文本",
  "reverse-lines": "反转行序",
  "remove-whitespace": "移除所有空白",
  "collapse-whitespace": "合并连续空白",
  "add-line-numbers": "添加行号",
  "remove-line-numbers": "移除行号",
};

export function TextTransformDialog({ content, onApply, onClose }: TextTransformDialogProps) {
  const [selected, setSelected] = useState<TransformType | null>(null);
  const [result, setResult] = useState("");
  const [hashResult, setHashResult] = useState("");

  const handleTransform = useCallback(async (type: TransformType) => {
    setSelected(type);
    let output = "";
    switch (type) {
      case "base64-encode": output = TextTransform.toBase64(content); break;
      case "base64-decode": output = TextTransform.fromBase64(content); break;
      case "url-encode": output = TextTransform.urlEncode(content); break;
      case "url-decode": output = TextTransform.urlDecode(content); break;
      case "rot13": output = TextTransform.rot13(content); break;
      case "hex-encode": output = TextTransform.toHex(content); break;
      case "hex-decode": output = TextTransform.fromHex(content); break;
      case "reverse-text": output = TextTransform.reverseText(content); break;
      case "reverse-lines": output = TextTransform.reverseLines(content); break;
      case "remove-whitespace": output = TextTransform.removeAllWhitespace(content); break;
      case "collapse-whitespace": output = TextTransform.collapseWhitespace(content); break;
      case "add-line-numbers": output = TextTransform.addLineNumberPrefix(content); break;
      case "remove-line-numbers": output = TextTransform.removeLineNumberPrefix(content); break;
    }
    setResult(output);
  }, [content]);

  const handleMd5 = useCallback(() => {
    setHashResult(`MD5: ${TextTransform.md5(content)}`);
  }, [content]);

  const handleSha256 = useCallback(async () => {
    const hash = await TextTransform.sha256(content);
    setHashResult(`SHA-256: ${hash}`);
  }, [content]);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog text-transform-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>文本转换</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="transform-section">
            <h4>编码/解码</h4>
            <div className="transform-buttons">
              {(Object.keys(TRANSFORM_LABELS) as TransformType[]).map((type) => (
                <button
                  key={type}
                  className={`btn btn-small ${selected === type ? "btn-primary" : "btn-default"}`}
                  onClick={() => handleTransform(type)}
                >
                  {TRANSFORM_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div className="transform-section">
            <h4>哈希计算</h4>
            <div className="transform-buttons">
              <button className="btn btn-small btn-default" onClick={handleMd5}>MD5</button>
              <button className="btn btn-small btn-default" onClick={handleSha256}>SHA-256</button>
            </div>
            {hashResult && (
              <div className="hash-result">
                <code>{hashResult}</code>
              </div>
            )}
          </div>

          {result && (
            <div className="transform-section">
              <h4>转换结果</h4>
              <textarea
                className="transform-result"
                value={result}
                readOnly
                rows={8}
              />
              <div className="transform-actions">
                <button className="btn btn-primary" onClick={() => onApply(result)}>
                  应用到编辑器
                </button>
                <button
                  className="btn btn-default"
                  onClick={() => navigator.clipboard.writeText(result)}
                >
                  复制到剪贴板
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
