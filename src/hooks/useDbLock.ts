import { useEffect, useMemo, useState } from "react";
import { EncryptedDB } from "../data/db";
import { useUserData } from "./useUserData";
import useStaticHandler from "./useStaticHandler";
import useDialog from "./useDialog";
import {
  invalidPasswordDialogConfig,
  unlockDBDialogConfig,
} from "../dialogs/db";
import { errorCodes, type CodedError } from "../helpers/errors";

export function useDbLock(intervalMs = 1000) {
  const enterKeyDialog = useDialog<{ password: string }>(unlockDBDialogConfig);
  const invalidPasswordDialog = useDialog(invalidPasswordDialogConfig);

  const [isDbLocked, setIsDbLocked] = useState(() => EncryptedDB.isLocked());
  const user = useUserData();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsDbLocked(EncryptedDB.isLocked());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  const handleLock = useStaticHandler(() => {
    EncryptedDB.lock();
    setIsDbLocked(true);
  });

  const handleUnlock = useStaticHandler(async () => {
    if (user?.uid) {
      try {
        await EncryptedDB.unlock(user?.uid, async () => {
          return new Promise((resolve) => {
            enterKeyDialog.open();
            enterKeyDialog.on("unlock", ({ password }) => {
              enterKeyDialog.off("unlock");
              resolve(password);
            });
          });
        });
        setIsDbLocked(false);
      } catch (error) {
        const errorCode = (error as CodedError).code;
        if (errorCode === errorCodes.INVALID_MASTER_PASSWORD) {
          // TODO: Show error message to user and retry
          invalidPasswordDialog.open();
          invalidPasswordDialog.on("retry", () => {
            handleUnlock();
          });
        }
      }
    }
  });

  return useMemo(
    () => ({ isDbLocked, lockDb: handleLock, unlockDb: handleUnlock }),
    [isDbLocked, handleLock, handleUnlock],
  );
}

export default useDbLock;
