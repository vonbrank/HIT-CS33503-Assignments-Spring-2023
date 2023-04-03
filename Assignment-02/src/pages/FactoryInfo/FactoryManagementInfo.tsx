import React from "react";
import { DataTable, ValueIsReactNode } from "../../components/Table";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Divider, Stack, TextField } from "@mui/material";
import { FactoryEntity } from ".";
import { commands } from "../../config/commands";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BasicDatePicker } from "../../components/DatePicker";
import moment, { Moment } from "moment";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../store/hooks";
import { showTemporaryToastText } from "../../store/ToastSlice";
import { TabPanelContainer } from "../../components/Container/Container";

interface FactoryManagerEntity extends ValueIsReactNode {
  ids3: number;
  name: string;
  tel: string;
}

interface FactoryManagementEntity extends ValueIsReactNode {
  gt0: number;
  idt0: number;
  sdate: string;
  edate: string;
}

type FactoryManagementJoinEntity = FactoryEntity &
  FactoryManagerEntity &
  FactoryManagementEntity;

const FactoryManagementInfo = () => {
  const [factoryMangements, setFactoryMangements] = useState<
    FactoryManagementJoinEntity[]
  >([]);
  const [loading, setLoading] = useState(false);

  const getAllFactoryManagements = async () => {
    setLoading(true);
    try {
      const res = await invoke<FactoryManagementJoinEntity[]>(
        "get_all_factory_managements"
      );
      setFactoryMangements(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllFactoryManagements();
  }, []);

  return (
    <TabPanelContainer title="连接查询" subTitle="厂长管理工厂">
      <DataTable
        headers={[
          "工厂号",
          "厂名",
          "地址",
          "厂长号",
          "厂长名",
          "电话",
          "开始时间",
          "结束时间",
        ]}
        loading={loading}
        dataList={factoryMangements}
        getKey={(item) => `${item["gs0"]}${item["ids3"]}`}
        rowDataKeyOrderList={[
          "gs0",
          "name",
          "tel",
          "ids3",
          "name",
          "tel",
          "sdate",
          "edate",
        ]}
      />
    </TabPanelContainer>
  );
};

export default FactoryManagementInfo;

export const FactoryManager = () => {
  const [factoryManagers, setFactoryManagers] = useState<
    FactoryManagerEntity[]
  >([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const getAllFactoryManagers = async () => {
    setLoading(true);
    try {
      const res = await invoke<FactoryManagerEntity[]>(
        commands.get_all_factory_managers
      );
      console.log("FactoryManager res = ", res);
      setFactoryManagers(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllFactoryManagers();
  }, []);
  return (
    <TabPanelContainer title="厂长信息">
      <DataTable
        headers={["厂长号", "厂长名", "电话"]}
        loading={loading}
        dataList={factoryManagers}
        getKey={(item) => `${item["ids3"]}`}
        rowDataKeyOrderList={["ids3", "name", "tel"]}
      />
    </TabPanelContainer>
  );
};

export const InsertFactoryManagement = () => {
  const dispatch = useAppDispatch();

  const [factoryId, setFactoryId] = useState<number | null>(null);
  const [managerId, setManagerId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Moment | null>(null);
  const [endTime, setEndTime] = useState<Moment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (
      factoryId == null ||
      managerId == null ||
      startTime == null ||
      endTime == null
    ) {
      dispatch(
        showTemporaryToastText({
          severity: "warning",
          message: "请先填写所有字段再提交",
        })
      );
      return;
    }
    const factoryManagementEntity: FactoryManagementEntity = {
      gt0: factoryId,
      idt0: managerId,
      sdate: startTime.format("YYYY-MM-DD"),
      edate: endTime.format("YYYY-MM-DD"),
    };
    console.log(
      "args of insert_factory_management = ",
      factoryManagementEntity
    );
    setSubmitting(true);
    try {
      const res: string = await invoke(commands.add_factory_management, {
        factoryManagement: factoryManagementEntity,
      });
      const [status, message] = res.split(":").map((str) => str.trim());
      if (status === "error") {
        dispatch(
          showTemporaryToastText({
            severity: "error",
            message: `操作失败：${message}`,
          })
        );
      } else {
        dispatch(
          showTemporaryToastText({
            severity: status === "info" ? "info" : "success",
            message: `操作成功`,
          })
        );
      }
    } catch (e) {
      console.error(e);
      showTemporaryToastText({
        severity: "error",
        message: `操作失败：${e}`,
      });
    }
    setSubmitting(false);
  };

  return (
    <TabPanelContainer title="添加厂长管理信息">
      <Stack spacing={"1.6rem"}>
        <TextField
          type={"number"}
          label="工厂编号"
          value={factoryId || ""}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            if (!isNaN(newValue)) setFactoryId(newValue);
            else setFactoryId(null);
          }}
        />
        <TextField
          type={"number"}
          label="厂长身份证号"
          value={managerId || ""}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            if (!isNaN(newValue)) setManagerId(newValue);
            else setManagerId(null);
          }}
        />
        <BasicDatePicker
          label="开始时间"
          value={startTime}
          onChange={setStartTime}
        />
        <BasicDatePicker
          label="结束时间"
          value={endTime}
          onChange={setEndTime}
        />
        <LoadingButton
          variant="outlined"
          loading={submitting}
          fullWidth
          onClick={handleSubmit}
        >
          提交
        </LoadingButton>
      </Stack>
    </TabPanelContainer>
  );
};

export const DeleteFactoryManagement = () => {
  const dispatch = useAppDispatch();

  const [factoryId, setFactoryId] = useState<number | null>(null);
  const [managerId, setManagerId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (factoryId == null || managerId == null) {
      dispatch(
        showTemporaryToastText({
          severity: "warning",
          message: "请先填写所有字段再提交",
        })
      );
      return;
    }
    const deleteFactoryManagementDto: Omit<
      FactoryManagementEntity,
      "sdate" | "edate"
    > = {
      gt0: factoryId,
      idt0: managerId,
    };
    console.log(
      "args of delete_factory_management = ",
      deleteFactoryManagementDto
    );
    setSubmitting(true);
    try {
      const res: string = await invoke(commands.remove_factory_management, {
        primaryKey: deleteFactoryManagementDto,
      });
      const [status, message] = res.split(":").map((str) => str.trim());
      if (status === "error") {
        dispatch(
          showTemporaryToastText({
            severity: "error",
            message: `操作失败：${message}`,
          })
        );
      } else {
        dispatch(
          showTemporaryToastText({
            severity: status === "info" ? "info" : "success",
            message: `操作成功：${message}`,
          })
        );
      }
    } catch (e) {
      console.error(e);
      showTemporaryToastText({
        severity: "error",
        message: `操作失败：${e}`,
      });
    }
    setSubmitting(false);
  };
  return (
    <TabPanelContainer title="删除厂长管理信息">
      <Stack spacing={"1.6rem"}>
        <TextField
          type={"number"}
          label="工厂编号"
          value={factoryId || ""}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            if (!isNaN(newValue)) setFactoryId(newValue);
            else setFactoryId(null);
          }}
        />
        <TextField
          type={"number"}
          label="厂长身份证号"
          value={managerId || ""}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            if (!isNaN(newValue)) setManagerId(newValue);
            else setManagerId(null);
          }}
        />
        <LoadingButton
          variant="outlined"
          loading={submitting}
          fullWidth
          onClick={handleSubmit}
        >
          提交
        </LoadingButton>
      </Stack>
    </TabPanelContainer>
  );
};
