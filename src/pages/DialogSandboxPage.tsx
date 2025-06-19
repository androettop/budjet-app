import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useDialog from "../hooks/useDialog";
import useStaticHandler from "../hooks/useStaticHandler";

const DialogSandboxPage = () => {
  const [actionsLog, setActionsLog] = useState<string[]>([]);
  const promptIdRef = useRef<string | null>(null);
  const dialogIdRef = useRef<string | null>(null);
  const dialog2IdRef = useRef<string | null>(null);
  const { addDialog, removeDialog, openDialog, dialogOn } = useDialog();

  useEffect(() => {
    const promptId = addDialog({
      title: "Sample Prompt",
      content: "This is a sample prompt content.",
      fields: [
        {
          label: "Name",
          type: "text",
          name: "name",
          defaultValue: "Pepito",
        },
        {
          label: "Email",
          type: "text",
          subtype: "email",
          name: "email",
          required: true,
        },
        {
          label: "City",
          name: "city",
          placeholder: "Select a city",
          type: "select",
          defaultValue: "NY",
          options: [
            {
              label: "New York",
              value: "NY",
            },
            {
              label: "Los Angeles",
              value: "LA",
            },
            {
              label: "Chicago",
              value: "CH",
            },
          ],
        },
      ],
      actions: [
        {
          label: "Cancel",
          color: "inherit",
          name: "cancel",
        },
        {
          label: "Reset",
          color: "inherit",
          name: "reset",
          closeDialog: false,
        },
        {
          label: "OK",
          color: "primary",
          name: "ok",
          validate: true,
        },
      ],
    });

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

    const dialog2Id = addDialog({
      title: "Dialog 2",
      content: "This is a dialog inside another dialog.",
      actions: [
        {
          label: "OK",
          color: "primary",
          name: "ok",
        },
      ],
    });

    dialogOn(promptId!, "ok", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'ok' executed in prompt 1 with data: ${JSON.stringify(formData)}`,
      ]);
    });

    dialogOn(promptId!, "cancel", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'cancel' executed in prompt 1 with data: ${JSON.stringify(formData)}`,
      ]);
    });

    dialogOn(dialogId!, "ok", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'ok' executed in dialog 1 with data: ${JSON.stringify(formData)}`,
      ]);
    });

    dialogOn(dialogId!, "cancel", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'cancel' executed in dialog 1 with data: ${JSON.stringify(formData)}`,
      ]);
    });

    dialogOn(dialog2Id, "ok", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'ok' executed in dialog 2 with data: ${JSON.stringify(formData)}`,
      ]);
    });

    dialogOn(dialog2Id, "cancel", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'cancel' executed in dialog 2 with data: ${JSON.stringify(formData)}`,
      ]);
    });

    dialogIdRef.current = dialogId;
    dialog2IdRef.current = dialog2Id;
    promptIdRef.current = promptId;

    return () => {
      removeDialog(dialogId);
      removeDialog(dialog2Id);
      removeDialog(promptId);
    };
  }, [addDialog, dialogOn, removeDialog]);

  const handleOpenDialog = useStaticHandler(() => {
    openDialog(dialogIdRef.current!);
  });

  const handleOpen2Dialogs = useStaticHandler(() => {
    openDialog(dialogIdRef.current!);
    openDialog(dialog2IdRef.current!);
  });

  const handleOpenPrompt = useStaticHandler(() => {
    openDialog(promptIdRef.current!);
  });

  return (
    <>
      <Card sx={{ fontFamily: "monospace" }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
            >
              Open Simple Dialog
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen2Dialogs}
            >
              Open 2 dialogs
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenPrompt}
            >
              Open Prompt Dialog
            </Button>
          </Box>
          <Typography variant="h5" sx={{ marginTop: 2 }}>
            Actions log:
          </Typography>

          {actionsLog.length > 0 ? (
            actionsLog.map((log) => <div key={log}>{log}</div>)
          ) : (
            <Typography sx={{ padding: 1 }}>No actions logged yet.</Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default DialogSandboxPage;
