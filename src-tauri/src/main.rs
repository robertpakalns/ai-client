#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{generate_context, Builder, WebviewUrl, WebviewWindowBuilder};

fn main() {
    Builder::default()
        .setup(|app| {
            WebviewWindowBuilder::new(
                app,
                "main",
                WebviewUrl::External("https://chatgpt.com".parse().unwrap()),
            )
            .title("AI Client")
            .build()
            .unwrap();

            Ok(())
        })
        .run(generate_context!())
        .expect("Error while running Tauri app");
}
