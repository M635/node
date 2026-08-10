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

                let file_props_item = MenuItem::with_id(app_handle, "file_props", "文件属性...", true, None::<&str>)?;

                let file_menu = Submenu::with_items(
                    app_handle,
                    "文件",
                    true,
                    &[&new_item, &open_item, &save_item, &save_as_item, &close_item, &reload_disk_item, &copy_path_item, &file_props_item, &quit_item],
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
                let format_code_item = MenuItem::with_id(app_handle, "format_code", "格式化代码", true, None::<&str>)?;
                let insert_datetime_item = MenuItem::with_id(app_handle, "insert_datetime", "插入日期时间...", true, None::<&str>)?;
                let special_char_item = MenuItem::with_id(app_handle, "special_char", "特殊字符...", true, None::<&str>)?;
                let color_picker_item = MenuItem::with_id(app_handle, "color_picker", "颜色选择器...", true, None::<&str>)?;
                let eol_lf_item = MenuItem::with_id(app_handle, "eol_lf", "行尾: LF (Unix)", true, None::<&str>)?;
                let eol_crlf_item = MenuItem::with_id(app_handle, "eol_crlf", "行尾: CRLF (Windows)", true, None::<&str>)?;
                let eol_cr_item = MenuItem::with_id(app_handle, "eol_cr", "行尾: CR (Mac)", true, None::<&str>)?;
                let tab_to_space_item = MenuItem::with_id(app_handle, "tab_to_space", "Tab 转空格", true, None::<&str>)?;
                let space_to_tab_item = MenuItem::with_id(app_handle, "space_to_tab", "空格转 Tab", true, None::<&str>)?;
                let jump_bracket_item = MenuItem::with_id(app_handle, "jump_to_bracket", "跳转到匹配括号", true, None::<&str>)?;
                let select_bracket_item = MenuItem::with_id(app_handle, "select_to_bracket", "选中到匹配括号", true, None::<&str>)?;
                let format_json_item = MenuItem::with_id(app_handle, "format_json", "格式化 JSON", true, None::<&str>)?;
                let format_xml_item = MenuItem::with_id(app_handle, "format_xml", "格式化 XML", true, None::<&str>)?;
                let format_html_item = MenuItem::with_id(app_handle, "format_html", "格式化 HTML", true, None::<&str>)?;
                let format_css_item = MenuItem::with_id(app_handle, "format_css", "格式化 CSS", true, None::<&str>)?;
                let format_sql_item = MenuItem::with_id(app_handle, "format_sql", "格式化 SQL", true, None::<&str>)?;
                let char_full_item = MenuItem::with_id(app_handle, "char_full_width", "转全角", true, None::<&str>)?;
                let char_half_item = MenuItem::with_id(app_handle, "char_half_width", "转半角", true, None::<&str>)?;
                let char_nonprint_item = MenuItem::with_id(app_handle, "char_remove_non_printable", "删除非打印字符", true, None::<&str>)?;
                let char_nfc_item = MenuItem::with_id(app_handle, "char_normalize_nfc", "Unicode NFC 归一化", true, None::<&str>)?;
                let char_snake_item = MenuItem::with_id(app_handle, "char_to_snake", "转 snake_case", true, None::<&str>)?;
                let char_camel_item = MenuItem::with_id(app_handle, "char_to_camel", "转 camelCase", true, None::<&str>)?;
                let char_pascal_item = MenuItem::with_id(app_handle, "char_to_pascal", "转 PascalCase", true, None::<&str>)?;
                let char_kebab_item = MenuItem::with_id(app_handle, "char_to_kebab", "转 kebab-case", true, None::<&str>)?;
                let insert_file_item = MenuItem::with_id(app_handle, "insert_file", "插入文件内容...", true, None::<&str>)?;
                let copy_path_item = MenuItem::with_id(app_handle, "copy_path", "复制文件路径", true, None::<&str>)?;
                let reload_disk_item = MenuItem::with_id(app_handle, "reload_from_disk", "从磁盘重载", true, None::<&str>)?;
                let language_item = MenuItem::with_id(app_handle, "language_selector", "选择语言...", true, None::<&str>)?;

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
                        &format_code_item,
                        &format_json_item, &format_xml_item, &format_html_item, &format_css_item, &format_sql_item,
                        &insert_datetime_item, &special_char_item, &color_picker_item, &insert_file_item,
                        &eol_lf_item, &eol_crlf_item, &eol_cr_item,
                        &tab_to_space_item, &space_to_tab_item,
                        &jump_bracket_item, &select_bracket_item,
                        &char_full_item, &char_half_item, &char_nonprint_item, &char_nfc_item,
                        &char_snake_item, &char_camel_item, &char_pascal_item, &char_kebab_item,
                    ],
                )?;

                let find_item = MenuItem::with_id(app_handle, "find", "查找...", true, None::<&str>)?;
                let replace_item = MenuItem::with_id(app_handle, "replace", "替换...", true, None::<&str>)?;
                let goto_item = MenuItem::with_id(app_handle, "goto", "跳转到行...", true, None::<&str>)?;
                let find_in_files_item = MenuItem::with_id(app_handle, "find_in_files", "在文件中查找...", true, None::<&str>)?;
                let batch_find_replace_item = MenuItem::with_id(app_handle, "batch_find_replace", "批量查找替换...", true, None::<&str>)?;
                let find_next_item = MenuItem::with_id(app_handle, "find_next", "查找下一个", true, None::<&str>)?;
                let find_prev_item = MenuItem::with_id(app_handle, "find_prev", "查找上一个", true, None::<&str>)?;
                let next_bookmark_item = MenuItem::with_id(app_handle, "next_bookmark", "下一书签", true, None::<&str>)?;
                let prev_bookmark_item = MenuItem::with_id(app_handle, "prev_bookmark", "上一书签", true, None::<&str>)?;
                let clear_bookmarks_item = MenuItem::with_id(app_handle, "clear_bookmarks", "清除所有书签", true, None::<&str>)?;

                let search_menu = Submenu::with_items(
                    app_handle,
                    "搜索",
                    true,
                    &[&find_item, &replace_item, &find_next_item, &find_prev_item, &goto_item, &find_in_files_item, &batch_find_replace_item, &next_bookmark_item, &prev_bookmark_item, &clear_bookmarks_item],
                )?;

                let encoding_item = MenuItem::with_id(app_handle, "encoding", "编码...", true, None::<&str>)?;
                let settings_item = MenuItem::with_id(app_handle, "settings", "设置...", true, None::<&str>)?;
                let char_stats_item = MenuItem::with_id(app_handle, "char_stats", "字符统计...", true, None::<&str>)?;
                let hex_viewer_item = MenuItem::with_id(app_handle, "hex_viewer", "十六进制查看...", true, None::<&str>)?;
                let multi_search_item = MenuItem::with_id(app_handle, "multi_search", "多文档查找替换...", true, None::<&str>)?;
                let text_transform_item = MenuItem::with_id(app_handle, "text_transform", "文本转换...", true, None::<&str>)?;
                let tools_menu = Submenu::with_items(
                    app_handle,
                    "工具",
                    true,
                    &[&encoding_item, &settings_item, &char_stats_item, &hex_viewer_item, &multi_search_item, &text_transform_item],
                )?;

                let sidebar_item = MenuItem::with_id(app_handle, "toggle_sidebar", "切换侧边栏", true, None::<&str>)?;
                let command_palette_item = MenuItem::with_id(app_handle, "command_palette", "命令面板...", true, None::<&str>)?;
                let split_h_item = MenuItem::with_id(app_handle, "split_horizontal", "水平分屏", true, None::<&str>)?;
                let split_v_item = MenuItem::with_id(app_handle, "split_vertical", "垂直分屏", true, None::<&str>)?;
                let split_close_item = MenuItem::with_id(app_handle, "split_close", "关闭分屏", true, None::<&str>)?;
                let function_list_item = MenuItem::with_id(app_handle, "function_list", "函数列表...", true, None::<&str>)?;
                let word_wrap_item = MenuItem::with_id(app_handle, "toggle_word_wrap", "切换自动换行", true, None::<&str>)?;
                let doc_switcher_item = MenuItem::with_id(app_handle, "doc_switcher", "切换文档...", true, None::<&str>)?;
                let zoom_in_item = MenuItem::with_id(app_handle, "zoom_in", "放大", true, None::<&str>)?;
                let zoom_out_item = MenuItem::with_id(app_handle, "zoom_out", "缩小", true, None::<&str>)?;
                let zoom_reset_item = MenuItem::with_id(app_handle, "zoom_reset", "重置缩放", true, None::<&str>)?;
                let fullscreen_item = MenuItem::with_id(app_handle, "full_screen", "全屏", true, None::<&str>)?;
                let always_on_top_item = MenuItem::with_id(app_handle, "always_on_top", "窗口置顶", true, None::<&str>)?;
                let markdown_preview_item = MenuItem::with_id(app_handle, "markdown_preview", "Markdown 预览...", true, None::<&str>)?;
                let csv_viewer_item = MenuItem::with_id(app_handle, "csv_viewer", "CSV/TSV 查看...", true, None::<&str>)?;
                let regex_tester_item = MenuItem::with_id(app_handle, "regex_tester", "正则测试器...", true, None::<&str>)?;
                let view_menu = Submenu::with_items(
                    app_handle,
                    "视图",
                    true,
                    &[
                        &sidebar_item, &command_palette_item,
                        &split_h_item, &split_v_item, &split_close_item,
                        &function_list_item, &word_wrap_item,
                        &doc_switcher_item,
                        &zoom_in_item, &zoom_out_item, &zoom_reset_item,
                        &fullscreen_item, &always_on_top_item,
                        &language_item,
                        &markdown_preview_item, &csv_viewer_item, &regex_tester_item,
                    ],
                )?;

                let shortcuts_item = MenuItem::with_id(app_handle, "shortcuts", "快捷键...", true, None::<&str>)?;
                let shortcut_mapper_item = MenuItem::with_id(app_handle, "shortcut_mapper", "快捷键映射...", true, None::<&str>)?;
                let about_item = MenuItem::with_id(app_handle, "about", "关于 MarkPT", true, None::<&str>)?;
                let help_menu = Submenu::with_items(
                    app_handle,
                    "帮助",
                    true,
                    &[&shortcuts_item, &shortcut_mapper_item, &about_item],
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
