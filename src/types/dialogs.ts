export type DataDialogFormFieldOption = {
  label: string;
  value: string;
};

export type BaseDataDialogFormField = {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  validate?: (formData: unknown) => boolean;
};

export const textFieldTypes = [
  "text",
  "password",
  "email",
  "tel",
  "url",
  "number",
  "date",
  "time",
  "datetime-local",
  "color",
  "hidden",
] as const;

export type DataDialogTextField = BaseDataDialogFormField & {
  type: "text";
  subtype?: (typeof textFieldTypes)[number];
  pattern?: RegExp;
};

export type DataDialogSelectField = BaseDataDialogFormField & {
  type: "select";
  options: DataDialogFormFieldOption[];
};

export type DataDialogFormField = DataDialogTextField | DataDialogSelectField;

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
    callback: (formData: unknown) => void,
  ) => void;
};

export type DialogManagerEventHandler = {
  actionName: string;
  callback: (formData: unknown) => void;
};

export type DataDialogFormData = Record<string, string>;
