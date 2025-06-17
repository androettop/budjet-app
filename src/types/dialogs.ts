export type DataDialogFormFieldOption = {
  label: string;
  value: string;
};

export type DataDialogFormField = {
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: DataDialogFormFieldOption[];
  pattern?: RegExp;
  validate?: (formData: unknown) => boolean;
};

export type DataDialogAction = {
  name: string;
  label: string;
  color: "primary" | "inherit";
  validate?: boolean;
  closeDialog?: boolean;
};

export type DataDialogConfig = {
  title?: string;
  content?: string;
  fields?: DataDialogFormField[];
  actions: DataDialogAction[];
};

export type DialogManagerValue = {
  addDialog: (config: DataDialogConfig) => string;
  removeDialog: (id: string) => void;
  openDialog: (id: string) => void;
  closeDialog: (id: string) => void;
  isDialogOpen: (id: string) => boolean;
  dialogOn: (
    id: string,
    actionName: string,
    callback: (formData: unknown) => void
  ) => void;
};

export type DialogManagerEventHandler = {
  actionName: string;
  callback: (formData: unknown) => void;
};
