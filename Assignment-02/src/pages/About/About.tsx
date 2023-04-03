import { useState } from "react";
import reactLogo from "../../assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import styles from "./About.module.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  TextField,
  Typography,
  Stack,
  List,
  ListItem,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  Switch,
  ButtonGroup,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Divider,
  ListItemButton,
} from "@mui/material";
import { TabPanelContainer } from "@/components/Container";
import TranslateIcon from "@mui/icons-material/Translate";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setThemeMode } from "@/store/SettingSlice";
import { ThemeMode } from "../../store/SettingSlice";

const LogoBlock = () => {
  return (
    <Box className={styles["about-root"]}>
      <Stack className={"container"}>
        <div className="row">
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          </a>
          <a href="https://tauri.app" target="_blank">
            <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
      </Stack>
    </Box>
  );
};

function About() {
  const { themeMode } = useAppSelector((state) => ({
    themeMode: state.setting.themeMode,
  }));
  const dispatch = useAppDispatch();

  // const [darkMode, setDarkMode] = useState<string | null>("followSystem");
  const handleDarkMode = (
    event: React.MouseEvent<HTMLElement>,
    newDarkMode: ThemeMode | null
  ) => {
    dispatch(setThemeMode(newDarkMode || "followSystem"));
  };

  const [language, setLanguage] = useState("Chinese");

  return (
    <TabPanelContainer title="设置">
      <Stack>
        <List subheader={<ListSubheader>常规</ListSubheader>}>
          <ListItem>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText
              id="toggle-button-group-list-label-darkmode"
              primary="黑暗模式"
            />
            <ToggleButtonGroup
              value={themeMode}
              exclusive
              onChange={handleDarkMode}
              aria-label="text alignment"
            >
              <ToggleButton value="followSystem" aria-label="follow-system">
                跟随系统
              </ToggleButton>
              <ToggleButton value="light" aria-label="light">
                浅色
              </ToggleButton>
              <ToggleButton value="dark" aria-label="dark">
                深色
              </ToggleButton>
            </ToggleButtonGroup>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TranslateIcon />
            </ListItemIcon>
            <ListItemText id="language-select-label-language" primary="语言" />
            <Box minWidth={"14.4rem"}>
              <FormControl fullWidth>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <MenuItem value={"Chinese"}>中文</MenuItem>
                  <MenuItem value={"English"}>English</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </ListItem>
        </List>
        <Divider />
        <List subheader={<ListSubheader>关于</ListSubheader>}>
          <Link
            sx={{ textDecoration: "none", color: "inherit" }}
            href="https://github.com/vonbrank"
            target={"_blank"}
          >
            <ListItemButton>
              <ListItemText
                sx={{
                  flexShrink: 0,
                }}
                id="about-label-tech-author"
                primary="作者"
              />
              <Stack direction={"row"}>
                <Stack alignItems={"end"}>
                  <Typography component={"span"}>Von Brank</Typography>
                  <Typography component={"span"} sx={{ opacity: 0.5 }}>
                    Harbin Institute of Technology
                  </Typography>
                </Stack>
              </Stack>
            </ListItemButton>
          </Link>
          <ListItem>
            <ListItemText
              sx={{
                flexShrink: 0,
              }}
              id="about-label-tech-stack"
              primary="技术栈"
            />
            <Stack alignItems={"end"} width="100%">
              <LogoBlock />
            </Stack>
          </ListItem>
        </List>
      </Stack>
    </TabPanelContainer>
  );
}

export default About;
