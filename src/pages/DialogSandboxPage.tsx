import DataDialog from "../components/DataDialog/DataDialog";
import type { DataDialogConfig } from "../types/dialogs";

const DialogSandboxPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sampleDialogConfig: DataDialogConfig = {
    title: "Sample Dialog",
    content: "This is a sample dialog content.",
    actions: [
      {
        label: "Cancel",
        color: "inherit",
        name: "cancel",
      },
      {
        label: "OK",
        color: "primary",
        name: "ok",
      },
    ],
  };

  return (
    <div>
      <DataDialog
        open={isOpen}
        config={sampleDialogConfig}
        onAction={console.log}
      />
    </div>
  );
};

export default DialogSandboxPage;
