import { useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { DialogManagerContext } from "../../hooks/useDialog";
import useStaticHandler from "../../hooks/useStaticHandler";
import type {
  DataDialogConfig,
  DialogManagerEventHandler,
  DialogManagerValue,
} from "../../types/dialogs";
import DataDialog from "../DataDialog/DataDialog";

const DialogManagerProvider = DialogManagerContext.Provider;

interface DialogManagerProps {
  children?: React.ReactNode;
}

const DialogManager = ({ children }: DialogManagerProps) => {
  const [dialogs, setDialogs] = useState<Record<string, DataDialogConfig>>({});
  const [openDialogs, setOpenDialogs] = useState<string[]>([]);
  const eventHandlers = useRef<Record<string, DialogManagerEventHandler[]>>({});

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

  const handleIsDialogOpen = useStaticHandler((id: string) => {
    return openDialogs.includes(id);
  });

  const handleOn = useStaticHandler(
    (id: string, actionName: string, callback: (formData: unknown) => void) => {
      if (dialogs[id]) {
        eventHandlers.current[id] = eventHandlers.current[id] || [];
        eventHandlers.current[id].push({ actionName, callback });
      }
    }
  );

  const providerValue: DialogManagerValue = useMemo(
    () => ({
      addDialog: handleAddDialog,
      removeDialog: handleRemoveDialog,
      openDialog: handleOpenDialog,
      closeDialog: handleCloseDialog,
      isDialogOpen: handleIsDialogOpen,
      dialogOn: handleOn,
    }),
    [
      handleAddDialog,
      handleCloseDialog,
      handleIsDialogOpen,
      handleOn,
      handleOpenDialog,
      handleRemoveDialog,
    ]
  );
  return (
    <DialogManagerProvider value={providerValue}>
      {Object.entries(dialogs).map(([id, config]) => (
        <DataDialog
          key={id}
          open={openDialogs.includes(id)}
          onClose={() => handleCloseDialog(id)}
          config={config}
          onAction={(actionName, formData) => {
            const handlers = eventHandlers.current[id] || [];
            const handler = handlers.find((h) => h.actionName === actionName);
            if (handler) {
              handler.callback(formData);
            }
          }}
        />
      ))}
      {children}
    </DialogManagerProvider>
  );
};
export default DialogManager;
