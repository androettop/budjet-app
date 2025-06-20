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
  autoFocus?: boolean;
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
  resetForm?: boolean;
};

export type DataDialogConfig = {
  title?: string;
  content?: string;
  fields?: DataDialogFormField[];
  actions: DataDialogAction[];
};

export type DialogActionCallback<T = Record<string, string>> = (
  formData: T,
) => void;

export type DialogManagerValue<FormDataType = unknown> = {
  addDialog: (config: DataDialogConfig) => string;
  removeDialog: (id: string) => void;
  openDialog: (id: string) => void;
  closeDialog: (id: string) => void;
  dialogOn: (
    id: string,
    actionName: string,
    callback: DialogActionCallback<FormDataType>,
  ) => void;
  dialogOff: (id: string, actionName: string) => void;
  openDialogs: string[];
};

export type DataDialogFormData = Record<string, string>;
