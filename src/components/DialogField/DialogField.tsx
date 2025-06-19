import { MenuItem, Select, TextField } from "@mui/material";
import { type DataDialogFormField } from "../../types/dialogs";

export interface DialogFieldProps {
  config: DataDialogFormField;
  onChange: (value: string) => void;
  value: string;
}

const DialogField = ({ config, onChange, value }: DialogFieldProps) => {
  if (config.type === "text") {
    return (
      <TextField
        label={config.label}
        placeholder={config.placeholder}
        type={config.subtype}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
      />
    );
  } else if (config.type === "select") {
    return (
      <Select
        label={config.label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
      >
        {config.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    );
  }
  return null;
};

export default DialogField;
