import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { DataDialogConfig } from "../../types/dialogs";

export interface DataDialogProps {
  open: boolean;
  config: DataDialogConfig;
  onAction: (actionName: string) => void;
}

const DataDialog = ({ open, config, onAction }: DataDialogProps) => {
  return (
    <Dialog open={open}>
      {config.title && <DialogTitle>{config.title}</DialogTitle>}
      {config.content && (
        <DialogContent>
          <DialogContentText>{config.content}</DialogContentText>
        </DialogContent>
      )}
      {config.actions && (
        <DialogActions>
          {config.actions.map((action, index) => (
            <Button
              key={action.name}
              onClick={() => onAction(action.name)}
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
