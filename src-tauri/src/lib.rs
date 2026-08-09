mod commands;
mod models;
mod services;

use commands::file_watcher::WatcherState;
use services::watcher::FileWatcher;
use tauri::Emitter;

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

                let new_item = MenuItem::with_id(app_handle, "new", "新建", true, None::<&str>)?;
                let open_item = MenuItem::with_id(app_handle, "open", "打开...", true, None::<&str>)?;
                let save_item = MenuItem::with_id(app_handle, "save", "保存", true, None::<&str>)?;
                let save_as_item = MenuItem::with_id(app_handle, "save_as", "另存为...", true, None::<&str>)?;
                let close_item = MenuItem::with_id(app_handle, "close", "关闭标签", true, None::<&str>)?;
                let quit_item = MenuItem::with_id(app_handle, "quit", "退出 MarkPT", true, None::<&str>)?;

                let file_menu = Submenu::with_items(
                    app_handle,
                    "文件",
                    true,
                    &[&new_item, &open_item, &save_item, &save_as_item, &close_item, &quit_item],
                )?;

                let undo_item = MenuItem::with_id(app_handle, "edit_undo", "撤销", true, None::<&str>)?;
                let redo_item = MenuItem::with_id(app_handle, "edit_redo", "重做", true, None::<&str>)?;
                let delete_line_item = MenuItem::with_id(app_handle, "edit_delete_line", "删除当前行", true, None::<&str>)?;
                let duplicate_line_item = MenuItem::with_id(app_handle, "edit_duplicate_line", "复制当前行", true, None::<&str>)?;
                let move_up_item = MenuItem::with_id(app_handle, "edit_move_up", "上移行", true, None::<&str>)?;
                let move_down_item = MenuItem::with_id(app_handle, "edit_move_down", "下移行", true, None::<&str>)?;
                let delete_blank_item = MenuItem::with_id(app_handle, "edit_delete_blank", "删除空行", true, None::<&str>)?;
                let trim_trailing_item = MenuItem::with_id(app_handle, "edit_trim_trailing", "去行尾空格", true, None::<&str>)?;
                let toggle_comment_item = MenuItem::with_id(app_handle, "edit_toggle_comment", "切换注释", true, None::<&str>)?;
                let upper_item = MenuItem::with_id(app_handle, "edit_upper", "转大写", true, None::<&str>)?;
                let lower_item = MenuItem::with_id(app_handle, "edit_lower", "转小写", true, None::<&str>)?;
                let sort_asc_item = MenuItem::with_id(app_handle, "edit_sort_asc", "行排序(升序)", true, None::<&str>)?;
                let sort_desc_item = MenuItem::with_id(app_handle, "edit_sort_desc", "行排序(降序)", true, None::<&str>)?;
                let remove_dup_item = MenuItem::with_id(app_handle, "edit_remove_dup", "去重复行", true, None::<&str>)?;

                let edit_menu = Submenu::with_items(
                    app_handle,
                    "编辑",
                    true,
                    &[
                        &undo_item, &redo_item,
                        &delete_line_item, &duplicate_line_item,
                        &move_up_item, &move_down_item,
                        &delete_blank_item, &trim_trailing_item,
                        &toggle_comment_item,
                        &upper_item, &lower_item,
                        &sort_asc_item, &sort_desc_item,
                        &remove_dup_item,
                    ],
                )?;

                let find_item = MenuItem::with_id(app_handle, "find", "查找...", true, None::<&str>)?;
                let replace_item = MenuItem::with_id(app_handle, "replace", "替换...", true, None::<&str>)?;
                let goto_item = MenuItem::with_id(app_handle, "goto", "跳转到行...", true, None::<&str>)?;
                let find_in_files_item = MenuItem::with_id(app_handle, "find_in_files", "在文件中查找...", true, None::<&str>)?;

                let search_menu = Submenu::with_items(
                    app_handle,
                    "搜索",
                    true,
                    &[&find_item, &replace_item, &goto_item, &find_in_files_item],
                )?;

                let encoding_item = MenuItem::with_id(app_handle, "encoding", "编码...", true, None::<&str>)?;
                let settings_item = MenuItem::with_id(app_handle, "settings", "设置...", true, None::<&str>)?;
                let char_stats_item = MenuItem::with_id(app_handle, "char_stats", "字符统计...", true, None::<&str>)?;
                let hex_viewer_item = MenuItem::with_id(app_handle, "hex_viewer", "十六进制查看...", true, None::<&str>)?;
                let multi_search_item = MenuItem::with_id(app_handle, "multi_search", "多文档查找替换...", true, None::<&str>)?;
                let tools_menu = Submenu::with_items(
                    app_handle,
                    "工具",
                    true,
                    &[&encoding_item, &settings_item, &char_stats_item, &hex_viewer_item, &multi_search_item],
                )?;

                let sidebar_item = MenuItem::with_id(app_handle, "toggle_sidebar", "切换侧边栏", true, None::<&str>)?;
                let command_palette_item = MenuItem::with_id(app_handle, "command_palette", "命令面板...", true, None::<&str>)?;
                let split_h_item = MenuItem::with_id(app_handle, "split_horizontal", "水平分屏", true, None::<&str>)?;
                let split_v_item = MenuItem::with_id(app_handle, "split_vertical", "垂直分屏", true, None::<&str>)?;
                let split_close_item = MenuItem::with_id(app_handle, "split_close", "关闭分屏", true, None::<&str>)?;
                let function_list_item = MenuItem::with_id(app_handle, "function_list", "函数列表...", true, None::<&str>)?;
                let word_wrap_item = MenuItem::with_id(app_handle, "toggle_word_wrap", "切换自动换行", true, None::<&str>)?;
                let view_menu = Submenu::with_items(
                    app_handle,
                    "视图",
                    true,
                    &[
                        &sidebar_item, &command_palette_item,
                        &split_h_item, &split_v_item, &split_close_item,
                        &function_list_item, &word_wrap_item,
                    ],
                )?;

                let shortcuts_item = MenuItem::with_id(app_handle, "shortcuts", "快捷键...", true, None::<&str>)?;
                let about_item = MenuItem::with_id(app_handle, "about", "关于 MarkPT", true, None::<&str>)?;
                let help_menu = Submenu::with_items(
                    app_handle,
                    "帮助",
                    true,
                    &[&shortcuts_item, &about_item],
                )?;

                let menu = Menu::with_items(app_handle, &[&file_menu, &edit_menu, &search_menu, &tools_menu, &view_menu, &help_menu])?;
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
            commands::file_io::list_directory,
            commands::file_io::get_file_info,
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
