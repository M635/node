mod commands;
mod models;
mod services;

use commands::file_watcher::WatcherState;
use commands::lifecycle::{cleanup, ChildProcessRegistry, ShutdownState};
use services::watcher::FileWatcher;
use tauri::{AppHandle, Emitter, Manager, RunEvent, WindowEvent};

/// 安装 SIGINT / SIGTERM 信号处理：
/// 收到信号后走与窗口关闭相同的统一优雅退出流程（清理资源后退出）。
fn install_signal_handlers(app: AppHandle) {
    std::thread::spawn(move || {
        let runtime = match tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
        {
            Ok(rt) => rt,
            Err(e) => {
                eprintln!("[MarkPT] 信号处理运行时初始化失败: {}", e);
                return;
            }
        };
        runtime.block_on(async {
            #[cfg(unix)]
            {
                use tokio::signal::unix::{signal, SignalKind};
                let mut sigint = match signal(SignalKind::interrupt()) {
                    Ok(s) => s,
                    Err(e) => {
                        eprintln!("[MarkPT] 无法监听 SIGINT: {}", e);
                        return;
                    }
                };
                let mut sigterm = match signal(SignalKind::terminate()) {
                    Ok(s) => s,
                    Err(e) => {
                        eprintln!("[MarkPT] 无法监听 SIGTERM: {}", e);
                        return;
                    }
                };
                tokio::select! {
                    _ = sigint.recv() => {}
                    _ = sigterm.recv() => {}
                }
            }
            #[cfg(not(unix))]
            {
                let _ = tokio::signal::ctrl_c().await;
            }
            eprintln!("[MarkPT] 收到退出信号，开始优雅退出");
            cleanup(&app);
            app.exit(0);
        });
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .manage(WatcherState(std::sync::Mutex::new(FileWatcher::new())))
        .manage(ChildProcessRegistry::default())
        .manage(ShutdownState::default())
        .setup(|app| {
            install_signal_handlers(app.handle().clone());
            // 菜单语言由前端根据用户保存的语言偏好调用 rebuild_menu 构建
            Ok(())
        })
        .on_menu_event(|app, event| {
            let id = event.id().as_ref();
            let _ = app.emit("menu-event", id);
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                // 统一拦截关闭请求：先让前端保存会话，再调用 quit_app 完成退出。
                // 避免前端异步保存被窗口销毁打断、会话内容丢失。
                api.prevent_close();
                let app = window.app_handle();
                let shutdown = app.state::<ShutdownState>();
                if shutdown
                    .close_requested
                    .swap(true, std::sync::atomic::Ordering::SeqCst)
                {
                    return;
                }
                let _ = app.emit("window-close-requested", ());
                // 兜底看门狗：若前端 10 秒内未完成保存并调用 quit_app
                // （例如页面卡死），强制清理并退出，避免进程残留。
                let handle: AppHandle = app.clone();
                std::thread::spawn(move || {
                    std::thread::sleep(std::time::Duration::from_secs(10));
                    let quit_started = handle
                        .state::<ShutdownState>()
                        .quit_started
                        .load(std::sync::atomic::Ordering::SeqCst);
                    if !quit_started {
                        eprintln!("[MarkPT] 前端未在 10 秒内完成退出准备，执行强制退出");
                        cleanup(&handle);
                        handle.exit(0);
                    }
                });
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::file_io::open_file,
            commands::file_io::save_file,
            commands::file_io::save_file_as,
            commands::file_io::write_text_file,
            commands::file_io::create_dir,
            commands::file_io::delete_file,
            commands::file_io::create_file,
            commands::file_io::get_file_meta,
            commands::file_io::list_directory,
            commands::file_io::get_file_info,
            commands::file_io::compute_file_hashes,
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
            commands::search::replace_in_files,
            commands::export::export_as_txt,
            commands::export::export_as_html,
            commands::export::export_as_rtf,
            commands::menu::rebuild_menu,
            commands::lifecycle::run_command,
            commands::lifecycle::open_in_default,
            commands::lifecycle::quit_app,
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app_handle, event| {
        if let RunEvent::Exit = event {
            // 进程退出前统一清理：终止子进程、停止文件监听，
            // 释放全部句柄，避免残留后台进程/僵尸进程。
            cleanup(app_handle);
        }
    });
}
