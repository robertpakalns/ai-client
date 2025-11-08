#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    AppHandle, Builder, Manager, WebviewUrl, WebviewWindowBuilder, command, generate_context,
    generate_handler,
};

#[command]
fn change_url(app: AppHandle, url: String) {
    if let Some(window) = app.get_webview_window("main") {
        window.navigate(url.parse().unwrap()).unwrap();
    }
}

#[tauri::command]
fn open_external(url: String) {
    webbrowser::open(&url).ok();
}

fn main() {
    Builder::default()
        .invoke_handler(generate_handler![change_url, open_external])
        .setup(|app| {
            let script = include_str!("../../frontend-dist/index.js");

            WebviewWindowBuilder::new(
                app,
                "main",
                WebviewUrl::External("https://chatgpt.com".parse().unwrap()),
            )
            .title("AI Client")
            .initialization_script(script)
            .build()
            .unwrap();

            Ok(())
        })
        .run(generate_context!())
        .expect("Error while running Tauri app");
}
