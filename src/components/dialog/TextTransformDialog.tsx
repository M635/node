import { useState, useCallback } from "react";
import { TextTransform } from "../../services/text/textTransform";
import { useI18n } from "../../stores/i18nStore";

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

const TRANSFORM_LABEL_KEYS: Record<TransformType, string> = {
  "base64-encode": "tt.base64Encode",
  "base64-decode": "tt.base64Decode",
  "url-encode": "tt.urlEncode",
  "url-decode": "tt.urlDecode",
  "rot13": "tt.rot13",
  "hex-encode": "tt.hexEncode",
  "hex-decode": "tt.hexDecode",
  "reverse-text": "tt.reverseText",
  "reverse-lines": "tt.reverseLines",
  "remove-whitespace": "tt.removeWhitespace",
  "collapse-whitespace": "tt.collapseWhitespace",
  "add-line-numbers": "tt.addLineNumbers",
  "remove-line-numbers": "tt.removeLineNumbers",
};

export function TextTransformDialog({ content, onApply, onClose }: TextTransformDialogProps) {
  const { t } = useI18n();
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
          <h3>{t("dialog.textTransform")}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="transform-section">
            <h4>{t("tt.encodeDecode")}</h4>
            <div className="transform-buttons">
              {(Object.keys(TRANSFORM_LABEL_KEYS) as TransformType[]).map((type) => (
                <button
                  key={type}
                  className={`btn btn-small ${selected === type ? "btn-primary" : "btn-default"}`}
                  onClick={() => handleTransform(type)}
                >
                  {t(TRANSFORM_LABEL_KEYS[type])}
                </button>
              ))}
            </div>
          </div>

          <div className="transform-section">
            <h4>{t("tt.hash")}</h4>
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
              <h4>{t("tt.result")}</h4>
              <textarea
                className="transform-result"
                value={result}
                readOnly
                rows={8}
              />
              <div className="transform-actions">
                <button className="btn btn-primary" onClick={() => onApply(result)}>
                  {t("tt.applyToEditor")}
                </button>
                <button
                  className="btn btn-default"
                  onClick={() => navigator.clipboard.writeText(result)}
                >
                  {t("tt.copyToClipboard")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
