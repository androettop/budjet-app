import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type {
  DataDialogAction,
  DataDialogConfig,
  DataDialogFormData,
} from "../../types/dialogs";
import { useState } from "react";
import DialogField from "../DialogField/DialogField";

export interface DataDialogProps {
  open: boolean;
  config: DataDialogConfig;
  onAction: (actionName: string, formData: DataDialogFormData) => void;
  onClose: () => void;
}

const defaultCancelAction: DataDialogAction = {
  name: "cancel",
  label: "Cancel",
  color: "inherit",
};

const DataDialog = ({ open, config, onAction, onClose }: DataDialogProps) => {
  const fields = config.fields || [];

  const defaultValues = Object.fromEntries(
    fields.map(({ name, defaultValue }) => [name, defaultValue ?? ""]),
  );

  const [formData, setFormData] = useState<DataDialogFormData>(defaultValues);

  const handleAction = (action: DataDialogAction) => {
    onAction(action.name, formData);
    if (action.closeDialog ?? true) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={() => handleAction(defaultCancelAction)}>
      {config.title && <DialogTitle>{config.title}</DialogTitle>}
      {(config.content || fields.length > 0) && (
        <DialogContent>
          {config.content && (
            <DialogContentText>{config.content}</DialogContentText>
          )}
          {fields.map((fieldConfig) => (
            <DialogField
              key={fieldConfig.name}
              config={fieldConfig}
              value={formData[fieldConfig.name]}
              onChange={(value) =>
                setFormData({ ...formData, [fieldConfig.name]: value })
              }
            />
          ))}
        </DialogContent>
      )}

      {config.actions && (
        <DialogActions>
          {config.actions.map((action, index) => (
            <Button
              key={action.name}
              onClick={() => handleAction(action)}
              color={action.color}
              variant="contained"
              autoFocus={index === config.actions.length - 1}
            >
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DataDialog;
