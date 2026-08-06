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
}));
