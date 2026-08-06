mod commands;
mod models;
mod services;

use commands::file_watcher::WatcherState;
use services::watcher::FileWatcher;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .manage(WatcherState(std::sync::Mutex::new(FileWatcher::new())))
        .setup(|app| {
            #[cfg(target_os = "macos")]
            {
                use tauri::menu::{Menu, MenuItem, Submenu};
                let app_handle = app.handle();

                let new_item = MenuItem::with_id(app_handle, "new", "新建", true, None)?;
                let open_item = MenuItem::with_id(app_handle, "open", "打开...", true, None)?;
                let save_item = MenuItem::with_id(app_handle, "save", "保存", true, None)?;
                let save_as_item = MenuItem::with_id(app_handle, "save_as", "另存为...", true, None)?;
                let close_item = MenuItem::with_id(app_handle, "close", "关闭标签", true, None)?;
                let quit_item = MenuItem::with_id(app_handle, "quit", "退出 MacPad", true, None)?;

                let file_menu = Submenu::with_items(
                    app_handle,
                    "文件",
                    true,
                    &[&new_item, &open_item, &save_item, &save_as_item, &close_item, &quit_item],
                )?;

                let find_item = MenuItem::with_id(app_handle, "find", "查找...", true, None)?;
                let replace_item = MenuItem::with_id(app_handle, "replace", "替换...", true, None)?;
                let goto_item = MenuItem::with_id(app_handle, "goto", "跳转到行...", true, None)?;
                let find_in_files_item = MenuItem::with_id(app_handle, "find_in_files", "在文件中查找...", true, None)?;

                let search_menu = Submenu::with_items(
                    app_handle,
                    "搜索",
                    true,
                    &[&find_item, &replace_item, &goto_item, &find_in_files_item],
                )?;

                let encoding_item = MenuItem::with_id(app_handle, "encoding", "编码...", true, None)?;
                let settings_item = MenuItem::with_id(app_handle, "settings", "设置...", true, None)?;
                let tools_menu = Submenu::with_items(
                    app_handle,
                    "工具",
                    true,
                    &[&encoding_item, &settings_item],
                )?;

                let menu = Menu::with_items(app_handle, &[&file_menu, &search_menu, &tools_menu])?;
                app_handle.set_menu(menu)?;
            }
            Ok(())
        })
        .on_menu_event(|app, event| {
            let id = event.id().as_ref();
            let _ = app.emit("menu-event", id);
        })
        .invoke_handler(tauri::generate_handler![
            commands::file_io::open_file,
            commands::file_io::save_file,
            commands::file_io::save_file_as,
            commands::file_io::create_file,
            commands::file_io::get_file_meta,
            commands::large_file::open_large_file,
            commands::large_file::read_chunk,
            commands::large_file::read_tail,
            commands::large_file::read_line_at,
            commands::large_file::is_large_file,
            commands::large_file::count_lines,
            commands::encoding::detect_encoding,
            commands::encoding::convert_encoding,
            commands::encoding::reload_with_encoding,
            commands::encoding::save_with_encoding,
            commands::encoding::get_supported_encodings,
            commands::file_watcher::watch_file,
            commands::file_watcher::unwatch_file,
            commands::file_watcher::unwatch_all,
            commands::search::find_in_files,
            commands::search::search_in_file,
            commands::export::export_as_txt,
            commands::export::export_as_html,
            commands::export::export_as_rtf,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
