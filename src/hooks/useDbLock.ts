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

export function useDbLock() {
  const enterKeyDialog = useDialog<{ password: string }>(unlockDBDialogConfig);
  const invalidPasswordDialog = useDialog(invalidPasswordDialogConfig);

  const [isDbLocked, setIsDbLocked] = useState(() => EncryptedDB.isLocked());
  const [isLoading, setIsLoading] = useState(false);
  const user = useUserData();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsDbLocked(EncryptedDB.isLocked());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLock = useStaticHandler(() => {
    EncryptedDB.lock();
    setIsDbLocked(true);
  });

  const handleUnlock = useStaticHandler(
    async (userId: string | undefined = user?.uid) => {
      setIsLoading(true);
      if (userId) {
        try {
          await EncryptedDB.unlock(userId, async () => {
            return new Promise((resolve, reject) => {
              enterKeyDialog.open();
              enterKeyDialog.on("unlock", ({ password }) => {
                enterKeyDialog.off("unlock");
                resolve(password);
              });
              enterKeyDialog.on("cancel", () => {
                enterKeyDialog.off("cancel");
                reject("cancel");
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
      setIsLoading(false);
    },
  );

  return useMemo(
    () => ({
      isDbLocked,
      lockDb: handleLock,
      unlockDb: handleUnlock,
      isUnlocking: isLoading,
    }),
    [isDbLocked, handleLock, handleUnlock, isLoading],
  );
}

export default useDbLock;
