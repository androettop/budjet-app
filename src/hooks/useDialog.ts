import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import type { DataDialogConfig, DialogManagerValue } from "../types/dialogs";
import { CodedError, errorCodes } from "../helpers/errors";
import useStaticHandler from "./useStaticHandler";

const notInitialized = () => {
  throw new CodedError(errorCodes.DIALOG_MANAGER_NOT_INITIALIZED);
};

export const DialogManagerContext = createContext<DialogManagerValue>({
  addDialog: notInitialized,
  removeDialog: notInitialized,
  openDialog: notInitialized,
  closeDialog: notInitialized,
  dialogOn: notInitialized,
  openDialogs: [],
});

const useDialog = (config: DataDialogConfig) => {
  const {
    addDialog,
    removeDialog,
    openDialog,
    closeDialog,
    dialogOn,
    openDialogs,
  } = useContext(DialogManagerContext);

  const dialogId = useRef<string>("");

  useEffect(() => {
    dialogId.current = addDialog(config);
    return () => {
      removeDialog(dialogId.current);
    };
  }, [addDialog, config, removeDialog]);

  const handleDialogOn = useStaticHandler(
    (actionName: string, callback: (formData: unknown) => void) => {
      dialogOn(dialogId.current, actionName, callback);
    },
  );

  const handleOpen = useStaticHandler(() => openDialog(dialogId.current));
  const handleClose = useStaticHandler(() => closeDialog(dialogId.current));

  return useMemo(
    () => ({
      open: handleOpen,
      close: handleClose,
      on: handleDialogOn,
      // TODO: test if using the id ref here can cause render issues
      isOpen: openDialogs.includes(dialogId.current),
    }),
    [handleOpen, handleClose, handleDialogOn, openDialogs],
  );
};

export default useDialog;
