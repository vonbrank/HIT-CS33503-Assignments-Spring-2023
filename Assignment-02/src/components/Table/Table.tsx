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

export interface ValueIsReactNode {
  [index: string]: React.ReactNode;
}

interface DataTableProps<T extends ValueIsReactNode> {
  headers: string[];
  loading: boolean;
  dataList: T[];
  getKey: (item: T) => string;
  rowDataKeyOrderList: (keyof T)[];
}

function DataTable<T extends ValueIsReactNode>(props: DataTableProps<T>) {
  const { headers, loading, dataList, getKey, rowDataKeyOrderList } = props;
  return (
    <TableContainer>
      <Table
        aria-label="table-component"
        component={Paper}
        sx={{
          tableLayout: "fixed",
        }}
      >
        <TableHead>
          <TableRow>
            {headers.map((head) => (
              <TableCell sx={{ "&.MuiTableCell-root": { width: "12.8rem" } }}>
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={headers.length}>
                <Stack alignItems="center">
                  <CircularProgress />
                </Stack>
              </TableCell>
            </TableRow>
          ) : (
            dataList.map((data) => (
              <TableRow
                key={getKey(data)}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {rowDataKeyOrderList.map((currentKey) => {
                  return <TableCell>{data[currentKey]}</TableCell>;
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export { DataTable };
