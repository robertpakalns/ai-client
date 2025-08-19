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

fn main() {
    Builder::default()
        .invoke_handler(generate_handler![change_url])
        .setup(|app| {
            let script = include_str!("../../frontend-dist/script.js");
            let style = include_str!("../../assets/style.css");

            let inject_script = format!(
                r#"
                document.addEventListener("DOMContentLoaded", () => {{
                    const style = document.createElement('style');
                    style.innerHTML = `{style}`;
                    document.head.appendChild(style);
                }})
                "#,
            );

            WebviewWindowBuilder::new(
                app,
                "main",
                WebviewUrl::External("https://chatgpt.com".parse().unwrap()),
            )
            .title("AI Client")
            .initialization_script(script)
            .initialization_script(inject_script)
            .build()
            .unwrap();

            Ok(())
        })
        .run(generate_context!())
        .expect("Error while running Tauri app");
}
