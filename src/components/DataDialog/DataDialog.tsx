import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  useTheme,
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
  const theme = useTheme();

  const fields = config.fields || [];

  const defaultValues = Object.fromEntries(
    fields.map(({ name, defaultValue }) => [name, defaultValue ?? ""]),
  );

  const [formData, setFormData] = useState<DataDialogFormData>(defaultValues);

  const handleAction = (action: DataDialogAction) => {
    onAction(action.name, formData);
    if (action.closeDialog ?? true) {
      onClose();
      setTimeout(() => {
        // Reset form data after closing the dialog
        setFormData(defaultValues);
      }, theme.transitions.duration.leavingScreen);
    }
  };

  return (
    <Dialog open={open} onClose={() => handleAction(defaultCancelAction)}>
      {config.title && <DialogTitle>{config.title}</DialogTitle>}
      {(config.content || fields.length > 0) && (
        <DialogContent>
          <Grid container overflow="hidden" spacing={2}>
            {config.content && (
              <Grid size={12}>
                <DialogContentText>{config.content}</DialogContentText>
              </Grid>
            )}

            {fields.map((fieldConfig) => (
              <Grid size={12} key={fieldConfig.name}>
                <DialogField
                  config={fieldConfig}
                  value={formData[fieldConfig.name]}
                  onChange={(value) =>
                    setFormData({ ...formData, [fieldConfig.name]: value })
                  }
                />
              </Grid>
            ))}
          </Grid>
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
