import { useState, useEffect, useMemo, useCallback } from "react";
import { useI18n } from "../../stores/i18nStore";

interface MarkdownPreviewProps {
  content: string;
  onClose: () => void;
}

export function MarkdownPreview({ content, onClose }: MarkdownPreviewProps) {
  const { t } = useI18n();
  const [view, setView] = useState<"split" | "preview">("split");

  const html = useMemo(() => renderMarkdown(content), [content]);

  return (
    <div className="markdown-preview-overlay" onClick={onClose}>
      <div className="markdown-preview" onClick={(e) => e.stopPropagation()}>
        <div className="markdown-preview-header">
          <h3>{t("dialog.markdownPreview")}</h3>
          <div className="view-toggle">
            <button className={`btn btn-small ${view === "split" ? "btn-primary" : ""}`} onClick={() => setView("split")}>{t("md.split")}</button>
            <button className={`btn btn-small ${view === "preview" ? "btn-primary" : ""}`} onClick={() => setView("preview")}>{t("md.previewOnly")}</button>
          </div>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="markdown-preview-body">
          {view === "split" && (
            <div className="markdown-split">
              <div className="markdown-source">
                <pre>{content}</pre>
              </div>
              <div className="markdown-rendered" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          )}
          {view === "preview" && (
            <div className="markdown-rendered-full" dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>
      </div>
    </div>
  );
}

function renderMarkdown(md: string): string {
  let html = md;
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => `<pre class="md-code"><code class="lang-${lang}">${code.trim()}</code></pre>`);
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline">$1</code>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^\*\*\*(.+)\*\*\*$/gm, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*\*(.+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/^\*\*(.+)\*\*$/gm, '<strong>$1</strong>');
  html = html.replace(/\*\*(.+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/^\*(.+)\*$/gm, '<em>$1</em>');
  html = html.replace(/\*(.+)\*/g, '<em>$1</em>');
  html = html.replace(/^\~\~(.+)\~\~$/gm, '<del>$1</del>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^---$/gm, '<hr />');
  html = html.replace(/^- \[x\] (.+)$/gim, '<div class="md-checkbox checked">☑ $1</div>');
  html = html.replace(/^- \[ \] (.+)$/gim, '<div class="md-checkbox">☐ $1</div>');
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, "");
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ordered">$1</li>');
  html = html.replace(/(<li class="ordered">[\s\S]*?<\/li>)/g, '<ol>$1</ol>');
  html = html.replace(/<\/ol>\s*<ol>/g, "");
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split("|").filter((c) => c.trim());
    if (cells.every((c) => /^[\s-:]+$/.test(c))) return "";
    return "<tr>" + cells.map((c) => `<td>${c.trim()}</td>`).join("") + "</tr>";
  });
  html = html.replace(/(<tr>[\s\S]*?<\/tr>)/g, "<table>$1</table>");
  html = html.replace(/<\/table>\s*<table>/g, "");
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";
  html = html.replace(/<p>\s*<(h\d|ul|ol|pre|blockquote|table|hr|div)/g, "<$1");
  html = html.replace(/<\/(h\d|ul|ol|pre|blockquote|table|hr|div)>\s*<\/p>/g, "</$1>");

  return html;
}
