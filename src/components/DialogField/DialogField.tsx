import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { type DataDialogFormField } from "../../types/dialogs";
import { useEffect, useRef } from "react";

export interface DialogFieldProps {
  config: DataDialogFormField;
  onChange: (value: string) => void;
  value: string;
  disableEnter: boolean;
}

const DialogField = ({
  config,
  onChange,
  value,
  disableEnter = false,
}: DialogFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (config.autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [config.autoFocus]);

  if (config.type === "text") {
    return (
      <TextField
        fullWidth
        label={config.label}
        placeholder={config.placeholder}
        type={config.subtype}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={config.required}
        variant="outlined"
        inputRef={inputRef}
        onKeyDown={(e) => {
          if (disableEnter && e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />
    );
  } else if (config.type === "select") {
    return (
      <FormControl fullWidth>
        <InputLabel>{config.label}</InputLabel>
        <Select
          label={config.label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={config.required}
          variant="outlined"
          inputRef={inputRef}
          onKeyDown={(e) => {
            if (disableEnter && e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          {config.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
  return null;
};

export default DialogField;
