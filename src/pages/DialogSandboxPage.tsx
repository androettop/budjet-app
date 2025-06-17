import { Button, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import DataDialog from "../components/DataDialog/DataDialog";
import type { DataDialogConfig } from "../types/dialogs";

const DialogSandboxPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [actionsLog, setActionsLog] = useState<string[]>([]);

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

  const handleAction = (actionName: string, formData: unknown) => {
    setActionsLog((prev) => [
      ...prev,
      `Action "${actionName}" triggered with data: \n${JSON.stringify(formData, null, 2)}`,
    ]);
  };

  return (
    <>
      <DataDialog
        open={isOpen}
        config={sampleDialogConfig}
        onAction={handleAction}
        onClose={() => setIsOpen(false)}
      />

      <Card sx={{ fontFamily: "monospace" }}>
        <CardContent>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsOpen(true)}
          >
            Open Dialog
          </Button>
          <Typography variant="h5" sx={{ marginTop: 2 }}>
            Actions log:
          </Typography>

          {actionsLog.length > 0 ? (
            actionsLog.map((log) => <div>{log}</div>)
          ) : (
            <Typography sx={{ padding: 1 }}>No actions logged yet.</Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default DialogSandboxPage;
