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
                let m = |id: &str, label: &str| MenuItem::with_id(app_handle, id, label, true, None::<&str>);

                // ========== 文件菜单 (fileMenu) ==========
                let file_menu = Submenu::with_items(app_handle, "文件", true, &[
                    &m("new", "新建")?, &m("open", "打开...")?, &m("open_with_encoding", "按编码打开...")?,
                    &m("reload_from_disk", "从磁盘重载")?,
                    &m("save", "保存")?, &m("save_as", "另存为...")?, &m("save_copy", "保存副本...")?, &m("save_all", "全部保存")?,
                    &m("close", "关闭")?, &m("close_all", "关闭所有")?, &m("close_all_but_current", "关闭所有但当前")?,
                    &m("copy_path", "复制文件路径")?, &m("copy_directory", "复制目录路径")?, &m("copy_filename", "复制文件名")?,
                    &m("toggle_bom", "切换 BOM")?,
                    &m("open_in_default", "在默认程序打开")?, &m("run_command", "运行命令...")?,
                    &m("file_props", "文件属性...")?,
                    &m("quit", "退出 MarkPT")?,
                ])?;

                // ========== 编辑菜单 (editMenu) ==========
                let edit_menu = Submenu::with_items(app_handle, "编辑", true, &[
                    &m("edit_undo", "撤销")?, &m("edit_redo", "重做")?,
                    &m("edit_toggle_comment", "切换注释")?,
                    &m("edit_delete_line", "删除当前行")?, &m("edit_duplicate_line", "复制当前行")?,
                    &m("edit_move_up", "上移行")?, &m("edit_move_down", "下移行")?,
                    &m("edit_delete_blank", "删除空行")?, &m("edit_remove_dup", "去重复行")?,
                    &m("edit_trim_trailing", "去行尾空格")?,
                    &m("edit_upper", "转大写")?, &m("edit_lower", "转小写")?,
                    &m("edit_sentence_case", "句首大写")?, &m("edit_random_case", "随机大小写")?,
                    &m("edit_sort_asc", "行排序(升序)")?, &m("edit_sort_desc", "行排序(降序)")?,
                    &m("edit_sort_length_asc", "按长度排序(升序)")?, &m("edit_sort_length_desc", "按长度排序(降序)")?,
                    &m("edit_sort_random", "随机排序")?, &m("edit_reverse_lines", "反转行序")?,
                    &m("edit_filter_lines", "过滤行...")?, &m("edit_filter_lines_remove", "移除匹配行...")?,
                    &m("edit_merge_lines", "合并行(空格)")?, &m("edit_merge_lines_comma", "合并行(逗号)")?, &m("edit_split_line", "拆分行")?,
                    &m("eol_lf", "行尾: LF")?, &m("eol_crlf", "行尾: CRLF")?, &m("eol_cr", "行尾: CR")?,
                    &m("tab_to_space", "Tab 转空格")?, &m("space_to_tab", "空格转 Tab")?,
                    &m("format_code", "格式化代码")?,
                    &m("format_json", "格式化 JSON")?, &m("format_xml", "格式化 XML")?, &m("format_html", "格式化 HTML")?, &m("format_css", "格式化 CSS")?, &m("format_sql", "格式化 SQL")?,
                    &m("insert_datetime", "插入日期时间...")?, &m("special_char", "特殊字符...")?, &m("color_picker", "颜色选择器...")?, &m("insert_file", "插入文件内容...")?,
                    &m("char_full_width", "转全角")?, &m("char_half_width", "转半角")?, &m("char_remove_non_printable", "删除非打印字符")?,
                    &m("char_normalize_nfc", "Unicode NFC")?, &m("char_to_snake", "转 snake_case")?, &m("char_to_camel", "转 camelCase")?, &m("char_to_pascal", "转 PascalCase")?, &m("char_to_kebab", "转 kebab-case")?,
                ])?;

                // ========== 查找菜单 (searchMenu) ==========
                let search_menu = Submenu::with_items(app_handle, "查找", true, &[
                    &m("find", "查找...")?, &m("find_next", "查找下一个")?, &m("find_prev", "查找上一个")?,
                    &m("replace", "替换...")?,
                    &m("find_in_files", "在文件中查找...")?, &m("batch_find_replace", "批量查找替换...")?, &m("multi_search", "多文档查找替换...")?,
                    &m("goto", "转到行...")?, &m("jump_to_bracket", "跳转到匹配括号")?, &m("select_to_bracket", "选中到匹配括号")?,
                    &m("mark_all", "标记所有匹配")?, &m("unmark_all", "取消所有标记")?,
                    &m("next_bookmark", "下一书签")?, &m("prev_bookmark", "上一书签")?, &m("clear_bookmarks", "清除所有书签")?,
                ])?;

                // ========== 视图菜单 (viewMenu) ==========
                let view_menu = Submenu::with_items(app_handle, "视图", true, &[
                    &m("toggle_sidebar", "切换侧边栏")?, &m("command_palette", "命令面板...")?,
                    &m("split_horizontal", "水平分屏")?, &m("split_vertical", "垂直分屏")?, &m("split_close", "关闭分屏")?,
                    &m("function_list", "函数列表...")?, &m("doc_switcher", "切换文档...")?,
                    &m("toggle_word_wrap", "自动换行")?,
                    &m("zoom_in", "放大")?, &m("zoom_out", "缩小")?, &m("zoom_reset", "重置缩放")?,
                    &m("full_screen", "全屏")?, &m("always_on_top", "窗口置顶")?, &m("postit_mode", "便利贴模式")?,
                    &m("markdown_preview", "Markdown 预览...")?, &m("csv_viewer", "CSV/TSV 查看...")?, &m("regex_tester", "正则测试器...")?,
                ])?;

                // ========== 编码菜单 (encodingMenu) ==========
                let encoding_menu = Submenu::with_items(app_handle, "编码", true, &[
                    &m("encoding", "编码设置...")?,
                    &m("encode_utf8", "用 UTF-8 编码")?, &m("encode_utf8_bom", "用 UTF-8-BOM 编码")?,
                    &m("encode_gbk", "用 GBK 编码")?, &m("encode_gb2312", "用 GB2312 编码")?,
                    &m("encode_utf16le", "用 UTF-16LE 编码")?, &m("encode_utf16be", "用 UTF-16BE 编码")?,
                    &m("encode_ascii", "用 ASCII 编码")?,
                    &m("convert_utf8", "转换为 UTF-8")?, &m("convert_utf8_bom", "转换为 UTF-8-BOM")?,
                    &m("convert_gbk", "转换为 GBK")?, &m("convert_gb2312", "转换为 GB2312")?,
                    &m("convert_utf16le", "转换为 UTF-16LE")?, &m("convert_utf16be", "转换为 UTF-16BE")?,
                ])?;

                // ========== 语言菜单 (languageMenu) ==========
                let language_menu = Submenu::with_items(app_handle, "语言", true, &[
                    &m("language_selector", "选择语言...")?,
                    &m("lang_plaintext", "纯文本")?,
                    &m("lang_javascript", "JavaScript")?, &m("lang_typescript", "TypeScript")?,
                    &m("lang_python", "Python")?, &m("lang_rust", "Rust")?,
                    &m("lang_c", "C")?, &m("lang_cpp", "C++")?, &m("lang_java", "Java")?,
                    &m("lang_go", "Go")?, &m("lang_html", "HTML")?, &m("lang_css", "CSS")?,
                    &m("lang_json", "JSON")?, &m("lang_xml", "XML")?, &m("lang_markdown", "Markdown")?,
                    &m("lang_sql", "SQL")?, &m("lang_shell", "Shell")?, &m("lang_yaml", "YAML")?,
                ])?;

                // ========== 设置菜单 (settingsMenu) ==========
                let settings_menu = Submenu::with_items(app_handle, "设置", true, &[
                    &m("settings", "首选项...")?,
                    &m("shortcut_mapper", "快捷键映射...")?,
                    &m("shortcuts", "快捷键帮助...")?,
                    &m("snippets", "代码片段...")?,
                    &m("clipboard_history", "剪贴板历史...")?,
                    &m("plugin_manager", "插件管理...")?,
                ])?;

                // ========== 工具菜单 (toolsMenu) ==========
                let tools_menu = Submenu::with_items(app_handle, "工具", true, &[
                    &m("char_stats", "字符统计...")?, &m("hex_viewer", "十六进制查看...")?,
                    &m("text_transform", "文本转换...")?,
                    &m("macro_start_stop", "开始/停止录制宏")?,
                    &m("macro_playback", "播放宏")?,
                    &m("run_macro_multiple", "多次运行宏...")?,
                    &m("macro_save", "保存当前录制的宏")?,
                ])?;

                // ========== 对比菜单 (compareMenu) ==========
                let compare_menu = Submenu::with_items(app_handle, "对比", true, &[
                    &m("compare_start", "开始对比...")?,
                    &m("compare_clear", "清除对比")?,
                    &m("compare_sync_scroll", "同步滚动")?,
                    &m("compare_next_diff", "下一差异")?,
                    &m("compare_prev_diff", "上一差异")?,
                ])?;

                // ========== 窗口菜单 (windowMenu) ==========
                let window_menu = Submenu::with_items(app_handle, "窗口", true, &[
                    &m("window_sort_name", "按名称排序")?,
                    &m("window_sort_path", "按路径排序")?,
                    &m("window_sort_time", "按打开时间排序")?,
                    &m("window_cascade", "层叠窗口")?,
                    &m("window_tile_horizontal", "水平平铺")?,
                    &m("window_tile_vertical", "垂直平铺")?,
                    &m("window_list", "窗口列表...")?,
                ])?;

                // ========== 帮助菜单 (helpMenu) ==========
                let help_menu = Submenu::with_items(app_handle, "帮助", true, &[
                    &m("about", "关于 MarkPT")?,
                ])?;

                let menu = Menu::with_items(app_handle, &[
                    &file_menu, &edit_menu, &search_menu, &view_menu,
                    &encoding_menu, &language_menu, &settings_menu, &tools_menu,
                    &compare_menu, &window_menu, &help_menu,
                ])?;
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
