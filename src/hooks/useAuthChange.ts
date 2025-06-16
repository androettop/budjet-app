import { onAuthStateChanged, type User } from "firebase/auth";
import { fbAuth } from "../helpers/firebase";
import { useEffect, useState } from "react";
import { EncryptedDB } from "../data/db";
import useStaticHandler from "./useStaticHandler";

export const useAuthChange = () => {
  const [userState, setUserState] = useState<User | null>(null);

  const handleUpdateUser = useStaticHandler((newUser: User | null) => {
    if (!EncryptedDB.isLocked() && userState?.uid !== newUser?.uid) {
      EncryptedDB.lock();
    }
    setUserState(newUser);
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fbAuth, (user) => {
      handleUpdateUser(user);
    });

    return () => unsubscribe();
  }, [handleUpdateUser]);

  return userState;
};
