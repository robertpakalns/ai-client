#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Builder, WebviewUrl, WebviewWindowBuilder, generate_context};

fn main() {
    Builder::default()
        .setup(|app| {
            let script = include_str!("../../frontend-dist/script.js");

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
