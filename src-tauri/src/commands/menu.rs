use tauri::menu::{Menu, MenuItem, Submenu};
use tauri::{AppHandle, Emitter};

/// 按语言选择文案。返回 String，避免旧实现中 Box::leak
/// 导致每次重建菜单都泄漏内存。
fn tr(lang: &str, zh: &str, en: &str) -> String {
    if lang == "en" {
        en.to_string()
    } else {
        zh.to_string()
    }
}

pub fn build_menu(app_handle: &AppHandle, lang: &str) -> tauri::Result<()> {
    let m = |id: &str, label: String| MenuItem::with_id(app_handle, id, label, true, None::<&str>);

    let file_menu = Submenu::with_items(
        app_handle,
        tr(lang, "文件", "File"),
        true,
        &[
            &m("new", tr(lang, "新建", "New"))?,
            &m("open", tr(lang, "打开...", "Open..."))?,
            &m(
                "open_with_encoding",
                tr(lang, "按编码打开...", "Open with Encoding..."),
            )?,
            &m(
                "reload_from_disk",
                tr(lang, "从磁盘重载", "Reload from Disk"),
            )?,
            &m("save", tr(lang, "保存", "Save"))?,
            &m("save_as", tr(lang, "另存为...", "Save As..."))?,
            &m("save_copy", tr(lang, "保存副本...", "Save Copy..."))?,
            &m("save_all", tr(lang, "全部保存", "Save All"))?,
            &m("close", tr(lang, "关闭标签", "Close Tab"))?,
            &m("close_all", tr(lang, "关闭所有标签", "Close All Tabs"))?,
            &m(
                "close_all_but_current",
                tr(lang, "关闭除当前外全部", "Close All but Current"),
            )?,
            &Submenu::with_items(
                app_handle,
                tr(lang, "文件操作", "File Operations"),
                true,
                &[
                    &m("copy_path", tr(lang, "复制文件路径", "Copy File Path"))?,
                    &m(
                        "copy_directory",
                        tr(lang, "复制目录路径", "Copy Directory Path"),
                    )?,
                    &m("copy_filename", tr(lang, "复制文件名", "Copy Filename"))?,
                    &m("toggle_bom", tr(lang, "切换 BOM", "Toggle BOM"))?,
                    &m(
                        "open_in_default",
                        tr(lang, "在默认程序打开", "Open in Default App"),
                    )?,
                    &m("run_command", tr(lang, "运行命令...", "Run Command..."))?,
                    &m("file_props", tr(lang, "文件属性...", "File Properties..."))?,
                ],
            )?,
            &m("quit", tr(lang, "退出 MarkPT", "Quit MarkPT"))?,
        ],
    )?;

    let edit_menu = Submenu::with_items(
        app_handle,
        tr(lang, "编辑", "Edit"),
        true,
        &[
            &m("edit_undo", tr(lang, "撤销", "Undo"))?,
            &m("edit_redo", tr(lang, "重做", "Redo"))?,
            &m("edit_cut", tr(lang, "剪切", "Cut"))?,
            &m("edit_copy", tr(lang, "复制", "Copy"))?,
            &m("edit_paste", tr(lang, "粘贴", "Paste"))?,
            &m(
                "edit_toggle_comment",
                tr(lang, "切换注释", "Toggle Comment"),
            )?,
            &m(
                "edit_delete_line",
                tr(lang, "删除当前行", "Delete Current Line"),
            )?,
            &m(
                "edit_duplicate_line",
                tr(lang, "复制当前行", "Duplicate Current Line"),
            )?,
            &m("edit_move_up", tr(lang, "上移行", "Move Line Up"))?,
            &m("edit_move_down", tr(lang, "下移行", "Move Line Down"))?,
            &Submenu::with_items(
                app_handle,
                tr(lang, "大小写转换", "Case Conversion"),
                true,
                &[
                    &m("edit_upper", tr(lang, "转大写", "UPPERCASE"))?,
                    &m("edit_lower", tr(lang, "转小写", "lowercase"))?,
                    &m("edit_sentence_case", tr(lang, "句首大写", "Sentence Case"))?,
                    &m("edit_random_case", tr(lang, "随机大小写", "Random Case"))?,
                ],
            )?,
            &Submenu::with_items(
                app_handle,
                tr(lang, "行排序", "Line Sorting"),
                true,
                &[
                    &m(
                        "edit_sort_asc",
                        tr(lang, "行排序(升序)", "Sort Lines (Asc)"),
                    )?,
                    &m(
                        "edit_sort_desc",
                        tr(lang, "行排序(降序)", "Sort Lines (Desc)"),
                    )?,
                    &m(
                        "edit_sort_length_asc",
                        tr(lang, "按长度排序(升序)", "Sort by Length (Asc)"),
                    )?,
                    &m(
                        "edit_sort_length_desc",
                        tr(lang, "按长度排序(降序)", "Sort by Length (Desc)"),
                    )?,
                    &m("edit_sort_random", tr(lang, "随机排序", "Sort Randomly"))?,
                    &m(
                        "edit_reverse_lines",
                        tr(lang, "反转行序", "Reverse Line Order"),
                    )?,
                ],
            )?,
            &Submenu::with_items(
                app_handle,
                tr(lang, "行操作", "Line Operations"),
                true,
                &[
                    &m(
                        "edit_delete_blank",
                        tr(lang, "删除空行", "Delete Blank Lines"),
                    )?,
                    &m(
                        "edit_remove_dup",
                        tr(lang, "去重复行", "Remove Duplicate Lines"),
                    )?,
                    &m(
                        "edit_trim_trailing",
                        tr(lang, "去行尾空格", "Trim Trailing Whitespace"),
                    )?,
                    &m(
                        "edit_filter_lines",
                        tr(lang, "过滤行...", "Filter Lines..."),
                    )?,
                    &m(
                        "edit_filter_lines_remove",
                        tr(lang, "移除匹配行...", "Remove Matching Lines..."),
                    )?,
                    &m(
                        "edit_merge_lines",
                        tr(lang, "合并行(空格)", "Merge Lines (Space)"),
                    )?,
                    &m(
                        "edit_merge_lines_comma",
                        tr(lang, "合并行(逗号)", "Merge Lines (Comma)"),
                    )?,
                    &m("edit_split_line", tr(lang, "拆分行", "Split Line"))?,
                    &m(
                        "edit_insert_blank_above",
                        tr(lang, "上方插入空行", "Insert Blank Line Above"),
                    )?,
                    &m(
                        "edit_insert_blank_below",
                        tr(lang, "下方插入空行", "Insert Blank Line Below"),
                    )?,
                    &m(
                        "edit_keep_blank_only",
                        tr(lang, "仅保留空行", "Keep Blank Lines Only"),
                    )?,
                    &m(
                        "edit_remove_adj_dup",
                        tr(lang, "删除连续重复行", "Remove Adjacent Duplicates"),
                    )?,
                    &m(
                        "edit_split_by_comma",
                        tr(lang, "按逗号拆分行", "Split Lines by Comma"),
                    )?,
                ],
            )?,
            &Submenu::with_items(
                app_handle,
                tr(lang, "格式化", "Format"),
                true,
                &[
                    &m("format_code", tr(lang, "格式化代码", "Format Code"))?,
                    &m("format_json", tr(lang, "格式化 JSON", "Format JSON"))?,
                    &m("format_xml", tr(lang, "格式化 XML", "Format XML"))?,
                    &m("format_html", tr(lang, "格式化 HTML", "Format HTML"))?,
                    &m("format_css", tr(lang, "格式化 CSS", "Format CSS"))?,
                    &m("format_sql", tr(lang, "格式化 SQL", "Format SQL"))?,
                ],
            )?,
            &m("eol_lf", tr(lang, "行尾: LF", "EOL: LF"))?,
            &m("eol_crlf", tr(lang, "行尾: CRLF", "EOL: CRLF"))?,
            &m("eol_cr", tr(lang, "行尾: CR", "EOL: CR"))?,
            &m("tab_to_space", tr(lang, "Tab 转空格", "Tab to Space"))?,
            &m("space_to_tab", tr(lang, "空格转 Tab", "Space to Tab"))?,
            &Submenu::with_items(
                app_handle,
                tr(lang, "插入", "Insert"),
                true,
                &[
                    &m(
                        "insert_datetime",
                        tr(lang, "插入日期时间...", "Insert DateTime..."),
                    )?,
                    &m(
                        "special_char",
                        tr(lang, "特殊字符...", "Special Characters..."),
                    )?,
                    &m("color_picker", tr(lang, "颜色选择器...", "Color Picker..."))?,
                    &m(
                        "insert_file",
                        tr(lang, "插入文件内容...", "Insert File Content..."),
                    )?,
                ],
            )?,
            &Submenu::with_items(
                app_handle,
                tr(lang, "字符转换", "Character Conversion"),
                true,
                &[
                    &m("char_full_width", tr(lang, "转全角", "To Full Width"))?,
                    &m("char_half_width", tr(lang, "转半角", "To Half Width"))?,
                    &m(
                        "char_remove_non_printable",
                        tr(lang, "删除非打印字符", "Remove Non-printable"),
                    )?,
                    &m("char_normalize_nfc", tr(lang, "Unicode NFC", "Unicode NFC"))?,
                    &m("char_to_snake", tr(lang, "转 snake_case", "To snake_case"))?,
                    &m("char_to_camel", tr(lang, "转 camelCase", "To camelCase"))?,
                    &m("char_to_pascal", tr(lang, "转 PascalCase", "To PascalCase"))?,
                    &m("char_to_kebab", tr(lang, "转 kebab-case", "To kebab-case"))?,
                ],
            )?,
        ],
    )?;

    let search_menu = Submenu::with_items(
        app_handle,
        tr(lang, "查找", "Search"),
        true,
        &[
            &m("find", tr(lang, "查找...", "Find..."))?,
            &m("find_next", tr(lang, "查找下一个", "Find Next"))?,
            &m("find_prev", tr(lang, "查找上一个", "Find Previous"))?,
            &m("replace", tr(lang, "替换...", "Replace..."))?,
            &m(
                "find_in_files",
                tr(lang, "在文件中查找...", "Find in Files..."),
            )?,
            &m(
                "batch_find_replace",
                tr(lang, "批量查找替换...", "Batch Find/Replace..."),
            )?,
            &m(
                "multi_search",
                tr(lang, "多文档查找替换...", "Multi-Document Search..."),
            )?,
            &m("goto", tr(lang, "转到行...", "Go to Line..."))?,
            &m(
                "jump_to_bracket",
                tr(lang, "跳转到匹配括号", "Jump to Bracket"),
            )?,
            &m(
                "select_to_bracket",
                tr(lang, "选中到匹配括号", "Select to Bracket"),
            )?,
            &m("mark_all", tr(lang, "标记所有匹配", "Mark All Matches"))?,
            &m("unmark_all", tr(lang, "取消所有标记", "Unmark All"))?,
            &m("next_bookmark", tr(lang, "下一书签", "Next Bookmark"))?,
            &m("prev_bookmark", tr(lang, "上一书签", "Previous Bookmark"))?,
            &m(
                "clear_bookmarks",
                tr(lang, "清除所有书签", "Clear All Bookmarks"),
            )?,
        ],
    )?;

    let view_menu = Submenu::with_items(
        app_handle,
        tr(lang, "视图", "View"),
        true,
        &[
            &m("toggle_sidebar", tr(lang, "切换侧边栏", "Toggle Sidebar"))?,
            &m(
                "command_palette",
                tr(lang, "命令面板...", "Command Palette..."),
            )?,
            &m("split_horizontal", tr(lang, "水平分屏", "Split Horizontal"))?,
            &m("split_vertical", tr(lang, "垂直分屏", "Split Vertical"))?,
            &m("split_close", tr(lang, "关闭分屏", "Close Split"))?,
            &m("function_list", tr(lang, "函数列表...", "Function List..."))?,
            &m(
                "doc_switcher",
                tr(lang, "切换文档...", "Switch Document..."),
            )?,
            &m("toggle_word_wrap", tr(lang, "自动换行", "Word Wrap"))?,
            &m("toggle_ruler", tr(lang, "显示标尺", "Show Ruler"))?,
            &m("zoom_in", tr(lang, "放大", "Zoom In"))?,
            &m("zoom_out", tr(lang, "缩小", "Zoom Out"))?,
            &m("zoom_reset", tr(lang, "重置缩放", "Reset Zoom"))?,
            &m("full_screen", tr(lang, "全屏", "Full Screen"))?,
            &m("always_on_top", tr(lang, "窗口置顶", "Always on Top"))?,
            &m("postit_mode", tr(lang, "便利贴模式", "Post-it Mode"))?,
            &Submenu::with_items(
                app_handle,
                tr(lang, "工具窗口", "Tool Windows"),
                true,
                &[
                    &m(
                        "markdown_preview",
                        tr(lang, "Markdown 预览...", "Markdown Preview..."),
                    )?,
                    &m(
                        "csv_viewer",
                        tr(lang, "CSV/TSV 查看...", "CSV/TSV Viewer..."),
                    )?,
                    &m("regex_tester", tr(lang, "正则测试器...", "Regex Tester..."))?,
                ],
            )?,
            &Submenu::with_items(
                app_handle,
                tr(lang, "标签排序", "Sort Tabs"),
                true,
                &[
                    &m("window_sort_name", tr(lang, "按名称", "by Name"))?,
                    &m("window_sort_path", tr(lang, "按路径", "by Path"))?,
                    &m("window_sort_time", tr(lang, "按类型", "by Type"))?,
                ],
            )?,
            &Submenu::with_items(
                app_handle,
                tr(lang, "窗口排列", "Window Layout"),
                true,
                &[
                    &m("window_cascade", tr(lang, "层叠窗口", "Cascade Windows"))?,
                    &m(
                        "window_tile_horizontal",
                        tr(lang, "水平平铺", "Tile Horizontally"),
                    )?,
                    &m(
                        "window_tile_vertical",
                        tr(lang, "垂直平铺", "Tile Vertically"),
                    )?,
                ],
            )?,
        ],
    )?;

    let encoding_menu = Submenu::with_items(
        app_handle,
        tr(lang, "编码", "Encoding"),
        true,
        &[
            &m("encoding", tr(lang, "编码设置...", "Encoding Settings..."))?,
            &m("encode_utf8", tr(lang, "用 UTF-8 编码", "Encode as UTF-8"))?,
            &m(
                "encode_utf8_bom",
                tr(lang, "用 UTF-8-BOM 编码", "Encode as UTF-8-BOM"),
            )?,
            &m("encode_gbk", tr(lang, "用 GBK 编码", "Encode as GBK"))?,
            &m(
                "encode_gb2312",
                tr(lang, "用 GB2312 编码", "Encode as GB2312"),
            )?,
            &m(
                "encode_utf16le",
                tr(lang, "用 UTF-16LE 编码", "Encode as UTF-16LE"),
            )?,
            &m(
                "encode_utf16be",
                tr(lang, "用 UTF-16BE 编码", "Encode as UTF-16BE"),
            )?,
            &m("encode_ascii", tr(lang, "用 ASCII 编码", "Encode as ASCII"))?,
            &m("encode_big5", tr(lang, "用 Big5 编码", "Encode as Big5"))?,
            &m("encode_shiftjis", tr(lang, "用 Shift-JIS 编码", "Encode as Shift-JIS"))?,
            &m("encode_euckr", tr(lang, "用 EUC-KR 编码", "Encode as EUC-KR"))?,
            &m("encode_iso88591", tr(lang, "用 ISO-8859-1 编码", "Encode as ISO-8859-1"))?,
            &m("encode_windows1252", tr(lang, "用 Windows-1252 编码", "Encode as Windows-1252"))?,
            &m("convert_utf8", tr(lang, "转换为 UTF-8", "Convert to UTF-8"))?,
            &m(
                "convert_utf8_bom",
                tr(lang, "转换为 UTF-8-BOM", "Convert to UTF-8-BOM"),
            )?,
            &m("convert_gbk", tr(lang, "转换为 GBK", "Convert to GBK"))?,
            &m(
                "convert_gb2312",
                tr(lang, "转换为 GB2312", "Convert to GB2312"),
            )?,
            &m(
                "convert_utf16le",
                tr(lang, "转换为 UTF-16LE", "Convert to UTF-16LE"),
            )?,
            &m(
                "convert_utf16be",
                tr(lang, "转换为 UTF-16BE", "Convert to UTF-16BE"),
            )?,
            &m("convert_big5", tr(lang, "转换为 Big5", "Convert to Big5"))?,
            &m("convert_shiftjis", tr(lang, "转换为 Shift-JIS", "Convert to Shift-JIS"))?,
            &m("convert_euckr", tr(lang, "转换为 EUC-KR", "Convert to EUC-KR"))?,
            &m("convert_iso88591", tr(lang, "转换为 ISO-8859-1", "Convert to ISO-8859-1"))?,
            &m("convert_windows1252", tr(lang, "转换为 Windows-1252", "Convert to Windows-1252"))?,
        ],
    )?;

    let language_menu = Submenu::with_items(
        app_handle,
        tr(lang, "语言", "Language"),
        true,
        &[
            &m(
                "language_selector",
                tr(lang, "选择语言...", "Select Language..."),
            )?,
            &m("lang_plaintext", tr(lang, "纯文本", "Plain Text"))?,
            &m("lang_javascript", "JavaScript".to_string())?,
            &m("lang_typescript", "TypeScript".to_string())?,
            &m("lang_python", "Python".to_string())?,
            &m("lang_rust", "Rust".to_string())?,
            &m("lang_c", "C".to_string())?,
            &m("lang_cpp", "C++".to_string())?,
            &m("lang_java", "Java".to_string())?,
            &m("lang_go", "Go".to_string())?,
            &m("lang_html", "HTML".to_string())?,
            &m("lang_css", "CSS".to_string())?,
            &m("lang_json", "JSON".to_string())?,
            &m("lang_xml", "XML".to_string())?,
            &m("lang_markdown", "Markdown".to_string())?,
            &m("lang_sql", "SQL".to_string())?,
            &m("lang_shell", "Shell".to_string())?,
            &m("lang_yaml", "YAML".to_string())?,
        ],
    )?;

    let settings_menu = Submenu::with_items(
        app_handle,
        tr(lang, "设置", "Settings"),
        true,
        &[
            &m("settings", tr(lang, "首选项...", "Preferences..."))?,
            &m(
                "shortcut_mapper",
                tr(lang, "快捷键映射...", "Shortcut Mapper..."),
            )?,
            &m("shortcuts", tr(lang, "快捷键帮助...", "Shortcut Help..."))?,
            &m("snippets", tr(lang, "代码片段...", "Snippets..."))?,
            &m(
                "clipboard_history",
                tr(lang, "剪贴板历史...", "Clipboard History..."),
            )?,
            &m(
                "plugin_manager",
                tr(lang, "插件管理...", "Plugin Manager..."),
            )?,
        ],
    )?;

    let tools_menu = Submenu::with_items(
        app_handle,
        tr(lang, "工具", "Tools"),
        true,
        &[
            &m("char_stats", tr(lang, "字符统计...", "Character Stats..."))?,
            &m("hex_viewer", tr(lang, "十六进制查看...", "Hex Viewer..."))?,
            &m(
                "text_transform",
                tr(lang, "文本转换...", "Text Transform..."),
            )?,
            &m(
                "macro_start_stop",
                tr(lang, "开始/停止录制宏", "Start/Stop Macro Recording"),
            )?,
            &m("macro_playback", tr(lang, "播放宏", "Playback Macro"))?,
            &m(
                "run_macro_multiple",
                tr(lang, "多次运行宏...", "Run Macro Multiple..."),
            )?,
            &m(
                "macro_save",
                tr(lang, "保存当前录制的宏", "Save Current Macro"),
            )?,
        ],
    )?;

    let compare_menu = Submenu::with_items(
        app_handle,
        tr(lang, "对比", "Compare"),
        true,
        &[
            &m("compare_start", tr(lang, "开始对比...", "Start Compare..."))?,
            &m("compare_clear", tr(lang, "清除对比", "Clear Compare"))?,
            &m("compare_sync_scroll", tr(lang, "同步滚动", "Sync Scroll"))?,
            &m("compare_next_diff", tr(lang, "下一差异", "Next Difference"))?,
            &m(
                "compare_prev_diff",
                tr(lang, "上一差异", "Previous Difference"),
            )?,
        ],
    )?;

    let help_menu = Submenu::with_items(
        app_handle,
        tr(lang, "帮助", "Help"),
        true,
        &[&m("about", tr(lang, "关于 MarkPT", "About MarkPT"))?],
    )?;

    let menu = Menu::with_items(
        app_handle,
        &[
            &file_menu,
            &edit_menu,
            &search_menu,
            &view_menu,
            &encoding_menu,
            &language_menu,
            &settings_menu,
            &tools_menu,
            &compare_menu,
            &help_menu,
        ],
    )?;
    app_handle.set_menu(menu)?;
    Ok(())
}

#[tauri::command]
pub fn rebuild_menu(app: AppHandle, lang: String) {
    let _ = build_menu(&app, &lang);
    let _ = app.emit("menu-rebuilt", &lang);
}
