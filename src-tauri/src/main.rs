#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Builder, WebviewUrl, WebviewWindowBuilder, generate_context};

fn main() {
    Builder::default()
        .plugin(tauri_plugin_shell::init())
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
