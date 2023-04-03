import React from "react";
import {
  Stack,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Box from "@mui/material/Box";
import { DataTable, ValueIsReactNode } from "../../components/Table";
import { TabPanelContainer } from "../../components/Container/Container";

export interface FactoryEntity extends ValueIsReactNode {
  gs0: number;
  gname: string;
  address: string;
}

const FactoryInfo = () => {
  const [factories, setFactories] = useState<FactoryEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllFactories = async () => {
    setLoading(true);
    try {
      const allFactories = await invoke<FactoryEntity[]>("get_all_factories");
      setFactories(allFactories);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllFactories();
  }, []);

  return (
    <TabPanelContainer title="工厂信息">
      <DataTable
        headers={["工厂号", "厂名", "地址"]}
        loading={loading}
        dataList={factories}
        getKey={(item) => `${item["gs0"]}`}
        rowDataKeyOrderList={["gs0", "gname", "address"]}
      />
    </TabPanelContainer>
  );
};

export default FactoryInfo;
