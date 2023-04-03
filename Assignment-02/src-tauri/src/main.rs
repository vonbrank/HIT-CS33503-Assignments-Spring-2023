// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;
mod config;
mod dao;
mod entity;
mod utils;

use command::{
    database_crud::{
        add_factory_management, get_all_assemblings, get_all_components,
        get_all_count_of_componets_for_production_with_group_query, get_all_factories,
        get_all_factory_managements, get_all_factory_managers, get_all_productions,
        get_all_productions_with_example_nested_query, remove_factory_management,
    },
    greeting::greet,
};
use utils::mysql_utils::init_mysql_connection_pool;

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_all_factories,
            get_all_factory_managements,
            get_all_productions,
            get_all_components,
            get_all_assemblings,
            get_all_factory_managers,
            get_all_productions_with_example_nested_query,
            get_all_count_of_componets_for_production_with_group_query,
            add_factory_management,
            remove_factory_management
        ])
        .setup(|app| {
            tokio::spawn(async {
                init_mysql_connection_pool().await;
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
