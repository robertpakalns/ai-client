#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Builder, WebviewUrl, WebviewWindowBuilder, generate_context, generate_handler};

#[tauri::command]
fn open_external(url: String) {
    println!("{url}");
    webbrowser::open(&url).ok();
}

fn main() {
    Builder::default()
        .invoke_handler(generate_handler![open_external])
        .setup(|app| {
            let script = include_str!("../../frontend-dist/index.js");

            WebviewWindowBuilder::new(
                app,
                "main",
                WebviewUrl::External("https://chatgpt.com".parse()?),
            )
            .title("AI Client")
            .initialization_script(script)
            .build()?;

            Ok(())
        })
        .run(generate_context!())
        .expect("Error while running Tauri app");
}
