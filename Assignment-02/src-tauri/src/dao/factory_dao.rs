use std::error::Error;

use crate::entity::factory::{
    Factory, FactoryManagement, FactoryManagementJoined, FactoryManagementPrimaryKey,
    FactoryManager,
};

use mysql::params;
use mysql::prelude::{BinQuery, Queryable, WithParams};

use crate::config::mysql_config::MYSQL_CONFIG;
use crate::utils::mysql_utils::connect_data_base;

pub async fn query_all_factory() -> Result<Vec<Factory>, Box<dyn Error>> {
    let url: String = { MYSQL_CONFIG.lock().await.get_full_mysql_url() };

    let mut conn = connect_data_base(&url).await?;

    let factories = conn.query_map("SELECT * FROM s0", |(gs0, gname, address)| Factory {
        gs0,
        gname,
        address,
    })?;

    Ok(factories)
}

pub async fn query_all_factory_managers() -> Result<Vec<FactoryManager>, Box<dyn Error>> {
    let url: String = { MYSQL_CONFIG.lock().await.get_full_mysql_url() };

    let mut conn = connect_data_base(&url).await?;

    let factory_managers = conn.query_map("SELECT * FROM s3", |(ids3, name, tel)| {
        FactoryManager { ids3, name, tel }
    })?;

    Ok(factory_managers)
}

pub async fn query_factory_management_list() -> Result<Vec<FactoryManagementJoined>, Box<dyn Error>>
{
    let url: String = { MYSQL_CONFIG.lock().await.get_full_mysql_url() };

    let mut conn = connect_data_base(&url).await?;

    let factory_management_list = conn.query_map(
        "SELECT * FROM gc_info",
        |(gs0, gname, address, ids3, name, tel, gt0, idt0, sdate, edate)| FactoryManagementJoined {
            gs0,
            gname,
            address,
            ids3,
            name,
            tel,
            gt0,
            idt0,
            sdate,
            edate,
        },
    )?;

    Ok(factory_management_list)
}
pub async fn insert_factory_management(
    factory_management: FactoryManagement,
) -> Result<(), Box<dyn Error>> {
    let url: String = { MYSQL_CONFIG.lock().await.get_full_mysql_url() };

    let mut conn = connect_data_base(&url).await?;

    conn.exec_drop(
        r"
    INSERT INTO t0 (Gt0, IDt0, Sdate, Edate) VALUES (:gt0, :idt0, :sdate, :edate)
    ",
        params! {
            "gt0" => factory_management.gt0,
            "idt0" => factory_management.idt0,
            "sdate" => factory_management.sdate.clone(),
            "edate" => factory_management.edate.clone(),
        },
    )?;

    Ok(())
}

pub async fn delete_factory_management(
    primary_key: FactoryManagementPrimaryKey,
) -> Result<u64, Box<dyn Error>> {
    let url: String = { MYSQL_CONFIG.lock().await.get_full_mysql_url() };

    let mut conn = connect_data_base(&url).await?;

    let query_result = "DELETE FROM t0 WHERE Gt0=? AND IDt0=?"
        .with((primary_key.gt0, primary_key.idt0))
        .run(&mut conn)?;

    let affected_rows = query_result.affected_rows();

    Ok(affected_rows)
}
