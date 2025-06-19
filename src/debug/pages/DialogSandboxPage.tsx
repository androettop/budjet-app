import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useDialog from "../../hooks/useDialog";
import useStaticHandler from "../../hooks/useStaticHandler";
import {
  firstSampleDialog,
  samplePromptDialog,
  secondSampleDialog,
} from "../utils/dialogs";

const DialogSandboxPage = () => {
  const [actionsLog, setActionsLog] = useState<string[]>([]);

  const { open: openPrompt, on: promptOn } = useDialog(samplePromptDialog);
  const { open: openDialog1, on: dialog1On } = useDialog(firstSampleDialog);
  const { open: openDialog2, on: dialog2On } = useDialog(secondSampleDialog);

  useEffect(() => {
    promptOn("ok", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'ok' executed in prompt 1 with data: ${JSON.stringify(formData)}`,
      ]);
    });

    promptOn("cancel", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'cancel' executed in prompt 1 with data: ${JSON.stringify(formData)}`,
      ]);
    });

    promptOn("reset", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'reset' executed in prompt 1 with data: ${JSON.stringify(formData)}`,
      ]);
    });

    dialog1On("ok", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'ok' executed in dialog 1 with data: ${JSON.stringify(formData)}`,
      ]);
    });

    dialog1On("cancel", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'cancel' executed in dialog 1 with data: ${JSON.stringify(formData)}`,
      ]);
    });

    dialog2On("ok", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'ok' executed in dialog 2 with data: ${JSON.stringify(formData)}`,
      ]);
    });

    dialog2On("cancel", (formData) => {
      setActionsLog((prev) => [
        ...prev,
        `Action 'cancel' executed in dialog 2 with data: ${JSON.stringify(formData)}`,
      ]);
    });
  }, [dialog1On, dialog2On, promptOn]);

  const handleOpenDialog = useStaticHandler(() => {
    openDialog1();
  });

  const handleOpen2Dialogs = useStaticHandler(() => {
    openDialog1();
    openDialog2();
  });

  const handleOpenPrompt = useStaticHandler(() => {
    openPrompt();
  });

  return (
    <>
      <Card>
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
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "monospace",
            }}
          >
            {actionsLog.length > 0
              ? actionsLog.join("\n")
              : "No actions logged yet."}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default DialogSandboxPage;
