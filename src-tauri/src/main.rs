// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use aliyun_oss_rust_sdk::oss::OSS;
use aliyun_oss_rust_sdk::request::RequestBuilder;
use serde::{Deserialize, Serialize};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Serialize,Deserialize,Debug)]
#[serde(rename_all = "camelCase")]
struct UploadParam<'a> {
    app_key: String,
    app_secret: String,
    end_point: String,
    bucket: String,
    has_domain: bool,
    domain: Option<String>,
    file: &'a str
}

#[tauri::command]
async fn upload(data: UploadParam<'_>) -> Result<String,String>{
    #[cfg(target_os = "windows")]
    let file_name = file.split("\\").last().unwrap();

    #[cfg(target_os = "macos")]
    let file_name = data.file.split("/").last().unwrap();

    #[cfg(target_os = "linux")]
    let file_name = file.split("/").last().unwrap();

    let oss = OSS::new(data.app_key,data.app_secret,
    data.end_point.clone(),data.bucket.clone());
    let builder = RequestBuilder::new()
        .with_expire(60);

    if let Ok(_) = oss.put_object_from_file(file_name, data.file, builder).await {
        let mut path = String::new();
        if data.has_domain {
            path.push_str(format!("https://{}/{}",data.domain.unwrap(), file_name)
                .as_str());
        }else {
            path.push_str(format!("https://{}.{}/{}",data.bucket,data.end_point, file_name)
                .as_str());
        }

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
