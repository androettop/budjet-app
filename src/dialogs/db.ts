import type { DataDialogConfig } from "../types/dialogs";

export const unlockDBDialogConfig: DataDialogConfig = {
  title: "Unlock Database",
  content: "Please enter your master password",
  actions: [
    {
      color: "inherit",
      label: "Cancel",
      name: "cancel",
    },
    {
      color: "primary",
      label: "Unlock",
      name: "unlock",
      validate: true,
    },
  ],
  fields: [
    {
      name: "password",
      label: "Password",
      type: "text",
      subtype: "password",
      required: true,
      placeholder: "Enter your password",
    },
  ],
};

export const invalidPasswordDialogConfig: DataDialogConfig = {
  title: "Invalid Password",
  content: "The password you entered is incorrect",
  actions: [
    {
      color: "inherit",
      label: "Cancel",
      name: "cancel",
    },
    {
      color: "primary",
      label: "Try Again",
      name: "retry",
    },
  ],
};
