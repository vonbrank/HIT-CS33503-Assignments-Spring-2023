use std::error::Error;

use mysql::prelude::Queryable;

use crate::{
    config::mysql_config::MYSQL_CONFIG,
    entity::production::{NumberOfComponentsForProduction, Production},
    utils::mysql_utils::connect_data_base,
};
/*
    嵌套查询：
    查询重量小于5kg且价格大于100元的产品，
    在产品关系中查询重量小于5kg的产品，
    并在得到的结果中查询价格大于100元的产品
*/
pub async fn example_nested_query() -> Result<Vec<Production>, Box<dyn Error>> {
    let url: String = { MYSQL_CONFIG.lock().await.get_full_mysql_url() };

    let mut conn = connect_data_base(&url).await?;

    let productions = conn.query_map(
        r"
        SELECT * FROM (
            SELECT * FROM s6 WHERE Weight<5
        ) as in_s6 WHERE Price>100
        ",
        |(cs6, weight, price)| Production { cs6, weight, price },
    )?;

    Ok(productions)
}

/*
   分组查询：
   查询每个产品用到的零件种数，
   在装配关系中按照产品进行分组
*/
pub async fn example_group_query() -> Result<Vec<NumberOfComponentsForProduction>, Box<dyn Error>> {
    let url: String = { MYSQL_CONFIG.lock().await.get_full_mysql_url() };

    let mut conn = connect_data_base(&url).await?;

    let number_of_components_for_production = conn.query_map(
        r"
        SELECT Ct7, count(Dt7) as count_d 
        FROM t7 
        GROUP BY Ct7 HAVING count(Dt7)>1
        ",
        |(ct7, count_d)| NumberOfComponentsForProduction { ct7, count_d },
    )?;

    Ok(number_of_components_for_production)
}
