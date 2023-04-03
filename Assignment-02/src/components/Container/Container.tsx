import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";

interface TabPanelContainerProps {
  children?: React.ReactNode;
  title: string;
  subTitle?: string;
}

export const TabPanelContainer = (props: TabPanelContainerProps) => {
  const { children, title, subTitle } = props;
  return (
    <Box padding="4.8rem">
      <Typography variant="h4">{title}</Typography>
      {subTitle && (
        <Typography sx={{ marginTop: "1.6rem" }}>{subTitle}</Typography>
      )}
      <Divider sx={{ marginY: "2.4rem" }} />
      {children}
    </Box>
  );
};
