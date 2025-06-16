export type DataDialogFormField = {
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  pattern?: RegExp;
  validate?: (formData: unknown) => boolean;
};

export type DataDialogAction = {
  name: string;
  label: string;
  color: "primary" | "inherit";
  validate?: boolean;
};

export type DataDialogConfig = {
  title?: string;
  content?: string;
  fields?: DataDialogFormField[];
  actions: DataDialogAction[];
};
