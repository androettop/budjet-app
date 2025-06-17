import { createContext, useMemo, useRef, useState } from "react";
import type {
  DataDialogConfig,
  DialogManagerEventHandler,
  DialogManagerValue,
} from "../../types/dialogs";
import DataDialog from "../DataDialog/DataDialog";

const DialogManagerContext = createContext<DialogManagerValue>({
  dialogs: {},
  addDialog: () => {},
  removeDialog: () => {},
  openDialog: () => {},
  closeDialog: () => {},
  isDialogOpen: () => false,
  on: () => {},
});
const DialogManagerProvider = DialogManagerContext.Provider;

interface DialogManagerProps {
  children?: React.ReactNode;
}

const DialogManager = ({ children }: DialogManagerProps) => {
  const [dialogs, setDialogs] = useState<Record<string, DataDialogConfig>>({});
  const [openDialogs, setOpenDialogs] = useState<string[]>([]);
  const eventHandlers = useRef<Record<string, DialogManagerEventHandler[]>>({});

  const providerValue: DialogManagerValue = useMemo(
    () => ({
      dialogs,
      addDialog: (config: DataDialogConfig) => {
        setDialogs((prev) => ({ ...prev, [config.id]: config }));
      },
      removeDialog: (id: string) => {
        setDialogs((prev) => {
          const newDialogs = { ...prev };
          delete newDialogs[id];
          return newDialogs;
        });
      },
      openDialog: (id: string) => {
        if (dialogs[id]) {
          setOpenDialogs((prev) => [id, ...prev]);
        }
      },
      closeDialog: (id: string) => {
        if (dialogs[id]) {
          setOpenDialogs((prev) => prev.filter((dialogId) => dialogId !== id));
        }
      },
      isDialogOpen: (id: string) => {
        return openDialogs.includes(id);
      },
      on: (
        id: string,
        actionName: string,
        callback: (formData: unknown) => void
      ) => {
        if (dialogs[id]) {
          eventHandlers.current[id] = eventHandlers.current[id] || [];
          eventHandlers.current[id].push({ actionName, callback });
        }
      },
    }),
    [dialogs, openDialogs]
  );
  return (
    <DialogManagerProvider value={providerValue}>
      {Object.entries(dialogs).map(([id, config]) => (
        <DataDialog
          key={id}
          open={openDialogs.includes(id)}
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
