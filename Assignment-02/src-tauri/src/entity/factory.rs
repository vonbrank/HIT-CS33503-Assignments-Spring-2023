use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Factory {
    pub gs0: u32,
    pub gname: String,
    pub address: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FactoryManagement {
    pub gt0: u32,
    pub idt0: u32,
    pub sdate: String,
    pub edate: String,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct FactoryManagementPrimaryKey {
    pub gt0: u32,
    pub idt0: u32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FactoryManagementJoined {
    pub gs0: u32,
    pub gname: String,
    pub address: String,
    pub ids3: u32,
    pub name: String,
    pub tel: String,
    pub gt0: u32,
    pub idt0: u32,
    pub sdate: String,
    pub edate: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FactoryManager {
    pub ids3: u32,
    pub name: String,
    pub tel: String,
}
