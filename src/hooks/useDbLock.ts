import { useEffect, useMemo, useState } from "react";
import { EncryptedDB } from "../data/db";
import { useUserData } from "./useUserData";
import useStaticHandler from "./useStaticHandler";

export function useDbLock(intervalMs = 1000) {
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

  const handleUnlock = useStaticHandler(() => {
    if (user?.uid) {
      EncryptedDB.unlock(user?.uid, async () => {
        return new Promise((resolve) => {
          while (true) {
            const masterPassword = window
              .prompt("Write your master password")
              ?.trim();
            if (masterPassword) {
              resolve(masterPassword);
              break;
            }
          }
        });
      });
      setIsDbLocked(false);
    }
  });

  return useMemo(
    () => ({ isDbLocked, lockDb: handleLock, unlockDb: handleUnlock }),
    [isDbLocked, handleLock, handleUnlock],
  );
}

export default useDbLock;
