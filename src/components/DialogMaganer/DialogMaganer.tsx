import { useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { DialogManagerContext } from "../../hooks/useDialog";
import useStaticHandler from "../../hooks/useStaticHandler";
import type { DataDialogConfig, DialogManagerValue } from "../../types/dialogs";
import DataDialog from "../DataDialog/DataDialog";

const DialogManagerProvider = DialogManagerContext.Provider;

interface DialogManagerProps {
  children?: React.ReactNode;
}

const DialogManager = ({ children }: DialogManagerProps) => {
  const [dialogs, setDialogs] = useState<Record<string, DataDialogConfig>>({});
  const [openDialogs, setOpenDialogs] = useState<string[]>([]);
  const eventHandlers = useRef<
    Record<string, Record<string, (formData: unknown) => void>>
  >({});

  const handleAddDialog = useStaticHandler((config: DataDialogConfig) => {
    const id = uuid();
    setDialogs((prev) => ({ ...prev, [id]: config }));
    return id;
  });

  const handleRemoveDialog = useStaticHandler((id: string) => {
    setDialogs((prev) => {
      const newDialogs = { ...prev };
      delete newDialogs[id];
      return newDialogs;
    });
    // remove from open dialogs if it is open
    if (openDialogs.includes(id)) {
      setOpenDialogs((prev) => prev.filter((dialogId) => dialogId !== id));
    }
    // remove event handlers for this dialog
    if (eventHandlers.current[id]) {
      delete eventHandlers.current[id];
    }
    return id;
  });

  const handleOpenDialog = useStaticHandler((id: string) => {
    if (dialogs[id]) {
      setOpenDialogs((prev) => [id, ...prev]);
    }
  });

  const handleCloseDialog = useStaticHandler((id: string) => {
    if (dialogs[id]) {
      setOpenDialogs((prev) => prev.filter((dialogId) => dialogId !== id));
    }
  });

  const handleOn = useStaticHandler(
    (id: string, actionName: string, callback: (formData: unknown) => void) => {
      eventHandlers.current[id] = eventHandlers.current[id] || [];
      eventHandlers.current[id][actionName] = callback;
    },
  );

  const providerValue: DialogManagerValue = useMemo(
    () => ({
      addDialog: handleAddDialog,
      removeDialog: handleRemoveDialog,
      openDialog: handleOpenDialog,
      closeDialog: handleCloseDialog,
      openDialogs: openDialogs,
      dialogOn: handleOn,
    }),
    [
      handleAddDialog,
      handleCloseDialog,
      openDialogs,
      handleOn,
      handleOpenDialog,
      handleRemoveDialog,
    ],
  );

  console.log(eventHandlers.current);

  const handleOnAction = useStaticHandler(
    (id: string, actionName: string, formData: unknown) => {
      eventHandlers.current?.[id]?.[actionName]?.(formData);
    },
  );

  return (
    <DialogManagerProvider value={providerValue}>
      {Object.entries(dialogs).map(([id, config]) => (
        <DataDialog
          key={id}
          open={openDialogs[0] === id}
          onClose={() => handleCloseDialog(id)}
          config={config}
          onAction={(actionName, formData) =>
            handleOnAction(id, actionName, formData)
          }
        />
      ))}
      {children}
    </DialogManagerProvider>
  );
};
export default DialogManager;
