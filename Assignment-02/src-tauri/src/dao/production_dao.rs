use std::error::Error;

use crate::entity::production::{Assembling, Component, Production};

use mysql::prelude::Queryable;

use crate::config::mysql_config::MYSQL_CONFIG;
use crate::utils::mysql_utils::connect_data_base;

pub async fn query_all_productions() -> Result<Vec<Production>, Box<dyn Error>> {
    let url: String = { MYSQL_CONFIG.lock().await.get_full_mysql_url() };

    let mut conn = connect_data_base(&url).await?;

    let productions = conn.query_map("SELECT * FROM s6", |(cs6, weight, price)| Production {
        cs6,
        weight,
        price,
    })?;

    Ok(productions)
}

pub async fn query_all_components() -> Result<Vec<Component>, Box<dyn Error>> {
    let url: String = { MYSQL_CONFIG.lock().await.get_full_mysql_url() };

    let mut conn = connect_data_base(&url).await?;

    let components = conn.query_map("SELECT * FROM s7", |(ds7, weight, price)| Component {
        ds7,
        weight,
        price,
    })?;

    Ok(components)
}

pub async fn query_all_assembings() -> Result<Vec<Assembling>, Box<dyn Error>> {
    let url: String = { MYSQL_CONFIG.lock().await.get_full_mysql_url() };

    let mut conn = connect_data_base(&url).await?;

    let assemblings = conn.query_map("SELECT * FROM t7", |(ct7, dt7, cdnum)| Assembling {
        ct7,
        dt7,
        cdnum,
    })?;

    Ok(assemblings)
}
