export type SerializableObject = { [key: string]: Serializable };

export type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | SerializableObject;
