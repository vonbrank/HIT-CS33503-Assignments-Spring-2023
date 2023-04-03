import React from "react";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api";
import { DataTable, ValueIsReactNode } from "../../components/Table/Table";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import { commands } from "../../config/commands";
import { TabPanelContainer } from "../../components/Container/Container";

export interface ProductionEntity extends ValueIsReactNode {
  cs6: number;
  weight: number;
  price: number;
}

const Production = () => {
  const [productions, setProductions] = useState<ProductionEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllProduction = async () => {
    setLoading(true);
    try {
      const res = await invoke<ProductionEntity[]>("get_all_productions");
      setProductions(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllProduction();
  }, []);

  return (
    <TabPanelContainer title="产品信息">
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

export default Production;

interface ComponentEntity extends ValueIsReactNode {
  ds7: number;
  weight: number;
  price: number;
}

export const Component = () => {
  const [productions, setProductions] = useState<ComponentEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllProduction = async () => {
    setLoading(true);
    try {
      const res = await invoke<ComponentEntity[]>(commands.get_all_components);
      setProductions(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllProduction();
  }, []);

  return (
    <TabPanelContainer title="零件信息">
      <DataTable
        headers={["零件号", "重量", "价格"]}
        loading={loading}
        dataList={productions}
        getKey={(item) => `${item["ds7"]}`}
        rowDataKeyOrderList={["ds7", "weight", "price"]}
      />
    </TabPanelContainer>
  );
};

interface AssemblingEntity extends ValueIsReactNode {
  ct7: number;
  dt7: number;
  cdnum: number;
}

export const Assembling = () => {
  const [productions, setProductions] = useState<AssemblingEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllProduction = async () => {
    setLoading(true);
    try {
      const res = await invoke<AssemblingEntity[]>(
        commands.get_all_assemblings
      );
      setProductions(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllProduction();
  }, []);

  return (
    <TabPanelContainer title="装配情况">
      <DataTable
        headers={["产品号", "零件号", "所需零件数量"]}
        loading={loading}
        dataList={productions}
        getKey={(item) => `${item["ct7"]}-${item["dt7"]}`}
        rowDataKeyOrderList={["ct7", "dt7", "cdnum"]}
      />
    </TabPanelContainer>
  );
};
