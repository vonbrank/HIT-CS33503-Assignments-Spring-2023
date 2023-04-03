use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Production {
    pub cs6: u32,
    pub weight: u32,
    pub price: u32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Component {
    pub ds7: u32,
    pub weight: u32,
    pub price: u32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NumberOfComponentsForProduction {
    pub ct7: u32,
    pub count_d: u32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Assembling {
    pub ct7: u32,
    pub dt7: u32,
    pub cdnum: u32,
}
