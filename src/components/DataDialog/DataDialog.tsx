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
    const shouldResetForm = action.resetForm ?? true;
    const shouldCloseDialog = action.closeDialog ?? true;

    if (shouldCloseDialog) {
      onClose();
    }

    if (shouldResetForm) {
      const resetTime = shouldCloseDialog
        ? theme.transitions.duration.leavingScreen
        : 0;
      setTimeout(() => {
        // Reset form data after closing the dialog
        setFormData(defaultValues);
      }, resetTime);
    }
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nativeEvent = event.nativeEvent as SubmitEvent;
    const btn = nativeEvent.submitter as HTMLButtonElement | null;
    const action = config.actions.find((action) => action.name === btn?.name);
    if (action) {
      handleAction(action);
    }
  };

  // if there is more than one action with form validations, we should disable the enter key
  // because will requiere multiple submit buttons, and the user may accidentally submit the
  // form with the wrong button
  const shouldDisableEnter =
    config.actions.filter((action) => action.validate).length > 1;

  return (
    <Dialog open={open} onClose={() => handleAction(defaultCancelAction)}>
      <form onSubmit={(e) => handleOnSubmit(e)}>
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
                    disableEnter={shouldDisableEnter}
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
                name={action.name}
                onClick={
                  action.validate ? undefined : () => handleAction(action)
                }
                color={action.color}
                variant="contained"
                autoFocus={index === config.actions.length - 1}
                type={action.validate ? "submit" : "button"}
              >
                {action.label}
              </Button>
            ))}
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
};

export default DataDialog;
