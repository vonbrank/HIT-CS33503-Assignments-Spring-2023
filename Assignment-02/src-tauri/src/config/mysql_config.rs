use std::sync::Arc;

use mysql::{Pool, PooledConn};
use tauri::async_runtime::Mutex;

use lazy_static::lazy_static;

pub struct MySqlConfig {
    username: String,
    password: String,
    mysql_hostname: String,
    port: u16,
    database_name: String,
}

impl MySqlConfig {
    pub fn get_full_mysql_url(&self) -> String {
        format!(
            "mysql://{}:{}@{}:{}/{}",
            self.username, self.password, self.mysql_hostname, self.port, self.database_name
        )
    }
}

lazy_static! {
    pub static ref MYSQL_CONFIG: Mutex<MySqlConfig> = {
        Mutex::new(MySqlConfig {
            username: "".to_string(),
            password: "".to_string(),
            mysql_hostname: "".to_string(),
            port: 1234,
            database_name: "".to_string(),
        })
    };
}
