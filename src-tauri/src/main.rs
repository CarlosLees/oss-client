// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use aliyun_oss_rust_sdk::oss::OSS;
use aliyun_oss_rust_sdk::request::RequestBuilder;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}



#[tauri::command]
async fn upload(file:&str) -> Result<String,String>{
    #[cfg(target_os = "windows")]
    let file_name = file.split("\\").last().unwrap();

    #[cfg(target_os = "macos")]
    let file_name = file.split("/").last().unwrap();

    #[cfg(target_os = "linux")]
    let file_name = file.split("/").last().unwrap();

    let oss = OSS::new("","",
    "","");
    let builder = RequestBuilder::new()
        .with_expire(60);
    if let Ok(_) = oss.put_object_from_file(file_name, file, builder).await {
        let path = format!("https://{}/{}","oss-cn-qingdao.aliyuncs.com", file_name);
        return Ok(path);
    }
    Err("上传失败".to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet,upload])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
