import { Button, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useDialog from "../hooks/useDialog";
import useStaticHandler from "../hooks/useStaticHandler";

const DialogSandboxPage = () => {
  const [actionsLog, setActionsLog] = useState<string[]>([]);
  const dialogIdRef = useRef<string | null>(null);
  const { addDialog, removeDialog, openDialog, dialogOn } = useDialog();

  useEffect(() => {
    const dialogId = addDialog({
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
    });

    dialogOn(dialogId!, "ok", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'ok' executed with data: ${JSON.stringify(formData)}`,
      ]);
    });

    dialogOn(dialogId!, "cancel", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'ok' executed with data: ${JSON.stringify(formData)}`,
      ]);
    });

    dialogIdRef.current = dialogId;

    return () => {
      removeDialog(dialogId);
    };
  }, [addDialog, dialogOn, removeDialog]);

  const handleOpenDialog = useStaticHandler(() => {
    openDialog(dialogIdRef.current!);
  });

  return (
    <>
      <Card sx={{ fontFamily: "monospace" }}>
        <CardContent>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
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
