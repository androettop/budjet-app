import { onAuthStateChanged, type User } from "firebase/auth";
import { fbAuth } from "../helpers/firebase";
import { useEffect, useState } from "react";
import { EncryptedDB } from "../data/db";
import useStaticHandler from "./useStaticHandler";

export const useAuthChange = () => {
  const [userState, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleUpdateUser = useStaticHandler(async (newUser: User | null) => {
    if (
      !EncryptedDB.isLocked() &&
      (userState?.uid !== newUser?.uid || !newUser?.uid) &&
      !isLoading
    ) {
      EncryptedDB.lock();
    }

    if (newUser?.uid) {
      await EncryptedDB.unlockFromSession(newUser?.uid);
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

  return { user: userState, isLoading };
};
