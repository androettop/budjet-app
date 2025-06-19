import type { DataDialogConfig } from "../../types/dialogs";

export const samplePromptDialog: DataDialogConfig = {
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
};

export const firstSampleDialog: DataDialogConfig = {
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

export const secondSampleDialog: DataDialogConfig = {
  title: "Dialog 2",
  content: "This is a dialog inside another dialog.",
  actions: [
    {
      label: "OK",
      color: "primary",
      name: "ok",
    },
  ],
};
