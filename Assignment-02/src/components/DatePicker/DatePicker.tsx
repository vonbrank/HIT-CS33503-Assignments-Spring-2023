import React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Moment } from "moment";

interface BasicDatePickerProps {
  label: string;
  value: Moment | null;
  onChange: (newValue: Moment | null) => void;
}

export const BasicDatePicker = (props: BasicDatePickerProps) => {
  const { label, value, onChange } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        format="YYYY-MM-DD"
        label={label}
        value={value}
        onChange={(newValue) => onChange(newValue)}
      />
    </LocalizationProvider>
  );
};
