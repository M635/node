//! 应用生命周期管理：子进程登记与清理、优雅退出、打开系统默认程序。
//!
//! 解决的问题：
//! 1. 应用退出时由前端异步保存会话，若直接关闭窗口，保存请求可能被丢弃；
//!    这里统一走「前端保存 → 调用 quit_app → 后端清理后退出」的流程。
//! 2. 运行外部命令产生的子进程在应用退出前必须被终止，避免残留僵尸进程。
//! 3. 关闭窗口后 macOS 默认只隐藏窗口、进程不退出，这里强制进入统一退出流程。

use std::collections::HashMap;
use std::process::{Child, Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use tauri::{AppHandle, Manager};

use crate::commands::file_watcher::WatcherState;
use crate::services::errors::friendly;

/// 子进程登记表：记录由「运行命令」功能启动的进程，
/// 应用退出时统一终止，防止残留后台进程。
pub struct ChildProcessRegistry(pub Arc<Mutex<HashMap<u64, Child>>>);

impl Default for ChildProcessRegistry {
    fn default() -> Self {
        Self(Arc::new(Mutex::new(HashMap::new())))
    }
}

impl ChildProcessRegistry {
    /// 终止所有已登记的子进程（含其进程组/进程树）。
    pub fn terminate_all(&self) {
        let children: Vec<Child> = {
            let mut guard = match self.0.lock() {
                Ok(g) => g,
                Err(_) => return,
            };
            guard.drain().map(|(_, child)| child).collect()
        };
        for mut child in children {
            terminate_child_tree(child.id());
            let _ = child.kill();
            let _ = child.wait();
        }
    }
}

/// 进程退出前的统一清理入口（幂等，可安全重复调用）。
pub fn cleanup(app: &AppHandle) {
    // 1. 终止所有由应用启动的子进程，避免残留僵尸进程
    if let Some(registry) = app.try_state::<ChildProcessRegistry>() {
        registry.terminate_all();
    }
    // 2. 停止所有文件监听器，释放底层监听句柄与线程
    if let Some(watcher_state) = app.try_state::<WatcherState>() {
        match watcher_state.0.lock() {
            Ok(guard) => guard.unwatch_all(),
            Err(_) => eprintln!("[MarkPT] 文件监听状态锁异常，跳过清理"),
        }
    }
}

/// 终止子进程及其整个进程组（Unix）/ 进程树（Windows）。
fn terminate_child_tree(pid: u32) {
    #[cfg(unix)]
    {
        // 向子进程所在的进程组发送 SIGKILL，连同其派生的孙进程一并终止
        unsafe {
            libc::kill(-(pid as i32), libc::SIGKILL);
        }
    }
    #[cfg(windows)]
    {
        let _ = Command::new("taskkill")
            .args(["/PID", &pid.to_string(), "/T", "/F"])
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn();
    }
}

/// 关闭窗口 / 退出相关状态。
pub struct ShutdownState {
    /// 是否已发起关闭窗口流程
    pub close_requested: AtomicBool,
    /// 前端是否已完成退出准备（保存会话）并请求退出
    pub quit_started: AtomicBool,
}

impl Default for ShutdownState {
    fn default() -> Self {
        Self {
            close_requested: AtomicBool::new(false),
            quit_started: AtomicBool::new(false),
        }
    }
}

/// 命令执行结果。
#[derive(serde::Serialize)]
pub struct CommandOutput {
    pub exit_code: i32,
    pub stdout: String,
    pub stderr: String,
    pub timed_out: bool,
}

const DEFAULT_TIMEOUT_SECS: u64 = 30;

/// 构造按平台解析命令行的 shell 进程。
fn shell_command(script: &str) -> Command {
    let mut cmd = if cfg!(windows) {
        let mut c = Command::new("cmd");
        c.arg("/C").arg(script);
        c
    } else {
        let mut c = Command::new("sh");
        c.arg("-c").arg(script);
        c
    };
    #[cfg(unix)]
    {
        // 让子进程成为独立进程组组长，退出清理时可按组整体终止，
        // 连同其派生的孙进程一并回收，避免残留
        use std::os::unix::process::CommandExt;
        cmd.process_group(0);
    }
    cmd.stdin(Stdio::null());
    cmd
}

/// 运行一条命令并捕获其输出（无交互、无 PTY，适合菜单里的「运行命令」）。
/// 命令超时会被终止；应用退出时命令进程也会被统一终止。
#[tauri::command]
pub fn run_command(
    app: AppHandle,
    command: String,
    timeout_secs: Option<u64>,
) -> Result<CommandOutput, String> {
    let script = command.trim();
    if script.is_empty() {
        return Err("命令不能为空".to_string());
    }

    let timeout = Duration::from_secs(timeout_secs.unwrap_or(DEFAULT_TIMEOUT_SECS).clamp(1, 600));

    let mut child = shell_command(script)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| friendly("运行命令", &e))?;

    let pid = child.id() as u64;
    let stdout_pipe = child
        .stdout
        .take()
        .ok_or_else(|| "无法读取命令输出".to_string())?;
    let stderr_pipe = child
        .stderr
        .take()
        .ok_or_else(|| "无法读取命令输出".to_string())?;

    // 登记子进程：应用退出时可统一终止；
    // 登记表锁异常时立即终止子进程，避免泄漏
    {
        let registry = app.state::<ChildProcessRegistry>();
        match registry.0.lock() {
            Ok(mut guard) => guard.insert(pid, child),
            Err(_) => {
                let mut c = child;
                let _ = c.kill();
                let _ = c.wait();
                return Err("子进程登记失败".to_string());
            }
        };
    }

    let (tx_out, rx_out) = mpsc::channel::<String>();
    let reader_out = std::thread::spawn(move || {
        use std::io::Read;
        let mut buf = String::new();
        let mut pipe = stdout_pipe;
        let _ = pipe.read_to_string(&mut buf);
        let _ = tx_out.send(buf);
    });

    let (tx_err, rx_err) = mpsc::channel::<String>();
    let reader_err = std::thread::spawn(move || {
        use std::io::Read;
        let mut buf = String::new();
        let mut pipe = stderr_pipe;
        let _ = pipe.read_to_string(&mut buf);
        let _ = tx_err.send(buf);
    });

    let deadline = Instant::now() + timeout;
    let mut timed_out = false;
    let exit_code;

    loop {
        let done = {
            let registry = app.state::<ChildProcessRegistry>();
            let locked = registry.0.lock();
            match locked {
                Ok(mut guard) => match guard.get_mut(&pid) {
                    Some(child) => child.try_wait().ok().flatten(),
                    None => None,
                },
                Err(_) => None,
            }
        };
        match done {
            Some(status) => {
                exit_code = status.code().unwrap_or(-1);
                break;
            }
            None => {
                if Instant::now() >= deadline {
                    // 超时：终止整个进程组，避免命令无限挂起
                    let registry = app.state::<ChildProcessRegistry>();
                    if let Ok(mut guard) = registry.0.lock() {
                        if let Some(mut c) = guard.remove(&pid) {
                            terminate_child_tree(c.id());
                            let _ = c.kill();
                            let _ = c.wait();
                        }
                    }
                    timed_out = true;
                    exit_code = -1;
                    break;
                }
                std::thread::sleep(Duration::from_millis(50));
            }
        }
    }

    // 从登记表移除已结束的进程
    {
        let registry = app.state::<ChildProcessRegistry>();
        let locked = registry.0.lock();
        if let Ok(mut guard) = locked {
            guard.remove(&pid);
        }
    }

    // 等待输出线程收尾（最多 2 秒），避免后台进程占用管道导致永久阻塞；
    // 未结束的读线程直接分离，随进程退出而回收
    let stdout = rx_out
        .recv_timeout(Duration::from_secs(2))
        .unwrap_or_default();
    let stderr = rx_err
        .recv_timeout(Duration::from_secs(2))
        .unwrap_or_default();
    drop(reader_out);
    drop(reader_err);

    Ok(CommandOutput {
        exit_code,
        stdout,
        stderr,
        timed_out,
    })
}

/// 用系统默认程序打开文件。
/// 打开的程序由系统托管，生命周期不归本应用管理，因此无需登记。
#[tauri::command]
pub fn open_in_default(path: String) -> Result<(), String> {
    let result = if cfg!(target_os = "macos") {
        Command::new("open").arg(&path).spawn()
    } else if cfg!(windows) {
        Command::new("cmd").args(["/C", "start", "", &path]).spawn()
    } else {
        Command::new("xdg-open").arg(&path).spawn()
    };
    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(friendly("打开文件", &e)),
    }
}

/// 前端完成会话保存后调用：清理资源并退出整个应用。
/// 该命令会立刻让进程退出（异步结果不会返回给前端）。
#[tauri::command]
pub fn quit_app(app: AppHandle) {
    let state = app.state::<ShutdownState>();
    state.quit_started.store(true, Ordering::SeqCst);
    cleanup(&app);
    app.exit(0);
}
