use crate::services::watcher::FileWatcher;
use std::sync::Mutex;
use tauri::{AppHandle, State};

pub struct WatcherState(pub Mutex<FileWatcher>);

#[tauri::command]
pub fn watch_file(app: AppHandle, state: State<WatcherState>, path: String) -> Result<(), String> {
    let watcher = state
        .0
        .lock()
        .map_err(|_| "文件监听服务状态异常".to_string())?;
    watcher.watch(app, &path)
}

#[tauri::command]
pub fn unwatch_file(state: State<WatcherState>, path: String) -> Result<(), String> {
    let watcher = state
        .0
        .lock()
        .map_err(|_| "文件监听服务状态异常".to_string())?;
    watcher.unwatch(&path);
    Ok(())
}

#[tauri::command]
pub fn unwatch_all(state: State<WatcherState>) -> Result<(), String> {
    let watcher = state
        .0
        .lock()
        .map_err(|_| "文件监听服务状态异常".to_string())?;
    watcher.unwatch_all();
    Ok(())
}
