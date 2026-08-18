import { create } from "zustand";
import type { SearchSummary, SearchResult } from "../types/command";

interface SearchStore {
  isSearchPanelOpen: boolean;
  isReplacePanelOpen: boolean;
  isFindInFilesOpen: boolean;
  searchQuery: string;
  replaceQuery: string;
  isRegex: boolean;
  caseSensitive: boolean;
  wholeWord: boolean;
  searchResults: SearchResult[];
  totalMatches: number;
  filesMatched: number;
  isSearching: boolean;
  searchTruncated: boolean;
  currentMatchIndex: number;
  searchHistory: string[];
  replaceHistory: string[];
  surroundMode: boolean;
  surroundChars: [string, string];
  searchInSelection: boolean;

  toggleSearchPanel: () => void;
  toggleReplacePanel: () => void;
  toggleFindInFiles: () => void;
  closeAllPanels: () => void;
  setSearchQuery: (query: string) => void;
  setReplaceQuery: (query: string) => void;
  toggleRegex: () => void;
  toggleCaseSensitive: () => void;
  toggleWholeWord: () => void;
  setResults: (summary: SearchSummary) => void;
  clearResults: () => void;
  setSearching: (searching: boolean) => void;
  nextMatch: () => void;
  prevMatch: () => void;
  addSearchHistory: (query: string) => void;
  addReplaceHistory: (query: string) => void;
  clearSearchHistory: () => void;
  setSurroundMode: (enable: boolean) => void;
  setSurroundChars: (chars: [string, string]) => void;
  setSearchInSelection: (enable: boolean) => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  isSearchPanelOpen: false,
  isReplacePanelOpen: false,
  isFindInFilesOpen: false,
  searchQuery: "",
  replaceQuery: "",
  isRegex: false,
  caseSensitive: false,
  wholeWord: false,
  searchResults: [],
  totalMatches: 0,
  filesMatched: 0,
  isSearching: false,
  searchTruncated: false,
  currentMatchIndex: 0,
  searchHistory: [],
  replaceHistory: [],
  surroundMode: false,
  surroundChars: ["(", ")"],
  searchInSelection: false,

  toggleSearchPanel: () =>
    set((s) => ({ isSearchPanelOpen: !s.isSearchPanelOpen })),
  toggleReplacePanel: () =>
    set((s) => ({
      isReplacePanelOpen: !s.isReplacePanelOpen,
      isSearchPanelOpen: true,
    })),
  toggleFindInFiles: () =>
    set((s) => ({ isFindInFilesOpen: !s.isFindInFilesOpen })),
  closeAllPanels: () =>
    set({
      isSearchPanelOpen: false,
      isReplacePanelOpen: false,
      isFindInFilesOpen: false,
      searchQuery: "",
      searchResults: [],
      totalMatches: 0,
      filesMatched: 0,
      currentMatchIndex: 0,
      searchTruncated: false,
    }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setReplaceQuery: (query) => set({ replaceQuery: query }),
  toggleRegex: () => set((s) => ({ isRegex: !s.isRegex })),
  toggleCaseSensitive: () =>
    set((s) => ({ caseSensitive: !s.caseSensitive })),
  toggleWholeWord: () => set((s) => ({ wholeWord: !s.wholeWord })),
  setResults: (summary) =>
    set({
      searchResults: summary.results,
      totalMatches: summary.total_matches,
      filesMatched: summary.files_matched,
      searchTruncated: summary.truncated,
      currentMatchIndex: 0,
    }),
  clearResults: () =>
    set({
      searchResults: [],
      totalMatches: 0,
      filesMatched: 0,
      searchTruncated: false,
    }),
  setSearching: (searching) => set({ isSearching: searching }),
  nextMatch: () =>
    set((s) => ({
      currentMatchIndex:
        s.searchResults.length > 0
          ? (s.currentMatchIndex + 1) % s.searchResults.length
          : 0,
    })),
  prevMatch: () =>
    set((s) => ({
      currentMatchIndex:
        s.searchResults.length > 0
          ? (s.currentMatchIndex - 1 + s.searchResults.length) %
            s.searchResults.length
          : 0,
    })),
  addSearchHistory: (query) =>
    set((s) => ({
      searchHistory: [
        query,
        ...s.searchHistory.filter((q) => q !== query),
      ].slice(0, 30),
    })),
  addReplaceHistory: (query) =>
    set((s) => ({
      replaceHistory: [
        query,
        ...s.replaceHistory.filter((q) => q !== query),
      ].slice(0, 30),
    })),
  clearSearchHistory: () =>
    set({ searchHistory: [], replaceHistory: [] }),
  setSurroundMode: (enable) => set({ surroundMode: enable }),
  setSurroundChars: (chars) => set({ surroundChars: chars }),
  setSearchInSelection: (enable) => set({ searchInSelection: enable }),
}));
