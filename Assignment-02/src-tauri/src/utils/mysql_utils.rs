use std::{cell::RefCell, fmt::Error};

use lazy_static::lazy_static;
use mysql::{Pool, PooledConn};
use tauri::async_runtime::Mutex;

use crate::config::mysql_config::MYSQL_CONFIG;

lazy_static! {
    static ref SHARED_SQL_POOL: Mutex<RefCell<Option<Pool>>> = Mutex::new(RefCell::new(None));
}

pub async fn init_mysql_connection_pool() {
    let default_url = MYSQL_CONFIG.lock().await.get_full_mysql_url();
    let pool_mutex = SHARED_SQL_POOL.lock().await;
    let mut shared_sql_pool = pool_mutex.borrow_mut();

    if shared_sql_pool.is_none() {
        let pool_res = Pool::new(default_url.as_str());
        match pool_res {
            Ok(pool) => {
                *shared_sql_pool = Some(pool);
            }
            _ => {}
        }
    }
}

pub async fn connect_data_base(url: &str) -> Result<PooledConn, Box<dyn std::error::Error>> {
    let default_url = MYSQL_CONFIG.lock().await.get_full_mysql_url();

    let pool_mutex = SHARED_SQL_POOL.lock().await;
    let mut shared_sql_pool = pool_mutex.borrow_mut();

    let conn = {
        if default_url == url {
            match shared_sql_pool.as_mut() {
                Some(pool) => pool.get_conn()?,
                None => Pool::new(url)?.get_conn()?,
            }
        } else {
            Pool::new(url)?.get_conn()?
        }
    };

    Ok(conn)
}
