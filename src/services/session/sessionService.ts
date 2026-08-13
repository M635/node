import { invoke } from "@tauri-apps/api/core";
import { appDataDir, join } from "@tauri-apps/api/path";

export interface SessionTab {
  path: string;
  name: string;
  content: string;
  is_new: boolean;
  is_dirty: boolean;
  cursor_line: number;
  cursor_column: number;
  scroll_position: number;
  encoding: string;
  language: string;
}

export interface SessionData {
  tabs: SessionTab[];
  active_tab_path: string | null;
  active_tab_id: string | null;
  sidebar_visible: boolean;
  window_width: number;
  window_height: number;
  saved_at: number;
}

const SESSION_FILE = "markpt-session.json";

async function getSessionPath(): Promise<string> {
  const dataDir = await appDataDir();
  return await join(dataDir, SESSION_FILE);
}

export async function saveSession(data: SessionData): Promise<void> {
  try {
    const path = await getSessionPath();
    const json = JSON.stringify(data, null, 2);
    await invoke("save_file", { path, content: json, encoding: "UTF-8" });
  } catch {
    // ignore save errors
  }
}

export async function loadSession(): Promise<SessionData | null> {
  try {
    const path = await getSessionPath();
    const result = await invoke<{ content: string }>("open_file", { path });
    return JSON.parse(result.content) as SessionData;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  try {
    const data: SessionData = {
      tabs: [],
      active_tab_path: null,
      active_tab_id: null,
      sidebar_visible: true,
      window_width: 800,
      window_height: 600,
      saved_at: Date.now(),
    };
    await saveSession(data);
  } catch {
    // ignore
  }
}
