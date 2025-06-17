// define all error codes (without enum)

export const errorCodes = {
  GENERIC_ERROR: "GENERIC_ERROR",
  AUTH_INFO_NOT_INITIALIZED: "AUTH_INFO_NOT_INITIALIZED",
  INVALID_MASTER_PASSWORD: "INVALID_MASTER_PASSWORD",
  DB_IS_LOCKED: "DB_IS_LOCKED",
  DOC_NOT_FOUND: "DOC_NOT_FOUND",
  DIALOG_MANAGER_NOT_INITIALIZED: "DIALOG_MANAGER_NOT_INITIALIZED",
} as const;

export type ErrorCode = keyof typeof errorCodes;

export class CodedError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode) {
    super(code);
    this.name = "CodedError";
    this.code = code;
  }
}
