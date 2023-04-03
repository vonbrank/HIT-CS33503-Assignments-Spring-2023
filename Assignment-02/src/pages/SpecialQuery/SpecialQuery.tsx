import { ProductionEntity } from "../Production/Production";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api";
import { commands } from "../../config/commands";
import { Box, Button, Divider, Typography } from "@mui/material";
import { DataTable } from "../../components/Table";
import { ValueIsReactNode } from "../../components/Table/Table";
import { TabPanelContainer } from "../../components/Container/Container";

export const NestedQuery = () => {
  const [productions, setProductions] = useState<ProductionEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllProductionsWithNestedQuery = async () => {
    setLoading(true);
    try {
      const res = await invoke<ProductionEntity[]>(
        commands.get_all_productions_with_example_nested_query
      );
      setProductions(res);
      console.log("ProductionEntity res = ", res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllProductionsWithNestedQuery();
  }, []);
  return (
    <TabPanelContainer
      title="嵌套查询"
      subTitle="在产品关系中查询重量小于5kg的产品，并在得到的结果中查询价格大于100元的产品"
    >
      <DataTable
        headers={["产品号", "重量", "价格"]}
        loading={loading}
        dataList={productions}
        getKey={(item) => `${item["cs6"]}`}
        rowDataKeyOrderList={["cs6", "weight", "price"]}
      />
    </TabPanelContainer>
  );
};

interface NumberOfComponentsForProduction extends ValueIsReactNode {
  ct7: number;
  count_d: number;
}

export const GroupQuery = () => {
  const [numberOfComponents, setNumberOfComponents] = useState<
    NumberOfComponentsForProduction[]
  >([]);
  const [loading, setLoading] = useState(false);

  const getAllCountOfComponents = async () => {
    setLoading(true);
    try {
      const res = await invoke<NumberOfComponentsForProduction[]>(
        commands.get_all_count_of_componets_for_production_with_group_query
      );
      setNumberOfComponents(res);
      console.log("NumberOfComponentsForProduction res = ", res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllCountOfComponents();
  }, []);
  return (
    <TabPanelContainer
      title="分组查询"
      subTitle="查询每个产品用到的零件种数，在装配关系中按照产品进行分组"
    >
      <DataTable
        headers={["产品号", "所需零件数量"]}
        loading={loading}
        dataList={numberOfComponents}
        getKey={(item) => `${item["ct7"]}`}
        rowDataKeyOrderList={["ct7", "count_d"]}
      />
    </TabPanelContainer>
  );
};
