use crate::dao::example_special_dao::{example_group_query, example_nested_query};
use crate::dao::factory_dao::{
    delete_factory_management, insert_factory_management, query_all_factory,
    query_all_factory_managers, query_factory_management_list,
};
use crate::dao::production_dao::{
    query_all_assembings, query_all_components, query_all_productions,
};
use crate::entity::factory::{
    Factory, FactoryManagement, FactoryManagementJoined, FactoryManagementPrimaryKey,
    FactoryManager,
};
use crate::entity::production::{
    Assembling, Component, NumberOfComponentsForProduction, Production,
};

#[tauri::command]
pub async fn get_all_factories() -> Vec<Factory> {
    let factories_res = query_all_factory().await;

    match factories_res {
        Ok(factories) => factories,
        Err(e) => {
            eprintln!("Failed to query factories: {}", e.to_string());
            Vec::new()
        }
    }
}

#[tauri::command]
pub async fn get_all_factory_managers() -> Vec<FactoryManager> {
    let managers_res = query_all_factory_managers().await;

    match managers_res {
        Ok(factories) => factories,
        Err(e) => {
            eprintln!("Failed to query factory managers: {}", e.to_string());
            Vec::new()
        }
    }
}

#[tauri::command]
pub async fn get_all_factory_managements() -> Vec<FactoryManagementJoined> {
    let factory_manegement_list_res = query_factory_management_list().await;

    match factory_manegement_list_res {
        Ok(factory_management_list) => factory_management_list,
        Err(e) => {
            eprintln!("Failed to query all factory managements: {}", e.to_string());
            Vec::new()
        }
    }
}

enum CheckFactoryManagementConstraintResult {
    FactoryNotExist,
    ManagerNotExist,
    FactoryHasAnotherManager,
    Ok,
}

async fn check_factory_management_constraint(gt0: u32, idt0: u32) -> CheckFactoryManagementConstraintResult {
    let mut factory_exist = false;
    {
        let factories_res = query_all_factory().await;
        factory_exist = match factories_res {
            Ok(factories) => {
                let factory_option = factories.into_iter().find(|factory| factory.gs0 == gt0);
                if let Some(_) = factory_option {
                    true
                } else {
                    false
                }
            }
            Err(e) => {
                eprintln!("Failed to query factories: {}", e.to_string());
                false
            }
        };
    }
    if !factory_exist {
        return CheckFactoryManagementConstraintResult::FactoryNotExist;
    }

    let mut manager_exist: bool = false;
    {
        let managers_res = query_all_factory_managers().await;
        manager_exist = match managers_res {
            Ok(managers) => {
                let manager_option = managers.into_iter().find(|manager| manager.ids3 == idt0);
                if let Some(_) = manager_option {
                    true
                } else {
                    false
                }
            }
            Err(e) => {
                eprintln!("Failed to query factory managers: {}", e.to_string());
                false
            }
        };
    }
    if !manager_exist {
        return CheckFactoryManagementConstraintResult::ManagerNotExist;
    }

    let mut factory_has_another_manager: bool = false;
    {
        let managements_res = query_factory_management_list().await;
        factory_has_another_manager = match managements_res {
            Ok(managements) => {
                let management_option = managements.into_iter().find(|management| {
                    management.gt0 == gt0 && management.idt0 != idt0
                });
                if let Some(_) = management_option {
                    true
                } else {
                    false
                }
            }
            Err(e) => {
                eprintln!("Failed to query factory managements: {}", e.to_string());
                false
            }
        };
    }
    if factory_has_another_manager {
        return CheckFactoryManagementConstraintResult::FactoryHasAnotherManager;
    }

    CheckFactoryManagementConstraintResult::Ok
}

#[tauri::command]
pub async fn add_factory_management(factory_management: FactoryManagement) -> String {
    println!(
        "insert_factory_management received data: {:?}",
        factory_management
    );

    let factory_or_manager_exist =
        check_factory_management_constraint(factory_management.gt0, factory_management.idt0).await;

    match factory_or_manager_exist {
        CheckFactoryManagementConstraintResult::FactoryNotExist => {
            return "error: factory does not exist.".to_string();
        }
        CheckFactoryManagementConstraintResult::ManagerNotExist => {
            return "error: manager does not exist".to_string();
        }
        CheckFactoryManagementConstraintResult::FactoryHasAnotherManager => {
            return "error: a factory can only be managed by a manager.".to_string();
        }
        _ => {}
    }

    let res = match insert_factory_management(factory_management).await {
        Ok(()) => "success".to_string(),
        Err(e) => {
            eprintln!("Failed to add factory management: {}", e.to_string());
            format!("error: {}", e.to_string())
        }
    };

    res
}

#[tauri::command]
pub async fn remove_factory_management(primary_key: FactoryManagementPrimaryKey) -> String {
    println!("insert_factory_management received data: {:?}", primary_key);

    let factory_or_manager_exist =
        check_factory_management_constraint(primary_key.gt0, primary_key.idt0).await;

    match factory_or_manager_exist {
        CheckFactoryManagementConstraintResult::FactoryNotExist
        | CheckFactoryManagementConstraintResult::ManagerNotExist => {
            return "error: factory or manager does not exist.".to_string();
        }
        _ => {}
    }

    let res = delete_factory_management(primary_key).await;

    match res {
        Ok(affected_rows) => {
            if affected_rows == 0 {
                format!("info: no row deleted")
            } else {
                format!("success: {} row(s) deleted", affected_rows)
            }
        }
        Err(e) => {
            eprintln!("Failed to delete factory management: {}", e.to_string());
            format!("error: {}", e.to_string())
        }
    }
}

#[tauri::command]
pub async fn get_all_productions() -> Vec<Production> {
    let productions_res = query_all_productions().await;

    match productions_res {
        Ok(productions) => productions,
        Err(e) => {
            eprintln!("Failed to query all productions: {}", e.to_string());
            Vec::new()
        }
    }
}

#[tauri::command]
pub async fn get_all_components() -> Vec<Component> {
    let components_res = query_all_components().await;

    match components_res {
        Ok(components) => components,
        Err(e) => {
            eprintln!("Failed to query all components: {}", e.to_string());
            Vec::new()
        }
    }
}

#[tauri::command]
pub async fn get_all_assemblings() -> Vec<Assembling> {
    let assemblings_res = query_all_assembings().await;

    match assemblings_res {
        Ok(assemblings) => assemblings,
        Err(e) => {
            eprintln!("Failed to query productions: {}", e.to_string());
            Vec::new()
        }
    }
}

#[tauri::command]
pub async fn get_all_productions_with_example_nested_query() -> Vec<Production> {
    let productions_res = example_nested_query().await;

    match productions_res {
        Ok(productions) => productions,
        Err(e) => {
            eprintln!("Failed to query productions: {}", e.to_string());
            Vec::new()
        }
    }
}

#[tauri::command]
pub async fn get_all_count_of_componets_for_production_with_group_query(
) -> Vec<NumberOfComponentsForProduction> {
    let count_of_componets_res = example_group_query().await;

    match count_of_componets_res {
        Ok(count_of_components) => count_of_components,
        Err(e) => {
            eprintln!("Failed to query productions: {}", e.to_string());
            Vec::new()
        }
    }
}
