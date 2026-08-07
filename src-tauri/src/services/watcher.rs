use notify_debouncer_mini::{new_debouncer, DebouncedEvent};
use parking_lot::Mutex;
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;
use std::time::Duration;
use tauri::{AppHandle, Emitter};

pub struct FileWatcher {
    debouncers: Arc<Mutex<HashMap<String, notify_debouncer_mini::Debouncer<notify::RecommendedWatcher>>>>,
}

impl FileWatcher {
    pub fn new() -> Self {
        Self {
            debouncers: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn watch(&self, app: AppHandle, path: &str) -> Result<(), String> {
        let path_buf = PathBuf::from(path);
        let path_key = path.to_string();
        let app_clone = app.clone();
        let path_for_callback = path.to_string();

        let mut debouncer = new_debouncer(
            Duration::from_millis(300),
            move |events: Result<Vec<DebouncedEvent>, notify::Error>| {
                if let Ok(evs) = events {
                    if !evs.is_empty() {
                        let _ = app_clone.emit(
                            "file-changed",
                            serde_json::json!({ "path": path_for_callback }),
                        );
                    }
                }
            },
        )
        .map_err(|e| format!("创建监听器失败: {}", e))?;

        debouncer
            .watcher()
            .watch(&path_buf, notify::RecursiveMode::NonRecursive)
            .map_err(|e| format!("监听文件失败: {}", e))?;

        self.debouncers.lock().insert(path_key, debouncer);
        Ok(())
    }

    pub fn unwatch(&self, path: &str) {
        self.debouncers.lock().remove(path);
    }

    pub fn unwatch_all(&self) {
        self.debouncers.lock().clear();
    }
}
