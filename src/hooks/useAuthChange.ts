import { onAuthStateChanged, type User } from "firebase/auth";
import { fbAuth } from "../helpers/firebase";
import { useEffect, useMemo, useState } from "react";
import { EncryptedDB } from "../data/db";
import useStaticHandler from "./useStaticHandler";
import useDbLock from "./useDbLock";

export const useAuthChange = () => {
  const [userState, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { unlockDb } = useDbLock();

  const handleUpdateUser = useStaticHandler(async (newUser: User | null) => {
    if (
      !EncryptedDB.isLocked() &&
      (userState?.uid !== newUser?.uid || !newUser?.uid) &&
      !isLoading
    ) {
      EncryptedDB.lock();
    }

    if (userState?.uid !== newUser?.uid && newUser?.uid) {
      if (EncryptedDB.isKeyInSession()) {
        await EncryptedDB.unlockFromSession(newUser?.uid);
      } else {
        // Open the unlock dialog after the user is ready
        unlockDb(newUser?.uid);
      }
    }

    setUserState(newUser);
    setIsLoading(false);
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fbAuth, (user) => {
      handleUpdateUser(user);
    });

    return () => unsubscribe();
  }, [handleUpdateUser]);

  return useMemo(
    () => ({ user: userState, isLoading }),
    [userState, isLoading],
  );
};
