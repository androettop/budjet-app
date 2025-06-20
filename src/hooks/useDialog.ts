import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import type {
  DataDialogConfig,
  DialogActionCallback,
  DialogManagerValue,
} from "../types/dialogs";
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
  dialogOff: notInitialized,
  openDialogs: [],
});

const useDialog = <T>(config: DataDialogConfig) => {
  const {
    addDialog,
    removeDialog,
    openDialog,
    closeDialog,
    dialogOn,
    dialogOff,
    openDialogs,
  } = useContext<DialogManagerValue<T>>(
    DialogManagerContext as React.Context<DialogManagerValue<T>>,
  );

  const dialogId = useRef<string>("");

  useEffect(() => {
    dialogId.current = addDialog(config);
    return () => {
      removeDialog(dialogId.current);
    };
  }, [addDialog, config, removeDialog]);

  const handleDialogOn = useStaticHandler(
    (actionName: string, callback: DialogActionCallback<T>) => {
      dialogOn(dialogId.current, actionName, callback);
    },
  );

  const handleDialogOff = useStaticHandler((actionName: string) => {
    dialogOff(dialogId.current, actionName);
  });
  const handleOpen = useStaticHandler(() => openDialog(dialogId.current));
  const handleClose = useStaticHandler(() => closeDialog(dialogId.current));

  return useMemo(
    () => ({
      open: handleOpen,
      close: handleClose,
      on: handleDialogOn,
      off: handleDialogOff,
      // TODO: test if using the id ref here can cause render issues
      isOpen: openDialogs.includes(dialogId.current),
    }),
    [handleOpen, handleClose, handleDialogOn, handleDialogOff, openDialogs],
  );
};

export default useDialog;
