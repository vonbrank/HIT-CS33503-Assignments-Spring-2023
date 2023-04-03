import React from "react";
import About from "../About";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import { titleCase } from "../../utils/common-utils";
import FactoryInfo, { FactoryManagementInfo } from "../FactoryInfo";
import ProductionEntity, { Component } from "../Production/Production";
import Production from "../Production/Production";
import { Assembling } from "../Production/Production";
import {
  FactoryManager,
  InsertFactoryManagement,
} from "../FactoryInfo/FactoryManagementInfo";
import { NestedQuery, GroupQuery } from "../SpecialQuery/SpecialQuery";
import { DeleteFactoryManagement } from "../FactoryInfo/FactoryManagementInfo";

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

type NavigateOption =
  | "insert"
  | "delete"
  | "join query"
  | "nested query"
  | "group query"
  | "factory info"
  | "factory manager info"
  | "production info"
  | "component info"
  | "assembling info"
  | "settings";

const navigateOptions: NavigateOption[] = [
  "insert",
  "delete",
  "join query",
  "nested query",
  "group query",
  "factory info",
  "factory manager info",
  "production info",
  "component info",
  "assembling info",
  "settings",
];

const Home = () => {
  const [value, setValue] = React.useState<NavigateOption>("insert");

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: NavigateOption
  ) => {
    setValue(newValue);
  };

  return (
    <Stack
      direction={"row"}
      height="100vh"
      width={"100vw"}
      sx={{ overflow: "hidden" }}
    >
      <Stack sx={{ paddingY: "1.6rem", flexShrink: 0 }}>
        <Box sx={{ padding: "1.2rem 1.6rem" }}>
          <Typography
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
            variant="h5"
          >
            <span>HIT Database</span>
            <span>Assignment 02</span>
          </Typography>
        </Box>
        <Stack
          alignItems={"center"}
          justifyContent="center"
          sx={{ height: 0, flex: 1 }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            {navigateOptions.map((navigateOption, index) => (
              <Tab
                key={navigateOption}
                label={titleCase(navigateOption)}
                value={navigateOption}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </Stack>
      </Stack>
      <Box sx={{ width: 0, flex: 1, height: "100%", overflowY: "auto" }}>
        {value === "settings" && <About />}
        {value === "factory info" && <FactoryInfo />}
        {value === "join query" && <FactoryManagementInfo />}
        {value === "production info" && <Production />}
        {value === "component info" && <Component />}
        {value === "assembling info" && <Assembling />}
        {value === "factory manager info" && <FactoryManager />}
        {value === "nested query" && <NestedQuery />}
        {value === "group query" && <GroupQuery />}
        {value === "insert" && <InsertFactoryManagement />}
        {value === "delete" && <DeleteFactoryManagement />}
      </Box>
    </Stack>
  );
};

export default Home;
