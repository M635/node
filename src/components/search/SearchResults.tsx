import { useSearchStore } from "../../stores/searchStore";
import { useFileStore } from "../../stores/fileStore";
import { truncatePath } from "../../utils/fileUtils";

export function SearchResults() {
  const { searchResults, totalMatches, filesMatched, searchTruncated } = useSearchStore();
  const { openTab } = useFileStore();

  if (searchResults.length === 0) return null;

  const handleResultClick = (path: string, line: number) => {
    window.dispatchEvent(
      new CustomEvent("markpt:open-search-result", {
        detail: { path, line },
      })
    );
  };

  return (
    <div className="search-results">
      <div className="results-summary">
        {totalMatches} 个匹配, {filesMatched} 个文件
        {searchTruncated && <span className="truncated"> (已截断)</span>}
      </div>
      <div className="results-list">
        {searchResults.map((result, idx) => (
          <div
            key={idx}
            className="result-item"
            onClick={() => handleResultClick(result.path, result.line_number)}
          >
            <div className="result-file">{truncatePath(result.path, 50)}</div>
            <div className="result-line">
              <span className="line-number">{result.line_number}</span>
              <span className="line-content">{result.line_content}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
