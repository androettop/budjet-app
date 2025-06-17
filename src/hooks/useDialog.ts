import { createContext, useContext } from "react";
import type { DialogManagerValue } from "../types/dialogs";
import { CodedError, errorCodes } from "../helpers/errors";

const notInitialized = () => {
  throw new CodedError(errorCodes.DIALOG_MANAGER_NOT_INITIALIZED);
};

export const DialogManagerContext = createContext<DialogManagerValue>({
  addDialog: notInitialized,
  removeDialog: notInitialized,
  openDialog: notInitialized,
  closeDialog: notInitialized,
  isDialogOpen: notInitialized,
  dialogOn: notInitialized,
});

const useDialog = () => {
  const context = useContext(DialogManagerContext);

  return context;
};

export default useDialog;
