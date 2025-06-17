import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { DataDialogAction, DataDialogConfig } from "../../types/dialogs";
import { useState } from "react";

export interface DataDialogProps<T> {
  open: boolean;
  config: DataDialogConfig;
  onAction: (actionName: string, formData: T) => void;
  onClose: () => void;
}

const defaultCancelAction: DataDialogAction = {
  name: "cancel",
  label: "Cancel",
  color: "inherit",
};

const DataDialog = <T,>({
  open,
  config,
  onAction,
  onClose,
}: DataDialogProps<T>) => {
  const [formData, setFormData] = useState<T>({} as T);

  const handleAction = (action: DataDialogAction) => {
    onAction(action.name, formData);
    if (action.closeDialog ?? true) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={() => handleAction(defaultCancelAction)}>
      {config.title && <DialogTitle>{config.title}</DialogTitle>}
      {config.content && (
        <DialogContent>
          <DialogContentText>{config.content}</DialogContentText>
        </DialogContent>
      )}
      {config.fields && (
        <DialogContent>
          {config.fields.map((field, index) => (
            <div key={index}>
              <label>
                {field.label}
                <input
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  defaultValue={field.defaultValue}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      [field.label]: e.target.value,
                    });
                  }}
                >
                  {field.options &&
                    field.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </input>
              </label>
            </div>
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
