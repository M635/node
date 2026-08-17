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

export interface NamedSession {
  name: string;
  data: SessionData;
}

const SESSION_FILE = "markpt-session.json";
const SESSIONS_DIR = "sessions";

async function getSessionPath(): Promise<string> {
  const dataDir = await appDataDir();
  return await join(dataDir, SESSION_FILE);
}

async function getSessionsDir(): Promise<string> {
  const dataDir = await appDataDir();
  const dir = await join(dataDir, SESSIONS_DIR);
  try {
    await invoke("create_dir", { path: dir });
  } catch { /* may already exist */ }
  return dir;
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

export async function saveNamedSession(name: string, data: SessionData): Promise<void> {
  const dir = await getSessionsDir();
  const path = await join(dir, `${name.replace(/[<>:"/\\|?*]/g, "_")}.json`);
  const json = JSON.stringify(data, null, 2);
  await invoke("save_file", { path, content: json, encoding: "UTF-8" });
}

export async function listNamedSessions(): Promise<{ name: string; saved_at: number; tab_count: number }[]> {
  try {
    const dir = await getSessionsDir();
    const entries = await invoke<[string, boolean][]>("list_directory", { path: dir });
    const sessions: { name: string; saved_at: number; tab_count: number }[] = [];
    for (const [fileName, isDir] of entries) {
      if (isDir || !fileName.endsWith(".json")) continue;
      try {
        const filePath = await join(dir, fileName);
        const result = await invoke<{ content: string }>("open_file", { path: filePath });
        const data = JSON.parse(result.content) as SessionData;
        sessions.push({
          name: fileName.replace(/\.json$/, ""),
          saved_at: data.saved_at,
          tab_count: data.tabs.length,
        });
      } catch { /* skip invalid */ }
    }
    return sessions.sort((a, b) => b.saved_at - a.saved_at);
  } catch {
    return [];
  }
}

export async function loadNamedSession(name: string): Promise<SessionData | null> {
  try {
    const dir = await getSessionsDir();
    const path = await join(dir, `${name.replace(/[<>:"/\\|?*]/g, "_")}.json`);
    const result = await invoke<{ content: string }>("open_file", { path });
    return JSON.parse(result.content) as SessionData;
  } catch {
    return null;
  }
}

export async function deleteNamedSession(name: string): Promise<void> {
  try {
    const dir = await getSessionsDir();
    const path = await join(dir, `${name.replace(/[<>:"/\\|?*]/g, "_")}.json`);
    await invoke("delete_file", { path });
  } catch { /* ignore */ }
}
